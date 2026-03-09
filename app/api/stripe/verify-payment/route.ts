import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import stripeClient from '@/lib/stripe';
import { isRateLimited, getClientIp } from '@/lib/rate-limit';

const PLAN_VALIDITY_DAYS: Record<string, number> = {
  ambassador: 30,
  grow: 30,
  thrive: 30,
  partner: 30,
};

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 10 verification attempts per minute per IP
    const ip = getClientIp(request.headers);
    if (isRateLimited(`verify-payment:${ip}`, 10, 60_000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    let decoded;
    try {
      decoded = await getAuth().verifyIdToken(token);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { sessionId } = await request.json();
    if (!sessionId) {
      return NextResponse.json({ error: 'sessionId is required' }, { status: 400 });
    }

    // Retrieve the checkout session from Stripe
    const session = await stripeClient.checkout.sessions.retrieve(sessionId);

    // Verify the session has metadata and belongs to this user
    if (!session.metadata || session.metadata.firebaseUid !== decoded.uid) {
      return NextResponse.json({ error: 'Session does not belong to this user' }, { status: 403 });
    }

    // Verify session is fully complete with payment confirmed
    if (session.status !== 'complete' || session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    const userId = decoded.uid;
    const plan = session.metadata?.plan;

    // Handle ambassador one-time payment
    if (plan === 'ambassador' && session.mode === 'payment') {
      // Retrieve payment intent for detailed payment info (outside transaction)
      const paymentIntentId = typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent?.id;

      let paymentDetails: Record<string, unknown> = {};
      if (paymentIntentId) {
        const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId, {
          expand: ['latest_charge'],
        });

        const charge = paymentIntent.latest_charge;
        const chargeObj = typeof charge === 'object' && charge !== null ? charge : null;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const chargeData = chargeObj as any;
        const card = chargeData?.payment_method_details?.card;

        paymentDetails = {
          paymentIntentId: String(paymentIntent.id || ''),
          amountPaid: Number(paymentIntent.amount) || 0,
          currency: String(paymentIntent.currency || ''),
          paymentMethod: paymentIntent.payment_method ? String(paymentIntent.payment_method) : null,
          paymentStatus: String(paymentIntent.status || ''),
          receiptUrl: chargeData?.receipt_url ? String(chargeData.receipt_url) : null,
          cardBrand: card?.brand ? String(card.brand) : null,
          cardLast4: card?.last4 ? String(card.last4) : null,
        };
      }

      const now = new Date();
      const validityDays = PLAN_VALIDITY_DAYS.ambassador;
      const expiryDate = new Date(now.getTime() + validityDays * 24 * 60 * 60 * 1000);

      // Atomic check-then-update to prevent race conditions
      const userRef = db.collection('users').doc(userId);
      const alreadyAmbassador = await db.runTransaction(async (tx) => {
        const userDoc = await tx.get(userRef);
        if (userDoc.data()?.plan === 'ambassador') return true;

        tx.update(userRef, {
          plan: 'ambassador',
          planName: 'Ambassador Community',
          role: 'ambassador',
          ambassadorPaymentId: paymentIntentId || session.payment_intent,
          ambassadorPaidAt: now.toISOString(),
          ambassadorCheckoutSessionId: sessionId,
          subscriptionStatus: 'active',
          subscriptionEndDate: expiryDate.toISOString(),
          paymentTimestamp: now.toISOString(),
          planValidity: `${validityDays} days`,
          stripeCustomerId: typeof session.customer === 'string' ? session.customer : null,
          ...paymentDetails,
        });
        return false;
      });

      if (!alreadyAmbassador) {
        // Write to /pay collection (outside transaction — idempotent audit log)
        await db.collection('pay').add({
          uid: userId,
          type: 'ambassador_payment',
          plan: 'ambassador',
          planName: 'Ambassador Community',
          checkoutSessionId: sessionId,
          stripeCustomerId: typeof session.customer === 'string' ? session.customer : null,
          subscriptionEndDate: expiryDate.toISOString(),
          paymentTimestamp: now.toISOString(),
          planValidity: `${validityDays} days`,
          ...paymentDetails,
          createdAt: now.toISOString(),
        });
      }

      return NextResponse.json({ success: true, plan: 'ambassador' });
    }

    // Handle subscription payments - these are already handled by webhooks,
    // but verify the subscription is active as a fallback
    if (session.mode === 'subscription' && session.subscription) {
      const subscriptionId = typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription.id;

      const subscription = await stripeClient.subscriptions.retrieve(subscriptionId);
      const priceId = subscription.items.data[0]?.price?.id || '';

      const priceMap: Record<string, string> = {};
      if (process.env.STRIPE_PRICE_GROW) priceMap[process.env.STRIPE_PRICE_GROW] = 'grow';
      if (process.env.STRIPE_PRICE_THRIVE) priceMap[process.env.STRIPE_PRICE_THRIVE] = 'thrive';
      if (process.env.STRIPE_PRICE_PARTNER) priceMap[process.env.STRIPE_PRICE_PARTNER] = 'partner';

      const resolvedPlan = priceMap[priceId] || 'grow';
      const planNames: Record<string, string> = {
        grow: 'Grow', thrive: 'Thrive', partner: 'Partner',
      };

      const periodEnd = subscription.items.data[0]?.current_period_end;

      const now = new Date();
      const validityDays = PLAN_VALIDITY_DAYS[resolvedPlan] || 30;

      await db.collection('users').doc(userId).update({
        plan: resolvedPlan,
        planName: planNames[resolvedPlan] || resolvedPlan,
        subscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        subscriptionPriceId: priceId,
        subscriptionEndDate: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
        paymentTimestamp: now.toISOString(),
        planValidity: `${validityDays} days`,
      });

      // Write to /pay collection
      await db.collection('pay').add({
        uid: userId,
        type: 'subscription_verified',
        plan: resolvedPlan,
        planName: planNames[resolvedPlan] || resolvedPlan,
        subscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        subscriptionPriceId: priceId,
        subscriptionEndDate: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
        paymentTimestamp: now.toISOString(),
        planValidity: `${validityDays} days`,
        createdAt: now.toISOString(),
      });

      return NextResponse.json({ success: true, plan: resolvedPlan });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
  }
}
