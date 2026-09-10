import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Img,
  OffthreadVideo,
  staticFile,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';
import {loadFont as loadAnton} from '@remotion/google-fonts/Anton';
import {loadFont as loadRobotoCondensed} from '@remotion/google-fonts/RobotoCondensed';

const {fontFamily: ANTON} = loadAnton();
const {fontFamily: ROBOTO_CONDENSED} = loadRobotoCondensed();

const HEAD = ANTON;
const BODY = `'Helvetica Now Display Condensed','Helvetica Now Display','${ROBOTO_CONDENSED}','Arial Narrow',sans-serif`;

// ---------------------------------------------------------------------------
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

const HAS_VOICEOVER = true;

const C = {
  bg: '#0A0A0A',
  ink: '#F4F4F4',
  sub: '#9A9A9A',
  muted: '#585858',
  red: '#FF2E2E',
  track: '#1B1B1B',
  line: 'rgba(255,255,255,0.05)',
};

// One shared, soft DIRECTIONAL drop shadow for every caption (white and red
// alike) — matches the reference's clean look: reads as depth, not a glow, and
// needs no stroke or darkening of the footage.
const SH = '1px 2px 5px rgba(0,0,0,0.55), 2px 4px 16px rgba(0,0,0,0.34)';

// ---------------------------------------------------------------------------
type MediaCfg = {
  src: string;
  type: 'img' | 'video';
  from?: number;
  effect?: 'in' | 'out' | 'panL' | 'panR';
  scrim?: number;
};
type StatCfg = {
  pre?: string;
  prefix?: string;
  value: number;
  decimals?: number;
  suffix?: string;
  post?: string;
  bar?: number;
  source?: string;
  comma?: boolean;
};
type CompareCfg = {
  a: {value: number; prefix?: string; suffix?: string; label: string; decimals?: number};
  b: {value: number; prefix?: string; suffix?: string; label: string; decimals?: number};
  note?: string;
  source?: string;
  swapAt?: number; // local frame at which the footer swaps to swapNote
  swapNote?: string;
};
type SceneDef = {
  dur: number;
  kind: 'hook' | 'lines' | 'text' | 'stat' | 'impact' | 'compare' | 'outro';
  text?: string;
  kicker?: string;
  highlights?: string[];
  reveal?: number[];
  size?: number;
  stat?: StatCfg;
  compare?: CompareCfg;
  redBg?: boolean;
  media?: MediaCfg;
  enter?: 'slideL' | 'slideR' | 'slideUp' | 'zoom';
};

