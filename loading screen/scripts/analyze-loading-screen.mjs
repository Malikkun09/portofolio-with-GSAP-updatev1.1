// Analyze a loading-screen screenshot with the z-ai-web-dev-sdk VLM.
// Designed for redesign reference: extracts colors, positions, typography.

import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const IMAGE_PATH = '/home/z/my-project/upload/Screenshot_20260625_123234.png';

const PROMPT = `You are a senior UI/UX designer analyzing a loading-screen screenshot so it can be faithfully reproduced/redesigned in code.

Look at the image very carefully and produce a PRECISE, STRUCTURED description covering ALL of the following points. Be specific — give hex color codes wherever possible, exact pixel/percentage positions, and concrete observations rather than vague summaries.

1. OVERALL COMPOSITION & BACKGROUND
   - Aspect ratio / orientation (portrait, landscape, square?)
   - Background color: is it pure black (#000000), dark charcoal (e.g. #0A0A0A, #111111), navy, gradient? Describe gradient direction and stops if present.
   - Any vignette, noise, grid, or texture overlay?
   - Negative space distribution.

2. CENTRAL COUNTER / BIG NUMBER
   - The exact numeric value shown (e.g. "42", "73%", "100").
   - Approximate font size relative to screen height (e.g. "takes ~25% of vertical space").
   - Horizontal/vertical centering — is it dead-center or offset?
   - Font family feel (monospace, geometric sans, techno, LCD/digital, serif?).
   - Font weight (thin, regular, bold, black).
   - Letter-spacing / digit-spacing.
   - Color of the digits (white? off-white? neon? hex code).
   - Any glow, drop shadow, outline, or gradient fill on the digits.

3. ACCENT ELEMENTS (cursors, lines, dots, neon)
   - Blinking cursor / caret / underscore near the number? Color, size, position.
   - Horizontal rules, separators, or progress lines — color, thickness, length, position.
   - Any dots, brackets, slashes, or framing characters.
   - GREEN NEON accents specifically — present? Where? Approximate hex (e.g. #39FF14, #00FF66, #4ADE80).
   - Any other neon accent colors (cyan, magenta, etc.).

4. TOP BAR
   - Is there a top status bar? What does it contain (icons, time, signal, battery, app name)?
   - Colors and typography of top bar elements.
   - If none, say so.

5. BOTTOM BAR / FOOTER
   - Is there a bottom bar? What text/icons?
   - Common examples: "LOADING…", "PLEASE WAIT", a progress percentage, version string, dots.
   - Colors, alignment, typography.

6. OTHER TEXT & STATUS INDICATORS
   - Any loading messages, subtitles, status text ("Initializing", "Fetching data", etc.).
   - Progress bar — linear, circular, dotted, segmented? Color, fill %.
   - Spinner — type (ring, dots, bar), color, position.

7. LAYOUT / SPATIAL MAP
   - Describe a top-to-bottom vertical stack of every visible element with approximate vertical position (e.g. "0-5%: top bar", "40-65%: big number", "90-95%: footer text").
   - Horizontal alignment of each element (left/center/right, with approximate margins).

8. TYPOGRAPHY
   - How many distinct type styles are visible?
   - For each: weight, case (upper/lower), spacing (tight/normal/wide/tracked), size relative to screen.
   - Overall typographic mood (minimalist, techno, retro-terminal, modern-glassy, etc.).

9. COLOR PALETTE & MOOD
   - List every distinct color you can identify with a best-guess hex code.
   - Overall mood: dark/futuristic, terminal/hacker, minimal/clean, playful, corporate, etc.
   - Lighting: flat, glowing, glossy, matte.

10. REDESIGN NOTES
   - List the 5-8 most important visual tokens a developer would need to recreate this loading screen (colors, fonts, sizes, spacing).

Use clear headings and bullet points. Do NOT skip any section. If something is not present, explicitly say "Not present" for that item.`;

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

  // Also dump the raw response for debugging
  const outPath = '/home/z/my-project/scripts/vlm-loading-screen-result.json';
  fs.writeFileSync(outPath, JSON.stringify(response, null, 2));
  console.log('\n' + '='.repeat(80));
  console.log('Raw response saved to:', outPath);
}

main().catch((err) => {
  console.error('VLM analysis failed:', err);
  process.exit(1);
});
