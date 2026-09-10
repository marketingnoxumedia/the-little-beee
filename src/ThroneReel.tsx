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
// "The old battlefield" reel (ThroneReel) — Nokia losing the smartphone, told as the A/B twin of
// the existing NokiaReel ("When the game changes"), which opens and closes declaratively. A company
// that sold one in every two phones ended up selling the whole business for parts: in the 2000s
// Nokia was the world's dominant phone maker (~half of every phone sold), but leading handsets
// didn't carry into the smartphone that replaced it. It clung to its own aging software, and the
// confidence was earned — it led global share, owned world-class hardware, and out-manufactured
// every rival; switching to an outside OS meant handing control to a partner and admitting its own
// software was finished, a concession a leader almost never makes. Then iPhone and Android moved
// the contest to software and apps, where hardware share didn't help, and in 2014 Nokia sold its
// phone business to Microsoft — a former king reduced to a sale. The lesson: when the basis of
// competition shifts, defending the old battlefield brilliantly is still how you lose. Question
// hook ("...sold one in every two phones ended up selling the whole business for parts?") and a
// rhetorical question close ("what's shifting under the leaders right now?"); a ~1.5s post-hook
// pause (the hook holds through the silence before the reveal — house convention); one count-up
// `stat` beat (~50% of phones sold), one red "A former king, reduced to a sale." `impact` card as
// the mid-tail thesis, and the question close on footage. **Media-dense:** 24 of 27 beats carry
// footage, with only 2 flat-black beats plus the one red card. Durations on exact ElevenLabs
// spoken-word timestamps at +6% pace; music normalized and mixed at 0.17. Total 1688 frames =
// ~56.3s (VO trimmed to end on the closing question; the close beat holds briefly after it).
// Entirely its own fresh footage under public/throne/ — no asset shared with NokiaReel,
// BlackberryReel, GroundReel, KodakReel, or any other reel. Imagery is generic — no phone-maker,
// carrier, Nokia/Microsoft/Apple, or app-brand logos or legible marks. **FLAG — real company:**
// Nokia, Microsoft, the ~50% peak share and the 2014 sale are named/rendered as written and are
// accurate in outline, but the ~50% figure is an approximation that varies by year and source —
// verify before publishing.
// ---------------------------------------------------------------------------
const SCENES: SceneDef[] = [
  {dur: 68, kind: 'hook', text: 'It sold one|in two phones.', kicker: 'The old battlefield', highlights: ['two'], size: 84, media: {src: 'throne/v_hook.mp4', type: 'video', effect: 'in'}},
  {dur: 80, kind: 'text', enter: 'slideL', text: 'Then sold the|whole business off', highlights: ['whole'], size: 82, media: {src: 'throne/p_brick.jpg', type: 'img', effect: 'in'}},
  // Short ~1.5s pause after the hook (house convention): 45 frames of silence are spliced into the
  // VO right after "...for parts?", and this black beat holds through it (22 -> 67).
  {dur: 67, kind: 'text', text: 'for|parts?', highlights: ['parts?'], size: 104},
  {dur: 91, kind: 'text', text: 'It was Nokia.|It ruled mobile.', highlights: ['nokia'], size: 88, media: {src: 'throne/p_oldphones.jpg', type: 'img', effect: 'in'}},
  {dur: 94, kind: 'text', enter: 'slideL', text: 'Then clung to what|had always won.', highlights: ['clung'], size: 82, media: {src: 'throne/p_king.jpg', type: 'img', effect: 'in'}},
  {dur: 36, kind: 'text', text: 'The dominant|phone maker.', highlights: ['dominant'], size: 88, media: {src: 'throne/v_retro.mp4', type: 'video', effect: 'in'}},
  {dur: 82, kind: 'stat', stat: {pre: 'AT ITS PEAK', value: 50, suffix: '%', post: 'OF PHONES SOLD'}, media: {src: 'throne/p_factory.jpg', type: 'img', effect: 'in'}},
  {dur: 70, kind: 'text', text: 'But leading the|phone market', highlights: ['leading'], size: 84, media: {src: 'throne/p_keypad.jpg', type: 'img', effect: 'in'}},
  {dur: 57, kind: 'text', enter: 'slideL', text: "didn't win the|smartphone.", highlights: ['smartphone'], size: 88, media: {src: 'throne/v_touch.mp4', type: 'video', effect: 'in'}},
  {dur: 38, kind: 'text', text: 'It stuck with|aging software.', highlights: ['aging'], size: 88, media: {src: 'throne/p_menu.jpg', type: 'img', effect: 'in'}},
  {dur: 73, kind: 'text', text: 'Its confidence|was earned.', highlights: ['confidence'], size: 88, media: {src: 'throne/p_throne.jpg', type: 'img', effect: 'in'}},
  {dur: 37, kind: 'text', text: 'World-class|hardware.', highlights: ['hardware'], size: 92, media: {src: 'throne/p_hardware.jpg', type: 'img', effect: 'in'}},
  {dur: 72, kind: 'text', enter: 'slideL', text: 'It out-manufactured|every rival.', highlights: ['rival'], size: 82, media: {src: 'throne/v_assembly.mp4', type: 'video', effect: 'in'}},
  {dur: 43, kind: 'text', text: 'An outside OS|meant', highlights: ['outside'], size: 90, media: {src: 'throne/p_smartphone.jpg', type: 'img', effect: 'in'}},
  {dur: 82, kind: 'text', text: 'handing control|to a partner.', highlights: ['control'], size: 86, media: {src: 'throne/p_handshake.jpg', type: 'img', effect: 'in'}},
  {dur: 37, kind: 'text', text: 'Its software|was finished.', highlights: ['finished'], size: 88, media: {src: 'throne/p_chess.jpg', type: 'img', effect: 'in'}},
  {dur: 92, kind: 'text', text: 'No leader|concedes that.', highlights: ['concedes'], size: 90},
  {dur: 49, kind: 'text', enter: 'slideL', text: 'The contest moved|to software.', highlights: ['software'], size: 84, media: {src: 'throne/v_apps.mp4', type: 'video', effect: 'in'}},
  {dur: 50, kind: 'text', text: "Hardware share|didn't help.", highlights: ['share'], size: 88, media: {src: 'throne/p_appgrid.jpg', type: 'img', effect: 'in'}},
  {dur: 79, kind: 'text', text: 'In 2014', highlights: ['2014'], size: 100, media: {src: 'throne/p_corporate.jpg', type: 'img', effect: 'in'}},
  {dur: 30, kind: 'text', text: 'sold to|Microsoft.', highlights: ['microsoft'], size: 92, media: {src: 'throne/p_deal.jpg', type: 'img', effect: 'in'}},
  {dur: 66, kind: 'impact', text: 'A former king,|reduced to a sale.', redBg: true},
  {dur: 68, kind: 'text', enter: 'slideL', text: 'When the basis of|competition shifts', highlights: ['shifts'], size: 80, media: {src: 'throne/p_chessboard.jpg', type: 'img', effect: 'in'}},
  {dur: 60, kind: 'text', text: 'defending the old|battlefield', highlights: ['battlefield'], size: 84, media: {src: 'throne/v_discard.mp4', type: 'video', effect: 'in'}},
  {dur: 65, kind: 'text', text: 'is still how|you lose.', highlights: ['lose'], size: 90, media: {src: 'throne/p_recycle.jpg', type: 'img', effect: 'in'}},
  {dur: 32, kind: 'text', text: 'If the leader is|this blind', highlights: ['blind'], size: 84, media: {src: 'throne/v_crowd.mp4', type: 'video', effect: 'in'}},
  {dur: 70, kind: 'text', enter: 'zoom', text: "what's shifting|under the leaders now?", highlights: ['shifting'], size: 80, media: {src: 'throne/v_close.mp4', type: 'video', effect: 'in'}},
];

