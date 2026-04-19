export type AgeGroup = '3-6' | '7-9' | '10-12';

export interface EmojiOption {
  emoji: string;
  label: string;
  valence: 'positive' | 'negative' | 'neutral';
}

export const emojiSets: Record<AgeGroup, { emojis: EmojiOption[]; size: number; showLabels: boolean }> = {
  '3-6': {
    emojis: [
      { emoji: '😊', label: 'Happy', valence: 'positive' },
      { emoji: '😢', label: 'Sad', valence: 'negative' },
      { emoji: '😨', label: 'Scared', valence: 'negative' },
      { emoji: '😲', label: 'Wow', valence: 'neutral' },
      { emoji: '😌', label: 'Calm', valence: 'positive' },
    ],
    size: 64,
    showLabels: false,
  },
  '7-9': {
    emojis: [
      { emoji: '😊', label: 'Happy', valence: 'positive' },
      { emoji: '😢', label: 'Sad', valence: 'negative' },
      { emoji: '😨', label: 'Scared', valence: 'negative' },
      { emoji: '🤔', label: 'Confused', valence: 'neutral' },
      { emoji: '💪', label: 'Brave', valence: 'positive' },
    ],
    size: 48,
    showLabels: true,
  },
  '10-12': {
    emojis: [
      { emoji: '🤗', label: 'Empathetic', valence: 'positive' },
      { emoji: '😢', label: 'Sad', valence: 'negative' },
      { emoji: '😰', label: 'Anxious', valence: 'negative' },
      { emoji: '🤔', label: 'Conflicted', valence: 'neutral' },
      { emoji: '💪', label: 'Determined', valence: 'positive' },
    ],
    size: 40,
    showLabels: true,
  },
};
