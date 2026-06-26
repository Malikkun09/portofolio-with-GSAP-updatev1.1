// Verify whether /home/z/my-project/download/loading-pure-black.png has a PURE BLACK (#000000) background
// and that all required loading-screen elements are visible. Uses the z-ai-web-dev-sdk VLM.

import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const IMAGE_PATH = '/home/z/my-project/download/loading-pure-black.png';

const PROMPT = `You are a senior front-end engineer verifying a loading-screen screenshot for a build.

Analyze the image VERY carefully and answer each question precisely. For every color question, give a hex code (e.g. #000000) and your confidence. Be honest — if something is not pure black, say so and give the actual observed hex.

Please answer ALL of the following, in order, with a clear heading for each:

1. BACKGROUND COLOR (CRITICAL — measure carefully)
   - Is the background PURE BLACK (#000000)?
   - Or is it dark charcoal (e.g. #050505, #0A0A0A, #111111), dark gray, or a gradient?
   - Give the exact hex you observe for the background.
   - Is the background uniform (same color everywhere) or is there a gradient/vignette/noise?
   - Compare corners vs center — are they the same hex?

2. BIG COUNTER NUMBER
   - Is there a large numeric counter visible?
   - What value does it show (e.g. "42%", "73%")?
   - Is it white? Give the hex.
   - Approximate vertical position (% from top) and font size relative to screen height.

3. GREEN NEON CURSOR ACCENT
   - Is there a green neon cursor / caret / underscore / bar visible next to the % sign?
   - Give its approximate hex (e.g. #39FF14, #00FF66, #4ADE80, #22C55E).
   - Describe its position and size.

4. TOP BAR
   - Is there a top bar with text like "NEWFORM" and "LOADING EXPERIENCE"?
   - Describe what you see at the very top of the screen — exact text, color, alignment.

5. BOTTOM BAR
   - Is there a bottom bar with a status line and a progress bar?
   - Describe the status text, the progress bar color, fill %, and shape.

6. VISUAL ISSUES
   - Any rendering bugs, overlapping text, cut-off elements, missing assets, wrong colors, alignment problems, transparency issues, or other defects?
   - If the screen looks correct and clean, say so explicitly.

Be concise but specific. Use bullet points under each heading.`;

async function main() {
  if (!fs.existsSync(IMAGE_PATH)) {
    console.error('Image not found:', IMAGE_PATH);
    process.exit(1);
  }

  const buffer = fs.readFileSync(IMAGE_PATH);
  const base64 = buffer.toString('base64');
  const ext = path.extname(IMAGE_PATH).toLowerCase();
  const mime = ext === '.png' ? 'image/png'
             : ext === '.webp' ? 'image/webp'
             : ext === '.gif' ? 'image/gif'
             : 'image/jpeg';

  console.log(`Image: ${IMAGE_PATH} (${(buffer.length / 1024).toFixed(1)} KB, ${mime})`);
  console.log('Calling VLM…\n' + '='.repeat(80));

  const zai = await ZAI.create();

  const response = await zai.chat.completions.createVision({
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: PROMPT },
          { type: 'image_url', image_url: { url: `data:${mime};base64,${base64}` } }
        ]
      }
    ],
    thinking: { type: 'enabled' }
  });

  const content = response.choices[0]?.message?.content;
  console.log(content ?? '(no content returned)');

  const outPath = '/home/z/my-project/scripts/verify-loading-pure-black-result.json';
  fs.writeFileSync(outPath, JSON.stringify(response, null, 2));
  console.log('\n' + '='.repeat(80));
  console.log('Raw response saved to:', outPath);
}

main().catch((err) => {
  console.error('VLM analysis failed:', err);
  process.exit(1);
});
