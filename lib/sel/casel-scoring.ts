import type { EmojiOption } from './emoji-sets';
import type { SceneConfig } from './themes';

export interface SceneResponse {
  emojiPicked: string | null; // null = no_response (30s timeout)
  emojiLabel: string | null;
  emojiValence: 'positive' | 'negative' | 'neutral' | null;
  responseTimeMs: number;
  empathyTag: string; // the contextually empathetic emoji for this scene
  isBondScene: boolean;
}

export interface CaselScores {
  selfAwareness: number;
  selfManagement: number;
  socialAwareness: number;
  relationshipSkills: number;
  responsibleDecisionMaking: number;
}

export interface CaselReport {
  scores: CaselScores;
  descriptions: Record<keyof CaselScores, string>;
  overallSummary: string;
  disclaimer: string;
}

const DISCLAIMER = 'This is an exploratory activity, not a clinical assessment. Results reflect your child\'s engagement with the stories and should not be used for diagnosis.';

export function computeCaselScores(responses: SceneResponse[]): CaselReport {
  const scores: CaselScores = {
    selfAwareness: computeSelfAwareness(responses),
    selfManagement: computeSelfManagement(responses),
    socialAwareness: computeSocialAwareness(responses),
    relationshipSkills: computeRelationshipSkills(responses),
    responsibleDecisionMaking: computeResponsibleDecisionMaking(responses),
  };

  return {
    scores,
    descriptions: generateDescriptions(scores, responses),
    overallSummary: generateOverallSummary(scores),
    disclaimer: DISCLAIMER,
  };
}

function computeSelfAwareness(responses: SceneResponse[]): number {
  const validResponses = responses.filter(r => r.emojiLabel !== null);
  const uniqueEmojis = new Set(validResponses.map(r => r.emojiLabel));
  return Math.max(1, Math.min(5, uniqueEmojis.size));
}

function computeSelfManagement(responses: SceneResponse[]): number {
  const validResponses = responses.filter(r => r.emojiValence !== null);
  let recoveryTransitions = 0;
  let possibleTransitions = 0;

  for (let i = 0; i < validResponses.length - 1; i++) {
    if (validResponses[i].emojiValence === 'negative') {
      possibleTransitions++;
      if (validResponses[i + 1].emojiValence === 'positive') {
        recoveryTransitions++;
      }
    }
  }

  if (possibleTransitions === 0) {
    // No negative emotions were selected, which suggests emotional stability
    const allPositive = validResponses.every(r => r.emojiValence === 'positive');
    return allPositive ? 4 : 3;
  }

  return Math.max(1, Math.min(5, Math.ceil((recoveryTransitions / Math.max(1, possibleTransitions)) * 5)));
}

function computeSocialAwareness(responses: SceneResponse[]): number {
  const validResponses = responses.filter(r => r.emojiLabel !== null && r.empathyTag !== '');
  if (validResponses.length === 0) return 3;

  let empathyMatches = 0;
  for (const r of validResponses) {
    // Check if the picked emoji matches the empathetic response for this scene
    // Allow partial matches (e.g., "Happy" matches "Happy/Calm")
    const tags = r.empathyTag.split('/');
    if (tags.some(tag => r.emojiLabel === tag)) {
      empathyMatches++;
    }
  }

  return Math.max(1, Math.min(5, Math.ceil((empathyMatches / Math.max(1, validResponses.length)) * 5)));
}

function computeRelationshipSkills(responses: SceneResponse[]): number {
  const bondScenes = responses.filter(r => r.isBondScene);
  if (bondScenes.length === 0) return 3;

  const positiveOnBond = bondScenes.filter(r => r.emojiValence === 'positive').length;
  return Math.max(1, Math.min(5, Math.ceil((positiveOnBond / Math.max(1, bondScenes.length)) * 5)));
}

function computeResponsibleDecisionMaking(responses: SceneResponse[]): number {
  let score = 0;

  // Factor 1: Not rushing (responseTime > 3000ms for at least 3/5 scenes)
  const thoughtfulResponses = responses.filter(r => r.responseTimeMs > 3000).length;
  if (thoughtfulResponses >= 3) score += 1.67;

  // Factor 2: Variety (more than 2 unique emojis)
  const uniqueEmojis = new Set(responses.filter(r => r.emojiLabel !== null).map(r => r.emojiLabel));
  if (uniqueEmojis.size > 2) score += 1.67;

  // Factor 3: Completed all 5 scenes
  const completedScenes = responses.filter(r => r.emojiLabel !== null).length;
  if (completedScenes === 5) score += 1.67;

  return Math.max(1, Math.min(5, Math.ceil(score)));
}

function generateDescriptions(scores: CaselScores, responses: SceneResponse[]): Record<keyof CaselScores, string> {
  const uniqueCount = new Set(responses.filter(r => r.emojiLabel).map(r => r.emojiLabel)).size;

  return {
    selfAwareness: scores.selfAwareness >= 4
      ? `Your child recognized ${uniqueCount} different emotions across the story`
      : `Your child is beginning to identify different emotional responses`,
    selfManagement: scores.selfManagement >= 4
      ? 'Showed emotional recovery after challenging moments'
      : 'Building the ability to process difficult emotions',
    socialAwareness: scores.socialAwareness >= 4
      ? 'Demonstrated empathy for characters in the story'
      : 'Developing awareness of how others feel',
    relationshipSkills: scores.relationshipSkills >= 4
      ? 'Responded positively to scenes of friendship and loyalty'
      : 'Growing understanding of what makes relationships strong',
    responsibleDecisionMaking: scores.responsibleDecisionMaking >= 4
      ? 'Took time to reflect on each scene thoughtfully'
      : 'Building the habit of pausing to think before responding',
  };
}

function generateOverallSummary(scores: CaselScores): string {
  const avg = Object.values(scores).reduce((a, b) => a + b, 0) / 5;
  if (avg >= 4) return 'Your child showed strong emotional engagement with the story. They recognized diverse emotions, showed empathy, and took time to reflect.';
  if (avg >= 3) return 'Your child is developing healthy emotional awareness. They engaged with the story and showed growing ability to identify and process feelings.';
  return 'This was a great first step in exploring emotions through stories. Regular practice helps build emotional awareness over time.';
}
