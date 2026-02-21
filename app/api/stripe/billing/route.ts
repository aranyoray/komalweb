import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import stripeClient, { getBaseUrl } from '@/lib/stripe';

// Helper to verify Firebase auth
async function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.split('Bearer ')[1];
  try {
    const decoded = await getAuth().verifyIdToken(token);
    return decoded.uid;
  } catch {
    return null;
  }
}

// GET - Fetch billing data (subscription, invoices, payment method)
export async function GET(request: NextRequest) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();

    // Base response from Firestore
    const baseData = {
      plan: userData?.plan || 'free',
      planName: userData?.planName || 'Free',
      reportsUsed: userData?.reportsUsed || 0,
      subscriptionEndDate: userData?.subscriptionEndDate,
      // Ambassador payment details from Firestore
      ambassadorPayment: userData?.plan === 'ambassador' ? {
        paymentIntentId: userData.paymentIntentId || userData.ambassadorPaymentId || null,
        amountPaid: userData.amountPaid || null,
        currency: userData.currency || 'cad',
        paymentStatus: userData.paymentStatus || null,
        paidAt: userData.ambassadorPaidAt || null,
        receiptUrl: userData.receiptUrl || null,
        cardBrand: userData.cardBrand || null,
        cardLast4: userData.cardLast4 || null,
        checkoutSessionId: userData.ambassadorCheckoutSessionId || null,
      } : null,
    };

    if (!userData?.stripeCustomerId) {
      return NextResponse.json({
        subscription: null,
        invoices: [],
        paymentMethod: null,
        ...baseData,
      });
    }

    const customerId = userData.stripeCustomerId;

    // Fetch subscription, invoices, and payment methods in parallel
    const [subscriptions, invoices, paymentMethods] = await Promise.all([
      stripeClient.subscriptions.list({ customer: customerId, limit: 1 }),
      stripeClient.invoices.list({ customer: customerId, limit: 10 }),
      stripeClient.paymentMethods.list({ customer: customerId, type: 'card' }),
    ]);

    const subscription = subscriptions.data[0] || null;
    const defaultPm = paymentMethods.data[0] || null;

    const subscriptionItem = subscription?.items.data[0];
    const periodEnd = subscriptionItem?.current_period_end;

    // For ambassador users, also fetch the charge receipt if we have a payment intent
    let ambassadorReceipt = baseData.ambassadorPayment?.receiptUrl || null;
    if (userData?.plan === 'ambassador' && !ambassadorReceipt && userData.ambassadorPaymentId) {
      try {
        const pi = await stripeClient.paymentIntents.retrieve(userData.ambassadorPaymentId, {
          expand: ['latest_charge'],
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const charge = pi.latest_charge as any;
        if (charge?.receipt_url) {
          ambassadorReceipt = charge.receipt_url;
          // Backfill receipt URL in Firestore
          await db.collection('users').doc(userId).update({ receiptUrl: charge.receipt_url });
        }
      } catch {
        // Non-critical, skip
      }
    }

    if (baseData.ambassadorPayment) {
      baseData.ambassadorPayment.receiptUrl = ambassadorReceipt;
    }

    return NextResponse.json({
      subscription: subscription
        ? {
            id: subscription.id,
            status: subscription.status,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
            priceId: subscriptionItem?.price?.id,
            amount: subscriptionItem?.price?.unit_amount,
            currency: subscriptionItem?.price?.currency,
            interval: subscriptionItem?.price?.recurring?.interval,
            intervalCount: subscriptionItem?.price?.recurring?.interval_count || 1,
          }
        : null,
      invoices: invoices.data.map((inv) => ({
        id: inv.id,
        amountPaid: inv.amount_paid,
        currency: inv.currency,
        status: inv.status,
        created: new Date(inv.created * 1000).toISOString(),
        invoicePdf: inv.invoice_pdf,
        hostedInvoiceUrl: inv.hosted_invoice_url,
      })),
      paymentMethod: defaultPm?.card
        ? {
            brand: defaultPm.card.brand,
            last4: defaultPm.card.last4,
            expMonth: defaultPm.card.exp_month,
            expYear: defaultPm.card.exp_year,
          }
        : null,
      ...baseData,
    });
  } catch (error) {
    console.error('Billing data error:', error);
    return NextResponse.json({ error: 'Failed to fetch billing data' }, { status: 500 });
  }
}

// POST - Handle billing actions (cancel, portal)
export async function POST(request: NextRequest) {
  try {
    const userId = await verifyAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action } = await request.json();

    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();

    if (!userData?.stripeCustomerId) {
      return NextResponse.json({ error: 'No billing account found' }, { status: 400 });
    }

    const customerId = userData.stripeCustomerId;

    if (action === 'cancel') {
      // Cancel subscription at period end
      if (!userData.subscriptionId) {
        return NextResponse.json({ error: 'No active subscription' }, { status: 400 });
      }

      await stripeClient.subscriptions.update(userData.subscriptionId, {
        cancel_at_period_end: true,
      });

      await db.collection('users').doc(userId).update({
        subscriptionStatus: 'canceling',
      });

      return NextResponse.json({ success: true, message: 'Subscription will cancel at period end' });
    }

    if (action === 'portal') {
      // Create Stripe Customer Portal session
      const baseUrl = getBaseUrl();
      const session = await stripeClient.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${baseUrl}/billing`,
      });

      return NextResponse.json({ url: session.url });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Billing action error:', error);
    return NextResponse.json({ error: 'Failed to process billing action' }, { status: 500 });
  }
}
