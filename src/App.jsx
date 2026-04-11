import React, { useEffect, useRef, useState, useCallback } from 'react';

// --- ASSET LOADER ---
const ASSETS = {
  enemy0: "data:image/svg+xml,%3Csvg viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23f0f' d='M6 0h4v2H6zm-2 2h8v2H4zm-2 2h12v2H2zM0 6h16v2H0zm0 2h4v2H0zm12 0h4v2h-4zm-8 2h8v2H4zm-2 2h4v2H2zm8 0h4v2h-4z'/%3E%3Cpath fill='%230ff' d='M4 6h2v2H4zm6 0h2v2h-2z'/%3E%3C/svg%3E",
  enemy1: "data:image/svg+xml,%3Csvg viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23f00' d='M6 0h4v2H6zm-4 2h12v2H2zm-2 2h16v4H0zm2 4h2v2H2zm10 0h2v2h-2zm-6 2h4v2H6zm-4 2h2v2H2zm10 0h2v2h-2z'/%3E%3Cpath fill='%23ff0' d='M4 4h2v2H4zm6 0h2v2h-2zm-2 4h2v2H8z'/%3E%3C/svg%3E",
  enemy2: "data:image/svg+xml,%3Csvg viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%230f0' d='M4 0h8v2H4zm-2 2h12v2H2zM0 4h16v4H0zm4 4h8v2H4zm-4 2h2v2H0zm14 0h2v2h-2zm-8 2h4v2H6z'/%3E%3Cpath fill='%23fff' d='M4 4h2v2H4zm6 0h2v2h-2z'/%3E%3C/svg%3E"
};

// --- Offline Audio Sequencer for BGM Tracks ---
const buildTracks = async (actx) => {
  const sr = actx.sampleRate;
  const WAudioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  
  const playSnare = (ctx, time, dest) => {
    let noiseBuf = ctx.createBuffer(1, sr * 0.5, sr);
    let nData = noiseBuf.getChannelData(0);
    for (let i = 0; i < nData.length; i++) nData[i] = Math.random() * 2 - 1;
    let nSrc = ctx.createBufferSource(); nSrc.buffer = noiseBuf;
    let nFilter = ctx.createBiquadFilter(); nFilter.type = 'bandpass'; nFilter.frequency.value = 1500;
    let nGain = ctx.createGain(); nGain.gain.setValueAtTime(0.3, time); nGain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);
    nSrc.connect(nFilter).connect(nGain).connect(dest); nSrc.start(time); nSrc.stop(time + 0.15);
  };

  // ---------------- GALAGA TRACKS ----------------
  const o1 = new WAudioContext(1, 8 * sr, sr);
  for(let i=0; i<32; i++) {
    let t = i * 0.25;
    let osc = o1.createOscillator(); osc.type = 'triangle';
    osc.frequency.value = [130.81, 155.56, 196.00, 233.08][i%4] * (i%8 < 4 ? 1 : 1.5);
    let gain = o1.createGain(); gain.gain.setValueAtTime(0.05, t); gain.gain.exponentialRampToValueAtTime(0.001, t+0.2);
    osc.connect(gain).connect(o1.destination); osc.start(t); osc.stop(t+0.2);
  }
  const galagaStartBuf = await o1.startRendering();

  const o2 = new WAudioContext(1, 64 * sr, sr);
  const galagaSections = [
    { bass: 32.70, pad: [130.81, 155.56, 196.00], arp: [261.63, 311.13, 392.00, 523.25] },
    { bass: 25.96, pad: [103.83, 130.81, 155.56], arp: [207.65, 261.63, 311.13, 415.30] },
    { bass: 43.65, pad: [87.31,  103.83, 130.81], arp: [174.61, 207.65, 261.63, 349.23] },
    { bass: 49.00, pad: [98.00,  123.47, 146.83], arp: [196.00, 246.94, 293.66, 392.00] }
  ];
  for(let beat=0; beat<128; beat++) {
    let t = beat * 0.5; let sec = galagaSections[Math.floor(beat / 32)];
    let k = o2.createOscillator(); k.type = 'square'; k.frequency.setValueAtTime(100, t); k.frequency.exponentialRampToValueAtTime(10, t+0.1);
    let kg = o2.createGain(); kg.gain.setValueAtTime(0.4, t); kg.gain.linearRampToValueAtTime(0.01, t+0.1);
    k.connect(kg).connect(o2.destination); k.start(t); k.stop(t+0.1);
    if (beat % 4 === 0) {
      sec.pad.forEach(freq => {
        let p = o2.createOscillator(); p.type = 'sine'; p.frequency.value = freq;
        let pg = o2.createGain(); pg.gain.setValueAtTime(0, t); pg.gain.linearRampToValueAtTime(0.05, t + 0.5); pg.gain.setValueAtTime(0.05, t + 1.5); pg.gain.linearRampToValueAtTime(0, t + 2.0); 
        p.connect(pg).connect(o2.destination); p.start(t); p.stop(t+2.0);
      });
    }
    for(let step=0; step<4; step++) {
      let bt = t + step * 0.125; let b = o2.createOscillator(); b.type = 'triangle'; let freq = sec.bass; 
      if (step === 2 && beat % 2 === 0) freq *= 2; b.frequency.value = freq;
      let bg = o2.createGain(); bg.gain.setValueAtTime(0.18, bt); bg.gain.exponentialRampToValueAtTime(0.01, bt+0.1);
      b.connect(bg).connect(o2.destination); b.start(bt); b.stop(bt+0.1);
    }
    for(let step=0; step<2; step++) {
      let bt = t + step * 0.25; let m = o2.createOscillator(); m.type = 'sawtooth'; let arpIdx = (Math.floor(beat/32) % 2 === 0) ? ((beat * 2 + step) % 4) : (3 - ((beat * 2 + step) % 4));
      m.frequency.value = sec.arp[arpIdx]; let mg = o2.createGain(); mg.gain.setValueAtTime(0.04, bt); mg.gain.exponentialRampToValueAtTime(0.001, bt+0.2);
      m.connect(mg).connect(o2.destination); m.start(bt); m.stop(bt+0.2);
    }
  }
  const galagaPlayBuf = await o2.startRendering();

  const ow = new WAudioContext(1, 16 * sr, sr);
  for(let beat=0; beat<32; beat++) {
    let t = beat * 0.5; let k = ow.createOscillator(); k.type = 'square'; k.frequency.setValueAtTime(120, t); k.frequency.exponentialRampToValueAtTime(15, t+0.1);
    let kg = ow.createGain(); kg.gain.setValueAtTime(0.4, t); kg.gain.linearRampToValueAtTime(0.01, t+0.1); k.connect(kg).connect(ow.destination); k.start(t); k.stop(t+0.1);
    for(let step=0; step<8; step++) {
      let bt = t + step * 0.0625; let s = ow.createOscillator(); s.type = 'sine'; s.frequency.value = [523.25, 659.25, 783.99, 1046.50][step%4] * (beat%2===0?1:1.5);
      let sg = ow.createGain(); sg.gain.setValueAtTime(0.05, bt); sg.gain.exponentialRampToValueAtTime(0.001, bt+0.05); s.connect(sg).connect(ow.destination); s.start(bt); s.stop(bt+0.05);
    }
  }
  const galagaWarpBuf = await ow.startRendering();

  const o3 = new WAudioContext(1, 4 * sr, sr);
  for(let i=0; i<8; i++) {
    let t = i * 0.3; let osc = o3.createOscillator(); osc.type = 'sawtooth'; osc.frequency.setValueAtTime(150 - i*15, t);
    let gain = o3.createGain(); gain.gain.setValueAtTime(0.2, t); gain.gain.linearRampToValueAtTime(0.01, t+0.4); osc.connect(gain).connect(o3.destination); osc.start(t); osc.stop(t+0.4);
  }
  const galagaOverBuf = await o3.startRendering();

  // ---------------- COMMANDO TRACKS ----------------
  const c1 = new WAudioContext(1, 8 * sr, sr);
  for(let i=0; i<16; i++) {
    let t = i * 0.5; let a = c1.createOscillator(); a.type = 'sine'; a.frequency.setValueAtTime(65.41, t); 
    let ag = c1.createGain(); ag.gain.setValueAtTime(0.3, t); ag.gain.exponentialRampToValueAtTime(0.01, t+0.4); a.connect(ag).connect(c1.destination); a.start(t); a.stop(t+0.4);
    playSnare(c1, t, c1.destination);
    if (i%4===3) { playSnare(c1, t+0.25, c1.destination); playSnare(c1, t+0.375, c1.destination); }
  }
  const commandoStartBuf = await c1.startRendering();

  const c2 = new WAudioContext(1, 64 * sr, sr);
  const cmdSections = [ { root: 65.41, chords: [130.81, 155.56, 196.00] }, { root: 65.41, chords: [130.81, 155.56, 196.00] }, { root: 51.91, chords: [103.83, 130.81, 155.56] }, { root: 58.27, chords: [116.54, 146.83, 174.61] } ];
  for(let beat=0; beat<128; beat++) {
    let t = beat * 0.5; let sec = cmdSections[Math.floor(beat / 32)]; const marchPattern = [1, 0, 0, 1, 1, 0, 1, 0];
    for(let step=0; step<2; step++) {
      let bt = t + step * 0.25; let patIdx = (beat * 2 + step) % 8;
      if (marchPattern[patIdx] === 1) {
        let b = c2.createOscillator(); b.type = 'triangle'; b.frequency.value = sec.root;
        let bg = c2.createGain(); bg.gain.setValueAtTime(0.25, bt); bg.gain.exponentialRampToValueAtTime(0.01, bt+0.2); b.connect(bg).connect(c2.destination); b.start(bt); b.stop(bt+0.2);
      }
    }
    if (beat % 2 === 0) {
      sec.chords.forEach(freq => {
        let p = c2.createOscillator(); p.type = 'sawtooth'; p.frequency.value = freq;
        let pg = c2.createGain(); pg.gain.setValueAtTime(0.08, t); pg.gain.exponentialRampToValueAtTime(0.01, t + 0.4); p.connect(pg).connect(c2.destination); p.start(t); p.stop(t+0.4);
      });
      playSnare(c2, t, c2.destination);
    }
  }
  const commandoPlayBuf = await c2.startRendering();

  const c3 = new WAudioContext(1, 4 * sr, sr);
  const taps = [ { f: 261.63, d: 0.4, s: 0 }, { f: 349.23, d: 0.4, s: 0.5 }, { f: 440.00, d: 0.8, s: 1.0 }, { f: 261.63, d: 0.4, s: 2.0 }, { f: 349.23, d: 0.4, s: 2.5 }, { f: 440.00, d: 1.0, s: 3.0 } ];
  taps.forEach(n => {
    let osc = c3.createOscillator(); osc.type = 'square'; osc.frequency.value = n.f;
    let gain = c3.createGain(); gain.gain.setValueAtTime(0, n.s); gain.gain.linearRampToValueAtTime(0.1, n.s + 0.05); gain.gain.linearRampToValueAtTime(0.01, n.s + n.d - 0.05);
    osc.connect(gain).connect(c3.destination); osc.start(n.s); osc.stop(n.s + n.d);
  });
  const commandoOverBuf = await c3.startRendering();

  // ---------------- SNAKE TRACKS ----------------
  const s1 = new WAudioContext(1, 4 * sr, sr);
  for(let i=0; i<16; i++) {
    let t = i * 0.15; let osc = s1.createOscillator(); osc.type = 'square'; osc.frequency.value = 220 * Math.pow(1.059463094359, i); 
    let gain = s1.createGain(); gain.gain.setValueAtTime(0.05, t); gain.gain.exponentialRampToValueAtTime(0.001, t+0.1); osc.connect(gain).connect(s1.destination); osc.start(t); osc.stop(t+0.1);
  }
  const snakeStartBuf = await s1.startRendering();

  const s2 = new WAudioContext(1, 32 * sr, sr);
  for(let beat=0; beat<128; beat++) {
     let t = beat * 0.25; let osc = s2.createOscillator(); osc.type = 'triangle'; let notes = [110, 110, 220, 110, 130.81, 130.81, 261.63, 130.81]; osc.frequency.value = notes[beat % 8];
     let gain = s2.createGain(); gain.gain.setValueAtTime(0.2, t); gain.gain.exponentialRampToValueAtTime(0.01, t+0.2); osc.connect(gain).connect(s2.destination); osc.start(t); osc.stop(t+0.2);
     if (beat % 2 === 0) {
       let m = s2.createOscillator(); m.type = 'square'; m.frequency.value = notes[(beat+2)%8] * 2;
       let mg = s2.createGain(); mg.gain.setValueAtTime(0.05, t); mg.gain.exponentialRampToValueAtTime(0.001, t+0.1); m.connect(mg).connect(s2.destination); m.start(t); m.stop(t+0.1);
     }
  }
  const snakePlayBuf = await s2.startRendering();

  const s3 = new WAudioContext(1, 2 * sr, sr);
  let s3Osc = s3.createOscillator(); s3Osc.type = 'sawtooth'; s3Osc.frequency.setValueAtTime(150, 0); s3Osc.frequency.exponentialRampToValueAtTime(10, 1.0);
  let s3Gain = s3.createGain(); s3Gain.gain.setValueAtTime(0.2, 0); s3Gain.gain.linearRampToValueAtTime(0.01, 1.0); s3Osc.connect(s3Gain).connect(s3.destination); s3Osc.start(0); s3Osc.stop(1.0);
  let snBuf = s3.createBuffer(1, sr, sr); let snDat = snBuf.getChannelData(0); for(let i=0; i<sr; i++) snDat[i] = Math.random()*2-1;
  let snSrc = s3.createBufferSource(); snSrc.buffer = snBuf; let snGain = s3.createGain(); snGain.gain.setValueAtTime(0.2, 0); snGain.gain.exponentialRampToValueAtTime(0.01, 1.0); snSrc.connect(snGain).connect(s3.destination); snSrc.start(0);
  const snakeOverBuf = await s3.startRendering();

  // ---------------- DRIVE TRACKS (32-bar synthwave looping track) ----------------
  const d1 = new WAudioContext(1, 4 * sr, sr);
  let drvRev = d1.createOscillator(); drvRev.type = 'sawtooth'; drvRev.frequency.setValueAtTime(50, 0); drvRev.frequency.exponentialRampToValueAtTime(250, 3.5);
  let drvGain = d1.createGain(); drvGain.gain.setValueAtTime(0.1, 0); drvGain.gain.linearRampToValueAtTime(0, 4.0);
  drvRev.connect(drvGain).connect(d1.destination); drvRev.start(0); drvRev.stop(4.0);
  const driveStartBuf = await d1.startRendering();

  const d2 = new WAudioContext(1, 64 * sr, sr);
  const driveChordsMain = [ [110.00, 130.81, 164.81], [87.31, 110.00, 130.81], [65.41, 82.41, 98.00], [98.00, 123.47, 146.83] ];
  const driveChordsChorus = [ [73.42, 87.31, 110.00], [110.00, 130.81, 164.81], [82.41, 98.00, 123.47], [110.00, 130.81, 164.81] ];
  for (let beat = 0; beat < 128; beat++) {
      let t = beat * 0.5;
      let barIndex = Math.floor(beat / 4);
      let isChorus = barIndex >= 24;
      let chordSet = isChorus ? driveChordsChorus : driveChordsMain;
      let chordIdx = Math.floor((barIndex % 8) / 2);
      let freqs = chordSet[chordIdx];
      
      for (let step = 0; step < 4; step++) {
          let bt = t + step * 0.125;
          let b = d2.createOscillator(); b.type = 'sawtooth'; b.frequency.value = freqs[0] / 2; 
          let bg = d2.createGain(); bg.gain.setValueAtTime(0.15, bt); bg.gain.exponentialRampToValueAtTime(0.01, bt+0.1);
          let filter = d2.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.setValueAtTime(800, bt); filter.frequency.exponentialRampToValueAtTime(100, bt+0.1);
          b.connect(filter).connect(bg).connect(d2.destination); b.start(bt); b.stop(bt+0.1);
      }
      
      if (beat % 2 !== 0) {
          freqs.forEach(f => {
              let c = d2.createOscillator(); c.type = 'square'; c.frequency.value = f * (isChorus ? 2 : 1);
              let cg = d2.createGain(); cg.gain.setValueAtTime(0.05, t); cg.gain.exponentialRampToValueAtTime(0.01, t+0.4);
              c.connect(cg).connect(d2.destination); c.start(t); c.stop(t+0.4);
          });
          playSnare(d2, t, d2.destination);
      }
  }
  const drivePlayBuf = await d2.startRendering();

  const d3 = new WAudioContext(1, 4 * sr, sr);
  let crNoise = d3.createBuffer(1, sr * 4, sr);
  let crData = crNoise.getChannelData(0);
  for(let i=0; i<sr*4; i++) crData[i] = Math.random()*2-1;
  let crSrc = d3.createBufferSource(); crSrc.buffer = crNoise;
  let crFilter = d3.createBiquadFilter(); crFilter.type = 'lowpass'; crFilter.frequency.setValueAtTime(1000, 0); crFilter.frequency.exponentialRampToValueAtTime(100, 3);
  let crGain = d3.createGain(); crGain.gain.setValueAtTime(0.5, 0); crGain.gain.exponentialRampToValueAtTime(0.01, 3);
  crSrc.connect(crFilter).connect(crGain).connect(d3.destination); crSrc.start();
  const driveOverBuf = await d3.startRendering();

  return { 
    galagaStart: galagaStartBuf, galagaPlay: galagaPlayBuf, galagaWarp: galagaWarpBuf, galagaOver: galagaOverBuf,
    commandoStart: commandoStartBuf, commandoPlay: commandoPlayBuf, commandoOver: commandoOverBuf,
    snakeStart: snakeStartBuf, snakePlay: snakePlayBuf, snakeOver: snakeOverBuf,
    driveStart: driveStartBuf, drivePlay: drivePlayBuf, driveOver: driveOverBuf
  };
};

