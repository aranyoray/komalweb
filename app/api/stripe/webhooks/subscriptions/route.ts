/**
 * Stripe Subscription Webhooks Handler
 * =====================================
 *
 * This endpoint handles standard (V1) webhook events for subscriptions.
 * These events notify your application when:
 * - Subscriptions are created, updated, or cancelled
 * - Invoices are paid or fail
 * - Payment methods are added or removed
 *
 * ENDPOINT:
 * - POST /api/stripe/webhooks/subscriptions - Receive subscription events
 *
 * IMPORTANT: These are NOT thin events. They use the standard webhook
 * format with full event data included in the payload.
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to Stripe Dashboard > Developers > Webhooks
 * 2. Click "+ Add endpoint"
 * 3. Set the endpoint URL to: https://your-domain.com/api/stripe/webhooks/subscriptions
 * 4. Select the following events:
 *    - customer.subscription.created
 *    - customer.subscription.updated
 *    - customer.subscription.deleted
 *    - invoice.paid
 *    - invoice.payment_failed
 *    - payment_method.attached
 *    - payment_method.detached
 *    - customer.updated
 *    - customer.tax_id.created/updated/deleted
 *    - billing_portal.session.created
 * 5. Copy the signing secret to STRIPE_WEBHOOK_SECRET
 *
 * LOCAL TESTING:
 * stripe listen --forward-to http://localhost:3001/api/stripe/webhooks/subscriptions
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import stripeClient, { getWebhookSecret } from '@/lib/stripe';

// =============================================================================
// POST - Handle Subscription Webhook Events
// =============================================================================

export async function POST(request: NextRequest) {
  try {
    // Get the raw body for signature verification
    const body = await request.text();

    // Get the Stripe signature header
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('Missing stripe-signature header');
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Get the webhook secret
    const webhookSecret = getWebhookSecret();

    /**
     * Verify the webhook signature and construct the event
     *
     * This ensures the webhook was sent by Stripe and hasn't been tampered with.
     */
    let event: Stripe.Event;
    try {
      event = stripeClient.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    console.log(`Received event: ${event.type} (${event.id})`);

    // Handle different event types
    switch (event.type) {
      // =======================================================================
      // Subscription Events
      // =======================================================================

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      // =======================================================================
      // Invoice Events
      // =======================================================================

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      // =======================================================================
      // Payment Method Events
      // =======================================================================

      case 'payment_method.attached':
        await handlePaymentMethodAttached(event.data.object as Stripe.PaymentMethod);
        break;

      case 'payment_method.detached':
        await handlePaymentMethodDetached(event.data.object as Stripe.PaymentMethod);
        break;

      // =======================================================================
      // Customer Events
      // =======================================================================

      case 'customer.updated':
        await handleCustomerUpdated(event.data.object as Stripe.Customer);
        break;

      // =======================================================================
      // Tax ID Events
      // =======================================================================

      case 'customer.tax_id.created':
      case 'customer.tax_id.updated':
      case 'customer.tax_id.deleted':
        await handleTaxIdEvent(event.type, event.data.object as Stripe.TaxId);
        break;

      // =======================================================================
      // Billing Portal Events
      // =======================================================================

      case 'billing_portal.session.created':
        await handleBillingPortalSessionCreated(event.data.object as Stripe.BillingPortal.Session);
        break;

      case 'billing_portal.configuration.created':
      case 'billing_portal.configuration.updated':
        console.log(`Billing portal configuration event: ${event.type}`);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return 200 to acknowledge receipt
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler error' },
      { status: 500 }
    );
  }
}

// =============================================================================
// Subscription Event Handlers
// =============================================================================

/**
 * Handle subscription created event
 *
 * Triggered when a new subscription is created.
 * This could be from:
 * - Checkout session completion
 * - API subscription creation
 * - Customer portal upgrade
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log(`Subscription created: ${subscription.id}`);

  /**
   * IMPORTANT: For V2 accounts, get the account ID from customer_account
   * instead of customer
   *
   * const accountId = subscription.customer_account;
   */
  const accountId = (subscription as unknown as { customer_account?: string }).customer_account;
  const priceId = subscription.items.data[0]?.price?.id;
  const status = subscription.status;

  console.log(`Account: ${accountId}, Price: ${priceId}, Status: ${status}`);

  /**
   * TODO: Update your database with the subscription status
   *
   * Example:
   * await db.collection('users').doc(userId).update({
   *   subscriptionId: subscription.id,
   *   subscriptionStatus: status,
   *   subscriptionPriceId: priceId,
   *   subscriptionStartDate: new Date(subscription.start_date * 1000),
   *   subscriptionCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
   * });
   */
}