// ---------------------------------------------------------------------------
// "Income vs. wealth" reel — a big salary is income; what you keep is wealth. There's
// a belief that a big salary means you're rich, but plenty of people earning $300K a
// year have almost nothing saved — income and wealth aren't the same thing. It's an
// easy mistake: income is visible (the car, the title, the address) while savings and
// net worth stay invisible, so the paycheck becomes the scoreboard. But net worth
// tracks the savings rate far more than the salary; studies of actual millionaires
// keep finding ordinary incomes paired with high savings and decades of investing,
// and lifestyle expands to fill income, so a raise without a higher savings rate
// leaves net worth flat. Income is what flows in; net worth is what you keep. Someone
// on $300K who spends all of it builds nothing; someone on $90K who keeps a fifth
// quietly compounds into real wealth — same effort at work, decades apart at the end.
// The decisive number was never the paycheck; it's the gap between earning and
// spending, compounded over time. Income sets the ceiling; the savings rate decides
// how much of it becomes wealth. The voiceover is flat and unhurried, runs
// continuously, and scene durations sit on its exact spoken-word timestamps
// (ElevenLabs alignment) at +6% pace — total 1797 frames = ~60s. Opens flat on the
// myth (no count-up: the gap is conceptual). Mixes video b-roll (luxury cars,
// investing charts, stacked coins, gold-coin saving) with stills, two black beats
// (the "car / title / address" list and "never the paycheck") and one red "the gap
// between earning and spending" impact card, closing on footage. Every background is
// sourced fresh for this reel (hard rule).
//
// NOTE (illustration — verified sources, confirm before publishing): the "income ≠
// wealth / savings-rate-decides" thesis is supported by the Federal Reserve Survey of
// Consumer Finances and Stanley & Danko's "The Millionaire Next Door." The $300K,
// $90K and "a fifth" (≈20% savings rate) are round illustrative figures, not a claim
// about any specific person — directional, confirm the current data before publishing.
// ---------------------------------------------------------------------------
const SCENES: SceneDef[] = [
  {dur: 104, kind: 'hook', text: 'Big salary|means rich.', kicker: 'Income vs. wealth', highlights: ['rich'], size: 92, media: {src: 'keep/v_convert.mp4', type: 'video', effect: 'in'}},
  {dur: 109, kind: 'text', text: '$300K a year.|Nothing saved.', highlights: ['$300k'], size: 82, media: {src: 'keep/p_saved.jpg', type: 'img', effect: 'in'}},
  {dur: 40, kind: 'text', text: 'Income and wealth|aren\'t the same.', highlights: ['same'], size: 78, media: {src: 'keep/p_diff.jpg', type: 'img', effect: 'in'}},
  {dur: 30, kind: 'text', text: 'It\'s an easy|mistake.', highlights: ['mistake'], size: 90, media: {src: 'keep/p_mistake.jpg', type: 'img', effect: 'in'}},
  {dur: 33, kind: 'text', enter: 'zoom', text: 'Income is|visible.', highlights: ['visible'], size: 96, media: {src: 'keep/v_lambo.mp4', type: 'video', effect: 'in'}},
  {dur: 96, kind: 'lines', text: 'The car.|The title.|The address.', highlights: ['address'], reveal: [8, 40, 72]},
  {dur: 63, kind: 'text', text: 'Net worth stays|invisible.', highlights: ['invisible'], size: 82, media: {src: 'keep/p_invisible.jpg', type: 'img', effect: 'in'}},
  {dur: 45, kind: 'text', text: 'The paycheck is|the scoreboard.', highlights: ['scoreboard'], size: 80, media: {src: 'keep/p_scoreboard.jpg', type: 'img', effect: 'in'}},
  {dur: 101, kind: 'text', text: 'Net worth tracks|the savings rate.', highlights: ['savings'], size: 78, media: {src: 'keep/p_rate.jpg', type: 'img', effect: 'in'}},
  {dur: 52, kind: 'text', text: 'Studies of real|millionaires.', highlights: ['millionaires'], size: 80, media: {src: 'keep/p_millionaires.jpg', type: 'img', effect: 'in'}},
  {dur: 80, kind: 'text', text: 'Ordinary incomes.|High savings.', highlights: ['high'], size: 82, media: {src: 'keep/p_ordinary.jpg', type: 'img', effect: 'in'}},
  {dur: 54, kind: 'text', enter: 'slideL', text: 'Decades of|investing.', highlights: ['decades'], size: 90, media: {src: 'keep/v_charts.mp4', type: 'video', effect: 'in'}},
  {dur: 114, kind: 'text', text: 'Lifestyle expands|to fill income.', highlights: ['expands'], size: 80, media: {src: 'keep/p_expands.jpg', type: 'img', effect: 'in'}},
  {dur: 105, kind: 'text', text: 'A raise leaves|net worth flat.', highlights: ['flat'], size: 82, media: {src: 'keep/p_flat.jpg', type: 'img', effect: 'in'}},
  {dur: 102, kind: 'text', enter: 'slideR', text: 'Income flows in.|Net worth is kept.', highlights: ['kept'], size: 76, media: {src: 'keep/p_kept.jpg', type: 'img', effect: 'in'}},
  {dur: 69, kind: 'text', text: '$300K, spends it all.|Builds nothing.', highlights: ['nothing'], size: 72, media: {src: 'keep/p_nothing.jpg', type: 'img', effect: 'in'}},
  {dur: 121, kind: 'text', enter: 'zoom', text: '$90K, keeps a fifth.|Real wealth.', highlights: ['wealth'], size: 72, media: {src: 'keep/v_stacks.mp4', type: 'video', effect: 'in'}},
  {dur: 84, kind: 'text', text: 'Same effort.|Decades apart.', highlights: ['apart'], size: 84, media: {src: 'keep/p_apart.jpg', type: 'img', effect: 'in'}},
  {dur: 37, kind: 'impact', text: 'It was never|the paycheck.'},
  {dur: 99, kind: 'impact', text: 'The gap between|earning and spending.', redBg: true},
  {dur: 49, kind: 'text', text: 'Income sets|the ceiling.', highlights: ['ceiling'], size: 86, media: {src: 'keep/p_ceiling.jpg', type: 'img', effect: 'in'}},
  {dur: 76, kind: 'text', enter: 'slideL', text: 'The savings rate|decides.', highlights: ['decides'], size: 84, media: {src: 'keep/p_decides.jpg', type: 'img', effect: 'in'}},
  {dur: 54, kind: 'text', text: 'A big salary|is income.', highlights: ['income'], size: 84, media: {src: 'keep/p_income.jpg', type: 'img', effect: 'in'}},
  {dur: 41, kind: 'text', enter: 'zoom', text: 'What you keep|is wealth.', highlights: ['keep'], size: 88, media: {src: 'keep/v_gold.mp4', type: 'video', effect: 'in'}},
  {dur: 39, kind: 'text', text: 'They\'re not|the same.', highlights: ['same'], size: 92, media: {src: 'keep/p_notsame.jpg', type: 'img', effect: 'in'}},
];