// --- HELPER CRT TEXT DRAWING ---
const drawCRTText = (ctx, text, x, y, color, font, align = 'center') => {
  ctx.font = font; ctx.textAlign = align;
  ctx.fillStyle = 'rgba(255, 0, 255, 0.5)'; ctx.shadowBlur = 0; ctx.fillText(text, x - 1, y);
  ctx.fillStyle = 'rgba(0, 255, 255, 0.5)'; ctx.fillText(text, x + 1, y);
  ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 12; ctx.fillText(text, x, y);
  ctx.shadowBlur = 0;
};

// --- MENU COMPONENT ---
const GameMenu = ({ onSelect }) => {
  const canvasRef = useRef(null);
  const selectedIndex = useRef(0);

  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'ArrowUp' || e.key === 'w') {
          selectedIndex.current = (selectedIndex.current - 1 + 4) % 4;
      }
      if (e.key === 'ArrowDown' || e.key === 's') {
          selectedIndex.current = (selectedIndex.current + 1) % 4;
      }
      if (e.key === 'Enter') {
          const games = ['galaga', 'commando', 'snake', 'drive'];
          onSelect(games[selectedIndex.current]);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSelect]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawCRTText(ctx, "SELECT SYSTEM", 400, 100, '#fff', '60px "VT323", monospace');
      
      const opts = [
          { text: "> BASS SPACE ADVENTURES", color: '#0f0', y: 220 },
          { text: "> BASS COMMANDO", color: '#0ff', y: 280 },
          { text: "> BASS SNAKE", color: '#fa0', y: 340 },
          { text: "> BASS TURBO", color: '#f0f', y: 400 }
      ];

      opts.forEach((opt, idx) => {
          drawCRTText(ctx, opt.text, 400, opt.y, selectedIndex.current === idx ? opt.color : '#555', '40px "VT323", monospace');
      });

      if (Math.floor(Date.now() / 500) % 2 === 0) {
        drawCRTText(ctx, "PRESS ENTER", 400, 520, '#fff', '24px "VT323", monospace');
      }
    };

    const loop = () => {
      draw();
      animationFrameId = requestAnimationFrame(loop);
    };
    loop();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-auto bg-transparent">
      <canvas ref={canvasRef} width={800} height={600} className="w-full h-full object-fill bg-transparent" />
    </div>
  );
};

// --- BASS TURBO (DRIVING SIMULATOR) ---
const DriveGame = ({ audioCtx, onMenu }) => {
  const canvasRef = useRef(null);
  
  const state = useRef({
    status: 'start', 
    score: 0,
    highScore: 0,
    wave: 1,
    speed: 0,
    maxSpeed: 40,
    trackZ: 0,
    playerX: 400,
    objects: [],
    levelTimer: 0,
    noCrashTimer: 0,
    lives: 1,
    nextExtraLifeMin: 5,
    trafficLight: 'red',
    transitionTimer: 0
  });

  const keys = useRef({});

  useEffect(() => {
    const handleKeyDown = e => { 
        keys.current[e.key] = true; 
        if (e.code) keys.current[e.code] = true;
    };
    const handleKeyUp = e => { 
        keys.current[e.key] = false; 
        if (e.code) keys.current[e.code] = false;
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const playCrash = () => {
      if (!audioCtx || audioCtx.state !== 'running') return;
      const t0 = audioCtx.currentTime;
      let osc = audioCtx.createOscillator(); osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, t0); osc.frequency.exponentialRampToValueAtTime(10, t0+0.5);
      let gain = audioCtx.createGain(); gain.gain.setValueAtTime(0.5, t0); gain.gain.exponentialRampToValueAtTime(0.01, t0+0.5);
      osc.connect(gain).connect(audioCtx.destination); osc.start(t0); osc.stop(t0+0.5);
      
      let noiseBuf = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.5, audioCtx.sampleRate);
      let nData = noiseBuf.getChannelData(0);
      for(let i=0; i<nData.length; i++) nData[i] = Math.random()*2-1;
      let nSrc = audioCtx.createBufferSource(); nSrc.buffer = noiseBuf;
      let nFilter = audioCtx.createBiquadFilter(); nFilter.type = 'lowpass'; nFilter.frequency.setValueAtTime(800, t0);
      let nGain = audioCtx.createGain(); nGain.gain.setValueAtTime(0.5, t0); nGain.gain.exponentialRampToValueAtTime(0.01, t0+0.5);
      nSrc.connect(nFilter).connect(nGain).connect(audioCtx.destination); nSrc.start(t0);
    };

    const playExtraLife = () => {
      if (!audioCtx || audioCtx.state !== 'running') return;
      const t0 = audioCtx.currentTime;
      [659.25, 880, 1318.51].forEach((f, i) => {
         let osc = audioCtx.createOscillator(); osc.type = 'square'; osc.frequency.value = f;
         let gain = audioCtx.createGain(); gain.gain.setValueAtTime(0.1, t0 + i*0.1); gain.gain.linearRampToValueAtTime(0, t0 + i*0.1 + 0.1);
         osc.connect(gain).connect(audioCtx.destination); osc.start(t0 + i*0.1); osc.stop(t0 + i*0.1 + 0.1);
      });
    };

    const spawnObjects = (gs) => {
        let count = Math.floor(Math.random() * (2 + gs.wave));
        for (let i = 0; i < count; i++) {
            let isObstacle = Math.random() < (0.3 + gs.wave * 0.05);
            let type = isObstacle ? (Math.random() < 0.5 ? 'car' : 'moto') : (Math.random() < 0.6 ? 'tree' : 'house');
            
            let xOffset = 0;
            if (isObstacle) {
                // Road bounds: 200 to 600. Obstacles spawn slightly inside edges.
                xOffset = 220 + Math.random() * 360; 
            } else {
                // Scenery outside the road bounds
                xOffset = Math.random() > 0.5 ? (640 + Math.random() * 100) : (60 + Math.random() * 100);
            }
            
            gs.objects.push({
                y: -100 - Math.random() * 800,
                x: xOffset,
                type: type,
                w: isObstacle ? (type === 'car' ? 40 : 20) : (type === 'tree' ? 40 : 80),
                h: isObstacle ? (type === 'car' ? 80 : 40) : (type === 'tree' ? 40 : 80),
                baseSpeed: isObstacle ? (5 + Math.random() * 10) : 0
            });
        }
    };

    const formatScore = (s) => String(s).padStart(6, '0');
    const formatTime = (frames) => {
        let s = Math.floor(frames / 60);
        let m = Math.floor(s / 60);
        return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    };

    const draw = () => {
      let gs = state.current;
      
      // Base background fill
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (gs.status === 'start') {
        drawCRTText(ctx, "BASS TURBO", 400, 200, '#f0f', '60px "VT323", monospace');
        drawCRTText(ctx, "NEON HIGHWAY SIMULATOR", 400, 260, '#fff', '30px "VT323", monospace');
        drawCRTText(ctx, "PRESS ENTER TO START", 400, 360, '#fff', '24px "VT323", monospace');
        drawCRTText(ctx, "PRESS M FOR MENU", 400, 400, '#fff', '20px "VT323", monospace');
        drawCRTText(ctx, "WASD/ARROWS: Steer  |  NUMPAD +: Gas  |  NUMPAD 0: Brake", 400, 460, '#fff', '20px "VT323", monospace');
        return;
      }

      // Draw Outer Road Lines
      ctx.strokeStyle = '#ff0'; 
      ctx.lineWidth = 4;
      ctx.shadowColor = '#ff0';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(200, 0); ctx.lineTo(200, 600);
      ctx.moveTo(600, 0); ctx.lineTo(600, 600);
      ctx.stroke();

      // Draw Center Dashed Line (Animated)
      ctx.setLineDash([40, 40]);
      ctx.lineDashOffset = -gs.trackZ;
      ctx.beginPath();
      ctx.moveTo(400, 0); ctx.lineTo(400, 600);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.shadowBlur = 0;

      // Draw Objects (Top down, single color retro shapes)
      gs.objects.forEach(obj => {
          if (obj.type === 'tree') {
              ctx.fillStyle = '#0f0'; ctx.shadowColor = '#0f0';
          } else if (obj.type === 'house') {
              ctx.fillStyle = '#00f'; ctx.shadowColor = '#00f';
          } else if (obj.type === 'car') {
              ctx.fillStyle = '#f0f'; ctx.shadowColor = '#f0f';
          } else if (obj.type === 'moto') {
              ctx.fillStyle = '#0ff'; ctx.shadowColor = '#0ff';
          }
          ctx.shadowBlur = 10;
          ctx.fillRect(obj.x - obj.w/2, obj.y - obj.h/2, obj.w, obj.h);
          ctx.shadowBlur = 0;
      });

      // Intersection / Cross Traffic Transition Layer
      if (gs.status === 'transition_red' || gs.status === 'transition_green') {
          // Intersection road
          ctx.fillStyle = '#111';
          ctx.fillRect(0, 150, 800, 100);
          ctx.strokeStyle = '#ff0'; ctx.shadowColor = '#ff0'; ctx.shadowBlur = 10;
          ctx.beginPath(); ctx.moveTo(0, 150); ctx.lineTo(800, 150); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(0, 250); ctx.lineTo(800, 250); ctx.stroke();
          ctx.shadowBlur = 0;

          // Cross traffic
          if (gs.trafficLight === 'red') {
               let ctOffset = (Date.now() / 5) % 1200;
               ctx.fillStyle = '#0ff'; ctx.shadowColor = '#0ff'; ctx.shadowBlur = 10;
               ctx.fillRect(ctOffset - 200, 180, 80, 40);
               ctx.fillStyle = '#f0f'; ctx.shadowColor = '#f0f'; ctx.shadowBlur = 10;
               ctx.fillRect(1000 - ctOffset, 180, 60, 40);
               ctx.shadowBlur = 0;
          }

          // Traffic Light Post
          ctx.fillStyle = '#222'; ctx.fillRect(350, 50, 100, 250);
          
          ctx.fillStyle = gs.trafficLight === 'red' ? '#f00' : '#300';
          ctx.shadowColor = '#f00'; ctx.shadowBlur = gs.trafficLight === 'red' ? 30 : 0;
          ctx.beginPath(); ctx.arc(400, 90, 30, 0, Math.PI*2); ctx.fill();

          ctx.fillStyle = gs.trafficLight === 'amber' ? '#fa0' : '#320';
          ctx.shadowColor = '#fa0'; ctx.shadowBlur = gs.trafficLight === 'amber' ? 30 : 0;
          ctx.beginPath(); ctx.arc(400, 170, 30, 0, Math.PI*2); ctx.fill();

          ctx.fillStyle = gs.trafficLight === 'green' ? '#0f0' : '#030';
          ctx.shadowColor = '#0f0'; ctx.shadowBlur = gs.trafficLight === 'green' ? 30 : 0;
          ctx.beginPath(); ctx.arc(400, 250, 30, 0, Math.PI*2); ctx.fill();
          ctx.shadowBlur = 0;

          if (gs.trafficLight === 'green') {
             drawCRTText(ctx, "LEVEL UP", 400, 400, '#0f0', '60px "VT323", monospace');
          }
      }

      // Draw Player Car
      if (gs.status === 'playing' || gs.status === 'transition_red') {
          ctx.fillStyle = '#f00';
          ctx.shadowColor = '#f00';
          ctx.shadowBlur = 15;
          ctx.fillRect(gs.playerX - 20, 460, 40, 80);
          ctx.shadowBlur = 0;
      }

      // UI
      drawCRTText(ctx, `SCORE: ${formatScore(gs.score)}`, 20, 30, '#fff', '24px "VT323", monospace', 'left');
      drawCRTText(ctx, `LIVES: ${gs.lives}`, 400, 30, '#fff', '24px "VT323", monospace');
      drawCRTText(ctx, `SPEED: ${Math.floor(gs.speed)} MPH`, 680, 30, '#0ff', '24px "VT323", monospace', 'right');
      drawCRTText(ctx, `TIME: ${formatTime(gs.noCrashTimer)}`, 680, 60, '#fa0', '20px "VT323", monospace', 'right');
      
      if (gs.status === 'gameover') {
        ctx.fillStyle = 'rgba(0,0,0,0.8)'; ctx.fillRect(0,0,800,600);
        drawCRTText(ctx, "TOTALED", 400, 280, '#f00', '80px "VT323", monospace');
        drawCRTText(ctx, "PRESS ENTER TO RESTART", 400, 350, '#fff', '30px "VT323", monospace');
        drawCRTText(ctx, "PRESS M FOR MENU", 400, 400, '#fff', '24px "VT323", monospace');
      }
    };

    const update = () => {
      let gs = state.current;

      if (keys.current['m'] || keys.current['M']) {
        onMenu();
        return;
      }

      if (gs.status === 'start' && keys.current['Enter']) {
        gs.status = 'playing';
        window.dispatchEvent(new CustomEvent('bgmTrack', { detail: 'drivePlay' }));
      }

      if (gs.status === 'gameover' && keys.current['Enter']) {
        gs.score = 0; gs.wave = 1; gs.speed = 0; gs.maxSpeed = 40; gs.trackZ = 0; gs.playerX = 400;
        gs.objects = []; gs.levelTimer = 0; gs.noCrashTimer = 0; gs.lives = 1; gs.nextExtraLifeMin = 5;
        gs.status = 'playing';
        window.dispatchEvent(new CustomEvent('bgmTrack', { detail: 'drivePlay' }));
      }

      if (gs.status === 'transition_red') {
          gs.transitionTimer--;
          if (gs.transitionTimer <= 60) gs.trafficLight = 'amber';
          if (gs.transitionTimer <= 0) {
              gs.trafficLight = 'green';
              gs.status = 'transition_green';
              gs.transitionTimer = 60;
          }
          return;
      }

      if (gs.status === 'transition_green') {
          gs.transitionTimer--;
          if (gs.transitionTimer <= 0) {
              gs.status = 'playing';
              gs.wave++;
              gs.maxSpeed += 5; // Slight bump in speed
              gs.levelTimer = 0;
          }
      }

      if (gs.status === 'playing') {
          gs.levelTimer++;
          gs.noCrashTimer++;
          gs.score += Math.floor(gs.speed / 10);

          if (gs.levelTimer > 90 * 60) {
              gs.status = 'transition_red';
              gs.transitionTimer = 7 * 60; 
              gs.trafficLight = 'red';
              gs.speed = 0; 
          }

          let currentExtraLifeFrames = gs.nextExtraLifeMin * 60 * 60;
          if (gs.noCrashTimer > currentExtraLifeFrames) {
              gs.lives++;
              gs.nextExtraLifeMin += 15;
              playExtraLife();
          }

          // Acceleration and Braking
          if (keys.current['NumpadAdd'] || keys.current['+'] || keys.current['=']) {
              gs.speed += 0.5;
          } else if (keys.current['Numpad0'] || keys.current['0'] || keys.current['ArrowDown'] || keys.current['s']) {
              gs.speed -= 1.0;
          } else {
              gs.speed -= 0.1; // friction
          }
          gs.speed = Math.max(0, Math.min(gs.maxSpeed, gs.speed));

          // Steering (only allow steer if moving)
          if (gs.speed > 0) {
              let steer = 0;
              if (keys.current['ArrowLeft'] || keys.current['a']) steer = -10;
              if (keys.current['ArrowRight'] || keys.current['d']) steer = 10;
              gs.playerX += steer;
          }
          gs.playerX = Math.max(220, Math.min(580, gs.playerX));

          gs.trackZ += gs.speed;

          if (Math.random() < 0.02 + (gs.wave * 0.005) && gs.speed > 10) spawnObjects(gs);

          for (let i = gs.objects.length - 1; i >= 0; i--) {
              let obj = gs.objects[i];
              
              let moveSpeed = gs.speed;
              if (obj.type === 'car' || obj.type === 'moto') {
                  moveSpeed = gs.speed - obj.baseSpeed;
              }
              
              obj.y += moveSpeed;

              if (obj.y > 700 || obj.y < -1500) {
                  gs.objects.splice(i, 1);
                  continue;
              }

              // Collision Detection
              if (obj.type === 'car' || obj.type === 'moto') {
                  let px = gs.playerX - 20; let py = 460; let pw = 40; let ph = 80;
                  let ox = obj.x - obj.w/2; let oy = obj.y - obj.h/2;
                  
                  if (px < ox + obj.w && px + pw > ox && py < oy + obj.h && py + ph > oy) {
                      playCrash();
                      gs.lives--;
                      gs.speed = 0;
                      gs.noCrashTimer = 0;
                      gs.nextExtraLifeMin = 5; 
                      gs.objects.splice(i, 1);
                      if (gs.lives <= 0) {
                          gs.status = 'gameover';
                          window.dispatchEvent(new CustomEvent('bgmTrack', { detail: 'none' }));
                      }
                  }
              }
          }
      }
    };

    const loop = () => {
      update(); draw();
      animationFrameId = requestAnimationFrame(loop);
    };
    loop();

    return () => cancelAnimationFrame(animationFrameId);
  }, [audioCtx, onMenu]);

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-auto bg-transparent">
      <canvas ref={canvasRef} width={800} height={600} className="w-full h-full object-fill bg-transparent" />
    </div>
  );
};


