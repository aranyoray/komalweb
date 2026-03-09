/**
 * Stripe Connect Accounts API
 * ===========================
 *
 * This endpoint handles creating and listing connected accounts using the
 * Stripe V2 Accounts API. Connected accounts allow your users (sellers/merchants)
 * to accept payments through your platform.
 *
 * ENDPOINTS:
 * - POST /api/stripe/connect/accounts - Create a new connected account
 * - GET /api/stripe/connect/accounts - List all connected accounts
 *
 * V2 ACCOUNTS API NOTES:
 * - Uses stripeClient.v2.core.accounts.create() for account creation
 * - Does NOT use top-level 'type' parameter (no 'express', 'standard', or 'custom')
 * - Uses 'configuration' object to specify capabilities
 * - Uses 'defaults.responsibilities' to specify who handles fees and losses
 *
 * WEBHOOK SETUP FOR REQUIREMENTS CHANGES:
 * 1. In Stripe Dashboard > Developers > Webhooks, click "+ Add destination"
 * 2. Select "Connected accounts" in the Events from section
 * 3. Click "Show advanced options" and select "Thin" payload style
 * 4. Add event types:
 *    - v2.core.account[requirements].updated
 *    - v2.core.account[configuration.merchant].capability_status_updated
 *    - v2.core.account[configuration.customer].capability_status_updated
 *
 * LOCAL TESTING WITH STRIPE CLI:
 * stripe listen --thin-events 'v2.core.account[requirements].updated,v2.core.account[configuration.merchant].capability_status_updated,v2.core.account[configuration.customer].capability_status_updated' --forward-thin-to http://localhost:3001/api/stripe/webhooks/v2
 */

import { NextRequest, NextResponse } from 'next/server';
import stripeClient from '@/lib/stripe';
import { db } from '@/lib/firebase-admin';
import { requireAuth, isAuthError } from '@/lib/connect-auth';
import { isRateLimited, getClientIp } from '@/lib/rate-limit';

// =============================================================================
// POST - Create a new Connected Account
// =============================================================================

/**
 * Creates a new Stripe Connected Account using the V2 API
 *
 * Request body:
 * {
 *   displayName: string;  // The display name for the account (shown in dashboard)
 *   email: string;        // Contact email for the account
 *   country?: string;     // ISO country code (default: 'us')
 * }
 *
 * Returns:
 * {
 *   success: boolean;
 *   account: {
 *     id: string;         // Account ID (acct_xxx) - store this in your database!
 *     displayName: string;
 *     email: string;
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);
    if (isRateLimited(`connect-accounts-post:${ip}`, 5, 60_000)) {
      return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
    }

    // Require authenticated user
    const auth = await requireAuth(request);
    if (isAuthError(auth)) return auth;

    // Parse the request body
    const body = await request.json();
    const { displayName, email, country = 'us' } = body;

    // Validate required fields
    if (!displayName || !email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: displayName and email are required',
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email format',
        },
        { status: 400 }
      );
    }

    /**
     * Create the connected account using V2 API
     *
     * IMPORTANT: V2 Account Creation Notes:
     * - DO NOT use top-level 'type' parameter (no 'express', 'standard', 'custom')
     * - Use 'dashboard: full' to give the connected account access to Stripe Dashboard
     * - Use 'defaults.responsibilities' to specify Stripe handles fees and losses
     * - Use 'configuration.merchant' for payment processing capabilities
     * - Use 'configuration.customer' for customer management capabilities
     */
    const account = await stripeClient.v2.core.accounts.create({
      // Display name shown in Stripe Dashboard and receipts
      display_name: displayName,

      // Contact email for the account
      contact_email: email,

      // Identity information - country is required
      identity: {
        country: country.toLowerCase(),
      },

      // Give the connected account full dashboard access
      // Options: 'full' | 'none' | 'express'
      dashboard: 'full',

      // Default settings for the account
      defaults: {
        // Who is responsible for fees and losses
        // 'stripe' means Stripe handles these (simpler for platforms)
        // 'application' means your platform handles these (more control)
        responsibilities: {
          fees_collector: 'stripe',
          losses_collector: 'stripe',
        },
      },

      // Configuration for different account features
      configuration: {
        // Customer configuration - enables customer management
        customer: {},

        // Merchant configuration - enables payment processing
        merchant: {
          // Capabilities the account needs
          capabilities: {
            // Enable card payments (most common)
            card_payments: {
              requested: true,
            },
            // You can also request other capabilities:
            // transfers: { requested: true },
            // us_bank_account_ach_payments: { requested: true },
          },
        },
      },
    });

    // Store the account ID in the user's Firestore document
    await db!.collection('users').doc(auth.userId).update({
      stripeAccountId: account.id,
    });

    // Return the created account information
    return NextResponse.json({
      success: true,
      account: {
        id: account.id,
        displayName: account.display_name,
        email: account.contact_email,
      },
      message: 'Connected account created successfully. Next step: Create an account link for onboarding.',
    });
  } catch (error) {
    console.error('Error creating connected account:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create connected account',
      },
      { status: 500 }
    );
  }
}

// =============================================================================
// GET - List Connected Accounts
// =============================================================================

/**
 * Lists connected accounts for the platform
 *
 * Query parameters:
 * - limit: number (default: 10, max: 100)
 *
 * NOTE: In production, you should filter accounts based on your own database
 * records rather than listing all accounts from Stripe.
 */
export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);
    if (isRateLimited(`connect-accounts-get:${ip}`, 20, 60_000)) {
      return NextResponse.json({ success: false, error: 'Too many requests' }, { status: 429 });
    }

    // Require authenticated user
    const auth = await requireAuth(request);
    if (isAuthError(auth)) return auth;

    // Only return the authenticated user's own connected account
    const userDoc = await db!.collection('users').doc(auth.userId).get();
    const stripeAccountId = userDoc.data()?.stripeAccountId;

    if (!stripeAccountId) {
      return NextResponse.json({ success: true, accounts: [], hasMore: false });
    }

    try {
      const account = await stripeClient.accounts.retrieve(stripeAccountId);
      return NextResponse.json({
        success: true,
        accounts: [{
          id: account.id,
          email: account.email,
          chargesEnabled: account.charges_enabled,
          payoutsEnabled: account.payouts_enabled,
          created: account.created,
        }],
        hasMore: false,
      });
    } catch {
      return NextResponse.json({ success: true, accounts: [], hasMore: false });
    }
  } catch (error) {
    console.error('Error listing connected accounts:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to list accounts',
      },
      { status: 500 }
    );
  }
}
