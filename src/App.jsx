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
               -4px 0 2px rgba(255, 0, 80, 0.6), /* Stronger Magenta aberration */
               4px 0 2px rgba(0, 255, 255, 0.6), /* Stronger Cyan aberration */
               0 0 20px rgba(255,255,255,0.8),
               0 0 40px rgba(255,255,255,0.4);
          }

          @media (min-width: 768px) {
            .vcr-font { font-size: 6rem; }
          }

          /* Faster, more chaotic snapping for the RGB artifacts */
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

          /* INTENSE GLOBAL ANALOG BLOOM */
          .heavy-bloom {
            position: absolute;
            inset: 0;
            z-index: 55;
            filter: blur(20px) brightness(1.7) contrast(110%);
            opacity: 0.6;
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
            filter: blur(0.8px) contrast(115%) brightness(1.1);
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

          /* Full-width RGB Artifacts Overlay */
          .rgb-artifacts-full {
            position: absolute;
            inset: -20%;
            width: 140%;
            height: 140%;
            /* Updated Frequency to prevent vertical banding artifacts */
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.35 0.25' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
            background-size: 512px 512px;
            animation: artifact-hop 0.1s steps(4) infinite;
            image-rendering: pixelated;
            /* Intense RGB pop */
            filter: contrast(1200%) saturate(500%) brightness(1.3);
            mix-blend-mode: screen;
            opacity: 0.25;
            pointer-events: none;
            z-index: 54;
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

          {/* 2. FULL-WIDTH RGB ARTIFACTS OVERLAY */}
          <div className="rgb-artifacts-full"></div>

          {/* 3. MAIN CONTENT (COMING SOON) */}
          <div className={`relative z-10 flex flex-col items-center justify-center w-full px-4 text-center transition-opacity duration-[1500ms] ${bootStage === 'on' ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className="vcr-font select-none">
              COMING SOON
            </h1>
          </div>

          {/* 4. BLOOM ENGINE (Luminous glow bleed) */}
          <div className="heavy-bloom"></div>

          {/* 5. SCANLINES & CRT ARTIFACTS */}
          <div className="scanlines-overlay"></div>
          
          {/* 6. VIGNETTE & TUBE DEPTH */}
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