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
};
type SceneDef = {
  dur: number;
  kind: 'hook' | 'lines' | 'text' | 'stat' | 'impact' | 'outro';
  text?: string;
  kicker?: string;
  highlights?: string[];
  reveal?: number[];
  size?: number;
  stat?: StatCfg;
  redBg?: boolean;
  media?: MediaCfg;
  enter?: 'slideL' | 'slideR' | 'slideUp' | 'zoom';
};

// ---------------------------------------------------------------------------
// "The unavoidable sliver" reel — Avery Dennison charges a fraction of a cent
// per item on the labels, tags and adhesive materials that go on a huge share
// of the world's packages, products and shipping boxes. The per-unit price is
// beneath fighting over, yet it's collected across billions of units; every
// product needs labelling (price tags, barcodes, shipping labels, RFID), and
// e-commerce quietly compounds it. Embedded in retail and logistics supply
// chains and hard to displace: ~$8.9B revenue at ~16% EBITDA margin and
// >$700M free cash flow. Durations placed on exact spoken-word timestamps
// (ElevenLabs alignment) at +6% pace. Total 1673 frames = ~56s. Mixes video
// clips (checkout scan, parcel conveyor, label printing, labelled box) with
// stills. The red `impact` card ("tiny part, huge scale") sits late; the reel
// resolves on a scanning clip and closes on a black payoff beat ("a fraction of
// a cent, on nearly everything"), not the red card. Every background is sourced
// fresh for this reel — no footage shared with any other reel (hard rule).
//
// NOTE (unverified): this reel names a real company (Avery Dennison, NYSE: AVY)
// and cites financials — ~$8.9B revenue, ~16% EBITDA margin, >$700M free cash
// flow — rendered as written in the client script and NOT independently
// verified; sanity-check against the company's latest filings before publishing.
// ---------------------------------------------------------------------------
const SCENES: SceneDef[] = [
  {dur: 92, kind: 'hook', text: 'It charges a|fraction of a cent.', kicker: 'The unavoidable sliver', highlights: ['fraction'], size: 74, media: {src: 'label/p_7843978.jpg', type: 'img', effect: 'in'}},
  {dur: 70, kind: 'text', text: 'Too small|to argue about.', highlights: ['small'], size: 84},
  {dur: 67, kind: 'text', text: 'Too embedded|to remove.', highlights: ['embedded'], size: 84, media: {src: 'label/p_4440792.jpg', type: 'img', effect: 'in'}},
  {dur: 33, kind: 'text', text: 'On billions|of items.', highlights: ['billions'], size: 86, media: {src: 'label/clip_conveyor.mp4', type: 'video', effect: 'in'}},
  {dur: 36, kind: 'text', text: 'Avery|Dennison.', highlights: ['dennison'], size: 98, media: {src: 'label/p_7441481.jpg', type: 'img', effect: 'in'}},
  {dur: 98, kind: 'text', text: 'Labels, tags,|adhesives.', highlights: ['labels'], size: 82, media: {src: 'label/clip_label.mp4', type: 'video', effect: 'in'}},
  {dur: 80, kind: 'text', enter: 'slideL', text: 'On the world\'s|packages.', highlights: ['packages'], size: 78, media: {src: 'label/p_4440789.jpg', type: 'img', effect: 'in'}},
  {dur: 99, kind: 'text', text: 'The per-unit|economics.', highlights: ['economics'], size: 80, media: {src: 'label/p_5942528.jpg', type: 'img', effect: 'in'}},
  {dur: 68, kind: 'text', text: 'Beneath|fighting over.', highlights: ['beneath'], size: 86},
  {dur: 30, kind: 'text', text: 'Across billions|of units.', highlights: ['billions'], size: 84},
  {dur: 47, kind: 'text', text: 'Every product|needs a label.', highlights: ['every'], size: 78, media: {src: 'label/p_7451957.jpg', type: 'img', effect: 'in'}},
  {dur: 106, kind: 'lines', text: 'Price tags.|Barcodes.|Shipping labels.|RFID.', highlights: ['rfid'], reveal: [6, 32, 58, 84]},
  {dur: 70, kind: 'text', enter: 'slideR', text: 'E-commerce|compounds it.', highlights: ['compounds'], size: 80, media: {src: 'label/p_4440788.jpg', type: 'img', effect: 'in'}},
  {dur: 114, kind: 'text', text: 'Every extra parcel|adds labels.', highlights: ['labels'], size: 78, media: {src: 'label/clip_parcels.mp4', type: 'video', effect: 'in'}},
  {dur: 62, kind: 'text', text: 'That a shop|never needed.', highlights: ['shop'], size: 78, media: {src: 'label/p_16211537.jpg', type: 'img', effect: 'in'}},
  {dur: 86, kind: 'text', text: 'Embedded in retail|and logistics.', highlights: ['retail'], size: 76, media: {src: 'label/p_38195854.jpg', type: 'img', effect: 'panL'}},
  {dur: 64, kind: 'text', text: 'Hard to displace|once you\'re in.', highlights: ['displace'], size: 76, media: {src: 'label/p_5775099.jpg', type: 'img', effect: 'in'}},
  {dur: 81, kind: 'stat', stat: {pre: 'Revenue', prefix: '$', value: 8.9, decimals: 1, suffix: 'B'}, media: {src: 'label/p_14820416.jpg', type: 'img', effect: 'in'}},
  {dur: 67, kind: 'stat', stat: {pre: 'EBITDA margin', value: 16, suffix: '%', bar: 16}},
  {dur: 67, kind: 'stat', stat: {pre: 'Free cash flow', prefix: '$', value: 700, suffix: 'M'}, media: {src: 'label/p_6266701.jpg', type: 'img', effect: 'in'}},
  {dur: 58, kind: 'impact', text: 'Tiny part.|Huge scale.', redBg: true},
  {dur: 54, kind: 'text', text: 'An unavoidable|sliver of everything.', highlights: ['sliver'], size: 74, media: {src: 'label/p_6250876.jpg', type: 'img', effect: 'in'}},
  {dur: 80, kind: 'text', text: 'Scales into|real money.', highlights: ['money'], size: 82, media: {src: 'label/clip_scan.mp4', type: 'video', effect: 'in'}},
  {dur: 44, kind: 'text', enter: 'zoom', text: 'A fraction of a cent,|on nearly everything.', highlights: ['everything'], size: 72},
];

