import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  X, 
  Mail, 
  BookOpen, 
  ArrowRight,
  ChevronRight,
  Send,
  ArrowDown
} from 'lucide-react';

// --- CUSTOM BUILD-SAFE ICONS ---
const InstagramIcon = (props) => (
  <svg {...props} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const YoutubeIcon = (props) => (
  <svg {...props} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
);

// --- TOP 3 RECENT RELEASES ---
const RECENT_WORKS = [
  { 
    artist: "marilyn torres", 
    title: "don't let me", 
    role: "Producer / Engineer / Mastering", 
    year: "2026",
    cover: "https://m.media-amazon.com/images/I/41gl0MgSbrL._UX358_FMwebp_QL85_.jpg",
    link: "https://music.apple.com/us/album/dont-let-me/1870639799"
  },
  { 
    artist: "jase david", 
    title: "threads", 
    role: "Producer / Mastering", 
    year: "2026",
    cover: "https://m.media-amazon.com/images/I/51VA2eGveuL._UX358_FMwebp_QL85_.jpg",
    link: "https://music.apple.com/us/album/threads-ep/1864168921"
  },
  { 
    artist: "marilyn torres", 
    title: "the ep", 
    role: "Producer / Engineer / Mastering", 
    year: "2026",
    cover: "https://m.media-amazon.com/images/I/41w+uNCU8ZL._UX358_FMwebp_QL85_.jpg",
    link: "https://music.apple.com/us/album/the-ep/1850311861"
  },
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
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      
      {/* --- SPLASH SCREEN --- */}
      {!hasEntered && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-8 animate-fade-in text-white">
          <div className="space-y-6 text-center">
            <h1 className="text-7xl md:text-[10vw] font-black tracking-tightest lowercase italic leading-none animate-reveal-slow">
              djmerkone
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[1.5em] opacity-20 animate-fade-in" style={{ animationDelay: '1s' }}>Established 2001</p>
          </div>
          <button 
            onClick={() => setHasEntered(true)}
            className="group flex flex-col items-center gap-10 mt-32 animate-fade-in"
            style={{ animationDelay: '1.5s' }}
          >
            <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:border-white transition-all duration-1000">
               <ArrowRight strokeWidth={1} size={32} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-[1em] text-white/20">Access Vault</span>
          </button>
        </div>
      )}

      {/* --- NAVIGATION --- */}
      <nav className={`fixed top-0 left-0 w-full z-50 px-10 py-12 transition-all duration-700 flex justify-between items-center mix-blend-difference text-white ${hasEntered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          <span className="text-xl font-black tracking-tighter lowercase italic">djmerkone</span>
        </div>
        <div className="flex items-center gap-16">
          <a href="#about" className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity hidden md:block">The Archive</a>
          <a href="#catalog" className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity hidden md:block">Latest Works</a>
          <a href="#contact" className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-opacity">Session</a>
        </div>
      </nav>

      <main className={`${hasEntered ? 'block' : 'hidden'}`}>
        
        {/* --- HERO SECTION --- */}
        <section id="home" className="h-screen flex flex-col items-center justify-center text-center px-10 relative bg-black text-white overflow-hidden">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img src="/PSX_20241204_111437.jpg" className="w-full h-full object-cover grayscale brightness-[0.25] scale-110 motion-safe:animate-ken-burns" alt="hero" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black"></div>
          </div>
          
          <div className="relative z-10 space-y-16 max-w-7xl">
            <div className="space-y-6">
              <span className="text-[11px] font-black uppercase tracking-[1.5em] text-white/10 block mb-6 italic">High-Fidelity Engineering</span>
              <h1 className="text-[15vw] md:text-[14vw] font-black tracking-tightest leading-[0.7] italic lowercase">beyond <br /> the noise</h1>
            </div>
            <p className="text-2xl md:text-5xl font-light text-white/30 lowercase tracking-wide max-w-4xl mx-auto leading-tight italic">
              science of emotion // rhythm & precision <br /> since <span className="text-white border-b border-white/10">2001</span>.
            </p>
          </div>

          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 opacity-20 animate-bounce-slow">
             <span className="text-[9px] font-black uppercase tracking-[0.8em]">Explore</span>
             <div className="h-12 w-px bg-white"></div>
          </div>
        </section>

        {/* --- ABOUT / LONG-FORM BIO --- */}
        <section id="about" className="py-64 bg-white text-black px-10">
          <div className="max-w-7xl mx-auto space-y-48">
            <div className="grid lg:grid-cols-2 gap-32 items-start">
               <div className="space-y-20 text-left">
                  <div className="space-y-8">
                    <span className="text-[12px] font-black uppercase tracking-[1em] text-black/20 block">01 // The Archive</span>
                    <h2 className="text-8xl md:text-[12vw] font-black lowercase italic tracking-tightest leading-none">Merkone</h2>
                  </div>
                  <div className="space-y-12 text-3xl md:text-5xl text-black leading-[1.1] font-light lowercase">
                     <p>
                       operating at the high-fidelity intersection of rhythm and precision, <span className="italic font-bold underline underline-offset-[16px] decoration-black/10">djmerkone</span> has established himself as a definitive architect of the florida sound.
                     </p>
                  </div>
               </div>
               <div className="relative group pt-12 md:pt-32">
                  <div className="aspect-[3/4] overflow-hidden rounded-[4rem] border border-black/[0.03] grayscale brightness-90 transition-all duration-1000 group-hover:brightness-100 group-hover:scale-[1.01] shadow-2xl">
                    <img src="/Dofoto_20241208_075521208.jpg" className="w-full h-full object-cover" alt="merkone" />
                  </div>
                  <div className="absolute -bottom-10 -left-10 bg-black text-white p-12 rounded-[3rem] hidden md:block shadow-2xl">
                     <span className="text-[10px] font-black uppercase tracking-[1em] block mb-4 opacity-40 italic">Registry Status</span>
                     <p className="text-3xl font-black italic lowercase tracking-tightest">Active_Archive</p>
                  </div>
               </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-32 text-left pt-32 border-t border-black/5">
               <div className="space-y-16 text-2xl md:text-3xl text-black/60 leading-relaxed font-light lowercase italic">
                  <p>
                    his journey began in the high-energy late 90s dj scene—a foundational era where merk developed a biological understanding of acoustics and the physics of the dancefloor. in <span className="text-black font-bold">1999</span>, he transitioned into professional production, a move that culminated in his first official release in <span className="text-black font-bold">2001</span>.
                  </p>
                  <p>
                    as a producer and mastering engineer, merkone views sound as architecture. engineering is the science of emotion; his precision in the studio ensures that every frequency serves a purpose, allowing the artist's vision to cut through the digital noise with absolute authority.
                  </p>
               </div>
               <div className="space-y-16 text-2xl md:text-3xl text-black/60 leading-relaxed font-light lowercase italic lg:pt-64">
                  <p>
                    with a professional career spanning over 25 years, his evolution is rooted in technical mastery and creative fluidity. his catalog is a diverse registry of credits that move seamlessly between experimental hip-hop, soulful r&b, and house music.
                  </p>
                  <p>
                    entering 2026/27, merk remains a sought-after collaborator for marquee projects, recently providing clinical polish to global releases from marilyn torres and jase david. he doesn't just record music—he engineers the future.
                  </p>
               </div>
            </div>
          </div>
        </section>

        {/* --- CATALOG / TOP 3 RELEASES --- */}
        <section id="catalog" className="py-64 bg-black text-white px-10">
           <div className="max-w-7xl mx-auto space-y-32">
              <div className="flex flex-col md:flex-row justify-between items-end gap-16 text-left">
                 <div className="space-y-8">
                    <span className="text-[12px] font-black uppercase tracking-[1em] text-white/10 italic">02 // Latest Registry</span>
                    <h2 className="text-9xl md:text-[15vw] font-black lowercase italic tracking-tightest leading-none">Catalog</h2>
                 </div>
                 <p className="text-3xl text-white/20 max-w-sm lowercase font-light leading-snug italic">Verified 2026 production and mastering credits.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {RECENT_WORKS.map((work, i) => (
                  <a 
                    key={i} 
                    href={work.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col text-left space-y-10"
                  >
                    <div className="aspect-square overflow-hidden rounded-[3rem] border border-white/5 bg-white/[0.02] transition-all duration-700 group-hover:scale-[0.98] shadow-2xl">
                      <img src={work.cover} alt={work.title} className="w-full h-full object-cover grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110 opacity-80 group-hover:opacity-100"/>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                      <div className="absolute bottom-10 right-10 w-16 h-16 rounded-full bg-white text-black flex items-center justify-center scale-0 group-hover:scale-100 transition-all duration-500 shadow-2xl">
                        <ArrowUpRight size={24} />
                      </div>
                    </div>
                    
                    <div className="space-y-4 px-4">
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-4xl font-black lowercase italic tracking-tightest leading-none text-white group-hover:translate-x-2 transition-transform duration-500">{work.title}</h4>
                        <span className="text-[11px] font-black text-white/10 italic">{work.year}</span>
                      </div>
                      <p className="text-[11px] text-white/30 uppercase tracking-[0.5em] font-bold">{work.artist}</p>
                      <div className="h-px w-full bg-white/5"></div>
                      <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/10 italic leading-loose">{work.role}</p>
                    </div>
                  </a>
                ))}
              </div>
           </div>
        </section>

        {/* --- CONTACT / PROJECT INITIATION --- */}
        <section id="contact" className="py-64 bg-white text-black px-10">
          <div className="max-w-5xl mx-auto space-y-48 text-center">
            <div className="space-y-12">
               <span className="text-[12px] font-black uppercase tracking-[1.2em] text-black/10">03 // Project Initiation</span>
               <h2 className="text-[14vw] md:text-[18vw] font-black lowercase italic tracking-tightest leading-[0.7]">Elevate</h2>
            </div>

            <div className="bg-[#fbfbfb] p-12 md:p-32 rounded-[6rem] shadow-3xl relative overflow-hidden group border border-black/[0.02]">
               <div className="absolute top-0 right-0 p-12 opacity-[0.02] group-hover:opacity-5 transition-opacity duration-1000">
                  <ArrowUpRight size={200} strokeWidth={1} />
               </div>
               
               {formStatus === 'success' ? (
                  <div className="py-20 animate-fade-in space-y-12 text-center">
                    <div className="w-32 h-32 rounded-full bg-black text-white flex items-center justify-center mx-auto shadow-3xl scale-110">
                       <ChevronRight size={60} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-6xl font-black italic tracking-tightest lowercase">Logged</h3>
                    <button onClick={() => setFormStatus('idle')} className="text-[10px] font-black uppercase tracking-[1em] border-b-2 border-black/10 pb-4 hover:border-black transition-all italic">Initiate New Entry</button>
                  </div>
               ) : (
                <form className="space-y-32 relative z-10" onSubmit={handleSubmit}>
                  <div className="space-y-24">
                     <div className="text-left border-b border-black/[0.06] pb-16 focus-within:border-black transition-all group/input">
                        <span className="text-[11px] font-black uppercase tracking-[0.8em] text-black/20 block mb-10 group-focus-within/input:text-black transition-colors">Identity // 01</span>
                        <input type="text" required placeholder="Artist_Moniker" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-transparent outline-none text-6xl md:text-[7vw] font-black italic tracking-tightest placeholder:text-black/[0.03] lowercase" />
                     </div>
                     <div className="text-left border-b border-black/[0.06] pb-16 focus-within:border-black transition-all group/input">
                        <span className="text-[11px] font-black uppercase tracking-[0.8em] text-black/20 block mb-10 group-focus-within/input:text-black transition-colors">Digital_Channel // 02</span>
                        <input type="email" required placeholder="Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-transparent outline-none text-6xl md:text-[7vw] font-black italic tracking-tightest placeholder:text-black/[0.03] lowercase" />
                     </div>
                     <div className="text-left border-b border-black/[0.06] pb-16 focus-within:border-black transition-all group/input">
                        <span className="text-[11px] font-black uppercase tracking-[0.8em] text-black/20 block mb-10 group-focus-within/input:text-black transition-colors">Vision_Target // 03</span>
                        <textarea required placeholder="Project_Direction" rows="3" value={formData.vibe} onChange={(e) => setFormData({...formData, vibe: e.target.value})} className="w-full bg-transparent outline-none text-6xl md:text-[7vw] font-black italic tracking-tightest placeholder:text-black/[0.03] lowercase h-80 resize-none"></textarea>
                     </div>
                  </div>
                  <button type="submit" disabled={formStatus === 'sending'} className="group flex items-center justify-between w-full p-16 rounded-[4rem] bg-black text-white hover:bg-zinc-800 transition-all shadow-[0_40px_80px_rgba(0,0,0,0.2)] disabled:opacity-20">
                    <span className="text-5xl md:text-[6vw] font-black lowercase italic tracking-tightest leading-none">
                      {formStatus === 'sending' ? 'Uploading...' : 'Submit Session'}
                    </span>
                    <div className="w-24 h-24 rounded-full border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-white group-hover:text-black transition-all duration-700 hidden md:flex">
                       <ArrowRight size={40} strokeWidth={1} />
                    </div>
                  </button>
                </form>
               )}
            </div>
          </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="py-64 bg-black text-white border-t border-white/5">
           <div className="container mx-auto px-10 flex flex-col items-center gap-32">
              <div className="text-center space-y-12">
                <h2 className="text-9xl md:text-[14vw] font-black lowercase italic tracking-tightest leading-none text-white transition-opacity hover:opacity-50 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>merkone</h2>
                <div className="flex justify-center space-x-24 opacity-10 hover:opacity-100 transition-opacity duration-1000 pt-12">
                   <a href="https://instagram.com/djmerkone" target="_blank" rel="noopener noreferrer" className="hover:scale-125 hover:text-fuchsia-400 transition-all"><InstagramIcon size={48} strokeWidth={1} /></a>
                   <a href="mailto:djmerkone@gmail.com" className="hover:scale-125 transition-all"><Mail size={48} strokeWidth={1} /></a>
                   <a href="https://youtube.com/@djmerkone" target="_blank" rel="noopener noreferrer" className="hover:scale-125 hover:text-red-500 transition-all"><YoutubeIcon size={48} strokeWidth={1} /></a>
                </div>
              </div>
              <div className="text-[10px] text-white/5 font-black lowercase tracking-[3em] text-center max-w-5xl leading-loose uppercase italic pt-24 border-t border-white/5 w-full">
                 djmerkone high-fidelity registry 2027 // archival sound engineering // florida production house
              </div>
           </div>
        </footer>
      </main>

      {/* --- GLOBAL STYLES --- */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;900&display=swap');
        
        body { font-family: 'Inter', sans-serif; background-color: #000; margin: 0; }
        
        .tracking-tightest { letter-spacing: -0.08em; }
        .ease-expo { transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1); }

        .animate-fade-in { animation: fadeIn 1.8s ease-out forwards; }
        .animate-reveal { animation: reveal 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-reveal-slow { animation: revealSlow 2.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slide-up-fade { animation: slideUpFade 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-bounce-slow { animation: bounceSlow 3s infinite ease-in-out; }
        .animate-ken-burns { animation: kenBurns 60s linear infinite alternate; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes reveal { from { transform: translateY(60px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes revealSlow { 0% { transform: translateY(100px); opacity: 0; filter: blur(30px); } 100% { transform: translateY(0); opacity: 1; filter: blur(0); } }
        @keyframes slideUpFade { from { transform: translateY(80px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes bounceSlow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(15px); } }
        @keyframes kenBurns { from { transform: scale(1.1); } to { transform: scale(1.3); } }

        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

        input:-webkit-autofill {
          -webkit-text-fill-color: black;
          -webkit-box-shadow: 0 0 0px 1000px #fff inset;
          transition: background-color 5000s ease-in-out 0s;
        }

        html { scroll-behavior: smooth; }

        @media (max-width: 768px) {
          .tracking-tightest { letter-spacing: -0.04em; }
        }
      `}} />
    </div>
  );
}