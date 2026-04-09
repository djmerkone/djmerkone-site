import React, { useEffect, useRef, useState } from 'react';

export default function App() {
  const [bootStage, setBootStage] = useState('off'); // 'off', 'static', 'on'
  const [audioEnabled, setAudioEnabled] = useState(false);
  const videoRef = useRef(null);
  const audioContextRef = useRef(null);
  const noiseNodeRef = useRef(null);
  const gainNodeRef = useRef(null);

  useEffect(() => {
    // Sequence: Off -> Burst -> On
    const t1 = setTimeout(() => setBootStage('static'), 300);
    const t2 = setTimeout(() => setBootStage('on'), 850);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleInteraction = () => {
    // Attempt to play the background video if it's not playing
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.log("Video play blocked:", e));
    }

    if (!audioEnabled && !audioContextRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioContext();
      const bufferSize = 2 * audioContextRef.current.sampleRate;
      const noiseBuffer = audioContextRef.current.createBuffer(1, bufferSize, audioContextRef.current.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      noiseNodeRef.current = audioContextRef.current.createBufferSource();
      noiseNodeRef.current.buffer = noiseBuffer;
      noiseNodeRef.current.loop = true;
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.gain.setValueAtTime(0.04, audioContextRef.current.currentTime);
      noiseNodeRef.current.connect(gainNodeRef.current);
      gainNodeRef.current.connect(audioContextRef.current.destination);
      noiseNodeRef.current.start();
      setAudioEnabled(true);
    } else if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
      setAudioEnabled(true);
    }
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

          .vcr-font {
            font-family: 'VT323', monospace;
            color: #fff;
            /* Wider, bolder text matching the reference image */
            font-size: 3.5rem;
            letter-spacing: 0.15em;
            transform: scaleX(1.3); /* Horizontally stretching the text for that wide OSD look */
            text-shadow: 
              -2px -2px 0 #000,  
               2px -2px 0 #000,
              -2px  2px 0 #000,
               2px  2px 0 #000,
               0 0 15px rgba(255,255,255,0.7),
               0 0 30px rgba(255,255,255,0.4);
          }

          @media (min-width: 768px) {
            .vcr-font { font-size: 6rem; }
          }

          /* INTENSE GLOBAL ANALOG BLOOM */
          .heavy-bloom {
            position: absolute;
            inset: 0;
            z-index: 55;
            filter: blur(18px) brightness(1.6) contrast(115%);
            opacity: 0.55;
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
            background: radial-gradient(circle, transparent 35%, rgba(0,0,0,0.55) 100%);
            box-shadow: inset 0 0 160px rgba(0,0,0,0.85);
            pointer-events: none;
          }
          
          .global-bloom-wrap {
            filter: blur(0.7px) contrast(110%) brightness(1.1);
          }

          .noise-video {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            /* Boost the video's contrast to make the whites searing */
            filter: contrast(160%) brightness(1.3) saturate(140%);
          }
        `}
      </style>

      {/* Click anywhere to start the noise audio and ensure video playback */}
      <div 
        onClick={handleInteraction}
        className="relative w-full h-screen bg-[#020202] p-2 sm:p-6 md:p-12 flex items-center justify-center overflow-hidden cursor-pointer"
      >
        
        {/* Main TV Frame */}
        <div className="relative w-full h-full bg-[#111] rounded-[40px] md:rounded-[80px] overflow-hidden flex items-center justify-center global-bloom-wrap shadow-[0_0_150px_rgba(0,0,0,1)] ring-[24px] ring-[#0a0a0a]">
          
          {/* 1. VIDEO BACKGROUND (noise.mp4) */}
          <video
            ref={videoRef}
            src="/noise.mp4"
            className="noise-video z-0 opacity-85"
            loop
            muted
            autoPlay
            playsInline
          />

          {/* 2. MAIN CONTENT (COMING SOON) */}
          <div className={`relative z-10 flex flex-col items-center justify-center w-full px-4 text-center transition-opacity duration-[1500ms] ${bootStage === 'on' ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className="vcr-font select-none">
              COMING SOON
            </h1>
          </div>

          {/* 3. BLOOM ENGINE (Luminous glow bleed) */}
          <div className="heavy-bloom"></div>

          {/* 4. SCANLINES & CRT ARTIFACTS */}
          <div className="scanlines-overlay"></div>
          
          {/* Rolling shutter removed as requested */}

          {/* 5. VIGNETTE & TUBE DEPTH */}
          <div className="crt-vignette-bezel"></div>

          {/* --- TV POWER ON SEQUENCE --- */}
          <div className={`absolute inset-0 z-[100] bg-black pointer-events-none transition-opacity duration-700 ${bootStage === 'off' ? 'opacity-100' : 'opacity-0'}`}></div>
          <div className={`absolute inset-0 z-[101] pointer-events-none transition-opacity duration-300 ${bootStage === 'static' ? 'opacity-100' : 'opacity-0'}`}>
             {/* Power-on static flash using a brighter version of the video */}
             <video src="/noise.mp4" className="noise-video opacity-100 contrast-[300%] brightness-150" loop muted autoPlay playsInline />
          </div>

        </div>
      </div>
    </>
  );
}