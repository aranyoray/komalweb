/**
 * Stripe Account Links API
 * =========================
 *
 * This endpoint creates Account Links for onboarding connected accounts.
 * Account Links provide a hosted onboarding flow where users can:
 * - Verify their identity
 * - Add bank account information
 * - Accept Stripe's terms of service
 *
 * ENDPOINT:
 * - POST /api/stripe/connect/account-links - Create an account link
 *
 * ONBOARDING FLOW:
 * 1. User creates a connected account (POST /api/stripe/connect/accounts)
 * 2. Platform creates an account link (this endpoint)
 * 3. User is redirected to the Stripe-hosted onboarding page
 * 4. After completion, user is redirected to your return_url
 * 5. Platform checks account status to verify onboarding completion
 *
 * V2 ACCOUNT LINKS API:
 * Uses stripeClient.v2.core.accountLinks.create() with use_case configuration
 * to specify the onboarding flow.
 */

import { NextRequest, NextResponse } from 'next/server';
import stripeClient, { getBaseUrl } from '@/lib/stripe';

// =============================================================================
// POST - Create an Account Link for Onboarding
// =============================================================================

/**
 * Creates a Stripe Account Link for onboarding a connected account
 *
 * Request body:
 * {
 *   accountId: string;     // The connected account ID (acct_xxx)
 *   returnPath?: string;   // Path to redirect after completion (default: '/connect/dashboard')
 *   refreshPath?: string;  // Path to redirect if link expires (default: '/connect/dashboard')
 * }
 *
 * Returns:
 * {
 *   success: boolean;
 *   url: string;           // The URL to redirect the user to for onboarding
 *   expiresAt: number;     // Unix timestamp when the link expires
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      accountId,
      returnPath = '/connect/dashboard',
      refreshPath = '/connect/dashboard',
    } = body;

    // Validate the account ID
    if (!accountId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required field: accountId',
        },
        { status: 400 }
      );
    }

    if (!accountId.startsWith('acct_')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid account ID format. Account IDs should start with "acct_"',
        },
        { status: 400 }
      );
    }

    // Get the base URL for constructing return URLs
    const baseUrl = getBaseUrl();

    /**
     * Create an Account Link using the V2 API
     *
     * V2 Account Link Configuration:
     * - use_case.type: 'account_onboarding' for initial onboarding flow
     * - configurations: ['merchant', 'customer'] to collect info for both
     * - refresh_url: Where to redirect if the link expires or user needs to restart
     * - return_url: Where to redirect after successful completion
     *
     * IMPORTANT: Include the accountId in the return_url as a query parameter
     * so you can check the account status after the user returns.
     */
    const accountLink = await stripeClient.v2.core.accountLinks.create({
      // The connected account to onboard
      account: accountId,

      // Use case configuration
      use_case: {
        // Type of link - account_onboarding for initial setup
        type: 'account_onboarding',

        // Onboarding-specific configuration
        account_onboarding: {
          // Which configurations to collect information for
          // 'merchant' - for processing payments
          // 'customer' - for customer management features
          configurations: ['merchant', 'customer'],

          // URL to redirect if the link expires or user needs to refresh
          // Account links expire after a short time for security
          refresh_url: `${baseUrl}${refreshPath}?refresh=true&accountId=${accountId}`,

          // URL to redirect after successful onboarding completion
          // Include accountId so you can verify the account status
          return_url: `${baseUrl}${returnPath}?accountId=${accountId}&onboarding=complete`,
        },
      },
    });

    /**
     * Return the account link URL
     *
     * The frontend should redirect the user to this URL to begin onboarding.
     * After the user completes onboarding, they'll be redirected to your
     * return_url where you should check their account status.
     *
     * IMPORTANT: Account links are single-use and expire quickly.
     * Generate a new link each time the user needs to complete onboarding.
     */
    return NextResponse.json({
      success: true,
      url: accountLink.url,
      // Note: V2 account links may have different expiry handling
      message: 'Account link created. Redirect the user to this URL to complete onboarding.',
    });
  } catch (error) {
    console.error('Error creating account link:', error);

    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes('No such account')) {
        return NextResponse.json(
          {
            success: false,
            error: 'Connected account not found. Create an account first.',
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create account link',
      },
      { status: 500 }
    );
  }
}
