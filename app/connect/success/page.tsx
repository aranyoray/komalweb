/**
 * Payment Success Page
 * ====================
 *
 * This page is displayed after a successful checkout.
 * It verifies the payment and shows order details.
 *
 * URL PARAMETERS:
 * - session_id: The Stripe Checkout Session ID
 * - account_id: The connected account ID
 *
 * This page:
 * 1. Retrieves the checkout session details
 * 2. Displays the payment confirmation
 * 3. Shows order summary
 *
 * VERIFICATION:
 * Always verify the session server-side to ensure the payment was successful.
 * Don't rely solely on the URL parameters for order fulfillment.
 */

'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// =============================================================================
// Type Definitions
// =============================================================================

interface SessionDetails {
  id: string;
  status: string;
  paymentStatus: string;
  customerEmail: string | null;
  amountTotal: number | null;
  currency: string | null;
  lineItems: Array<{
    description: string;
    quantity: number;
    amountTotal: number;
  }>;
}

// =============================================================================
// Main Component
// =============================================================================

/**
 * Wrapper component with Suspense boundary
 */
export default function SuccessPage() {
  return (
    <Suspense fallback={<SuccessLoading />}>
      <SuccessPageContent />
    </Suspense>
  );
}

/**
 * Loading fallback
 */
function SuccessLoading() {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.loadingContainer}>
          <p style={styles.loadingText}>Loading...</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Main success page content
 */
