import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  Disc, 
  Sliders, 
  Wand2, 
  Music, 
  ChevronDown, 
  Menu, 
  X, 
  Mail,
  Zap
} from 'lucide-react';

// --- BULLETPROOF SVG ICONS (Fixes Missing Export Errors in Vercel) ---
const InstagramIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const YoutubeIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
);

// --- DISCOGRAPHY DATA ---
const DISCOGRAPHY = [
  { artist: "luis marte", title: "the chase", version: "full album/ep", role: "mastering", genre: "freestyle / latin", year: "2022" },
  { artist: "mikayla rose", title: "seasons", version: "remix", role: "mastering", genre: "pop / dance", year: "2021" },
  { artist: "l'amour", title: "yesterday", version: "album", role: "mastering", genre: "freestyle", year: "2022" },
  { artist: "manny q", title: "oh sonia", version: "mix", role: "mastering", genre: "house", year: "2025" },
  { artist: "marilyn torres", title: "callin' for love", version: "original", role: "producer", genre: "r&b / freestyle", year: "2025" },
  { artist: "jase david", title: "threads", version: "original", role: "producer", genre: "hip-hop / soul", year: "2026" },
  { artist: "jase david", title: "unbreakable", version: "original", role: "producer", genre: "r&b", year: "2025" },
  { artist: "luis marte", title: "no different", version: "original", role: "producer", genre: "latin urban", year: "2025" },
  { artist: "rolando montalvo", title: "take on me", version: "original", role: "producer", genre: "80s synth / pop", year: "2024" },
  { artist: "depeche mode", title: "precious", version: "dmo remix", role: "remixer", genre: "alternative / dance", year: "2014" },
  { artist: "mia martina", title: "latin mood", version: "dmo remix", role: "remixer", genre: "latin / pop", year: "2014" },
  { artist: "luis marte", title: "dance the night", version: "dmo mix", role: "remixer", genre: "house / club", year: "2025" },
  { artist: "djmerkone", title: "the anomaly", version: "original", role: "artist", genre: "experimental / hip-hop", year: "2022" },
  { artist: "dmo", title: "bow legged joe", version: "original", role: "artist", genre: "latin urban", year: "2022" },
];

const IMAGES = {
  hero: "/PSX_20241204_111437.jpg", 
  about: "/Dofoto_20241208_075521208.jpg", 
  fallbackHero: "https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?auto=format&fit=crop&q=80&w=2000",
  fallbackAbout: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=2000"
};