// Sound-effect cues (frame, file, gain). Placed on key beats, not every cut.
type SfxCue = {at: number; src: string; vol: number};
const SFX: SfxCue[] = [
  {at: 104, src: 'media/sfx_impact.mp3', vol: 0.42}, // $300K, nothing saved
  {at: 283, src: 'media/sfx_whoosh.mp3', vol: 0.3}, // income is visible — the car
  {at: 1197, src: 'media/sfx_impact.mp3', vol: 0.5}, // keeps a fifth → real wealth
  {at: 1439, src: 'media/sfx_impact.mp3', vol: 0.62}, // red card — the gap
  {at: 1717, src: 'media/sfx_whoosh.mp3', vol: 0.32}, // what you keep is wealth
];

const STARTS: number[] = (() => {
  const arr: number[] = [];
  let acc = 0;
  for (const s of SCENES) {
    arr.push(acc);
    acc += s.dur;
  }
  return arr;
})();
export const DURATION_IN_FRAMES = STARTS[STARTS.length - 1] + SCENES[SCENES.length - 1].dur;

const easeInOut = Easing.bezier(0.22, 1, 0.36, 1);
const useLocal = () => useCurrentFrame();

// Entrance transition applied to a scene's media + text together, over ~9 frames.
const enterTransform = (frame: number, enter?: string) => {
  if (!enter) return {tx: 0, ty: 0, sc: 1, op: 1};
  const t = interpolate(frame, [0, 9], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeInOut});
  let tx = 0;
  let ty = 0;
  let sc = 1;
  if (enter === 'slideL') tx = (1 - t) * 100;
  if (enter === 'slideR') tx = -(1 - t) * 100;
  if (enter === 'slideUp') ty = (1 - t) * 100;
  if (enter === 'zoom') sc = 1 + (1 - t) * 0.5;
  const op = interpolate(frame, [0, 6], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return {tx, ty, sc, op};
};

