/**
 * Storefront Page
 * ===============
 *
 * This page displays products from a connected account and allows customers
 * to purchase them. Each connected account has their own storefront URL.
 *
 * URL STRUCTURE:
 * /connect/storefront/[accountId]
 *
 * IMPORTANT NOTE FOR PRODUCTION:
 * In production, you should NOT use the Stripe account ID directly in the URL.
 * Instead, use a different identifier such as:
 * - A username or business slug (/store/acme-widgets)
 * - A database ID that maps to the Stripe account
 * - A UUID that can be looked up in your database
 *
 * This provides:
 * - Better security (account IDs are not exposed)
 * - Flexibility to change underlying Stripe accounts
 * - Better SEO with meaningful URLs
 *
 * CHECKOUT FLOW:
 * 1. Customer browses products on this page
 * 2. Customer clicks "Buy Now" on a product
 * 3. Platform creates a checkout session with direct charges
 * 4. Customer completes payment on Stripe's hosted checkout
 * 5. Customer is redirected to success page
 * 6. Connected account receives payment (minus platform fee)
 */

'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// =============================================================================
// Type Definitions
// =============================================================================

interface Product {
  id: string;
  name: string;
  description: string | null;
  priceId: string | null;
  priceInCents: number | null;
  currency: string | null;
  imageUrl: string | null;
}

// =============================================================================
// Main Component
// =============================================================================

export default function Storefront({ params }: { params: Promise<{ accountId: string }> }) {
  const resolvedParams = use(params);
  const accountId = resolvedParams.accountId;

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const { getIdToken } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasingProductId, setPurchasingProductId] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Fetch Products
  // ---------------------------------------------------------------------------

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = await getIdToken();
      if (!token) { setError('Please sign in'); setIsLoading(false); return; }
      const response = await fetch(`/api/stripe/connect/products?accountId=${accountId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.success) {
        setProducts(data.products);
      } else {
        setError(data.error || 'Failed to load products');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [accountId, getIdToken]);

  useEffect(() => {
    if (accountId) {
      fetchProducts();
    }
  }, [accountId, fetchProducts]);

  // ---------------------------------------------------------------------------
  // Handle Purchase
  // ---------------------------------------------------------------------------

  const handlePurchase = async (product: Product) => {
    if (!product.priceId || !product.priceInCents) {
      setError('This product is not available for purchase');
      return;
    }

    setPurchasingProductId(product.id);
    setError(null);

    try {
      const token = await getIdToken();
      if (!token) { setError('Please sign in'); setPurchasingProductId(null); return; }
      const response = await fetch('/api/stripe/connect/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          accountId,
          priceId: product.priceId,
          quantity: 1,
          // 10% application fee for the platform
          applicationFeePercent: 10,
          successPath: '/connect/success',
          cancelPath: `/connect/storefront/${accountId}`,
        }),
      });

      const data = await response.json();

      if (data.success && data.url && typeof data.url === 'string' && data.url.startsWith('https://')) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        setError(data.error || 'Failed to start checkout');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error(err);
    } finally {
      setPurchasingProductId(null);
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Store</h1>
          <p style={styles.subtitle}>
            Browse and purchase products from this seller.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={styles.errorBox}>
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div style={styles.loadingContainer}>
            <p>Loading products...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && products.length === 0 && !error && (
          <div style={styles.emptyState}>
            <h2 style={styles.emptyTitle}>No Products Available</h2>
            <p style={styles.emptyDescription}>
              This store doesn&apos;t have any products yet. Check back later!
            </p>
          </div>
        )}

        {/* Product Grid */}
        {!isLoading && products.length > 0 && (
          <div style={styles.productGrid}>
            {products.map((product) => (
              <div key={product.id} style={styles.productCard}>
                {/* Product Image Placeholder */}
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={styles.productImage}
                  />
                ) : (
                  <div style={styles.productImagePlaceholder}>
                    <span style={styles.placeholderIcon}>📦</span>
                  </div>
                )}

                {/* Product Details */}
                <div style={styles.productDetails}>
                  <h3 style={styles.productName}>{product.name}</h3>
                  {product.description && (
                    <p style={styles.productDescription}>{product.description}</p>
                  )}
                  <div style={styles.productFooter}>
                    <span style={styles.productPrice}>
                      ${((product.priceInCents || 0) / 100).toFixed(2)}
                      <span style={styles.currencyLabel}>
                        {' '}{product.currency?.toUpperCase() || 'USD'}
                      </span>
                    </span>
                    <button
                      onClick={() => handlePurchase(product)}
                      disabled={purchasingProductId === product.id || !product.priceId}
                      style={{
                        ...styles.buyButton,
                        opacity: purchasingProductId === product.id ? 0.7 : 1,
                      }}
                    >
                      {purchasingProductId === product.id ? 'Processing...' : 'Buy Now'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Note */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Payments are processed securely by Stripe.
            <br />
            <small style={styles.smallText}>
              This storefront is powered by Stripe Connect.
            </small>
          </p>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Styles
// =============================================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    padding: '2rem 1rem',
  },
  content: {
    maxWidth: '1000px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1.125rem',
    color: '#6b7280',
  },
  errorBox: {
    padding: '1rem',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '0.5rem',
    color: '#991b1b',
    marginBottom: '1.5rem',
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '3rem',
    color: '#6b7280',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    backgroundColor: '#ffffff',
    borderRadius: '1rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '0.5rem',
  },
  emptyDescription: {
    fontSize: '1rem',
    color: '#6b7280',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: '1rem',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    transition: 'box-shadow 0.2s, transform 0.2s',
  },
  productImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  productImagePlaceholder: {
    width: '100%',
    height: '200px',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: '4rem',
    opacity: 0.5,
  },
  productDetails: {
    padding: '1.25rem',
  },
  productName: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '0.5rem',
  },
  productDescription: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '1rem',
    lineHeight: 1.5,
  },
  productFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '1rem',
    borderTop: '1px solid #e5e7eb',
  },
  productPrice: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#111827',
  },
  currencyLabel: {
    fontSize: '0.75rem',
    fontWeight: '400',
    color: '#6b7280',
  },
  buyButton: {
    padding: '0.625rem 1.25rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#4f46e5',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  },
  footer: {
    marginTop: '3rem',
    textAlign: 'center',
    padding: '1.5rem',
  },
  footerText: {
    fontSize: '0.875rem',
    color: '#6b7280',
    lineHeight: 1.6,
  },
  smallText: {
    fontSize: '0.75rem',
    color: '#9ca3af',
  },
};
