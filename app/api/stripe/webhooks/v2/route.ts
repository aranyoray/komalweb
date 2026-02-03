/**
 * Stripe V2 Webhooks - Thin Events Handler
 * =========================================
 *
 * This endpoint handles V2 "thin" webhook events for connected accounts.
 * Thin events contain minimal data and require fetching the full event
 * to access the complete payload.
 *
 * ENDPOINT:
 * - POST /api/stripe/webhooks/v2 - Receive thin events
 *
 * THIN EVENTS VS FULL EVENTS:
 * - Thin events: Contain only event ID and type, must fetch full data
 * - Full events: Contain complete event data in the webhook payload
 *
 * V2 thin events are used for:
 * - Account requirements changes
 * - Capability status updates
 * - Configuration changes
 *
 * SETUP INSTRUCTIONS:
 * 1. Go to Stripe Dashboard > Developers > Webhooks
 * 2. Click "+ Add destination"
 * 3. In "Events from" section, select "Connected accounts"
 * 4. Click "Show advanced options" and select "Thin" payload style
 * 5. Add the following event types:
 *    - v2.core.account[requirements].updated
 *    - v2.core.account[configuration.merchant].capability_status_updated
 *    - v2.core.account[configuration.customer].capability_status_updated
 * 6. Set the endpoint URL to: https://your-domain.com/api/stripe/webhooks/v2
 * 7. Copy the signing secret to STRIPE_WEBHOOK_SECRET_V2
 *
 * LOCAL TESTING:
 * Use the Stripe CLI to forward events to your local server:
 *
 * stripe listen --thin-events 'v2.core.account[requirements].updated,v2.core.account[configuration.merchant].capability_status_updated,v2.core.account[configuration.customer].capability_status_updated' --forward-thin-to http://localhost:3001/api/stripe/webhooks/v2
 */

import { NextRequest, NextResponse } from 'next/server';
import stripeClient, { getWebhookSecretV2 } from '@/lib/stripe';

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Extract requirements by status from the V2 API entries
 */
function extractRequirementsByStatus(
  entries: unknown[] | undefined,
  status: string
): string[] {
  if (!entries || !Array.isArray(entries)) {
    return [];
  }

  return entries
    .filter((entry) => {
      const entryObj = entry as Record<string, unknown>;
      return entryObj?.status === status;
    })
    .map((entry) => {
      const entryObj = entry as Record<string, unknown>;
      return String(entryObj?.type || 'unknown');
    });
}

