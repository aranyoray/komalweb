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

export interface QuestionAnswer {
  questionType: 'mcq' | 'sel';
  selDimension?: string;
  selectedIndex: number;
  correctIndex: number;
  isCorrect: boolean;
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

export function computeCaselScores(responses: SceneResponse[], questionAnswers?: QuestionAnswer[]): CaselReport {
  const selAnswers = (questionAnswers || []).filter(a => a.questionType === 'sel');
  const mcqAnswers = (questionAnswers || []).filter(a => a.questionType === 'mcq');

  const scores: CaselScores = {
    selfAwareness: computeSelfAwareness(responses, selAnswers),
    selfManagement: computeSelfManagement(responses),
    socialAwareness: computeSocialAwareness(responses, selAnswers),
    relationshipSkills: computeRelationshipSkills(responses, selAnswers),
    responsibleDecisionMaking: computeResponsibleDecisionMaking(responses, mcqAnswers),
  };

  return {
    scores,
    descriptions: generateDescriptions(scores, responses),
    overallSummary: generateOverallSummary(scores),
    disclaimer: DISCLAIMER,
  };
}

function computeSelfAwareness(responses: SceneResponse[], selAnswers: QuestionAnswer[]): number {
  // Combine emoji diversity with SEL self-awareness question
  const validResponses = responses.filter(r => r.emojiLabel !== null);
  const uniqueEmojis = new Set(validResponses.map(r => r.emojiLabel));
  const emojiScore = Math.max(1, Math.min(3, uniqueEmojis.size)); // max 3 from emojis

  const saQuestion = selAnswers.find(a => a.selDimension === 'selfAwareness');
  const questionScore = saQuestion?.isCorrect ? 2 : 0; // 2 points from correct answer

  return Math.max(1, Math.min(5, emojiScore + questionScore));
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

function computeSocialAwareness(responses: SceneResponse[], selAnswers: QuestionAnswer[]): number {
  const validResponses = responses.filter(r => r.emojiLabel !== null && r.empathyTag !== '');

  let empathyMatches = 0;
  for (const r of validResponses) {
    const tags = r.empathyTag.split('/');
    if (tags.some(tag => r.emojiLabel === tag)) {
      empathyMatches++;
    }
  }

  const emojiScore = validResponses.length > 0
    ? Math.ceil((empathyMatches / Math.max(1, validResponses.length)) * 3)
    : 1; // max 3 from empathy matching

  const saQuestion = selAnswers.find(a => a.selDimension === 'socialAwareness');
  const questionScore = saQuestion?.isCorrect ? 2 : 0;

  return Math.max(1, Math.min(5, emojiScore + questionScore));
}

function computeRelationshipSkills(responses: SceneResponse[], selAnswers: QuestionAnswer[]): number {
  const bondScenes = responses.filter(r => r.isBondScene);
  const positiveOnBond = bondScenes.filter(r => r.emojiValence === 'positive').length;
  const emojiScore = bondScenes.length > 0
    ? Math.ceil((positiveOnBond / Math.max(1, bondScenes.length)) * 3)
    : 1; // max 3 from emoji

  const rsQuestion = selAnswers.find(a => a.selDimension === 'relationshipSkills');
  const questionScore = rsQuestion?.isCorrect ? 2 : 0;

  return Math.max(1, Math.min(5, emojiScore + questionScore));
}

function computeResponsibleDecisionMaking(responses: SceneResponse[], mcqAnswers: QuestionAnswer[]): number {
  let score = 0;

  // Factor 1: Not rushing (responseTime > 3000ms)
  const thoughtfulResponses = responses.filter(r => r.responseTimeMs > 3000).length;
  if (thoughtfulResponses >= 1) score += 1; // adjusted for 2 emoji responses

  // Factor 2: Completed emoji responses
  const completedScenes = responses.filter(r => r.emojiLabel !== null).length;
  if (completedScenes >= 2) score += 1;

  // Factor 3: MCQ correctness (comprehension)
  const mcqCorrect = mcqAnswers.filter(a => a.isCorrect).length;
  if (mcqCorrect > 0) score += 2;

  // Factor 4: Variety in responses
  const uniqueEmojis = new Set(responses.filter(r => r.emojiLabel !== null).map(r => r.emojiLabel));
  if (uniqueEmojis.size >= 2) score += 1;

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
