/**
 * Stripe Connect Dashboard
 * ========================
 *
 * This page provides a complete interface for managing Stripe Connect accounts:
 * - Creating new connected accounts
 * - Onboarding accounts to collect required information
 * - Viewing account status and capabilities
 * - Managing products
 * - Subscribing to platform plans
 * - Accessing the billing portal
 *
 * DEMO NOTES:
 * - Account IDs are stored in localStorage for this demo
 * - In production, store account IDs in your database linked to user records
 * - This page demonstrates all major Stripe Connect workflows
 */

'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

// =============================================================================
// Type Definitions
// =============================================================================

interface AccountStatus {
  id: string;
  displayName: string | null;
  email: string | null;
  readyToProcessPayments: boolean;
  cardPaymentsStatus: string;
  onboardingComplete: boolean;
  requirementsStatus: string | null;
  requirements: {
    currentlyDue: string[];
    eventuallyDue: string[];
    pastDue: string[];
  };
  dashboard: string;
}

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

/**
 * Wrapper component with Suspense boundary
 * Required because useSearchParams causes a client-side bailout
 */
export default function ConnectDashboard() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <ConnectDashboardContent />
    </Suspense>
  );
}

/**
 * Loading fallback for the dashboard
 */
function DashboardLoading() {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Stripe Connect Dashboard</h1>
        <p style={styles.subtitle}>Loading...</p>
      </div>
    </div>
  );
}

/**
 * Main dashboard content component
 */