// =============================================================================
// POST - Handle V2 Thin Events
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
    const webhookSecret = getWebhookSecretV2();

    /**
     * Parse the thin event
     *
     * Thin events are parsed differently from regular events.
     * In the newer Stripe SDK, thin events may be parsed using
     * webhooks.constructEvent or a custom approach.
     *
     * The thin event only contains:
     * - id: The event ID
     * - type: The event type
     * - created: When the event was created
     * - related_object: Reference to the affected object
     */
    // Parse the thin event payload - thin events are JSON with minimal data
    let thinEvent: { id: string; type: string; related_object?: { id?: string } };
    try {
      // Verify the signature using the standard webhook verification
      // For thin events, we parse the body as JSON after verification
      stripeClient.webhooks.constructEvent(body, signature, webhookSecret);
      thinEvent = JSON.parse(body);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    console.log(`Received thin event: ${thinEvent.type} (${thinEvent.id})`);

    /**
     * Fetch the full event data
     *
     * Since thin events don't include the full payload, we need to
     * fetch the complete event data using the event ID.
     */
    const event = await stripeClient.v2.core.events.retrieve(thinEvent.id);

    console.log(`Processing event type: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      // =======================================================================
      // Account Requirements Updated
      // =======================================================================
      case 'v2.core.account[requirements].updated':
        await handleRequirementsUpdated(event);
        break;

      // =======================================================================
      // Merchant Capability Status Updated
      // =======================================================================
      case 'v2.core.account[configuration.merchant].capability_status_updated':
        await handleMerchantCapabilityUpdated(event);
        break;

      // =======================================================================
      // Customer Capability Status Updated
      // =======================================================================
      case 'v2.core.account[configuration.customer].capability_status_updated':
        await handleCustomerCapabilityUpdated(event);
        break;

      // =======================================================================
      // Recipient Capability Status Updated
      // =======================================================================
      case 'v2.core.account[configuration.recipient].capability_status_updated':
        await handleRecipientCapabilityUpdated(event);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return 200 to acknowledge receipt
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);

    // Return 400 for signature verification failures
    if (error instanceof Error && error.message.includes('signature')) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Return 500 for other errors but still acknowledge
    // (to prevent Stripe from retrying indefinitely)
    return NextResponse.json(
      { error: 'Webhook handler error' },
      { status: 500 }
    );
  }
}

// =============================================================================
// Event Handlers
// =============================================================================

/**
 * Handle account requirements updated event
 *
 * This is triggered when:
 * - New requirements are added (e.g., due to regulatory changes)
 * - Requirements are satisfied
 * - Requirements become past due
 *
 * You should notify the connected account owner when new requirements
 * need to be collected to maintain their account status.
 */
async function handleRequirementsUpdated(event: Awaited<ReturnType<typeof stripeClient.v2.core.events.retrieve>>) {
  console.log('Processing requirements update event');

  // Extract account ID from the event
  // The structure depends on the event type - cast to access related_object
  const eventData = event as unknown as { related_object?: { id?: string } };
  const accountId = eventData.related_object?.id;

  if (!accountId) {
    console.error('Could not extract account ID from event');
    return;
  }

  console.log(`Account ${accountId} requirements updated`);

  /**
   * Fetch the current account status to see what's required
   */
  try {
    const account = await stripeClient.v2.core.accounts.retrieve(accountId, {
      include: ['requirements'],
    });

    const currentlyDue = extractRequirementsByStatus(account.requirements?.entries, 'currently_due');
    const pastDue = extractRequirementsByStatus(account.requirements?.entries, 'past_due');

    console.log('Currently due requirements:', currentlyDue);
    console.log('Past due requirements:', pastDue);

    /**
     * TODO: Notify the connected account owner
     *
     * Example actions:
     * 1. Send an email notification
     * 2. Update your database with the new status
     * 3. Show a banner in their dashboard
     *
     * await sendEmail({
     *   to: accountOwnerEmail,
     *   subject: 'Action Required: Update Your Account',
     *   body: `Please complete the following requirements: ${currentlyDue.join(', ')}`
     * });
     *
     * await db.collection('users').doc(userId).update({
     *   stripeRequirementsStatus: 'action_required',
     *   stripeRequirementsDue: currentlyDue,
     * });
     */
  } catch (fetchError) {
    console.error('Error fetching account details:', fetchError);
  }
}

/**
 * Handle merchant capability status updated event
 *
 * This is triggered when the status of merchant capabilities changes.
 * For example:
 * - card_payments becomes active
 * - card_payments becomes restricted
 *
 * Monitor this to know when accounts can start processing payments
 * or when they've been restricted.
 */
async function handleMerchantCapabilityUpdated(event: Awaited<ReturnType<typeof stripeClient.v2.core.events.retrieve>>) {
  console.log('Processing merchant capability update event');

  const eventData = event as unknown as { related_object?: { id?: string } };
  const accountId = eventData.related_object?.id;

  if (!accountId) {
    console.error('Could not extract account ID from event');
    return;
  }

  console.log(`Account ${accountId} merchant capability updated`);

  /**
   * Fetch the current capability status
   */
  try {
    const account = await stripeClient.v2.core.accounts.retrieve(accountId, {
      include: ['configuration.merchant'],
    });

    const cardPaymentsStatus = account.configuration?.merchant?.capabilities?.card_payments?.status;
    console.log(`Card payments status: ${cardPaymentsStatus}`);

    /**
     * TODO: Update your database with the capability status
     *
     * await db.collection('users').doc(userId).update({
     *   stripeCardPaymentsEnabled: cardPaymentsStatus === 'active',
     *   stripeCapabilityStatus: cardPaymentsStatus,
     * });
     *
     * If the capability became active, you might want to:
     * - Send a congratulations email
     * - Enable selling features in your app
     * - Log the milestone
     *
     * If the capability was restricted, you might want to:
     * - Disable selling features
     * - Notify the account owner
     * - Log for support follow-up
     */
  } catch (fetchError) {
    console.error('Error fetching account details:', fetchError);
  }
}

/**
 * Handle customer capability status updated event
 *
 * Similar to merchant capabilities, but for customer-related features.
 */
async function handleCustomerCapabilityUpdated(event: Awaited<ReturnType<typeof stripeClient.v2.core.events.retrieve>>) {
  console.log('Processing customer capability update event');

  const eventData = event as unknown as { related_object?: { id?: string } };
  const accountId = eventData.related_object?.id;

  if (!accountId) {
    console.error('Could not extract account ID from event');
    return;
  }

  console.log(`Account ${accountId} customer capability updated`);

  /**
   * TODO: Handle customer capability changes
   *
   * This might affect features like:
   * - Customer management
   * - Saved payment methods
   * - Customer portal access
   */
}

/**
 * Handle recipient capability status updated event
 *
 * This is for accounts that receive payouts.
 */
async function handleRecipientCapabilityUpdated(event: Awaited<ReturnType<typeof stripeClient.v2.core.events.retrieve>>) {
  console.log('Processing recipient capability update event');

  const eventData = event as unknown as { related_object?: { id?: string } };
  const accountId = eventData.related_object?.id;

  if (!accountId) {
    console.error('Could not extract account ID from event');
    return;
  }

  console.log(`Account ${accountId} recipient capability updated`);

  /**
   * TODO: Handle recipient capability changes
   *
   * This affects the account's ability to receive payouts.
   * If restricted, the account won't be able to withdraw funds.
   */
}
