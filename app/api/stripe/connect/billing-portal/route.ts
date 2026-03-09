/**
 * Stripe Billing Portal API
 * ==========================
 *
 * This endpoint creates Billing Portal sessions for connected accounts.
 * The Billing Portal is a Stripe-hosted page where users can:
 * - View and manage their subscriptions
 * - Update payment methods
 * - View invoice history
 * - Cancel or upgrade subscriptions
 *
 * ENDPOINT:
 * - POST /api/stripe/connect/billing-portal - Create a billing portal session
 *
 * PORTAL CONFIGURATION:
 * You can customize the billing portal in the Stripe Dashboard:
 * Dashboard > Settings > Billing > Customer portal
 *
 * Options include:
 * - Allow subscription cancellation
 * - Allow plan switching
 * - Show invoice history
 * - Allow payment method updates
 */

import { NextRequest, NextResponse } from 'next/server';
import stripeClient, { getBaseUrl } from '@/lib/stripe';
import { safePath } from '@/lib/safe-redirect';
import { requireAccountOwner, isAuthError } from '@/lib/connect-auth';
import { isRateLimited, getClientIp } from '@/lib/rate-limit';

// =============================================================================
// POST - Create Billing Portal Session
// =============================================================================

/**
 * Creates a Stripe Billing Portal session for a connected account
 *
 * Request body:
 * {
 *   accountId: string;        // The connected account ID (acct_xxx)
 *   returnPath?: string;      // Path to return to after portal (default: '/connect/dashboard')
 * }
 *
 * Returns:
 * {
 *   success: boolean;
 *   url: string;              // URL to redirect user to billing portal
 * }
 *
 * NOTE: With V2 accounts, the connected account ID is used directly
 * as the customer_account parameter.
 */
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);
    if (isRateLimited(`connect-portal:${ip}`, 10, 60_000)) {
      return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
    }

    const body = await request.json();
    const { accountId } = body;
    const returnPath = safePath(body.returnPath, '/connect/dashboard');

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

    /**
     * Create a Billing Portal Session
     *
     * For V2 accounts, we use customer_account instead of customer.
     * This allows the connected account to manage their platform
     * subscription through the Stripe-hosted portal.
     *
     * The portal provides a complete self-service experience:
     * - Update payment methods
     * - View invoices
     * - Cancel subscriptions
     * - Switch plans (if configured)
     */
    const session = await stripeClient.billingPortal.sessions.create({
      // Use connected account ID as the customer_account
      // This is specific to V2 accounts
      customer_account: accountId,

      // URL to return to after leaving the portal
      return_url: `${baseUrl}${returnPath}`,
    });

    return NextResponse.json({
      success: true,
      url: session.url,
      message: 'Billing portal session created. Redirect the user to manage their subscription.',
    });
  } catch (error) {
    console.error('Error creating billing portal session:', error);

    // Handle common errors
    if (error instanceof Error) {
      // No subscription found
      if (error.message.includes('no subscription')) {
        return NextResponse.json(
          {
            success: false,
            error: 'No active subscription found. The user must subscribe first.',
          },
          { status: 400 }
        );
      }

      // No payment methods
      if (error.message.includes('payment method')) {
        return NextResponse.json(
          {
            success: false,
            error: 'No payment method on file. The user must complete a subscription checkout first.',
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to create billing portal session',
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create billing portal session',
      },
      { status: 500 }
    );
  }
}
