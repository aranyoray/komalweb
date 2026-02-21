// ============================================================================
// Sponsor & Affiliate Detector
// Detects sponsored content, affiliate links, and advertising disclosure.
// ============================================================================

import type { LinkSignal, AgeAction } from './types';
import { isDangerousSite } from './domain-lists';

// ============================================================================
// Known Affiliate Domains & URL Params
// ============================================================================

const AFFILIATE_DOMAINS = new Set([
  'amzn.to', 'bit.ly', 'tinyurl.com', 'ow.ly', 't.co',
  'shareasale.com', 'awin1.com', 'commission-junction.com', 'cj.com',
  'clickbank.net', 'jdoqocy.com', 'tkqlhce.com', 'dpbolvw.net',
  'anrdoezrs.net', 'kqzyfj.com', 'impact.com', 'pepperjam.com',
  'rakuten.com', 'avantlink.com', 'flexoffers.com',
  'partnerize.com', 'refersion.com', 'everflow.io',
]);

const AFFILIATE_URL_PARAMS = new Set([
  'ref', 'aff', 'affiliate', 'affid', 'aff_id',
  'partner', 'partnerid', 'partner_id',
  'utm_affiliate', 'click_id', 'clickid',
  'subid', 'sub_id', 'tag', 'associate',
  'irclickid', 'irgwc', 'aid', 'pid',
]);

// ============================================================================
// Disclosure Text Patterns
// ============================================================================

const DISCLOSURE_PATTERNS = [
  /\b#ad\b/i,
  /\b#sponsored\b/i,
  /\b#affiliate\b/i,
  /\b#partner(ship)?\b/i,
  /\bsponsored\s+by\b/i,
  /\bpaid\s+partnership\b/i,
  /\baffiliate\s+link/i,
  /\bthis\s+(post|video|content)\s+(is|was)\s+sponsored\b/i,
  /\bin\s+partnership\s+with\b/i,
  /\bin\s+collaboration\s+with\b/i,
  /\bcommission\s+(on|from|for)\b/i,
  /\bearn\s+(a\s+)?commission\b/i,
  /\bpromo\s+code\b/i,
  /\bdiscount\s+code\b/i,
  /\buse\s+(my\s+)?code\b/i,
  /\bcourtesy\s+of\b/i,
  /\bc\/o\b/i,
];

// ============================================================================
// Link Analysis Types
// ============================================================================

export interface DetectedLink {
  url: string;
  anchorText: string;
  isSponsor: boolean;
  isAffiliate: boolean;
  isDangerous: boolean;
  category: string;
  rel: string;
}

export interface SponsorDetectionResult {
  sponsorDetected: boolean;
  affiliateDetected: boolean;
  disclosureFound: boolean;
  sponsorCount: number;
  affiliateCount: number;
  links: DetectedLink[];
  linkSignal: LinkSignal;
}

// ============================================================================
// Core Detection Functions
// ============================================================================

/**
 * Check if a URL is an affiliate link based on domain or URL params.
 */
function isAffiliateUrl(url: string): boolean {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    const domain = parsed.hostname.replace(/^www\./, '');

    // Known affiliate domains
    if (AFFILIATE_DOMAINS.has(domain)) return true;

    // Check for affiliate URL parameters
    for (const param of AFFILIATE_URL_PARAMS) {
      if (parsed.searchParams.has(param)) return true;
    }

    // Check for common affiliate path patterns
    if (/\/(ref|aff|affiliate|partner|click)\//i.test(parsed.pathname)) return true;

    return false;
  } catch {
    return false;
  }
}

/**
 * Check if an element has rel="sponsored" or rel="nofollow" (common for paid links).
 */
function isSponsorRel(rel: string): boolean {
  const lowerRel = rel.toLowerCase();
  return lowerRel.includes('sponsored') || lowerRel.includes('ugc');
}

/**
 * Check if text content contains advertising disclosure.
 */
export function detectDisclosure(text: string): boolean {
  return DISCLOSURE_PATTERNS.some(pattern => pattern.test(text));
}

// ============================================================================
// Main Detection Function
// ============================================================================

/**
 * Analyze page links and text for sponsor/affiliate content.
 *
 * @param links - Array of { href, text, rel } from the page
 * @param pageText - Full page text content for disclosure detection
 */
export function detectSponsors(
  links: { href: string; text: string; rel: string }[],
  pageText: string
): SponsorDetectionResult {
  const detectedLinks: DetectedLink[] = [];
  let sponsorCount = 0;
  let affiliateCount = 0;
  const disclosureFound = detectDisclosure(pageText);

  for (const link of links) {
    if (!link.href || link.href.startsWith('#') || link.href.startsWith('javascript:')) continue;

    const isSponsor = isSponsorRel(link.rel);
    const isAffiliate = isAffiliateUrl(link.href);
    const dangerousInfo = isDangerousSite(link.href);
    const isDangerous = !!dangerousInfo;
    const category = dangerousInfo?.category || '';

    if (isSponsor) sponsorCount++;
    if (isAffiliate) affiliateCount++;

    if (isSponsor || isAffiliate || isDangerous) {
      detectedLinks.push({
        url: link.href,
        anchorText: link.text.slice(0, 100),
        isSponsor,
        isAffiliate,
        isDangerous,
        category,
        rel: link.rel,
      });
    }
  }

  // Build LinkSignal
  const externalLinks = detectedLinks.map(l => ({
    url: l.url,
    category: l.category || (l.isAffiliate ? 'affiliate' : l.isSponsor ? 'sponsor' : 'external'),
    isSponsor: l.isSponsor || l.isAffiliate,
    action: (l.isDangerous ? 'BLOCK' : l.isSponsor || l.isAffiliate ? 'GATE' : 'ALLOW') as AgeAction,
  }));

  return {
    sponsorDetected: sponsorCount > 0 || disclosureFound,
    affiliateDetected: affiliateCount > 0,
    disclosureFound,
    sponsorCount,
    affiliateCount,
    links: detectedLinks,
    linkSignal: {
      used: detectedLinks.length > 0 || disclosureFound,
      externalLinks,
      sponsorDetected: sponsorCount > 0 || disclosureFound,
      affiliateDetected: affiliateCount > 0,
    },
  };
}
