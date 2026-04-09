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

          /* Fine, chaotic static grain animation */
          @keyframes crt-grain {
            0%, 100% { transform: translate(0, 0); }
            10% { transform: translate(-1%, -1%); }
            20% { transform: translate(1%, 1%); }
            30% { transform: translate(-2%, -1%); }
            40% { transform: translate(1%, -2%); }
            50% { transform: translate(-1%, 2%); }
            60% { transform: translate(2%, 1%); }
            70% { transform: translate(-2%, 2%); }
            80% { transform: translate(1%, -1%); }
            90% { transform: translate(-1%, -2%); }
          }

          /* Subtle brightness flicker mimicking power fluctuations */
          @keyframes crt-flicker {
            0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
            20% { opacity: 0.92; }
            22% { opacity: 0.88; }
            24% { opacity: 0.95; }
            55% { opacity: 0.90; }
          }

          /* The slow, rolling tracking line artifact */
          @keyframes crt-roll {
            0% { transform: translateY(-10vh); }
            100% { transform: translateY(110vh); }
          }

          /* Phosphor Ghosting Morph - Text 1 */
          @keyframes morph-1 {
            0%, 38%   { opacity: 1; filter: blur(0px); transform: scale(1); }
            43%, 57%  { opacity: 0; filter: blur(12px); transform: scale(1.05); }
            62%, 88%  { opacity: 0; filter: blur(12px); transform: scale(0.95); }
            93%, 100% { opacity: 1; filter: blur(0px); transform: scale(1); }
          }

          /* Phosphor Ghosting Morph - Text 2 */
          @keyframes morph-2 {
            0%, 38%   { opacity: 0; filter: blur(12px); transform: scale(0.95); }
            43%, 57%  { opacity: 1; filter: blur(0px); transform: scale(1); }
            62%, 88%  { opacity: 1; filter: blur(0px); transform: scale(1); }
            93%, 100% { opacity: 0; filter: blur(12px); transform: scale(1.05); }
          }

          .animate-grain {
            animation: crt-grain 0.3s steps(10) infinite;
          }
          
          .animate-flicker {
            animation: crt-flicker 5s infinite;
          }

          .animate-roll {
            animation: crt-roll 7s linear infinite;
          }

          .morph-text-1 {
            animation: morph-1 10s infinite ease-in-out;
          }

          .morph-text-2 {
            animation: morph-2 10s infinite ease-in-out;
          }
          
          /* The magic blur/contrast combo that causes Phosphor Bloom */
          .crt-bloom {
            filter: blur(0.8px) contrast(130%) saturate(110%);
          }
        `}
      </style>

      {/* Outer TV Casing - Black background with padding to create the physical bezel */}
      <div className="relative w-full h-screen bg-[#050505] p-2 sm:p-4 md:p-8 flex items-center justify-center overflow-hidden">
        
        {/* The CRT Screen itself - Rounded corners, clipped overflow, and bloom applied here */}
        <div className="relative w-full h-full bg-white rounded-[30px] md:rounded-[50px] overflow-hidden flex items-center justify-center selection:bg-black selection:text-white animate-flicker crt-bloom shadow-[0_0_20px_rgba(0,0,0,1)] ring-4 ring-[#111]">
          
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

            {/* 3. Foreground Content (Phosphor Morphing Custom Font) */}
            <div className="relative z-10 flex items-center justify-center w-full h-64">
              <h1 className="absolute text-7xl md:text-[9rem] text-black tracking-tight lowercase custom-font morph-text-1 text-center w-full leading-none">
                djmerkone
              </h1>
              <h1 className="absolute text-6xl md:text-[8rem] text-black tracking-tight lowercase custom-font morph-text-2 text-center w-full leading-none">
                coming soon
              </h1>
            </div>
          </div>

          {/* --- CRT EFFECTS LAYERS --- */}
          
          {/* 4. Fine Animated Grain */}
          <div 
            className="absolute -inset-[10%] w-[120%] h-[120%] z-20 pointer-events-none opacity-[0.08] mix-blend-multiply animate-grain"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          ></div>

          {/* 4.5 Random RGB Noise Artifacts */}
          <div 
            className="absolute -inset-[10%] w-[120%] h-[120%] z-25 pointer-events-none mix-blend-multiply animate-artifacts"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              filter: 'contrast(400%) saturate(500%)',
            }}
          ></div>

          {/* 5. Static Scanlines */}
          <div 
            className="absolute inset-0 z-30 pointer-events-none mix-blend-multiply opacity-25"
            style={{
              backgroundImage: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.4) 50%)',
              backgroundSize: '100% 4px'
            }}
          ></div>

          {/* 6. RGB Phosphor Sub-pixel Artifacts */}
          <div 
            className="absolute inset-0 z-35 pointer-events-none mix-blend-multiply opacity-[0.12]"
            style={{
              backgroundImage: 'linear-gradient(90deg, rgba(255,0,0,1) 0%, rgba(255,0,0,1) 33%, rgba(0,255,0,1) 33%, rgba(0,255,0,1) 66%, rgba(0,0,255,1) 66%, rgba(0,0,255,1) 100%)',
              backgroundSize: '3px 100%'
            }}
          ></div>

          {/* 7. Rolling Tracking Artifact */}
          <div 
            className="absolute top-0 left-0 w-full h-[15vh] z-40 pointer-events-none opacity-15 animate-roll mix-blend-color-burn"
            style={{
              background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.8) 50%, transparent)'
            }}
          ></div>

          {/* --- BOOT SEQUENCE OVERLAYS --- */}
          
          {/* Intense Static Burst */}
          <div className={`absolute inset-0 z-[48] bg-white pointer-events-none transition-opacity duration-300 ${bootStage === 'static' ? 'opacity-100' : 'opacity-0'}`}>
             <div 
              className="absolute inset-0 opacity-80 mix-blend-difference animate-grain"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
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