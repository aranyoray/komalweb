import { GoogleGenerativeAI } from '@google/generative-ai';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('Set GEMINI_API_KEY env var');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

const themes = [
  {
    id: 'ganesha-tales',
    style: 'soft watercolor, warm reds and golds, traditional Indian art, temple and kitchen settings',
    characters: 'Young Ganesha (elephant-headed boy with round belly, one broken tusk, small golden crown, orange dhoti, riding tiny mouse Mushika), Parvati (loving mother, red sari with gold)',
    scenes: [
      'Cute baby Ganesha happily eating round modak sweets while sitting on his tiny mouse Mushika, warm kitchen with clay pots, golden morning light',
      'Young Ganesha standing guard at an ornate golden temple doorway looking determined, a bright divine light approaching from distance',
      'Playful Ganesha circling his parents Shiva and Parvati on his tiny mouse, joyful race around Mount Kailash, clouds and mountains',
      'Mother Parvati lovingly hugging young Ganesha, soft moonlight, mouse Mushika curled at their feet, flowers around them',
      'Ganesha writing with his broken tusk as a pen on a long scroll under a starlit night sky, wisdom glowing around him',
    ],
  },
  {
    id: 'hanuman-adventures',
    style: 'soft watercolor, warm ambers and golden yellows, traditional Indian art, epic sky and ocean settings',
    characters: 'Hanuman (strong golden monkey with devoted expression, red dhoti, able to grow or shrink), Baby Hanuman (mischievous baby monkey), Sita (gentle expression, sitting under tree)',
    scenes: [
      'Baby Hanuman leaping joyfully upward toward the bright orange sun thinking it is a mango fruit, white clouds parting around him, blue sky',
      'Hanuman flying heroically over a vast blue ocean, giant waves below, golden mountains on the distant horizon, cape flowing behind',
      'Giant enormous Hanuman standing tall above ocean waves, tiny boats below for scale, powerful golden aura, epic mountain-sized pose',
      'Hanuman in a beautiful Ashoka garden offering a glowing golden ring to Sita who sits under a tree, hope lighting her face, leaves falling',
      'Hanuman flying through a starlit night sky carrying a glowing green mountain of healing herbs, stars sparkling all around, hopeful glow trailing',
    ],
  },
  {
    id: 'vikram-betaal',
    style: 'soft watercolor, deep indigos and moonlit blues, traditional Indian art, mysterious forest settings',
    characters: 'King Vikram (brave king with royal turban, moon crest, simple armor), Betaal (playful translucent blue spirit hanging from tree, NOT scary)',
    scenes: [
      'Brave King Vikram walking into a mysterious moonlit forest, golden fireflies lighting his path, twisted banyan trees, purple-blue night sky',
      'A playful glowing blue spirit Betaal hanging upside-down from a gnarled tree branch telling a story, Vikram listening thoughtfully below, moonlight',
      'Beautiful shadow puppets on a glowing orange screen, oil lamps on each side, silhouettes of characters acting out a story, warm firelight',
      'A welcoming moonlit forest with dozens of golden fireflies everywhere, a friendly owl on a branch, wildflowers blooming, magical not scary',
      'King Vikram and the spirit Betaal sitting together as friends at beautiful sunrise, forest bright and welcoming, birds flying, orange dawn sky',
    ],
  },
  {
    id: 'birbal-akbar',
    style: 'soft watercolor, emerald greens and Mughal golds, traditional Indian art, ornate court and garden settings',
    characters: 'Emperor Akbar (grand jeweled turban, rich robes, kind curious expression), Birbal (slim courtier with witty smile, simple elegant clothes), Courtiers (colorful turbans)',
    scenes: [
      'Emperor Akbar sitting on an ornate golden Mughal throne in a grand court with arches and pillars, Birbal standing with a knowing smile, courtiers around',
      'Jealous Mughal courtiers in colorful turbans whispering together in a group, while clever Birbal stands apart calmly sipping chai with a confident smile',
      'Clever Birbal drawing lines in sand with a stick demonstrating his brilliant answer, Emperor Akbar watching amazed, courtiers leaning in, sparkle of wisdom',
      'Birbal asking a brilliant counter-question in the ornate Mughal court, everyone falling thoughtfully silent, golden light of realization dawning on faces',
      'Emperor Akbar and Birbal laughing together in a beautiful Mughal garden with peacocks dancing, marble fountain, colorful flowers blooming everywhere',
    ],
  },
  {
    id: 'durga-tales',
    style: 'soft watercolor, rich pinks and divine golds, traditional Indian art, cosmic and village festival settings',
    characters: 'Goddess Durga (powerful serene face, multiple arms holding lotus and conch, riding majestic lion, red and gold sari, warm golden glow), Village children (looking up in awe)',
    scenes: [
      'Goddess Durga riding her majestic golden lion through a field of colorful flowers, village children waving and cheering, warm golden divine aura around her',
      'Dark dramatic clouds gathering over a peaceful Indian village with clay huts, tiny worried villagers looking up, Goddess Durga watching protectively from the glowing clouds above',
      'Powerful Goddess Durga with multiple arms radiating beams of golden light, each hand creating something beautiful - a lotus flower, a star, a rainbow, empowering cosmic scene',
      'Goddess Durga gently holding a scared child in her arms protectively, her lion sitting softly beside them, a warm golden dome shield of light surrounding all three',
      'Goddess Durga blessing the village from above with divine golden light rays, children dancing around her lion, colorful flower petals raining from sky, oil lamps glowing everywhere',
    ],
  },
];

