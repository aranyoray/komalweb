export interface SceneConfig {
  description: string;
  caption: string;
  empathyEmoji: string; // the contextually empathetic response for CASEL scoring
  isBondScene: boolean;
  narrativeRole: 'setup' | 'challenge' | 'turning_point' | 'climax' | 'resolution';
}

export interface AdaptationRule {
  emotion: string; // emoji label
  direction: string; // prompt adaptation instruction
  targetMood: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  description: string;
  palette: { bg: string; accent: string; text: string };
  characters: string; // character description for prompt
  settings: string;
  scenes: SceneConfig[];
  adaptations: Record<string, AdaptationRule>; // keyed by general emotion category
  fallbackImages: string[]; // paths to 3 static fallback images
  staticImages: string[]; // pre-generated images, 5 per theme
}

/** Shuffle array using Fisher-Yates */
export function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/** Get a shuffled set of 5 scene images + captions for a theme */
export function getShuffledSession(theme: ThemeConfig): { image: string; caption: string; empathyEmoji: string; isBondScene: boolean }[] {
  const indices = [0, 1, 2, 3, 4];
  const shuffled = shuffleArray(indices);
  return shuffled.map(i => ({
    image: theme.staticImages[i],
    caption: theme.scenes[i].caption,
    empathyEmoji: theme.scenes[i].empathyEmoji,
    isBondScene: theme.scenes[i].isBondScene,
  }));
}

