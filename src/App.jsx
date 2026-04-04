import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowUpRight, 
  X, 
  Mail,
  BookOpen,
  Plus,
  Play,
  Github,
  ChevronRight
} from 'lucide-react';

// --- VERCEL ANALYTICS NOTE ---
// import { Analytics } from '@vercel/analytics/react';

// --- CUSTOM BULLETPROOF ICONS (Build Safe) ---
const YoutubeIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
);
const AppleIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
);
const AmazonIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 14c.5 2 4 4.5 8 4.5s7.5-2.5 8-4.5"/><path d="M16 12c-1 3-4 3-5.5 3"/></svg>
);
const InstagramIcon = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const LATEST_RELEASES = [
  { 
    artist: "marilyn torres", title: "don't let me", work: "Writer // Producer // Mastering", year: "2026",
    amazonUrl: "https://www.amazon.com/Dont-Let-Me-Marilyn-Torres/dp/B0GHSXW5BV",
    youtubeUrl: "https://music.youtube.com/playlist?list=OLAK5uy_l6vs4GPW_kLZl21rvPS02g5c8kFhUBSiY",
    appleUrl: "https://music.apple.com/us/album/dont-let-me/1870639799",
    cover: "https://m.media-amazon.com/images/I/41gl0MgSbrL._UX358_FMwebp_QL85_.jpg"
  },
  { 
    artist: "jase david", title: "threads", work: "Writer // Producer // Mastering", year: "2026",
    amazonUrl: "https://www.amazon.com/THREADS-Jase-David/dp/B0GCH1SLZW",
    youtubeUrl: "https://music.youtube.com/playlist?list=OLAK5uy_lewAjL6bRcVMaeIHR7SsMkE8tLqKV5tUg",
    appleUrl: "https://music.apple.com/us/album/threads-ep/1864168921",
    cover: "https://m.media-amazon.com/images/I/51VA2eGveuL._UX358_FMwebp_QL85_.jpg"
  },
  { 
    artist: "marilyn torres", title: "the ep", work: "Writer // Producer // Mastering", year: "2026",
    amazonUrl: "https://www.amazon.com/dp/B0FYCWF875",
    youtubeUrl: "https://music.youtube.com/playlist?list=OLAK5uy_kY9dUC_i_GeUWXTc8fFH8Iy8WfBHlHVlg",
    appleUrl: "https://music.apple.com/us/album/the-ep/1850311861",
    cover: "https://m.media-amazon.com/images/I/41w+uNCU8ZL._UX358_FMwebp_QL85_.jpg"
  },
];

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [bioOpen, setBioOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formStatus, setFormStatus] = useState('idle');
  const [formData, setFormData] = useState({ name: '', email: '', vibe: '' });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className="min-h-screen bg-[#000] text-[#e0e0e0] font-sans selection:bg-white selection:text-black overflow-x-hidden">
      
      {/* ANIMATED KINETIC NOISE OVERLAY */}
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.04]">
        <div className="absolute inset-0 noise-animation"></div>
      </div>

      {/* --- MINIMAL HEADER --- */}
      <nav className={`fixed top-0 left-0 w-full z-50 px-8 py-10 transition-all duration-700 ${scrolled ? 'py-6 backdrop-blur-sm' : ''}`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            <span className="text-sm font-black uppercase tracking-[0.6em] transition-all group-hover:tracking-[0.8em]">djmerkone</span>
          </div>
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-4 group"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-40 group-hover:opacity-100 transition-opacity">Index</span>
            <div className="flex flex-col gap-1 w-6 items-end">
              <div className={`h-[1px] bg-white transition-all duration-500 ${menuOpen ? 'w-6 rotate-45 translate-y-1' : 'w-6'}`}></div>
              <div className={`h-[1px] bg-white transition-all duration-500 ${menuOpen ? 'w-6 -rotate-45 -translate-y-0.5' : 'w-4'}`}></div>
            </div>
          </button>
        </div>
      </nav>

      {/* --- MENU OVERLAY (Editorial Style) --- */}
      <div className={`fixed inset-0 z-[100] bg-[#050505] transition-all duration-1000 ease-expo ${menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="h-full flex flex-col justify-center items-center p-8 space-y-12">
          <button onClick={() => setMenuOpen(false)} className="absolute top-12 right-12 text-white/20 hover:text-white transition-colors">
            <X size={40} strokeWidth={1} />
          </button>
          <div className="flex flex-col items-center space-y-6">
            {['home', 'about', 'catalog', 'contact'].map((item, i) => (
              <a 
                key={item} 
                href={`#${item}`} 
                onClick={() => setMenuOpen(false)} 
                className="group relative text-6xl md:text-[10vw] font-black lowercase italic tracking-tightest leading-none hover:text-white transition-all duration-500"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <span className="absolute -left-12 top-1/2 -translate-y-1/2 text-xs font-bold tracking-widest opacity-0 group-hover:opacity-20 transition-opacity">0{i+1}</span>
                {item}
              </a>
            ))}
          </div>
          <div className="flex gap-12 pt-12 opacity-20">
            <InstagramIcon className="w-6 h-6 hover:opacity-100 transition-opacity cursor-pointer" />
            <YoutubeIcon className="w-6 h-6 hover:opacity-100 transition-opacity cursor-pointer" />
            <Mail className="w-6 h-6 hover:opacity-100 transition-opacity cursor-pointer" />
          </div>
        </div>
      </div>

      {/* --- HERO (Cinematic Parallax) --- */}
      <section id="home" className="relative h-screen flex flex-col justify-center items-center text-center px-6">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="/PSX_20241204_111437.jpg" 
            className="w-full h-full object-cover grayscale brightness-[0.2] scale-110 motion-safe:animate-ken-burns" 
            alt="hero"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#000] via-transparent to-[#000]"></div>
        </div>
        
        <div className="relative z-10 space-y-8">
          <div className="flex items-center justify-center gap-6 opacity-20 animate-fade-in">
            <div className="h-[1px] w-12 bg-white"></div>
            <p className="text-[10px] font-black uppercase tracking-[1em]">High-Fidelity Engineering</p>
            <div className="h-[1px] w-12 bg-white"></div>
          </div>
          <h1 className="text-[15vw] font-black lowercase italic tracking-tightest leading-[0.8] text-white/90 drop-shadow-2xl">
            merkone
          </h1>
          <p className="text-[10px] font-bold uppercase tracking-[1.5em] text-white/20 pt-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            Beyond the noise
          </p>
        </div>

        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-20 hover:opacity-100 transition-opacity cursor-pointer animate-bounce-slow">
           <span className="text-[8px] font-black uppercase tracking-[0.6em]">Scroll</span>
           <div className="h-12 w-[1px] bg-white"></div>
        </div>
      </section>

      {/* --- ABOUT (Editorial Layout) --- */}
      <section id="about" className="py-64 px-8 bg-[#000]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-24 items-start">
            <div className="lg:col-span-7 space-y-16">
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20">The Architect</span>
                <h2 className="text-7xl md:text-[8vw] font-black lowercase italic tracking-tightest leading-[0.8] text-white">
                  Science <br /> of emotion.
                </h2>
              </div>
              <p className="text-2xl md:text-4xl text-white/40 leading-snug lowercase font-light max-w-2xl">
                Operating at the high-fidelity intersection of rhythm and precision since <span className="text-white">2001</span>.
              </p>
              <div className="flex gap-10 pt-8">
                 <button 
                  onClick={() => setBioOpen(true)}
                  className="flex items-center gap-6 px-10 py-6 border border-white/10 rounded-full hover:bg-white hover:text-black transition-all group"
                 >
                    <BookOpen size={18} strokeWidth={1.5} />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Read Full Profile</span>
                 </button>
              </div>
            </div>
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/5] overflow-hidden rounded-[2.5rem] relative group grayscale brightness-[0.7] hover:brightness-100 transition-all duration-1000">
                <img src="/Dofoto_20241208_075521208.jpg" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3000ms]" alt="merkone"/>
                <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-[2.5rem]"></div>
              </div>
              <div className="absolute -bottom-8 -right-8 p-12 bg-[#080808] border border-white/5 rounded-[2rem] hidden md:block backdrop-blur-xl">
                 <p className="text-[9px] font-black uppercase tracking-[0.8em] text-white/20">System Status</p>
                 <p className="text-xl font-black italic lowercase tracking-tightest pt-2">Active Archive</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CATALOG GRID (The Eye Candy) --- */}
      <section id="catalog" className="py-64 bg-white text-black px-8">
        <div className="max-w-7xl mx-auto space-y-48">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12">
            <div className="space-y-6">
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-black/20">Verified Registry</span>
              <h2 className="text-8xl md:text-[10vw] font-black lowercase italic tracking-tightest leading-none">Catalog</h2>
            </div>
            <p className="text-xl font-medium text-black/30 max-w-xs leading-relaxed">Verified sonic credits. 2026 Registry Update.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-32">
            {LATEST_RELEASES.map((item, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className="aspect-square bg-black/5 overflow-hidden rounded-[3rem] shadow-2xl relative mb-10 transform group-hover:-translate-y-4 transition-all duration-700">
                  <img src={item.cover} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"/>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  <div className="absolute bottom-8 right-8 w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-50 group-hover:scale-100 shadow-xl">
                    <ChevronRight className="text-black" />
                  </div>
                </div>
                <div className="space-y-6 px-4">
                  <div className="flex justify-between items-start">
                    <h4 className="text-4xl font-black lowercase italic tracking-tightest leading-none">{item.title}</h4>
                    <span className="text-[10px] font-black text-black/20 italic">{item.year}</span>
                  </div>
                  <p className="text-lg font-bold text-black/40 lowercase leading-none">{item.artist}</p>
                  <div className="h-[1px] w-full bg-black/5"></div>
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-black/30 leading-loose italic">{item.work}</p>
                  
                  <div className="flex gap-4 pt-4">
                    <a href={item.youtubeUrl} target="_blank" className="w-12 h-12 rounded-2xl border border-black/5 flex items-center justify-center text-black/20 hover:text-red-600 hover:bg-black/5 transition-all"><YoutubeIcon className="w-5 h-5"/></a>
                    <a href={item.appleUrl} target="_blank" className="w-12 h-12 rounded-2xl border border-black/5 flex items-center justify-center text-black/20 hover:text-[#fa243c] hover:bg-black/5 transition-all"><AppleIcon className="w-5 h-5"/></a>
                    <a href={item.amazonUrl} target="_blank" className="w-12 h-12 rounded-2xl border border-black/5 flex items-center justify-center text-black/20 hover:text-[#ff9900] hover:bg-black/5 transition-all"><AmazonIcon className="w-6 h-6"/></a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CONTACT (Editorial Form) --- */}
      <section id="contact" className="py-64 bg-[#000] px-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-black italic tracking-tighter opacity-10">Vault</div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center space-y-24 relative z-10">
          <div className="space-y-8">
            <span className="text-[11px] font-black uppercase tracking-[1em] text-white/10">Project Initiation</span>
            <h2 className="text-8xl md:text-[12vw] font-black lowercase italic tracking-tightest leading-[0.8] text-white">Elevate</h2>
          </div>

          <div className="bg-white/[0.01] p-12 md:p-32 rounded-[5rem] border border-white/5 backdrop-blur-xl shadow-[0_0_100px_rgba(0,0,0,0.5)]">
            {formStatus === 'success' ? (
              <div className="py-24 space-y-12 animate-fade-in">
                <CheckCircle2 size={80} strokeWidth={1} className="mx-auto text-white/40" />
                <h3 className="text-4xl font-black italic tracking-tightest">Session Logged</h3>
                <button onClick={() => setFormStatus('idle')} className="text-[10px] font-black uppercase tracking-[1em] opacity-40 hover:opacity-100 transition-all border-b border-white/20 pb-2">New Inquiry</button>
              </div>
            ) : (
              <form className="space-y-20" onSubmit={handleSubmit}>
                <div className="space-y-16">
                  <input type="text" required placeholder="Artist Moniker" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-transparent border-b border-white/5 py-8 focus:border-white outline-none transition-all placeholder:text-white/5 lowercase text-4xl md:text-6xl font-light italic text-center" />
                  <input type="email" required placeholder="Digital Channel" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-transparent border-b border-white/5 py-8 focus:border-white outline-none transition-all placeholder:text-white/5 lowercase text-4xl md:text-6xl font-light italic text-center" />
                  <textarea required placeholder="Describe the sonic vision..." rows="3" value={formData.vibe} onChange={(e) => setFormData({...formData, vibe: e.target.value})} className="w-full bg-transparent border-b border-white/5 py-8 focus:border-white outline-none transition-all placeholder:text-white/5 lowercase text-4xl md:text-6xl font-light italic text-center h-56"></textarea>
                </div>
                <button type="submit" disabled={formStatus === 'sending'} className="text-8xl md:text-[10vw] font-black lowercase italic tracking-tightest hover:text-white/10 transition-all disabled:opacity-20 flex items-center justify-center gap-12 mx-auto">
                  {formStatus === 'sending' ? 'Uploading...' : <><Plus size={100} strokeWidth={1} className="hidden md:block"/> Submit</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* --- BIO SIDEBAR (The Archive) --- */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-[600px] z-[200] bg-[#050505] border-l border-white/5 transition-all duration-1000 ease-expo ${bioOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full'}`}>
        <div className="h-full p-12 md:p-24 overflow-y-auto scrollbar-hide space-y-20">
          <button onClick={() => setBioOpen(false)} className="flex items-center gap-4 group">
             <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
               <X size={20} />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Close Record</span>
          </button>
          
          <div className="space-y-12">
             <h3 className="text-7xl font-black lowercase italic tracking-tightest text-white leading-none">merkone</h3>
             <div className="space-y-10 text-xl text-white/40 font-light lowercase leading-relaxed">
                <p>roots in the late 90s dj scene. transitioned to professional production in <span className="text-white font-bold">1999</span>. first official release <span className="text-white font-bold">2001</span>.</p>
                <p>merkone operates at the high-fidelity intersection of rhythm and precision. a career spanning over two decades, he has established himself as a definitive architect of the florida sound.</p>
                <p>multidisciplinary engineering for the science of emotion. engineering the future // verified archive record 2027.</p>
             </div>
             <div className="pt-12 border-t border-white/5 space-y-8">
                <div className="flex items-center gap-8 group cursor-pointer hover:text-white transition-all">
                  <div className="p-4 rounded-2xl border border-white/10 group-hover:border-white transition-all"><Mail size={20} /></div>
                  <span className="text-xl font-bold italic tracking-tight">djmerkone@gmail.com</span>
                </div>
                <div className="flex items-center gap-8 group cursor-pointer hover:text-white transition-all pl-12">
                  <div className="p-4 rounded-2xl border border-white/10 group-hover:border-white transition-all"><InstagramIcon className="w-5 h-5" /></div>
                  <span className="text-xl font-bold italic tracking-tight">@djmerkone</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <footer className="py-24 text-center border-t border-white/5 bg-black">
        <p className="text-[10px] font-black uppercase tracking-[1.5em] text-white/10">djmerkone registry // established professional 1999</p>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;900&display=swap');
        
        body { font-family: 'Inter', sans-serif; background-color: #000; margin: 0; }
        
        .noise-animation {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          animation: noise-move 0.2s steps(3) infinite;
          width: 200%;
          height: 200%;
          top: -50%;
          left: -50%;
        }

        @keyframes noise-move {
          0% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -5%); }
          20% { transform: translate(-10%, 5%); }
          30% { transform: translate(5%, -10%); }
          40% { transform: translate(-5%, 15%); }
          50% { transform: translate(-10%, 5%); }
          60% { transform: translate(15%, 0); }
          70% { transform: translate(0, 10%); }
          80% { transform: translate(-15%, 0); }
          90% { transform: translate(10%, 5%); }
          100% { transform: translate(5%, 0); }
        }

        .tracking-tightest { letter-spacing: -0.06em; }
        .ease-expo { transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1); }

        .animate-fade-in { animation: fadeIn 1.5s ease-out forwards; opacity: 0; }
        .animate-slide-up { animation: slideUp 2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-ken-burns { animation: kenBurns 40s linear infinite alternate; }
        .animate-bounce-slow { animation: bounceSlow 3s infinite ease-in-out; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes kenBurns { from { transform: scale(1); } to { transform: scale(1.2); } }
        @keyframes bounceSlow { 0%, 100% { transform: translate(-50%, 0); } 50% { transform: translate(-50%, 10px); } }

        ::-webkit-scrollbar { width: 0px; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: white;
          -webkit-box-shadow: 0 0 0px 1000px #000 inset;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}} />
    </div>
  );
}