import React from 'react';

export default function App() {
  return (
    <div className="relative w-full h-screen bg-white overflow-hidden flex items-center justify-center font-sans selection:bg-black selection:text-white">
      
      {/* Background Image Layer */}
      {/* Using an img tag is often more reliable for public assets on deployments like Vercel */}
      <img 
        src="/bg1.jpg" 
        alt="djmerkone background"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-30"
      />

      {/* Whitewash Overlay */}
      {/* A radial gradient that is slightly transparent in the center and pure white at the edges to blend the image out */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.9)_100%)] pointer-events-none z-0"></div>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col items-center justify-center p-8 text-center">
        {/* Solid black text, absolutely no shadows */}
        <h1 className="text-5xl md:text-8xl font-black text-black tracking-tighter mb-4 lowercase">
          djmerkone
        </h1>
        
        {/* Simple crisp black/grey divider */}
        <div className="h-[2px] w-full max-w-[200px] bg-black/20 mb-6"></div>
        
        <h2 className="text-lg md:text-2xl font-light text-black tracking-[0.4em] uppercase">
          coming soon
        </h2>
      </div>

    </div>
  );
}