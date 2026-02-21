// ============================================================================
// Risk Escalator
// Implements risk escalation logic for sponsor/affiliate links.
// ONLY upgrades risk (ALLOW→GATE, GATE→BLOCK), NEVER downgrades.
// Per-age-band escalation.
// ============================================================================

import { AGE_GROUPS } from './types';
import type { AgeGroup, AgeAction } from './types';
import type { DetectedLink } from './sponsor-detector';

// ============================================================================
// Types
// ============================================================================

export interface EscalationResult {
  escalated: boolean;
  escalations: EscalationDetail[];
  ageActionOverrides: { [key in AgeGroup]?: AgeAction };
}

export interface EscalationDetail {
  reason: string;
  link: string;
  fromAction: AgeAction;
  toAction: AgeAction;
  ageBand: AgeGroup;
}

// ============================================================================
// Action Ordering (ALLOW < GATE < BLOCK)
// ============================================================================

const ACTION_SEVERITY: Record<AgeAction, number> = {
  'ALLOW': 0,
  'GATE': 1,
  'BLOCK': 2,
};

function isMoreRestrictive(newAction: AgeAction, currentAction: AgeAction): boolean {
  return ACTION_SEVERITY[newAction] > ACTION_SEVERITY[currentAction];
}

function escalateAction(current: AgeAction): AgeAction {
  if (current === 'ALLOW') return 'GATE';
  if (current === 'GATE') return 'BLOCK';
  return 'BLOCK'; // Already at max
}

// ============================================================================
// Categories that trigger escalation when linked from sponsors
// ============================================================================

const ESCALATION_CATEGORIES = new Set([
  'pornography', 'gambling', 'violence', 'dangerous',
  'adult_dating', 'hate_extremist', 'illegal_activities',
  'dangerous_chat', 'dangerous_forum',
]);

// ============================================================================
// Main Escalation Function
// ============================================================================

/**
 * Evaluate sponsor/affiliate links and escalate risk per age band.
 *
 * Rules:
 * 1. Sponsor/affiliate link to dangerous category → escalate all younger age bands
 * 2. Multiple sponsor links → escalate younger age bands (commercial pressure)
 * 3. Dangerous external link with no disclosure → extra escalation for all bands
 * 4. NEVER downgrade (BLOCK→GATE or GATE→ALLOW is forbidden)
 *
 * @param detectedLinks - Links from sponsor-detector
 * @param currentActions - Current age band actions from scoring
 * @param sponsorDetected - Whether sponsor content was detected on page
 * @param affiliateDetected - Whether affiliate links were found
 */
export function escalateRisk(
  detectedLinks: DetectedLink[],
  currentActions: { [key in AgeGroup]: AgeAction },
  sponsorDetected: boolean,
  affiliateDetected: boolean
): EscalationResult {
  const escalations: EscalationDetail[] = [];
  const overrides: { [key in AgeGroup]?: AgeAction } = {};

  // Working copy of current actions
  const working = { ...currentActions };

  // Rule 1: Sponsor/affiliate links to dangerous categories
  for (const link of detectedLinks) {
    if (!link.isDangerous) continue;
    if (!ESCALATION_CATEGORIES.has(link.category)) continue;
    if (!link.isSponsor && !link.isAffiliate) continue;

    // Escalate all age bands when a sponsor links to dangerous content
    for (const ag of AGE_GROUPS) {
      const newAction = escalateAction(working[ag]);
      if (isMoreRestrictive(newAction, working[ag])) {
        escalations.push({
          reason: `Sponsor/affiliate link to ${link.category} content`,
          link: link.url,
          fromAction: working[ag],
          toAction: newAction,
          ageBand: ag,
        });
        working[ag] = newAction;
        overrides[ag] = newAction;
      }
    }
  }

  // Rule 2: Multiple sponsor links → commercial pressure escalation for younger bands
  const sponsorLinkCount = detectedLinks.filter(l => l.isSponsor || l.isAffiliate).length;
  if (sponsorLinkCount >= 3) {
    const youngerBands: AgeGroup[] = ['<10', '10-13'];
    for (const ag of youngerBands) {
      const newAction = escalateAction(working[ag]);
      if (isMoreRestrictive(newAction, working[ag])) {
        escalations.push({
          reason: `High commercial pressure: ${sponsorLinkCount} sponsor/affiliate links`,
          link: 'multiple',
          fromAction: working[ag],
          toAction: newAction,
          ageBand: ag,
        });
        working[ag] = newAction;
        overrides[ag] = newAction;
      }
    }
  }

  // Rule 3: Dangerous external link with no disclosure
  const undisclosedDangerous = detectedLinks.filter(
    l => l.isDangerous && !l.isSponsor && !l.isAffiliate
  );

  if (undisclosedDangerous.length > 0) {
    for (const link of undisclosedDangerous) {
      for (const ag of AGE_GROUPS) {
        const newAction = escalateAction(working[ag]);
        if (isMoreRestrictive(newAction, working[ag])) {
          escalations.push({
            reason: `Undisclosed link to ${link.category} content`,
            link: link.url,
            fromAction: working[ag],
            toAction: newAction,
            ageBand: ag,
          });
          working[ag] = newAction;
          overrides[ag] = newAction;
        }
      }
    }
  }

  return {
    escalated: escalations.length > 0,
    escalations,
    ageActionOverrides: overrides,
  };
}