// ---------------------------------------------------------------------------
// Media background
// ---------------------------------------------------------------------------
const MediaBackground: React.FC<{cfg: MediaCfg; enter?: string}> = ({cfg, enter}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const isImg = cfg.type === 'img';
  const range = isImg ? 0.26 : 0.15;
  const effect = cfg.effect ?? 'in';
  const scale = effect === 'out' ? interpolate(p, [0, 1], [1 + range, 1]) : interpolate(p, [0, 1], [1, 1 + range]);
  let tx = 0;
  if (effect === 'panL') tx = interpolate(p, [0, 1], [3.5, -3.5]);
  if (effect === 'panR') tx = interpolate(p, [0, 1], [-3.5, 3.5]);
  const e = enterTransform(frame, enter);
  const opacity = interpolate(frame, [0, 5, durationInFrames - 5, durationInFrames], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) * e.op;
  const src = staticFile(cfg.src);
  const mediaStyle: React.CSSProperties = {width: '100%', height: '100%', objectFit: 'cover'};
  return (
    <AbsoluteFill style={{opacity}}>
      <AbsoluteFill style={{transform: `scale(${scale * e.sc}) translate(${tx + e.tx}%, ${e.ty}%)`, transformOrigin: 'center'}}>
        {isImg ? <Img src={src} style={mediaStyle} /> : <OffthreadVideo src={src} startFrom={cfg.from ?? 0} muted style={mediaStyle} />}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const shift = (frame * 7) % 200;
  return (
    <AbsoluteFill style={{opacity: 0.045, mixBlendMode: 'overlay', backgroundImage: 'radial-gradient(rgba(255,255,255,0.9) 0.5px, transparent 0.6px)', backgroundSize: '3px 3px', backgroundPosition: `${shift}px ${shift}px`, pointerEvents: 'none'}} />
  );
};

const Treatment: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <AbsoluteFill style={{backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px), linear-gradient(90deg, ${C.line} 1px, transparent 1px)`, backgroundSize: '90px 90px', maskImage: 'radial-gradient(85% 65% at 50% 45%, black 20%, transparent 100%)', opacity: 0.6}} />
    <Grain />
  </AbsoluteFill>
);

// ---------------------------------------------------------------------------
// Kinetic caption — Anton condensed caps, word-by-word, red highlight
// ---------------------------------------------------------------------------
const Caption: React.FC<{text: string; highlights?: string[]; size?: number; align?: 'center' | 'flex-start'; lineDelay?: number}> = ({text, highlights = [], size = 112, align = 'center', lineDelay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lines = text.split('|');
  const hset = highlights.map((h) => h.toLowerCase());
  const isHi = (w: string) => hset.includes(w.replace(/[.,—…-]/g, '').toLowerCase());
  let wordIndex = 0;
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 2, alignItems: align, width: '100%'}}>
      {lines.map((line, li) => (
        <div key={li} style={{display: 'flex', flexWrap: 'wrap', justifyContent: align === 'center' ? 'center' : 'flex-start', gap: '0 18px'}}>
          {line.split(' ').map((word, wi) => {
            const appear = lineDelay + wordIndex * 0.7;
            wordIndex++;
            const p = spring({frame: frame - appear, fps, config: {damping: 22, mass: 0.4, stiffness: 220}});
            const y = interpolate(p, [0, 1], [26, 0]);
            const hi = isHi(word);
            return (
              <span key={wi} style={{display: 'inline-block', fontFamily: HEAD, fontSize: size, lineHeight: 0.98, letterSpacing: 0.5, textTransform: 'uppercase', color: hi ? C.red : C.ink, opacity: p, transform: `translateY(${y}px)`, textShadow: SH}}>
                {word}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const Kicker: React.FC<{children: React.ReactNode; delay?: number}> = ({children, delay = 4}) => {
  const frame = useLocal();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: {damping: 200}});
  return (
    <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 26, letterSpacing: 7, textTransform: 'uppercase', color: C.ink, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [-12, 0])}px)`}}>
      {children}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Scenes
// ---------------------------------------------------------------------------
const SceneHook: React.FC<{text: string; kicker?: string; highlights?: string[]; size?: number}> = ({text, kicker, highlights, size = 92}) => (
  <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 84}}>
    {kicker ? <div style={{marginBottom: 44}}><Kicker>{kicker}</Kicker></div> : null}
    <Caption text={text} highlights={highlights} size={size} lineDelay={1} />
  </AbsoluteFill>
);

const SceneText: React.FC<{text: string; highlights?: string[]; size?: number}> = ({text, highlights, size = 100}) => (
  <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 84}}>
    <Caption text={text} highlights={highlights} size={size} lineDelay={0} />
  </AbsoluteFill>
);

