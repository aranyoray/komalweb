/**
 * Stripe Connected Account Status API
 * ====================================
 *
 * This endpoint retrieves the status of a specific connected account,
 * including onboarding status and payment capability status.
 *
 * ENDPOINT:
 * - GET /api/stripe/connect/accounts/[accountId] - Get account status
 *
 * IMPORTANT: For this demo, we always fetch the account status directly
 * from Stripe's API. In production, you might cache some of this information
 * and update it via webhooks.
 *
 * STATUS INDICATORS:
 * - readyToProcessPayments: true when card_payments capability is active
 * - onboardingComplete: true when no requirements are currently_due or past_due
 */

import { NextRequest, NextResponse } from 'next/server';
import stripeClient from '@/lib/stripe';

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Extract requirements by status from the V2 API entries
 * The V2 API may return requirements in different structures,
 * so we handle this flexibly with proper type handling.
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
      // Handle both possible structures: entry.status or entry with status property
      const entryObj = entry as Record<string, unknown>;
      return entryObj?.status === status;
    })
    .map((entry) => {
      const entryObj = entry as Record<string, unknown>;
      return String(entryObj?.type || 'unknown');
    });
}

// =============================================================================
// GET - Get Connected Account Status
// =============================================================================

/**
 * Retrieves the status of a connected account including:
 * - Basic account information
 * - Onboarding status
 * - Payment capability status
 * - Outstanding requirements
 *
 * Parameters:
 * - accountId: The Stripe account ID (acct_xxx)
 *
 * Returns:
 * {
 *   success: boolean;
 *   account: {
 *     id: string;
 *     displayName: string;
 *     email: string;
 *     readyToProcessPayments: boolean;
 *     onboardingComplete: boolean;
 *     requirementsStatus: string | null;
 *     requirements: {
 *       currentlyDue: string[];
 *       eventuallyDue: string[];
 *       pastDue: string[];
 *     };
 *   }
 * }
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ accountId: string }> }
) {
  try {
    const { accountId } = await params;

    // Validate the account ID format
    if (!accountId || !accountId.startsWith('acct_')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid account ID format. Account IDs should start with "acct_"',
        },
        { status: 400 }
      );
    }

    /**
     * Retrieve the account using V2 API with expanded fields
     *
     * The 'include' parameter allows us to fetch additional data:
     * - configuration.merchant: Merchant capabilities and settings
     * - requirements: Current onboarding requirements
     *
     * This gives us all the information we need to determine:
     * 1. If the account can process payments (card_payments capability active)
     * 2. If onboarding is complete (no currently_due or past_due requirements)
     */
    const account = await stripeClient.v2.core.accounts.retrieve(accountId, {
      include: ['configuration.merchant', 'requirements'],
    });

    /**
     * Check if the account is ready to process payments
     *
     * The account can process payments when the card_payments capability
     * status is "active". Other possible statuses:
     * - 'inactive': Capability not enabled yet
     * - 'pending': Waiting for verification
     * - 'restricted': Limited functionality due to requirements
     */
    const cardPaymentsStatus = account?.configuration?.merchant?.capabilities?.card_payments?.status;
    const readyToProcessPayments = cardPaymentsStatus === 'active';

    /**
     * Check if onboarding is complete
     *
     * Onboarding is considered complete when there are no requirements
     * that are 'currently_due' or 'past_due'. The requirements summary
     * provides a quick way to check this.
     *
     * Possible status values:
     * - 'currently_due': Requirements that must be collected now
     * - 'past_due': Overdue requirements (account may be restricted)
     * - 'eventually_due': Requirements that will be needed in the future
     * - null/undefined: No pending requirements
     */
    const requirementsStatus = account.requirements?.summary?.minimum_deadline?.status;
    const onboardingComplete =
      requirementsStatus !== 'currently_due' && requirementsStatus !== 'past_due';

    // Build the response with detailed status information
    return NextResponse.json({
      success: true,
      account: {
        id: account.id,
        displayName: account.display_name || null,
        email: account.contact_email || null,

        // Payment readiness
        readyToProcessPayments,
        cardPaymentsStatus: cardPaymentsStatus || 'unknown',

        // Onboarding status
        onboardingComplete,
        requirementsStatus: requirementsStatus || null,

        // Detailed requirements (if any)
        // These tell you exactly what information is still needed
        // Note: The V2 API requirements structure may vary, so we handle it flexibly
        requirements: {
          currentlyDue: extractRequirementsByStatus(account.requirements?.entries, 'currently_due'),
          eventuallyDue: extractRequirementsByStatus(account.requirements?.entries, 'eventually_due'),
          pastDue: extractRequirementsByStatus(account.requirements?.entries, 'past_due'),
        },

        // Dashboard access information
        dashboard: account.dashboard,
      },
    });
  } catch (error) {
    console.error('Error retrieving connected account:', error);

    // Handle account not found
    if (error instanceof Error && error.message.includes('No such account')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Connected account not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to retrieve account',
      },
      { status: 500 }
    );
  }
}
