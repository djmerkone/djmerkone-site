import React, { useState, useEffect } from 'react';

export default function App() {
  const [bootStage, setBootStage] = useState('off'); // 'off', 'static', 'on'

  useEffect(() => {
    // Sequence the CRT boot animation
    const t1 = setTimeout(() => setBootStage('static'), 600); // Black screen for 600ms
    const t2 = setTimeout(() => setBootStage('on'), 1200); // Intense static for 600ms

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <>
      <style>
        {`
          /* Load the custom TTF font directly from the public folder */
          @font-face {
            font-family: 'ButterPress';
            src: url('/ButterPress-ywnrq.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }

          .custom-font {
            font-family: 'ButterPress', sans-serif;
          }

          /* True TV Static overlay (Snaps positions randomly to mimic real chaotic noise) */
          @keyframes tv-static {
            0%   { background-position: 0px 0px; }
            20%  { background-position: -50px 100px; }
            40%  { background-position: 80px -40px; }
            60%  { background-position: -30px 20px; }
            80%  { background-position: 100px 50px; }
            100% { background-position: 0px 0px; }
          }

          /* Smooth, gentle breathing for the text edges */
          @keyframes smooth-bloom-1 {
            0% { transform: translate(0px, 0px); opacity: 0.3; }
            50% { transform: translate(1px, 1px); opacity: 0.6; }
            100% { transform: translate(0px, 0px); opacity: 0.3; }
          }
          
          @keyframes smooth-bloom-2 {
            0% { transform: translate(0px, 0px); opacity: 0.5; }
            50% { transform: translate(-1px, -1px); opacity: 0.2; }
            100% { transform: translate(0px, 0px); opacity: 0.5; }
          }

          /* The slow, rolling tracking line artifact */
          @keyframes crt-roll {
            0% { transform: translateY(-10vh); }
            100% { transform: translateY(110vh); }
          }

          /* Realistic Phosphor Ghosting Morph - Text 1 (djmerkone) */
          @keyframes morph-1 {
            0%, 42% { opacity: 1; filter: blur(0px); transform: scale(1) skewX(0deg); color: black; text-shadow: none; }
            43% { opacity: 0.9; filter: blur(2px); transform: scale(1.02) skewX(-12deg); color: #222; text-shadow: 8px 0 2px rgba(255,255,255,0.5), -8px 0 2px rgba(200,200,200,0.5); }
            45% { opacity: 0.6; filter: blur(6px); transform: scale(1.05) skewX(5deg); color: #777; text-shadow: 0 0 20px rgba(255,255,255,0.8); }
            48%, 92% { opacity: 0; filter: blur(12px); transform: scale(1.05) skewX(0deg); color: transparent; text-shadow: none; }
            94% { opacity: 0.6; filter: blur(6px); transform: scale(0.95) skewX(-5deg); color: #777; text-shadow: 0 0 20px rgba(255,255,255,0.8); }
            96% { opacity: 0.9; filter: blur(2px); transform: scale(0.98) skewX(12deg); color: #222; text-shadow: 8px 0 2px rgba(255,255,255,0.5), -8px 0 2px rgba(200,200,200,0.5); }
            98%, 100% { opacity: 1; filter: blur(0px); transform: scale(1) skewX(0deg); color: black; text-shadow: none; }
          }

          /* Realistic Phosphor Ghosting Morph - Text 2 (coming soon) */
          @keyframes morph-2 {
            0%, 42% { opacity: 0; filter: blur(12px); transform: scale(1.05) skewX(0deg); color: transparent; text-shadow: none; }
            44% { opacity: 0.6; filter: blur(6px); transform: scale(0.95) skewX(-5deg); color: #777; text-shadow: 0 0 20px rgba(255,255,255,0.8); }
            46% { opacity: 0.9; filter: blur(2px); transform: scale(0.98) skewX(12deg); color: #222; text-shadow: 8px 0 2px rgba(255,255,255,0.5), -8px 0 2px rgba(200,200,200,0.5); }
            48%, 92% { opacity: 1; filter: blur(0px); transform: scale(1) skewX(0deg); color: black; text-shadow: none; }
            93% { opacity: 0.9; filter: blur(2px); transform: scale(1.02) skewX(-12deg); color: #222; text-shadow: 8px 0 2px rgba(255,255,255,0.5), -8px 0 2px rgba(200,200,200,0.5); }
            95% { opacity: 0.6; filter: blur(6px); transform: scale(1.05) skewX(5deg); color: #777; text-shadow: 0 0 20px rgba(255,255,255,0.8); }
            98%, 100% { opacity: 0; filter: blur(12px); transform: scale(1.05) skewX(0deg); color: transparent; text-shadow: none; }
          }

          /* --- ANIMATION ASSIGNMENTS --- */

          .animate-roll {
            animation: crt-roll 7s linear infinite;
          }

          .morph-text-1 {
            animation: morph-1 12s ease-in-out infinite;
          }

          .morph-text-2 {
            animation: morph-2 12s ease-in-out infinite;
          }

          /* Smooth, gentle edge outlines */
          .bloom-layer-1 {
            animation: smooth-bloom-1 4s ease-in-out infinite;
            color: transparent; 
            -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.6); 
            mix-blend-mode: screen;
          }
          
          .bloom-layer-2 {
            animation: smooth-bloom-2 3s ease-in-out infinite;
            color: transparent; 
            -webkit-text-stroke: 1px rgba(200, 200, 200, 0.4); 
            mix-blend-mode: screen;
          }
          
          /* The magic blur/contrast combo that causes overall soft focus */
          .crt-bloom {
            filter: blur(0.8px) contrast(130%) saturate(110%);
          }
        `}
      </style>

      {/* Outer TV Casing - Black background with padding to create the physical bezel */}
      <div className="relative w-full h-screen bg-[#050505] p-2 sm:p-4 md:p-8 flex items-center justify-center overflow-hidden">
        
        {/* The CRT Screen itself */}
        <div className="relative w-full h-full bg-white rounded-[30px] md:rounded-[50px] overflow-hidden flex items-center justify-center selection:bg-black selection:text-white crt-bloom shadow-[0_0_20px_rgba(0,0,0,1)] ring-4 ring-[#111]">
          
          {/* Main Content Wrapper - Animates in after the boot sequence */}
          <div className={`absolute inset-0 transition-all duration-[1500ms] ease-out flex items-center justify-center ${bootStage === 'on' ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-105 blur-md'}`}>
            
            {/* 1. Background Image Layer */}
            <img 
              src="/bg1.png" 
              alt="djmerkone background"
              className="absolute inset-0 w-full h-full object-cover object-center opacity-20"
            />

            {/* 2. Whitewash Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.5)_50%,rgba(255,255,255,0)_100%)] z-0"></div>

            {/* 3. Foreground Content (Phosphor Morphing Custom Font with gentle inner outline bloom) */}
            <div className="relative z-10 flex items-center justify-center w-full h-64">
              <h1 className="absolute text-7xl md:text-[9rem] text-black tracking-tight lowercase custom-font morph-text-1 text-center w-full leading-none">
                djmerkone
                <span className="absolute inset-0 bloom-layer-1 pointer-events-none" aria-hidden="true">djmerkone</span>
                <span className="absolute inset-0 bloom-layer-2 pointer-events-none" aria-hidden="true">djmerkone</span>
              </h1>
              <h1 className="absolute text-6xl md:text-[8rem] text-black tracking-tight lowercase custom-font morph-text-2 text-center w-full leading-none">
                coming soon
                <span className="absolute inset-0 bloom-layer-1 pointer-events-none" aria-hidden="true">coming soon</span>
                <span className="absolute inset-0 bloom-layer-2 pointer-events-none" aria-hidden="true">coming soon</span>
              </h1>
            </div>
          </div>

          {/* --- CRT EFFECTS LAYERS --- */}
          
          {/* 4. Static Scanlines */}
          <div 
            className="absolute inset-0 z-30 pointer-events-none mix-blend-multiply opacity-[0.15]"
            style={{
              backgroundImage: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.4) 50%)',
              backgroundSize: '100% 4px'
            }}
          ></div>

          {/* 5. RGB Phosphor Sub-pixel Artifacts */}
          <div 
            className="absolute inset-0 z-35 pointer-events-none mix-blend-multiply opacity-[0.06]"
            style={{
              backgroundImage: 'linear-gradient(90deg, rgba(255,0,0,1) 0%, rgba(255,0,0,1) 33%, rgba(0,255,0,1) 33%, rgba(0,255,0,1) 66%, rgba(0,0,255,1) 66%, rgba(0,0,255,1) 100%)',
              backgroundSize: '3px 100%'
            }}
          ></div>

          {/* 6. Rolling Tracking Artifact */}
          <div 
            className="absolute top-0 left-0 w-full h-[15vh] z-40 pointer-events-none opacity-10 animate-roll mix-blend-color-burn"
            style={{
              background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.8) 50%, transparent)'
            }}
          ></div>

          {/* 7. NEW: MULTI-COLORED PERSISTENT RGB STATIC (Covers the whole site at 10% opacity) */}
          <div 
            className="absolute -inset-[10%] w-[120%] h-[120%] z-45 pointer-events-none opacity-[0.10]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6 0.2' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundSize: '150px 150px',
              animation: 'tv-static 0.2s steps(4) infinite',
              /* This specific filter violently forces the SVG noise into high-contrast BLK/R/G/B/WHT pixels */
              filter: 'contrast(400%) saturate(400%) brightness(0.9)'
            }}
          ></div>

          {/* --- BOOT SEQUENCE OVERLAYS --- */}
          
          {/* Intense Static Burst (During boot) */}
          <div className={`absolute inset-0 z-[48] bg-white pointer-events-none transition-opacity duration-300 ${bootStage === 'static' ? 'opacity-100' : 'opacity-0'}`}>
             <div 
              className="absolute inset-0 opacity-80 mix-blend-difference"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                backgroundSize: '150px 150px',
                animation: 'tv-static 0.2s steps(4) infinite'
              }}
            ></div>
          </div>

          {/* Black Screen (TV Off) */}
          <div className={`absolute inset-0 z-[49] bg-black pointer-events-none transition-opacity duration-150 ${bootStage === 'off' ? 'opacity-100' : 'opacity-0'}`}></div>

          {/* 8. Curved CRT Glass Tube Inner Shadow */}
          <div className="absolute inset-0 z-50 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8),_inset_0_0_30px_rgba(0,0,0,0.6)]"></div>

        </div>
      </div>
    </>
  );
}