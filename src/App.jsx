import React, { useEffect, useRef, useState, useCallback } from 'react';

// --- ASSET LOADER ---
const ASSETS = {
  player: "data:image/svg+xml,%3Csvg viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23fff' d='M7 0h2v14H7zM6 4h4v6H6zM5 6h6v2H5z'/%3E%3Cpath fill='%23f00' d='M5 8h2v4H5zM9 8h2v4H9zM3 10h2v4H3zM11 10h2v4H11zM1 12h2v4H1zM13 12h2v4h-2z'/%3E%3C/svg%3E",
  enemy0: "data:image/svg+xml,%3Csvg viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23f0f' d='M6 0h4v2H6zm-2 2h8v2H4zm-2 2h12v2H2zM0 6h16v2H0zm0 2h4v2H0zm12 0h4v2h-4zm-8 2h8v2H4zm-2 2h4v2H2zm8 0h4v2h-4z'/%3E%3Cpath fill='%230ff' d='M4 6h2v2H4zm6 0h2v2h-2z'/%3E%3C/svg%3E",
  enemy1: "data:image/svg+xml,%3Csvg viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23f00' d='M6 0h4v2H6zm-4 2h12v2H2zm-2 2h16v4H0zm2 4h2v2H2zm10 0h2v2h-2zm-6 2h4v2H6zm-4 2h2v2H2zm10 0h2v2h-2z'/%3E%3Cpath fill='%23ff0' d='M4 4h2v2H4zm6 0h2v2h-2zm-2 4h2v2H8z'/%3E%3C/svg%3E",
  enemy2: "data:image/svg+xml,%3Csvg viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%230f0' d='M4 0h8v2H4zm-2 2h12v2H2zM0 4h16v4H0zm4 4h8v2H4zm-4 2h2v2H0zm14 0h2v2h-2zm-8 2h4v2H6z'/%3E%3Cpath fill='%23fff' d='M4 4h2v2H4zm6 0h2v2h-2z'/%3E%3C/svg%3E"
};

// --- Offline Audio Sequencer for BGM Tracks ---
const buildTracks = async (actx) => {
  const sr = actx.sampleRate;
  const WAudioContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  
  // Track 1: Start Screen (8s loop) - Arpeggiated Space Synth
  const o1 = new WAudioContext(1, 8 * sr, sr);
  for(let i=0; i<32; i++) {
    let t = i * 0.25;
    let osc = o1.createOscillator(); osc.type = 'triangle';
    osc.frequency.value = [130.81, 155.56, 196.00, 233.08][i%4] * (i%8 < 4 ? 1 : 1.5);
    let gain = o1.createGain(); gain.gain.setValueAtTime(0.05, t); gain.gain.exponentialRampToValueAtTime(0.001, t+0.2);
    osc.connect(gain).connect(o1.destination);
    osc.start(t); osc.stop(t+0.2);
  }
  const startBuf = await o1.startRendering();

  // Track 2: Playing (8s loop = 4 bars at 120bpm) - Kick & Synth Bass
  const o2 = new WAudioContext(1, 8 * sr, sr);
  for(let beat=0; beat<16; beat++) {
    let t = beat * 0.5;
    // Kick Drum
    let k = o2.createOscillator(); k.type = 'square';
    k.frequency.setValueAtTime(100, t); k.frequency.exponentialRampToValueAtTime(10, t+0.1);
    let kg = o2.createGain(); kg.gain.setValueAtTime(0.4, t); kg.gain.linearRampToValueAtTime(0.01, t+0.1);
    k.connect(kg).connect(o2.destination); k.start(t); k.stop(t+0.1);
    
    // Driving 16th Note Bassline
    for(let step=0; step<4; step++) {
      let bt = t + step * 0.125;
      let b = o2.createOscillator(); b.type = 'sawtooth';
      let freq = [32.7, 32.7, 32.7, 38.89][beat%4]; // C1, Eb1
      if(step===2) freq = 65.41; // Octave pop on offbeats
      b.frequency.value = freq;
      let bg = o2.createGain(); bg.gain.setValueAtTime(0.12, bt); bg.gain.exponentialRampToValueAtTime(0.01, bt+0.1);
      b.connect(bg).connect(o2.destination); b.start(bt); b.stop(bt+0.1);
    }
  }
  const playBuf = await o2.startRendering();

  // Track 3: Game Over (4s one-shot) - Dramatic descending chord
  const o3 = new WAudioContext(1, 4 * sr, sr);
  for(let i=0; i<8; i++) {
    let t = i * 0.3;
    let osc = o3.createOscillator(); osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150 - i*15, t);
    let gain = o3.createGain(); gain.gain.setValueAtTime(0.2, t); gain.gain.linearRampToValueAtTime(0.01, t+0.4);
    osc.connect(gain).connect(o3.destination);
    osc.start(t); osc.stop(t+0.4);
  }
  const overBuf = await o3.startRendering();

  return { start: startBuf, play: playBuf, over: overBuf };
};

