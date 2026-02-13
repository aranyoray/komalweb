import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import stripeClient, { getBaseUrl } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    // Verify Firebase auth token
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

    const { priceId: planKey, couponCode } = await request.json();
    if (!planKey) {
      return NextResponse.json({ error: 'priceId is required' }, { status: 400 });
    }

    // Resolve plan key to actual Stripe Price ID from environment
    const priceEnvMap: Record<string, string | undefined> = {
      grow: process.env.STRIPE_PRICE_GROW,
      thrive: process.env.STRIPE_PRICE_THRIVE,
      partner: process.env.STRIPE_PRICE_PARTNER,
      ambassador: process.env.STRIPE_PRICE_AMBASSADOR,
    };

    const priceId = priceEnvMap[planKey];

    const userId = decoded.uid;
    const userRecord = await getAuth().getUser(userId);
    const email = userRecord.email || '';

    // Get or create Stripe customer
    let stripeCustomerId: string | undefined;
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();

    if (userData?.stripeCustomerId) {
      stripeCustomerId = userData.stripeCustomerId;
    } else {
      const customer = await stripeClient.customers.create({
        email,
        metadata: { firebaseUid: userId },
      });
      stripeCustomerId = customer.id;

      await db.collection('users').doc(userId).update({
        stripeCustomerId: customer.id,
      });
    }

    const baseUrl = getBaseUrl();

    // Ambassador: one-time payment in CAD
    if (planKey === 'ambassador') {
      const ambassadorAmount = Math.round(parseFloat(process.env.STRIPE_PRICE_AMBASSADOR || '19.99') * 100);

      // Build session params for one-time payment
      const sessionParams: Record<string, unknown> = {
        customer: stripeCustomerId,
        mode: 'payment',
        line_items: [{
          price_data: {
            currency: 'cad',
            product_data: {
              name: 'Ambassador Community',
              description: 'KOMAL Ambassador Community — one-time lifetime membership',
            },
            unit_amount: ambassadorAmount,
          },
          quantity: 1,
        }],
        success_url: `${baseUrl}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/ambassador`,
        metadata: { firebaseUid: userId, plan: 'ambassador' },
        payment_intent_data: {
          metadata: { firebaseUid: userId, plan: 'ambassador' },
        },
      };

      // Apply coupon code if provided
      if (couponCode && typeof couponCode === 'string' && couponCode.trim()) {
        try {
          // Look up the promotion code by its user-facing code
          const promoCodes = await stripeClient.promotionCodes.list({
            code: couponCode.trim(),
            active: true,
            limit: 1,
          });

          if (promoCodes.data.length > 0) {
            sessionParams.discounts = [{ promotion_code: promoCodes.data[0].id }];
          } else {
            return NextResponse.json({ error: 'Invalid or expired coupon code' }, { status: 400 });
          }
        } catch {
          return NextResponse.json({ error: 'Invalid coupon code' }, { status: 400 });
        }
      } else {
        // Allow entering promo codes on Stripe Checkout page
        sessionParams.allow_promotion_codes = true;
      }

      const session = await stripeClient.checkout.sessions.create(sessionParams as Parameters<typeof stripeClient.checkout.sessions.create>[0]);
      return NextResponse.json({ url: session.url });
    }

    // Regular subscription plans (grow/thrive/partner)
    if (!priceId) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    const session = await stripeClient.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/dashboard?payment=success`,
      cancel_url: `${baseUrl}/pricing`,
      metadata: { firebaseUid: userId, plan: planKey },
      subscription_data: {
        metadata: { firebaseUid: userId, plan: planKey },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