export default function App() {
  const [activeTab, setActiveTab] = useState('all');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleImageError = (e, fallback) => {
    e.target.onerror = null;
    e.target.src = fallback;
  };

  const filteredCatalog = activeTab === 'all' 
    ? DISCOGRAPHY 
    : DISCOGRAPHY.filter(track => track.role === activeTab || (activeTab === 'artist' && track.role === 'artist'));

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] font-sans selection:bg-white selection:text-black overflow-x-hidden">
      {/* --- NAVIGATION --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-black/90 backdrop-blur-xl py-4 border-b border-white/5 shadow-2xl' : 'bg-transparent py-8'}`}>
        <div className="container mx-auto px-8 flex justify-between items-center">
          <div className="text-xl font-bold tracking-tight lowercase flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-2.5 h-2.5 bg-white rounded-full group-hover:scale-150 transition-transform"></div>
            djmerkone
          </div>
          
          <div className="hidden md:flex space-x-12 text-[11px] font-black lowercase tracking-[0.3em] opacity-60">
            {['home', 'about', 'catalog', 'contact'].map((item) => (
              <a key={item} href={`#${item}`} className="hover:opacity-100 transition-opacity uppercase font-bold">
                {item}
              </a>
            ))}
          </div>

          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Nav Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-black/98 z-50 flex flex-col items-center justify-center space-y-10 text-4xl font-bold lowercase italic">
            <button className="absolute top-8 right-8 text-white/50 hover:text-white" onClick={() => setMobileMenuOpen(false)}><X size={40}/></button>
            {['home', 'about', 'catalog', 'contact'].map((item) => (
              <a key={item} href={`#${item}`} onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors">
                {item}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* --- EDITORIAL HERO --- */}
      <section id="home" className="relative h-screen flex items-end pb-32">
        <div className="absolute inset-0 z-0">
          <img 
            src={IMAGES.hero} 
            alt="djmerkone" 
            onError={(e) => handleImageError(e, IMAGES.fallbackHero)}
            className="w-full h-full object-cover object-center grayscale brightness-[0.35]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
        </div>

        <div className="container mx-auto px-8 relative z-10">
          <div className="max-w-5xl">
            <h2 className="text-white/40 font-bold tracking-[0.5em] lowercase mb-8 text-xs flex items-center gap-4 animate-fade-in uppercase">
              <span className="w-12 h-[1px] bg-white/20"></span> engineering the florida sound
            </h2>
            <h1 className="text-7xl md:text-[11rem] font-bold lowercase tracking-tighter leading-[0.8] mb-14 animate-slide-up">
              beyond <br /> <span className="text-white/10">the noise</span>
            </h1>
            <div className="flex flex-wrap gap-12 pt-6 animate-fade-in opacity-0" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
              <a href="#catalog" className="group flex items-center gap-4 text-sm font-black lowercase tracking-[0.2em] border-b border-white/10 pb-3 hover:border-white transition-all uppercase">
                view catalog <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
              <a href="#contact" className="group flex items-center gap-4 text-sm font-black lowercase tracking-[0.2em] border-b border-white/10 pb-3 hover:border-white transition-all uppercase">
                book studio <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* --- ARTIST PROFILE --- */}
      <section id="about" className="py-48 lg:py-64 bg-[#050505]">
        <div className="container mx-auto px-8">
          <div className="grid lg:grid-cols-12 gap-24 items-start">
            <div className="lg:col-span-5 relative group">
              <div className="absolute -inset-4 bg-white/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              <img 
                src={IMAGES.about} 
                alt="about djmerkone" 
                onError={(e) => handleImageError(e, IMAGES.fallbackAbout)}
                className="relative w-full h-auto grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-[1.01] shadow-2xl border border-white/5" 
              />
              <div className="absolute -bottom-8 -right-8 bg-white text-black px-8 py-6 text-xs font-black uppercase tracking-[0.3em] italic shadow-2xl hidden md:block">
                pioneer / since 1990
              </div>
            </div>
            
            <div className="lg:col-span-7 space-y-16 lg:pl-16">
              <div className="space-y-6">
                <h3 className="text-6xl md:text-[5.5rem] font-bold tracking-tighter lowercase leading-[0.85] italic">
                  sonic architect <br /> & producer
                </h3>
                <p className="text-2xl md:text-3xl text-white/40 leading-tight lowercase font-light max-w-2xl">
                  with over 25 years of sonic evolution, alex <span className="text-white italic">"djmerkone"</span> baldrich bridges the gap between classic foundations and futuristic clarity.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-16 border-t border-white/5">
                <div className="space-y-4">
                  <h4 className="text-[11px] font-black lowercase tracking-[0.3em] text-white/20 uppercase">the range</h4>
                  <div className="flex flex-wrap gap-2">
                    {['hip-hop', 'house', 'r&b', 'latin freestyle', 'latin urban'].map(genre => (
                      <span key={genre} className="px-3 py-1 border border-white/10 rounded-full text-[10px] font-bold text-white/50 uppercase tracking-widest">{genre}</span>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[11px] font-black lowercase tracking-[0.3em] text-white/20 uppercase">the expertise</h4>
                  <ul className="text-sm font-bold opacity-80 space-y-2 lowercase italic">
                    <li>• high-fidelity mastering</li>
                    <li>• original compositions</li>
                    <li>• creative remixing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- MINIMALIST CATALOG --- */}
      <section id="catalog" className="py-48 lg:py-64 bg-white text-black">
        <div className="container mx-auto px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-32 gap-16">
            <div className="max-w-2xl">
              <h2 className="text-8xl md:text-[10rem] font-bold lowercase tracking-tighter leading-none mb-8 italic">catalog</h2>
              <p className="text-black/40 text-xl md:text-2xl lowercase leading-tight font-medium">a comprehensive credit registry across three decades of industry precision.</p>
            </div>
            
            <div className="flex flex-wrap gap-8">
              {['all', 'producer', 'remixer', 'mastering', 'artist'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-sm font-black lowercase tracking-[0.25em] border-b-2 transition-all pb-3 uppercase ${activeTab === tab ? 'border-black text-black' : 'border-transparent text-black/20 hover:text-black/60'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="border-b border-black/10">
            {filteredCatalog.map((track, idx) => (
              <div key={idx} className="group grid grid-cols-1 md:grid-cols-12 items-center py-12 border-t border-black/5 hover:bg-black/[0.02] transition-all duration-300 px-8">
                <div className="md:col-span-1 text-[12px] font-black text-black/20 italic tracking-widest mb-3 md:mb-0">{track.year}</div>
                <div className="md:col-span-5">
                  <h4 className="text-4xl font-bold lowercase tracking-tight group-hover:translate-x-4 transition-transform duration-500 italic leading-none mb-1">{track.title}</h4>
                  <p className="text-black/50 text-sm font-bold lowercase">{track.artist} <span className="mx-3 text-black/10">/</span> {track.version}</p>
                </div>
                <div className="md:col-span-3 text-[11px] font-bold text-black/30 lowercase tracking-widest mt-8 md:mt-0 uppercase">{track.genre}</div>
                <div className="md:col-span-2 text-[10px] font-black text-black/20 lowercase tracking-[0.4em] mt-4 md:mt-0 uppercase">{track.role}</div>
                <div className="md:col-span-1 text-right hidden md:block opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <ArrowUpRight size={28} className="ml-auto text-black/30 group-hover:text-black" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CONTACT / STUDIO --- */}
      <section id="contact" className="py-48 lg:py-64 bg-[#050505]">
        <div className="container mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-40 items-start">
            <div className="space-y-20">
              <div className="space-y-6">
                <h2 className="text-7xl md:text-9xl font-bold tracking-tighter leading-[0.8] lowercase italic">
                  elevate <br /> <span className="text-white/10 italic">your sound</span>
                </h2>
                <p className="text-2xl text-white/30 lowercase max-w-md font-light leading-snug">
                  currently reviewing submissions for mid-2026. from single polish to full-scale identity production.
                </p>
              </div>
              
              <div className="space-y-10 pt-10">
                <div className="flex items-center gap-10 text-white/50 hover:text-white transition-all cursor-pointer group">
                  <div className="p-5 rounded-full border border-white/5 group-hover:border-white group-hover:bg-white group-hover:text-black transition-all">
                    <Mail size={28} />
                  </div>
                  <span className="text-3xl font-bold tracking-tight italic">session@djmerkone.com</span>
                </div>
                <div className="flex items-center gap-10 text-white/50 hover:text-white transition-all cursor-pointer group">
                  <div className="p-5 rounded-full border border-white/5 group-hover:border-white group-hover:bg-white group-hover:text-black transition-all">
                    <InstagramIcon size={28} />
                  </div>
                  <span className="text-3xl font-bold tracking-tight italic">@djmerkone</span>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.01] p-12 md:p-24 rounded-[4rem] border border-white/5 backdrop-blur-3xl shadow-3xl">
              <form className="space-y-14" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-10">
                  <div className="space-y-4">
                    <label className="text-[11px] font-black lowercase tracking-[0.5em] text-white/20 uppercase ml-1">artist identity</label>
                    <input type="text" placeholder="name / moniker" className="w-full bg-transparent border-b border-white/10 py-6 focus:border-white outline-none transition-all placeholder:text-white/5 lowercase text-3xl font-light italic" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-black lowercase tracking-[0.5em] text-white/20 uppercase ml-1">contact channel</label>
                    <input type="email" placeholder="email address" className="w-full bg-transparent border-b border-white/10 py-6 focus:border-white outline-none transition-all placeholder:text-white/5 lowercase text-3xl font-light italic" />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[11px] font-black lowercase tracking-[0.5em] text-white/20 uppercase ml-1">the vision</label>
                  <textarea placeholder="describe the sonic direction..." rows="3" className="w-full bg-transparent border-b border-white/10 py-6 focus:border-white outline-none transition-all placeholder:text-white/5 lowercase text-3xl font-light italic"></textarea>
                </div>
                <button className="flex items-center gap-10 text-4xl font-bold lowercase group border-b-2 border-white pb-4 hover:gap-16 transition-all italic w-full justify-between">
                  submit inquiry <ArrowUpRight size={44} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* --- MINIMAL FOOTER --- */}
      <footer className="py-40 border-t border-white/5 bg-[#050505]">
        <div className="container mx-auto px-8 flex flex-col items-center gap-20">
          <div className="text-5xl font-bold lowercase tracking-tighter italic hover:opacity-50 transition-opacity cursor-pointer group flex items-center gap-4" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-3 h-3 bg-white rounded-full group-hover:scale-150 transition-transform"></div>
            djmerkone
          </div>
          
          <div className="flex space-x-24 opacity-20">
            <a href="https://instagram.com/djmerkone" className="hover:opacity-100 transition-opacity hover:text-white"><InstagramIcon size={32} /></a>
            <a href="#" className="hover:opacity-100 transition-opacity hover:text-white"><YoutubeIcon size={32} /></a>
            <a href="#" className="hover:opacity-100 transition-opacity hover:text-white"><Music size={32} /></a>
          </div>

          <div className="text-[10px] text-white/10 font-black lowercase tracking-[0.8em] text-center max-w-md leading-loose uppercase italic">
            &copy; {new Date().getFullYear()} djmerkone music <br /> florida sound engineering / high-end production
          </div>
        </div>
      </footer>

      {/* Global Style Injector */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
          background-color: #050505;
          margin: 0;
        }

        .animate-fade-in {
          animation: fadeIn 2s ease-out forwards;
        }
        .animate-slide-up {
          animation: slideUp 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(100px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        html {
          scroll-behavior: smooth;
        }
        ::placeholder {
          font-style: italic;
          opacity: 0.1;
        }
        ::-webkit-scrollbar {
          width: 5px;
        }
        ::-webkit-scrollbar-track {
          background: #050505;
        }
        ::-webkit-scrollbar-thumb {
          background: #1a1a1a;
          border-radius: 10px;
        }
      `}} />
    </div>
  );
}