function ConnectDashboardContent() {
  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  // Account management
  const [accountId, setAccountId] = useState<string | null>(null);
  const [accountStatus, setAccountStatus] = useState<AccountStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state for creating accounts
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');

  // Products
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Product creation form
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');

  // Get URL params to check for return from onboarding
  const searchParams = useSearchParams();

  // ---------------------------------------------------------------------------
  // Load saved account on mount
  // ---------------------------------------------------------------------------

  useEffect(() => {
    // Check for account ID in URL (returned from onboarding)
    const urlAccountId = searchParams.get('accountId');
    if (urlAccountId) {
      setAccountId(urlAccountId);
      // Save to localStorage for persistence
      localStorage.setItem('stripeConnectAccountId', urlAccountId);
    } else {
      // Load from localStorage
      const savedAccountId = localStorage.getItem('stripeConnectAccountId');
      if (savedAccountId) {
        setAccountId(savedAccountId);
      }
    }

    // Show success message if returning from onboarding
    if (searchParams.get('onboarding') === 'complete') {
      setSuccessMessage('Onboarding completed! Checking account status...');
    }

    // Show subscription success message
    if (searchParams.get('subscription') === 'success') {
      setSuccessMessage('Subscription activated successfully!');
    }
  }, [searchParams]);

  // ---------------------------------------------------------------------------
  // Fetch account status when account ID changes
  // ---------------------------------------------------------------------------

  const fetchAccountStatus = useCallback(async () => {
    if (!accountId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/stripe/connect/accounts/${accountId}`);
      const data = await response.json();

      if (data.success) {
        setAccountStatus(data.account);
      } else {
        setError(data.error || 'Failed to fetch account status');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    fetchAccountStatus();
  }, [fetchAccountStatus]);

  // ---------------------------------------------------------------------------
  // Fetch products when account is ready
  // ---------------------------------------------------------------------------

  const fetchProducts = useCallback(async () => {
    if (!accountId || !accountStatus?.readyToProcessPayments) return;

    setIsLoadingProducts(true);

    try {
      const response = await fetch(`/api/stripe/connect/products?accountId=${accountId}`);
      const data = await response.json();

      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setIsLoadingProducts(false);
    }
  }, [accountId, accountStatus?.readyToProcessPayments]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ---------------------------------------------------------------------------
  // Create Connected Account
  // ---------------------------------------------------------------------------

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/stripe/connect/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName,
          email,
          country: 'us', // Default to US for demo
        }),
      });

      const data = await response.json();

      if (data.success) {
        setAccountId(data.account.id);
        localStorage.setItem('stripeConnectAccountId', data.account.id);
        setSuccessMessage('Account created! Click "Start Onboarding" to continue.');
        setDisplayName('');
        setEmail('');
      } else {
        setError(data.error || 'Failed to create account');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Start Onboarding
  // ---------------------------------------------------------------------------

  const handleStartOnboarding = async () => {
    if (!accountId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/connect/account-links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId,
          returnPath: '/connect/dashboard',
          refreshPath: '/connect/dashboard',
        }),
      });

      const data = await response.json();

      if (data.success && data.url) {
        // Redirect to Stripe's hosted onboarding
        window.location.href = data.url;
      } else {
        setError(data.error || 'Failed to create onboarding link');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Create Product
  // ---------------------------------------------------------------------------

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountId) return;

    setIsLoading(true);
    setError(null);

    try {
      const priceInCents = Math.round(parseFloat(productPrice) * 100);

      const response = await fetch('/api/stripe/connect/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId,
          name: productName,
          description: productDescription || undefined,
          priceInCents,
          currency: 'usd',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('Product created successfully!');
        setProductName('');
        setProductDescription('');
        setProductPrice('');
        fetchProducts();
      } else {
        setError(data.error || 'Failed to create product');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Subscribe to Platform
  // ---------------------------------------------------------------------------

  const handleSubscribe = async () => {
    if (!accountId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/connect/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId,
          successPath: '/connect/dashboard',
          cancelPath: '/connect/dashboard',
        }),
      });

      const data = await response.json();

      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Failed to create subscription checkout');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Open Billing Portal
  // ---------------------------------------------------------------------------

  const handleOpenBillingPortal = async () => {
    if (!accountId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/connect/billing-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId,
          returnPath: '/connect/dashboard',
        }),
      });

      const data = await response.json();

      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Failed to open billing portal');
      }
    } catch (err) {
      setError('Failed to connect to server');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Clear Account (for testing)
  // ---------------------------------------------------------------------------

  const handleClearAccount = () => {
    localStorage.removeItem('stripeConnectAccountId');
    setAccountId(null);
    setAccountStatus(null);
    setProducts([]);
    setSuccessMessage(null);
    setError(null);
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Stripe Connect Dashboard</h1>
        <p style={styles.subtitle}>
          Manage your connected account, create products, and start accepting payments.
        </p>

        {/* Messages */}
        {error && (
          <div style={styles.errorBox}>
            <strong>Error:</strong> {error}
          </div>
        )}
        {successMessage && (
          <div style={styles.successBox}>
            {successMessage}
          </div>
        )}

        {/* No Account - Show Create Form */}
        {!accountId && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Create Connected Account</h2>
            <p style={styles.cardDescription}>
              Create a new Stripe connected account to start accepting payments.
            </p>
            <form onSubmit={handleCreateAccount} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Display Name *</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your business name"
                  required
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@example.com"
                  required
                  style={styles.input}
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                style={styles.primaryButton}
              >
                {isLoading ? 'Creating...' : 'Create Account'}
              </button>
            </form>
          </div>
        )}

        {/* Has Account - Show Status and Actions */}
        {accountId && (
          <>
            {/* Account Status Card */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>Account Status</h2>
                <button
                  onClick={fetchAccountStatus}
                  disabled={isLoading}
                  style={styles.secondaryButton}
                >
                  Refresh
                </button>
              </div>

              {isLoading && !accountStatus ? (
                <p>Loading account status...</p>
              ) : accountStatus ? (
                <div style={styles.statusGrid}>
                  <div style={styles.statusItem}>
                    <span style={styles.statusLabel}>Account ID</span>
                    <code style={styles.code}>{accountStatus.id}</code>
                  </div>
                  <div style={styles.statusItem}>
                    <span style={styles.statusLabel}>Display Name</span>
                    <span>{accountStatus.displayName || 'Not set'}</span>
                  </div>
                  <div style={styles.statusItem}>
                    <span style={styles.statusLabel}>Email</span>
                    <span>{accountStatus.email || 'Not set'}</span>
                  </div>
                  <div style={styles.statusItem}>
                    <span style={styles.statusLabel}>Onboarding</span>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: accountStatus.onboardingComplete ? '#10b981' : '#f59e0b',
                    }}>
                      {accountStatus.onboardingComplete ? 'Complete' : 'Incomplete'}
                    </span>
                  </div>
                  <div style={styles.statusItem}>
                    <span style={styles.statusLabel}>Card Payments</span>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: accountStatus.readyToProcessPayments ? '#10b981' : '#f59e0b',
                    }}>
                      {accountStatus.cardPaymentsStatus}
                    </span>
                  </div>
                  {accountStatus.requirements.currentlyDue.length > 0 && (
                    <div style={{ ...styles.statusItem, gridColumn: '1 / -1' }}>
                      <span style={styles.statusLabel}>Requirements Due</span>
                      <ul style={styles.requirementsList}>
                        {accountStatus.requirements.currentlyDue.map((req) => (
                          <li key={req}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <p>Unable to load account status</p>
              )}

              {/* Onboarding Button */}
              {accountStatus && !accountStatus.onboardingComplete && (
                <button
                  onClick={handleStartOnboarding}
                  disabled={isLoading}
                  style={{ ...styles.primaryButton, marginTop: '1rem' }}
                >
                  {isLoading ? 'Loading...' : 'Continue Onboarding'}
                </button>
              )}
            </div>

            {/* Platform Subscription Card */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Platform Subscription</h2>
              <p style={styles.cardDescription}>
                Subscribe to the platform to unlock premium features.
              </p>
              <div style={styles.buttonGroup}>
                <button
                  onClick={handleSubscribe}
                  disabled={isLoading}
                  style={styles.primaryButton}
                >
                  Subscribe Now
                </button>
                <button
                  onClick={handleOpenBillingPortal}
                  disabled={isLoading}
                  style={styles.secondaryButton}
                >
                  Manage Subscription
                </button>
              </div>
            </div>

            {/* Products Card - Only show if ready to process payments */}
            {accountStatus?.readyToProcessPayments && (
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Your Products</h2>
                <p style={styles.cardDescription}>
                  Create and manage products that customers can purchase.
                </p>

                {/* Create Product Form */}
                <form onSubmit={handleCreateProduct} style={styles.form}>
                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Product Name *</label>
                      <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="Product name"
                        required
                        style={styles.input}
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Price (USD) *</label>
                      <input
                        type="number"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        placeholder="19.99"
                        required
                        min="0.50"
                        step="0.01"
                        style={styles.input}
                      />
                    </div>
                  </div>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Description</label>
                    <input
                      type="text"
                      value={productDescription}
                      onChange={(e) => setProductDescription(e.target.value)}
                      placeholder="Optional description"
                      style={styles.input}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading || !productName || !productPrice}
                    style={styles.primaryButton}
                  >
                    {isLoading ? 'Creating...' : 'Create Product'}
                  </button>
                </form>

                {/* Product List */}
                <div style={styles.divider} />
                <h3 style={styles.subheading}>Existing Products</h3>
                {isLoadingProducts ? (
                  <p>Loading products...</p>
                ) : products.length > 0 ? (
                  <div style={styles.productGrid}>
                    {products.map((product) => (
                      <div key={product.id} style={styles.productCard}>
                        <h4 style={styles.productName}>{product.name}</h4>
                        {product.description && (
                          <p style={styles.productDescription}>{product.description}</p>
                        )}
                        <p style={styles.productPrice}>
                          ${((product.priceInCents || 0) / 100).toFixed(2)} {product.currency?.toUpperCase()}
                        </p>
                        <a
                          href={`/connect/storefront/${accountId}`}
                          style={styles.linkButton}
                        >
                          View Storefront →
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={styles.emptyState}>No products yet. Create your first product above.</p>
                )}
              </div>
            )}

            {/* Storefront Link */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Your Storefront</h2>
              <p style={styles.cardDescription}>
                Share this link with customers to purchase your products.
              </p>
              <div style={styles.storefrontLink}>
                <code style={styles.code}>
                  {typeof window !== 'undefined' ? window.location.origin : ''}/connect/storefront/{accountId}
                </code>
              </div>
              <a
                href={`/connect/storefront/${accountId}`}
                style={styles.primaryButton}
              >
                View Storefront
              </a>
              {/*
                NOTE: In production, you should use a different identifier in the URL
                instead of the Stripe account ID. Consider using:
                - A username or slug
                - A database ID
                - A UUID that maps to the account in your database

                This provides better security and allows you to change the underlying
                Stripe account if needed.
              */}
            </div>

            {/* Clear Account Button (for testing) */}
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>Developer Tools</h2>
              <p style={styles.cardDescription}>
                Clear the stored account to test the account creation flow again.
              </p>
              <button
                onClick={handleClearAccount}
                style={styles.dangerButton}
              >
                Clear Saved Account
              </button>
            </div>
          </>
        )}
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
    maxWidth: '800px',
    margin: '0 auto',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#6b7280',
    marginBottom: '2rem',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  cardTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '0.5rem',
  },
  cardDescription: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '1rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  label: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    padding: '0.625rem 0.75rem',
    fontSize: '1rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    outline: 'none',
    transition: 'border-color 0.15s',
  },
  primaryButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '500',
    color: '#ffffff',
    backgroundColor: '#4f46e5',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'inline-block',
  },
  secondaryButton: {
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  },
  dangerButton: {
    padding: '0.75rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '500',
    color: '#ffffff',
    backgroundColor: '#ef4444',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
  },
  errorBox: {
    padding: '1rem',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '0.5rem',
    color: '#991b1b',
    marginBottom: '1rem',
  },
  successBox: {
    padding: '1rem',
    backgroundColor: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '0.5rem',
    color: '#166534',
    marginBottom: '1rem',
  },
  statusGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
  },
  statusItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  statusLabel: {
    fontSize: '0.75rem',
    fontWeight: '500',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  code: {
    fontFamily: 'monospace',
    fontSize: '0.875rem',
    backgroundColor: '#f3f4f6',
    padding: '0.25rem 0.5rem',
    borderRadius: '0.25rem',
    wordBreak: 'break-all',
  },
  badge: {
    display: 'inline-block',
    padding: '0.25rem 0.5rem',
    fontSize: '0.75rem',
    fontWeight: '500',
    color: '#ffffff',
    borderRadius: '9999px',
    textTransform: 'capitalize',
  },
  requirementsList: {
    margin: '0.5rem 0 0 1rem',
    padding: 0,
    fontSize: '0.875rem',
    color: '#374151',
  },
  divider: {
    height: '1px',
    backgroundColor: '#e5e7eb',
    margin: '1.5rem 0',
  },
  subheading: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '1rem',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '1rem',
  },
  productCard: {
    padding: '1rem',
    backgroundColor: '#f9fafb',
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb',
  },
  productName: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '0.25rem',
  },
  productDescription: {
    fontSize: '0.875rem',
    color: '#6b7280',
    marginBottom: '0.5rem',
  },
  productPrice: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#4f46e5',
    marginBottom: '0.5rem',
  },
  linkButton: {
    fontSize: '0.875rem',
    color: '#4f46e5',
    textDecoration: 'none',
  },
  storefrontLink: {
    marginBottom: '1rem',
  },
  emptyState: {
    fontSize: '0.875rem',
    color: '#6b7280',
    fontStyle: 'italic',
  },
};
