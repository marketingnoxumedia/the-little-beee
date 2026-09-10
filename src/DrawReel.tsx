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
// "The rate, not the balance" reel — the retirement withdrawal-rate rule. Two people
// retire with the same million dollars; one never runs out, the other goes broke —
// same balance, same markets, the only difference is how fast they spend. On a
// $1,000,000 portfolio, compare drawing 4% a year ($40,000, a rate that has
// historically tended to last decades) against 8% ($80,000, double the income and a
// far higher risk of running dry). The rule of thumb: withdraw around 4% and a
// portfolio has a strong chance of lasting a long retirement; double the rate and
// you roughly double the odds of running out — the rate, not the balance, sets the
// outcome. Two retirees with identical savings can land in completely different
// places purely on spending speed, and timing compounds it: a bad market early hurts
// the fast spender most. The voiceover runs continuously with no dead air and scene
// durations sit on its exact spoken-word timestamps (ElevenLabs alignment) at +6%
// pace — total 1537 frames = ~51s. Full-bleed footage on nearly every beat, mixing
// video b-roll (a retired couple, budgeting cash, a draining hourglass, a market
// chart) with stills, count-up stats for the dollar figures, a red "the rate, not
// the balance" impact card mid-tail, and a 4%-vs-8% comparison closer. Every
// background is sourced fresh for this reel (hard rule).
//
// NOTE (illustration / guideline, not advice): the "~4% withdrawal rate" is the
// widely-cited rule of thumb (Bengen / the Trinity study); real outcomes depend on
// asset mix, sequence-of-returns risk, fees, inflation, and how long retirement
// lasts. The $1M / 4% / 8% / $40k / $80k figures are round illustrative numbers, not
// a forecast or a promise — "a guideline, not a guarantee." Confirm before publishing.
// ---------------------------------------------------------------------------
const SCENES: SceneDef[] = [
  {dur: 103, kind: 'hook', text: 'Two retire.|Same million.', kicker: 'The rate, not the balance', highlights: ['same'], size: 88, media: {src: 'draw/v_couple.mp4', type: 'video', effect: 'in'}},
  {dur: 36, kind: 'text', text: 'One never|runs out.', highlights: ['never'], size: 88, media: {src: 'draw/p_lasts.jpg', type: 'img', effect: 'in'}},
  {dur: 47, kind: 'text', text: 'The other|goes broke.', highlights: ['broke'], size: 90, media: {src: 'draw/p_broke.jpg', type: 'img', effect: 'in'}},
  {dur: 53, kind: 'text', text: 'Same balance,|same markets.', highlights: ['markets'], size: 82, media: {src: 'draw/p_markets.jpg', type: 'img', effect: 'in'}},
  {dur: 50, kind: 'text', enter: 'zoom', text: 'One difference:|how fast they spend.', highlights: ['fast'], size: 74, media: {src: 'draw/v_spend.mp4', type: 'video', effect: 'in'}},
  {dur: 78, kind: 'stat', stat: {pre: 'The portfolio', prefix: '$', value: 1, suffix: 'M'}, media: {src: 'draw/p_million.jpg', type: 'img', effect: 'in'}},
  {dur: 41, kind: 'stat', stat: {pre: 'Draw a year', value: 4, suffix: '%'}, media: {src: 'draw/p_four.jpg', type: 'img', effect: 'in'}},
  {dur: 58, kind: 'stat', stat: {pre: 'Or draw', value: 8, suffix: '%'}, media: {src: 'draw/p_eight.jpg', type: 'img', effect: 'in'}},
  {dur: 90, kind: 'stat', stat: {pre: '4% is', prefix: '$', value: 40000, comma: true, post: 'a year'}, media: {src: 'draw/p_40k.jpg', type: 'img', effect: 'in'}},
  {dur: 59, kind: 'text', text: 'Historically|lasts decades.', highlights: ['decades'], size: 84, media: {src: 'draw/p_decades.jpg', type: 'img', effect: 'in'}},
  {dur: 98, kind: 'stat', stat: {pre: '8% is', prefix: '$', value: 80000, comma: true, post: 'a year'}, media: {src: 'draw/p_80k.jpg', type: 'img', effect: 'in'}},
  {dur: 28, kind: 'text', text: 'Far higher risk|of running dry.', highlights: ['dry'], size: 78, media: {src: 'draw/v_sand.mp4', type: 'video', effect: 'in'}},
  {dur: 108, kind: 'text', enter: 'slideL', text: 'The rule|of thumb.', highlights: ['rule'], size: 96, media: {src: 'draw/p_rule.jpg', type: 'img', effect: 'in'}},
  {dur: 112, kind: 'text', text: '4%: a strong|chance to last.', highlights: ['last'], size: 80, media: {src: 'draw/p_strong.jpg', type: 'img', effect: 'in'}},
  {dur: 41, kind: 'text', text: '8% doubles|the odds of ruin.', highlights: ['doubles'], size: 80, media: {src: 'draw/p_ruin.jpg', type: 'img', effect: 'in'}},
  {dur: 76, kind: 'impact', text: 'The rate,|not the balance.', redBg: true},
  {dur: 126, kind: 'text', enter: 'slideR', text: 'Same savings,|different endings.', highlights: ['different'], size: 80, media: {src: 'draw/p_diverge.jpg', type: 'img', effect: 'in'}},
  {dur: 46, kind: 'text', text: 'Purely on|spending speed.', highlights: ['speed'], size: 84, media: {src: 'draw/p_speed.jpg', type: 'img', effect: 'in'}},
  {dur: 39, kind: 'text', text: 'And timing|compounds it.', highlights: ['timing'], size: 84, media: {src: 'draw/p_timing.jpg', type: 'img', effect: 'in'}},
  {dur: 79, kind: 'text', enter: 'zoom', text: 'A bad market early|hurts most.', highlights: ['early'], size: 78, media: {src: 'draw/v_chart.mp4', type: 'video', effect: 'in'}},
  {dur: 169, kind: 'compare', compare: {a: {value: 4, suffix: '%', label: 'lasts decades'}, b: {value: 8, suffix: '%', label: 'can run dry'}, note: 'A guideline, not a guarantee'}},
];

// Sound-effect cues (frame, file, gain). Placed on key beats, not every cut.
type SfxCue = {at: number; src: string; vol: number};
const SFX: SfxCue[] = [
  {at: 289, src: 'media/sfx_impact.mp3', vol: 0.5}, // $1,000,000 portfolio
  {at: 466, src: 'media/sfx_impact.mp3', vol: 0.45}, // $40,000 a year
  {at: 615, src: 'media/sfx_impact.mp3', vol: 0.5}, // $80,000 a year
  {at: 1002, src: 'media/sfx_impact.mp3', vol: 0.62}, // red card — the rate, not the balance
  {at: 1289, src: 'media/sfx_whoosh.mp3', vol: 0.35}, // a bad market early
  {at: 1368, src: 'media/sfx_impact.mp3', vol: 0.5}, // compare closer
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
        <span style={{fontFamily: BODY, fontWeight: 700, fontSize: 22, letterSpacing: 5, color: C.ink, textTransform: 'uppercase', textShadow: SH}}>The rate, not the balance</span>
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
export const DrawReel: React.FC = () => {
  const frame = useCurrentFrame();
  const globalOpacity = interpolate(frame, [0, 12, DURATION_IN_FRAMES - 16, DURATION_IN_FRAMES], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      {HAS_VOICEOVER ? <Audio src={staticFile('draw/voiceover.mp3')} /> : null}
      <Audio
        src={staticFile('draw/music.mp3')}
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