const BASE_PROMPT = `Generate a child-friendly watercolor-style illustration. This is for children ages 3-12.
STYLE: {STYLE}
CHARACTERS: {CHARACTERS}
SCENE: {SCENE}
IMPORTANT: No violence, no blood, no weapons being used, no scary imagery, no dark themes, no nudity, no modern elements.
The art should look like a beautiful storybook illustration with soft edges, warm colors, and gentle expressions.`;

async function generateImage(theme, sceneIndex) {
  const prompt = BASE_PROMPT
    .replace('{STYLE}', theme.style)
    .replace('{CHARACTERS}', theme.characters)
    .replace('{SCENE}', theme.scenes[sceneIndex]);

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-image',
    generationConfig: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  });

  console.log(`  Generating ${theme.id} scene ${sceneIndex + 1}...`);

  const result = await model.generateContent(prompt);
  const response = result.response;

  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData?.mimeType?.startsWith('image/')) {
        const ext = part.inlineData.mimeType.includes('png') ? 'png' :
                    part.inlineData.mimeType.includes('webp') ? 'webp' : 'jpg';
        const outPath = join('public', 'sel', 'images', theme.id, `scene-${sceneIndex + 1}.png`);
        const buf = Buffer.from(part.inlineData.data, 'base64');
        writeFileSync(outPath, buf);
        console.log(`  ✓ Saved ${outPath} (${(buf.length / 1024).toFixed(0)}KB)`);
        return outPath;
      }
    }
  }

  console.log(`  ✗ No image returned for ${theme.id} scene ${sceneIndex + 1}`);
  return null;
}

async function main() {
  console.log('Generating SEL images for new themes with Gemini...\n');

  // Ensure directories exist
  for (const theme of themes) {
    const dir = join('public', 'sel', 'images', theme.id);
    mkdirSync(dir, { recursive: true });
  }

  const results = {};

  for (const theme of themes) {
    console.log(`\n${theme.id.toUpperCase()}`);
    results[theme.id] = [];

    for (let i = 0; i < 5; i++) {
      try {
        const path = await generateImage(theme, i);
        results[theme.id].push(path);
        // Rate limit: wait 3s between calls
        if (i < 4) await new Promise(r => setTimeout(r, 3000));
      } catch (err) {
        console.error(`  ✗ Error: ${err.message}`);
        results[theme.id].push(null);
        // Wait longer on error (might be rate limited)
        await new Promise(r => setTimeout(r, 8000));
      }
    }

    // Wait between themes
    await new Promise(r => setTimeout(r, 4000));
  }

  console.log('\n\nRESULTS:');
  console.log(JSON.stringify(results, null, 2));

  const total = Object.values(results).flat().filter(Boolean).length;
  console.log(`\n${total}/25 images generated successfully`);
}

main().catch(console.error);