/**
 * Handle subscription updated event
 *
 * This is triggered for many subscription changes:
 * - Plan upgrades/downgrades
 * - Quantity changes
 * - Cancellation scheduled
 * - Trial ended
 * - Paused/resumed
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log(`Subscription updated: ${subscription.id}`);

  const accountId = (subscription as unknown as { customer_account?: string }).customer_account;
  const status = subscription.status;
  const cancelAtPeriodEnd = subscription.cancel_at_period_end;
  const priceId = subscription.items.data[0]?.price?.id;
  const quantity = subscription.items.data[0]?.quantity;

  console.log(`Account: ${accountId}, Status: ${status}, Cancel at period end: ${cancelAtPeriodEnd}`);

  // Check for plan changes
  const previousAttributes = (subscription as unknown as { previous_attributes?: Record<string, unknown> }).previous_attributes;
  if (previousAttributes?.items) {
    console.log('Plan change detected');
    // Handle upgrade/downgrade logic
  }

  // Check for cancellation scheduling
  if (cancelAtPeriodEnd) {
    console.log('Subscription will cancel at period end');
    /**
     * TODO: Update database and optionally notify user
     *
     * await db.collection('users').doc(userId).update({
     *   subscriptionCancelling: true,
     *   subscriptionEndsAt: new Date(subscription.current_period_end * 1000),
     * });
     */
  }

  // Check for reactivation (user un-cancelled)
  if (previousAttributes && 'cancel_at_period_end' in previousAttributes && !cancelAtPeriodEnd) {
    console.log('Subscription reactivated');
    /**
     * TODO: Update database
     *
     * await db.collection('users').doc(userId).update({
     *   subscriptionCancelling: false,
     *   subscriptionEndsAt: null,
     * });
     */
  }

  // Check for paused collections
  const pauseCollection = subscription.pause_collection;
  if (pauseCollection) {
    console.log(`Subscription collection paused, resumes at: ${pauseCollection.resumes_at}`);
  }

  /**
   * TODO: Update database with current status
   *
   * await db.collection('users').doc(userId).update({
   *   subscriptionStatus: status,
   *   subscriptionPriceId: priceId,
   *   subscriptionQuantity: quantity,
   *   subscriptionCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
   * });
   */
}

/**
 * Handle subscription deleted event
 *
 * Triggered when a subscription is cancelled.
 * This could be:
 * - Immediate cancellation
 * - End of period cancellation
 * - Cancelled due to payment failure
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log(`Subscription deleted: ${subscription.id}`);

  const accountId = (subscription as unknown as { customer_account?: string }).customer_account;

  console.log(`Account: ${accountId}`);

  /**
   * TODO: Revoke access and update database
   *
   * This is where you should:
   * 1. Revoke access to premium features
   * 2. Update the user's subscription status in your database
   * 3. Optionally send a "sorry to see you go" email
   *
   * await db.collection('users').doc(userId).update({
   *   subscriptionId: null,
   *   subscriptionStatus: 'cancelled',
   *   subscriptionPriceId: null,
   *   premiumAccess: false,
   * });
   *
   * await sendEmail({
   *   to: userEmail,
   *   template: 'subscription_cancelled',
   * });
   */
}

// =============================================================================
// Invoice Event Handlers
// =============================================================================

/**
 * Handle invoice paid event
 *
 * Triggered when an invoice is successfully paid.
 * This confirms that the subscription payment went through.
 */
async function handleInvoicePaid(invoice: Stripe.Invoice) {
  console.log(`Invoice paid: ${invoice.id}`);

  // Cast invoice to access properties that may vary in SDK type definitions
  const invoiceData = invoice as unknown as {
    customer_account?: string;
    amount_paid: number;
    subscription?: string;
    currency: string;
  };

  const accountId = invoiceData.customer_account;
  const amountPaid = invoiceData.amount_paid;
  const subscriptionId = invoiceData.subscription;

  console.log(`Account: ${accountId}, Amount: ${amountPaid}, Subscription: ${subscriptionId}`);

  /**
   * TODO: Record the payment in your database
   *
   * await db.collection('payments').add({
   *   invoiceId: invoice.id,
   *   accountId: accountId,
   *   amount: amountPaid,
   *   currency: invoiceData.currency,
   *   paidAt: new Date(),
   *   subscriptionId: subscriptionId,
   * });
   *
   * // Ensure access is granted
   * await db.collection('users').doc(userId).update({
   *   premiumAccess: true,
   *   lastPaymentDate: new Date(),
   * });
   */
}