const SceneLines: React.FC<{text: string; highlights?: string[]; reveal?: number[]}> = ({text, highlights = [], reveal}) => {
  const frame = useLocal();
  const {fps} = useVideoConfig();
  const lines = text.split('|');
  const hset = highlights.map((h) => h.toLowerCase());
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'flex-start', padding: '0 96px'}}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
        {lines.map((l, i) => {
          const appearAt = reveal ? reveal[i] : 6 + i * 12;
          const pv = spring({frame: frame - appearAt, fps, config: {damping: 22, mass: 0.4, stiffness: 220}});
          const x = interpolate(pv, [0, 1], [-42, 0]);
          return (
            <div key={i} style={{opacity: pv, transform: `translateX(${x}px)`, fontFamily: HEAD, fontSize: 96, lineHeight: 0.98, letterSpacing: 0.5, textTransform: 'uppercase'}}>
              {l.split(' ').map((w, wi) => {
                const hi = hset.includes(w.replace(/[.,—…-]/g, '').toLowerCase());
                return (
                  <span key={wi} style={{color: hi ? C.red : C.ink, textShadow: SH}}>
                    {w}
                    {wi < l.split(' ').length - 1 ? ' ' : ''}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const SceneStat: React.FC<{stat: StatCfg}> = ({stat}) => {
  const frame = useLocal();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - 2, fps, config: {damping: 22, mass: 0.4, stiffness: 220}});
  const t = interpolate(frame, [4, 38], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeInOut});
  const shown = stat.value * t;
  const num = stat.decimals
    ? shown.toFixed(stat.decimals)
    : stat.comma
    ? Math.round(shown).toLocaleString('en-US')
    : String(Math.round(shown));
  const barW = stat.bar != null ? interpolate(frame, [6, 40], [0, stat.bar], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeInOut}) : 0;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 80}}>
      <div style={{opacity: enter, transform: `translateY(${interpolate(enter, [0, 1], [26, 0])}px)`, textAlign: 'center'}}>
        {stat.pre ? <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 30, letterSpacing: 6, color: C.ink, textTransform: 'uppercase', marginBottom: 8}}>{stat.pre}</div> : null}
        <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'center'}}>
          {stat.prefix ? <span style={{fontFamily: HEAD, fontSize: 170, color: C.red, lineHeight: 1}}>{stat.prefix}</span> : null}
          <span style={{fontFamily: HEAD, fontSize: 300, color: C.red, lineHeight: 0.85, letterSpacing: 2, textShadow: SH}}>{num}</span>
          {stat.suffix ? <span style={{fontFamily: HEAD, fontSize: 170, color: C.red, lineHeight: 1}}>{stat.suffix}</span> : null}
        </div>
        {stat.post ? (
          <div style={{marginTop: 12}}>
            {stat.post.split('|').map((l, i) => (
              <div key={i} style={{fontFamily: BODY, fontWeight: 600, fontSize: 38, color: C.ink, lineHeight: 1.2, textTransform: 'uppercase', letterSpacing: 1}}>{l}</div>
            ))}
          </div>
        ) : null}
        {stat.source ? <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 24, color: C.muted, marginTop: 26, textTransform: 'uppercase', letterSpacing: 4}}>{stat.source}</div> : null}
      </div>
      {stat.bar != null ? (
        <div style={{width: 780, marginTop: 60, opacity: interpolate(frame, [12, 26], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}}>
          <div style={{height: 40, width: '100%', borderRadius: 4, background: C.track, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)'}}>
            <div style={{height: '100%', width: `${barW}%`, background: C.red, boxShadow: '0 0 30px rgba(255,46,46,0.45)'}} />
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// Two-number comparison save frame (e.g. $86 guessed vs $273 paid), with a
// count-up on both figures. The second row is the red focal (the shocking real
// number); a note + source sit beneath.
const SceneCompare: React.FC<{cfg: CompareCfg}> = ({cfg}) => {
  const frame = useLocal();
  const {fps} = useVideoConfig();
  const enter = spring({frame: frame - 2, fps, config: {damping: 22, mass: 0.4, stiffness: 220}});
  const t = interpolate(frame, [4, 40], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeInOut});
  const fmt = (s: {value: number; prefix?: string; suffix?: string; decimals?: number}) => {
    const shown = s.value * t;
    const num = s.decimals != null ? shown.toFixed(s.decimals) : Math.round(shown).toLocaleString('en-US');
    return (s.prefix ?? '') + num + (s.suffix ?? '');
  };
  // Footer swap: the note/source cross-fade to swapNote at swapAt (over ~9 frames).
  const swapAt = cfg.swapAt ?? Infinity;
  const swapK = Number.isFinite(swapAt)
    ? interpolate(frame, [swapAt - 4, swapAt + 5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})
    : 0;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: 70}}>
      <div style={{opacity: enter, transform: `translateY(${interpolate(enter, [0, 1], [28, 0])}px)`, display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center'}}>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 26, justifyContent: 'center'}}>
          <span style={{fontFamily: HEAD, fontSize: 200, lineHeight: 0.9, color: C.ink, letterSpacing: 1, textShadow: SH}}>{fmt(cfg.a)}</span>
          <span style={{fontFamily: BODY, fontWeight: 700, fontSize: 46, letterSpacing: 5, color: C.sub, textTransform: 'uppercase'}}>{cfg.a.label}</span>
        </div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 26, justifyContent: 'center'}}>
          <span style={{fontFamily: HEAD, fontSize: 250, lineHeight: 0.9, color: C.red, letterSpacing: 1, textShadow: SH}}>{fmt(cfg.b)}</span>
          <span style={{fontFamily: BODY, fontWeight: 700, fontSize: 52, letterSpacing: 5, color: C.ink, textTransform: 'uppercase'}}>{cfg.b.label}</span>
        </div>
        <div style={{position: 'relative', marginTop: 30, height: 76, width: '100%', display: 'flex', justifyContent: 'center'}}>
          <div style={{position: 'absolute', opacity: 1 - swapK, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center'}}>
            {cfg.note ? <div style={{fontFamily: BODY, fontWeight: 600, fontSize: 34, letterSpacing: 2, color: C.ink, textTransform: 'uppercase'}}>{cfg.note}</div> : null}
            {cfg.source ? <div style={{fontFamily: BODY, fontWeight: 700, fontSize: 24, letterSpacing: 4, color: C.muted, textTransform: 'uppercase'}}>{cfg.source}</div> : null}
          </div>
          {cfg.swapNote ? (
            <div style={{position: 'absolute', opacity: swapK, transform: `translateY(${interpolate(swapK, [0, 1], [10, 0])}px)`, fontFamily: BODY, fontWeight: 700, fontSize: 40, letterSpacing: 3, color: C.ink, textTransform: 'uppercase', textShadow: SH, whiteSpace: 'nowrap'}}>{cfg.swapNote}</div>
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SceneImpact: React.FC<{text: string; redBg?: boolean}> = ({text, redBg}) => {
  const frame = useLocal();
  const {fps} = useVideoConfig();
  const p = spring({frame, fps, config: {damping: 13, mass: 0.8, stiffness: 120}});
  const scale = interpolate(p, [0, 1], [0.66, 1]);
  const lines = text.split('|');
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      {redBg ? <AbsoluteFill style={{background: 'radial-gradient(125% 90% at 50% 42%, #FF2E2E 0%, #E31E1E 62%, #C21414 100%)'}} /> : null}
      <div style={{transform: `scale(${scale})`, opacity: Math.min(1, p * 1.4), textAlign: 'center', fontFamily: HEAD, fontSize: 150, lineHeight: 0.92, letterSpacing: 1, textTransform: 'uppercase'}}>
        {lines.map((l, i) => (
          <div key={i} style={{color: redBg ? (i === 0 ? '#0A0A0A' : C.ink) : (i === lines.length - 1 ? C.red : C.ink), textShadow: redBg ? 'none' : SH}}>
            {l}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const SceneOutro: React.FC = () => {
  const frame = useLocal();
  const {fps} = useVideoConfig();
  const parts = [
    {t: 'Not the price.', red: false},
    {t: 'The count.', red: false},
    {t: '$273.', red: true},
  ];
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center'}}>
        {parts.map((p, i) => {
          const s = spring({frame: frame - (6 + i * 14), fps, config: {damping: 200}});
          return (
            <span key={i} style={{fontFamily: HEAD, fontSize: p.red ? 138 : 116, textTransform: 'uppercase', letterSpacing: 1, color: C.ink, opacity: s, transform: `translateY(${interpolate(s, [0, 1], [34, 0])}px)`}}>
              {p.red ? (<><span style={{color: C.red, textShadow: SH}}>$273.</span></>) : p.t}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
const Hud: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = frame / DURATION_IN_FRAMES;
  return (
    <>
      <div style={{position: 'absolute', top: 70, left: 80, display: 'flex', alignItems: 'center', gap: 14}}>
        <div style={{width: 11, height: 11, borderRadius: 11, background: C.sub}} />
        <span style={{fontFamily: BODY, fontWeight: 700, fontSize: 22, letterSpacing: 5, color: C.ink, textTransform: 'uppercase', textShadow: SH}}>Income vs. wealth</span>
      </div>
      <div style={{position: 'absolute', bottom: 90, left: 80, right: 80, height: 3, borderRadius: 3, background: 'rgba(255,255,255,0.08)'}}>
        <div style={{height: '100%', width: `${progress * 100}%`, borderRadius: 3, background: C.sub}} />
      </div>
    </>
  );
};

const renderScene = (s: SceneDef) => {
  switch (s.kind) {
    case 'hook':
      return <SceneHook text={s.text!} kicker={s.kicker} highlights={s.highlights} size={s.size} />;
    case 'lines':
      return <SceneLines text={s.text!} highlights={s.highlights} reveal={s.reveal} />;
    case 'text':
      return <SceneText text={s.text!} highlights={s.highlights} size={s.size} />;
    case 'stat':
      return <SceneStat stat={s.stat!} />;
    case 'impact':
      return <SceneImpact text={s.text!} redBg={s.redBg} />;
    case 'compare':
      return <SceneCompare cfg={s.compare!} />;
    case 'outro':
      return <SceneOutro />;
    default:
      return null;
  }
};

// ---------------------------------------------------------------------------
export const KeepReel: React.FC = () => {
  const frame = useCurrentFrame();
  const globalOpacity = interpolate(frame, [0, 12, DURATION_IN_FRAMES - 16, DURATION_IN_FRAMES], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      {HAS_VOICEOVER ? <Audio src={staticFile('keep/voiceover.mp3')} /> : null}
      <Audio
        src={staticFile('keep/music.mp3')}
        volume={(f) => interpolate(f, [0, 20, DURATION_IN_FRAMES - 55, DURATION_IN_FRAMES], [0, 0.2244, 0.2244, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
      />
      {SFX.map((s, i) => (
        <Sequence key={`sfx${i}`} from={s.at} durationInFrames={60} name={`sfx-${i}`}>
          <Audio src={staticFile(s.src)} volume={s.vol} />
        </Sequence>
      ))}
      <AbsoluteFill style={{opacity: globalOpacity}}>
        {SCENES.map((s, i) =>
          s.media ? (
            <Sequence key={`m${i}`} from={STARTS[i]} durationInFrames={s.dur} name={`bg-${i}-${s.kind}`}>
              <MediaBackground cfg={s.media} enter={s.enter} />
            </Sequence>
          ) : null,
        )}
        <Treatment />
        {SCENES.map((s, i) => {
          // Captions lead the cut by a few frames so the text is fully on screen
          // as the word is spoken (compensates for the reveal's rise time).
          const TLEAD = 3;
          const tf = Math.max(0, STARTS[i] - TLEAD);
          return (
            <Sequence key={i} from={tf} durationInFrames={STARTS[i] + s.dur - tf} name={`${i}-${s.kind}`}>
              <SceneTransition enter={s.enter}>{renderScene(s)}</SceneTransition>
            </Sequence>
          );
        })}
        <Hud />
        <LogoWatermark />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Bottom-center brand watermark — 45% opacity, hard edges (drop the client's
// exact export at public/media/logo.png to replace).
const LogoWatermark: React.FC = () => (
  <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', pointerEvents: 'none'}}>
    <Img
      src={staticFile('media/logo.png')}
      style={{width: 330, height: 'auto', opacity: 0.45, marginBottom: 130, borderRadius: 0}}
    />
  </AbsoluteFill>
);

const SceneTransition: React.FC<{children: React.ReactNode; enter?: string}> = ({children, enter}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const e = enterTransform(frame, enter);
  const opacity = interpolate(frame, [0, 2, durationInFrames - 3, durationInFrames], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) * e.op;
  return (
    <AbsoluteFill style={{opacity, transform: `translate(${e.tx}%, ${e.ty}%) scale(${e.sc})`, transformOrigin: 'center', textShadow: SH}}>
      {children}
    </AbsoluteFill>
  );
};