// Sound-effect cues (frame, file, gain). Placed on key beats, not every cut.
type SfxCue = {at: number; src: string; vol: number};
const SFX: SfxCue[] = [
  {at: 229, src: 'media/sfx_whoosh.mp3', vol: 0.4},
  {at: 262, src: 'media/sfx_impact.mp3', vol: 0.5},
  {at: 298, src: 'media/sfx_whoosh.mp3', vol: 0.35},
  {at: 896, src: 'media/sfx_whoosh.mp3', vol: 0.38},
  {at: 1222, src: 'media/sfx_impact.mp3', vol: 0.55},
  {at: 1303, src: 'media/sfx_impact.mp3', vol: 0.5},
  {at: 1370, src: 'media/sfx_chaching.mp3', vol: 0.45},
  {at: 1437, src: 'media/sfx_impact.mp3', vol: 0.72},
  {at: 1549, src: 'media/sfx_chaching.mp3', vol: 0.42},
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
  const num = stat.decimals ? shown.toFixed(stat.decimals) : String(Math.round(shown));
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
        {stat.post ? <div style={{fontFamily: BODY, fontWeight: 600, fontSize: 46, color: C.ink, marginTop: 6, textTransform: 'uppercase', letterSpacing: 1}}>{stat.post}</div> : null}
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
    {t: 'Tiny part.', red: false},
    {t: 'Huge scale.', red: false},
    {t: 'Real money.', red: true},
  ];
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center'}}>
        {parts.map((p, i) => {
          const s = spring({frame: frame - (6 + i * 14), fps, config: {damping: 200}});
          return (
            <span key={i} style={{fontFamily: HEAD, fontSize: p.red ? 138 : 116, textTransform: 'uppercase', letterSpacing: 1, color: C.ink, opacity: s, transform: `translateY(${interpolate(s, [0, 1], [34, 0])}px)`}}>
              {p.red ? (<>Real <span style={{color: C.red, textShadow: SH}}>money.</span></>) : p.t}
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
        <span style={{fontFamily: BODY, fontWeight: 700, fontSize: 22, letterSpacing: 5, color: C.ink, textTransform: 'uppercase', textShadow: SH}}>The unavoidable sliver</span>
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
    case 'outro':
      return <SceneOutro />;
    default:
      return null;
  }
};

// ---------------------------------------------------------------------------
export const LabelReel: React.FC = () => {
  const frame = useCurrentFrame();
  const globalOpacity = interpolate(frame, [0, 12, DURATION_IN_FRAMES - 16, DURATION_IN_FRAMES], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      {HAS_VOICEOVER ? <Audio src={staticFile('label/voiceover.mp3')} /> : null}
      <Audio
        src={staticFile('label/music.mp3')}
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