// Sound-effect cues (frame, file, gain). Placed on key beats, not every cut.
// NOTE: a 45-frame (~1.5s) pause is spliced after the hook (at frame ~84), so cues from the
// reveal (frame 129) on are already on the post-pause timeline.
type SfxCue = {at: number; src: string; vol: number};
const SFX: SfxCue[] = [
  {at: 215, src: 'media/sfx_whoosh.mp3', vol: 0.4},    // reveal after the pause
  {at: 436, src: 'media/sfx_impact.mp3', vol: 0.55},   // ~50% peak-share stat
  {at: 588, src: 'media/sfx_whoosh.mp3', vol: 0.35},   // cut to the smartphone
  {at: 1297, src: 'media/sfx_chaching.mp3', vol: 0.5}, // the 2014 sale to Microsoft
  {at: 1327, src: 'media/sfx_impact.mp3', vol: 0.72},  // red 'A former king...' card
  {at: 1618, src: 'media/sfx_whoosh.mp3', vol: 0.4},   // question close
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
  const isHi = (w: string) => hset.includes(w.replace(/[.,—-]/g, '').toLowerCase());
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
                const hi = hset.includes(w.replace(/[.,—-]/g, '').toLowerCase());
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
  const num = stat.decimals ? shown.toFixed(stat.decimals) : Math.round(shown).toLocaleString('en-US');
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
    {t: 'No brand.', red: false},
    {t: 'No buzz.', red: false},
    {t: 'Just rent.', red: true},
  ];
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'center'}}>
        {parts.map((p, i) => {
          const s = spring({frame: frame - (6 + i * 14), fps, config: {damping: 200}});
          return (
            <span key={i} style={{fontFamily: HEAD, fontSize: p.red ? 150 : 116, textTransform: 'uppercase', letterSpacing: 1, color: C.ink, opacity: s, transform: `translateY(${interpolate(s, [0, 1], [34, 0])}px)`}}>
              {p.red ? (<>Just <span style={{color: C.red, textShadow: SH}}>rent.</span></>) : p.t}
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
        <span style={{fontFamily: BODY, fontWeight: 700, fontSize: 22, letterSpacing: 5, color: C.ink, textTransform: 'uppercase', textShadow: SH}}>The old battlefield</span>
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
export const ThroneReel: React.FC = () => {
  const frame = useCurrentFrame();
  const globalOpacity = interpolate(frame, [0, 12, DURATION_IN_FRAMES - 16, DURATION_IN_FRAMES], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{backgroundColor: C.bg}}>
      {HAS_VOICEOVER ? <Audio src={staticFile('throne/voiceover.mp3')} /> : null}
      <Audio
        src={staticFile('throne/music.mp3')}
        volume={(f) => interpolate(f, [0, 20, DURATION_IN_FRAMES - 55, DURATION_IN_FRAMES], [0, 0.17, 0.17, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
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