/**
 * Handle invoice payment failed event
 *
 * Triggered when a payment attempt fails.
 * Stripe will retry automatically based on your settings.
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log(`Invoice payment failed: ${invoice.id}`);

  // Cast invoice to access properties that may vary in SDK type definitions
  const invoiceData = invoice as unknown as {
    customer_account?: string;
    attempt_count?: number;
    next_payment_attempt?: number | null;
    amount_due: number;
  };

  const accountId = invoiceData.customer_account;
  const attemptCount = invoiceData.attempt_count;
  const nextAttempt = invoiceData.next_payment_attempt;

  console.log(`Account: ${accountId}, Attempt: ${attemptCount}, Next attempt: ${nextAttempt}`);

  /**
   * TODO: Notify the user about the failed payment
   *
   * await sendEmail({
   *   to: userEmail,
   *   template: 'payment_failed',
   *   data: {
   *     amount: invoiceData.amount_due,
   *     nextAttempt: nextAttempt ? new Date(nextAttempt * 1000) : null,
   *   },
   * });
   *
   * // Optionally restrict access after multiple failures
   * if (attemptCount && attemptCount >= 3) {
   *   await db.collection('users').doc(userId).update({
   *     paymentFailed: true,
   *   });
   * }
   */
}

// =============================================================================
// Payment Method Event Handlers
// =============================================================================

/**
 * Handle payment method attached event
 *
 * Triggered when a customer adds a new payment method.
 */
async function handlePaymentMethodAttached(paymentMethod: Stripe.PaymentMethod) {
  console.log(`Payment method attached: ${paymentMethod.id}`);

  const customerId = paymentMethod.customer;
  const type = paymentMethod.type;

  console.log(`Customer: ${customerId}, Type: ${type}`);

  /**
   * TODO: Update database if needed
   *
   * This is informational - you might want to log this for
   * audit purposes or update a "has payment method" flag.
   */
}

/**
 * Handle payment method detached event
 *
 * Triggered when a customer removes a payment method.
 */
async function handlePaymentMethodDetached(paymentMethod: Stripe.PaymentMethod) {
  console.log(`Payment method detached: ${paymentMethod.id}`);

  /**
   * TODO: Update database if needed
   *
   * You might want to check if the customer still has valid
   * payment methods for their subscriptions.
   */
}

// =============================================================================
// Customer Event Handlers
// =============================================================================

/**
 * Handle customer updated event
 *
 * Triggered when customer information is updated.
 * Check for changes to default payment method.
 */
async function handleCustomerUpdated(customer: Stripe.Customer) {
  console.log(`Customer updated: ${customer.id}`);

  const defaultPaymentMethod = customer.invoice_settings?.default_payment_method;

  console.log(`Default payment method: ${defaultPaymentMethod}`);

  /**
   * TODO: Update billing information in your database
   *
   * IMPORTANT: Only treat this as billing information changes.
   * Do not use the customer email as a login credential.
   *
   * await db.collection('users').doc(userId).update({
   *   billingEmail: customer.email,
   *   defaultPaymentMethodId: defaultPaymentMethod,
   * });
   */
}

// =============================================================================
// Tax ID Event Handlers
// =============================================================================

/**
 * Handle tax ID events
 *
 * Triggered when customers manage their tax IDs.
 * Stripe validates certain tax ID types.
 */
async function handleTaxIdEvent(eventType: string, taxId: Stripe.TaxId) {
  console.log(`Tax ID event: ${eventType}, ID: ${taxId.id}`);

  const type = taxId.type;
  const value = taxId.value;
  const verificationStatus = taxId.verification?.status;

  console.log(`Type: ${type}, Value: ${value}, Verification: ${verificationStatus}`);

  /**
   * TODO: Update tax information in your database
   *
   * await db.collection('users').doc(userId).update({
   *   taxId: value,
   *   taxIdType: type,
   *   taxIdVerified: verificationStatus === 'verified',
   * });
   */
}

// =============================================================================
// Billing Portal Event Handlers
// =============================================================================

/**
 * Handle billing portal session created event
 *
 * Triggered when a customer opens the billing portal.
 * Useful for analytics/auditing.
 */
async function handleBillingPortalSessionCreated(session: Stripe.BillingPortal.Session) {
  console.log(`Billing portal session created: ${session.id}`);

  const customerId = session.customer;

  console.log(`Customer: ${customerId}`);

  /**
   * TODO: Log for analytics/auditing
   *
   * await db.collection('audit_logs').add({
   *   event: 'billing_portal_accessed',
   *   customerId: customerId,
   *   timestamp: new Date(),
   * });
   */
}
