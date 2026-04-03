import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  Disc, 
  Sliders, 
  Wand2, 
  Instagram, 
  Youtube, 
  Music,
  ChevronDown,
  Menu,
  X,
  Mail
} from 'lucide-react';

// --- DATA ---
// I have expanded this to include the specific genres and credits we've refined.
const DISCOGRAPHY = [
  // MASTERING
  { artist: "luis marte", title: "the chase", version: "full album/ep", role: "mastering", genre: "freestyle / latin", year: "2022" },
  { artist: "mikayla rose", title: "seasons", version: "remix", role: "mastering", genre: "pop / dance", year: "2021" },
  { artist: "l'amour", title: "yesterday", version: "album", role: "mastering", genre: "freestyle", year: "2022" },
  { artist: "manny q", title: "oh sonia", version: "mix", role: "mastering", genre: "house", year: "2025" },
  
  // PRODUCER
  { artist: "marilyn torres", title: "callin' for love", version: "original", role: "producer", genre: "r&b / freestyle", year: "2025" },
  { artist: "jase david", title: "threads", version: "original", role: "producer", genre: "hip-hop / soul", year: "2026" },
  { artist: "jase david", title: "unbreakable", version: "original", role: "producer", genre: "r&b", year: "2025" },
  { artist: "luis marte", title: "no different", version: "original", role: "producer", genre: "latin urban", year: "2025" },
  { artist: "rolando montalvo", title: "take on me", version: "original", role: "producer", genre: "80s synth / pop", year: "2024" },
  
  // REMIXER
  { artist: "depeche mode", title: "precious", version: "dmo remix", role: "remixer", genre: "alternative / dance", year: "2014" },
  { artist: "mia martina", title: "latin mood", version: "dmo remix", role: "remixer", genre: "latin / pop", year: "2014" },
  { artist: "luis marte", title: "dance the night", version: "dmo mix", role: "remixer", genre: "house / club", year: "2025" },
  
  // PRIMARY ARTIST
  { artist: "djmerkone", title: "the anomaly", version: "original", role: "artist", genre: "experimental / hip-hop", year: "2022" },
  { artist: "dmo", title: "bow legged joe", version: "original", role: "artist", genre: "latin urban", year: "2022" },
];