// --- BASS SNAKE GAME COMPONENT ---
const SnakeGame = ({ audioCtx, onMenu }) => {
  const canvasRef = useRef(null);
  
  const state = useRef({
    status: 'start', 
    score: 0,
    highScore: 0,
    snake: [{x: 18, y: 12}, {x: 18, y: 13}, {x: 18, y: 14}],
    dir: {x: 0, y: -1},
    nextDir: {x: 0, y: -1},
    food: {x: 10, y: 10},
    tickCounter: 0,
    speed: 8 
  });

  const keys = useRef({});

  useEffect(() => {
    const handleKeyDown = e => { 
        keys.current[e.key] = true; 
        let sd = state.current.dir;
        let snd = state.current.nextDir;
        if ((e.key === 'ArrowUp' || e.key === 'w') && sd.y === 0) snd = {x: 0, y: -1};
        if ((e.key === 'ArrowDown' || e.key === 's') && sd.y === 0) snd = {x: 0, y: 1};
        if ((e.key === 'ArrowLeft' || e.key === 'a') && sd.x === 0) snd = {x: -1, y: 0};
        if ((e.key === 'ArrowRight' || e.key === 'd') && sd.x === 0) snd = {x: 1, y: 0};
        state.current.nextDir = snd;
    };
    const handleKeyUp = e => { keys.current[e.key] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const spawnFood = (gs) => {
        let newFood;
        while(true) {
            newFood = { x: Math.floor(Math.random() * 36), y: Math.floor(Math.random() * 24) };
            let conflict = gs.snake.some(s => s.x === newFood.x && s.y === newFood.y);
            if (!conflict) break;
        }
        gs.food = newFood;
    };

    const formatScore = (s) => String(s).padStart(6, '0');

    const draw = () => {
      let gs = state.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (gs.status === 'start') {
        drawCRTText(ctx, "BASS SNAKE", 400, 250, '#0f0', '60px "VT323", monospace');
        drawCRTText(ctx, "NOKIA CLASSIC MODULE", 400, 300, '#fff', '30px "VT323", monospace');
        drawCRTText(ctx, "PRESS ENTER TO START", 400, 380, '#fff', '24px "VT323", monospace');
        drawCRTText(ctx, "PRESS M FOR MENU", 400, 420, '#fff', '20px "VT323", monospace');
        return;
      }

      ctx.strokeStyle = '#0ff'; ctx.lineWidth = 4;
      ctx.shadowColor = '#0ff'; ctx.shadowBlur = 10;
      ctx.strokeRect(38, 78, 724, 484);
      ctx.shadowBlur = 0;

      if (Math.floor(Date.now() / 200) % 2 === 0) {
          ctx.fillStyle = '#f0f';
          ctx.shadowColor = '#f0f'; ctx.shadowBlur = 15;
          ctx.fillRect(40 + gs.food.x * 20, 80 + gs.food.y * 20, 20, 20);
          ctx.shadowBlur = 0;
      }

      gs.snake.forEach((s, i) => {
          ctx.fillStyle = i === 0 ? '#fff' : '#0f0'; 
          ctx.shadowColor = i === 0 ? '#fff' : '#0f0'; 
          ctx.shadowBlur = 15;
          ctx.fillRect(40 + s.x * 20, 80 + s.y * 20, 20, 20);
      });
      ctx.shadowBlur = 0;

      drawCRTText(ctx, `SCORE: ${formatScore(gs.score)}`, 40, 45, '#fff', '24px "VT323", monospace', 'left');
      drawCRTText(ctx, `HI-SCORE: ${formatScore(gs.highScore)}`, 400, 45, '#fff', '24px "VT323", monospace');
      
      if (gs.status === 'gameover') {
        ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(0,0,800,600);
        drawCRTText(ctx, "GAME OVER", 400, 280, '#f00', '80px "VT323", monospace');
        drawCRTText(ctx, "PRESS ENTER TO RESTART", 400, 350, '#fff', '30px "VT323", monospace');
        drawCRTText(ctx, "PRESS M FOR MENU", 400, 400, '#fff', '24px "VT323", monospace');
      }
    };

    const update = () => {
      let gs = state.current;

      if (keys.current['m'] || keys.current['M']) {
        onMenu();
        return;
      }

      if (gs.status === 'start' && keys.current['Enter']) {
        gs.status = 'playing';
        spawnFood(gs);
        window.dispatchEvent(new CustomEvent('bgmTrack', { detail: 'snakePlay' }));
      }

      if (gs.status === 'gameover' && keys.current['Enter']) {
        gs.score = 0; gs.speed = 8;
        gs.snake = [{x: 18, y: 12}, {x: 18, y: 13}, {x: 18, y: 14}];
        gs.dir = {x: 0, y: -1}; gs.nextDir = {x: 0, y: -1};
        spawnFood(gs);
        gs.status = 'playing';
        window.dispatchEvent(new CustomEvent('bgmTrack', { detail: 'snakePlay' }));
      }

      if (gs.status !== 'playing') return;

      gs.tickCounter++;
      if (gs.tickCounter >= gs.speed) {
          gs.tickCounter = 0;
          gs.dir = gs.nextDir;
          let head = gs.snake[0];
          let next = { x: head.x + gs.dir.x, y: head.y + gs.dir.y };

          if (next.x < 0 || next.x >= 36 || next.y < 0 || next.y >= 24) {
              gs.status = 'gameover';
              window.dispatchEvent(new CustomEvent('bgmTrack', { detail: 'snakeOver' }));
              return;
          }

          if (gs.snake.some(s => s.x === next.x && s.y === next.y)) {
              gs.status = 'gameover';
              window.dispatchEvent(new CustomEvent('bgmTrack', { detail: 'snakeOver' }));
              return;
          }

          gs.snake.unshift(next);

          if (next.x === gs.food.x && next.y === gs.food.y) {
              gs.score += 50;
              if (gs.score > gs.highScore) gs.highScore = gs.score;
              gs.speed = Math.max(3, 8 - Math.floor(gs.score / 500)); 
              spawnFood(gs);
          } else {
              gs.snake.pop();
          }
      }
    };

    const loop = () => {
      update(); draw();
      animationFrameId = requestAnimationFrame(loop);
    };
    loop();

    return () => cancelAnimationFrame(animationFrameId);
  }, [audioCtx, onMenu]);

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-auto bg-transparent">
      <canvas ref={canvasRef} width={800} height={600} className="w-full h-full object-fill bg-transparent" />
    </div>
  );
};

