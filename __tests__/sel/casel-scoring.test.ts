import { computeCaselScores, type SceneResponse, type QuestionAnswer } from '@/lib/sel/casel-scoring';

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

function makeSelAnswer(dimension: string, isCorrect: boolean): QuestionAnswer {
  return {
    questionType: 'sel',
    selDimension: dimension,
    selectedIndex: isCorrect ? 1 : 0,
    correctIndex: 1,
    isCorrect,
  };
}

function makeMcqAnswer(isCorrect: boolean): QuestionAnswer {
  return {
    questionType: 'mcq',
    selectedIndex: isCorrect ? 1 : 0,
    correctIndex: 1,
    isCorrect,
  };
}

describe('CASEL Scoring', () => {
  describe('Self-Awareness', () => {
    it('scores based on emoji diversity + SEL question', () => {
      const responses = makeResponses(2, { emojiLabel: 'Happy' });
      const answers = [makeSelAnswer('selfAwareness', true)];
      const report = computeCaselScores(responses, answers);
      // 1 unique emoji (capped at 1) + 2 from correct answer = 3
      expect(report.scores.selfAwareness).toBe(3);
    });

    it('scores higher with diverse emojis + correct question', () => {
      const responses = [
        makeResponse({ emojiLabel: 'Happy' }),
        makeResponse({ emojiLabel: 'Sad' }),
        makeResponse({ emojiLabel: 'Scared' }),
      ];
      const answers = [makeSelAnswer('selfAwareness', true)];
      const report = computeCaselScores(responses, answers);
      // 3 unique emojis (capped at 3) + 2 from correct answer = 5
      expect(report.scores.selfAwareness).toBe(5);
    });

    it('ignores no_response entries', () => {
      const responses = [
        makeResponse({ emojiLabel: 'Happy' }),
        makeResponse({ emojiLabel: null, emojiPicked: null, emojiValence: null }),
        makeResponse({ emojiLabel: 'Sad' }),
      ];
      const report = computeCaselScores(responses);
      expect(report.scores.selfAwareness).toBe(2); // 2 unique, no question bonus
    });
  });

  describe('Self-Management', () => {
    it('scores high on negative-to-positive recovery', () => {
      const responses = [
        makeResponse({ emojiValence: 'negative' }),
        makeResponse({ emojiValence: 'positive' }),
      ];
      const report = computeCaselScores(responses);
      expect(report.scores.selfManagement).toBe(5);
    });

    it('handles all positive emotions (no transitions possible)', () => {
      const responses = makeResponses(2, { emojiValence: 'positive' });
      const report = computeCaselScores(responses);
      expect(report.scores.selfManagement).toBe(4); // stable = good
    });

    it('does not divide by zero when no negative emotions', () => {
      const responses = makeResponses(2, { emojiValence: 'neutral' });
      const report = computeCaselScores(responses);
      expect(report.scores.selfManagement).toBeGreaterThanOrEqual(1);
      expect(report.scores.selfManagement).toBeLessThanOrEqual(5);
    });
  });

  describe('Social Awareness', () => {
    it('scores based on empathy match + SEL question', () => {
      const responses = [
        makeResponse({ emojiLabel: 'Happy', empathyTag: 'Happy' }),
        makeResponse({ emojiLabel: 'Sad', empathyTag: 'Sad' }),
      ];
      const answers = [makeSelAnswer('socialAwareness', true)];
      const report = computeCaselScores(responses, answers);
      // All empathy match (3) + correct question (2) = 5
      expect(report.scores.socialAwareness).toBe(5);
    });

    it('handles split empathy tags like Happy/Calm', () => {
      const responses = [
        makeResponse({ emojiLabel: 'Calm', empathyTag: 'Happy/Calm' }),
      ];
      const report = computeCaselScores(responses);
      // 1 match out of 1 = ceil(1/1 * 3) = 3
      expect(report.scores.socialAwareness).toBe(3);
    });
  });

  describe('Relationship Skills', () => {
    it('scores based on bond scenes + SEL question', () => {
      const responses = [
        makeResponse({ emojiValence: 'positive', isBondScene: true }),
        makeResponse({ emojiValence: 'positive', isBondScene: true }),
      ];
      const answers = [makeSelAnswer('relationshipSkills', true)];
      const report = computeCaselScores(responses, answers);
      // All positive bond (3) + correct question (2) = 5
      expect(report.scores.relationshipSkills).toBe(5);
    });
  });

  describe('Responsible Decision-Making', () => {
    it('scores high with thoughtful responses + correct MCQ', () => {
      const responses = [
        makeResponse({ emojiLabel: 'Happy', responseTimeMs: 5000 }),
        makeResponse({ emojiLabel: 'Sad', responseTimeMs: 5000 }),
      ];
      const answers = [makeMcqAnswer(true)];
      const report = computeCaselScores(responses, answers);
      // thoughtful (1) + completed (1) + mcq correct (2) + variety (1) = 5
      expect(report.scores.responsibleDecisionMaking).toBe(5);
    });

    it('scores lower when rushing (all under 2s)', () => {
      const responses = makeResponses(2, { responseTimeMs: 1500 });
      const report = computeCaselScores(responses);
      // no thoughtful (0) + completed (1) + no mcq (0) + no variety (0) = 1
      expect(report.scores.responsibleDecisionMaking).toBeLessThanOrEqual(2);
    });
  });

  describe('Report', () => {
    it('always includes disclaimer', () => {
      const responses = makeResponses(2);
      const report = computeCaselScores(responses);
      expect(report.disclaimer).toContain('not a clinical assessment');
    });

    it('generates descriptions for all 5 competencies', () => {
      const responses = makeResponses(2);
      const report = computeCaselScores(responses);
      expect(Object.keys(report.descriptions)).toHaveLength(5);
    });
  });
});
