/**
 * Stripe Connect Subscriptions API
 * ==================================
 *
 * This endpoint handles creating subscription checkout sessions for connected
 * accounts. This allows the platform to charge subscription fees to connected
 * accounts (e.g., monthly platform fees, premium features).
 *
 * ENDPOINT:
 * - POST /api/stripe/connect/subscriptions - Create subscription checkout
 * - GET /api/stripe/connect/subscriptions?accountId=acct_xxx - Get subscription status
 *
 * V2 ACCOUNTS AND SUBSCRIPTIONS:
 * With V2 accounts, you can use the same ID (acct_xxx) for both:
 * - customer_account: Identifying who is being charged
 * - The connected account itself
 *
 * This simplifies the subscription model as you don't need to create
 * separate customer objects for connected accounts.
 *
 * SUBSCRIPTION FLOW:
 * 1. Connected account clicks "Subscribe" on their dashboard
 * 2. Platform creates a subscription checkout session (this endpoint)
 * 3. Connected account completes payment on Stripe checkout
 * 4. Platform updates account status via webhooks
 */

import { NextRequest, NextResponse } from 'next/server';
import stripeClient, { getBaseUrl, getPlatformPriceId } from '@/lib/stripe';
import { safePath } from '@/lib/safe-redirect';
import { requireAccountOwner, isAuthError } from '@/lib/connect-auth';
import { isRateLimited, getClientIp } from '@/lib/rate-limit';

// =============================================================================
// POST - Create Subscription Checkout for Connected Account
// =============================================================================

/**
 * Creates a Checkout Session for subscribing a connected account
 *
 * Request body:
 * {
 *   accountId: string;        // The connected account ID (acct_xxx)
 *   priceId?: string;         // Override the default platform price
 *   successPath?: string;     // Path for success redirect
 *   cancelPath?: string;      // Path for cancel redirect
 * }
 *
 * Returns:
 * {
 *   success: boolean;
 *   sessionId: string;
 *   url: string;              // URL to redirect for checkout
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);
    if (isRateLimited(`connect-subs-post:${ip}`, 5, 60_000)) {
      return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
    }

    const body = await request.json();
    const { accountId, priceId } = body;
    const successPath = safePath(body.successPath, '/connect/dashboard');
    const cancelPath = safePath(body.cancelPath, '/connect/dashboard');

    // Validate required fields
    if (!accountId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required field: accountId',
        },
        { status: 400 }
      );
    }

    // Validate account ID format
    if (!accountId.startsWith('acct_')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid account ID format',
        },
        { status: 400 }
      );
    }

    // Require authenticated user who owns this account
    const auth = await requireAccountOwner(request, accountId);
    if (isAuthError(auth)) return auth;

    const baseUrl = getBaseUrl();

    // Use provided priceId or get the platform's default subscription price
    const subscriptionPriceId = priceId || getPlatformPriceId();

    /**
     * Create a Subscription Checkout Session
     *
     * KEY DIFFERENCE FROM REGULAR CHECKOUT:
     * - customer_account: Uses the connected account ID directly
     * - mode: 'subscription' instead of 'payment'
     *
     * With V2 accounts, the connected account ID (acct_xxx) can be used
     * as the customer_account, eliminating the need to create separate
     * customer objects for billing connected accounts.
     */
    const session = await stripeClient.checkout.sessions.create({
      // Use the connected account ID as the customer_account
      // This is a V2 accounts feature - the account pays for the subscription
      customer_account: accountId,

      // Subscription mode for recurring payments
      mode: 'subscription',

      // Line items - the subscription price(s)
      line_items: [
        {
          // The platform's subscription price ID
          // Create this in your Stripe Dashboard > Products
          price: subscriptionPriceId,
          quantity: 1,
        },
      ],

      // Success URL after subscription is created
      // Include session_id for verification
      success_url: `${baseUrl}${successPath}?subscription=success&session_id={CHECKOUT_SESSION_ID}`,

      // Cancel URL if they abandon checkout
      cancel_url: `${baseUrl}${cancelPath}?subscription=cancelled`,
    });

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      message: 'Subscription checkout created. Redirect the user to complete subscription.',
    });
  } catch (error) {
    console.error('Error creating subscription checkout:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create subscription checkout',
      },
      { status: 500 }
    );
  }
}

// =============================================================================
// GET - Get Subscription Status for Connected Account
// =============================================================================

/**
 * Retrieves subscription status for a connected account
 *
 * Query parameters:
 * - accountId: string (required) - The connected account ID
 *
 * NOTE: With V2 accounts, we search for subscriptions where
 * customer_account matches the connected account ID.
 *
 * Returns:
 * {
 *   success: boolean;
 *   hasActiveSubscription: boolean;
 *   subscription: { ... } | null;
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);
    if (isRateLimited(`connect-subs-get:${ip}`, 20, 60_000)) {
      return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
    }

    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');

    if (!accountId || typeof accountId !== 'string' || !accountId.startsWith('acct_')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing or invalid required parameter: accountId',
        },
        { status: 400 }
      );
    }

    // Require authenticated user who owns this account
    const auth = await requireAccountOwner(request, accountId);
    if (isAuthError(auth)) return auth;

    // Sanitize accountId for Stripe search query (allow only alphanumeric + underscore)
    const safeAccountId = accountId.replace(/[^a-zA-Z0-9_]/g, '');

    /**
     * List subscriptions for the connected account
     *
     * With V2 accounts, subscriptions are tied to the account ID
     * via the customer_account field.
     *
     * Note: You may need to use the correct API method depending on
     * how V2 account subscriptions are queried. This example uses
     * a search approach.
     */
    const subscriptions = await stripeClient.subscriptions.search({
      query: `metadata["account_id"]:"${safeAccountId}"`,
      limit: 1,
    });

    // If search doesn't work, you might need to store subscription IDs
    // in your database when they're created via webhooks

    const activeSubscription = subscriptions.data.find(
      (sub) => sub.status === 'active' || sub.status === 'trialing'
    );

    if (activeSubscription) {
      // Cast to access properties that may vary in type definitions
      const sub = activeSubscription as unknown as {
        id: string;
        status: string;
        current_period_end?: number;
        cancel_at_period_end?: boolean;
        items: { data: Array<{ price?: { id?: string } }> };
      };

      return NextResponse.json({
        success: true,
        hasActiveSubscription: true,
        subscription: {
          id: sub.id,
          status: sub.status,
          currentPeriodEnd: sub.current_period_end,
          cancelAtPeriodEnd: sub.cancel_at_period_end,
          priceId: sub.items.data[0]?.price?.id,
        },
      });
    }

    /**
     * TODO: In production, query your database for subscription status
     *
     * Example:
     * const userRecord = await db.collection('users')
     *   .where('stripeAccountId', '==', accountId)
     *   .get();
     * const subscriptionStatus = userRecord.data().subscriptionStatus;
     */

    return NextResponse.json({
      success: true,
      hasActiveSubscription: false,
      subscription: null,
      message: 'No active subscription found for this account',
    });
  } catch (error) {
    console.error('Error getting subscription status:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to get subscription status',
      },
      { status: 500 }
    );
  }
}