export const themes: ThemeConfig[] = [
  {
    id: 'ramayana',
    name: 'Ramayana',
    description: 'The epic journey of Rama, Sita, and Hanuman',
    palette: { bg: '#f0f7f0', accent: '#2d6a4f', text: '#1b4332' },
    characters: 'Rama: young man with blue-tinted skin, golden crown with red jewel, yellow dhoti, holding a bow at rest (not drawn), calm determined expression. Sita: green sari, gentle face, flower in hair. Hanuman: golden fur, devotional expression, red dhoti. Ravana: 10 heads but NOT scary, regal and dramatic.',
    settings: 'Ancient Indian forests, ornate palaces, vast ocean, Lanka as a beautiful golden city.',
    scenes: [
      { description: 'Rama and Sita walking peacefully through a lush forest, birds and deer around them', caption: 'Rama and Sita begin their journey through the forest', empathyEmoji: 'Happy', isBondScene: true, narrativeRole: 'setup' },
      { description: 'Ravana appears in the sky, dramatic but not scary, Sita looking worried', caption: 'Sita is taken far away by the powerful king Ravana', empathyEmoji: 'Sad', isBondScene: false, narrativeRole: 'challenge' },
      { description: '', caption: '', empathyEmoji: '', isBondScene: false, narrativeRole: 'turning_point' }, // adaptive
      { description: '', caption: '', empathyEmoji: '', isBondScene: false, narrativeRole: 'climax' }, // adaptive
      { description: 'Rama and Sita reunited, Hanuman celebrating, flowers falling from the sky, everyone smiling', caption: 'Rama and Sita are reunited at last — a joyful homecoming', empathyEmoji: 'Happy', isBondScene: true, narrativeRole: 'resolution' },
    ],
    adaptations: {
      positive: { emotion: 'Happy/Calm/Brave', direction: 'Show a more dramatic scene — Rama crossing the ocean with determination, building the bridge to Lanka. Higher energy, heroic mood.', targetMood: 'heroic' },
      negative: { emotion: 'Sad/Scared/Anxious', direction: 'Show Hanuman arriving with reassurance — flying through the sky carrying the mountain of healing herbs. Warm colors, safety, hope.', targetMood: 'reassuring' },
      neutral: { emotion: 'Wow/Confused/Conflicted', direction: 'Show a wise character explaining — the eagle Jatayu telling Rama where Sita was taken. Clarity, understanding, gentle wisdom.', targetMood: 'clarifying' },
    },
    fallbackImages: ['/sel/fallback/ramayana-1.svg', '/sel/fallback/ramayana-2.svg', '/sel/fallback/ramayana-3.svg'],
    staticImages: ['/sel/images/ramayana/scene-1.png', '/sel/images/ramayana/scene-2.png', '/sel/images/ramayana/scene-3.png', '/sel/images/ramayana/scene-4.png', '/sel/images/ramayana/scene-5.png'],
  },
  {
    id: 'mahabharata',
    name: 'Mahabharata',
    description: 'The great tale of the Pandavas and Krishna',
    palette: { bg: '#f5f0ff', accent: '#7c3aed', text: '#4c1d95' },
    characters: 'Arjuna: warrior with focused expression, bow and arrows, blue-silver armor. Krishna: blue skin, peacock feather crown, flute, peaceful smile, yellow robes. Draupadi: regal bearing, red and gold sari. Bhishma: elder with white hair, wise expression, grandfather figure.',
    settings: 'Royal palaces with columns, the vast field of Kurukshetra (open green field, NOT bloody), golden chariots.',
    scenes: [
      { description: 'Young Pandava children and Kaurava children playing together in a palace garden', caption: 'The Pandavas and Kauravas grow up together as family', empathyEmoji: 'Happy', isBondScene: true, narrativeRole: 'setup' },
      { description: 'Draupadi standing tall in a royal court while others look on with concern', caption: 'Draupadi faces a difficult moment with courage', empathyEmoji: 'Sad', isBondScene: false, narrativeRole: 'challenge' },
      { description: '', caption: '', empathyEmoji: '', isBondScene: false, narrativeRole: 'turning_point' },
      { description: '', caption: '', empathyEmoji: '', isBondScene: false, narrativeRole: 'climax' },
      { description: 'Krishna speaking gently to Arjuna with a glowing aura, chariot on a peaceful morning field', caption: 'Krishna shares wisdom — every action matters', empathyEmoji: 'Calm', isBondScene: true, narrativeRole: 'resolution' },
    ],
    adaptations: {
      positive: { emotion: 'Happy/Brave/Determined', direction: 'Show Arjuna practicing archery with incredible skill — splitting a fish-eye target. Focused, impressive, confident mood.', targetMood: 'confident' },
      negative: { emotion: 'Sad/Scared/Anxious', direction: 'Show Krishna comforting Arjuna — sitting together under a tree, Krishna explaining that everything will be alright. Warm, gentle.', targetMood: 'comforting' },
      neutral: { emotion: 'Confused/Conflicted/Wow', direction: 'Show Bhishma the grandfather telling stories to the children — wisdom being passed down, lanterns glowing, peaceful evening.', targetMood: 'wise' },
    },
    fallbackImages: ['/sel/fallback/mahabharata-1.svg', '/sel/fallback/mahabharata-2.svg', '/sel/fallback/mahabharata-3.svg'],
    staticImages: ['/sel/images/mahabharata/scene-1.png', '/sel/images/mahabharata/scene-2.png', '/sel/images/mahabharata/scene-3.png', '/sel/images/mahabharata/scene-4.png', '/sel/images/mahabharata/scene-5.png'],
  },
  {
    id: 'panchatantra',
    name: 'Panchatantra',
    description: 'Wise animal fables that teach life lessons',
    palette: { bg: '#fef9ef', accent: '#ea580c', text: '#9a3412' },
    characters: 'Talking animals with expressive faces: a wise lion with a gentle crown, a clever rabbit with bright eyes, a loyal crow with glossy feathers, a kind deer with soft spots, a playful monkey with a long tail. Animals wear minimal traditional accessories — small necklaces or headbands.',
    settings: 'Lush jungle clearings, sparkling rivers, colorful Indian villages, simple countryside with mango trees.',
    scenes: [
      { description: 'A group of animal friends gathered around a pond — lion, rabbit, crow, deer, monkey — chatting happily', caption: 'The forest friends gather by the pond to share stories', empathyEmoji: 'Happy', isBondScene: true, narrativeRole: 'setup' },
      { description: 'A sly jackal approaching the group with a sneaky expression, the other animals looking uncertain', caption: 'A trickster arrives and causes trouble for the friends', empathyEmoji: 'Scared', isBondScene: false, narrativeRole: 'challenge' },
      { description: '', caption: '', empathyEmoji: '', isBondScene: false, narrativeRole: 'turning_point' },
      { description: '', caption: '', empathyEmoji: '', isBondScene: false, narrativeRole: 'climax' },
      { description: 'All animals celebrating together, the trickster looking embarrassed but included, rainbow in sky', caption: 'Friendship and cleverness win the day!', empathyEmoji: 'Happy', isBondScene: true, narrativeRole: 'resolution' },
    ],
    adaptations: {
      positive: { emotion: 'Happy/Brave', direction: 'Show the rabbit coming up with a clever plan — drawing in the dirt with a stick, other animals watching with excitement. Bright, energetic.', targetMood: 'exciting' },
      negative: { emotion: 'Sad/Scared', direction: 'Show the deer and monkey huddling together for safety — supporting each other, looking out for danger together. Warm, protective.', targetMood: 'protective' },
      neutral: { emotion: 'Wow/Confused', direction: 'Show the wise lion explaining the trickster\'s plan to the group — using paw gestures, animals leaning in to listen. Educational, clear.', targetMood: 'educational' },
    },
    fallbackImages: ['/sel/fallback/panchatantra-1.svg', '/sel/fallback/panchatantra-2.svg', '/sel/fallback/panchatantra-3.svg'],
    staticImages: ['/sel/images/panchatantra/scene-1.png', '/sel/images/panchatantra/scene-2.png', '/sel/images/panchatantra/scene-3.png', '/sel/images/panchatantra/scene-4.png', '/sel/images/panchatantra/scene-5.png'],
  },
  {
    id: 'krishna-leela',
    name: 'Krishna Leela',
    description: 'Playful adventures of young Krishna',
    palette: { bg: '#fefce8', accent: '#ca8a04', text: '#854d0e' },
    characters: 'Young Krishna: playful child with blue skin, peacock feather in hair, yellow dhoti, mischievous smile. Yashoda: loving mother with warm expression, simple sari. Gopis: group of colorful village girls. Balaram: older brother, white skin, protective stance.',
    settings: 'Vrindavan village with thatched huts, Yamuna river with lotus flowers, butter pots stacked in kitchens, pastoral green fields with cows.',
    scenes: [
      { description: 'Baby Krishna on Yashoda\'s lap, both laughing, butter pot nearby, warm kitchen setting', caption: 'Little Krishna and his mother Yashoda share a joyful moment', empathyEmoji: 'Happy', isBondScene: true, narrativeRole: 'setup' },
      { description: 'Young Krishna climbing a stack of pots to reach butter on a high shelf, gopis watching and giggling', caption: 'Krishna sneaks butter from the kitchen — what a mischief maker!', empathyEmoji: 'Wow', isBondScene: false, narrativeRole: 'challenge' },
      { description: '', caption: '', empathyEmoji: '', isBondScene: false, narrativeRole: 'turning_point' },
      { description: '', caption: '', empathyEmoji: '', isBondScene: false, narrativeRole: 'climax' },
      { description: 'Krishna playing flute by the river, animals and children gathered peacefully, golden sunset', caption: 'Krishna\'s music fills everyone with peace and happiness', empathyEmoji: 'Calm', isBondScene: true, narrativeRole: 'resolution' },
    ],
    adaptations: {
      positive: { emotion: 'Happy/Calm/Brave', direction: 'Show Krishna lifting a mountain (Govardhan) to protect the village from rain — villagers sheltering underneath, amazed and grateful. Heroic but playful.', targetMood: 'awe' },
      negative: { emotion: 'Sad/Scared', direction: 'Show Yashoda comforting Krishna after he gets caught stealing butter — she\'s scolding but smiling, he\'s making innocent eyes. Warm, loving.', targetMood: 'tender' },
      neutral: { emotion: 'Wow/Confused', direction: 'Show Krishna opening his mouth to show Yashoda the entire universe inside — stars, planets, galaxies, her own face. Magical, wondrous.', targetMood: 'magical' },
    },
    fallbackImages: ['/sel/fallback/krishna-1.svg', '/sel/fallback/krishna-2.svg', '/sel/fallback/krishna-3.svg'],
    staticImages: ['/sel/images/krishna-leela/scene-1.png', '/sel/images/krishna-leela/scene-2.png', '/sel/images/krishna-leela/scene-3.png', '/sel/images/krishna-leela/scene-4.png', '/sel/images/krishna-leela/scene-5.png'],
  },
  {
    id: 'jataka-tales',
    name: 'Jataka Tales',
    description: 'Ancient stories of wisdom and compassion',
    palette: { bg: '#fdf4e8', accent: '#b45309', text: '#78350f' },
    characters: 'The Bodhisattva: appears as a kind deer with golden antlers in this story. Villagers: simple, warm-hearted people in traditional clothing. A wise elder: old man with walking stick and gentle smile.',
    settings: 'Ancient Indian villages with simple clay huts, peaceful forests with banyan trees, bustling marketplaces with colorful stalls, quiet meditation spots by streams.',
    scenes: [
      { description: 'A golden deer (the Bodhisattva) resting peacefully under a great banyan tree, sunlight filtering through leaves', caption: 'In a peaceful forest, a special deer watches over all creatures', empathyEmoji: 'Calm', isBondScene: false, narrativeRole: 'setup' },
      { description: 'A small bird with a broken wing sitting alone on a rock, looking sad, rain beginning to fall', caption: 'A little bird is hurt and needs help — who will come?', empathyEmoji: 'Sad', isBondScene: false, narrativeRole: 'challenge' },
      { description: '', caption: '', empathyEmoji: '', isBondScene: false, narrativeRole: 'turning_point' },
      { description: '', caption: '', empathyEmoji: '', isBondScene: false, narrativeRole: 'climax' },
      { description: 'The deer and the healed bird walking together through a sunlit forest, other animals following, flowers blooming', caption: 'Compassion makes the world more beautiful for everyone', empathyEmoji: 'Happy', isBondScene: true, narrativeRole: 'resolution' },
    ],
    adaptations: {
      positive: { emotion: 'Happy/Calm/Brave', direction: 'Show the deer teaching young animals about kindness — gathered in a circle, the deer speaking gently, young animals listening with wide eyes. Wise, nurturing.', targetMood: 'nurturing' },
      negative: { emotion: 'Sad/Scared', direction: 'Show the deer gently carrying the injured bird on its back through the forest — sheltering it from rain with large leaves. Tender, protective, safe.', targetMood: 'protective' },
      neutral: { emotion: 'Wow/Confused', direction: 'Show the wise elder of the village telling the story of the deer to children — using hand shadows against a wall, children\'s faces lit by firelight. Storytelling, wonder.', targetMood: 'wonder' },
    },
    fallbackImages: ['/sel/fallback/jataka-1.svg', '/sel/fallback/jataka-2.svg', '/sel/fallback/jataka-3.svg'],
    staticImages: ['/sel/images/jataka-tales/scene-1.png', '/sel/images/jataka-tales/scene-2.png', '/sel/images/jataka-tales/scene-3.png', '/sel/images/jataka-tales/scene-4.png', '/sel/images/jataka-tales/scene-5.png'],
  },
];

