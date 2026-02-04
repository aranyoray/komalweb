/**
 * Stripe Connect Products API
 * ============================
 *
 * This endpoint handles creating and listing products on connected accounts.
 * Products are created using the Stripe-Account header to associate them
 * with the connected account rather than the platform account.
 *
 * ENDPOINTS:
 * - POST /api/stripe/connect/products - Create a product on a connected account
 * - GET /api/stripe/connect/products?accountId=acct_xxx - List products for an account
 *
 * IMPORTANT: Products created here belong to the connected account.
 * When customers purchase these products, the payment goes to the
 * connected account (minus any platform fees).
 */

import { NextRequest, NextResponse } from 'next/server';
import stripeClient from '@/lib/stripe';

// =============================================================================
// POST - Create a Product on a Connected Account
// =============================================================================

/**
 * Creates a new product with a default price on a connected account
 *
 * Request body:
 * {
 *   accountId: string;      // The connected account ID (acct_xxx)
 *   name: string;           // Product name
 *   description?: string;   // Product description
 *   priceInCents: number;   // Price in cents (e.g., 1999 for $19.99)
 *   currency?: string;      // Currency code (default: 'usd')
 *   imageUrl?: string;      // URL to product image
 * }
 *
 * Returns:
 * {
 *   success: boolean;
 *   product: {
 *     id: string;           // Product ID
 *     name: string;
 *     priceId: string;      // Default price ID for checkout
 *     priceInCents: number;
 *   }
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      accountId,
      name,
      description,
      priceInCents,
      currency = 'usd',
      imageUrl,
    } = body;

    // Validate required fields
    if (!accountId || !name || !priceInCents) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: accountId, name, and priceInCents are required',
        },
        { status: 400 }
      );
    }

    // Validate account ID format
    if (!accountId.startsWith('acct_')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid account ID format',
        },
        { status: 400 }
      );
    }

    // Validate price
    if (priceInCents < 50) {
      return NextResponse.json(
        {
          success: false,
          error: 'Price must be at least 50 cents',
        },
        { status: 400 }
      );
    }

    /**
     * Create a product with a default price on the connected account
     *
     * The stripeAccount option in the second parameter sets the
     * Stripe-Account header, which tells Stripe to create the product
     * on the connected account rather than the platform account.
     *
     * Using default_price_data creates both the product and price
     * in a single API call, which is more efficient.
     */
    const product = await stripeClient.products.create(
      {
        // Product details
        name: name,
        description: description || undefined,

        // Product images (optional)
        images: imageUrl ? [imageUrl] : undefined,

        // Create a default price along with the product
        // This price will be used when creating checkout sessions
        default_price_data: {
          // Price in the smallest currency unit (cents for USD)
          unit_amount: priceInCents,

          // Currency code (lowercase)
          currency: currency.toLowerCase(),
        },
      },
      {
        // IMPORTANT: This sets the Stripe-Account header
        // The product will be created on the connected account
        stripeAccount: accountId,
      }
    );

    // Return the created product information
    return NextResponse.json({
      success: true,
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        // The default_price is the price ID to use for checkout
        priceId: typeof product.default_price === 'string'
          ? product.default_price
          : product.default_price?.id,
        priceInCents: priceInCents,
        currency: currency,
        imageUrl: product.images?.[0] || null,
      },
      message: 'Product created successfully on the connected account',
    });
  } catch (error) {
    console.error('Error creating product:', error);

    if (error instanceof Error) {
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
        error: 'Failed to create product',
      },
      { status: 500 }
    );
  }
}

// =============================================================================
// GET - List Products on a Connected Account
// =============================================================================

/**
 * Lists active products on a connected account
 *
 * Query parameters:
 * - accountId: string (required) - The connected account ID
 * - limit: number (optional, default: 20) - Number of products to return
 *
 * Returns:
 * {
 *   success: boolean;
 *   products: Array<{
 *     id: string;
 *     name: string;
 *     description: string;
 *     priceId: string;
 *     priceInCents: number;
 *     currency: string;
 *     imageUrl: string;
 *   }>;
 *   hasMore: boolean;
 * }
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('accountId');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);

    // Validate account ID
    if (!accountId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required query parameter: accountId',
        },
        { status: 400 }
      );
    }

    if (!accountId.startsWith('acct_')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid account ID format',
        },
        { status: 400 }
      );
    }

    /**
     * List products from the connected account
     *
     * We expand 'data.default_price' to get the price information
     * in the same API call, avoiding additional requests.
     *
     * The stripeAccount option sets the Stripe-Account header to
     * fetch products from the connected account.
     */
    const products = await stripeClient.products.list(
      {
        // Only return active products (not archived)
        active: true,

        // Number of products to return
        limit: limit,

        // Expand the default_price to get price details
        expand: ['data.default_price'],
      },
      {
        // Fetch products from the connected account
        stripeAccount: accountId,
      }
    );

    // Transform the products into a cleaner format
    const formattedProducts = products.data.map((product) => {
      // Get the price information
      const price = typeof product.default_price === 'object'
        ? product.default_price
        : null;

      return {
        id: product.id,
        name: product.name,
        description: product.description || null,
        priceId: price?.id || null,
        priceInCents: price?.unit_amount || null,
        currency: price?.currency || null,
        imageUrl: product.images?.[0] || null,
        created: product.created,
      };
    });

    return NextResponse.json({
      success: true,
      products: formattedProducts,
      hasMore: products.has_more,
      accountId: accountId,
    });
  } catch (error) {
    console.error('Error listing products:', error);

    if (error instanceof Error) {
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
        error: 'Failed to list products',
      },
      { status: 500 }
    );
  }
}
