import React, { useEffect, useRef, useState } from 'react';

export default function App() {
  const [bootStage, setBootStage] = useState('off'); // 'off', 'static', 'on', 'nosignal'
  const [hasAcceptedWarning, setHasAcceptedWarning] = useState(false);
  const videoRef = useRef(null);
  const audioContextRef = useRef(null);
  const noiseNodeRef = useRef(null);
  const gainNodeRef = useRef(null);
  const utteranceRef = useRef(null); // Keeps TTS from being garbage collected

  // Ensure video auto-plays when switching sources to static.mp4
  useEffect(() => {
    if (bootStage === 'nosignal' && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(e => console.log("Video play blocked:", e));
    }
  }, [bootStage]);

  // Stop TTS and Audio if user navigates away or unmounts
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  const handleProceed = async () => {
    // 1. Request Fullscreen
    if (document.documentElement.requestFullscreen) {
      try {
        await document.documentElement.requestFullscreen();
      } catch (err) {
        console.log("Fullscreen request denied or unsupported.");
      }
    }

    setHasAcceptedWarning(true);

    // 2. Play background video
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log("Video play blocked:", e));
    }

    // 3. Initialize Audio Context
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const actx = new AudioContext();
    audioContextRef.current = actx;
    
    const timeNow = actx.currentTime;

    // --- NEW AUDIO SEQUENCE ---

    // A: EAS Dual Tone Alert (Sawtooth waves at 853Hz and 960Hz)
    const easOsc1 = actx.createOscillator();
    const easOsc2 = actx.createOscillator();
    easOsc1.type = 'sawtooth';
    easOsc2.type = 'sawtooth';
    easOsc1.frequency.value = 853; 
    easOsc2.frequency.value = 960; 
    
    const easGain = actx.createGain();
    easGain.gain.setValueAtTime(0, timeNow);
    
    // Burst 1: 0.0s to 0.5s
    easGain.gain.setValueAtTime(0.2, timeNow);
    easGain.gain.setValueAtTime(0, timeNow + 0.5);
    // Pause: 0.5s to 1.0s
    
    // Burst 2: 1.0s to 1.5s
    easGain.gain.setValueAtTime(0.2, timeNow + 1.0);
    easGain.gain.setValueAtTime(0, timeNow + 1.5);
    // Pause: 1.5s to 2.0s
    
    easOsc1.connect(easGain);
    easOsc2.connect(easGain);
    easGain.connect(actx.destination);
    
    easOsc1.start(timeNow);
    easOsc2.start(timeNow);
    easOsc1.stop(timeNow + 1.6);
    easOsc2.stop(timeNow + 1.6);

    // B: 1-Second Sinewave Beep (1000Hz)
    const sineOsc = actx.createOscillator();
    sineOsc.type = 'sine';
    sineOsc.frequency.value = 1000;
    
    const sineGain = actx.createGain();
    sineGain.gain.setValueAtTime(0, timeNow);
    // Beep: 2.0s to 3.0s
    sineGain.gain.setValueAtTime(0.25, timeNow + 2.0); 
    sineGain.gain.setValueAtTime(0, timeNow + 3.0);   
    
    sineOsc.connect(sineGain);
    sineGain.connect(actx.destination);
    
    sineOsc.start(timeNow + 2.0);
    sineOsc.stop(timeNow + 3.1);

    // C: Continuous Background Noise (Starts exactly at 3.0s)
    const contBuffer = actx.createBuffer(1, 2 * actx.sampleRate, actx.sampleRate);
    const contOutput = contBuffer.getChannelData(0);
    for (let i = 0; i < contOutput.length; i++) {
      contOutput[i] = Math.random() * 2 - 1;
    }
    noiseNodeRef.current = actx.createBufferSource();
    noiseNodeRef.current.buffer = contBuffer;
    noiseNodeRef.current.loop = true;
    
    gainNodeRef.current = actx.createGain();
    gainNodeRef.current.gain.setValueAtTime(0, timeNow);
    gainNodeRef.current.gain.setValueAtTime(0.04, timeNow + 3.0); 
    
    noiseNodeRef.current.connect(gainNodeRef.current).connect(actx.destination);
    noiseNodeRef.current.start(timeNow + 3.0);

    // --- VISUAL & TTS SEQUENCE ---
    
    // Switch to intense static burst at 2.7s
    setTimeout(() => setBootStage('static'), 2700);
    
    // Switch to 'on' visual and trigger TTS at exactly 3.0s
    setTimeout(() => {
      setBootStage('on');

      window.speechSynthesis.cancel();

      // Phonetically spelled for TTS
      const textToRead = "dee jay merk one. OPERATING AT THE HIGH-FIDELITY INTERSECTION OF RHYTHM AND PRECISION. A DEFINITIVE ARCHITECT OF THE FLORIDA SOUND, BRIDGING CLASSIC FOUNDATIONS WITH FUTURISTIC CLARITY. ROOTED IN THE 90S PULSE. EVOLVING THROUGH EXPERIMENTAL HIP-HOP, SOULFUL R AND B, LATIN MUSIC, AND DRIVING HOUSE MUSIC. SOUND IS ARCHITECTURE. ENGINEERING IS THE SCIENCE OF EMOTION. HE DOESN'T JUST RECORD MUSIC. HE ENGINEERS THE FUTURE. STAY TUNED.";
      
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utteranceRef.current = utterance; // Store ref so event listener isn't lost
      
      // Make it sound slightly robotic/mechanical
      utterance.pitch = 0.6;
      utterance.rate = 0.9;
      
      const voices = window.speechSynthesis.getVoices();
      const syntheticVoice = voices.find(v => v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('google') || v.lang === 'en-US');
      if (syntheticVoice) {
        utterance.voice = syntheticVoice;
      }

      // Trigger "NO SIGNAL" sequence when voice stops
      utterance.onend = () => {
        setBootStage('nosignal');
        // Smoothly fade out the white noise audio
        if (gainNodeRef.current && audioContextRef.current) {
           gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, audioContextRef.current.currentTime);
           gainNodeRef.current.gain.linearRampToValueAtTime(0, audioContextRef.current.currentTime + 0.3);
        }
      };

      window.speechSynthesis.speak(utterance);
    }, 3000);
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
              -2px -2px 0 #000,  
               2px -2px 0 #000,
              -2px  2px 0 #000,
               2px  2px 0 #000,
               -4px 0 2px rgba(255, 0, 80, 0.6),
               4px 0 2px rgba(0, 255, 255, 0.6),
               0 0 25px rgba(255,255,255,0.9),
               0 0 45px rgba(255,255,255,0.7),
               0 0 70px rgba(255,255,255,0.4);
          }

          @media (min-width: 768px) {
            .vcr-font { 
              font-size: 2.5rem; 
              letter-spacing: 0.15em;
            }
          }

          @keyframes artifact-hop {
            0%   { background-position: 0% 0%; }
            10%  { background-position: 15% -10%; }
            20%  { background-position: -20% 15%; }
            30%  { background-position: 10% 25%; }
            40%  { background-position: -15% -20%; }
            50%  { background-position: 25% 5%; }
            60%  { background-position: -10% -15%; }
            70%  { background-position: 20% 20%; }
            80%  { background-position: -25% 10%; }
            90%  { background-position: 5% -25%; }
            100% { background-position: 0% 0%; }
          }

          /* Broadcast Teleprompter Scroll */
          @keyframes broadcast-scroll {
            0% { transform: translateY(100vh); }
            100% { transform: translateY(-150vh); }
          }

          .animate-scroll {
            /* Smooth 35s vertical scroll */
            animation: broadcast-scroll 35s linear infinite forwards;
          }

          /* INTENSE GLOBAL ANALOG BLOOM */
          .heavy-bloom {
            position: absolute;
            inset: 0;
            z-index: 55;
            filter: blur(24px) brightness(1.9) contrast(120%);
            opacity: 0.75;
            mix-blend-mode: screen;
            pointer-events: none;
            background: inherit;
          }

          .scanlines-overlay {
            position: absolute;
            inset: 0;
            z-index: 56;
            background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.45) 50%);
            background-size: 100% 6px;
            pointer-events: none;
          }

          .crt-vignette-bezel {
            position: absolute;
            inset: 0;
            z-index: 60;
            background: radial-gradient(circle, transparent 30%, rgba(0,0,0,0.6) 100%);
            box-shadow: inset 0 0 180px rgba(0,0,0,0.9);
            pointer-events: none;
          }
          
          .global-bloom-wrap {
            filter: blur(1.2px) contrast(115%) brightness(1.15);
          }

          /* Video handles both 16:9 and 4:3 stretching seamlessly with object-fit cover */
          .noise-video {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: contrast(130%) brightness(1.1) saturate(120%);
          }

          .rgb-artifacts-full {
            position: absolute;
            inset: -20%;
            width: 140%;
            height: 140%;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.35 0.25' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
            background-size: 512px 512px;
            animation: artifact-hop 0.1s steps(4) infinite;
            image-rendering: pixelated;
            filter: contrast(1200%) saturate(500%) brightness(1.3);
            mix-blend-mode: screen;
            opacity: 0.25;
            pointer-events: none;
            z-index: 54;
          }
          
          .blink-text {
            animation: blink 1s step-end infinite;
          }
          
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}
      </style>

      {/* The TV Application Container */}
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

        {/* Main TV Frame */}
        <div className="relative w-full h-full bg-[#111] rounded-[40px] md:rounded-[80px] overflow-hidden flex items-center justify-center global-bloom-wrap shadow-[0_0_150px_rgba(0,0,0,1)] ring-[24px] ring-[#0a0a0a]">
          
          {/* 1. VIDEO BACKGROUND (Switches to static.mp4 when TTS finishes) */}
          <video
            ref={videoRef}
            src={bootStage === 'nosignal' ? "/static.mp4" : "/noise.mp4"}
            className="noise-video z-0 opacity-85"
            loop
            muted
            playsInline
          />

          {/* 2. FULL-WIDTH RGB ARTIFACTS OVERLAY */}
          <div className="rgb-artifacts-full"></div>

          {/* 3. MUTE ICON (Displays during No Signal) */}
          {bootStage === 'nosignal' && (
            <div className="absolute top-6 left-8 md:top-10 md:left-12 z-[70] vcr-font text-[#0f0] text-4xl md:text-6xl blink-text !text-shadow-none pointer-events-none" style={{textShadow: '0 0 10px #0f0'}}>
              MUTE
            </div>
          )}

          {/* 4. MAIN CONTENT (SCROLLING TEXT OR NO SIGNAL) */}
          {bootStage === 'nosignal' ? (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
              <a 
                href="https://djmerkone.com" 
                className="vcr-font text-6xl md:text-8xl hover:text-red-500 transition-colors duration-200 cursor-pointer"
              >
                NO SIGNAL
              </a>
            </div>
          ) : (
            <div className={`absolute inset-0 z-10 flex flex-col items-center overflow-hidden transition-opacity duration-[1500ms] ${bootStage === 'on' ? 'opacity-100' : 'opacity-0'}`}>
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

          {/* 5. BLOOM ENGINE (Luminous glow bleed) */}
          <div className="heavy-bloom"></div>

          {/* 6. SCANLINES & CRT ARTIFACTS */}
          <div className="scanlines-overlay"></div>
          
          {/* 7. VIGNETTE & TUBE DEPTH */}
          <div className="crt-vignette-bezel"></div>

          {/* --- TV POWER ON SEQUENCE --- */}
          <div className={`absolute inset-0 z-[100] bg-black pointer-events-none transition-opacity duration-700 ${bootStage === 'off' ? 'opacity-100' : 'opacity-0'}`}></div>
          <div className={`absolute inset-0 z-[101] pointer-events-none transition-opacity duration-300 ${bootStage === 'static' ? 'opacity-100' : 'opacity-0'}`}>
             <video src="/noise.mp4" className="noise-video opacity-100 contrast-[300%] brightness-150" loop muted autoPlay playsInline />
          </div>

        </div>
      </div>
    </>
  );
}