export function getThemeById(id: string): ThemeConfig | undefined {
  return themes.find(t => t.id === id);
}

export function getAdaptationDirection(theme: ThemeConfig, emotionValence: 'positive' | 'negative' | 'neutral'): AdaptationRule {
  return theme.adaptations[emotionValence];
}

export function getAdaptiveScenePrompt(
  theme: ThemeConfig,
  sceneIndex: number,
  previousEmotion: { label: string; valence: 'positive' | 'negative' | 'neutral' } | null,
  ageGroup: string
): { prompt: string; caption: string; empathyEmoji: string } {
  const scene = theme.scenes[sceneIndex];

  // Fixed scenes (1, 2, 5) use pre-defined descriptions
  if (scene.description) {
    return {
      prompt: buildImagePrompt(theme, scene.description, ageGroup, sceneIndex),
      caption: scene.caption,
      empathyEmoji: scene.empathyEmoji,
    };
  }

  // Adaptive scenes (3, 4) use adaptation rules
  const valence = previousEmotion?.valence || 'neutral';
  const adaptation = getAdaptationDirection(theme, valence);

  const adaptiveCaption = sceneIndex === 2
    ? `The story takes a turn — ${adaptation.targetMood}`
    : `The moment of truth — ${adaptation.targetMood}`;

  const adaptiveEmpathy = valence === 'negative' ? 'Calm' : valence === 'positive' ? 'Brave' : 'Wow';

  return {
    prompt: buildImagePrompt(theme, adaptation.direction, ageGroup, sceneIndex),
    caption: adaptiveCaption,
    empathyEmoji: adaptiveEmpathy,
  };
}

function buildImagePrompt(theme: ThemeConfig, sceneDescription: string, ageGroup: string, sceneIndex: number): string {
  return `Generate a child-friendly watercolor illustration for children ages ${ageGroup}.
Theme: ${theme.name}
Scene ${sceneIndex + 1} of 5: ${sceneDescription}
Style: Soft watercolor, warm palette, traditional Indian art elements, rounded forms, no sharp edges.
Characters: ${theme.characters}
Settings: ${theme.settings}
Safety: No violence, blood, weapons in use, scary imagery, or content unsuitable for children. No modern elements.
Art direction: Consistent soft watercolor style with warm colors. Characters should be depicted with gentle, expressive faces.`;
}
