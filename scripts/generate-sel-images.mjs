import { GoogleGenerativeAI } from '@google/generative-ai';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error('Set GEMINI_API_KEY env var');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

const themes = [
  {
    id: 'ramayana',
    style: 'soft watercolor, warm palette, traditional Indian art, forest greens and golden yellows',
    characters: 'Rama (blue-tinted skin, golden crown, yellow dhoti, calm expression), Sita (green sari, gentle face, flower in hair), Hanuman (golden fur, devotional expression, red dhoti)',
    scenes: [
      'Rama and Sita walking peacefully through a lush green forest with deer and colorful birds around them, golden sunlight filtering through trees',
      'Sita looking concerned as dark clouds gather, a golden palace visible in the distance, dramatic but not scary atmosphere',
      'Hanuman flying through the sky carrying a glowing mountain with healing herbs, clouds parting around him, warm golden light',
      'Rama standing on a beach watching a stone bridge being built across a vast blue ocean toward a golden city, monkeys helping',
      'Rama and Sita reunited in a flower-filled palace courtyard, Hanuman celebrating, petals falling from the sky, everyone smiling',
    ],
  },
  {
    id: 'mahabharata',
    style: 'soft watercolor, warm palette, traditional Indian art, royal purples and battle golds',
    characters: 'Arjuna (warrior with focused expression, bow and arrows), Krishna (blue skin, peacock feather crown, flute, peaceful smile, yellow robes), Draupadi (regal bearing, red and gold sari)',
    scenes: [
      'Young Pandava and Kaurava children playing together in a grand palace garden with peacocks and fountains, joyful atmosphere',
      'Draupadi standing tall with dignity in a royal court filled with golden pillars, other people looking on with varied expressions',
      'Arjuna practicing archery in a forest clearing, splitting a target perfectly, golden arrows and focused expression, impressed onlookers',
      'Arjuna sitting on a chariot looking thoughtful and uncertain, Krishna beside him gesturing wisely, vast green field at dawn',
      'Krishna speaking gently to Arjuna with a soft golden aura around them, chariot on a peaceful morning field with sunrise',
    ],
  },
  {
    id: 'panchatantra',
    style: 'soft watercolor, warm palette, Indian folk art style, jungle greens and warm oranges',
    characters: 'Talking animals with expressive faces: a wise lion with a gentle golden mane, a clever white rabbit with bright eyes, a loyal black crow, a kind spotted deer, a playful brown monkey with a long tail',
    scenes: [
      'A group of animal friends gathered happily around a sparkling pond in a lush jungle — lion, rabbit, crow, deer, monkey chatting',
      'A sly fox approaching the group of friends with a sneaky expression, the other animals looking at each other uncertainly',
      'The clever rabbit drawing a plan in the dirt with a stick while the other animals watch with excited expressions, bright sunny day',
      'The animals working together to set a clever trap using vines and coconuts, teamwork and determination on their faces',
      'All animals celebrating together in a flower-filled meadow, even the fox looking embarrassed but included, rainbow in the sky',
    ],
  },
  {
    id: 'krishna-leela',
    style: 'soft watercolor, warm palette, traditional Indian art, butter yellows and river blues, pastoral feel',
    characters: 'Young Krishna (playful child with blue skin, peacock feather in curly hair, yellow dhoti, mischievous smile), Yashoda (loving mother with warm expression), village children in colorful clothes',
    scenes: [
      'Baby Krishna sitting on Yashoda lap both laughing, a butter pot nearby, warm kitchen setting with clay pots and morning light',
      'Young Krishna climbing a tall stack of clay pots to reach butter on a high shelf, village girls watching and giggling from doorway',
      'Krishna dancing playfully in rain puddles with village children, peacocks dancing nearby, colorful umbrellas and splashing water',
      'Krishna standing bravely on the hood of a large but non-scary serpent in a river, villagers watching in amazement from the bank',
      'Krishna playing his flute under a big banyan tree by the Yamuna river, cows and children gathered peacefully, golden sunset sky',
    ],
  },
  {
    id: 'jataka-tales',
    style: 'soft watercolor, warm palette, ancient Indian art, earthy browns and saffron, gentle and wise mood',
    characters: 'A golden deer with gentle antlers (the Bodhisattva), a small colorful bird with delicate wings, a wise old villager with a walking stick, forest animals with kind expressions',
    scenes: [
      'A beautiful golden deer resting peacefully under a great banyan tree, soft sunlight filtering through leaves, butterflies around',
      'A small bird with a broken wing sitting alone on a mossy rock in the rain, looking sad, dark clouds but not scary',
      'The golden deer gently carrying the injured bird on its back through the forest, sheltering it from rain with large green leaves',
      'The deer and bird arriving at a warm village, villagers coming out with kind expressions, an elder offering food and medicine',
      'The healed bird flying happily around the golden deer in a sunlit forest glade, other animals watching, flowers blooming everywhere',
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
        const outPath = join('public', 'sel', 'images', theme.id, `scene-${sceneIndex + 1}.${ext}`);
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
  console.log('Generating SEL images with Gemini...\n');

  const results = {};

  for (const theme of themes) {
    console.log(`\n${theme.id.toUpperCase()}`);
    results[theme.id] = [];

    for (let i = 0; i < 5; i++) {
      try {
        const path = await generateImage(theme, i);
        results[theme.id].push(path);
        // Rate limit: wait 2s between calls
        if (i < 4) await new Promise(r => setTimeout(r, 2000));
      } catch (err) {
        console.error(`  ✗ Error: ${err.message}`);
        results[theme.id].push(null);
        // Wait longer on error (might be rate limited)
        await new Promise(r => setTimeout(r, 5000));
      }
    }

    // Wait between themes
    await new Promise(r => setTimeout(r, 3000));
  }

  console.log('\n\nRESULTS:');
  console.log(JSON.stringify(results, null, 2));

  const total = Object.values(results).flat().filter(Boolean).length;
  console.log(`\n${total}/25 images generated successfully`);
}

main().catch(console.error);