const IMAGES = {
  hero: "PSX_20241204_111437.jpg", 
  about: "Dofoto_20241208_075521208.jpg", 
  editorial: "Facetune_13-04-2021-16-52-04.jpg", 
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
      {/* --- PREMIUM NAVIGATION --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-black/90 backdrop-blur-xl py-4 border-b border-white/5 shadow-2xl' : 'bg-transparent py-8'}`}>
        <div className="container mx-auto px-8 flex justify-between items-center">
          <div className="text-xl font-bold tracking-tight lowercase flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <div className="w-2 h-2 bg-white rounded-full group-hover:scale-150 transition-transform"></div>
            djmerkone
          </div>
          
          <div className="hidden md:flex space-x-12 text-[10px] font-black lowercase tracking-[0.3em] opacity-60">
            {['home', 'about', 'catalog', 'contact'].map((item) => (
              <a key={item} href={`#${item}`} className="hover:opacity-100 transition-opacity">
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
          <div className="md:hidden fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center space-y-10 text-3xl font-bold lowercase italic">
            <button className="absolute top-8 right-8" onClick={() => setMobileMenuOpen(false)}><X size={32}/></button>
            {['home', 'about', 'catalog', 'contact'].map((item) => (
              <a key={item} href={`#${item}`} onClick={() => setMobileMenuOpen(false)} className="hover:text-cyan-400">
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
            className="w-full h-full object-cover object-center grayscale brightness-[0.4]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
        </div>

        <div className="container mx-auto px-8 relative z-10">
          <div className="max-w-4xl">
            <h2 className="text-white/40 font-bold tracking-[0.4em] lowercase mb-6 text-xs flex items-center gap-4 animate-fade-in">
              <span className="w-8 h-[1px] bg-white/20"></span> production house
            </h2>
            <h1 className="text-7xl md:text-[10rem] font-bold lowercase tracking-tighter leading-[0.8] mb-12 animate-slide-up">
              beyond <br /> <span className="text-white/20">the sound</span>
            </h1>
            <div className="flex flex-wrap gap-10 pt-4 animate-fade-in opacity-0" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
              <a href="#catalog" className="group flex items-center gap-3 text-sm font-bold lowercase tracking-widest border-b border-white/20 pb-2 hover:border-white transition-all">
                view credits <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
              <a href="#contact" className="group flex items-center gap-3 text-sm font-bold lowercase tracking-widest border-b border-white/20 pb-2 hover:border-white transition-all">
                start project <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* --- ARTIST PROFILE --- */}
      <section id="about" className="py-48 bg-[#050505]">
        <div className="container mx-auto px-8">
          <div className="grid lg:grid-cols-12 gap-20 items-start">
            <div className="lg:col-span-5 relative group">
              <img 
                src={IMAGES.about} 
                alt="about djmerkone" 
                onError={(e) => handleImageError(e, IMAGES.fallbackAbout)}
                className="w-full h-auto grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-[1.02] shadow-2xl" 
              />
              <div className="absolute bottom-6 right-6 bg-white text-black p-5 text-[10px] font-black uppercase tracking-widest italic shadow-xl">
                est. 1990s
              </div>
            </div>
            
            <div className="lg:col-span-7 space-y-14 lg:pl-16">
              <h3 className="text-6xl md:text-8xl font-bold tracking-tighter lowercase leading-[0.85] italic">
                multidisciplinary <br /> sound engineer
              </h3>
              <p className="text-2xl text-white/40 leading-snug lowercase font-light">
                with over 25 years of evolution, alex <span className="text-white italic">"djmerkone"</span> baldrich operates at the intersection of rhythm and precision. his catalog is a testament to the fluid movement between <span className="text-white">hip-hop grittiness</span>, <span className="text-white">soulful r&b</span>, and the high-energy pulse of <span className="text-white">latin and house</span> music.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-16 pt-16 border-t border-white/5">
                <div>
                  <h4 className="text-[10px] font-black lowercase tracking-[0.2em] text-white/20 mb-3 uppercase">genres</h4>
                  <p className="text-sm font-bold opacity-80 leading-relaxed">hip-hop / house / r&b / latin freestyle</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-black lowercase tracking-[0.2em] text-white/20 mb-3 uppercase">experience</h4>
                  <p className="text-sm font-bold opacity-80 leading-relaxed">25+ years industry veteran</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-black lowercase tracking-[0.2em] text-white/20 mb-3 uppercase">specialty</h4>
                  <p className="text-sm font-bold opacity-80 leading-relaxed">mastering & creative production</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- MINIMALIST CATALOG --- */}
      <section id="catalog" className="py-48 bg-white text-black">
        <div className="container mx-auto px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-32 gap-16">
            <div>
              <h2 className="text-7xl md:text-9xl font-bold lowercase tracking-tighter leading-none mb-8">catalog</h2>
              <p className="text-black/40 max-w-sm text-xl lowercase leading-relaxed font-medium">a complete registry of credits across two decades of collaboration.</p>
            </div>
            
            <div className="flex flex-wrap gap-6">
              {['all', 'producer', 'remixer', 'mastering', 'artist'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-sm font-black lowercase tracking-[0.2em] border-b-2 transition-all pb-2 ${activeTab === tab ? 'border-black text-black' : 'border-transparent text-black/20 hover:text-black/60'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-0">
            {filteredCatalog.map((track, idx) => (
              <div key={idx} className="group grid grid-cols-1 md:grid-cols-12 items-center py-10 border-t border-black/5 hover:bg-black/[0.015] transition-all duration-300 px-6">
                <div className="md:col-span-1 text-[11px] font-black text-black/20 italic tracking-widest mb-2 md:mb-0">{track.year}</div>
                <div className="md:col-span-5">
                  <h4 className="text-3xl font-bold lowercase tracking-tight group-hover:translate-x-3 transition-transform duration-500 italic">{track.title}</h4>
                  <p className="text-black/40 text-sm font-bold lowercase mt-1">{track.artist} <span className="mx-2 text-black/10">•</span> {track.version}</p>
                </div>
                <div className="md:col-span-3 text-xs font-bold text-black/30 lowercase tracking-widest mt-6 md:mt-0">{track.genre}</div>
                <div className="md:col-span-2 text-[10px] font-black text-black/20 lowercase tracking-[0.3em] mt-3 md:mt-0 uppercase">{track.role}</div>
                <div className="md:col-span-1 text-right hidden md:block opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <ArrowUpRight size={24} className="ml-auto text-black/20 group-hover:text-black" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CONTACT / STUDIO --- */}
      <section id="contact" className="py-48 bg-[#050505]">
        <div className="container mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-32 items-center">
            <div className="space-y-16">
              <h2 className="text-7xl md:text-8xl font-bold tracking-tighter leading-[0.85] lowercase italic">
                elevate <br /> <span className="text-white/20">your sound</span>
              </h2>
              <p className="text-2xl text-white/40 lowercase max-w-md font-light leading-snug">
                currently accepting projects for mid-2026. whether it's the final mastering polish or full-scale production, lets capture the vision.
              </p>
              <div className="space-y-8 pt-8">
                <div className="flex items-center gap-8 text-white/60 hover:text-white transition-all cursor-pointer group">
                  <div className="p-4 rounded-full border border-white/10 group-hover:border-white transition-colors">
                    <Mail size={24} />
                  </div>
                  <span className="text-2xl font-bold tracking-tight">session@djmerkone.com</span>
                </div>
                <div className="flex items-center gap-8 text-white/60 hover:text-white transition-all cursor-pointer group">
                  <div className="p-4 rounded-full border border-white/10 group-hover:border-white transition-colors">
                    <Instagram size={24} />
                  </div>
                  <span className="text-2xl font-bold tracking-tight">@djmerkone</span>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.02] p-12 md:p-20 rounded-[3rem] border border-white/5 backdrop-blur-sm shadow-2xl">
              <form className="space-y-12" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-6">
                  <label className="text-[10px] font-black lowercase tracking-[0.4em] text-white/20 uppercase">project details</label>
                  <input type="text" placeholder="artist name" className="w-full bg-transparent border-b border-white/10 py-5 focus:border-white outline-none transition-all placeholder:text-white/5 lowercase text-2xl font-light" />
                  <input type="email" placeholder="email address" className="w-full bg-transparent border-b border-white/10 py-5 focus:border-white outline-none transition-all placeholder:text-white/5 lowercase text-2xl font-light" />
                </div>
                <div className="space-y-6">
                  <label className="text-[10px] font-black lowercase tracking-[0.4em] text-white/20 uppercase">your vision</label>
                  <textarea placeholder="describe the vibe..." rows="3" className="w-full bg-transparent border-b border-white/10 py-5 focus:border-white outline-none transition-all placeholder:text-white/5 lowercase text-2xl font-light"></textarea>
                </div>
                <button className="flex items-center gap-6 text-3xl font-bold lowercase group border-b-2 border-white pb-3 hover:gap-10 transition-all italic">
                  send request <ArrowUpRight size={36} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* --- MINIMAL FOOTER --- */}
      <footer className="py-32 border-t border-white/5 bg-[#050505]">
        <div className="container mx-auto px-8 flex flex-col items-center gap-16">
          <div className="text-4xl font-bold lowercase tracking-tighter italic hover:opacity-70 transition-opacity cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            djmerkone
          </div>
          
          <div className="flex space-x-16 opacity-30">
            <a href="#" className="hover:opacity-100 transition-opacity hover:text-cyan-400"><Instagram size={24} /></a>
            <a href="#" className="hover:opacity-100 transition-opacity hover:text-red-500"><Youtube size={24} /></a>
            <a href="#" className="hover:opacity-100 transition-opacity hover:text-fuchsia-500"><Music size={24} /></a>
          </div>

          <div className="text-[9px] text-white/10 font-black lowercase tracking-[0.6em] text-center max-w-sm leading-loose uppercase">
            &copy; 2026 djmerkone music • engineering florida sound
          </div>
        </div>
      </footer>

      {/* Global Style Injector */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&display=swap');
        
        body {
          font-family: 'Inter', sans-serif;
          background-color: #050505;
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
          from { transform: translateY(80px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        html {
          scroll-behavior: smooth;
        }
        ::placeholder {
          font-style: italic;
        }
      `}} />
    </div>
  );
}