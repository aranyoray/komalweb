// ============================================================================
// Parent Controls Module
// Checks parent-configured blocklists/allowlists BEFORE any analysis.
// If a match is found, returns an immediate BLOCK or ALLOW decision.
// ============================================================================

import { db } from '@/lib/firebase-admin';
import type { ParentChild, ParentControlResult, BlockNotification, AgeGroup } from './types';

// ============================================================================
// Helpers
// ============================================================================

/**
 * Normalize a URL for comparison: lowercase, strip protocol/www/trailing slash
 */
function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname.replace(/^www\./, '') + parsed.pathname.replace(/\/+$/, '');
  } catch {
    return url.toLowerCase().trim();
  }
}

/**
 * Check if a URL matches a blocked/allowed URL pattern.
 * Supports exact domain match, subdomain match, and path prefix match.
 */
function urlMatches(inputUrl: string, ruleUrl: string): boolean {
  const normalizedInput = normalizeUrl(inputUrl);
  const normalizedRule = normalizeUrl(ruleUrl);

  // Exact match
  if (normalizedInput === normalizedRule) return true;

  // Rule is just a domain - match any path on that domain
  if (!normalizedRule.includes('/') || normalizedRule.endsWith('/')) {
    const ruleDomain = normalizedRule.replace(/\/+$/, '');
    const inputDomain = normalizedInput.split('/')[0];
    if (inputDomain === ruleDomain || inputDomain.endsWith('.' + ruleDomain)) {
      return true;
    }
  }

  // Input URL starts with the rule (path prefix)
  if (normalizedInput.startsWith(normalizedRule)) return true;

  return false;
}

/**
 * Check if text contains a blocked keyword (case-insensitive, word boundary aware)
 */
function keywordMatches(text: string, keyword: string): boolean {
  const lowerText = text.toLowerCase();
  const lowerKeyword = keyword.toLowerCase().trim();

  if (!lowerKeyword) return false;

  // Word boundary match using regex
  try {
    const escaped = lowerKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    return regex.test(lowerText);
  } catch {
    // Fallback to simple includes
    return lowerText.includes(lowerKeyword);
  }
}

// ============================================================================
// Fetch Children for a Parent
// ============================================================================

/**
 * Get all children configured by a parent user.
 */
export async function getParentChildren(userId: string): Promise<ParentChild[]> {
  if (!db) return [];

  try {
    const snapshot = await db
      .collection('users')
      .doc(userId)
      .collection('children')
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as ParentChild[];
  } catch (error) {
    console.error('[ParentControls] Failed to fetch children:', error);
    return [];
  }
}

// ============================================================================
// Check Parent Controls (called FIRST in pipeline)
// ============================================================================

/**
 * Check parent-configured controls before running any analysis.
 * Returns:
 *   - { action: 'BLOCK', ... } if URL/keyword matches a child's blocklist
 *   - { action: 'ALLOW', ... } if URL matches a child's allowlist
 *   - { action: null } if no parent rules match (proceed with normal analysis)
 */
export async function checkParentControls(
  userId: string | null,
  input: string
): Promise<ParentControlResult> {
  // No user or no database -> skip
  if (!userId || !db) {
    return { action: null, reason: 'No authenticated user' };
  }

  try {
    const children = await getParentChildren(userId);

    if (children.length === 0) {
      return { action: null, reason: 'No children configured' };
    }

    // Check each child's rules
    for (const child of children) {
      // Check blocked URLs
      if (child.blockedUrls && child.blockedUrls.length > 0) {
        for (const blockedUrl of child.blockedUrls) {
          if (urlMatches(input, blockedUrl)) {
            // Create notification
            await createBlockNotification(userId, {
              childId: child.id!,
              childName: child.name,
              type: 'blocked_url',
              url: input,
              matchedRule: blockedUrl,
              timestamp: new Date().toISOString(),
              read: false,
            });

            return {
              action: 'BLOCK',
              reason: `Blocked by parent control: URL matches "${blockedUrl}"`,
              matchedRule: blockedUrl,
              childId: child.id,
              childName: child.name,
            };
          }
        }
      }

      // Check blocked keywords
      if (child.blockedKeywords && child.blockedKeywords.length > 0) {
        for (const blockedKeyword of child.blockedKeywords) {
          if (keywordMatches(input, blockedKeyword)) {
            // Create notification
            await createBlockNotification(userId, {
              childId: child.id!,
              childName: child.name,
              type: 'blocked_keyword',
              url: input,
              keyword: blockedKeyword,
              matchedRule: blockedKeyword,
              timestamp: new Date().toISOString(),
              read: false,
            });

            return {
              action: 'BLOCK',
              reason: `Blocked by parent control: keyword "${blockedKeyword}" matched`,
              matchedRule: blockedKeyword,
              childId: child.id,
              childName: child.name,
            };
          }
        }
      }

      // Check allowed URLs (whitelist - skip analysis)
      if (child.allowedUrls && child.allowedUrls.length > 0) {
        for (const allowedUrl of child.allowedUrls) {
          if (urlMatches(input, allowedUrl)) {
            return {
              action: 'ALLOW',
              reason: `Allowed by parent control: URL matches "${allowedUrl}"`,
              matchedRule: allowedUrl,
              childId: child.id,
              childName: child.name,
            };
          }
        }
      }
    }

    return { action: null, reason: 'No parent rules matched' };
  } catch (error) {
    console.error('[ParentControls] Error checking controls:', error);
    return { action: null, reason: 'Error checking parent controls' };
  }
}