// --- BASS COMMANDO GAME COMPONENT ---
const CommandoGame = ({ audioCtx, onMenu }) => {
  const canvasRef = useRef(null);
  
  const state = useRef({
    status: 'start', 
    introTimer: 0,
    score: 0,
    highScore: 0,
    wave: 1,
    cities: [100, 220, 340, 460, 580, 700].map(x => ({ x, y: 550, alive: true })),
    crosshair: { x: 400, y: 300, speed: 8 },
    incoming: [],
    outgoing: [],
    explosions: [],
    lastShot: 0
  });

  const keys = useRef({});

  useEffect(() => {
    const handleKeyDown = e => { keys.current[e.key] = true; };
    const handleKeyUp = e => { keys.current[e.key] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const playAudio = (type) => {
      if (!audioCtx || audioCtx.state !== 'running') return;
      const t0 = audioCtx.currentTime;
      if (type === 'launch') {
        let osc = audioCtx.createOscillator(); osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, t0); osc.frequency.exponentialRampToValueAtTime(100, t0+0.3);
        let gain = audioCtx.createGain(); gain.gain.setValueAtTime(0.1, t0); gain.gain.exponentialRampToValueAtTime(0.01, t0+0.3);
        osc.connect(gain).connect(audioCtx.destination); osc.start(t0); osc.stop(t0+0.3);
      } else if (type === 'boom') {
        let bufSize = audioCtx.sampleRate * 0.4;
        let buf = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
        let data = buf.getChannelData(0);
        for(let i=0; i<bufSize; i++) data[i] = Math.random()*2-1;
        let noise = audioCtx.createBufferSource(); noise.buffer = buf;
        let gain = audioCtx.createGain(); gain.gain.setValueAtTime(0.3, t0); gain.gain.exponentialRampToValueAtTime(0.01, t0+0.4);
        noise.connect(gain).connect(audioCtx.destination); noise.start(t0);
      } else if (type === 'siren') {
        let osc = audioCtx.createOscillator(); osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1200, t0); 
        osc.frequency.linearRampToValueAtTime(1600, t0+1.0);
        osc.frequency.linearRampToValueAtTime(1200, t0+2.0);
        
        let lfo = audioCtx.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 5;
        let lfoGain = audioCtx.createGain(); lfoGain.gain.value = 20;
        lfo.connect(lfoGain).connect(osc.frequency);
        lfo.start(t0); lfo.stop(t0+2.0);

        let gain = audioCtx.createGain(); 
        gain.gain.setValueAtTime(0, t0); 
        gain.gain.linearRampToValueAtTime(0.15, t0+0.2);
        gain.gain.linearRampToValueAtTime(0.15, t0+1.8);
        gain.gain.linearRampToValueAtTime(0, t0+2.0);

        osc.connect(gain).connect(audioCtx.destination); 
        osc.start(t0); osc.stop(t0+2.0);
      }
    };

    const handleMouseMove = (e) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      state.current.crosshair.x = Math.max(0, Math.min(800, (e.clientX - rect.left) * scaleX));
      state.current.crosshair.y = Math.max(0, Math.min(520, (e.clientY - rect.top) * scaleY));
    };

    const handleMouseDown = (e) => {
      let gs = state.current;
      if (gs.status === 'playing' && Date.now() - gs.lastShot > 300) {
        gs.outgoing.push({
          sx: 400, sy: 580, tx: gs.crosshair.x, ty: gs.crosshair.y,
          x: 400, y: 580, progress: 0, speed: 0.05
        });
        gs.lastShot = Date.now();
        playAudio('launch');
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);

    const spawnWave = (wave) => {
      let count = 5 + wave * 3;
      let inc = [];
      for(let i=0; i<count; i++) {
        let sx = Math.random() * 800;
        let tx = Math.random() * 800;
        let aliveCities = state.current.cities.filter(c => c.alive);
        if (aliveCities.length > 0 && Math.random() > 0.3) {
          tx = aliveCities[Math.floor(Math.random() * aliveCities.length)].x + 20;
        }
        inc.push({
          sx, sy: 0, tx, ty: 550, x: sx, y: 0,
          speed: 0.002 + (Math.random() * 0.002) + (wave * 0.0005),
          progress: -(Math.random() * 2) 
        });
      }
      return inc;
    };

    const formatScore = (s) => String(s).padStart(6, '0');

    const draw = () => {
      let gs = state.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (gs.status === 'start') {
        drawCRTText(ctx, "BASS COMMANDO", 400, 250, '#0ff', '60px "VT323", monospace');
        drawCRTText(ctx, "DEFEND THE SECTOR", 400, 300, '#fff', '30px "VT323", monospace');
        drawCRTText(ctx, "PRESS ENTER TO START", 400, 380, '#fff', '24px "VT323", monospace');
        drawCRTText(ctx, "PRESS M FOR MENU", 400, 420, '#fff', '20px "VT323", monospace');
        drawCRTText(ctx, "MOUSE: Aim  |  CLICK: Shoot", 400, 470, '#fff', '20px "VT323", monospace');
        return;
      }

      if (gs.status === 'wave_intro') {
        if (Math.floor(Date.now() / 200) % 2 === 0) {
          drawCRTText(ctx, "WARNING", 400, 250, '#f00', '80px "VT323", monospace');
          drawCRTText(ctx, "INCOMING NUCLEAR STRIKE", 400, 320, '#f00', '40px "VT323", monospace');
        }
      }

      gs.cities.forEach(c => {
        if (c.alive) {
          ctx.fillStyle = '#0ff'; ctx.shadowColor = '#0ff'; ctx.shadowBlur = 10;
          ctx.fillRect(c.x, c.y, 40, 20);
          ctx.fillRect(c.x + 10, c.y - 10, 20, 10);
        } else {
          ctx.fillStyle = '#333'; ctx.shadowBlur = 0;
          ctx.fillRect(c.x, c.y + 10, 40, 10);
        }
      });
      ctx.shadowBlur = 0;

      ctx.strokeStyle = '#0f0'; ctx.lineWidth = 2; ctx.shadowColor = '#0f0'; ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(gs.crosshair.x - 10, gs.crosshair.y); ctx.lineTo(gs.crosshair.x + 10, gs.crosshair.y);
      ctx.moveTo(gs.crosshair.x, gs.crosshair.y - 10); ctx.lineTo(gs.crosshair.x, gs.crosshair.y + 10);
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = '#f0f'; ctx.lineWidth = 2; ctx.shadowColor = '#f0f'; ctx.shadowBlur = 8;
      gs.incoming.forEach(m => {
        if (m.progress > 0) {
          ctx.beginPath(); ctx.moveTo(m.sx, m.sy); ctx.lineTo(m.x, m.y); ctx.stroke();
          ctx.fillStyle = '#fff'; ctx.fillRect(m.x - 2, m.y - 2, 4, 4);
        }
      });
      ctx.shadowBlur = 0;

      ctx.strokeStyle = '#ff0'; ctx.lineWidth = 2; ctx.shadowColor = '#ff0'; ctx.shadowBlur = 8;
      gs.outgoing.forEach(m => {
        ctx.beginPath(); ctx.moveTo(m.sx, m.sy); ctx.lineTo(m.x, m.y); ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.fillRect(m.x - 2, m.y - 2, 4, 4);
      });
      ctx.shadowBlur = 0;

      gs.explosions.forEach(exp => {
        ctx.fillStyle = `rgba(255, 255, 255, ${exp.life / 60})`;
        ctx.shadowColor = '#0ff'; ctx.shadowBlur = 20;
        ctx.beginPath(); ctx.arc(exp.x, exp.y, exp.r, 0, Math.PI * 2); ctx.fill();
      });
      ctx.shadowBlur = 0;

      drawCRTText(ctx, `SCORE: ${formatScore(gs.score)}`, 20, 30, '#fff', '24px "VT323", monospace', 'left');
      drawCRTText(ctx, `WAVE: ${gs.wave}`, 400, 30, '#fff', '24px "VT323", monospace');
      
      if (gs.status === 'gameover') {
        ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(0,0,800,600);
        drawCRTText(ctx, "SYSTEM FAILURE", 400, 280, '#f00', '80px "VT323", monospace');
        drawCRTText(ctx, "PRESS ENTER TO RESTART", 400, 350, '#fff', '30px "VT323", monospace');
        drawCRTText(ctx, "PRESS M FOR MENU", 400, 400, '#fff', '24px "VT323", monospace');
      }

      if (gs.status === 'levelcleared') {
        ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(0,0,800,600);
        drawCRTText(ctx, `SECTOR ${gs.wave} SECURED`, 400, 280, '#0ff', '60px "VT323", monospace');
        drawCRTText(ctx, "PRESS ENTER TO CONTINUE", 400, 350, '#fff', '30px "VT323", monospace');
      }
    };

    const update = () => {
      let gs = state.current;

      if (keys.current['m'] || keys.current['M']) {
        onMenu();
        return;
      }

      if (gs.status === 'start' && keys.current['Enter']) {
        gs.status = 'wave_intro';
        gs.introTimer = 120;
        playAudio('siren');
        window.dispatchEvent(new CustomEvent('bgmTrack', { detail: 'none' }));
      }
      if (gs.status === 'gameover' && keys.current['Enter']) {
        gs.score = 0; gs.wave = 1;
        gs.cities.forEach(c => c.alive = true);
        gs.outgoing = []; gs.explosions = [];
        gs.status = 'wave_intro';
        gs.introTimer = 120;
        playAudio('siren');
        window.dispatchEvent(new CustomEvent('bgmTrack', { detail: 'none' }));
      }
      if (gs.status === 'levelcleared' && keys.current['Enter']) {
        gs.wave++;
        gs.outgoing = []; gs.explosions = [];
        gs.status = 'wave_intro';
        gs.introTimer = 120;
        playAudio('siren');
        window.dispatchEvent(new CustomEvent('bgmTrack', { detail: 'none' }));
      }

      if (gs.status === 'wave_intro') {
        gs.introTimer--;
        if (gs.introTimer <= 0) {
            gs.incoming = spawnWave(gs.wave);
            gs.status = 'playing';
            window.dispatchEvent(new CustomEvent('bgmTrack', { detail: 'commandoPlay' }));
        }
      }

      if (gs.status !== 'playing' && gs.status !== 'wave_intro') return;

      if (keys.current['ArrowLeft'] || keys.current['a']) gs.crosshair.x -= gs.crosshair.speed;
      if (keys.current['ArrowRight'] || keys.current['d']) gs.crosshair.x += gs.crosshair.speed;
      if (keys.current['ArrowUp'] || keys.current['w']) gs.crosshair.y -= gs.crosshair.speed;
      if (keys.current['ArrowDown'] || keys.current['s']) gs.crosshair.y += gs.crosshair.speed;
      gs.crosshair.x = Math.max(0, Math.min(800, gs.crosshair.x));
      gs.crosshair.y = Math.max(0, Math.min(520, gs.crosshair.y));

      if (keys.current[' '] && Date.now() - gs.lastShot > 300 && gs.status === 'playing') {
        gs.outgoing.push({
          sx: 400, sy: 580, tx: gs.crosshair.x, ty: gs.crosshair.y,
          x: 400, y: 580, progress: 0, speed: 0.05
        });
        gs.lastShot = Date.now();
        playAudio('launch');
      }

      for (let i = gs.outgoing.length - 1; i >= 0; i--) {
        let m = gs.outgoing[i];
        m.progress += m.speed;
        m.x = m.sx + (m.tx - m.sx) * m.progress;
        m.y = m.sy + (m.ty - m.sy) * m.progress;
        if (m.progress >= 1) {
          gs.explosions.push({ x: m.tx, y: m.ty, r: 0, maxR: 45, life: 60 });
          gs.outgoing.splice(i, 1);
          playAudio('boom');
        }
      }

      for (let i = gs.explosions.length - 1; i >= 0; i--) {
        let exp = gs.explosions[i];
        if (exp.life > 30) exp.r += (exp.maxR - exp.r) * 0.1;
        exp.life--;
        if (exp.life <= 0) gs.explosions.splice(i, 1);
      }

      for (let i = gs.incoming.length - 1; i >= 0; i--) {
        let m = gs.incoming[i];
        m.progress += m.speed;
        if (m.progress > 0) {
          m.x = m.sx + (m.tx - m.sx) * m.progress;
          m.y = m.sy + (m.ty - m.sy) * m.progress;
          
          let destroyed = false;
          for (let j = 0; j < gs.explosions.length; j++) {
            let exp = gs.explosions[j];
            let dist = Math.hypot(m.x - exp.x, m.y - exp.y);
            if (dist < exp.r) {
              destroyed = true; gs.score += 100;
              gs.explosions.push({ x: m.x, y: m.y, r: 0, maxR: 20, life: 30 });
              playAudio('boom');
              break;
            }
          }

          if (destroyed) { gs.incoming.splice(i, 1); continue; }

          if (m.progress >= 1) {
            gs.explosions.push({ x: m.x, y: m.y, r: 0, maxR: 30, life: 40 });
            playAudio('boom');
            gs.cities.forEach(c => {
              if (c.alive && Math.abs(c.x + 20 - m.x) < 30) c.alive = false;
            });
            gs.incoming.splice(i, 1);
          }
        }
      }

      let aliveCities = gs.cities.filter(c => c.alive).length;
      if (aliveCities === 0 && gs.status !== 'gameover') {
        gs.status = 'gameover';
        window.dispatchEvent(new CustomEvent('bgmTrack', { detail: 'commandoOver' }));
      } else if (gs.status === 'playing' && gs.incoming.length === 0 && gs.status !== 'levelcleared') {
        gs.status = 'levelcleared';
        gs.score += aliveCities * 500;
        window.dispatchEvent(new CustomEvent('bgmTrack', { detail: 'none' })); 
      }
    };

    const loop = () => {
      update(); draw();
      animationFrameId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
    };
  }, [audioCtx, onMenu]);

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-auto bg-transparent">
      <canvas ref={canvasRef} width={800} height={600} className="w-full h-full object-fill bg-transparent cursor-none" />
    </div>
  );
};

