/**
 * Stripe Subscription Webhooks Handler
 * =====================================
 *
 * Handles standard webhook events for subscriptions with Firestore writes.
 *
 * SETUP:
 * 1. Stripe Dashboard > Developers > Webhooks > Add endpoint
 * 2. URL: https://your-domain.com/api/stripe/webhooks/subscriptions
 * 3. Events: customer.subscription.created/updated/deleted, invoice.paid/payment_failed
 * 4. Copy signing secret to STRIPE_WEBHOOK_SECRET
 *
 * LOCAL TESTING:
 * stripe listen --forward-to http://localhost:3001/api/stripe/webhooks/subscriptions
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import stripeClient, { getWebhookSecret } from '@/lib/stripe';
import { db } from '@/lib/firebase-admin';

// Resolve plan from subscription metadata (primary) or price ID (fallback)
function getPlanFromSubscription(subscription: Stripe.Subscription): 'grow' | 'thrive' | 'partner' | 'ambassador' | 'free' {
  // Primary: use metadata set during checkout
  const metaPlan = subscription.metadata?.plan;
  if (metaPlan && ['grow', 'thrive', 'partner', 'ambassador'].includes(metaPlan)) {
    return metaPlan as 'grow' | 'thrive' | 'partner' | 'ambassador';
  }

  // Fallback: map Stripe Price ID to plan name (for legacy pre-created prices)
  const priceId = subscription.items.data[0]?.price?.id || '';
  const priceMap: Record<string, 'grow' | 'thrive' | 'partner' | 'ambassador'> = {};
  if (process.env.STRIPE_PRICE_GROW) priceMap[process.env.STRIPE_PRICE_GROW] = 'grow';
  if (process.env.STRIPE_PRICE_THRIVE) priceMap[process.env.STRIPE_PRICE_THRIVE] = 'thrive';
  if (process.env.STRIPE_PRICE_PARTNER) priceMap[process.env.STRIPE_PRICE_PARTNER] = 'partner';
  if (process.env.STRIPE_PRICE_AMBASSADOR) priceMap[process.env.STRIPE_PRICE_AMBASSADOR] = 'ambassador';

  return priceMap[priceId] || 'grow';
}

// Find Firestore user doc by stripeCustomerId or by subscription metadata
async function findUserByStripeCustomer(customerId: string, metadata?: Stripe.Metadata): Promise<string | null> {
  // First check metadata for firebaseUid — but verify the user doc actually exists
  if (metadata?.firebaseUid) {
    const userDoc = await db.collection('users').doc(metadata.firebaseUid).get();
    if (userDoc.exists) return metadata.firebaseUid;
    // If the doc doesn't exist, fall through to other lookup methods
  }

  // Query Firestore by stripeCustomerId
  const snapshot = await db
    .collection('users')
    .where('stripeCustomerId', '==', customerId)
    .limit(1)
    .get();

  if (!snapshot.empty) {
    return snapshot.docs[0].id;
  }

  // Fallback: look up customer email in Stripe, find matching user
  try {
    const customer = await stripeClient.customers.retrieve(customerId);
    if (customer && !('deleted' in customer && customer.deleted) && customer.email) {
      const emailSnapshot = await db
        .collection('users')
        .where('email', '==', customer.email)
        .limit(1)
        .get();

      if (!emailSnapshot.empty) {
        // Also store the stripeCustomerId for future lookups
        await emailSnapshot.docs[0].ref.update({ stripeCustomerId: customerId });
        return emailSnapshot.docs[0].id;
      }
    }
  } catch (e) {
    console.error('Error looking up customer:', e);
  }

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
    }

    const webhookSecret = getWebhookSecret();

    let event: Stripe.Event;
    try {
      event = stripeClient.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    console.log(`Received event: ${event.type} (${event.id})`);

    // Reject events older than 5 minutes to prevent replay attacks
    const eventAge = Math.abs(Date.now() / 1000 - event.created);
    if (eventAge > 300) {
      console.warn(`Rejecting stale event ${event.id} (age: ${Math.round(eventAge)}s)`);
      return NextResponse.json({ received: true, skipped: 'stale' });
    }

    // Idempotency: atomic check-and-set to prevent duplicate processing
    const eventRef = db.collection('processed_webhook_events').doc(event.id);
    const isDuplicate = await db.runTransaction(async (tx) => {
      const doc = await tx.get(eventRef);
      if (doc.exists) return true;
      tx.set(eventRef, { type: event.type, processedAt: new Date().toISOString() });
      return false;
    });
    if (isDuplicate) {
      return NextResponse.json({ received: true, skipped: 'duplicate' });
    }

    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler error' }, { status: 500 });
  }
}

// Plan validity in days — used for expiry date calculation
const PLAN_VALIDITY_DAYS: Record<string, number> = {
  ambassador: 30,
  grow: 30,
  thrive: 180,
  partner: 30,
};

// =============================================================================
// Subscription Event Handlers
// =============================================================================

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log(`Subscription created: ${subscription.id}`);

  const customerId = typeof subscription.customer === 'string'
    ? subscription.customer
    : subscription.customer.id;

  const userId = await findUserByStripeCustomer(customerId, subscription.metadata);
  if (!userId) {
    console.error('No user found for Stripe customer');
    return;
  }

  const priceId = subscription.items.data[0]?.price?.id || '';
  const plan = getPlanFromSubscription(subscription);
  const fallbackNames: Record<string, string> = {
    grow: 'Grow', thrive: 'Thrive', partner: 'Partner',
    ambassador: 'Ambassador Community', free: 'Free',
  };
  const planName = subscription.metadata?.planName || fallbackNames[plan] || plan;

  const periodEnd = subscription.items.data[0]?.current_period_end;

  const now = new Date();
  const validityDays = PLAN_VALIDITY_DAYS[plan] || 30;

  const updateData: Record<string, unknown> = {
    plan,
    planName,
    subscriptionId: subscription.id,
    subscriptionStatus: subscription.status,
    subscriptionPriceId: priceId,
    subscriptionEndDate: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
    stripeCustomerId: customerId,
    paymentTimestamp: now.toISOString(),
    planValidity: `${validityDays} days`,
  };

  if (plan === 'ambassador') {
    updateData.role = 'ambassador';
  }

  await db.collection('users').doc(userId).update(updateData);

  // Write to /pay collection
  await db.collection('pay').add({
    uid: userId,
    type: 'subscription_created',
    plan,
    planName,
    subscriptionId: subscription.id,
    subscriptionStatus: subscription.status,
    subscriptionPriceId: priceId,
    subscriptionEndDate: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
    stripeCustomerId: customerId,
    paymentTimestamp: now.toISOString(),
    planValidity: `${validityDays} days`,
    createdAt: now.toISOString(),
  });

  console.log(`Updated user with plan: ${plan}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log(`Subscription updated: ${subscription.id}`);

  const customerId = typeof subscription.customer === 'string'
    ? subscription.customer
    : subscription.customer.id;

  const userId = await findUserByStripeCustomer(customerId, subscription.metadata);
  if (!userId) {
    console.error('No user found for Stripe customer');
    return;
  }

  const priceId = subscription.items.data[0]?.price?.id || '';
  const plan = getPlanFromSubscription(subscription);
  const fallbackNames: Record<string, string> = {
    grow: 'Grow', thrive: 'Thrive', partner: 'Partner',
    ambassador: 'Ambassador Community', free: 'Free',
  };
  const planName = subscription.metadata?.planName || fallbackNames[plan] || plan;

  const periodEnd = subscription.items.data[0]?.current_period_end;

  const now = new Date();
  const validityDays = PLAN_VALIDITY_DAYS[plan] || 30;

  const updateData: Record<string, unknown> = {
    plan,
    planName,
    subscriptionStatus: subscription.status,
    subscriptionPriceId: priceId,
    subscriptionEndDate: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
    paymentTimestamp: now.toISOString(),
    planValidity: `${validityDays} days`,
  };

  if (plan === 'ambassador') {
    updateData.role = 'ambassador';
  }

  if (subscription.cancel_at_period_end) {
    updateData.subscriptionStatus = 'canceling';
  }

  await db.collection('users').doc(userId).update(updateData);

  // Write to /pay collection
  await db.collection('pay').add({
    uid: userId,
    type: 'subscription_updated',
    plan,
    planName,
    subscriptionId: subscription.id,
    subscriptionStatus: subscription.cancel_at_period_end ? 'canceling' : subscription.status,
    subscriptionPriceId: priceId,
    subscriptionEndDate: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
    paymentTimestamp: now.toISOString(),
    planValidity: `${validityDays} days`,
    createdAt: now.toISOString(),
  });

  console.log('Subscription updated for user');
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log(`Subscription deleted: ${subscription.id}`);

  const customerId = typeof subscription.customer === 'string'
    ? subscription.customer
    : subscription.customer.id;

  const userId = await findUserByStripeCustomer(customerId, subscription.metadata);
  if (!userId) {
    console.error('No user found for Stripe customer');
    return;
  }

  await db.collection('users').doc(userId).update({
    plan: 'free',
    planName: 'Free',
    subscriptionId: null,
    subscriptionStatus: 'canceled',
    subscriptionPriceId: null,
    subscriptionEndDate: null,
    reportsUsed: 0,
  });

  // Write to /pay collection
  await db.collection('pay').add({
    uid: userId,
    type: 'subscription_deleted',
    subscriptionId: subscription.id,
    stripeCustomerId: customerId,
    createdAt: new Date().toISOString(),
  });

  console.log('Revoked access for user');
}

async function handleInvoicePaid(invoice: Stripe.Invoice) {
  console.log(`Invoice paid: ${invoice.id}`);

  const customerId = typeof invoice.customer === 'string'
    ? invoice.customer
    : (invoice.customer as Stripe.Customer)?.id;

  if (!customerId) return;

  const userId = await findUserByStripeCustomer(customerId);
  if (!userId) return;

  await db.collection('users').doc(userId).update({
    subscriptionStatus: 'active',
  });

  // Write to /pay collection
  await db.collection('pay').add({
    uid: userId,
    type: 'invoice_paid',
    invoiceId: invoice.id,
    amountPaid: invoice.amount_paid,
    currency: invoice.currency,
    stripeCustomerId: customerId,
    createdAt: new Date().toISOString(),
  });
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  console.log(`Invoice payment failed: ${invoice.id}`);

  const customerId = typeof invoice.customer === 'string'
    ? invoice.customer
    : (invoice.customer as Stripe.Customer)?.id;

  if (!customerId) return;

  const userId = await findUserByStripeCustomer(customerId);
  if (!userId) return;

  await db.collection('users').doc(userId).update({
    subscriptionStatus: 'past_due',
  });

  // Write to /pay collection
  await db.collection('pay').add({
    uid: userId,
    type: 'invoice_payment_failed',
    invoiceId: invoice.id,
    amountDue: invoice.amount_due,
    currency: invoice.currency,
    stripeCustomerId: customerId,
    createdAt: new Date().toISOString(),
  });
}

// =============================================================================
// One-Time Payment Handler (Ambassador)
// =============================================================================

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const plan = session.metadata?.plan;

  // Handle subscription checkout completions (grow/thrive) — save detailed payment info
  if (session.mode === 'subscription' && plan && ['grow', 'thrive'].includes(plan)) {
    console.log(`Subscription checkout completed for ${plan}: ${session.id}`);

    const customerId = typeof session.customer === 'string'
      ? session.customer
      : (session.customer as Stripe.Customer)?.id;

    if (!customerId) return;

    const userId = await findUserByStripeCustomer(customerId, session.metadata || undefined);
    if (!userId) {
      console.error('No user found for subscription checkout');
      return;
    }

    // Retrieve subscription for detailed info
    const subscriptionId = typeof session.subscription === 'string'
      ? session.subscription
      : (session.subscription as Stripe.Subscription)?.id;

    let subscriptionDetails: Record<string, unknown> = {};
    if (subscriptionId) {
      try {
        const sub = await stripeClient.subscriptions.retrieve(subscriptionId, {
          expand: ['latest_invoice.payment_intent'],
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const invoice = sub.latest_invoice as any;
        const paymentIntent = invoice?.payment_intent;
        const charge = paymentIntent?.latest_charge;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const chargeObj = typeof charge === 'object' && charge !== null ? charge as any : null;
        const card = chargeObj?.payment_method_details?.card;

        subscriptionDetails = {
          paymentIntentId: paymentIntent?.id ? String(paymentIntent.id) : null,
          amountPaid: Number(paymentIntent?.amount || session.amount_total) || 0,
          currency: String(paymentIntent?.currency || session.currency || ''),
          paymentMethod: paymentIntent?.payment_method ? String(paymentIntent.payment_method) : null,
          paymentStatus: paymentIntent?.status ? String(paymentIntent.status) : null,
          receiptUrl: chargeObj?.receipt_url ? String(chargeObj.receipt_url) : null,
          cardBrand: card?.brand ? String(card.brand) : null,
          cardLast4: card?.last4 ? String(card.last4) : null,
        };
      } catch (e) {
        console.error('Error retrieving subscription details:', e);
      }
    }

    const now = new Date();
    const validityDays = PLAN_VALIDITY_DAYS[plan] || 30;
    const planNames: Record<string, string> = {
      grow: 'Grow', thrive: 'Thrive', partner: 'Partner',
    };

    // Update user doc with full transaction info
    await db.collection('users').doc(userId).update({
      checkoutSessionId: session.id,
      ...subscriptionDetails,
    });

    // Write detailed record to /pay collection
    await db.collection('pay').add({
      uid: userId,
      type: 'subscription_checkout_completed',
      plan,
      planName: planNames[plan] || plan,
      checkoutSessionId: session.id,
      subscriptionId: subscriptionId || null,
      stripeCustomerId: customerId,
      paymentTimestamp: now.toISOString(),
      planValidity: `${validityDays} days`,
      ...subscriptionDetails,
      createdAt: now.toISOString(),
    });

    console.log(`Saved subscription checkout details, plan: ${plan}`);
    return;
  }

  // Only handle one-time payments for ambassador plan
  if (session.mode !== 'payment' || plan !== 'ambassador') {
    return;
  }

  // CRITICAL: Verify payment was actually completed before granting ambassador role
  if (session.payment_status !== 'paid') {
    console.warn(`Ambassador checkout ${session.id} has payment_status=${session.payment_status}, skipping`);
    return;
  }

  console.log(`Ambassador checkout completed: ${session.id}`);

  const customerId = typeof session.customer === 'string'
    ? session.customer
    : (session.customer as Stripe.Customer)?.id;

  if (!customerId) return;

  const userId = await findUserByStripeCustomer(customerId, session.metadata || undefined);
  if (!userId) {
    console.error('No user found for ambassador checkout');
    return;
  }

  // Retrieve payment intent for detailed payment info
  const paymentIntentId = typeof session.payment_intent === 'string'
    ? session.payment_intent
    : (session.payment_intent as Stripe.PaymentIntent)?.id;

  let paymentDetails: Record<string, unknown> = {};
  if (paymentIntentId) {
    try {
      const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId, {
        expand: ['latest_charge'],
      });

      const charge = paymentIntent.latest_charge;
      const chargeObj = typeof charge === 'object' && charge !== null ? charge : null;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const chargeData = chargeObj as any;
      const card = chargeData?.payment_method_details?.card;

      paymentDetails = {
        paymentIntentId: paymentIntent.id,
        amountPaid: paymentIntent.amount,
        currency: paymentIntent.currency,
        paymentMethod: paymentIntent.payment_method,
        paymentStatus: paymentIntent.status,
        receiptUrl: chargeData?.receipt_url || null,
        cardBrand: card?.brand || null,
        cardLast4: card?.last4 || null,
      };
    } catch (e) {
      console.error('Error retrieving payment intent details:', e);
    }
  }

  const now = new Date();
  const validityDays = PLAN_VALIDITY_DAYS.ambassador;
  const expiryDate = new Date(now.getTime() + validityDays * 24 * 60 * 60 * 1000);

  await db.collection('users').doc(userId).update({
    plan: 'ambassador',
    planName: 'Ambassador Community',
    role: 'ambassador',
    ambassadorPaymentId: paymentIntentId || session.payment_intent,
    ambassadorPaidAt: now.toISOString(),
    ambassadorCheckoutSessionId: session.id,
    subscriptionStatus: 'active',
    subscriptionEndDate: expiryDate.toISOString(),
    paymentTimestamp: now.toISOString(),
    planValidity: `${validityDays} days`,
    stripeCustomerId: customerId,
    ...paymentDetails,
  });

  // Write to /pay collection
  await db.collection('pay').add({
    uid: userId,
    type: 'ambassador_payment',
    plan: 'ambassador',
    planName: 'Ambassador Community',
    checkoutSessionId: session.id,
    stripeCustomerId: customerId,
    subscriptionEndDate: expiryDate.toISOString(),
    paymentTimestamp: now.toISOString(),
    planValidity: `${validityDays} days`,
    ...paymentDetails,
    createdAt: now.toISOString(),
  });

  console.log('Activated ambassador plan for user');
}
