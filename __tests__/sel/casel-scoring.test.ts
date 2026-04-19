import { computeCaselScores, type SceneResponse } from '@/lib/sel/casel-scoring';

function makeResponse(overrides: Partial<SceneResponse> = {}): SceneResponse {
  return {
    emojiPicked: '😊',
    emojiLabel: 'Happy',
    emojiValence: 'positive',
    responseTimeMs: 5000,
    empathyTag: 'Happy',
    isBondScene: false,
    ...overrides,
  };
}

function makeResponses(count: number, overrides: Partial<SceneResponse> = {}): SceneResponse[] {
  return Array.from({ length: count }, () => makeResponse(overrides));
}

describe('CASEL Scoring', () => {
  describe('Self-Awareness', () => {
    it('scores 1 when all emojis are the same', () => {
      const responses = makeResponses(5, { emojiLabel: 'Happy' });
      const report = computeCaselScores(responses);
      expect(report.scores.selfAwareness).toBe(1);
    });

    it('scores 5 when all emojis are different', () => {
      const labels = ['Happy', 'Sad', 'Scared', 'Wow', 'Calm'];
      const responses = labels.map(label => makeResponse({ emojiLabel: label }));
      const report = computeCaselScores(responses);
      expect(report.scores.selfAwareness).toBe(5);
    });

    it('scores 3 when 3 unique emojis used', () => {
      const labels = ['Happy', 'Sad', 'Happy', 'Scared', 'Sad'];
      const responses = labels.map(label => makeResponse({ emojiLabel: label }));
      const report = computeCaselScores(responses);
      expect(report.scores.selfAwareness).toBe(3);
    });

    it('ignores no_response entries', () => {
      const responses = [
        makeResponse({ emojiLabel: 'Happy' }),
        makeResponse({ emojiLabel: null, emojiPicked: null, emojiValence: null }),
        makeResponse({ emojiLabel: 'Sad' }),
        makeResponse({ emojiLabel: null, emojiPicked: null, emojiValence: null }),
        makeResponse({ emojiLabel: 'Scared' }),
      ];
      const report = computeCaselScores(responses);
      expect(report.scores.selfAwareness).toBe(3);
    });
  });

  describe('Self-Management', () => {
    it('scores high on negative-to-positive recovery', () => {
      const responses = [
        makeResponse({ emojiValence: 'negative' }),
        makeResponse({ emojiValence: 'positive' }),
        makeResponse({ emojiValence: 'negative' }),
        makeResponse({ emojiValence: 'positive' }),
        makeResponse({ emojiValence: 'positive' }),
      ];
      const report = computeCaselScores(responses);
      expect(report.scores.selfManagement).toBe(5);
    });

    it('handles all positive emotions (no transitions possible)', () => {
      const responses = makeResponses(5, { emojiValence: 'positive' });
      const report = computeCaselScores(responses);
      expect(report.scores.selfManagement).toBe(4); // stable = good
    });

    it('does not divide by zero when no negative emotions', () => {
      const responses = makeResponses(5, { emojiValence: 'neutral' });
      const report = computeCaselScores(responses);
      expect(report.scores.selfManagement).toBeGreaterThanOrEqual(1);
      expect(report.scores.selfManagement).toBeLessThanOrEqual(5);
    });
  });

  describe('Social Awareness', () => {
    it('scores high when all empathy tags match', () => {
      const responses = [
        makeResponse({ emojiLabel: 'Happy', empathyTag: 'Happy' }),
        makeResponse({ emojiLabel: 'Sad', empathyTag: 'Sad' }),
        makeResponse({ emojiLabel: 'Scared', empathyTag: 'Scared' }),
        makeResponse({ emojiLabel: 'Calm', empathyTag: 'Calm' }),
        makeResponse({ emojiLabel: 'Happy', empathyTag: 'Happy' }),
      ];
      const report = computeCaselScores(responses);
      expect(report.scores.socialAwareness).toBe(5);
    });

    it('handles split empathy tags like Happy/Calm', () => {
      const responses = [
        makeResponse({ emojiLabel: 'Calm', empathyTag: 'Happy/Calm' }),
      ];
      const report = computeCaselScores(responses);
      expect(report.scores.socialAwareness).toBe(5);
    });
  });

  describe('Relationship Skills', () => {
    it('scores high on positive bond scene responses', () => {
      const responses = [
        makeResponse({ emojiValence: 'positive', isBondScene: true }),
        makeResponse({ emojiValence: 'negative', isBondScene: false }),
        makeResponse({ emojiValence: 'neutral', isBondScene: false }),
        makeResponse({ emojiValence: 'negative', isBondScene: false }),
        makeResponse({ emojiValence: 'positive', isBondScene: true }),
      ];
      const report = computeCaselScores(responses);
      expect(report.scores.relationshipSkills).toBe(5);
    });
  });

  describe('Responsible Decision-Making', () => {
    it('scores high with thoughtful, varied, complete responses', () => {
      const labels = ['Happy', 'Sad', 'Scared', 'Calm', 'Brave'];
      const responses = labels.map(label =>
        makeResponse({ emojiLabel: label, responseTimeMs: 5000 })
      );
      const report = computeCaselScores(responses);
      expect(report.scores.responsibleDecisionMaking).toBe(5);
    });

    it('scores low when rushing (all under 2s)', () => {
      const responses = makeResponses(5, { responseTimeMs: 1500 });
      const report = computeCaselScores(responses);
      expect(report.scores.responsibleDecisionMaking).toBeLessThanOrEqual(3);
    });
  });

  describe('Report', () => {
    it('always includes disclaimer', () => {
      const responses = makeResponses(5);
      const report = computeCaselScores(responses);
      expect(report.disclaimer).toContain('not a clinical assessment');
    });

    it('generates descriptions for all 5 competencies', () => {
      const responses = makeResponses(5);
      const report = computeCaselScores(responses);
      expect(Object.keys(report.descriptions)).toHaveLength(5);
    });
  });
});
