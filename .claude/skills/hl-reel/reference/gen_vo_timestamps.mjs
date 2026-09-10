// Generate a narration track from a cloned ElevenLabs voice AND compute exact
// scene-cut frames from word-level timestamps, so captions land on the spoken
// word. Usage:
//   ELEVEN_KEY=... node gen_vo_timestamps.mjs
// Then apply the printed atempo + durations to the composition.
//
// Edit VOICE, SCRIPT, ANCHORS, SPEED below for a new reel.
import {writeFileSync} from 'node:fs';

const KEY = process.env.ELEVEN_KEY;              // never hard-code / commit this
const VOICE = 'REPLACE_WITH_VOICE_ID';           // from voice clone (see SKILL.md)
const FPS = 30;
const SPEED = 1.06;                              // >1 = faster overall pace (atempo)
const LEAD = 2;                                  // frames: show caption a hair early
const OUT = 'out/ref/vo.mp3';

// The EXACT text sent to TTS (numbers spelled out for correct read).
const SCRIPT = `REPLACE with the full narration script, sentences separated by spaces or newlines.`;

// One starting substring per scene, in order. Must appear in SCRIPT; matched
// case-insensitively and sequentially (so duplicates resolve left-to-right).
const ANCHORS = [
  'REPLACE first-scene start words',
  // ...one per scene...
];

const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}/with-timestamps?output_format=mp3_44100_128`, {
  method: 'POST',
  headers: {'xi-api-key': KEY, 'Content-Type': 'application/json'},
  body: JSON.stringify({
    text: SCRIPT,
    model_id: 'eleven_multilingual_v2',
    voice_settings: {stability: 0.5, similarity_boost: 0.85, style: 0.15, use_speaker_boost: true},
  }),
});
if (!res.ok) { console.error('HTTP', res.status, await res.text()); process.exit(1); }
const data = await res.json();
writeFileSync(OUT, Buffer.from(data.audio_base64, 'base64'));

const al = data.alignment || data.normalized_alignment;
const lower = al.characters.join('').toLowerCase();
let cursor = 0;
const startSec = [];
for (const a of ANCHORS) {
  const idx = lower.indexOf(a.toLowerCase(), cursor);
  if (idx < 0) { console.error('ANCHOR NOT FOUND:', a); process.exit(1); }
  startSec.push(al.character_start_times_seconds[idx]);
  cursor = idx + 1;
}
let lastEnd = 0;
for (let i = 0; i < al.characters.length; i++) if (al.characters[i].trim()) lastEnd = al.character_end_times_seconds[i];

const toFrame = (s) => Math.max(0, Math.round((s / SPEED) * FPS) - LEAD);
const startF = startSec.map(toFrame);
startF[0] = 0;
const totalF = Math.round((lastEnd / SPEED) * FPS) + 6;
const durs = startF.map((s, i) => (i + 1 < startF.length ? startF[i + 1] : totalF) - s);

console.log('SPED_SECONDS', (lastEnd / SPEED).toFixed(2), 'TOTAL_FRAMES', totalF);
console.log('DURS', JSON.stringify(durs));            // paste into SCENES[].dur
console.log('STARTS', JSON.stringify(startF));        // use for SFX cue frames
console.log(`Now run: ffmpeg -i ${OUT} -af atempo=${SPEED} public/voiceover.mp3`);