// --- SECRET GALAGA-STYLE GAME COMPONENT ---
const GalagaGame = ({ audioCtx, onMenu }) => {
  const canvasRef = useRef(null);
  
  const state = useRef({
    status: 'start', 
    respawnTimer: 0,
    introTimer: 0,
    warpTimer: 0,
    score: 0,
    highScore: 0,
    nextLifeScore: 150000,
    asteroidsMissed: 0,
    lives: 3,
    wave: 1,
    globalSpeed: 1.0,
    isAsteroidLevel: false,
    spaceHeldFrames: 0, 
    overdriveCount: 0,
    cooldownTimer: 0,
    player: { x: 388, y: 530, w: 24, h: 24, speed: 6, tilt: 0, thrust: 1 },
    bullets: [],
    enemyBullets: [],
    enemies: [],
    asteroids: [],
    particles: [],
    stars: Array(120).fill().map(() => {
      const isColored = Math.random() < 0.20; 
      const colors = [
        'rgba(0, 255, 255, 0.4)',   
        'rgba(255, 0, 255, 0.4)',   
        'rgba(255, 255, 0, 0.4)'    
      ];
      const starColor = isColored ? colors[Math.floor(Math.random() * colors.length)] : '#ffffff';
      return { 
        x: Math.random() * 800, 
        y: Math.random() * 600, 
        speed: (3 + Math.random() * 8) * 0.75, 
        color: starColor,
        isColored: isColored,
        shadow: isColored ? starColor : 'rgba(255, 255, 255, 0.5)',
        twinkleTimer: Math.random() * 100
      };
    }),
    lastShot: 0
  });

  const keys = useRef({});

  useEffect(() => {
    const handleKeyDown = e => { keys.current[e.key] = true; };
    const handleKeyUp = e => { keys.current[e.key] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const playShoot = () => {
      if (!audioCtx || audioCtx.state !== 'running') return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); 
      osc.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.1); 
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(); osc.stop(audioCtx.currentTime + 0.1);
    };

    const playEnemyShoot = () => {
      if (!audioCtx || audioCtx.state !== 'running') return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400, audioCtx.currentTime); 
      osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.15); 
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(); osc.stop(audioCtx.currentTime + 0.15);
    };

    const playExplode = () => {
      if (!audioCtx || audioCtx.state !== 'running') return;
      const bufferSize = audioCtx.sampleRate * 0.25;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
      noise.connect(gain).connect(audioCtx.destination);
      noise.start();
    };

    const playPlayerDeath = () => {
      if (!audioCtx || audioCtx.state !== 'running') return;
      const t0 = audioCtx.currentTime;
      
      let bufSize = audioCtx.sampleRate * 0.5;
      let buf = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
      let data = buf.getChannelData(0);
      for(let i=0; i<bufSize; i++) data[i] = Math.random()*2-1;
      let noise = audioCtx.createBufferSource(); noise.buffer = buf;
      let nFilter = audioCtx.createBiquadFilter(); nFilter.type = 'lowpass'; nFilter.frequency.value = 800;
      let nGain = audioCtx.createGain(); nGain.gain.setValueAtTime(0.5, t0); nGain.gain.exponentialRampToValueAtTime(0.01, t0+0.5);
      
      let delay = audioCtx.createDelay(); delay.delayTime.value = 0.15;
      let feedback = audioCtx.createGain(); feedback.gain.value = 0.4;
      delay.connect(feedback); feedback.connect(delay);
      
      noise.connect(nFilter).connect(nGain);
      nGain.connect(audioCtx.destination);
      nGain.connect(delay).connect(audioCtx.destination);
      noise.start(t0);
      
      let osc = audioCtx.createOscillator(); osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(100, t0); osc.frequency.exponentialRampToValueAtTime(10, t0+0.5);
      let oGain = audioCtx.createGain(); oGain.gain.setValueAtTime(0.4, t0); oGain.gain.exponentialRampToValueAtTime(0.01, t0+0.5);
      osc.connect(oGain).connect(audioCtx.destination);
      oGain.connect(delay);
      osc.start(t0); osc.stop(t0+0.5);
    };

    const playFanfare = () => {
      if (!audioCtx || audioCtx.state !== 'running') return;
      const t0 = audioCtx.currentTime;
      [440, 554.37, 659.25, 880].forEach((f, i) => {
         let osc = audioCtx.createOscillator(); osc.type = 'square'; osc.frequency.value = f;
         let gain = audioCtx.createGain(); gain.gain.setValueAtTime(0.1, t0 + i*0.1); gain.gain.linearRampToValueAtTime(0, t0 + i*0.1 + 0.1);
         osc.connect(gain).connect(audioCtx.destination); osc.start(t0 + i*0.1); osc.stop(t0 + i*0.1 + 0.1);
      });
    };

    const playWarpSound = () => {
      if (!audioCtx || audioCtx.state !== 'running') return;
      const t0 = audioCtx.currentTime;
      let osc = audioCtx.createOscillator(); osc.type = 'sine';
      osc.frequency.setValueAtTime(100, t0); osc.frequency.exponentialRampToValueAtTime(800, t0+1.5);
      let gain = audioCtx.createGain(); gain.gain.setValueAtTime(0.2, t0); gain.gain.linearRampToValueAtTime(0, t0+1.5);
      osc.connect(gain).connect(audioCtx.destination); osc.start(t0); osc.stop(t0+1.5);
    };

    const playAlarm = () => {
      if (!audioCtx || audioCtx.state !== 'running') return;
      const t0 = audioCtx.currentTime;
      let osc = audioCtx.createOscillator(); osc.type = 'square';
      osc.frequency.setValueAtTime(800, t0); osc.frequency.setValueAtTime(600, t0+0.15);
      let gain = audioCtx.createGain(); gain.gain.setValueAtTime(0.1, t0); gain.gain.setValueAtTime(0, t0+0.3);
      osc.connect(gain).connect(audioCtx.destination); osc.start(t0); osc.stop(t0+0.3);
    };

    const playExtraLife = () => {
      if (!audioCtx || audioCtx.state !== 'running') return;
      const t0 = audioCtx.currentTime;
      [659.25, 880, 1318.51].forEach((f, i) => {
         let osc = audioCtx.createOscillator(); osc.type = 'square'; osc.frequency.value = f;
         let gain = audioCtx.createGain(); gain.gain.setValueAtTime(0.1, t0 + i*0.1); gain.gain.linearRampToValueAtTime(0, t0 + i*0.1 + 0.1);
         osc.connect(gain).connect(audioCtx.destination); osc.start(t0 + i*0.1); osc.stop(t0 + i*0.1 + 0.1);
      });
    };

    const addScore = (gs, pts) => {
      gs.score += pts;
      if (gs.score > gs.highScore) gs.highScore = gs.score;
      if (gs.score >= gs.nextLifeScore) {
          gs.lives++;
          playExtraLife();
          if (gs.nextLifeScore === 150000) gs.nextLifeScore = 450000;
          else gs.nextLifeScore += 300000;
      }
    };

    const spawnWave = (waveNum) => {
      const arr = [];
      const rows = Math.min(6, 2 + waveNum);
      const cols = 12; 
      const spacingX = 40;
      const spacingY = 35;
      const offsetX = (800 - (cols * spacingX)) / 2;
      
      let idx = 0;
      let total = rows * cols;
      
      for(let r=0; r<rows; r++) {
        for(let c=0; c<cols; c++) {
          let group = Math.floor((idx / total) * 4); 
          
          let startX, startY, ctrlX, ctrlY;
          if (group === 0) { startX = -50; startY = 650; ctrlX = 200; ctrlY = 100; }
          else if (group === 1) { startX = 850; startY = -50; ctrlX = 400; ctrlY = 500; }
          else if (group === 2) { startX = -50; startY = -50; ctrlX = 400; ctrlY = 500; }
          else { startX = 850; startY = 650; ctrlX = 600; ctrlY = 100; }

          arr.push({ 
            x: startX, 
            y: startY, 
            w: 24, h: 24, 
            baseX: offsetX + c * spacingX, baseY: 40 + r * spacingY, 
            phase: Math.random() * Math.PI * 2,
            type: r % 4, 
            state: 'spawning',
            spawnDelay: group * 60 + Math.floor(c/2) * 10, 
            pathTimer: 0,
            startX, startY, ctrlX, ctrlY,
            attackTimer: 0,
            attackStartX: 0,
            attackStartY: 0
          });
          idx++;
        }
      }
      return arr;
    };

    const spawnAsteroids = (waveNum) => {
      let count = Math.floor((10 + waveNum * 2) * 0.98); 
      let asts = [];
      for (let i = 0; i < count; i++) {
          asts.push({
              x: Math.random() * 800,
              y: -50 - Math.random() * 1500, 
              vx: (Math.random() - 0.5) * 2,
              vy: 0.5 + Math.random() * 1.5,
              size: 3, 
              radius: 30,
              rotation: Math.random() * Math.PI * 2,
              rotSpeed: (Math.random() - 0.5) * 0.1,
              points: Array(8).fill(0).map(() => 0.6 + Math.random() * 0.4) 
          });
      }
      return asts;
    };

    if (state.current.enemies.length === 0 && state.current.asteroids.length === 0) {
       if (state.current.wave % 4 === 0) {
         state.current.isAsteroidLevel = true;
         state.current.asteroids = spawnAsteroids(state.current.wave);
       } else {
         state.current.enemies = spawnWave(state.current.wave);
       }
    }

    const fireEnemyBullet = (e, gs) => {
      let dx = gs.player.x + gs.player.w/2 - (e.x + e.w/2);
      let dy = gs.player.y + gs.player.h/2 - (e.y + e.h/2);
      if (dy <= 0) return; 

      let angle = Math.atan2(dy, dx);
      let centerAngle = Math.PI / 2; 
      let maxAngle = 20 * Math.PI / 180; 
      
      if (angle < centerAngle - maxAngle) angle = centerAngle - maxAngle;
      if (angle > centerAngle + maxAngle) angle = centerAngle + maxAngle;

      let speed = 4 + gs.wave * 0.5;
      gs.enemyBullets.push({
          x: e.x + e.w/2 - 2, y: e.y + e.h, w: 4, h: 10,
          vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed
      });
      playEnemyShoot();
    };

    const killPlayer = (gs) => {
      gs.lives--;
      gs.spaceHeldFrames = 0; 
      gs.cooldownTimer = 0;
      gs.overdriveCount = 0;
      playPlayerDeath();
      
      for(let p=0; p<40; p++) {
        gs.particles.push({
          x: gs.player.x + gs.player.w/2, y: gs.player.y + gs.player.h/2,
          vx: (Math.random()-0.5)*15, vy: (Math.random()-0.5)*15,
          life: 40
        });
      }
      gs.enemyBullets = []; 
      window.dispatchEvent(new CustomEvent('bgmTrack', { detail: 'none' })); 
      
      if (gs.lives <= 0) {
        gs.status = 'gameover';
      } else {
        gs.status = 'respawning';
        gs.respawnTimer = 180; 
        gs.enemies.forEach(e => { if(e.state === 'attacking') e.state = 'returning'; }); 
      }
    };

    const formatScore = (s) => String(s).padStart(6, '0');
    
    const getTwinkleColor = (s, isWarp) => {
      if (isWarp && Math.random() > 0.3) {
          const warpColors = ['rgba(0, 255, 255, 0.8)', 'rgba(255, 0, 255, 0.8)', 'rgba(255, 255, 0, 0.8)', '#ffffff'];
          let c = warpColors[Math.floor(Math.random() * warpColors.length)];
          return { c: c, shadow: 'rgba(255,255,255,0.8)' };
      }
      if (!s.isColored) return { c: '#ffffff', shadow: 'rgba(255,255,255,0.5)' };
      const colors = [
          {c: 'rgba(0, 255, 255, 0.6)', shadow: 'rgba(0, 255, 255, 0.8)'},   
          {c: 'rgba(255, 0, 255, 0.6)', shadow: 'rgba(255, 0, 255, 0.8)'},   
          {c: 'rgba(255, 255, 0, 0.6)', shadow: 'rgba(255, 255, 0, 0.8)'},
          {c: 'rgba(255, 0, 0, 0.6)', shadow: 'rgba(255, 0, 0, 0.8)'},
          {c: 'rgba(0, 255, 0, 0.6)', shadow: 'rgba(0, 255, 0, 0.8)'}
      ];
      let cIdx = Math.floor(s.twinkleTimer / 15) % colors.length;
      return colors[cIdx];
    };

    const draw = () => {
      let gs = state.current;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let isWarp = gs.globalSpeed > 2.0;

      gs.stars.forEach(s => { 
        s.twinkleTimer++;
        let tc = getTwinkleColor(s, isWarp);
        ctx.fillStyle = tc.c;
        ctx.shadowColor = tc.shadow;
        ctx.shadowBlur = (s.isColored || isWarp) ? 8 : 3;
        let size = (s.isColored || isWarp) ? 3 : 2;
        let stretch = isWarp ? s.speed * gs.globalSpeed * 0.5 : 0;
        ctx.fillRect(s.x, s.y, size, size + stretch); 
      });
      ctx.shadowBlur = 0;

      if (gs.status === 'start') {
        drawCRTText(ctx, "BASS SPACE ADVENTURES", 400, 250, '#0f0', '60px "VT323", monospace');
        drawCRTText(ctx, "CHRONICLES OF CAPTAIN MERK", 400, 300, '#fff', '30px "VT323", monospace');
        drawCRTText(ctx, "PRESS ENTER TO START", 400, 380, '#fff', '24px "VT323", monospace');
        drawCRTText(ctx, "PRESS M FOR MENU", 400, 460, '#fff', '20px "VT323", monospace');
        drawCRTText(ctx, "WASD/ARROWS: Move  |  SPACE: Shoot", 400, 500, '#fff', '20px "VT323", monospace');
        return;
      }

      if (gs.status === 'level_intro') {
          if (Math.floor(gs.introTimer / 15) % 2 === 0) {
              drawCRTText(ctx, "ENEMY ALERT", 400, 300, '#f00', '50px "VT323", monospace');
          }
      }

      let isOverdrive = gs.spaceHeldFrames > 60;
      let isCooldown = gs.cooldownTimer > 0;
      let playerVisible = (gs.status === 'playing' || gs.status === 'level_intro' || gs.status === 'warp_transition' || (gs.status === 'respawning' && gs.respawnTimer < 90));

      if (playerVisible) {
        ctx.save();
        let cx = gs.player.x + gs.player.w / 2;
        let cy = gs.player.y + gs.player.h / 2;
        let tilt = gs.player.tilt || 0;
        let thrust = gs.player.thrust !== undefined ? gs.player.thrust : 1;

        let roll = tilt * Math.PI / 4; 
        const p = (x, y) => {
            let z = x * Math.sin(roll);
            let x2 = x * Math.cos(roll);
            let scale = 35 / (35 + z); 
            return { x: x2 * scale, y: y * scale };
        };

        const poly = (pts, fill, stroke, shadow, blur) => {
            ctx.fillStyle = fill;
            ctx.shadowColor = shadow || 'transparent';
            ctx.shadowBlur = blur || 0;
            ctx.beginPath();
            pts.forEach((pt, i) => {
                let pr = p(pt[0], pt[1]);
                if (i===0) ctx.moveTo(pr.x, pr.y); else ctx.lineTo(pr.x, pr.y);
            });
            ctx.closePath();
            ctx.fill();
            if(stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
        };

        ctx.translate(cx, cy - 8); 

        if (isOverdrive && !isCooldown) {
            ctx.translate((Math.random() - 0.5)*4, (Math.random() - 0.5)*4);
        }

        const mainColor = isCooldown ? '#555' : '#fff';
        const gunColor = isCooldown ? '#333' : '#aaa';
        const redAccent = isCooldown ? '#400' : '#f05';
        const cyanAccent = isCooldown ? '#044' : '#0ff';
        const baseShadow = isOverdrive && !isCooldown ? '#f50' : '#fff';
        const baseBlur = isOverdrive && !isCooldown ? 20 : 8;

        poly([[-12, 3], [-12, -12], [-9, -12], [-9, 3]], gunColor);
        poly([[9, 3], [9, -12], [12, -12], [12, 3]], gunColor);

        if (!isCooldown) {
            poly([[-5, 18], [-1, 18], [-1, 22], [-5, 22]], '#ff0', null, '#ff0', 5);
            poly([[1, 18], [5, 18], [5, 22], [1, 22]], '#ff0', null, '#ff0', 5);

            let tLen = 22 + 10;
            let tCol = '#fa0';
            if (thrust > 1 || gs.status === 'warp_transition') { tLen = 22 + 18 + Math.random()*8; tCol = '#0ff'; } 
            if (thrust < 1) { tLen = 22 + 4 + Math.random()*3; tCol = '#f00'; } 

            poly([[-4, 22], [-2, 22], [-3, tLen]], tCol, null, tCol, 10);
            poly([[2, 22], [4, 22], [3, tLen]], tCol, null, tCol, 10);
        }

        poly([
            [0,-21], [3,-6], [14,3], [14,15], [5,10], [5,18],
            [-5,18], [-5,10], [-14,15], [-14,3], [-3,-6]
        ], mainColor, '#000', baseShadow, baseBlur);

        poly([[-10, 6], [-4, 9], [-4, 13], [-10, 12]], cyanAccent, null, cyanAccent, 8);
        poly([[4, 9], [10, 6], [10, 12], [4, 13]], redAccent, null, redAccent, 8);

        ctx.restore();
        
        if (isCooldown) {
            drawCRTText(ctx, "OVERHEATED", cx, cy - 25, '#f00', '14px "VT323", monospace');
        }
      }

      if (gs.status === 'warp_transition') {
        if (gs.isAsteroidLevel) {
          drawCRTText(ctx, `ASTEROID FIELD CLEARED!`, 400, 280, '#0f0', '60px "VT323", monospace');
        } else {
          drawCRTText(ctx, `WAVE ${gs.wave} CLEARED!`, 400, 280, '#0f0', '60px "VT323", monospace');
        }
      }

      if (gs.status === 'respawning' && gs.respawnTimer < 90) {
        drawCRTText(ctx, "READY", 400, 320, '#0f0', '40px "VT323", monospace');
      }

      if (gs.status === 'playing' || gs.status === 'respawning' || gs.status === 'level_intro') {
        if (gs.isAsteroidLevel) {
          ctx.strokeStyle = '#fa0';
          ctx.fillStyle = '#000';
          ctx.lineWidth = 2;
          ctx.shadowColor = '#fa0';
          ctx.shadowBlur = 10;
          gs.asteroids.forEach(a => {
              ctx.save();
              ctx.translate(a.x, a.y);
              ctx.rotate(a.rotation);
              ctx.beginPath();
              for (let i = 0; i < 8; i++) {
                  let angle = (i / 8) * Math.PI * 2;
                  let r = a.radius * a.points[i];
                  if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
                  else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
              }
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
              ctx.restore();
          });
          ctx.shadowBlur = 0;
        } else {
          gs.enemies.forEach(e => {
            if (e.state === 'spawning' && e.spawnDelay > 0) return; 
            
            ctx.save();
            ctx.translate(e.x + e.w/2, e.y + e.h/2);
            
            let tilt = Math.sin((Date.now()/500) + e.phase) * 0.3;
            if (e.state === 'attacking' || e.state === 'returning') {
                tilt = (e.x - e.baseX) * 0.005; 
                tilt = Math.max(-0.5, Math.min(0.5, tilt));
            }

            let roll = tilt * Math.PI / 4; 
            const p = (x, y) => {
                let z = x * Math.sin(roll);
                let x2 = x * Math.cos(roll);
                let scale = 25 / (25 + z); 
                return { x: x2 * scale, y: y * scale };
            };

            const poly = (pts, fill, shadow, blur) => {
                ctx.fillStyle = fill;
                ctx.shadowColor = shadow || 'transparent';
                ctx.shadowBlur = blur || 0;
                ctx.beginPath();
                pts.forEach((pt, i) => {
                    let pr = p(pt[0], pt[1]);
                    if (i===0) ctx.moveTo(pr.x, pr.y); else ctx.lineTo(pr.x, pr.y);
                });
                ctx.closePath();
                ctx.fill();
            };

            let color;
            if (e.type === 0) color = '#f0f';
            else if (e.type === 1) color = '#f00';
            else if (e.type === 2) color = '#0f0';
            else color = '#0ff'; 
            
            if (e.type === 0) { 
                poly([
                    [0,-10], [4,-4], [12,-6], [10,2], [6,8], [2,4], [0,10],
                    [-2,4], [-6,8], [-10,2], [-12,-6], [-4,-4]
                ], color, color, 12);
                poly([[-4,-2], [-2,0], [-4,2], [-6,0]], '#0ff', '#0ff', 5);
                poly([[4,-2], [6,0], [4,2], [2,0]], '#0ff', '#0ff', 5);
            } else if (e.type === 1) { 
                poly([
                    [-8,-8], [-4,-10], [4,-10], [8,-8], [12,-2], [10,6], [4,8], [2,4],
                    [-2,4], [-4,8], [-10,6], [-12,-2]
                ], color, color, 12);
                poly([[-12,2], [-16,6], [-14,10], [-10,8]], color, color, 8);
                poly([[12,2], [16,6], [14,10], [10,8]], color, color, 8);
                poly([[-4,0], [-2,2], [-4,4], [-6,2]], '#ff0', '#ff0', 5);
                poly([[4,0], [6,2], [4,4], [2,2]], '#ff0', '#ff0', 5);
            } else if (e.type === 2) { 
                poly([
                    [0,-12], [6,-8], [8,-2], [14,0], [14,6], [8,8], [4,12], [0,8],
                    [-4,12], [-8,8], [-14,6], [-14,0], [-8,-2], [-6,-8]
                ], color, color, 12);
                poly([[-6,0], [-2,2], [-6,4], [-10,2]], '#fff', '#fff', 5);
                poly([[6,0], [10,2], [6,4], [2,2]], '#fff', '#fff', 5);
            } else {
                poly([
                    [0,-12], [4,-8], [12,-4], [8,0], [12,4], [4,8], [0,12],
                    [-4,8], [-12,4], [-8,0], [-12,-4], [-4,-8]
                ], color, color, 12);
                poly([[-4,0], [-2,2], [-4,4], [-6,2]], '#f0f', '#f0f', 5);
                poly([[4,0], [6,2], [4,4], [2,2]], '#f0f', '#f0f', 5);
            }
            ctx.restore();
          });
        }
      }

      let pulse = Math.abs(Math.sin(Date.now() * 0.02)) * 4;
      ctx.fillStyle = '#0ff'; 
      ctx.shadowColor = '#0ff';
      ctx.shadowBlur = 10;
      gs.bullets.forEach(b => ctx.fillRect(b.x - pulse/2, b.y, b.w + pulse, b.h));
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#f00';
      ctx.shadowColor = '#f00';
      ctx.shadowBlur = 10;
      gs.enemyBullets.forEach(eb => ctx.fillRect(eb.x, eb.y, eb.w, eb.h));
      ctx.shadowBlur = 0;

      gs.particles.forEach(p => {
        ctx.fillStyle = `rgba(255, 150, 0, ${p.life / 30})`;
        ctx.shadowColor = '#fa0';
        ctx.shadowBlur = 8;
        ctx.fillRect(p.x, p.y, 4, 4);
      });
      ctx.shadowBlur = 0;

      drawCRTText(ctx, `SCORE: ${formatScore(gs.score)}`, 20, 30, '#fff', '24px "VT323", monospace', 'left');
      drawCRTText(ctx, `HI-SCORE: ${formatScore(gs.highScore)}`, 400, 30, '#fff', '24px "VT323", monospace');
      drawCRTText(ctx, `LIVES:`, 680, 30, '#fff', '24px "VT323", monospace', 'right');
      
      ctx.shadowColor = '#fff'; ctx.shadowBlur = 10;
      for(let i=0; i<gs.lives; i++) {
        let lx = 690 + (i * 25);
        ctx.fillStyle = '#ccc'; ctx.beginPath();
        ctx.moveTo(lx + 8, 10); ctx.lineTo(lx + 16, 26); ctx.lineTo(lx, 26); ctx.fill();
      }
      ctx.shadowBlur = 0;

      if (gs.status === 'gameover') {
        ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(0,0,800,600);
        drawCRTText(ctx, "GAME OVER", 400, 280, '#f00', '80px "VT323", monospace');
        drawCRTText(ctx, "PRESS ENTER TO RESTART", 400, 350, '#fff', '30px "VT323", monospace');
        drawCRTText(ctx, "PRESS M FOR MENU", 400, 400, '#fff', '24px "VT323", monospace');
      }
    };

    const update = () => {
      let gs = state.current;

      if (keys.current['m'] || keys.current['M']) {
        onMenu();
        return;
      }

      let targetSpeed = 1.0;
      if (gs.status === 'level_intro' || gs.isAsteroidLevel || gs.status === 'warp_transition') {
          targetSpeed = 5.0;
      }
      gs.globalSpeed += (targetSpeed - gs.globalSpeed) * 0.05; 

      gs.stars.forEach(s => {
        s.y += s.speed * gs.globalSpeed;
        if (s.y > 600) { s.y = -20; s.x = Math.random() * 800; }
      });

      if (gs.status === 'start') {
        if (keys.current['Enter']) { 
          gs.status = 'level_intro'; 
          gs.introTimer = 150;
          window.dispatchEvent(new CustomEvent('bgmTrack', { detail: 'galagaWarp' }));
        }
        return;
      }

      if (gs.status === 'warp_transition') {
        gs.warpTimer--;
        if (gs.warpTimer <= 0) {
          gs.wave++;
          gs.isAsteroidLevel = (gs.wave % 4 === 0);
          gs.asteroidsMissed = 0;
          if (gs.isAsteroidLevel) {
            gs.asteroids = spawnAsteroids(gs.wave);
            gs.enemies = [];
          } else {
            gs.enemies = spawnWave(gs.wave);
            gs.asteroids = [];
          }
          gs.bullets = []; gs.enemyBullets = []; gs.particles = [];
          gs.status = 'level_intro';
          gs.introTimer = 150;
          playWarpSound();
          window.dispatchEvent(new CustomEvent('bgmTrack', { detail: 'galagaWarp' }));
        }
        return;
      }

      if (gs.status === 'gameover') {
        if (keys.current['Enter']) {
          gs.status = 'level_intro';
          gs.introTimer = 150;
          gs.score = 0; gs.lives = 3; gs.wave = 1;
          gs.isAsteroidLevel = false;
          gs.enemies = spawnWave(gs.wave);
          gs.asteroids = [];
          gs.player.x = 388; gs.player.y = 530; gs.player.tilt = 0; gs.player.thrust = 1;
          gs.bullets = []; gs.enemyBullets = []; gs.particles = [];
          gs.spaceHeldFrames = 0; gs.cooldownTimer = 0; gs.overdriveCount = 0;
          window.dispatchEvent(new CustomEvent('bgmTrack', { detail: 'galagaWarp' }));
        }
        return;
      }

      if (gs.status === 'level_intro') {
          gs.introTimer--;
          if (gs.introTimer % 30 === 0) playAlarm();
          if (gs.introTimer <= 0) {
              gs.status = 'playing';
              window.dispatchEvent(new CustomEvent('bgmTrack', { detail: 'galagaPlay' }));
          }
      }

      if (gs.status === 'respawning') {
        gs.respawnTimer--;
        if (gs.respawnTimer <= 0) {
          gs.status = 'playing';
          gs.player.x = 388;
          gs.player.y = 530;
          gs.player.tilt = 0;
          gs.player.thrust = 1;
          gs.spaceHeldFrames = 0;
          window.dispatchEvent(new CustomEvent('bgmTrack', { detail: 'galagaPlay' }));
        }
      }

      if (gs.status === 'playing' || gs.status === 'level_intro' || gs.status === 'warp_transition') {
        
        if (keys.current[' '] && gs.cooldownTimer <= 0 && gs.status === 'playing') {
          gs.spaceHeldFrames++;
        } else {
          gs.spaceHeldFrames = Math.max(0, gs.spaceHeldFrames - 2);
        }

        if (gs.cooldownTimer > 0) gs.cooldownTimer--;

        if (gs.spaceHeldFrames > 180) { 
           if (gs.overdriveCount === 0) {
               gs.overdriveCount++;
               gs.cooldownTimer = 180; 
               gs.spaceHeldFrames = 0;
               playExplode();
               for(let p=0; p<15; p++) {
                 gs.particles.push({
                   x: gs.player.x + gs.player.w/2, y: gs.player.y + gs.player.h/2,
                   vx: (Math.random()-0.5)*10, vy: (Math.random()-0.5)*10, life: 20
                 });
               }
           } else {
               killPlayer(gs);
           }
        }

        let isOverdrive = gs.spaceHeldFrames > 60;
        let fireDelay = 250; 
        if (isOverdrive) {
            if (gs.spaceHeldFrames < 120) {
                fireDelay = 80;
            } else {
                let t = (gs.spaceHeldFrames - 120) / 60; 
                fireDelay = 80 + (t * 400); 
            }
        }

        let movingX = 0;
        if (keys.current['ArrowLeft'] || keys.current['a']) { gs.player.x -= gs.player.speed; movingX = -1; }
        if (keys.current['ArrowRight'] || keys.current['d']) { gs.player.x += gs.player.speed; movingX = 1; }
        
        let thrust = 1;
        if (keys.current['ArrowUp'] || keys.current['w']) { gs.player.y -= gs.player.speed; thrust = 2; }
        if (keys.current['ArrowDown'] || keys.current['s']) { gs.player.y += gs.player.speed; thrust = 0; }
        gs.player.thrust = thrust;

        gs.player.x = Math.max(0, Math.min(800 - gs.player.w, gs.player.x));
        gs.player.y = Math.max(400, Math.min(600 - gs.player.h - 10, gs.player.y));

        if (movingX < 0) gs.player.tilt = Math.max(-0.4, (gs.player.tilt || 0) - 0.08);
        else if (movingX > 0) gs.player.tilt = Math.min(0.4, (gs.player.tilt || 0) + 0.08);
        else gs.player.tilt = (gs.player.tilt || 0) * 0.8;

        if (gs.status === 'playing' && (keys.current[' ']) && gs.cooldownTimer <= 0 && Date.now() - gs.lastShot > fireDelay) {
          gs.bullets.push({ x: gs.player.x + gs.player.w/2 - 2, y: gs.player.y, w: 4, h: 12, vy: -15 });
          gs.lastShot = Date.now();
          playShoot();
        }

        for (let i = gs.bullets.length - 1; i >= 0; i--) {
          let b = gs.bullets[i];
          b.y += b.vy;
          if (b.y < 0) { gs.bullets.splice(i, 1); continue; }
          
          let hit = false;

          if (gs.isAsteroidLevel) {
            for (let j = gs.asteroids.length - 1; j >= 0; j--) {
              let a = gs.asteroids[j];
              if (Math.hypot(b.x - a.x, b.y - a.y) < a.radius) {
                  hit = true;
                  playExplode();
                  addScore(gs, 50 * a.size);
                  
                  for(let p=0; p<10*a.size; p++) {
                      gs.particles.push({
                          x: a.x, y: a.y,
                          vx: (Math.random()-0.5)*8, vy: (Math.random()-0.5)*8, life: 30
                      });
                  }

                  if (a.size > 1) {
                      let newSize = a.size - 1;
                      let newRad = newSize === 2 ? 20 : 10;
                      gs.asteroids.push({
                          x: a.x, y: a.y, vx: a.vx - 1 - Math.random(), vy: a.vy,
                          size: newSize, radius: newRad, rotation: a.rotation, rotSpeed: a.rotSpeed * 1.5,
                          points: Array(8).fill(0).map(() => 0.6 + Math.random() * 0.4)
                      });
                      gs.asteroids.push({
                          x: a.x, y: a.y, vx: a.vx + 1 + Math.random(), vy: a.vy,
                          size: newSize, radius: newRad, rotation: a.rotation, rotSpeed: -a.rotSpeed * 1.5,
                          points: Array(8).fill(0).map(() => 0.6 + Math.random() * 0.4)
                      });
                  }
                  gs.asteroids.splice(j, 1);
                  break;
              }
            }
          } else {
            for (let j = gs.enemies.length - 1; j >= 0; j--) {
              let e = gs.enemies[j];
              if (e.state === 'spawning' && e.spawnDelay > 0) continue; 

              if (b.x < e.x + e.w && b.x + b.w > e.x && b.y < e.y + e.h && b.y + b.h > e.y) {
                gs.enemies.splice(j, 1);
                hit = true;
                addScore(gs, 150);
                playExplode();
                for(let p=0; p<15; p++) {
                  gs.particles.push({
                    x: e.x + e.w/2, y: e.y + e.h/2,
                    vx: (Math.random()-0.5)*8, vy: (Math.random()-0.5)*8, life: 30
                  });
                }
                break;
              }
            }
          }
          if (hit) gs.bullets.splice(i, 1);
        }
      }

      if (!gs.isAsteroidLevel) {
        for (let i = gs.enemyBullets.length - 1; i >= 0; i--) {
          let eb = gs.enemyBullets[i];
          eb.x += eb.vx; eb.y += eb.vy;
          if (eb.y > 600 || eb.x < 0 || eb.x > 800) { gs.enemyBullets.splice(i, 1); continue; }
          
          if (gs.status === 'playing') {
            if (eb.x < gs.player.x + gs.player.w && eb.x + eb.w > gs.player.x &&
                eb.y < gs.player.y + gs.player.h && eb.y + eb.h > gs.player.y) {
                gs.enemyBullets.splice(i, 1);
                killPlayer(gs);
                break;
            }
          }
        }

        let formX = Math.sin(Date.now() / 1500) * (40 + Math.min(gs.wave * 2, 60)) * 0.85; 
        
        if (gs.status === 'playing' && Math.random() < (0.015 + (gs.wave * 0.002)) * 0.85) {
          let formEnemies = gs.enemies.filter(e => e.state === 'formation');
          if(formEnemies.length > 0) {
            let randE = formEnemies[Math.floor(Math.random() * formEnemies.length)];
            randE.state = 'attacking';
            randE.attackStartX = randE.x;
            randE.attackStartY = randE.y;
            randE.attackTimer = 0;
          }
        }

        for (let i = gs.enemies.length - 1; i >= 0; i--) {
          let e = gs.enemies[i];
          
          if (e.state === 'spawning') {
            if (e.spawnDelay > 0) {
              e.spawnDelay--;
            } else {
              e.pathTimer++;
              let t = e.pathTimer / 100;
              if (t >= 1) {
                 e.state = 'formation';
                 e.x = e.baseX + formX;
                 e.y = e.baseY + Math.cos((Date.now() / 500) + e.phase) * 10;
              } else {
                 let invT = 1 - t;
                 let tx = e.baseX + formX;
                 let ty = e.baseY + Math.cos((Date.now() / 500) + e.phase) * 10;
                 e.x = invT*invT * e.startX + 2 * invT * t * e.ctrlX + t*t * tx;
                 e.y = invT*invT * e.startY + 2 * invT * t * e.ctrlY + t*t * ty;
              }
            }
          }
          else if (e.state === 'formation') {
            e.x = e.baseX + formX;
            e.y = e.baseY + Math.cos((Date.now() / 500) + e.phase) * 10;
          } 
          else if (e.state === 'attacking') {
            e.attackTimer++;
            e.y = e.attackStartY + (e.attackTimer * (4 + gs.wave * 0.3));
            e.x = e.attackStartX + Math.sin(e.attackTimer * 0.05) * 100;
            e.x = Math.max(0, Math.min(800 - e.w, e.x));

            if (gs.status === 'playing' && Math.random() < 0.015 + (gs.wave * 0.002)) {
              fireEnemyBullet(e, gs);
            }

            if (e.y > 600) {
              e.y = -50;
              e.state = 'returning';
            }
          } 
          else if (e.state === 'returning') {
            let tx = e.baseX + formX;
            let ty = e.baseY + Math.cos((Date.now() / 500) + e.phase) * 10;
            e.x += (tx - e.x) * 0.05;
            e.y += (ty - e.y) * 0.05;
            if (Math.abs(e.x - tx) < 5 && Math.abs(e.y - ty) < 5) {
               e.state = 'formation';
               e.x = tx; e.y = ty;
            }
          }

          if (gs.status === 'playing' && e.state !== 'spawning') {
            if (e.x < gs.player.x + gs.player.w && e.x + e.w > gs.player.x && 
                e.y < gs.player.y + gs.player.h && e.y + e.h > gs.player.y) {
                killPlayer(gs);
                gs.enemies.splice(i, 1);
            }
          }
        }
      } else {
        for (let i = gs.asteroids.length - 1; i >= 0; i--) {
          let a = gs.asteroids[i];
          a.x += a.vx;
          a.y += a.vy;
          a.rotation += a.rotSpeed;

          if (gs.status === 'playing') {
              let dx = (gs.player.x + gs.player.w/2) - a.x;
              let dy = (gs.player.y + gs.player.h/2) - a.y;
              if (Math.hypot(dx, dy) < a.radius + 8) {
                  killPlayer(gs);
              }
          }

          if (a.y > 600 + a.radius || a.x < -a.radius || a.x > 800 + a.radius) {
              gs.asteroidsMissed = (gs.asteroidsMissed || 0) + 1;
              gs.asteroids.splice(i, 1);
          }
        }
      }

      for (let i = gs.particles.length - 1; i >= 0; i--) {
        let p = gs.particles[i];
        p.x += p.vx; p.y += p.vy; p.life--;
        if (p.life <= 0) gs.particles.splice(i, 1);
      }

      if (gs.status === 'playing' && gs.enemies.length === 0 && gs.asteroids.length === 0) {
        gs.status = 'warp_transition';
        gs.warpTimer = 90; 
        playFanfare();
        if (gs.isAsteroidLevel && gs.asteroidsMissed === 0) {
            addScore(gs, 0); 
            gs.lives++;
            playExtraLife();
        }
      }
    };

    const loop = () => {
      update(); draw();
      animationFrameId = requestAnimationFrame(loop);
    };
    loop();

    return () => cancelAnimationFrame(animationFrameId);
  }, [audioCtx, onMenu]);

  return (
    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-auto bg-transparent">
      <canvas ref={canvasRef} width={800} height={600} className="w-full h-full object-fill bg-transparent cursor-none" />
    </div>
  );
};


