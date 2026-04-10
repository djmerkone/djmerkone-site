import React, { useEffect, useRef, useState, useCallback } from 'react';

export default function App() {
  const [bootStage, setBootStage] = useState('off'); 
  // Stages: 'off', 'tv-on-flash', 'booting', 'on', 'nosignal', 'tv-off-anim', 'permanently-off'
  const [hasAcceptedWarning, setHasAcceptedWarning] = useState(false);
  
  const videoRef = useRef(null);
  const audioContextRef = useRef(null);
  const utteranceRef = useRef(null); 
  const timeoutsRef = useRef([]); 
  const activeNodesRef = useRef([]); // Keeps track of audio nodes for clean muting

  // Clean up audio nodes securely
  const cleanupAudio = useCallback(() => {
    activeNodesRef.current.forEach(node => {
      try { node.stop(); } catch(e) {}
      try { node.disconnect(); } catch(e) {}
    });
    activeNodesRef.current = [];
  }, []);

  // Generates the looping radio telemetry (hum, crackle, data chirps)
  const createTelemetryBuffer = useCallback((actx) => {
    const length = actx.sampleRate * 4; 
    const buffer = actx.createBuffer(1, length, actx.sampleRate);
    const data = buffer.getChannelData(0);
    for(let i=0; i<length; i++) data[i] = 0;

    // Add random data chirps
    for(let b=0; b<6; b++) {
      const start = Math.floor(Math.random() * (length - actx.sampleRate * 0.2));
      const freq = 800 + Math.random() * 2000;
      const dur = Math.floor(actx.sampleRate * (0.02 + Math.random() * 0.06));
      for(let i=0; i<dur; i++) {
        data[start + i] = Math.sin(2 * Math.PI * freq * i / actx.sampleRate) * 0.04;
      }
    }
    // Add analog crackle
    for(let i=0; i<length; i++) {
      if(Math.random() > 0.9995) data[i] = (Math.random() * 2 - 1) * 0.15;
    }
    return buffer;
  }, []);

  // The master sequence controller
  const runSequence = useCallback(() => {
    cleanupAudio();
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    const actx = audioContextRef.current;
    if (!actx) return;
    const t0 = actx.currentTime;

    // --- MECHANICAL CLICKS & FLASHES ---
    setBootStage('tv-on-flash');
    // Power On Audio: Heavy Thump
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

    // Step 1: Reveal Background instantly after the 150ms flash
    const tBoot = setTimeout(() => setBootStage('booting'), 150);

    // --- WARNING BEEP SEQUENCE ---

    // EAS Dual Tones (853Hz & 960Hz)
    const easOsc1 = actx.createOscillator();
    const easOsc2 = actx.createOscillator();
    easOsc1.type = 'sawtooth'; easOsc2.type = 'sawtooth';
    easOsc1.frequency.value = 853; easOsc2.frequency.value = 960;
    const easGain = actx.createGain();
    easGain.gain.setValueAtTime(0, t0);
    // Burst 1 (0.2s - 0.7s)
    easGain.gain.setValueAtTime(0.2, t0 + 0.2);
    easGain.gain.setValueAtTime(0, t0 + 0.7);
    // Burst 2 (1.2s - 1.7s)
    easGain.gain.setValueAtTime(0.2, t0 + 1.2);
    easGain.gain.setValueAtTime(0, t0 + 1.7);
    easOsc1.connect(easGain); easOsc2.connect(easGain); easGain.connect(actx.destination);
    easOsc1.start(t0 + 0.2); easOsc2.start(t0 + 0.2);
    easOsc1.stop(t0 + 1.8); easOsc2.stop(t0 + 1.8);
    activeNodesRef.current.push(easOsc1, easOsc2);

    // SMPTE Sine Beep (1000Hz)
    const sineOsc = actx.createOscillator();
    sineOsc.type = 'sine';
    sineOsc.frequency.value = 1000;
    const sineGain = actx.createGain();
    sineGain.gain.setValueAtTime(0, t0);
    sineGain.gain.setValueAtTime(0.25, t0 + 2.2); // Beep: 2.2s - 3.2s
    sineGain.gain.setValueAtTime(0, t0 + 3.2);
    sineOsc.connect(sineGain).connect(actx.destination);
    sineOsc.start(t0 + 2.2); sineOsc.stop(t0 + 3.3);
    activeNodesRef.current.push(sineOsc);

    // Step 2: Initiate Speech and Transmission Environment
    const tOn = setTimeout(() => {
      setBootStage('on');
      window.speechSynthesis.cancel(); // Cancel any existing speech

      const tNow = actx.currentTime;

      // 1. Continuous White Noise Layer
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

      // 2. Radio Hum & Telemetry Layer (60Hz + Clicks)
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

      // 3. Text to Speech
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
        cleanupAudio(); // Instantly mute static and hum
      };

      window.speechSynthesis.speak(utterance);
    }, 3200);

    timeoutsRef.current.push(tBoot, tOn);
  }, [cleanupAudio, createTelemetryBuffer]);

  // Video source handler
  useEffect(() => {
    if (videoRef.current) {
      if (bootStage === 'nosignal' || bootStage === 'off') {
        videoRef.current.load();
        videoRef.current.play().catch(e => console.log("Video play blocked:", e));
      } else if (bootStage === 'permanently-off') {
        // Fully stop and clear video resources on final power down
        videoRef.current.pause();
        videoRef.current.removeAttribute('src'); 
        videoRef.current.load();
      }
    }
  }, [bootStage]);

  // Handle the No Signal 7-second timer & TV Off animation
  useEffect(() => {
    let timeout1, timeout2;
    if (bootStage === 'nosignal') {
      timeout1 = setTimeout(() => {
        setBootStage('tv-off-anim');
        
        // Play a classic power-down "zip" sound
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
        }

        // Wait for the CSS animation to complete, then hide everything
        timeout2 = setTimeout(() => {
          setBootStage('permanently-off');
        }, 600); 

      }, 7000);
    }
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, [bootStage]);

  // Total cleanup on unmount
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
              -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000,
              -4px 0 2px rgba(255, 0, 80, 0.6), 4px 0 2px rgba(0, 255, 255, 0.6),
              0 0 25px rgba(255,255,255,0.9), 0 0 45px rgba(255,255,255,0.7), 0 0 70px rgba(255,255,255,0.4);
          }

          @media (min-width: 768px) {
            .vcr-font { font-size: 2.5rem; letter-spacing: 0.15em; }
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
          
          /* CRT Squish and Fade Animation */
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
        <div className={`absolute inset-0 z-[200] bg-white pointer-events-none transition-opacity duration-300 ${bootStage === 'tv-on-flash' ? 'opacity-100' : 'opacity-0'}`}></div>

        {/* Main TV Frame */}
        {/* We use #151515 to simulate the dark grey color of an powered-down glass CRT screen */}
        <div className="relative w-full h-full bg-[#151515] rounded-[40px] md:rounded-[80px] overflow-hidden flex items-center justify-center global-bloom-wrap shadow-[0_0_150px_rgba(0,0,0,1)] ring-[24px] ring-[#0a0a0a]">
          
          {/* Active Signal Layer (Disappears entirely when permanently off) */}
          <div className={`absolute inset-0 w-full h-full ${bootStage === 'tv-off-anim' ? 'animate-tv-off' : ''} ${bootStage === 'permanently-off' ? 'hidden' : 'block'}`}>
            
            {/* 1. VIDEO BACKGROUND */}
            <video
              ref={videoRef}
              src={bootStage === 'nosignal' || bootStage === 'tv-off-anim' ? "/static.mp4" : "/noise.mp4"}
              className={`noise-video z-0 ${bootStage === 'off' ? 'opacity-0' : 'opacity-85'}`}
              loop
              muted
              playsInline
            />

            {/* 2. FULL-WIDTH RGB ARTIFACTS OVERLAY */}
            <div className="rgb-artifacts-full"></div>

            {/* 3. MUTE ICON (Displays during No Signal) */}
            {(bootStage === 'nosignal' || bootStage === 'tv-off-anim') && (
              <div className="absolute top-6 left-8 md:top-10 md:left-12 z-[70] vcr-font text-[#0f0] text-4xl md:text-6xl blink-text !text-shadow-none pointer-events-none" style={{textShadow: '0 0 10px #0f0'}}>
                MUTE
              </div>
            )}

            {/* 4. MAIN CONTENT */}
            {(bootStage === 'nosignal' || bootStage === 'tv-off-anim') ? (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
                <a 
                  href="https://djmerkone.com" 
                  className="vcr-font text-6xl md:text-8xl hover:text-red-500 transition-colors duration-200 cursor-pointer"
                >
                  NO SIGNAL
                </a>
              </div>
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
          
          {/* 7. VIGNETTE (Kept outside the turn-off animation so the TV box maintains depth) */}
          <div className="crt-vignette-bezel"></div>

        </div>
      </div>
    </>
  );
}