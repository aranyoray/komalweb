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

// Map Stripe Price IDs to plan names
function getPlanFromPriceId(priceId: string): 'grow' | 'thrive' | 'partner' | 'ambassador' | 'free' {
  const priceMap: Record<string, 'grow' | 'thrive' | 'partner' | 'ambassador'> = {};

  if (process.env.STRIPE_PRICE_GROW) priceMap[process.env.STRIPE_PRICE_GROW] = 'grow';
  if (process.env.STRIPE_PRICE_THRIVE) priceMap[process.env.STRIPE_PRICE_THRIVE] = 'thrive';
  if (process.env.STRIPE_PRICE_PARTNER) priceMap[process.env.STRIPE_PRICE_PARTNER] = 'partner';
  if (process.env.STRIPE_PRICE_AMBASSADOR) priceMap[process.env.STRIPE_PRICE_AMBASSADOR] = 'ambassador';

  return priceMap[priceId] || 'grow';
}

// Find Firestore user doc by stripeCustomerId or by subscription metadata
async function findUserByStripeCustomer(customerId: string, metadata?: Stripe.Metadata): Promise<string | null> {
  // First check metadata for firebaseUid
  if (metadata?.firebaseUid) {
    return metadata.firebaseUid;
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
  thrive: 30,
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
    console.error(`No user found for customer ${customerId}`);
    return;
  }

  const priceId = subscription.items.data[0]?.price?.id || '';
  const plan = getPlanFromPriceId(priceId);
  const planNames: Record<string, string> = {
    grow: 'Grow',
    thrive: 'Thrive',
    partner: 'Partner',
    ambassador: 'Ambassador Community',
    free: 'Free',
  };

  const periodEnd = subscription.items.data[0]?.current_period_end;

  const now = new Date();
  const validityDays = PLAN_VALIDITY_DAYS[plan] || 30;

  const updateData: Record<string, unknown> = {
    plan,
    planName: planNames[plan],
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
    planName: planNames[plan],
    subscriptionId: subscription.id,
    subscriptionStatus: subscription.status,
    subscriptionPriceId: priceId,
    subscriptionEndDate: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
    stripeCustomerId: customerId,
    paymentTimestamp: now.toISOString(),
    planValidity: `${validityDays} days`,
    createdAt: now.toISOString(),
  });

  console.log(`Updated user ${userId} with plan: ${plan}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log(`Subscription updated: ${subscription.id}`);

  const customerId = typeof subscription.customer === 'string'
    ? subscription.customer
    : subscription.customer.id;

  const userId = await findUserByStripeCustomer(customerId, subscription.metadata);
  if (!userId) {
    console.error(`No user found for customer ${customerId}`);
    return;
  }

  const priceId = subscription.items.data[0]?.price?.id || '';
  const plan = getPlanFromPriceId(priceId);
  const planNames: Record<string, string> = {
    grow: 'Grow',
    thrive: 'Thrive',
    partner: 'Partner',
    ambassador: 'Ambassador Community',
    free: 'Free',
  };

  const periodEnd = subscription.items.data[0]?.current_period_end;

  const now = new Date();
  const validityDays = PLAN_VALIDITY_DAYS[plan] || 30;

  const updateData: Record<string, unknown> = {
    plan,
    planName: planNames[plan],
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
    planName: planNames[plan],
    subscriptionId: subscription.id,
    subscriptionStatus: subscription.cancel_at_period_end ? 'canceling' : subscription.status,
    subscriptionPriceId: priceId,
    subscriptionEndDate: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
    paymentTimestamp: now.toISOString(),
    planValidity: `${validityDays} days`,
    createdAt: now.toISOString(),
  });

  console.log(`Updated subscription for user ${userId}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log(`Subscription deleted: ${subscription.id}`);

  const customerId = typeof subscription.customer === 'string'
    ? subscription.customer
    : subscription.customer.id;

  const userId = await findUserByStripeCustomer(customerId, subscription.metadata);
  if (!userId) {
    console.error(`No user found for customer ${customerId}`);
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

  console.log(`Revoked access for user ${userId}`);
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
  // Only handle one-time payments for ambassador plan
  if (session.mode !== 'payment' || session.metadata?.plan !== 'ambassador') {
    return;
  }

  console.log(`Ambassador checkout completed: ${session.id}`);

  const customerId = typeof session.customer === 'string'
    ? session.customer
    : (session.customer as Stripe.Customer)?.id;

  if (!customerId) return;

  const userId = await findUserByStripeCustomer(customerId, session.metadata || undefined);
  if (!userId) {
    console.error(`No user found for ambassador checkout, customer ${customerId}`);
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

  console.log(`Activated ambassador plan for user ${userId}`);
}
