/**
 * Stripe Connect Checkout API
 * ============================
 *
 * This endpoint creates Checkout Sessions for purchasing products from
 * connected accounts using Direct Charges with application fees.
 *
 * ENDPOINT:
 * - POST /api/stripe/connect/checkout - Create a checkout session
 *
 * DIRECT CHARGES:
 * With direct charges, the payment is processed directly on the connected
 * account. The platform earns money through an application_fee_amount that
 * is deducted from the payment before it reaches the connected account.
 *
 * CHECKOUT FLOW:
 * 1. Customer selects a product from the storefront
 * 2. Platform creates a checkout session (this endpoint)
 * 3. Customer is redirected to Stripe's hosted checkout page
 * 4. After payment, customer is redirected to success_url
 * 5. Platform can verify the payment via webhooks or session retrieval
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import stripeClient, { getBaseUrl } from '@/lib/stripe';

// =============================================================================
// POST - Create a Checkout Session for a Connected Account
// =============================================================================

/**
 * Creates a Stripe Checkout Session for purchasing a product
 *
 * Request body:
 * {
 *   accountId: string;             // Connected account ID (acct_xxx)
 *   priceId?: string;              // Price ID if using existing price
 *   productName?: string;          // Product name if creating inline
 *   priceInCents?: number;         // Price in cents if creating inline
 *   quantity?: number;             // Quantity (default: 1)
 *   applicationFeePercent?: number; // Platform fee as percentage (default: 10)
 *   successPath?: string;          // Path for success redirect
 *   cancelPath?: string;           // Path for cancel redirect
 * }
 *
 * You can either provide a priceId (for existing products) or
 * provide productName + priceInCents (for one-time purchases).
 *
 * Returns:
 * {
 *   success: boolean;
 *   sessionId: string;
 *   url: string;         // URL to redirect customer to checkout
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      accountId,
      priceId,
      productName,
      priceInCents,
      quantity = 1,
      applicationFeePercent = 10,
      successPath = '/connect/success',
      cancelPath = '/connect/storefront',
      currency = 'usd',
    } = body;

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

    // Must have either priceId or product details
    if (!priceId && (!productName || !priceInCents)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Must provide either priceId or both productName and priceInCents',
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

    const baseUrl = getBaseUrl();

    /**
     * Build the line_items array for the checkout session
     *
     * If a priceId is provided, we use it directly.
     * Otherwise, we create a price inline using price_data.
     */
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = priceId
      ? [
          {
            // Use existing price from connected account
            price: priceId,
            quantity: quantity,
          },
        ]
      : [
          {
            // Create price inline for one-time purchases
            price_data: {
              currency: currency.toLowerCase(),
              unit_amount: priceInCents,
              product_data: {
                name: productName,
              },
            },
            quantity: quantity,
          },
        ];

    /**
     * Calculate the application fee
     *
     * The application_fee_amount is the amount (in cents) that goes to
     * the platform. The rest goes to the connected account.
     *
     * Example: For a $100 purchase with 10% fee:
     * - Customer pays: $100
     * - Connected account receives: $90
     * - Platform receives: $10 (minus Stripe fees)
     */
    const totalAmount = priceInCents ? priceInCents * quantity : 0;
    const applicationFeeAmount = Math.round(totalAmount * (applicationFeePercent / 100));

    /**
     * Create the Checkout Session using Direct Charges
     *
     * Key points:
     * 1. stripeAccount option: Creates the session on the connected account
     * 2. application_fee_amount: Platform's cut of the transaction
     * 3. mode: 'payment' for one-time purchases
     * 4. success_url: Include {CHECKOUT_SESSION_ID} to verify the session
     */
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      // Line items (products) to purchase
      line_items: lineItems,

      // Payment mode: 'payment' for one-time, 'subscription' for recurring
      mode: 'payment',

      // URL to redirect after successful payment
      // {CHECKOUT_SESSION_ID} is replaced by Stripe with the actual session ID
      success_url: `${baseUrl}${successPath}?session_id={CHECKOUT_SESSION_ID}&account_id=${accountId}`,

      // URL to redirect if customer cancels
      cancel_url: `${baseUrl}${cancelPath}/${accountId}`,
    };

    // Only add payment_intent_data with application_fee if we have a calculated fee
    // For priceId-based checkouts, we need to calculate the fee differently
    if (applicationFeeAmount > 0) {
      sessionParams.payment_intent_data = {
        // Application fee that goes to the platform
        // This is deducted from the payment before it reaches the connected account
        application_fee_amount: applicationFeeAmount,
      };
    }

    const session = await stripeClient.checkout.sessions.create(
      sessionParams,
      {
        // IMPORTANT: This creates the checkout on the connected account
        // The customer pays the connected account directly
        stripeAccount: accountId,
      }
    );

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      message: 'Checkout session created. Redirect the customer to the URL to complete payment.',
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);

    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create checkout session',
      },
      { status: 500 }
    );
  }
}

// =============================================================================
// GET - Retrieve Checkout Session Details
// =============================================================================

/**
 * Retrieves details of a completed checkout session
 *
 * Query parameters:
 * - sessionId: string (required) - The checkout session ID
 * - accountId: string (required) - The connected account ID
 *
 * Use this after the customer returns from checkout to verify the payment.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const accountId = searchParams.get('accountId');

    if (!sessionId || !accountId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required parameters: sessionId and accountId',
        },
        { status: 400 }
      );
    }

    /**
     * Retrieve the checkout session from the connected account
     *
     * This allows you to verify the payment status and get details
     * about the customer and their purchase.
     */
    const session = await stripeClient.checkout.sessions.retrieve(
      sessionId,
      {
        // Expand line_items to see what was purchased
        expand: ['line_items', 'payment_intent'],
      },
      {
        // Retrieve from the connected account
        stripeAccount: accountId,
      }
    );

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        status: session.status,
        paymentStatus: session.payment_status,
        customerEmail: session.customer_details?.email,
        amountTotal: session.amount_total,
        currency: session.currency,
        lineItems: session.line_items?.data.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          amountTotal: item.amount_total,
        })),
      },
    });
  } catch (error) {
    console.error('Error retrieving checkout session:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve session',
      },
      { status: 500 }
    );
  }
}