export default function App() {
  const [bootStage, setBootStage] = useState('off'); 
  const [hasAcceptedWarning, setHasAcceptedWarning] = useState(false);
  const [secretGameState, setSecretGameState] = useState('none'); 
  
  const videoRef = useRef(null);
  const audioContextRef = useRef(null);
  const utteranceRef = useRef(null); 
  const timeoutsRef = useRef([]); 
  const activeNodesRef = useRef([]); 
  const secretBufferRef = useRef(''); 
  
  const bgmBuffersRef = useRef({});
  const bgmNodeRef = useRef(null);

  const cleanupAudio = useCallback(() => {
    activeNodesRef.current.forEach(node => {
      try { node.stop(); } catch(e) {}
      try { node.disconnect(); } catch(e) {}
    });
    activeNodesRef.current = [];
    if (bgmNodeRef.current) {
      try { bgmNodeRef.current.stop(); } catch(e) {}
      bgmNodeRef.current = null;
    }
  }, []);

  const createTelemetryBuffer = useCallback((actx) => {
    const length = actx.sampleRate * 4; 
    const buffer = actx.createBuffer(1, length, actx.sampleRate);
    const data = buffer.getChannelData(0);
    for(let i=0; i<length; i++) data[i] = 0;

    for(let b=0; b<6; b++) {
      const start = Math.floor(Math.random() * (length - actx.sampleRate * 0.2));
      const freq = 800 + Math.random() * 2000;
      const dur = Math.floor(actx.sampleRate * (0.02 + Math.random() * 0.06));
      for(let i=0; i<dur; i++) {
        data[start + i] = Math.sin(2 * Math.PI * freq * i / actx.sampleRate) * 0.04;
      }
    }
    for(let i=0; i<length; i++) {
      if(Math.random() > 0.9995) data[i] = (Math.random() * 2 - 1) * 0.15;
    }
    return buffer;
  }, []);

  const startTransmissionTTS = useCallback((actx, delay) => {
    const tOn = setTimeout(() => {
      setBootStage('on');
      window.speechSynthesis.cancel(); 

      const tNow = actx.currentTime;

      const noiseBuffer = actx.createBuffer(1, 2 * actx.sampleRate, actx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < output.length; i++) output[i] = Math.random() * 2 - 1;
      const noiseSrc = actx.createBufferSource();
      noiseSrc.buffer = noiseBuffer;
      noiseSrc.loop = true;
      const noiseFilter = actx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 1000;
      noiseFilter.Q.value = 0.5;
      const noiseGain = actx.createGain();
      noiseGain.gain.setValueAtTime(0.08, tNow);
      noiseSrc.connect(noiseFilter).connect(noiseGain).connect(actx.destination);
      noiseSrc.start(tNow);
      activeNodesRef.current.push(noiseSrc);

      const humOsc = actx.createOscillator();
      humOsc.type = 'sawtooth'; 
      humOsc.frequency.value = 60;
      const humGain = actx.createGain();
      humGain.gain.setValueAtTime(0.015, tNow);
      humOsc.connect(humGain).connect(actx.destination);
      humOsc.start(tNow);
      activeNodesRef.current.push(humOsc);
      
      const easC1 = actx.createOscillator(); easC1.type = 'sine'; easC1.frequency.value = 853;
      const easC2 = actx.createOscillator(); easC2.type = 'sine'; easC2.frequency.value = 960;
      const easGain = actx.createGain(); easGain.gain.setValueAtTime(0.005, tNow);
      easC1.connect(easGain).connect(actx.destination); easC2.connect(easGain).connect(actx.destination);
      easC1.start(tNow); easC2.start(tNow);
      activeNodesRef.current.push(easC1, easC2);

      const telemetrySrc = actx.createBufferSource();
      telemetrySrc.buffer = createTelemetryBuffer(actx);
      telemetrySrc.loop = true;
      telemetrySrc.connect(actx.destination);
      telemetrySrc.start(tNow);
      activeNodesRef.current.push(telemetrySrc);

      const textToRead = "dee jay merk one. OPERATING AT THE HIGH-FIDELITY INTERSECTION OF RHYTHM AND PRECISION. A DEFINITIVE ARCHITECT OF THE FLORIDA SOUND, BRIDGING CLASSIC FOUNDATIONS WITH FUTURISTIC CLARITY. ROOTED IN THE 90S PULSE. EVOLVING THROUGH EXPERIMENTAL HIP-HOP, SOULFUL R AND B, LATIN MUSIC, AND DRIVING HOUSE MUSIC. SOUND IS ARCHITECTURE. ENGINEERING IS THE SCIENCE OF EMOTION. HE DOESN'T JUST RECORD MUSIC. HE ENGINEERS THE FUTURE. STAY TUNED.";
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utteranceRef.current = utterance; 
      
      utterance.pitch = 0.2;
      utterance.rate = 0.75;
      
      const voices = window.speechSynthesis.getVoices();
      const syntheticVoice = voices.find(v => v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('google') || v.lang === 'en-US');
      if (syntheticVoice) utterance.voice = syntheticVoice;

      utterance.onend = () => {
        setBootStage('nosignal');
        cleanupAudio();
      };

      window.speechSynthesis.speak(utterance);
    }, delay);

    timeoutsRef.current.push(tOn);
  }, [cleanupAudio, createTelemetryBuffer]);

  const triggerSecretReboot = useCallback(() => {
    cleanupAudio();
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setSecretGameState('none');
    setBootStage('static'); 
    
    const actx = audioContextRef.current;
    if (!actx) return;
    const t0 = actx.currentTime;

    const easOsc1 = actx.createOscillator();
    const easOsc2 = actx.createOscillator();
    easOsc1.type = 'sawtooth'; easOsc2.type = 'sawtooth';
    easOsc1.frequency.value = 853; easOsc2.frequency.value = 960;
    const easGain = actx.createGain();
    easGain.gain.setValueAtTime(0.25, t0);
    easGain.gain.setValueAtTime(0, t0 + 4.0);
    easOsc1.connect(easGain); easOsc2.connect(easGain); easGain.connect(actx.destination);
    easOsc1.start(t0); easOsc2.start(t0);
    easOsc1.stop(t0 + 4.1); easOsc2.stop(t0 + 4.1);
    activeNodesRef.current.push(easOsc1, easOsc2);

    const sineOsc = actx.createOscillator();
    sineOsc.type = 'sine';
    sineOsc.frequency.value = 1000;
    const sineGain = actx.createGain();
    sineGain.gain.setValueAtTime(0, t0);
    sineGain.gain.setValueAtTime(0.25, t0 + 4.2); 
    sineGain.gain.setValueAtTime(0, t0 + 5.2);
    sineOsc.connect(sineGain).connect(actx.destination);
    sineOsc.start(t0 + 4.2); sineOsc.stop(t0 + 5.3);
    activeNodesRef.current.push(sineOsc);

    startTransmissionTTS(actx, 5200);

  }, [cleanupAudio, startTransmissionTTS]);

  const runSequence = useCallback(() => {
    cleanupAudio();
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setSecretGameState('none');

    const actx = audioContextRef.current;
    if (!actx) return;
    const t0 = actx.currentTime;

    setBootStage('tv-on-flash');
    const thumpOsc = actx.createOscillator();
    thumpOsc.type = 'square';
    thumpOsc.frequency.setValueAtTime(150, t0);
    thumpOsc.frequency.exponentialRampToValueAtTime(0.01, t0 + 0.15);
    const thumpGain = actx.createGain();
    thumpGain.gain.setValueAtTime(0.7, t0);
    thumpGain.gain.exponentialRampToValueAtTime(0.01, t0 + 0.15);
    thumpOsc.connect(thumpGain).connect(actx.destination);
    thumpOsc.start(t0);
    thumpOsc.stop(t0 + 0.15);
    activeNodesRef.current.push(thumpOsc);

    const tBoot = setTimeout(() => setBootStage('booting'), 150);

    const easOsc1 = actx.createOscillator();
    const easOsc2 = actx.createOscillator();
    easOsc1.type = 'sawtooth'; easOsc2.type = 'sawtooth';
    easOsc1.frequency.value = 853; easOsc2.frequency.value = 960;
    const easGain = actx.createGain();
    easGain.gain.setValueAtTime(0, t0);
    easGain.gain.setValueAtTime(0.2, t0 + 0.2); easGain.gain.setValueAtTime(0, t0 + 0.7);
    easGain.gain.setValueAtTime(0.2, t0 + 1.2); easGain.gain.setValueAtTime(0, t0 + 1.7);
    easOsc1.connect(easGain); easOsc2.connect(easGain); easGain.connect(actx.destination);
    easOsc1.start(t0 + 0.2); easOsc2.start(t0 + 0.2);
    easOsc1.stop(t0 + 1.8); easOsc2.stop(t0 + 1.8);
    activeNodesRef.current.push(easOsc1, easOsc2);

    const sineOsc = actx.createOscillator();
    sineOsc.type = 'sine';
    sineOsc.frequency.value = 1000;
    const sineGain = actx.createGain();
    sineGain.gain.setValueAtTime(0, t0);
    sineGain.gain.setValueAtTime(0.25, t0 + 2.2); 
    sineGain.gain.setValueAtTime(0, t0 + 3.2);
    sineOsc.connect(sineGain).connect(actx.destination);
    sineOsc.start(t0 + 2.2); sineOsc.stop(t0 + 3.3);
    activeNodesRef.current.push(sineOsc);

    timeoutsRef.current.push(tBoot);
    startTransmissionTTS(actx, 3200);

  }, [cleanupAudio, startTransmissionTTS]);

  // Setup Global Game Audio Listener
  useEffect(() => {
    const handleBgm = (e) => {
      if (bgmNodeRef.current) { try { bgmNodeRef.current.stop(); } catch(err){} }
      const trackName = e.detail;
      if (trackName === 'none') return;
      const actx = audioContextRef.current;
      if (!bgmBuffersRef.current[trackName] || !actx || actx.state !== 'running') return;
      
      const src = actx.createBufferSource();
      src.buffer = bgmBuffersRef.current[trackName];
      if (!trackName.includes('Over')) src.loop = true;
      src.connect(actx.destination);
      src.start();
      bgmNodeRef.current = src;
    };
    window.addEventListener('bgmTrack', handleBgm);
    return () => window.removeEventListener('bgmTrack', handleBgm);
  }, []);

  const handleReturnToMenu = useCallback(() => {
    setSecretGameState('menu');
    window.dispatchEvent(new CustomEvent('bgmTrack', { detail: 'none' })); 
  }, []);

  // Video source handler
  useEffect(() => {
    if (videoRef.current) {
      if (secretGameState === 'drive') {
        videoRef.current.src = "/game2.mp4";
        videoRef.current.load();
        videoRef.current.play().catch(e => console.log(e));
      } else if (secretGameState === 'snake') {
        videoRef.current.src = "/test.mp4";
        videoRef.current.load();
        videoRef.current.play().catch(e => console.log(e));
      } else if (secretGameState === 'commando') {
        videoRef.current.src = "/game2.mp4";
        videoRef.current.load();
        videoRef.current.play().catch(e => console.log(e));
      } else if (secretGameState === 'menu') {
        videoRef.current.src = "/menu.mp4";
        videoRef.current.load();
        videoRef.current.play().catch(e => console.log(e));
      } else if (secretGameState === 'galaga') {
        videoRef.current.src = "/game.mp4";
        videoRef.current.load();
        videoRef.current.play().catch(e => console.log(e));
      } else if (bootStage === 'final-screen' || bootStage === 'final-tv-on-flash') {
        videoRef.current.src = "/last.mp4";
        videoRef.current.load();
        videoRef.current.play().catch(e => console.log(e));
      } else if (bootStage === 'nosignal' || bootStage === 'tv-off-anim') {
        videoRef.current.src = "/static.mp4";
        videoRef.current.load();
        videoRef.current.play().catch(e => console.log(e));
      } else if (bootStage === 'permanently-off') {
        videoRef.current.pause();
        videoRef.current.removeAttribute('src'); 
        videoRef.current.load();
      } else {
        videoRef.current.src = "/noise.mp4";
        videoRef.current.load();
        videoRef.current.play().catch(e => console.log(e));
      }
    }
  }, [bootStage, secretGameState]);

  useEffect(() => {
    let timeout;
    
    if (bootStage === 'nosignal') {
      timeout = setTimeout(() => {
        setBootStage('tv-off-anim');
      }, 3000); // 3 seconds max
    } 
    else if (bootStage === 'tv-off-anim') {
      if (audioContextRef.current) {
        const actx = audioContextRef.current;
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.frequency.setValueAtTime(800, actx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(10, actx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.5, actx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + 0.15);
        osc.connect(gain).connect(actx.destination);
        osc.start(actx.currentTime);
        osc.stop(actx.currentTime + 0.15);
        activeNodesRef.current.push(osc);
      }
      timeout = setTimeout(() => {
        setBootStage('permanently-off');
      }, 600); 
    } 
    else if (bootStage === 'permanently-off') {
      timeout = setTimeout(() => {
        setBootStage('final-tv-on-flash');
      }, 3000); 
    } 
    else if (bootStage === 'final-tv-on-flash') {
      if (audioContextRef.current) {
        const actx = audioContextRef.current;
        const t0 = actx.currentTime;
        const thumpOsc = actx.createOscillator();
        thumpOsc.type = 'square';
        thumpOsc.frequency.setValueAtTime(150, t0);
        thumpOsc.frequency.exponentialRampToValueAtTime(0.01, t0 + 0.15);
        const thumpGain = actx.createGain();
        thumpGain.gain.setValueAtTime(0.7, t0);
        thumpGain.gain.exponentialRampToValueAtTime(0.01, t0 + 0.15);
        thumpOsc.connect(thumpGain).connect(actx.destination);
        thumpOsc.start(t0);
        thumpOsc.stop(t0 + 0.15);
        activeNodesRef.current.push(thumpOsc);

        const noiseBuffer = actx.createBuffer(1, 2 * actx.sampleRate, actx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < output.length; i++) output[i] = Math.random() * 2 - 1;
        const noiseSrc = actx.createBufferSource();
        noiseSrc.buffer = noiseBuffer;
        noiseSrc.loop = true;
        const noiseGain = actx.createGain();
        noiseGain.gain.setValueAtTime(0.015, t0);
        noiseSrc.connect(noiseGain).connect(actx.destination);
        noiseSrc.start(t0);
        activeNodesRef.current.push(noiseSrc);
      }
      timeout = setTimeout(() => {
        setBootStage('final-screen');
      }, 150);
    }
    
    return () => clearTimeout(timeout);
  }, [bootStage]);

  // SECRET CODE KEYSTROKE TRACKER
  useEffect(() => {
    const handleGlobalKeydown = (e) => {
      // Ignore if the TV is completely off
      if (bootStage === 'off') return;

      const key = e.key;
      let mapped = '';
      
      if (key === 'ArrowUp') mapped = 'U';
      else if (key === 'ArrowDown') mapped = 'D';
      else if (key === 'ArrowLeft') mapped = 'L';
      else if (key === 'ArrowRight') mapped = 'R';
      else if (key === 'Enter') mapped = 'E';
      else if (/^[a-zA-Z0-9]$/.test(key)) mapped = key.toUpperCase();

      if (mapped) {
        secretBufferRef.current += mapped;
        if (secretBufferRef.current.length > 40) {
          secretBufferRef.current = secretBufferRef.current.slice(-40);
        }

        // 1. UNIVERSAL CODE => SHOW MENU ANYTIME
        if (secretBufferRef.current.endsWith('7162327057ABACABB')) {
          secretBufferRef.current = '';
          
          window.speechSynthesis.cancel();
          cleanupAudio();
          timeoutsRef.current.forEach(clearTimeout);
          timeoutsRef.current = [];

          setBootStage('final-screen');
          setSecretGameState('menu');
          
          const actx = audioContextRef.current;
          if (actx) {
             const osc = actx.createOscillator();
             osc.type = 'square';
             const gain = actx.createGain();
             osc.connect(gain).connect(actx.destination);
             osc.frequency.setValueAtTime(440, actx.currentTime); // A4
             osc.frequency.setValueAtTime(880, actx.currentTime + 0.1); // A5
             osc.frequency.setValueAtTime(1760, actx.currentTime + 0.2); // A6
             gain.gain.setValueAtTime(0.2, actx.currentTime);
             gain.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + 0.6);
             osc.start(actx.currentTime);
             osc.stop(actx.currentTime + 0.6);
             
             if (Object.keys(bgmBuffersRef.current).length === 0) {
               buildTracks(actx).then(bufs => {
                 bgmBuffersRef.current = bufs;
               });
             }
          }
        }

        // 2. OUTRO ONLY CODES
        if (bootStage === 'final-screen') {
          // KONAMI CODE => SHOW MENU
          if (secretBufferRef.current.endsWith('UUDDLRLRBAE')) {
            secretBufferRef.current = '';
            setSecretGameState('menu');
            const actx = audioContextRef.current;
            if (actx) {
               const osc = actx.createOscillator();
               osc.type = 'square';
               const gain = actx.createGain();
               osc.connect(gain).connect(actx.destination);
               osc.frequency.setValueAtTime(440, actx.currentTime); // A4
               osc.frequency.setValueAtTime(880, actx.currentTime + 0.1); // A5
               osc.frequency.setValueAtTime(1760, actx.currentTime + 0.2); // A6
               gain.gain.setValueAtTime(0.2, actx.currentTime);
               gain.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + 0.6);
               osc.start(actx.currentTime);
               osc.stop(actx.currentTime + 0.6);
               
               if (Object.keys(bgmBuffersRef.current).length === 0) {
                 buildTracks(actx).then(bufs => {
                   bgmBuffersRef.current = bufs;
                 });
               }
            }
          }
          
          // REBOOT EMERGENCY
          if (secretBufferRef.current.endsWith('DULLARD')) {
             secretBufferRef.current = '';
             triggerSecretReboot();
          }
        }
      }
    };
    
    window.addEventListener('keydown', handleGlobalKeydown);
    return () => window.removeEventListener('keydown', handleGlobalKeydown);
  }, [bootStage, triggerSecretReboot, cleanupAudio]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      cleanupAudio();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, [cleanupAudio]);

  const handleProceed = async () => {
    if (document.documentElement.requestFullscreen) {
      try { await document.documentElement.requestFullscreen(); } catch (err) {}
    }
    setHasAcceptedWarning(true);
    if (videoRef.current) videoRef.current.play().catch(e => console.log("Video block:", e));
    
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContextRef.current = new AudioContext();
    
    runSequence();
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

          .vcr-font {
            font-family: 'VT323', monospace;
            color: #fff;
            font-size: 1.8rem;
            letter-spacing: 0.1em;
            line-height: 1.4;
            text-shadow: 
              -1px 0 1px rgba(255, 0, 255, 0.5), 
               1px 0 1px rgba(0, 255, 255, 0.5),
               0 0 3px currentColor, 
               0 0 8px currentColor, 
               0 0 15px currentColor;
          }

          @media (min-width: 768px) {
            .vcr-font { font-size: 2.5rem; letter-spacing: 0.15em; }
          }

          .wide-text {
            display: inline-block;
            transform: scaleX(1.2);
          }

          @keyframes artifact-hop {
            0% { background-position: 0% 0%; } 10% { background-position: 15% -10%; }
            20% { background-position: -20% 15%; } 30% { background-position: 10% 25%; }
            40% { background-position: -15% -20%; } 50% { background-position: 25% 5%; }
            60% { background-position: -10% -15%; } 70% { background-position: 20% 20%; }
            80% { background-position: -25% 10%; } 90% { background-position: 5% -25%; }
            100% { background-position: 0% 0%; }
          }

          @keyframes broadcast-scroll {
            0% { transform: translateY(100vh); }
            100% { transform: translateY(-150vh); }
          }

          .animate-scroll {
            animation: broadcast-scroll 42s linear forwards;
          }
          
          @keyframes tv-off-squish {
            0% { transform: scale(1, 1); filter: brightness(1); }
            40% { transform: scale(1, 0.005); filter: brightness(10); }
            100% { transform: scale(0, 0.005); filter: brightness(0); }
          }

          .animate-tv-off {
            animation: tv-off-squish 0.5s cubic-bezier(0.23, 1, 0.32, 1) forwards;
            transform-origin: center;
          }

          .heavy-bloom {
            position: absolute; inset: 0; z-index: 55;
            filter: blur(24px) brightness(1.9) contrast(120%);
            opacity: 0.75; mix-blend-mode: screen; pointer-events: none; background: inherit;
          }

          .scanlines-overlay {
            position: absolute; inset: 0; z-index: 56;
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.45) 50%);
            background-size: 100% 6px; pointer-events: none;
          }

          .crt-vignette-bezel {
            position: absolute; inset: 0; z-index: 60;
            background: radial-gradient(circle, transparent 30%, rgba(0,0,0,0.6) 100%);
            box-shadow: inset 0 0 180px rgba(0,0,0,0.9); pointer-events: none;
          }
          
          .global-bloom-wrap {
            filter: blur(1.2px) contrast(115%) brightness(1.15);
          }

          .noise-video {
            position: absolute; inset: 0; width: 100%; height: 100%;
            object-fit: cover;
            filter: contrast(130%) brightness(1.1) saturate(120%);
          }

          .rgb-artifacts-full {
            position: absolute; inset: -20%; width: 140%; height: 140%;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.35 0.25' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
            background-size: 512px 512px; animation: artifact-hop 0.1s steps(4) infinite;
            image-rendering: pixelated; filter: contrast(1200%) saturate(500%) brightness(1.3);
            mix-blend-mode: screen; opacity: 0.25; pointer-events: none; z-index: 54;
          }
          
          .blink-text { animation: blink 1s step-end infinite; }
          @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        `}
      </style>

      <div className="relative w-full h-screen bg-[#020202] p-2 sm:p-6 md:p-12 flex items-center justify-center overflow-hidden">
        
        {/* --- WARNING OVERLAY --- */}
        {!hasAcceptedWarning && (
          <div className="absolute inset-0 z-[999] bg-black flex flex-col items-center justify-center p-8 text-center border-[12px] border-[#111]">
            <h1 className="vcr-font text-red-500 text-5xl md:text-7xl mb-6 blink-text !text-shadow-none" style={{textShadow: 'none'}}>WARNING</h1>
            <p className="vcr-font text-2xl md:text-3xl max-w-4xl text-white opacity-90 mb-12 !text-shadow-none" style={{textShadow: 'none'}}>
              THIS TRANSMISSION CONTAINS FLASHING COLORS, ERRATIC STATIC, AND STROBE EFFECTS. IT MAY NOT BE SUITABLE FOR PHOTOSENSITIVE INDIVIDUALS.
            </p>
            <button 
              onClick={handleProceed}
              className="vcr-font text-3xl md:text-5xl px-8 py-4 border-4 border-white text-white hover:bg-white hover:text-black transition-colors duration-200 uppercase !text-shadow-none"
              style={{textShadow: 'none'}}
            >
              PROCEED
            </button>
          </div>
        )}

        {/* --- INTENSE WHITE FLASHES (Power On) --- */}
        <div className={`absolute inset-0 z-[200] bg-white pointer-events-none ${bootStage === 'tv-on-flash' || bootStage === 'final-tv-on-flash' ? 'opacity-100 duration-0' : 'opacity-0 transition-opacity duration-[800ms]'}`}></div>

        {/* Main TV Frame */}
        <div className="relative w-full h-full bg-[#151515] rounded-[40px] md:rounded-[80px] overflow-hidden flex items-center justify-center global-bloom-wrap shadow-[0_0_150px_rgba(0,0,0,1)] ring-[24px] ring-[#0a0a0a]">
          
          {/* Active Signal Layer */}
          <div className={`absolute inset-0 w-full h-full ${bootStage === 'tv-off-anim' ? 'animate-tv-off' : ''} ${bootStage === 'permanently-off' ? 'hidden' : 'block'}`}>
            
            {/* 1. VIDEO BACKGROUND */}
            <video
              ref={videoRef}
              className={`noise-video ${(bootStage === 'final-screen' || bootStage === 'final-tv-on-flash' || secretGameState !== 'none') ? 'z-[15] mix-blend-screen pointer-events-none' : 'z-0'} ${bootStage === 'off' ? 'opacity-0' : 'opacity-85'}`}
              loop
              muted
              playsInline
            />

            {/* 2. FULL-WIDTH RGB ARTIFACTS OVERLAY */}
            <div className="rgb-artifacts-full"></div>

            {/* 3. MUTE ICON */}
            {(bootStage === 'nosignal' || bootStage === 'tv-off-anim') && (
              <div className="absolute top-6 left-8 md:top-10 md:left-12 z-[70] vcr-font text-[#0f0] text-4xl md:text-6xl blink-text !text-shadow-none pointer-events-none" style={{textShadow: '0 0 10px #0f0'}}>
                MUTE
              </div>
            )}

            {/* 4. MAIN CONTENT */}
            {bootStage === 'nosignal' || bootStage === 'tv-off-anim' ? (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                <a href="https://djmerkone.com" className="vcr-font text-center w-full max-w-[800px] text-[120px] md:text-[150px] leading-none hover:text-red-500 transition-colors duration-200 cursor-pointer wide-text">
                  NO SIGNAL
                </a>
              </div>
            ) : bootStage === 'final-screen' || bootStage === 'final-tv-on-flash' ? (
              <>
                {secretGameState === 'menu' && (
                  <GameMenu onSelect={(game) => {
                    setSecretGameState(game);
                    if (game === 'galaga') window.dispatchEvent(new CustomEvent('bgmTrack', { detail: 'galagaStart' }));
                    else if (game === 'commando') window.dispatchEvent(new CustomEvent('bgmTrack', { detail: 'commandoStart' }));
                    else if (game === 'snake') window.dispatchEvent(new CustomEvent('bgmTrack', { detail: 'snakeStart' }));
                    else if (game === 'drive') window.dispatchEvent(new CustomEvent('bgmTrack', { detail: 'driveStart' }));
                  }} />
                )}
                {secretGameState === 'galaga' && <GalagaGame audioCtx={audioContextRef.current} onMenu={handleReturnToMenu} />}
                {secretGameState === 'commando' && <CommandoGame audioCtx={audioContextRef.current} onMenu={handleReturnToMenu} />}
                {secretGameState === 'snake' && <SnakeGame audioCtx={audioContextRef.current} onMenu={handleReturnToMenu} />}
                {secretGameState === 'drive' && <DriveGame audioCtx={audioContextRef.current} onMenu={handleReturnToMenu} />}
                
                {secretGameState === 'none' && (
                  <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center transition-opacity duration-700 ${bootStage === 'final-screen' ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="absolute w-full px-2 text-center vcr-font select-none flex flex-col gap-5 md:gap-8 whitespace-nowrap overflow-visible">
                      <p className="text-6xl md:text-[8vw] mb-2 leading-none"><span className="wide-text">djmerkone</span></p>
                      <p className="text-2xl sm:text-4xl md:text-[3.5vw] opacity-90 leading-none"><span className="wide-text">once your girlfriend's favorite dj,</span></p>
                      <p className="text-2xl sm:text-4xl md:text-[3.5vw] opacity-90 leading-none"><span className="wide-text">now your wife's favorite sound...</span></p>
                      <p className="text-4xl sm:text-6xl md:text-[5vw] mt-4 md:mt-8 leading-none"><span className="wide-text">website coming soon</span></p>
                    </div>
                    
                    <div className="absolute bottom-6 md:bottom-10 w-full text-center vcr-font text-xs sm:text-sm md:text-[1.5vw] opacity-70 px-2 whitespace-nowrap overflow-visible">
                      <span className="wide-text">click <a href="#" onClick={(e) => { e.preventDefault(); window.location.reload(); }} className="hover:text-[#0f0] transition-colors pointer-events-auto">reload</a> to watch again, or go to <a href="https://djmerkone.com" className="hover:text-[#0f0] transition-colors pointer-events-auto">djmerkone.com</a> for more info</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className={`absolute inset-0 z-10 flex flex-col items-center overflow-hidden transition-opacity duration-700 ${bootStage === 'on' ? 'opacity-100' : 'opacity-0'}`}>
                <div className={`absolute w-full max-w-[1000px] px-6 md:px-12 text-center vcr-font select-none flex flex-col gap-10 md:gap-14 ${bootStage === 'on' ? 'animate-scroll' : ''}`}>
                  <p className="text-5xl md:text-7xl mb-4 wide-text">djmerkone...</p>
                  <p className="text-3xl md:text-5xl wide-text">OPERATING AT THE HIGH-FIDELITY INTERSECTION OF RHYTHM AND PRECISION.</p>
                  <p className="text-3xl md:text-5xl wide-text">A DEFINITIVE ARCHITECT OF THE FLORIDA SOUND, BRIDGING CLASSIC FOUNDATIONS WITH FUTURISTIC CLARITY.</p>
                  <p className="text-3xl md:text-5xl wide-text">ROOTED IN THE 90S PULSE. EVOLVING THROUGH EXPERIMENTAL HIP-HOP, SOULFUL R&B, LATIN MUSIC, AND DRIVING HOUSE MUSIC.</p>
                  <div className="flex flex-col gap-2">
                    <p className="text-3xl md:text-5xl wide-text">SOUND IS ARCHITECTURE.</p>
                    <p className="text-3xl md:text-5xl wide-text">ENGINEERING IS THE SCIENCE OF EMOTION.</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-3xl md:text-5xl wide-text">HE DOESN'T JUST RECORD MUSIC.</p>
                    <p className="text-3xl md:text-5xl wide-text">HE ENGINEERS THE FUTURE.</p>
                  </div>
                  <p className="text-5xl md:text-7xl mt-8 wide-text">STAY TUNED...</p>
                </div>
              </div>
            )}

            {/* 5. BLOOM ENGINE */}
            <div className="heavy-bloom"></div>

            {/* 6. SCANLINES */}
            <div className="scanlines-overlay"></div>
          </div>
          
          {/* 7. VIGNETTE */}
          <div className="crt-vignette-bezel"></div>

        </div>
      </div>
    </>
  );
}