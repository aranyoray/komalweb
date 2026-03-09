/**
 * Stripe Client Configuration
 * ===========================
 *
 * This module initializes and exports a Stripe client instance for use throughout
 * the application. It uses the "Stripe Client" pattern recommended by Stripe for
 * all API requests.
 *
 * SETUP INSTRUCTIONS:
 * 1. Get your API keys from https://dashboard.stripe.com/apikeys
 * 2. Add STRIPE_SECRET_KEY to your .env.local file
 * 3. For production, use sk_live_* keys; for testing, use sk_test_* keys
 *
 * The Stripe SDK version (2026-01-28.clover) is automatically used by the SDK,
 * so you don't need to set it manually.
 */

import Stripe from 'stripe';

// =============================================================================
// ENVIRONMENT VARIABLE VALIDATION
// =============================================================================

// =============================================================================
// STRIPE CLIENT INITIALIZATION (Lazy)
// =============================================================================

/**
 * Stripe Client Instance
 *
 * This client is used for ALL Stripe API requests in the application.
 * The SDK automatically uses the latest API version (2026-01-28.clover).
 *
 * IMPORTANT: The client is initialized lazily to allow the build to complete
 * without requiring the STRIPE_SECRET_KEY to be present at build time.
 * The key is validated when the client is first accessed.
 *
 * Usage examples:
 *
 * // Create a customer
 * const customer = await stripeClient.customers.create({ email: 'test@example.com' });
 *
 * // Create a V2 Connected Account
 * const account = await stripeClient.v2.core.accounts.create({ ... });
 *
 * // Create a product on a connected account
 * const product = await stripeClient.products.create(
 *   { name: 'Product' },
 *   { stripeAccount: 'acct_xxx' }
 * );
 */

let _stripeClient: Stripe | null = null;

/**
 * Get the Stripe client instance (lazy initialization)
 *
 * PLACEHOLDER: STRIPE_SECRET_KEY
 *
 * Your Stripe secret API key is required for all API operations.
 * - Test keys start with: sk_test_
 * - Live keys start with: sk_live_
 *
 * Get your key from: https://dashboard.stripe.com/apikeys
 *
 * Add to your .env.local file:
 * STRIPE_SECRET_KEY=sk_test_your_key_here
 */
function getStripeClient(): Stripe {
  if (_stripeClient) {
    return _stripeClient;
  }

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    throw new Error(
      '\n\n' +
      '========================================\n' +
      'STRIPE_SECRET_KEY is not configured!\n' +
      '========================================\n\n' +
      'To fix this:\n' +
      '1. Go to https://dashboard.stripe.com/apikeys\n' +
      '2. Copy your Secret Key (starts with sk_test_ or sk_live_)\n' +
      '3. Add it to your .env.local file:\n\n' +
      '   STRIPE_SECRET_KEY=sk_test_your_key_here\n\n' +
      '4. Restart your development server\n\n'
    );
  }

  // Validate key format
  if (!stripeSecretKey.startsWith('sk_test_') && !stripeSecretKey.startsWith('sk_live_')) {
    throw new Error(
      '\n\n' +
      '========================================\n' +
      'Invalid STRIPE_SECRET_KEY format!\n' +
      '========================================\n\n' +
      'Your Stripe secret key should start with:\n' +
      '- sk_test_ (for test mode)\n' +
      '- sk_live_ (for live mode)\n\n' +
      'Your key does not start with sk_test_ or sk_live_.\n\n' +
      'Get the correct key from: https://dashboard.stripe.com/apikeys\n\n'
    );
  }

  _stripeClient = new Stripe(stripeSecretKey);
  return _stripeClient;
}

// Export a proxy that lazily initializes the client
// This allows imports to work without immediately requiring the key
const stripeClient = new Proxy({} as Stripe, {
  get(_, prop) {
    const client = getStripeClient();
    const value = client[prop as keyof Stripe];
    if (typeof value === 'function') {
      return value.bind(client);
    }
    return value;
  },
});

export default stripeClient;

// =============================================================================
// WEBHOOK SECRETS
// =============================================================================

/**
 * V2 Webhook Secret (for thin events)
 *
 * Used for V2 account events like:
 * - v2.core.account[requirements].updated
 * - v2.core.account[configuration.merchant].capability_status_updated
 *
 * Get this from: Dashboard > Developers > Webhooks
 * When creating the webhook, select "Thin" payload style and "Connected accounts"
 */
export const getWebhookSecretV2 = (): string => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET_V2;
  if (!secret) {
    throw new Error(
      '\n\n' +
      '========================================\n' +
      'STRIPE_WEBHOOK_SECRET_V2 is not configured!\n' +
      '========================================\n\n' +
      'This secret is required for V2 account webhooks.\n\n' +
      'To set up:\n' +
      '1. Go to Dashboard > Developers > Webhooks\n' +
      '2. Click "+ Add destination"\n' +
      '3. Select "Connected accounts" in Events from\n' +
      '4. Click "Show advanced options" > Select "Thin" payload style\n' +
      '5. Add event types starting with "v2."\n' +
      '6. Copy the signing secret and add to .env.local:\n\n' +
      '   STRIPE_WEBHOOK_SECRET_V2=whsec_your_secret_here\n\n'
    );
  }
  return secret;
};

/**
 * Standard Webhook Secret (for V1 events like subscriptions)
 *
 * Used for standard webhook events like:
 * - customer.subscription.updated
 * - customer.subscription.deleted
 * - invoice.paid
 *
 * Get this from: Dashboard > Developers > Webhooks
 */
export const getWebhookSecret = (): string => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error(
      '\n\n' +
      '========================================\n' +
      'STRIPE_WEBHOOK_SECRET is not configured!\n' +
      '========================================\n\n' +
      'This secret is required for subscription webhooks.\n\n' +
      'To set up:\n' +
      '1. Go to Dashboard > Developers > Webhooks\n' +
      '2. Click "+ Add endpoint"\n' +
      '3. Add your webhook URL and select events\n' +
      '4. Copy the signing secret and add to .env.local:\n\n' +
      '   STRIPE_WEBHOOK_SECRET=whsec_your_secret_here\n\n'
    );
  }
  return secret;
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get the base URL for the application
 * Used for constructing return URLs and success URLs
 */
export const getBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_BASE_URL || 'https://komalkids.com';
};

/**
 * Get the platform subscription price ID
 * This is the price that connected accounts subscribe to
 */
export const getPlatformPriceId = (): string => {
  const priceId = process.env.STRIPE_PLATFORM_PRICE_ID;
  if (!priceId) {
    throw new Error(
      '\n\n' +
      '========================================\n' +
      'STRIPE_PLATFORM_PRICE_ID is not configured!\n' +
      '========================================\n\n' +
      'This is required to charge subscriptions to connected accounts.\n\n' +
      'To set up:\n' +
      '1. Go to Dashboard > Products\n' +
      '2. Create a product for your platform subscription\n' +
      '3. Copy the Price ID (starts with price_)\n' +
      '4. Add to .env.local:\n\n' +
      '   STRIPE_PLATFORM_PRICE_ID=price_xxx\n\n'
    );
  }
  return priceId;
};

// =============================================================================
// TYPE EXPORTS FOR CONVENIENCE
// =============================================================================

export type { Stripe };
