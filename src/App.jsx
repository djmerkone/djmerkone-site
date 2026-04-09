import React from 'react';

export default function App() {
  return (
    <>
      <style>
        {`
          /* Import classic VCR/OSD pixel font from Google Fonts */
          @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

          .vcr-font {
            font-family: 'VT323', monospace;
            /* Added a white glow (0 0 12px) to simulate phosphor bloom */
            text-shadow: 2px 2px 0px rgba(0,0,0,0.9), 
                         0 0 12px rgba(255, 255, 255, 0.5),
                         0 0 20px rgba(255, 255, 255, 0.2),
                        -1px -1px 0px rgba(0,0,0,0.7), 
                         1px -1px 0px rgba(0,0,0,0.7), 
                        -1px  1px 0px rgba(0,0,0,0.7), 
                         1px  1px 0px rgba(0,0,0,0.7);
          }

          /* VCR OSD Text Jitter (mimics tape tracking instability) */
          @keyframes osd-jitter {
            0%, 100% { transform: translate(0, 0); }
            10% { transform: translate(0.5px, 0px); }
            20% { transform: translate(-0.5px, 0px); }
            30% { transform: translate(1px, 0px); }
            40% { transform: translate(0px, 0px); }
            50% { transform: translate(-0.5px, 0px); }
            60% { transform: translate(0.5px, 0px); }
            70% { transform: translate(0px, 0px); }
            80% { transform: translate(-1px, 0px); }
            90% { transform: translate(0.5px, 0px); }
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

          /* The slow, rolling tracking line artifact */
          @keyframes crt-roll {
            0% { transform: translateY(-10vh); }
            100% { transform: translateY(110vh); }
          }

          /* Subtle brightness flicker mimicking power fluctuations */
          @keyframes crt-flicker {
            0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
            20% { opacity: 0.95; }
            22% { opacity: 0.90; }
            24% { opacity: 0.98; }
            55% { opacity: 0.93; }
          }

          /* --- ANIMATION ASSIGNMENTS --- */
          .animate-roll {
            animation: crt-roll 7s linear infinite;
          }
          
          .animate-flicker {
            animation: crt-flicker 6s ease-in-out infinite;
          }

          .animate-osd {
            animation: osd-jitter 0.5s steps(3) infinite;
          }
          
          /* The magic blur/contrast combo that causes overall soft CRT focus. 
             Increased blur to 1.6px and brightness to 1.15 for a stronger bloomy glow. */
          .crt-bloom {
            filter: blur(1.6px) contrast(135%) brightness(1.15) saturate(130%);
          }
        `}
      </style>

      {/* Outer TV Casing - Black background with padding to create the physical bezel */}
      <div className="relative w-full h-screen bg-[#050505] p-2 sm:p-4 md:p-8 flex items-center justify-center overflow-hidden">
        
        {/* The CRT Screen itself */}
        <div className="relative w-full h-full bg-black rounded-[30px] md:rounded-[50px] overflow-hidden flex items-center justify-center selection:bg-white selection:text-black crt-bloom shadow-[0_0_20px_rgba(0,0,0,1)] ring-4 ring-[#111]">
          
          {/* 1. SMPTE COLOR BARS BACKGROUND */}
          <div className="absolute inset-0 flex flex-col w-full h-full">
            <div className="flex w-full h-[67%]">
              <div className="flex-1 bg-[#c0c0c0]"></div>
              <div className="flex-1 bg-[#c0c000]"></div>
              <div className="flex-1 bg-[#00c0c0]"></div>
              <div className="flex-1 bg-[#00c000]"></div>
              <div className="flex-1 bg-[#c000c0]"></div>
              <div className="flex-1 bg-[#c00000]"></div>
              <div className="flex-1 bg-[#0000c0]"></div>
            </div>
            
            <div className="flex w-full h-[8%]">
              <div className="flex-1 bg-[#0000c0]"></div>
              <div className="flex-1 bg-[#000000]"></div>
              <div className="flex-1 bg-[#c000c0]"></div>
              <div className="flex-1 bg-[#000000]"></div>
              <div className="flex-1 bg-[#00c0c0]"></div>
              <div className="flex-1 bg-[#000000]"></div>
              <div className="flex-1 bg-[#c0c0c0]"></div>
            </div>

            <div className="flex w-full h-[25%]">
              <div className="w-[14.28%] bg-[#00214c]"></div>
              <div className="w-[14.28%] bg-[#ffffff]"></div>
              <div className="w-[14.28%] bg-[#32006a]"></div>
              <div className="flex-1 bg-[#000000]"></div>
            </div>
          </div>

          {/* 2. FOREGROUND CONTENT (Classic VCR Text with OSD Jitter) */}
          <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 text-center vcr-font text-white leading-tight animate-osd">
            <h1 className="text-5xl md:text-7xl lg:text-8xl tracking-wider uppercase mb-2">
              COMING SOON
            </h1>
            <h2 className="text-3xl md:text-5xl lg:text-6xl tracking-widest lowercase">
              ~djmerkone
            </h2>
          </div>

          {/* --- CRT EFFECTS LAYERS --- */}
          
          {/* 3. Static Scanlines */}
          <div 
            className="absolute inset-0 z-30 pointer-events-none mix-blend-multiply opacity-[0.25]"
            style={{
              backgroundImage: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.5) 50%)',
              backgroundSize: '100% 4px'
            }}
          ></div>

          {/* 4. Rolling Tracking Artifact */}
          <div 
            className="absolute top-0 left-0 w-full h-[15vh] z-40 pointer-events-none opacity-[0.15] animate-roll mix-blend-color-burn"
            style={{
              background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.8) 50%, transparent)'
            }}
          ></div>

          {/* 5. TRUE COLORFUL UHF STATIC */}
          <div 
            className="absolute inset-0 w-full h-full z-45 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='turbulence' baseFrequency='0.2 0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundSize: '200px 200px',
              animation: 'tv-static 0.2s steps(4) infinite',
              filter: 'contrast(400%) saturate(500%) brightness(1.1)',
              opacity: 0.30,
              mixBlendMode: 'normal'
            }}
          ></div>

          {/* 6. Curved CRT Glass Tube Inner Shadow */}
          <div className="absolute inset-0 z-50 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8),_inset_0_0_30px_rgba(0,0,0,0.6)] animate-flicker"></div>

        </div>
      </div>
    </>
  );
}