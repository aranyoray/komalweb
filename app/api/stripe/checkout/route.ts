import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import stripeClient, { getBaseUrl } from '@/lib/stripe';
import { isRateLimited, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 checkout attempts per minute per IP
    const ip = getClientIp(request.headers);
    if (isRateLimited(`checkout:${ip}`, 5, 60_000)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

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

    const body = await request.json();
    const planKey = body.plan || body.priceId; // priceId kept for ambassador page compat
    const couponCode = body.couponCode;

    if (!planKey) {
      return NextResponse.json({ error: 'plan is required' }, { status: 400 });
    }

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
      if (!process.env.STRIPE_PRICE_AMBASSADOR) {
        return NextResponse.json({ error: 'Ambassador pricing not configured' }, { status: 500 });
      }
      const ambassadorAmount = Math.round(parseFloat(process.env.STRIPE_PRICE_AMBASSADOR) * 100);
      if (!ambassadorAmount || ambassadorAmount <= 0 || !isFinite(ambassadorAmount)) {
        return NextResponse.json({ error: 'Invalid ambassador price configuration' }, { status: 500 });
      }

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

      if (couponCode && typeof couponCode === 'string' && couponCode.trim()) {
        try {
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
        sessionParams.allow_promotion_codes = true;
      }

      const session = await stripeClient.checkout.sessions.create(sessionParams as Parameters<typeof stripeClient.checkout.sessions.create>[0]);
      return NextResponse.json({ url: session.url });
    }

    // ---------------------------------------------------------------
    // Subscription plans (grow / thrive) — server-enforced pricing
    // ---------------------------------------------------------------
    const { currency, billingMonths } = body;

    const allowedCurrencies = ['usd', 'cad', 'eur', 'gbp', 'inr', 'aud', 'sgd'];
    if (!currency || typeof currency !== 'string' || !allowedCurrencies.includes(currency.toLowerCase())) {
      return NextResponse.json({ error: 'Invalid or unsupported currency' }, { status: 400 });
    }

    const validPlans = ['grow', 'thrive'];
    if (!validPlans.includes(planKey)) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });
    }

    // Server-side pricing — NEVER trust client-sent amounts
    // Prices in smallest currency unit (cents). Configure via env vars.
    // Require env vars — no hardcoded fallback prices
    // Parse prices as integers (amounts in smallest currency unit).
    // Use Math.round(Number(...)) to safely handle any accidental decimal values.
    const safeInt = (v: string | undefined): number => {
      const n = Number(v);
      return Number.isFinite(n) ? Math.round(n) : 0;
    };
    const planPrices: Record<string, Record<string, number>> = {
      grow:   { '1': safeInt(process.env.STRIPE_AMOUNT_GROW_1),   '6': safeInt(process.env.STRIPE_AMOUNT_GROW_6) },
      thrive: { '1': safeInt(process.env.STRIPE_AMOUNT_THRIVE_1), '6': safeInt(process.env.STRIPE_AMOUNT_THRIVE_6) },
    };

    const planDisplayNames: Record<string, string> = { grow: 'Grow', thrive: 'Thrive' };
    const displayName = planDisplayNames[planKey] || planKey;

    // Validate billing interval
    const allowedIntervals = [1, 6];
    const intervalCount = allowedIntervals.includes(billingMonths) ? billingMonths : 1;

    // Look up the server-enforced price for this plan + interval
    const amount = planPrices[planKey]?.[String(intervalCount)];
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid plan configuration' }, { status: 500 });
    }

    const session = await stripeClient.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'subscription' as const,
      line_items: [{
        price_data: {
          currency: currency.toLowerCase(),
          product_data: {
            name: `KOMAL ${displayName} Plan`,
          },
          unit_amount: amount,
          recurring: {
            interval: 'month' as const,
            interval_count: intervalCount,
          },
        },
        quantity: 1,
      }],
      success_url: `${baseUrl}/dashboard?payment=success`,
      cancel_url: `${baseUrl}/pricing`,
      metadata: { firebaseUid: userId, plan: planKey, planName: displayName },
      subscription_data: {
        metadata: { firebaseUid: userId, plan: planKey, planName: displayName },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}
