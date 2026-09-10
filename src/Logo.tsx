import React from 'react';
import {AbsoluteFill} from 'remotion';
import {loadFont as loadArchivo} from '@remotion/google-fonts/Archivo';

const {fontFamily: ARCHIVO} = loadArchivo();

const RED = '#E9353F';

// Hard Ledger wordmark. Rebuilt in-brand; replace public/media/logo.png with the
// client's exact export anytime (the video overlays that PNG, not this component).
export const HardLedgerLogo: React.FC = () => (
  <div style={{position: 'relative', width: 800, height: 200, fontFamily: ARCHIVO}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: 185, height: 200, background: RED}}>
      <span style={{position: 'absolute', left: 14, bottom: 0, fontWeight: 900, fontSize: 116, color: '#0A0A0A', letterSpacing: -4, lineHeight: 1}}>HL</span>
    </div>
    <span style={{position: 'absolute', left: 214, top: 16, fontWeight: 900, fontSize: 72, color: '#FFFFFF', letterSpacing: 1, lineHeight: 1}}>HARD</span>
    <span style={{position: 'absolute', left: 214, top: 104, fontWeight: 900, fontSize: 72, color: '#8C8C8C', letterSpacing: 1, lineHeight: 1}}>LEDGER</span>
    <div style={{position: 'absolute', left: 352, top: 6, width: 5, height: 188, background: RED}} />
  </div>
);

// Full-frame still used to export the logo to a transparent PNG.
export const LogoStill: React.FC = () => (
  <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
    <HardLedgerLogo />
  </AbsoluteFill>
);