function SuccessPageContent() {
  const searchParams = useSearchParams();

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  const [session, setSession] = useState<SessionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get URL parameters
  const sessionId = searchParams.get('session_id');
  const accountId = searchParams.get('account_id');

  // ---------------------------------------------------------------------------
  // Verify Session
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const verifySession = async () => {
      if (!sessionId || !accountId) {
        setError('Missing session information');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/stripe/connect/checkout?sessionId=${sessionId}&accountId=${accountId}`
        );
        const data = await response.json();

        if (data.success) {
          setSession(data.session);
        } else {
          setError(data.error || 'Failed to verify payment');
        }
      } catch (err) {
        setError('Failed to verify payment');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, [sessionId, accountId]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Loading State */}
        {isLoading && (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner} />
            <p style={styles.loadingText}>Verifying your payment...</p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div style={styles.errorCard}>
            <div style={styles.iconContainer}>
              <span style={styles.errorIcon}>⚠️</span>
            </div>
            <h1 style={styles.errorTitle}>Something went wrong</h1>
            <p style={styles.errorDescription}>{error}</p>
            <Link href="/" style={styles.secondaryButton}>
              Return Home
            </Link>
          </div>
        )}

        {/* Success State */}
        {!isLoading && !error && session && (
          <div style={styles.successCard}>
            {/* Success Icon */}
            <div style={styles.iconContainer}>
              <div style={styles.successIcon}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  style={styles.checkmark}
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
            </div>

            {/* Success Message */}
            <h1 style={styles.successTitle}>Payment Successful!</h1>
            <p style={styles.successDescription}>
              Thank you for your purchase. You will receive a confirmation email shortly.
            </p>

            {/* Order Details */}
            <div style={styles.orderDetails}>
              <h2 style={styles.orderTitle}>Order Summary</h2>

              {/* Line Items */}
              {session.lineItems && session.lineItems.length > 0 && (
                <div style={styles.lineItems}>
                  {session.lineItems.map((item, index) => (
                    <div key={index} style={styles.lineItem}>
                      <span style={styles.itemName}>
                        {item.description}
                        {item.quantity > 1 && (
                          <span style={styles.quantity}> x{item.quantity}</span>
                        )}
                      </span>
                      <span style={styles.itemPrice}>
                        ${(item.amountTotal / 100).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Total */}
              <div style={styles.totalRow}>
                <span style={styles.totalLabel}>Total Paid</span>
                <span style={styles.totalAmount}>
                  ${((session.amountTotal || 0) / 100).toFixed(2)}{' '}
                  {session.currency?.toUpperCase()}
                </span>
              </div>

              {/* Email */}
              {session.customerEmail && (
                <p style={styles.emailNote}>
                  Receipt sent to: <strong>{session.customerEmail}</strong>
                </p>
              )}
            </div>

            {/* Actions */}
            <div style={styles.actions}>
              {accountId && (
                <Link
                  href={`/connect/storefront/${accountId}`}
                  style={styles.primaryButton}
                >
                  Continue Shopping
                </Link>
              )}
              <Link href="/" style={styles.secondaryButton}>
                Return Home
              </Link>
            </div>

            {/* Order ID */}
            <p style={styles.orderId}>
              Order Reference: <code style={styles.code}>{session.id}</code>
            </p>
          </div>
        )}

        {/* No Session Data */}
        {!isLoading && !error && !session && (
          <div style={styles.errorCard}>
            <div style={styles.iconContainer}>
              <span style={styles.errorIcon}>🔍</span>
            </div>
            <h1 style={styles.errorTitle}>Session Not Found</h1>
            <p style={styles.errorDescription}>
              We couldn&apos;t find information about this order.
              If you completed a payment, please check your email for confirmation.
            </p>
            <Link href="/" style={styles.secondaryButton}>
              Return Home
            </Link>
          </div>
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    maxWidth: '500px',
  },
  loadingContainer: {
    textAlign: 'center',
    padding: '3rem',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #e5e7eb',
    borderTopColor: '#4f46e5',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 1rem',
  },
  loadingText: {
    color: '#6b7280',
    fontSize: '1rem',
  },
  successCard: {
    backgroundColor: '#ffffff',
    borderRadius: '1rem',
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  errorCard: {
    backgroundColor: '#ffffff',
    borderRadius: '1rem',
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  iconContainer: {
    marginBottom: '1.5rem',
  },
  successIcon: {
    width: '64px',
    height: '64px',
    backgroundColor: '#10b981',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    color: '#ffffff',
  },
  checkmark: {
    width: '32px',
    height: '32px',
  },
  errorIcon: {
    fontSize: '4rem',
  },
  successTitle: {
    fontSize: '1.75rem',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '0.5rem',
  },
  errorTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '0.5rem',
  },
  successDescription: {
    fontSize: '1rem',
    color: '#6b7280',
    marginBottom: '1.5rem',
  },
  errorDescription: {
    fontSize: '1rem',
    color: '#6b7280',
    marginBottom: '1.5rem',
  },
  orderDetails: {
    backgroundColor: '#f9fafb',
    borderRadius: '0.75rem',
    padding: '1.25rem',
    marginBottom: '1.5rem',
    textAlign: 'left',
  },
  orderTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '1rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid #e5e7eb',
  },
  lineItems: {
    marginBottom: '1rem',
  },
  lineItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0',
  },
  itemName: {
    fontSize: '0.875rem',
    color: '#374151',
  },
  quantity: {
    color: '#6b7280',
  },
  itemPrice: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#111827',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '1rem',
    borderTop: '1px solid #e5e7eb',
    marginTop: '0.5rem',
  },
  totalLabel: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#374151',
  },
  totalAmount: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#111827',
  },
  emailNote: {
    fontSize: '0.75rem',
    color: '#6b7280',
    marginTop: '1rem',
  },
  actions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginBottom: '1.5rem',
  },
  primaryButton: {
    display: 'block',
    padding: '0.875rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#4f46e5',
    border: 'none',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    textAlign: 'center',
    transition: 'background-color 0.15s',
  },
  secondaryButton: {
    display: 'block',
    padding: '0.875rem 1.5rem',
    fontSize: '1rem',
    fontWeight: '500',
    color: '#374151',
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    textAlign: 'center',
    transition: 'background-color 0.15s',
  },
  orderId: {
    fontSize: '0.75rem',
    color: '#9ca3af',
  },
  code: {
    fontFamily: 'monospace',
    fontSize: '0.7rem',
    backgroundColor: '#f3f4f6',
    padding: '0.125rem 0.375rem',
    borderRadius: '0.25rem',
    wordBreak: 'break-all',
  },
};

// Add keyframes for spinner animation
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(styleSheet);
}
