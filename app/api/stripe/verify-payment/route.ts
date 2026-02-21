import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import stripeClient from '@/lib/stripe';

const PLAN_VALIDITY_DAYS: Record<string, number> = {
  ambassador: 30,
  grow: 30,
  thrive: 30,
  partner: 30,
};

export async function POST(request: NextRequest) {
  try {
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

    // Verify the session belongs to this user
    if (session.metadata?.firebaseUid !== decoded.uid) {
      return NextResponse.json({ error: 'Session does not belong to this user' }, { status: 403 });
    }

    // Check payment status
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 400 });
    }

    const userId = decoded.uid;
    const plan = session.metadata?.plan;

    // Handle ambassador one-time payment
    if (plan === 'ambassador' && session.mode === 'payment') {
      const userDoc = await db.collection('users').doc(userId).get();
      const userData = userDoc.data();

      // Only update if not already ambassador (idempotent)
      if (userData?.plan !== 'ambassador') {
        // Retrieve payment intent for detailed payment info
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
            paymentIntentId: paymentIntent.id,
            amountPaid: paymentIntent.amount,
            currency: paymentIntent.currency,
            paymentMethod: paymentIntent.payment_method,
            paymentStatus: paymentIntent.status,
            receiptUrl: chargeData?.receipt_url || null,
            cardBrand: card?.brand || null,
            cardLast4: card?.last4 || null,
          };
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
          ambassadorCheckoutSessionId: sessionId,
          subscriptionStatus: 'active',
          subscriptionEndDate: expiryDate.toISOString(),
          paymentTimestamp: now.toISOString(),
          planValidity: `${validityDays} days`,
          stripeCustomerId: typeof session.customer === 'string' ? session.customer : null,
          ...paymentDetails,
        });

        // Write to /pay collection
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
