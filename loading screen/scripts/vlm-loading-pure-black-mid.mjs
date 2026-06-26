// VLM analysis of the mid-load pure-black loading screenshot.
// Uses z-ai-web-dev-sdk's vision chat to describe content semantically.
import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const IMG_PATH = '/home/z/my-project/download/loading-pure-black-mid.png';
const OUT_PATH = '/home/z/my-project/scripts/vlm-loading-pure-black-mid-result.json';

async function main() {
  const zai = await ZAI.create();

  const buf = fs.readFileSync(IMG_PATH);
  const b64 = buf.toString('base64');
  const dataUrl = `data:image/png;base64,${b64}`;

  const prompt = `You are analyzing a screenshot of a web loading screen captured at 500ms during a 4-second loading animation.

Please answer each of the following questions precisely. For numeric values (like the counter), report the EXACT number you see. For yes/no questions, answer YES or NO with a one-sentence justification.

1. BACKGROUND: What is the background color of the screen? Is it pure black (#000000) or a slightly lighter dark gray like #050505? Describe what you see behind/around the central content.

2. COUNTER: Is there a large white counter/percentage number in the center of the screen? If yes, what is the EXACT number/value shown?

3. TOP BAR: Is there a top bar with text? What text appears on the left side and what text appears on the right side of the top bar?

4. BOTTOM BAR: Is there a bottom bar? Describe what text or UI elements appear in the bottom bar.

5. GREEN ACCENT: Is there any green-colored element on the screen (e.g., a green cursor, a green progress bar, a green % accent)? Describe its location and color.

6. OVERALL: Does this look like a "full black loading screen" with a clean white counter in the middle and minimal neon-green accents? Yes/No with brief justification.

Return your answers as a JSON object with keys: "background", "counter_value", "top_bar", "bottom_bar", "green_accent", "overall_assessment".`;

  console.log('Calling VLM (z-ai-web-dev-sdk) ...');
  const response = await zai.chat.completions.createVision({
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: dataUrl } },
        ],
      },
    ],
    thinking: { type: 'disabled' },
  });

  const content = response.choices?.[0]?.message?.content ?? '';
  console.log('\n--- RAW VLM RESPONSE ---');
  console.log(content);

  // Try to parse JSON; if it fails, store raw text.
  let parsed = null;
  try {
    // Strip code fences if present
    const cleaned = content.replace(/```json\n?/g, '').replace(/```$/g, '').trim();
    parsed = JSON.parse(cleaned);
  } catch (e) {
    parsed = { _parse_error: String(e), raw: content };
  }

  const out = {
    image: IMG_PATH,
    model_response: parsed,
    raw_text: content,
  };
  fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));
  console.log(`\nResult written to: ${OUT_PATH}`);
}

main().catch((err) => {
  console.error('VLM analysis failed:', err);
  process.exit(1);
});