// ============================================================================
// Notifications
// ============================================================================

/**
 * Create a block notification for the parent.
 */
async function createBlockNotification(
  userId: string,
  notification: BlockNotification
): Promise<void> {
  if (!db) return;

  try {
    await db
      .collection('users')
      .doc(userId)
      .collection('notifications')
      .add(notification);

    console.log(`[ParentControls] Notification created for user ${userId}: ${notification.type}`);
  } catch (error) {
    console.error('[ParentControls] Failed to create notification:', error);
  }
}

/**
 * Get notifications for a parent user.
 */
export async function getNotifications(
  userId: string,
  limit: number = 50,
  unreadOnly: boolean = false
): Promise<BlockNotification[]> {
  if (!db) return [];

  try {
    let query = db
      .collection('users')
      .doc(userId)
      .collection('notifications')
      .orderBy('timestamp', 'desc')
      .limit(limit);

    if (unreadOnly) {
      query = query.where('read', '==', false);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as BlockNotification[];
  } catch (error) {
    console.error('[ParentControls] Failed to fetch notifications:', error);
    return [];
  }
}

/**
 * Mark a notification as read.
 */
export async function markNotificationRead(
  userId: string,
  notificationId: string
): Promise<boolean> {
  if (!db) return false;

  try {
    await db
      .collection('users')
      .doc(userId)
      .collection('notifications')
      .doc(notificationId)
      .update({ read: true });
    return true;
  } catch (error) {
    console.error('[ParentControls] Failed to mark notification read:', error);
    return false;
  }
}

/**
 * Mark all notifications as read for a user.
 */
export async function markAllNotificationsRead(userId: string): Promise<boolean> {
  if (!db) return false;

  try {
    const snapshot = await db
      .collection('users')
      .doc(userId)
      .collection('notifications')
      .where('read', '==', false)
      .get();

    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { read: true });
    });
    await batch.commit();
    return true;
  } catch (error) {
    console.error('[ParentControls] Failed to mark all notifications read:', error);
    return false;
  }
}

// ============================================================================
// CRUD helpers for children (used by API routes)
// ============================================================================

/**
 * Map age number to age band.
 */
export function ageToAgeBand(age: number): AgeGroup {
  if (age < 10) return '<10';
  if (age < 13) return '10-13';
  if (age < 16) return '13-16';
  return '16+';
}

/**
 * Add a child profile.
 */
export async function addChild(
  userId: string,
  child: Omit<ParentChild, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ParentChild | null> {
  if (!db) return null;

  try {
    const now = new Date().toISOString();
    const data = {
      name: child.name,
      age: child.age,
      ageBand: child.ageBand || ageToAgeBand(child.age),
      blockedUrls: child.blockedUrls || [],
      blockedKeywords: child.blockedKeywords || [],
      allowedUrls: child.allowedUrls || [],
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await db
      .collection('users')
      .doc(userId)
      .collection('children')
      .add(data);

    return { id: docRef.id, ...data };
  } catch (error) {
    console.error('[ParentControls] Failed to add child:', error);
    return null;
  }
}

/**
 * Get a single child by ID.
 */
export async function getChild(
  userId: string,
  childId: string
): Promise<ParentChild | null> {
  if (!db) return null;

  try {
    const doc = await db
      .collection('users')
      .doc(userId)
      .collection('children')
      .doc(childId)
      .get();

    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as ParentChild;
  } catch (error) {
    console.error('[ParentControls] Failed to get child:', error);
    return null;
  }
}

/**
 * Update a child profile.
 */
export async function updateChild(
  userId: string,
  childId: string,
  updates: Partial<Omit<ParentChild, 'id' | 'createdAt'>>
): Promise<ParentChild | null> {
  if (!db) return null;

  try {
    const ref = db
      .collection('users')
      .doc(userId)
      .collection('children')
      .doc(childId);

    // If age is updated, recompute ageBand
    const data: Record<string, unknown> = { ...updates, updatedAt: new Date().toISOString() };
    if (updates.age !== undefined) {
      data.ageBand = updates.ageBand || ageToAgeBand(updates.age);
    }

    await ref.update(data);
    const updated = await ref.get();
    return { id: updated.id, ...updated.data() } as ParentChild;
  } catch (error) {
    console.error('[ParentControls] Failed to update child:', error);
    return null;
  }
}

/**
 * Delete a child profile.
 */
export async function deleteChild(
  userId: string,
  childId: string
): Promise<boolean> {
  if (!db) return false;

  try {
    await db
      .collection('users')
      .doc(userId)
      .collection('children')
      .doc(childId)
      .delete();
    return true;
  } catch (error) {
    console.error('[ParentControls] Failed to delete child:', error);
    return false;
  }
}
