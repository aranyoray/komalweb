export interface SceneConfig {
  description: string;
  caption: string;
  teacherLine: string; // narration line for the teacher to read aloud
  empathyEmoji: string; // the contextually empathetic response for CASEL scoring
  isBondScene: boolean;
  narrativeRole: 'setup' | 'challenge' | 'turning_point' | 'climax' | 'resolution';
}

export interface EndQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  type: 'mcq' | 'sel';
  selDimension?: 'selfAwareness' | 'socialAwareness' | 'relationshipSkills';
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
  ageRanking: Record<string, number>; // lower = shown first for that age group
  mainCharacter: string; // primary character name for feeling questions
  endQuestions: EndQuestion[]; // 1 MCQ + 3 SEL questions at end of microlesson
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
export function getShuffledSession(theme: ThemeConfig): { image: string; caption: string; teacherLine: string; empathyEmoji: string; isBondScene: boolean }[] {
  const indices = [0, 1, 2, 3, 4];
  const shuffled = shuffleArray(indices);
  return shuffled.map(i => ({
    image: theme.staticImages[i],
    caption: theme.scenes[i].caption,
    teacherLine: theme.scenes[i].teacherLine,
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
      { description: 'Rama and Sita walking peacefully through a lush forest, birds and deer around them', caption: 'Rama and Sita begin their journey through the forest', teacherLine: 'Look at Rama and Sita walking together through the beautiful forest. The birds are singing and the deer are playing around them. They look so happy together!', empathyEmoji: 'Happy', isBondScene: true, narrativeRole: 'setup' },
      { description: 'Ravana appears in the sky, dramatic but not scary, Sita looking worried', caption: 'Sita is taken far away by the powerful king Ravana', teacherLine: 'Oh no! The powerful king Ravana has taken Sita away. Rama is very worried about her. What do you think Rama is feeling right now?', empathyEmoji: 'Sad', isBondScene: false, narrativeRole: 'challenge' },
      { description: 'Hanuman flying over the vast ocean toward Lanka, determination on his face', caption: 'Brave Hanuman flies across the ocean to find Sita', teacherLine: 'Hanuman loves Rama so much that he flies all the way across the big ocean to find Sita. He is very brave and never gives up!', empathyEmoji: 'Brave', isBondScene: false, narrativeRole: 'turning_point' },
      { description: 'Rama leading his army of monkeys across a stone bridge over the ocean', caption: 'Rama and his friends build a bridge to rescue Sita', teacherLine: 'Rama and all his friends work together to build a bridge across the ocean. When we help each other, we can do amazing things!', empathyEmoji: 'Brave', isBondScene: true, narrativeRole: 'climax' },
      { description: 'Rama and Sita reunited, Hanuman celebrating, flowers falling from the sky, everyone smiling', caption: 'Rama and Sita are reunited at last — a joyful homecoming', teacherLine: 'At last, Rama and Sita are together again! Everyone is so happy. Flowers are falling from the sky. How does this make you feel?', empathyEmoji: 'Happy', isBondScene: true, narrativeRole: 'resolution' },
    ],
    adaptations: {
      positive: { emotion: 'Happy/Calm/Brave', direction: 'Show a more dramatic scene — Rama crossing the ocean with determination, building the bridge to Lanka. Higher energy, heroic mood.', targetMood: 'heroic' },
      negative: { emotion: 'Sad/Scared/Anxious', direction: 'Show Hanuman arriving with reassurance — flying through the sky carrying the mountain of healing herbs. Warm colors, safety, hope.', targetMood: 'reassuring' },
      neutral: { emotion: 'Wow/Confused/Conflicted', direction: 'Show a wise character explaining — the eagle Jatayu telling Rama where Sita was taken. Clarity, understanding, gentle wisdom.', targetMood: 'clarifying' },
    },
    fallbackImages: ['/sel/fallback/ramayana-1.svg', '/sel/fallback/ramayana-2.svg', '/sel/fallback/ramayana-3.svg'],
    staticImages: ['/sel/images/ramayana/scene-1.png', '/sel/images/ramayana/scene-2.png', '/sel/images/ramayana/scene-3.png', '/sel/images/ramayana/scene-4.png', '/sel/images/ramayana/scene-5.png'],
    ageRanking: { '3-6': 3, '7-9': 1, '10-12': 2 },
    mainCharacter: 'Rama',
    endQuestions: [
      { question: 'What happened to Sita in the story?', options: ['She went on a holiday', 'She was taken away by Ravana', 'She went to sleep', 'She climbed a mountain'], correctIndex: 1, type: 'mcq' },
      { question: 'How did Rama feel when Sita was taken away?', options: ['Happy and excited', 'Sleepy and bored', 'Sad and worried', 'Angry at his friends'], correctIndex: 2, type: 'sel', selDimension: 'selfAwareness' },
      { question: 'Why did Hanuman help Rama find Sita?', options: ['Because Rama paid him', 'Because he cared about Rama and Sita', 'Because he was bored', 'Because he wanted to be king'], correctIndex: 1, type: 'sel', selDimension: 'socialAwareness' },
      { question: 'If your friend was feeling sad like Rama, what would you do?', options: ['Walk away from them', 'Laugh at them', 'Help them and stay with them', 'Tell everyone about it'], correctIndex: 2, type: 'sel', selDimension: 'relationshipSkills' },
    ],
  },
  {
    id: 'mahabharata',
    name: 'Mahabharata',
    description: 'The great tale of the Pandavas and Krishna',
    palette: { bg: '#f5f0ff', accent: '#7c3aed', text: '#4c1d95' },
    characters: 'Arjuna: warrior with focused expression, bow and arrows, blue-silver armor. Krishna: blue skin, peacock feather crown, flute, peaceful smile, yellow robes. Draupadi: regal bearing, red and gold sari. Bhishma: elder with white hair, wise expression, grandfather figure.',
    settings: 'Royal palaces with columns, the vast field of Kurukshetra (open green field, NOT bloody), golden chariots.',
    scenes: [
      { description: 'Young Pandava children and Kaurava children playing together in a palace garden', caption: 'The Pandavas and Kauravas grow up together as family', teacherLine: 'See these children playing together in the beautiful palace garden. They are all cousins! They share, play, and have fun together.', empathyEmoji: 'Happy', isBondScene: true, narrativeRole: 'setup' },
      { description: 'Draupadi standing tall in a royal court while others look on with concern', caption: 'Draupadi faces a difficult moment with courage', teacherLine: 'Something unfair is happening to Draupadi, but she stands tall and brave. Even when things are hard, she doesn\'t give up.', empathyEmoji: 'Sad', isBondScene: false, narrativeRole: 'challenge' },
      { description: 'Arjuna practicing archery, splitting a target with incredible precision', caption: 'Arjuna practices hard and becomes the best archer', teacherLine: 'Arjuna practices every single day. He knows that if he keeps trying, he will get better. Hard work always pays off!', empathyEmoji: 'Brave', isBondScene: false, narrativeRole: 'turning_point' },
      { description: 'Bhishma the grandfather telling stories to the children by firelight', caption: 'Wise Bhishma shares stories of right and wrong', teacherLine: 'Grandfather Bhishma is very wise. He tells the children stories to help them know what is right and what is wrong. Who tells you stories?', empathyEmoji: 'Calm', isBondScene: true, narrativeRole: 'climax' },
      { description: 'Krishna speaking gently to Arjuna with a glowing aura, chariot on a peaceful morning field', caption: 'Krishna shares wisdom — every action matters', teacherLine: 'Krishna tells Arjuna something very important: everything we do matters. Even small kind things can make a big difference!', empathyEmoji: 'Calm', isBondScene: true, narrativeRole: 'resolution' },
    ],
    adaptations: {
      positive: { emotion: 'Happy/Brave/Determined', direction: 'Show Arjuna practicing archery with incredible skill — splitting a fish-eye target. Focused, impressive, confident mood.', targetMood: 'confident' },
      negative: { emotion: 'Sad/Scared/Anxious', direction: 'Show Krishna comforting Arjuna — sitting together under a tree, Krishna explaining that everything will be alright. Warm, gentle.', targetMood: 'comforting' },
      neutral: { emotion: 'Confused/Conflicted/Wow', direction: 'Show Bhishma the grandfather telling stories to the children — wisdom being passed down, lanterns glowing, peaceful evening.', targetMood: 'wise' },
    },
    fallbackImages: ['/sel/fallback/mahabharata-1.svg', '/sel/fallback/mahabharata-2.svg', '/sel/fallback/mahabharata-3.svg'],
    staticImages: ['/sel/images/mahabharata/scene-1.png', '/sel/images/mahabharata/scene-2.png', '/sel/images/mahabharata/scene-3.png', '/sel/images/mahabharata/scene-4.png', '/sel/images/mahabharata/scene-5.png'],
    ageRanking: { '3-6': 8, '7-9': 5, '10-12': 1 },
    mainCharacter: 'Arjuna',
    endQuestions: [
      { question: 'What did Krishna teach Arjuna?', options: ['How to cook', 'That every action matters', 'How to dance', 'How to build a palace'], correctIndex: 1, type: 'mcq' },
      { question: 'How did Draupadi feel during the difficult moment in court?', options: ['Happy and carefree', 'Brave but hurt inside', 'Sleepy and tired', 'Excited and cheerful'], correctIndex: 1, type: 'sel', selDimension: 'selfAwareness' },
      { question: 'Why did Krishna stay calm and help Arjuna?', options: ['He wanted something in return', 'He truly cared about doing what is right', 'He was showing off', 'He had nothing else to do'], correctIndex: 1, type: 'sel', selDimension: 'socialAwareness' },
      { question: 'If someone at school is being treated unfairly, what should you do?', options: ['Ignore it completely', 'Join in the teasing', 'Speak up or tell a trusted adult', 'Laugh about it later'], correctIndex: 2, type: 'sel', selDimension: 'relationshipSkills' },
    ],
  },
  {
    id: 'panchatantra',
    name: 'Panchatantra',
    description: 'Wise animal fables that teach life lessons',
    palette: { bg: '#fef9ef', accent: '#ea580c', text: '#9a3412' },
    characters: 'Talking animals with expressive faces: a wise lion with a gentle crown, a clever rabbit with bright eyes, a loyal crow with glossy feathers, a kind deer with soft spots, a playful monkey with a long tail. Animals wear minimal traditional accessories — small necklaces or headbands.',
    settings: 'Lush jungle clearings, sparkling rivers, colorful Indian villages, simple countryside with mango trees.',
    scenes: [
      { description: 'A group of animal friends gathered around a pond — lion, rabbit, crow, deer, monkey — chatting happily', caption: 'The forest friends gather by the pond to share stories', teacherLine: 'Look at all these animal friends sitting together by the pond! The lion, the rabbit, the crow, the deer, and the monkey. They love sharing stories with each other.', empathyEmoji: 'Happy', isBondScene: true, narrativeRole: 'setup' },
      { description: 'A sly jackal approaching the group with a sneaky expression, the other animals looking uncertain', caption: 'A trickster arrives and causes trouble for the friends', teacherLine: 'Uh oh! A tricky jackal has come to cause trouble. The other animals are not sure what to do. Have you ever met someone who was being tricky?', empathyEmoji: 'Scared', isBondScene: false, narrativeRole: 'challenge' },
      { description: 'The clever rabbit drawing a plan in the dirt, other animals watching with excitement', caption: 'The clever rabbit comes up with a smart plan', teacherLine: 'The little rabbit is very clever! She draws a plan in the dirt to outsmart the trickster. Sometimes the smallest friends have the biggest ideas!', empathyEmoji: 'Happy', isBondScene: false, narrativeRole: 'turning_point' },
      { description: 'The deer and monkey working together to set a gentle trap for the trickster', caption: 'The friends work together to stop the trickster', teacherLine: 'The deer and the monkey are helping each other. When friends work as a team, they can solve any problem together!', empathyEmoji: 'Brave', isBondScene: true, narrativeRole: 'climax' },
      { description: 'All animals celebrating together, the trickster looking embarrassed but included, rainbow in sky', caption: 'Friendship and cleverness win the day!', teacherLine: 'Everyone is celebrating! And look — they even include the trickster. Being kind to everyone, even those who make mistakes, makes the world a better place.', empathyEmoji: 'Happy', isBondScene: true, narrativeRole: 'resolution' },
    ],
    adaptations: {
      positive: { emotion: 'Happy/Brave', direction: 'Show the rabbit coming up with a clever plan — drawing in the dirt with a stick, other animals watching with excitement. Bright, energetic.', targetMood: 'exciting' },
      negative: { emotion: 'Sad/Scared', direction: 'Show the deer and monkey huddling together for safety — supporting each other, looking out for danger together. Warm, protective.', targetMood: 'protective' },
      neutral: { emotion: 'Wow/Confused', direction: 'Show the wise lion explaining the trickster\'s plan to the group — using paw gestures, animals leaning in to listen. Educational, clear.', targetMood: 'educational' },
    },
    fallbackImages: ['/sel/fallback/panchatantra-1.svg', '/sel/fallback/panchatantra-2.svg', '/sel/fallback/panchatantra-3.svg'],
    staticImages: ['/sel/images/panchatantra/scene-1.png', '/sel/images/panchatantra/scene-2.png', '/sel/images/panchatantra/scene-3.png', '/sel/images/panchatantra/scene-4.png', '/sel/images/panchatantra/scene-5.png'],
    ageRanking: { '3-6': 1, '7-9': 3, '10-12': 6 },
    mainCharacter: 'the animals',
    endQuestions: [
      { question: 'What did the friends do when the trickster came?', options: ['They ran away', 'They worked together to outsmart him', 'They fought with him', 'They went to sleep'], correctIndex: 1, type: 'mcq' },
      { question: 'How did the animals feel when the trickster first arrived?', options: ['Very happy', 'Worried and unsure', 'Angry and mean', 'Bored'], correctIndex: 1, type: 'sel', selDimension: 'selfAwareness' },
      { question: 'Why did the friends include the trickster at the end?', options: ['They forgot what happened', 'They wanted to trick him back', 'They believe everyone deserves kindness', 'They were scared of him'], correctIndex: 2, type: 'sel', selDimension: 'socialAwareness' },
      { question: 'If a new kid at school is being tricky, what is the best thing to do?', options: ['Be tricky back to them', 'Tell them you want to be friends and set a good example', 'Ignore them forever', 'Make fun of them'], correctIndex: 1, type: 'sel', selDimension: 'relationshipSkills' },
    ],
  },
  {
    id: 'krishna-leela',
    name: 'Krishna Leela',
    description: 'Playful adventures of young Krishna',
    palette: { bg: '#fefce8', accent: '#ca8a04', text: '#854d0e' },
    characters: 'Young Krishna: playful child with blue skin, peacock feather in hair, yellow dhoti, mischievous smile. Yashoda: loving mother with warm expression, simple sari. Gopis: group of colorful village girls. Balaram: older brother, white skin, protective stance.',
    settings: 'Vrindavan village with thatched huts, Yamuna river with lotus flowers, butter pots stacked in kitchens, pastoral green fields with cows.',
    scenes: [
      { description: 'Baby Krishna on Yashoda\'s lap, both laughing, butter pot nearby, warm kitchen setting', caption: 'Little Krishna and his mother Yashoda share a joyful moment', teacherLine: 'Look at baby Krishna sitting on his mother Yashoda\'s lap. They are laughing and having such a good time together. Can you see the butter pot nearby?', empathyEmoji: 'Happy', isBondScene: true, narrativeRole: 'setup' },
      { description: 'Young Krishna climbing a stack of pots to reach butter on a high shelf, gopis watching and giggling', caption: 'Krishna sneaks butter from the kitchen — what a mischief maker!', teacherLine: 'Krishna is being very naughty! He is climbing up to steal butter from the shelf. The village girls are watching and giggling. Do you think he will get caught?', empathyEmoji: 'Wow', isBondScene: false, narrativeRole: 'challenge' },
      { description: 'Yashoda scolding Krishna lovingly, Krishna making innocent big eyes', caption: 'Yashoda catches Krishna — but how can she stay angry at that face?', teacherLine: 'Yashoda caught Krishna stealing butter! She is scolding him, but look at Krishna\'s innocent face. Even when we make mistakes, the people who love us still care about us.', empathyEmoji: 'Happy', isBondScene: true, narrativeRole: 'turning_point' },
      { description: 'Krishna lifting the Govardhan mountain with one finger, villagers sheltering underneath', caption: 'Krishna lifts a whole mountain to protect his village!', teacherLine: 'It started raining very hard, and Krishna lifted an entire mountain to keep everyone safe! When someone you love is in trouble, you find the strength to help them.', empathyEmoji: 'Brave', isBondScene: true, narrativeRole: 'climax' },
      { description: 'Krishna playing flute by the river, animals and children gathered peacefully, golden sunset', caption: 'Krishna\'s music fills everyone with peace and happiness', teacherLine: 'Krishna is playing his beautiful flute by the river. All the animals and children are sitting peacefully, listening to the music. How does this picture make you feel?', empathyEmoji: 'Calm', isBondScene: true, narrativeRole: 'resolution' },
    ],
    adaptations: {
      positive: { emotion: 'Happy/Calm/Brave', direction: 'Show Krishna lifting a mountain (Govardhan) to protect the village from rain — villagers sheltering underneath, amazed and grateful. Heroic but playful.', targetMood: 'awe' },
      negative: { emotion: 'Sad/Scared', direction: 'Show Yashoda comforting Krishna after he gets caught stealing butter — she\'s scolding but smiling, he\'s making innocent eyes. Warm, loving.', targetMood: 'tender' },
      neutral: { emotion: 'Wow/Confused', direction: 'Show Krishna opening his mouth to show Yashoda the entire universe inside — stars, planets, galaxies, her own face. Magical, wondrous.', targetMood: 'magical' },
    },
    fallbackImages: ['/sel/fallback/krishna-1.svg', '/sel/fallback/krishna-2.svg', '/sel/fallback/krishna-3.svg'],
    staticImages: ['/sel/images/krishna-leela/scene-1.png', '/sel/images/krishna-leela/scene-2.png', '/sel/images/krishna-leela/scene-3.png', '/sel/images/krishna-leela/scene-4.png', '/sel/images/krishna-leela/scene-5.png'],
    ageRanking: { '3-6': 2, '7-9': 2, '10-12': 7 },
    mainCharacter: 'Krishna',
    endQuestions: [
      { question: 'What did Krishna like to steal from the kitchen?', options: ['Fruits', 'Butter', 'Sweets', 'Milk'], correctIndex: 1, type: 'mcq' },
      { question: 'How did Krishna feel when Yashoda caught him stealing butter?', options: ['Very angry', 'A little shy but still happy', 'He didn\'t care at all', 'Scared and crying'], correctIndex: 1, type: 'sel', selDimension: 'selfAwareness' },
      { question: 'Why did Krishna lift the mountain for the villagers?', options: ['To show how strong he was', 'Because he loved them and wanted to keep them safe', 'Because someone told him to', 'To win a competition'], correctIndex: 1, type: 'sel', selDimension: 'socialAwareness' },
      { question: 'If it started raining and your friend had no umbrella, what would you do?', options: ['Run away quickly', 'Share your umbrella with them', 'Laugh at them getting wet', 'Pretend you didn\'t see them'], correctIndex: 1, type: 'sel', selDimension: 'relationshipSkills' },
    ],
  },
  {
    id: 'jataka-tales',
    name: 'Jataka Tales',
    description: 'Ancient stories of wisdom and compassion',
    palette: { bg: '#fdf4e8', accent: '#b45309', text: '#78350f' },
    characters: 'The Bodhisattva: appears as a kind deer with golden antlers in this story. Villagers: simple, warm-hearted people in traditional clothing. A wise elder: old man with walking stick and gentle smile.',
    settings: 'Ancient Indian villages with simple clay huts, peaceful forests with banyan trees, bustling marketplaces with colorful stalls, quiet meditation spots by streams.',
    scenes: [
      { description: 'A golden deer (the Bodhisattva) resting peacefully under a great banyan tree, sunlight filtering through leaves', caption: 'In a peaceful forest, a special deer watches over all creatures', teacherLine: 'In this beautiful forest, there lives a very special golden deer. This deer is kind and gentle, and watches over all the animals. The forest is so peaceful!', empathyEmoji: 'Calm', isBondScene: false, narrativeRole: 'setup' },
      { description: 'A small bird with a broken wing sitting alone on a rock, looking sad, rain beginning to fall', caption: 'A little bird is hurt and needs help — who will come?', teacherLine: 'Oh look, a little bird has hurt its wing and can\'t fly. It\'s sitting all alone on a rock, and it\'s starting to rain. The bird looks very sad. Who do you think will help?', empathyEmoji: 'Sad', isBondScene: false, narrativeRole: 'challenge' },
      { description: 'The golden deer gently carrying the injured bird on its back, sheltering it from rain', caption: 'The kind deer helps the little bird find shelter', teacherLine: 'The golden deer sees the hurt bird and gently carries it on its back. The deer uses big leaves to keep the rain off the bird. That is true kindness!', empathyEmoji: 'Happy', isBondScene: true, narrativeRole: 'turning_point' },
      { description: 'The deer teaching young animals about kindness in a forest circle', caption: 'The deer teaches everyone that helping others makes us stronger', teacherLine: 'Now the deer is teaching all the young animals an important lesson: when we help others, we become stronger and happier ourselves.', empathyEmoji: 'Calm', isBondScene: true, narrativeRole: 'climax' },
      { description: 'The deer and the healed bird walking together through a sunlit forest, other animals following, flowers blooming', caption: 'Compassion makes the world more beautiful for everyone', teacherLine: 'The little bird is all better now! It walks happily with the deer through the sunlit forest. When we show compassion, we make the whole world more beautiful.', empathyEmoji: 'Happy', isBondScene: true, narrativeRole: 'resolution' },
    ],
    adaptations: {
      positive: { emotion: 'Happy/Calm/Brave', direction: 'Show the deer teaching young animals about kindness — gathered in a circle, the deer speaking gently, young animals listening with wide eyes. Wise, nurturing.', targetMood: 'nurturing' },
      negative: { emotion: 'Sad/Scared', direction: 'Show the deer gently carrying the injured bird on its back through the forest — sheltering it from rain with large leaves. Tender, protective, safe.', targetMood: 'protective' },
      neutral: { emotion: 'Wow/Confused', direction: 'Show the wise elder of the village telling the story of the deer to children — using hand shadows against a wall, children\'s faces lit by firelight. Storytelling, wonder.', targetMood: 'wonder' },
    },
    fallbackImages: ['/sel/fallback/jataka-1.svg', '/sel/fallback/jataka-2.svg', '/sel/fallback/jataka-3.svg'],
    staticImages: ['/sel/images/jataka-tales/scene-1.png', '/sel/images/jataka-tales/scene-2.png', '/sel/images/jataka-tales/scene-3.png', '/sel/images/jataka-tales/scene-4.png', '/sel/images/jataka-tales/scene-5.png'],
    ageRanking: { '3-6': 5, '7-9': 4, '10-12': 4 },
    mainCharacter: 'the golden deer',
    endQuestions: [
      { question: 'What did the golden deer do when it found the hurt bird?', options: ['It walked away', 'It carried the bird and gave it shelter', 'It called for help', 'It went to sleep'], correctIndex: 1, type: 'mcq' },
      { question: 'How do you think the little bird felt when the deer helped it?', options: ['Scared and alone', 'Grateful and safe', 'Angry', 'Confused'], correctIndex: 1, type: 'sel', selDimension: 'selfAwareness' },
      { question: 'Why did the deer help the bird even though it was raining?', options: ['The deer wanted a reward', 'The deer felt compassion for the bird', 'Someone told the deer to help', 'The deer was bored'], correctIndex: 1, type: 'sel', selDimension: 'socialAwareness' },
      { question: 'If you see a classmate sitting alone at lunch looking sad, what would you do?', options: ['Keep walking', 'Go sit with them and ask if they\'re okay', 'Tell everyone they have no friends', 'Point and laugh'], correctIndex: 1, type: 'sel', selDimension: 'relationshipSkills' },
    ],
  },
  {
    id: 'ganesha-tales',
    name: 'Ganesha Tales',
    description: 'Adventures of the wise elephant-headed god',
    palette: { bg: '#fff5f5', accent: '#e11d48', text: '#881337' },
    characters: 'Young Ganesha: elephant-headed boy with a round belly, one broken tusk, wearing a small golden crown and orange dhoti, riding his mouse Mushika. Parvati: loving mother with serene expression, red sari with gold border. Shiva: calm father with blue throat, crescent moon in matted hair.',
    settings: 'Mount Kailash with snow peaks, lush gardens with modak sweets, temples with oil lamps, starlit skies.',
    scenes: [
      { description: 'Young Ganesha happily eating modaks while sitting on his tiny mouse Mushika, Parvati watching fondly', caption: 'Ganesha loves his favourite sweet — modak!', teacherLine: 'Look at Ganesha sitting on his tiny mouse friend Mushika, eating his favourite sweet — modak! His mother Parvati is watching him and smiling. He looks so happy!', empathyEmoji: 'Happy', isBondScene: true, narrativeRole: 'setup' },
      { description: 'Ganesha standing guard at a door, looking determined, a bright light approaching from afar', caption: 'Ganesha makes a promise to guard the door — no matter what', teacherLine: 'Ganesha made a promise to his mother to guard this door. Even though something big is coming, he stands strong. When we make a promise, we should try our best to keep it.', empathyEmoji: 'Brave', isBondScene: false, narrativeRole: 'challenge' },
      { description: 'Ganesha racing around his parents instead of the world, everyone realizing his wisdom', caption: 'Ganesha finds a clever way to win the race!', teacherLine: 'Instead of going around the whole world, clever Ganesha walks around his parents. He says "My parents ARE my world!" What a smart and loving idea!', empathyEmoji: 'Happy', isBondScene: true, narrativeRole: 'turning_point' },
      { description: 'Parvati comforting Ganesha with a warm hug under moonlight', caption: 'Mother Parvati comforts Ganesha with a big, warm hug', teacherLine: 'After a difficult day, Parvati gives Ganesha the biggest, warmest hug. When we feel upset, a hug from someone who loves us makes everything better.', empathyEmoji: 'Calm', isBondScene: true, narrativeRole: 'climax' },
      { description: 'Ganesha writing the Mahabharata with his broken tusk, moon and stars twinkling, wisdom glowing around him', caption: 'Ganesha turns every challenge into wisdom', teacherLine: 'Ganesha is writing a very important story using his own broken tusk as a pen. He turned something that was broken into something beautiful. Challenges can make us wiser!', empathyEmoji: 'Calm', isBondScene: true, narrativeRole: 'resolution' },
    ],
    adaptations: {
      positive: { emotion: 'Happy/Brave', direction: 'Show Ganesha racing around the world on his mouse — passing mountains and oceans at incredible speed, joyful and clever. Energetic, fun.', targetMood: 'adventurous' },
      negative: { emotion: 'Sad/Scared', direction: 'Show Parvati comforting Ganesha with a warm hug — soft moonlight, Mushika curled up at their feet. Safe, loving.', targetMood: 'comforting' },
      neutral: { emotion: 'Wow/Confused', direction: 'Show Ganesha solving a riddle — circling his parents instead of the world, everyone realizing his wisdom. Clever, illuminating.', targetMood: 'clever' },
    },
    fallbackImages: ['/sel/fallback/ganesha-1.svg', '/sel/fallback/ganesha-2.svg', '/sel/fallback/ganesha-3.svg'],
    staticImages: ['/sel/images/ganesha-tales/scene-5.png', '/sel/images/ganesha-tales/scene-1.png', '/sel/images/ganesha-tales/scene-2.png', '/sel/images/ganesha-tales/scene-3.png', '/sel/images/ganesha-tales/scene-4.png'],
    ageRanking: { '3-6': 4, '7-9': 6, '10-12': 8 },
    mainCharacter: 'Ganesha',
    endQuestions: [
      { question: 'How did Ganesha win the race around the world?', options: ['He ran very fast', 'He flew on his mouse', 'He walked around his parents, saying they are his world', 'He asked someone to help'], correctIndex: 2, type: 'mcq' },
      { question: 'How did Ganesha feel when he was guarding the door all alone?', options: ['Scared and wanted to run', 'Brave and determined to keep his promise', 'Bored and sleepy', 'Angry at his mother'], correctIndex: 1, type: 'sel', selDimension: 'selfAwareness' },
      { question: 'Why did Parvati hug Ganesha after a difficult day?', options: ['She wanted something from him', 'She loved him and wanted to make him feel better', 'She was saying goodbye', 'She was cold'], correctIndex: 1, type: 'sel', selDimension: 'socialAwareness' },
      { question: 'If your friend broke their favourite toy, how would you help them feel better?', options: ['Say "That\'s your problem"', 'Give them a hug and help them fix it', 'Laugh at them', 'Take their other toys'], correctIndex: 1, type: 'sel', selDimension: 'relationshipSkills' },
    ],
  },
  {
    id: 'hanuman-adventures',
    name: 'Hanuman Adventures',
    description: 'The brave monkey god\'s incredible feats',
    palette: { bg: '#fef3e2', accent: '#d97706', text: '#92400e' },
    characters: 'Hanuman: strong golden monkey with a devoted expression, red dhoti, mace in hand, able to grow or shrink in size. Young Hanuman: mischievous baby monkey reaching for the sun. Surasa: sea monster with a wide mouth, dramatic but not scary. Sita: gentle, hopeful expression, sitting under a tree.',
    settings: 'Vast blue ocean with waves, mountaintops touching clouds, Lanka gardens with ashoka trees, golden sunrise skies.',
    scenes: [
      { description: 'Baby Hanuman leaping toward the sun thinking it is a fruit, clouds parting around him', caption: 'Little Hanuman tries to catch the sun — what a brave leap!', teacherLine: 'When Hanuman was a baby, he saw the sun and thought it was a big juicy fruit! So he jumped all the way up to catch it. What a brave and curious little monkey!', empathyEmoji: 'Wow', isBondScene: false, narrativeRole: 'setup' },
      { description: 'Hanuman flying over a vast ocean, giant waves below, mountains on the horizon', caption: 'Hanuman flies across the ocean to find Sita', teacherLine: 'Hanuman loves Rama so much that he flies across the entire ocean to find Sita! Look at the big waves below him. He is not afraid because his love gives him strength.', empathyEmoji: 'Brave', isBondScene: false, narrativeRole: 'challenge' },
      { description: 'Hanuman shrinking tiny to sneak past guards in Lanka, playful and clever', caption: 'Clever Hanuman shrinks tiny to sneak through Lanka', teacherLine: 'Hanuman is so clever! He makes himself very tiny to sneak past all the guards. Sometimes being smart is even better than being strong!', empathyEmoji: 'Wow', isBondScene: false, narrativeRole: 'turning_point' },
      { description: 'Hanuman finding Sita in the garden, giving her Rama\'s ring, Sita\'s face lighting up with hope', caption: 'Hanuman finds Sita and gives her hope', teacherLine: 'Hanuman found Sita! He gives her Rama\'s ring and tells her help is coming. Look how her face lights up with hope. A kind message can change someone\'s whole day.', empathyEmoji: 'Happy', isBondScene: true, narrativeRole: 'climax' },
      { description: 'Hanuman carrying a glowing mountain of herbs through the night sky, stars all around, hopeful glow', caption: 'Hanuman brings the healing mountain — nothing can stop devotion', teacherLine: 'Hanuman carries an entire mountain through the sky to bring medicine for his friend! When we truly care about someone, we will go to any length to help them.', empathyEmoji: 'Happy', isBondScene: true, narrativeRole: 'resolution' },
    ],
    adaptations: {
      positive: { emotion: 'Happy/Brave', direction: 'Show Hanuman growing to enormous size to cross the ocean — towering above the waves, confident and powerful. Epic, thrilling.', targetMood: 'epic' },
      negative: { emotion: 'Sad/Scared', direction: 'Show Hanuman finding Sita in the garden and reassuring her — giving her Rama\'s ring, Sita\'s face lighting up with hope. Tender, hopeful.', targetMood: 'hopeful' },
      neutral: { emotion: 'Wow/Confused', direction: 'Show Hanuman shrinking tiny to sneak past guards — clever disguise, tiptoeing through Lanka. Playful, clever.', targetMood: 'playful' },
    },
    fallbackImages: ['/sel/fallback/hanuman-1.svg', '/sel/fallback/hanuman-2.svg', '/sel/fallback/hanuman-3.svg'],
    staticImages: ['/sel/images/hanuman-adventures/scene-5.png', '/sel/images/hanuman-adventures/scene-1.png', '/sel/images/hanuman-adventures/scene-2.png', '/sel/images/hanuman-adventures/scene-3.png', '/sel/images/hanuman-adventures/scene-4.png'],
    ageRanking: { '3-6': 6, '7-9': 7, '10-12': 5 },
    mainCharacter: 'Hanuman',
    endQuestions: [
      { question: 'Why did Hanuman fly across the ocean?', options: ['He wanted to go swimming', 'He was looking for food', 'He wanted to find Sita for Rama', 'He was running away'], correctIndex: 2, type: 'mcq' },
      { question: 'How did Sita feel when Hanuman gave her Rama\'s ring?', options: ['Angry', 'Hopeful and happy', 'Confused', 'Scared'], correctIndex: 1, type: 'sel', selDimension: 'selfAwareness' },
      { question: 'Why did Hanuman carry the whole mountain instead of just picking one herb?', options: ['He wasn\'t smart enough to find the right one', 'He cared so much about saving his friend that he didn\'t want to waste time', 'He wanted to show off', 'Someone told him to'], correctIndex: 1, type: 'sel', selDimension: 'socialAwareness' },
      { question: 'If your friend is sick and can\'t come to school, what would you do?', options: ['Forget about them', 'Send them a kind message or drawing', 'Make fun of them being absent', 'Take their things'], correctIndex: 1, type: 'sel', selDimension: 'relationshipSkills' },
    ],
  },
  {
    id: 'vikram-betaal',
    name: 'Vikram & Betaal',
    description: 'A brave king solves tricky riddles',
    palette: { bg: '#f0f4ff', accent: '#4f46e5', text: '#312e81' },
    characters: 'King Vikram: brave king with a determined face, royal turban with a moon crest, simple armor, walking through a dark forest. Betaal: a mischievous spirit hanging upside-down from a tree, playful expression (NOT scary), translucent bluish glow.',
    settings: 'Moonlit forests with twisted banyan trees, royal courts with flickering torches, misty paths, ancient India at night with stars.',
    scenes: [
      { description: 'King Vikram walking bravely into a dark moonlit forest, fireflies lighting his path', caption: 'Brave King Vikram enters the mysterious forest', teacherLine: 'King Vikram is walking bravely into a dark forest at night. Look at the fireflies lighting his way! Even when things look scary, Vikram keeps going. That takes a lot of courage.', empathyEmoji: 'Brave', isBondScene: false, narrativeRole: 'setup' },
      { description: 'Betaal hanging from a tree telling a story, Vikram listening with a thoughtful expression', caption: 'Betaal tells a tricky story — can Vikram solve the riddle?', teacherLine: 'Betaal is a playful spirit who loves riddles! He hangs from a tree and tells Vikram a tricky story. Vikram listens very carefully because he needs to think hard to find the answer.', empathyEmoji: 'Wow', isBondScene: false, narrativeRole: 'challenge' },
      { description: 'The riddle story coming alive as shadow puppets, characters acting out a dilemma', caption: 'The riddle comes alive — who is right and who is wrong?', teacherLine: 'The story Betaal is telling comes alive like shadow puppets! There is a problem in the story and someone needs to decide what is fair. What do you think is the right thing to do?', empathyEmoji: 'Wow', isBondScene: false, narrativeRole: 'turning_point' },
      { description: 'Vikram answering the riddle confidently, a glow of wisdom around his head', caption: 'Vikram answers wisely — even Betaal is impressed!', teacherLine: 'Vikram thinks very carefully and gives a wise answer. Even Betaal is impressed! When we take time to think before we speak, we make better choices.', empathyEmoji: 'Happy', isBondScene: false, narrativeRole: 'climax' },
      { description: 'Vikram and Betaal sitting together at sunrise, both smiling, the forest now bright and welcoming', caption: 'Wisdom and courage turn even a rival into a friend', teacherLine: 'Look! The sun is rising and the forest is bright now. Vikram and Betaal have become friends! When we respect others, even someone very different from us can become a good friend.', empathyEmoji: 'Happy', isBondScene: true, narrativeRole: 'resolution' },
    ],
    adaptations: {
      positive: { emotion: 'Happy/Brave', direction: 'Show Vikram confidently answering the riddle — a glow of wisdom around his head, Betaal looking impressed. Confident, wise.', targetMood: 'triumphant' },
      negative: { emotion: 'Sad/Scared', direction: 'Show the forest becoming less scary — fireflies appearing, a friendly owl watching over Vikram. The night is not so dark after all. Reassuring.', targetMood: 'reassuring' },
      neutral: { emotion: 'Wow/Confused', direction: 'Show the riddle story coming alive as shadow puppets — characters acting out the dilemma, Vikram thinking deeply. Thought-provoking.', targetMood: 'thoughtful' },
    },
    fallbackImages: ['/sel/fallback/vikram-1.svg', '/sel/fallback/vikram-2.svg', '/sel/fallback/vikram-3.svg'],
    staticImages: ['/sel/images/vikram-betaal/scene-2.png', '/sel/images/vikram-betaal/scene-1.png', '/sel/images/vikram-betaal/scene-3.png', '/sel/images/vikram-betaal/scene-4.png', '/sel/images/vikram-betaal/scene-5.png'],
    ageRanking: { '3-6': 9, '7-9': 8, '10-12': 3 },
    mainCharacter: 'King Vikram',
    endQuestions: [
      { question: 'What did Betaal do every time Vikram came to the forest?', options: ['Chased Vikram away', 'Told him a riddle story', 'Gave him treasure', 'Sang a song'], correctIndex: 1, type: 'mcq' },
      { question: 'How did Vikram feel walking into the dark forest alone?', options: ['Very scared and wanted to go home', 'Brave, even though it was a little scary', 'Bored', 'Happy like it was a party'], correctIndex: 1, type: 'sel', selDimension: 'selfAwareness' },
      { question: 'Why did Betaal become friends with Vikram at the end?', options: ['Vikram gave him gifts', 'Betaal respected Vikram\'s wisdom and courage', 'They were already friends', 'Betaal was tired'], correctIndex: 1, type: 'sel', selDimension: 'socialAwareness' },
      { question: 'If someone challenges you with a hard question, what should you do?', options: ['Give up right away', 'Think carefully before answering', 'Get angry at them', 'Say the first thing that comes to mind'], correctIndex: 1, type: 'sel', selDimension: 'relationshipSkills' },
    ],
  },
  {
    id: 'birbal-akbar',
    name: 'Akbar & Birbal',
    description: 'Clever Birbal outwits everyone with humor',
    palette: { bg: '#f0fdf4', accent: '#16a34a', text: '#14532d' },
    characters: 'Akbar: grand Mughal emperor with a jeweled turban, rich robes, kind but curious expression. Birbal: slim courtier with a witty smile, simple but elegant clothes, always thinking. Courtiers: group of men in colorful turbans, some jealous, some amused.',
    settings: 'Ornate Mughal court with arches and fountains, palace gardens with peacocks, bustling bazaars, riverside at sunset.',
    scenes: [
      { description: 'Akbar sitting on his grand throne asking a question, Birbal standing with a knowing smile', caption: 'Emperor Akbar has a tricky question — only Birbal can answer!', teacherLine: 'Emperor Akbar loves asking tricky questions! Today he has a very hard one. Look at Birbal standing there with a little smile — he already has an idea. Let\'s see what happens!', empathyEmoji: 'Wow', isBondScene: false, narrativeRole: 'setup' },
      { description: 'Jealous courtiers whispering together, pointing at Birbal, Birbal calmly drinking chai', caption: 'Some courtiers try to get Birbal in trouble', teacherLine: 'Some of the other courtiers are jealous of Birbal. They are whispering and trying to get him in trouble. But look at Birbal — he is calmly drinking his chai. He doesn\'t let them upset him.', empathyEmoji: 'Sad', isBondScene: false, narrativeRole: 'challenge' },
      { description: 'Birbal cleverly demonstrating his answer using a pot of water', caption: 'Birbal shows his answer in a clever way that surprises everyone', teacherLine: 'Birbal doesn\'t just give an answer — he SHOWS it! He uses a pot of water to explain his idea. Everyone\'s mouth falls open in surprise. Being creative is a wonderful way to solve problems!', empathyEmoji: 'Wow', isBondScene: false, narrativeRole: 'turning_point' },
      { description: 'Birbal sitting calmly while others panic, inspiring a young servant with quiet confidence', caption: 'Birbal stays calm and inspires others with his confidence', teacherLine: 'While everyone else is worried, Birbal stays calm and steady. A young servant watches Birbal and feels braver too. When we stay calm, we can help others feel safe.', empathyEmoji: 'Calm', isBondScene: true, narrativeRole: 'climax' },
      { description: 'Akbar and Birbal laughing together in the garden, peacocks dancing, the whole court joining in', caption: 'Wit and wisdom always find a way — Akbar and Birbal laugh together', teacherLine: 'Akbar and Birbal are laughing together in the garden. The peacocks are dancing and everyone is happy. True friendship means enjoying good times together and respecting each other.', empathyEmoji: 'Happy', isBondScene: true, narrativeRole: 'resolution' },
    ],
    adaptations: {
      positive: { emotion: 'Happy/Brave', direction: 'Show Birbal cleverly demonstrating his answer — using a pot of water or drawing lines in sand, Akbar looking amazed. Witty, brilliant.', targetMood: 'witty' },
      negative: { emotion: 'Sad/Scared', direction: 'Show Birbal sitting calmly while others panic — his quiet confidence inspiring courage in a young servant. Steady, reassuring.', targetMood: 'steady' },
      neutral: { emotion: 'Wow/Confused', direction: 'Show Birbal asking a counter-question that makes everyone think — the court falling silent, then slowly understanding. Mind-bending, clever.', targetMood: 'illuminating' },
    },
    fallbackImages: ['/sel/fallback/birbal-1.svg', '/sel/fallback/birbal-2.svg', '/sel/fallback/birbal-3.svg'],
    staticImages: ['/sel/images/birbal-akbar/scene-5.png', '/sel/images/birbal-akbar/scene-1.png', '/sel/images/birbal-akbar/scene-2.png', '/sel/images/birbal-akbar/scene-3.png', '/sel/images/birbal-akbar/scene-4.png'],
    ageRanking: { '3-6': 10, '7-9': 9, '10-12': 9 },
    mainCharacter: 'Birbal',
    endQuestions: [
      { question: 'How did Birbal answer the Emperor\'s tricky question?', options: ['He read it from a book', 'He asked someone else', 'He showed his answer in a clever, creative way', 'He guessed randomly'], correctIndex: 2, type: 'mcq' },
      { question: 'How did Birbal feel when the jealous courtiers tried to get him in trouble?', options: ['Very angry and upset', 'Calm and confident', 'He wanted to fight them', 'Scared and crying'], correctIndex: 1, type: 'sel', selDimension: 'selfAwareness' },
      { question: 'Why did the young servant feel braver after watching Birbal?', options: ['Birbal gave him money', 'Birbal\'s calmness showed him there was nothing to fear', 'Birbal told him a joke', 'The servant didn\'t actually feel braver'], correctIndex: 1, type: 'sel', selDimension: 'socialAwareness' },
      { question: 'If other kids are being mean to someone you know, what is the best thing to do?', options: ['Join in to be popular', 'Stay calm, stand up for them, or tell a trusted adult', 'Pretend you didn\'t see anything', 'Be mean back to the bullies'], correctIndex: 1, type: 'sel', selDimension: 'relationshipSkills' },
    ],
  },
  {
    id: 'durga-tales',
    name: 'Durga Tales',
    description: 'The powerful goddess who protects the world',
    palette: { bg: '#fdf2f8', accent: '#db2777', text: '#831843' },
    characters: 'Durga: powerful goddess with a serene yet strong face, multiple arms holding symbols of power (lotus, conch, chakra), riding a majestic lion, red and gold sari, warm golden glow. Lion mount: proud and gentle. Village children: looking up with awe and admiration.',
    settings: 'Cosmic skies with swirling galaxies, peaceful mountaintops, villages celebrating Navratri with oil lamps and garlands, rivers of light.',
    scenes: [
      { description: 'Durga riding her lion through a field of flowers, village children waving and cheering', caption: 'Goddess Durga arrives — strength and kindness in every step', teacherLine: 'Here comes Goddess Durga, riding her majestic lion through a field of flowers! The village children are waving and cheering. She is strong and kind at the same time.', empathyEmoji: 'Brave', isBondScene: false, narrativeRole: 'setup' },
      { description: 'Dark clouds gathering over a peaceful village, villagers looking worried, Durga watching from above', caption: 'Trouble comes to the village — but someone is watching over them', teacherLine: 'Oh no, dark clouds are coming! The villagers look worried. But look up — Durga is watching over them from above. Even when things seem scary, someone is always looking out for us.', empathyEmoji: 'Scared', isBondScene: false, narrativeRole: 'challenge' },
      { description: 'Durga with her arms radiating light, creating flowers, stars, and rainbows', caption: 'Durga uses her power to create beauty and light', teacherLine: 'Durga is using her amazing power! Light is coming from her hands, creating flowers, stars, and rainbows. She uses her strength to make beautiful things, not to scare anyone.', empathyEmoji: 'Wow', isBondScene: false, narrativeRole: 'turning_point' },
      { description: 'Durga gently holding a scared child, her lion sitting softly, a golden shield of light around them', caption: 'Durga protects a scared child with her warm, golden light', teacherLine: 'A little child was scared, and Durga gently holds them close. Her lion sits softly beside them. A warm golden light surrounds all three. When we protect someone who is afraid, we show true strength.', empathyEmoji: 'Calm', isBondScene: true, narrativeRole: 'climax' },
      { description: 'Durga blessing the village with light, children dancing around her lion, flowers raining from the sky, lamps everywhere', caption: 'Courage and love make the world bright again', teacherLine: 'The dark clouds are gone! Children are dancing around Durga\'s lion, flowers are raining from the sky, and lamps are glowing everywhere. Courage and love always win in the end!', empathyEmoji: 'Happy', isBondScene: true, narrativeRole: 'resolution' },
    ],
    adaptations: {
      positive: { emotion: 'Happy/Brave', direction: 'Show Durga with her arms radiating light — each hand creating something beautiful: a flower, a star, a rainbow. Empowering, magnificent.', targetMood: 'empowering' },
      negative: { emotion: 'Sad/Scared', direction: 'Show Durga gently holding a scared child — her lion sitting softly beside them, a warm golden shield of light around all three. Protective, safe.', targetMood: 'sheltering' },
      neutral: { emotion: 'Wow/Confused', direction: 'Show Durga meditating with the cosmos visible around her — galaxies in her hair, rivers flowing from her hands, children watching in wonder. Transcendent, awesome.', targetMood: 'transcendent' },
    },
    fallbackImages: ['/sel/fallback/durga-1.svg', '/sel/fallback/durga-2.svg', '/sel/fallback/durga-3.svg'],
    staticImages: ['/sel/images/durga-tales/scene-3.png', '/sel/images/durga-tales/scene-1.png', '/sel/images/durga-tales/scene-2.png', '/sel/images/durga-tales/scene-4.png', '/sel/images/durga-tales/scene-5.png'],
    ageRanking: { '3-6': 7, '7-9': 10, '10-12': 10 },
    mainCharacter: 'Durga',
    endQuestions: [
      { question: 'What did Durga do when dark clouds came over the village?', options: ['She ran away', 'She fell asleep', 'She used her power to protect the village', 'She called for help'], correctIndex: 2, type: 'mcq' },
      { question: 'How did the scared child feel when Durga held them close?', options: ['Still very scared', 'Safe and protected', 'Angry', 'Nothing at all'], correctIndex: 1, type: 'sel', selDimension: 'selfAwareness' },
      { question: 'Why did Durga use her power to create beautiful things instead of scary things?', options: ['She wasn\'t strong enough for scary things', 'True strength is about protecting and creating, not destroying', 'She didn\'t know how', 'Someone told her to'], correctIndex: 1, type: 'sel', selDimension: 'socialAwareness' },
      { question: 'If a younger child is scared during a thunderstorm, what would you do?', options: ['Tell them to stop being silly', 'Sit with them and tell them it will be okay', 'Ignore them', 'Scare them more for fun'], correctIndex: 1, type: 'sel', selDimension: 'relationshipSkills' },
    ],
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
