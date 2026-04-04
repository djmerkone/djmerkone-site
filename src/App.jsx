import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  X, 
  Mail, 
  BookOpen, 
  ArrowRight,
  ChevronRight,
  Disc,
  ArrowDown,
  Activity,
  Box,
  Layers,
  Terminal,
  Zap
} from 'lucide-react';

// --- CUSTOM BUILD-SAFE ICONS ---
const InstagramIcon = (props) => (
  <svg {...props} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const YoutubeIcon = (props) => (
  <svg {...props} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
);

// --- TOP 3 RECENT RELEASES ---
const FEATURED_WORKS = [
  { 
    id: "LOG_01",
    artist: "marilyn torres", 
    title: "don't let me", 
    role: "Producer / Engineer / Mastering", 
    year: "2026",
    cover: "https://m.media-amazon.com/images/I/41gl0MgSbrL._UX358_FMwebp_QL85_.jpg",
    link: "https://music.apple.com/us/album/dont-let-me/1870639799"
  },
  { 
    id: "LOG_02",
    artist: "jase david", 
    title: "threads", 
    role: "Producer / Mastering", 
    year: "2026",
    cover: "https://m.media-amazon.com/images/I/51VA2eGveuL._UX358_FMwebp_QL85_.jpg",
    link: "https://music.apple.com/us/album/threads-ep/1864168921"
  },
  { 
    id: "LOG_03",
    artist: "marilyn torres", 
    title: "the ep", 
    role: "Producer / Engineer / Mastering", 
    year: "2026",
    cover: "https://m.media-amazon.com/images/I/41w+uNCU8ZL._UX358_FMwebp_QL85_.jpg",
    link: "https://music.apple.com/us/album/the-ep/1850311861"
  },
];

// --- COMPREHENSIVE ARCHIVE LIST ---
const ARCHIVE_LIST = [
  { artist: "a'lisa b", title: "sunshine", role: "Remix" },
  { artist: "aby cruz", title: "it won't be long", role: "Prod" },
  { artist: "aktual", title: "don't forsake me", role: "Remix" },
  { artist: "apocalypsis", title: "tu cuerpo", role: "Prod" },
  { artist: "coro", title: "mona lisa", role: "Remix" },
  { artist: "depeche mode", title: "precious", role: "Remix" },
  { artist: "djmerkone", title: "the anomaly", role: "Artist" },
  { artist: "e'dee", title: "sunrise", role: "Remix" },
  { artist: "luis marte", title: "the chase", role: "Master" },
  { artist: "mia martina", title: "latin mood", role: "Remix" },
  { artist: "ricardo vazquez", title: "now that i", role: "Prod" },
];

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [formStatus, setFormStatus] = useState('idle');
  const [formData, setFormData] = useState({ name: '', email: '', vibe: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');
    const FORMSPREE_URL = "https://formspree.io/f/xbdpzwvn";
    try {
      const response = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setFormStatus('success');
        setFormData({ name: '', email: '', vibe: '' });
        setTimeout(() => setFormStatus('idle'), 5000);
      } else { throw new Error(); }
    } catch (err) {
      setFormStatus('idle');
      alert("Submission Error. Reach out via IG @djmerkone.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f5f7] font-sans selection:bg-white selection:text-black overflow-x-hidden">
      
      {/* --- BLUEPRINT GRID OVERLAY --- */}
      <div className="fixed inset-0 pointer-events-none z-[1] opacity-[0.03] grid-pattern"></div>

      {/* --- SPLASH SCREEN --- */}
      {!hasEntered && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8 animate-fade-in">
          <div className="relative space-y-8 text-center max-w-sm w-full">
            <div className="flex justify-between items-center opacity-20 border-b border-white/10 pb-4">
              <span className="text-[9px] font-black uppercase tracking-widest">System_Init</span>
              <span className="text-[9px] font-black uppercase tracking-widest">Est_2001</span>
            </div>
            <h1 className="text-6xl font-black tracking-tightest lowercase italic leading-none animate-reveal-slow pt-4">
              djmerkone
            </h1>
            <div className="w-full bg-white/5 h-[1px] relative overflow-hidden">
               <div className="absolute top-0 left-0 h-full bg-white animate-progress"></div>
            </div>
            <button 
              onClick={() => setHasEntered(true)}
              className="group flex items-center justify-between gap-6 w-full p-8 border border-white/5 bg-white/[0.02] hover:bg-white hover:text-black transition-all duration-700 rounded-3xl"
            >
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">Open Vault</span>
              <ArrowRight size={24} strokeWidth={1} />
            </button>
          </div>
        </div>
      )}

      {/* --- MAIN NAVIGATION --- */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-1000 ${hasEntered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 py-8 flex justify-between items-center">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <span className="text-xl font-black tracking-tightest lowercase italic">djmerkone</span>
            <div className="h-4 w-px bg-white/10 hidden md:block"></div>
            <span className="text-[8px] font-black uppercase tracking-[0.6em] text-white/20 hidden md:block">Engineered in Florida</span>
          </div>
          <div className="flex items-center gap-6 md:gap-16 bg-white/[0.03] backdrop-blur-md px-8 py-4 rounded-full border border-white/5">
            <a href="#about" className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity">Bio</a>
            <a href="#catalog" className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity">Work</a>
            <a href="#contact" className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity">Session</a>
          </div>
        </div>
      </nav>

      <main className={`${hasEntered ? 'block' : 'hidden'}`}>
        
        {/* --- HERO SECTION --- */}
        <section id="home" className="h-[100svh] flex flex-col items-center justify-center text-center px-6 relative bg-black overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src="/PSX_20241204_111437.jpg" className="w-full h-full object-cover grayscale brightness-[0.2] scale-110 motion-safe:animate-ken-burns" alt="hero" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]"></div>
          </div>
          
          <div className="relative z-10 space-y-12 max-w-7xl w-full">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4 opacity-20 mb-6">
                <span className="text-[10px] font-black uppercase tracking-[1em] italic">Beyond the Noise</span>
              </div>
              <h1 className="text-[15vw] md:text-[13vw] font-black tracking-tightest leading-[0.75] italic lowercase text-white">High Fidelity <br /> <span className="text-outline text-transparent opacity-40">Engineering</span></h1>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 pt-10">
               <div className="flex items-center gap-4 group cursor-pointer border border-white/5 px-6 py-4 rounded-2xl bg-white/[0.02]">
                  <Activity size={16} className="text-white/20 group-hover:text-white transition-colors" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Active_Registry</span>
               </div>
               <p className="text-xl md:text-3xl font-light text-white/30 lowercase tracking-wide max-w-xl leading-relaxed italic">
                 curating rhythm and precision for global <span className="text-white">sonic architectures</span>.
               </p>
            </div>
          </div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-10">
             <div className="h-16 w-px bg-gradient-to-b from-white to-transparent"></div>
          </div>
        </section>

        {/* --- ABOUT / BLUEPRINT BIO --- */}
        <section id="about" className="py-32 md:py-64 bg-[#f5f5f7] text-black px-6 md:px-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02] grid-pattern-dark pointer-events-none"></div>
          
          <div className="max-w-screen-2xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-12 gap-16 md:gap-32 items-start">
               {/* Left Column: Graphics & Image */}
               <div className="lg:col-span-5 space-y-12 order-2 lg:order-1">
                  <div className="relative group">
                    <div className="absolute -top-6 -left-6 w-32 h-32 border-l border-t border-black/10 pointer-events-none"></div>
                    <div className="aspect-[4/5] overflow-hidden rounded-[2rem] border border-black/[0.05] grayscale brightness-90 transition-all duration-1000 group-hover:brightness-100 group-hover:scale-[1.01] shadow-2xl">
                      <img src="/Dofoto_20241208_075521208.jpg" className="w-full h-full object-cover" alt="merkone" />
                    </div>
                    <div className="absolute -bottom-4 -right-4 p-8 bg-black text-white rounded-3xl shadow-3xl text-left min-w-[200px]">
                       <span className="text-[8px] font-black uppercase tracking-[1em] block mb-2 opacity-40">System_01</span>
                       <p className="text-2xl font-black italic lowercase tracking-tightest">Active_Archive</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-6 border border-black/5 rounded-2xl bg-black/[0.01]">
                        <span className="text-[8px] font-black uppercase tracking-widest text-black/30 block mb-2">Established</span>
                        <p className="font-bold text-xl tracking-tighter">2001</p>
                     </div>
                     <div className="p-6 border border-black/5 rounded-2xl bg-black/[0.01]">
                        <span className="text-[8px] font-black uppercase tracking-widest text-black/30 block mb-2">Location</span>
                        <p className="font-bold text-xl tracking-tighter italic">FL_USA</p>
                     </div>
                  </div>
               </div>

               {/* Right Column: Narrative */}
               <div className="lg:col-span-7 space-y-16 order-1 lg:order-2 text-left">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 opacity-20">
                        <span className="text-[10px] font-black tracking-widest uppercase italic whitespace-nowrap">Technical Record // History</span>
                        <div className="h-px w-full bg-black"></div>
                    </div>
                    <h2 className="text-7xl md:text-[10vw] font-black lowercase italic tracking-tightest leading-none">Merkone</h2>
                  </div>
                  
                  <div className="space-y-10 text-2xl md:text-5xl text-black leading-[1.05] font-light lowercase">
                     <p>
                       operating at the high-fidelity intersection of rhythm and precision, <span className="italic font-bold border-b-[4px] md:border-b-[10px] border-black/[0.05]">djmerkone</span> has established himself as a definitive architect of the florida sound.
                     </p>
                  </div>

                  <div className="space-y-12 text-lg md:text-2xl text-black/60 leading-relaxed font-light lowercase border-t border-black/5 pt-16">
                    <p>
                      his journey began in the late 90s dj scene—a foundational era where merk developed a biological understanding of acoustics. in <span className="text-black font-bold">1999</span>, he transitioned into professional production, a move that culminated in his first official release in <span className="text-black font-bold italic underline decoration-black/10">2001</span>.
                    </p>
                    <p>
                      as a producer and mastering engineer, merkone views sound as architecture. engineering is the science of emotion; his precision in the studio ensures that every frequency serves a purpose, allowing the artist's vision to cut through the noise.
                    </p>
                    <p className="hidden md:block">
                      with a professional career spanning over 25 years, his evolution is rooted in technical mastery and creative fluidity. his catalog is a diverse registry of credits that move seamlessly between experimental hip-hop, soulful r&b, and house music.
                    </p>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* --- REGISTRY / WORKS GRID --- */}
        <section id="catalog" className="py-32 md:py-64 bg-black text-white px-6 md:px-12 relative overflow-hidden">
           <div className="max-w-screen-2xl mx-auto space-y-32 relative z-10">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 text-left">
                 <div className="space-y-6">
                    <div className="flex items-center gap-4 opacity-20">
                      <span className="text-[10px] font-black uppercase tracking-[1.5em] italic">02 // Active Registry</span>
                      <div className="h-px w-24 bg-white"></div>
                    </div>
                    <h2 className="text-8xl md:text-[13vw] font-black lowercase italic tracking-tightest leading-none">Catalog</h2>
                 </div>
                 <p className="text-xl md:text-3xl text-white/20 max-w-sm lowercase font-light leading-snug italic">Verified 2026 production and mastering credits.</p>
              </div>

              {/* Top 3 Featured Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {FEATURED_WORKS.map((work, i) => (
                  <a 
                    key={i} href={work.link} target="_blank" rel="noopener noreferrer"
                    className="group relative flex flex-col text-left space-y-8 bg-white/[0.02] border border-white/5 p-8 rounded-[3.5rem] hover:border-white/20 transition-all duration-700 hover:-translate-y-4"
                  >
                    <div className="aspect-square overflow-hidden rounded-[2.5rem] relative">
                      <div className="absolute top-6 left-6 z-20 text-[8px] font-black tracking-[1em] text-white/40 uppercase italic">{work.id}</div>
                      <img src={work.cover} alt={work.title} className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:scale-110 group-hover:brightness-100 transition-all duration-1000"/>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    </div>
                    <div className="space-y-4 px-2">
                      <div className="space-y-1">
                        <h4 className="text-4xl font-black lowercase italic tracking-tightest leading-none text-white">{work.title}</h4>
                        <p className="text-[10px] text-white/40 uppercase tracking-[0.5em] font-bold">{work.artist}</p>
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 italic leading-loose pt-4 border-t border-white/5">{work.role}</p>
                    </div>
                  </a>
                ))}
              </div>

              {/* ARCHIVE TABLE (Fills the "Empty" Feeling) */}
              <div className="pt-32 space-y-16">
                 <div className="flex items-center gap-6">
                    <span className="text-[10px] font-black uppercase tracking-[1em] text-white/10">Registry_Archive</span>
                    <div className="h-px flex-1 bg-white/5"></div>
                 </div>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
                   {ARCHIVE_LIST.map((item, i) => (
                     <div key={i} className="text-left space-y-2 group cursor-default">
                        <h5 className="text-xl md:text-2xl font-black lowercase italic tracking-tight text-white/50 group-hover:text-white transition-colors">{item.title}</h5>
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/10 group-hover:text-white/30">{item.artist} // {item.role}</p>
                     </div>
                   ))}
                 </div>
              </div>
           </div>
        </section>

        {/* --- CONTACT / SESSION CONSOLE --- */}
        <section id="contact" className="py-32 md:py-64 bg-white text-black px-6 md:px-12 relative overflow-hidden">
          <div className="max-w-5xl mx-auto space-y-32">
            <div className="text-center space-y-8">
               <span className="text-[11px] font-black uppercase tracking-[1.5em] text-black/10">Project Initiation</span>
               <h2 className="text-[14vw] md:text-[18vw] font-black lowercase italic tracking-tightest leading-[0.7]">Elevate</h2>
            </div>

            <div className="max-w-2xl mx-auto bg-black text-white p-10 md:p-20 rounded-[4rem] shadow-3xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-10 opacity-5">
                  <Terminal size={100} />
               </div>
               
               {formStatus === 'success' ? (
                  <div className="py-12 animate-fade-in space-y-10 text-center">
                    <div className="w-24 h-24 rounded-full bg-white text-black flex items-center justify-center mx-auto shadow-2xl scale-110">
                       <Zap size={40} />
                    </div>
                    <h3 className="text-4xl font-black italic tracking-tightest lowercase">Logged</h3>
                    <button onClick={() => setFormStatus('idle')} className="text-[10px] font-black uppercase tracking-[1em] border-b-2 border-white/10 pb-4 hover:border-white transition-all italic">Initiate New Entry</button>
                  </div>
               ) : (
                <form className="space-y-16 relative z-10" onSubmit={handleSubmit}>
                  <div className="space-y-12">
                     <div className="text-left space-y-4">
                        <label className="text-[9px] font-black uppercase tracking-[0.6em] text-white/20 pl-2">Artist_Moniker</label>
                        <input type="text" required placeholder="Identity" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 focus:border-white outline-none transition-all placeholder:text-white/5 text-xl font-bold italic lowercase" />
                     </div>
                     <div className="text-left space-y-4">
                        <label className="text-[9px] font-black uppercase tracking-[0.6em] text-white/20 pl-2">Digital_Channel</label>
                        <input type="email" required placeholder="Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 focus:border-white outline-none transition-all placeholder:text-white/5 text-xl font-bold italic lowercase" />
                     </div>
                     <div className="text-left space-y-4">
                        <label className="text-[9px] font-black uppercase tracking-[0.6em] text-white/20 pl-2">Session_Direction</label>
                        <textarea required placeholder="Vision" rows="2" value={formData.vibe} onChange={(e) => setFormData({...formData, vibe: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 focus:border-white outline-none transition-all placeholder:text-white/5 text-xl font-bold italic lowercase h-40 resize-none"></textarea>
                     </div>
                  </div>
                  <button type="submit" disabled={formStatus === 'sending'} className="group flex items-center justify-between w-full p-8 rounded-3xl bg-white text-black hover:bg-[#eee] transition-all shadow-2xl disabled:opacity-20">
                    <span className="text-xl font-black uppercase tracking-widest italic">{formStatus === 'sending' ? 'Uploading...' : 'Initiate Session'}</span>
                    <ArrowRight size={24} />
                  </button>
                </form>
               )}
            </div>
          </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="py-32 bg-black text-white relative">
           <div className="container mx-auto px-10 flex flex-col items-center gap-24 relative z-10">
              <div className="text-center space-y-8">
                <h2 className="text-7xl md:text-[12vw] font-black lowercase italic tracking-tightest leading-none text-white hover:opacity-50 transition-opacity cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>merkone</h2>
                <div className="flex justify-center space-x-12 opacity-20 hover:opacity-100 transition-opacity duration-1000 pt-8 border-t border-white/5 w-64 mx-auto">
                   <a href="https://instagram.com/djmerkone" target="_blank" rel="noopener noreferrer" className="hover:scale-125 transition-all"><InstagramIcon size={32} /></a>
                   <a href="mailto:djmerkone@gmail.com" className="hover:scale-125 transition-all"><Mail size={32} strokeWidth={1} /></a>
                   <a href="https://youtube.com/@djmerkone" target="_blank" rel="noopener noreferrer" className="hover:scale-125 transition-all"><YoutubeIcon size={32} /></a>
                </div>
              </div>
              <div className="text-[8px] md:text-[9px] text-white/5 font-black lowercase tracking-[1.5em] md:tracking-[3em] text-center max-w-5xl leading-loose uppercase italic pt-16 border-t border-white/5 w-full">
                 djmerkone high-fidelity registry 2027 // archival sound engineering // florida production house
              </div>
           </div>
        </footer>
      </main>

      {/* --- GLOBAL STYLES --- */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;900&display=swap');
        
        body { font-family: 'Inter', sans-serif; background-color: #050505; margin: 0; }
        
        .grid-pattern {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 80px 80px;
        }

        .grid-pattern-dark {
          background-image: 
            linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        .tracking-tightest { letter-spacing: -0.08em; }
        .text-outline { -webkit-text-stroke: 1px rgba(255, 255, 255, 0.6); }

        .animate-fade-in { animation: fadeIn 2s ease-out forwards; }
        .animate-reveal-slow { animation: revealSlow 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-bounce-slow { animation: bounceSlow 3s infinite ease-in-out; }
        .animate-ken-burns { animation: kenBurns 60s linear infinite alternate; }
        .animate-progress { animation: progress 2.5s ease-in-out forwards; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes revealSlow { 0% { transform: translateY(100px); opacity: 0; filter: blur(20px); } 100% { transform: translateY(0); opacity: 1; filter: blur(0); } }
        @keyframes bounceSlow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(15px); } }
        @keyframes kenBurns { from { transform: scale(1); } to { transform: scale(1.1); } }
        @keyframes progress { from { width: 0; } to { width: 100%; } }

        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        input:-webkit-autofill {
          -webkit-text-fill-color: white;
          -webkit-box-shadow: 0 0 0px 1000px #000 inset;
          transition: background-color 5000s ease-in-out 0s;
        }

        html { scroll-behavior: smooth; }

        @media (max-width: 768px) {
          .tracking-tightest { letter-spacing: -0.04em; }
          .grid-pattern { background-size: 40px 40px; }
        }
      `}} />
    </div>
  );
}