// --- SECRET GALAGA-STYLE GAME COMPONENT ---
const GalagaGame = ({ audioCtx }) => {
  const canvasRef = useRef(null);
  
  // Store audio buffers and currently playing node
  const bgmBuffers = useRef({});
  const bgmNode = useRef(null);
  const playTrackRef = useRef(() => {});

  // Internal game state
  const state = useRef({
    status: 'start', // 'start', 'playing', 'respawning', 'levelcleared', 'gameover'
    respawnTimer: 0,
    score: 0,
    highScore: 0,
    lives: 3,
    wave: 1,
    player: { x: 388, y: 530, w: 24, h: 24, speed: 6 },
    bullets: [],
    enemyBullets: [],
    enemies: [],
    particles: [],
    stars: Array(100).fill().map(() => ({ 
      x: Math.random() * 800, 
      y: Math.random() * 600, 
      speed: 3 + Math.random() * 8 
    })),
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

  // Initialize Music
  useEffect(() => {
    if (audioCtx) {
      buildTracks(audioCtx).then(bufs => {
        bgmBuffers.current = bufs;
        playTrackRef.current('start');
      });
    }
    return () => { if (bgmNode.current) { try{ bgmNode.current.stop(); }catch(e){} } };
  }, [audioCtx]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const imgPlayer = new Image(); imgPlayer.src = ASSETS.player;
    const imgEnemy0 = new Image(); imgEnemy0.src = ASSETS.enemy0;
    const imgEnemy1 = new Image(); imgEnemy1.src = ASSETS.enemy1;
    const imgEnemy2 = new Image(); imgEnemy2.src = ASSETS.enemy2;
    const enemyImgs = [imgEnemy0, imgEnemy1, imgEnemy2];

    playTrackRef.current = (trackName) => {
      if (bgmNode.current) { try { bgmNode.current.stop(); } catch(e){} }
      if (!bgmBuffers.current[trackName] || !audioCtx || audioCtx.state !== 'running') return;
      const src = audioCtx.createBufferSource();
      src.buffer = bgmBuffers.current[trackName];
      if (trackName !== 'over') src.loop = true;
      src.connect(audioCtx.destination);
      src.start();
      bgmNode.current = src;
    };

    // --- 8-Bit Audio Generators ---
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

    const playLevelClear = () => {
      if (!audioCtx || audioCtx.state !== 'running') return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'square';
      const now = audioCtx.currentTime;
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(554.37, now + 0.1);
      osc.frequency.setValueAtTime(659.25, now + 0.2);
      osc.frequency.setValueAtTime(880, now + 0.3);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.6);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(); osc.stop(now + 0.6);
    };

    const spawnWave = (waveNum) => {
      const arr = [];
      const rows = Math.min(6, 2 + waveNum);
      const cols = 12; 
      const spacingX = 40;
      const spacingY = 35;
      const offsetX = (800 - (cols * spacingX)) / 2;
      for(let r=0; r<rows; r++) {
        for(let c=0; c<cols; c++) {
          arr.push({ 
            x: offsetX + c * spacingX, y: 40 + r * spacingY, 
            w: 24, h: 24, 
            baseX: offsetX + c * spacingX, baseY: 40 + r * spacingY, 
            phase: Math.random() * Math.PI * 2,
            type: r % 3,
            state: 'formation',
            attackTimer: 0,
            attackStartX: 0,
            attackStartY: 0
          });
        }
      }
      return arr;
    };

    if (state.current.enemies.length === 0) {
       state.current.enemies = spawnWave(state.current.wave);
    }

    const fireEnemyBullet = (e, gs) => {
      let dx = gs.player.x + gs.player.w/2 - (e.x + e.w/2);
      let dy = gs.player.y + gs.player.h/2 - (e.y + e.h/2);
      if (dy <= 0) return; 

      let angle = Math.atan2(dy, dx);
      let centerAngle = Math.PI / 2; 
      let maxAngle = 35 * Math.PI / 180; 
      
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
      playExplode();
      for(let p=0; p<40; p++) {
        gs.particles.push({
          x: gs.player.x + gs.player.w/2, y: gs.player.y + gs.player.h/2,
          vx: (Math.random()-0.5)*15, vy: (Math.random()-0.5)*15,
          life: 40
        });
      }
      gs.enemyBullets = []; 
      
      if (gs.lives <= 0) {
        gs.status = 'gameover';
        playTrackRef.current('over');
      } else {
        gs.status = 'respawning';
        gs.respawnTimer = 120; // Approx 2 seconds
      }
    };

    const formatScore = (s) => String(s).padStart(6, '0');

    const drawCRTText = (text, x, y, color, font, align = 'center') => {
      ctx.font = font; ctx.textAlign = align;
      ctx.fillStyle = 'rgba(255, 0, 255, 0.5)'; ctx.shadowBlur = 0; ctx.fillText(text, x - 1, y);
      ctx.fillStyle = 'rgba(0, 255, 255, 0.5)'; ctx.fillText(text, x + 1, y);
      ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 12; ctx.fillText(text, x, y);
      ctx.shadowBlur = 0;
    };

    const draw = () => {
      let gs = state.current;
      
      // Clear screen with a subtle dark tint so the background video shows through nicely
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
      ctx.shadowBlur = 5;
      gs.stars.forEach(s => { ctx.fillRect(s.x, s.y, 2, 2); });
      ctx.shadowBlur = 0;

      if (gs.status === 'start') {
        drawCRTText("BASS SPACE ADVENTURES", 400, 250, '#0f0', '60px "VT323", monospace');
        drawCRTText("CHRONICLES OF CAPTAIN MERK", 400, 300, '#fff', '30px "VT323", monospace');
        drawCRTText("PRESS ENTER TO START", 400, 380, '#fff', '24px "VT323", monospace');
        drawCRTText("ARROWS: Move  |  SPACE: Shoot", 400, 420, '#fff', '20px "VT323", monospace');
        return;
      }

      // Draw Player (flashing if respawning)
      if (gs.status === 'playing' || (gs.status === 'respawning' && Math.floor(gs.respawnTimer / 5) % 2 === 0)) {
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 12;
        if (imgPlayer.complete) {
          ctx.drawImage(imgPlayer, gs.player.x, gs.player.y, gs.player.w, gs.player.h);
        } else {
          ctx.fillStyle = '#fff'; ctx.beginPath();
          ctx.moveTo(gs.player.x + gs.player.w/2, gs.player.y);
          ctx.lineTo(gs.player.x + gs.player.w, gs.player.y + gs.player.h);
          ctx.lineTo(gs.player.x, gs.player.y + gs.player.h); ctx.fill();
        }
        ctx.shadowBlur = 0;
      }

      const glowColors = ['#f0f', '#f00', '#0f0'];
      gs.enemies.forEach(e => {
        ctx.shadowColor = glowColors[e.type];
        ctx.shadowBlur = 12;
        const eImg = enemyImgs[e.type];
        if (eImg && eImg.complete) {
          ctx.drawImage(eImg, e.x, e.y, e.w, e.h);
        } else {
          ctx.fillStyle = glowColors[e.type];
          ctx.fillRect(e.x, e.y, e.w, e.h);
        }
      });
      ctx.shadowBlur = 0;

      // Pulsing player bullets
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

      drawCRTText(`SCORE: ${formatScore(gs.score)}`, 20, 30, '#fff', '24px "VT323", monospace', 'left');
      drawCRTText(`HI-SCORE: ${formatScore(gs.highScore)}`, 400, 30, '#fff', '24px "VT323", monospace');
      drawCRTText(`LIVES:`, 680, 30, '#fff', '24px "VT323", monospace', 'right');
      
      ctx.shadowColor = '#fff'; ctx.shadowBlur = 10;
      for(let i=0; i<gs.lives; i++) {
        let lx = 690 + (i * 25);
        if (imgPlayer.complete) ctx.drawImage(imgPlayer, lx, 10, 16, 16);
        else {
          ctx.fillStyle = '#fff'; ctx.beginPath();
          ctx.moveTo(lx + 8, 10); ctx.lineTo(lx + 16, 26); ctx.lineTo(lx, 26); ctx.fill();
        }
      }
      ctx.shadowBlur = 0;

      if (gs.status === 'gameover') {
        ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(0,0,800,600);
        drawCRTText("GAME OVER", 400, 280, '#f00', '80px "VT323", monospace');
        drawCRTText("PRESS ENTER TO RESTART", 400, 350, '#fff', '30px "VT323", monospace');
      }

      if (gs.status === 'levelcleared') {
        ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(0,0,800,600);
        drawCRTText(`WAVE ${gs.wave} CLEARED!`, 400, 280, '#0f0', '60px "VT323", monospace');
        drawCRTText("PRESS ENTER TO CONTINUE", 400, 350, '#fff', '30px "VT323", monospace');
      }
    };

    const update = () => {
      let gs = state.current;

      gs.stars.forEach(s => {
        s.y += s.speed;
        if (s.y > 600) { s.y = 0; s.x = Math.random() * 800; }
      });

      if (gs.status === 'start') {
        if (keys.current['Enter']) { 
          gs.status = 'playing'; 
          playTrackRef.current('play');
        }
        return;
      }

      if (gs.status === 'levelcleared') {
        if (keys.current['Enter']) {
          gs.wave++;
          gs.enemies = spawnWave(gs.wave);
          gs.bullets = []; gs.enemyBullets = []; gs.particles = [];
          gs.status = 'playing';
          playTrackRef.current('play');
        }
        return;
      }

      if (gs.status === 'gameover') {
        if (keys.current['Enter']) {
          gs.status = 'playing';
          gs.score = 0; gs.lives = 3; gs.wave = 1;
          gs.enemies = spawnWave(gs.wave);
          gs.player.x = 388;
          gs.bullets = []; gs.enemyBullets = []; gs.particles = [];
          playTrackRef.current('play');
        }
        return;
      }

      // If Respawning, lock player controls and countdown
      if (gs.status === 'respawning') {
        gs.respawnTimer--;
        if (gs.respawnTimer <= 0) {
          gs.status = 'playing';
          gs.player.x = 388;
        }
      }

      if (gs.status === 'playing') {
        if (keys.current['ArrowLeft'] || keys.current['a']) gs.player.x -= gs.player.speed;
        if (keys.current['ArrowRight'] || keys.current['d']) gs.player.x += gs.player.speed;
        gs.player.x = Math.max(0, Math.min(800 - gs.player.w, gs.player.x));

        if ((keys.current[' '] || keys.current['ArrowUp'] || keys.current['w']) && Date.now() - gs.lastShot > 250) {
          gs.bullets.push({ x: gs.player.x + gs.player.w/2 - 2, y: gs.player.y, w: 4, h: 12, vy: -15 });
          gs.lastShot = Date.now();
          playShoot();
        }

        // Player Bullets
        for (let i = gs.bullets.length - 1; i >= 0; i--) {
          let b = gs.bullets[i];
          b.y += b.vy;
          if (b.y < 0) { gs.bullets.splice(i, 1); continue; }
          
          for (let j = gs.enemies.length - 1; j >= 0; j--) {
            let e = gs.enemies[j];
            if (b.x < e.x + e.w && b.x + b.w > e.x && b.y < e.y + e.h && b.y + b.h > e.y) {
              gs.enemies.splice(j, 1);
              gs.bullets.splice(i, 1);
              gs.score += 150;
              if (gs.score > gs.highScore) gs.highScore = gs.score;
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
      }

      // Enemy Bullets
      for (let i = gs.enemyBullets.length - 1; i >= 0; i--) {
        let eb = gs.enemyBullets[i];
        eb.x += eb.vx; eb.y += eb.vy;
        if (eb.y > 600 || eb.x < 0 || eb.x > 800) { gs.enemyBullets.splice(i, 1); continue; }
        
        // Only hit player if actively playing (not respawning)
        if (gs.status === 'playing') {
          if (eb.x < gs.player.x + gs.player.w && eb.x + eb.w > gs.player.x &&
              eb.y < gs.player.y + gs.player.h && eb.y + eb.h > gs.player.y) {
              gs.enemyBullets.splice(i, 1);
              killPlayer(gs);
              break;
          }
        }
      }

      // Enemy Logic (continues even during respawn)
      let formX = Math.sin(Date.now() / 1500) * (40 + Math.min(gs.wave * 2, 60)); 
      
      if (Math.random() < 0.015 + (gs.wave * 0.002)) {
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
        
        if (e.state === 'formation') {
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

        // Ramming player
        if (gs.status === 'playing') {
          if (e.x < gs.player.x + gs.player.w && e.x + e.w > gs.player.x && 
              e.y < gs.player.y + gs.player.h && e.y + e.h > gs.player.y) {
              killPlayer(gs);
              gs.enemies.splice(i, 1);
          }
        }
      }

      for (let i = gs.particles.length - 1; i >= 0; i--) {
        let p = gs.particles[i];
        p.x += p.vx; p.y += p.vy; p.life--;
        if (p.life <= 0) gs.particles.splice(i, 1);
      }

      if (gs.enemies.length === 0 && gs.status !== 'gameover' && gs.status !== 'levelcleared') {
        gs.status = 'levelcleared';
        if (bgmNode.current) { try{bgmNode.current.stop();}catch(e){} }
        playLevelClear();
      }
    };

    const loop = () => {
      update();
      draw();
      animationFrameId = requestAnimationFrame(loop);
    };
    loop();

    return () => cancelAnimationFrame(animationFrameId);
  }, [audioCtx]);

  // Make the wrapper transparent to let game.mp4 bleed through. 
  // Keep z-10 so the video (z-15 with mix-blend-screen) renders OVER the game!
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-auto bg-transparent">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={600} 
        className="w-full h-full object-fill bg-transparent"
      />
    </div>
  );
};


export default function App() {
  const [bootStage, setBootStage] = useState('off'); 
  // Stages: 'off', 'tv-on-flash', 'booting', 'on', 'nosignal', 'tv-off-anim', 'permanently-off', 'final-tv-on-flash', 'final-screen'
  const [hasAcceptedWarning, setHasAcceptedWarning] = useState(false);
  const [isSecretGame, setIsSecretGame] = useState(false);
  
  const videoRef = useRef(null);
  const audioContextRef = useRef(null);
  const utteranceRef = useRef(null); 
  const timeoutsRef = useRef([]); 
  const activeNodesRef = useRef([]); 
  const secretBufferRef = useRef(''); 

  const cleanupAudio = useCallback(() => {
    activeNodesRef.current.forEach(node => {
      try { node.stop(); } catch(e) {}
      try { node.disconnect(); } catch(e) {}
    });
    activeNodesRef.current = [];
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
      const noiseGain = actx.createGain();
      noiseGain.gain.setValueAtTime(0.04, tNow);
      noiseSrc.connect(noiseGain).connect(actx.destination);
      noiseSrc.start(tNow);
      activeNodesRef.current.push(noiseSrc);

      const humOsc = actx.createOscillator();
      humOsc.type = 'sine';
      humOsc.frequency.value = 60;
      const humGain = actx.createGain();
      humGain.gain.setValueAtTime(0.1, tNow);
      humOsc.connect(humGain).connect(actx.destination);
      humOsc.start(tNow);
      activeNodesRef.current.push(humOsc);

      const telemetrySrc = actx.createBufferSource();
      telemetrySrc.buffer = createTelemetryBuffer(actx);
      telemetrySrc.loop = true;
      telemetrySrc.connect(actx.destination);
      telemetrySrc.start(tNow);
      activeNodesRef.current.push(telemetrySrc);

      const textToRead = "dee jay merk one. OPERATING AT THE HIGH-FIDELITY INTERSECTION OF RHYTHM AND PRECISION. A DEFINITIVE ARCHITECT OF THE FLORIDA SOUND, BRIDGING CLASSIC FOUNDATIONS WITH FUTURISTIC CLARITY. ROOTED IN THE 90S PULSE. EVOLVING THROUGH EXPERIMENTAL HIP-HOP, SOULFUL R AND B, LATIN MUSIC, AND DRIVING HOUSE MUSIC. SOUND IS ARCHITECTURE. ENGINEERING IS THE SCIENCE OF EMOTION. HE DOESN'T JUST RECORD MUSIC. HE ENGINEERS THE FUTURE. STAY TUNED.";
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utteranceRef.current = utterance; 
      utterance.pitch = 0.6;
      utterance.rate = 0.9;
      
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
    setIsSecretGame(false);
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
    setIsSecretGame(false);

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

  useEffect(() => {
    if (videoRef.current) {
      if (isSecretGame) {
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
  }, [bootStage, isSecretGame]);

  useEffect(() => {
    let timeout;
    
    if (bootStage === 'nosignal') {
      timeout = setTimeout(() => {
        setBootStage('tv-off-anim');
      }, 7000);
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

  useEffect(() => {
    const handleGlobalKeydown = (e) => {
      if (bootStage !== 'final-screen') return;

      const key = e.key;
      let mapped = '';
      if (key === 'ArrowUp') mapped = 'U';
      else if (key === 'ArrowDown') mapped = 'D';
      else if (key === 'ArrowLeft') mapped = 'L';
      else if (key === 'ArrowRight') mapped = 'R';
      else if (key.toLowerCase() === 'b') mapped = 'B';
      else if (key.toLowerCase() === 'a') mapped = 'A';
      else if (key === 'Enter') mapped = 'E';

      if (mapped) {
        secretBufferRef.current += mapped;
        if (secretBufferRef.current.length > 20) {
          secretBufferRef.current = secretBufferRef.current.slice(-20);
        }

        // KONAMI CODE
        if (secretBufferRef.current.endsWith('UUDDLRLRBAE')) {
          secretBufferRef.current = '';
          setIsSecretGame(true);
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
          }
        }
        
        // REBOOT EMERGENCY
        if (secretBufferRef.current.endsWith('DULLARD')) {
           secretBufferRef.current = '';
           triggerSecretReboot();
        }
      }
    };
    
    window.addEventListener('keydown', handleGlobalKeydown);
    return () => window.removeEventListener('keydown', handleGlobalKeydown);
  }, [bootStage, triggerSecretReboot]);

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
            animation: broadcast-scroll 35s linear forwards;
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
        <div className={`absolute inset-0 z-[200] bg-white pointer-events-none transition-opacity duration-300 ${bootStage === 'tv-on-flash' || bootStage === 'final-tv-on-flash' ? 'opacity-100' : 'opacity-0'}`}></div>

        {/* Main TV Frame */}
        <div className="relative w-full h-full bg-[#151515] rounded-[40px] md:rounded-[80px] overflow-hidden flex items-center justify-center global-bloom-wrap shadow-[0_0_150px_rgba(0,0,0,1)] ring-[24px] ring-[#0a0a0a]">
          
          {/* Active Signal Layer */}
          <div className={`absolute inset-0 w-full h-full ${bootStage === 'tv-off-anim' ? 'animate-tv-off' : ''} ${bootStage === 'permanently-off' ? 'hidden' : 'block'}`}>
            
            {/* 1. VIDEO BACKGROUND */}
            <video
              ref={videoRef}
              className={`noise-video ${bootStage === 'final-screen' || bootStage === 'final-tv-on-flash' || isSecretGame ? 'z-[15] mix-blend-screen pointer-events-none' : 'z-0'} ${bootStage === 'off' ? 'opacity-0' : 'opacity-85'}`}
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
                <a href="https://djmerkone.com" className="vcr-font text-6xl md:text-8xl hover:text-red-500 transition-colors duration-200 cursor-pointer">
                  NO SIGNAL
                </a>
              </div>
            ) : bootStage === 'final-screen' || bootStage === 'final-tv-on-flash' ? (
              <>
                {isSecretGame ? (
                  <GalagaGame audioCtx={audioContextRef.current} />
                ) : (
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
                <div className={`absolute w-full max-w-3xl px-6 md:px-12 text-center vcr-font select-none flex flex-col gap-10 md:gap-14 ${bootStage === 'on' ? 'animate-scroll' : ''}`}>
                  <p className="text-4xl md:text-6xl mb-4">djmerkone...</p>
                  <p>OPERATING AT THE HIGH-FIDELITY INTERSECTION OF RHYTHM AND PRECISION.</p>
                  <p>A DEFINITIVE ARCHITECT OF THE FLORIDA SOUND, BRIDGING CLASSIC FOUNDATIONS WITH FUTURISTIC CLARITY.</p>
                  <p>ROOTED IN THE 90S PULSE. EVOLVING THROUGH EXPERIMENTAL HIP-HOP, SOULFUL R&B, LATIN MUSIC, AND DRIVING HOUSE MUSIC.</p>
                  <p>SOUND IS ARCHITECTURE.<br/>ENGINEERING IS THE SCIENCE OF EMOTION.</p>
                  <p>HE DOESN'T JUST RECORD MUSIC.<br/>HE ENGINEERS THE FUTURE.</p>
                  <p className="text-4xl md:text-6xl mt-8">STAY TUNED...</p>
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