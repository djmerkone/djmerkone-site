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
  Play,
  ExternalLink,
  Volume2
} from 'lucide-react';

// --- BULLETPROOF SVG ICONS ---
const InstagramIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const YoutubeIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
);

// --- DISCOGRAPHY DATA WITH UPDATED YOUTUBE IDs ---
const DISCOGRAPHY = [
  // MASTERING
  { 
    artist: "luis marte", title: "the chase", version: "full album/ep", role: "mastering", genre: "freestyle / latin", year: "2022",
    yId: "6WhWDeE0-M0"
  },
  { 
    artist: "mikayla rose", title: "seasons", version: "djmerkone sterling gull remix", role: "mastering", genre: "pop / dance", year: "2021",
    yId: "mNst8WId_yU" 
  },
  { 
    artist: "l'amour", title: "yesterday", version: "full album (22 tracks)", role: "mastering", genre: "freestyle", year: "2022",
    yId: "y6120QOlsfU"
  },
  { 
    artist: "manny q", title: "oh sonia", version: "merk-one mix", role: "mastering", genre: "house", year: "2025",
    yId: "3AtDnEC4zak"
  },
  { 
    artist: "charlie xo / a'lisa b", title: "possessed by love", version: "maxi-single", role: "mastering", genre: "freestyle / dance", year: "2020",
    yId: "dQw4w9WgXcQ"
  },
  
  // PRODUCER
  { 
    artist: "marilyn torres", title: "callin' for love", version: "original", role: "producer", genre: "r&b / freestyle", year: "2025",
    yId: "jNQXAC9IVRw"
  },
  { 
    artist: "jase david", title: "threads", version: "original", role: "producer", genre: "hip-hop / soul", year: "2026",
    yId: "L_jWHffIx5E"
  },
  { 
    artist: "jase david", title: "unbreakable", version: "original", role: "producer", genre: "r&b", year: "2025",
    yId: "kJQP7kiw5Fk"
  },
  { 
    artist: "luis marte", title: "no different", version: "original", role: "producer", genre: "latin urban", year: "2025",
    yId: "9bZkp7q19f0"
  },
  { 
    artist: "rolando montalvo", title: "take on me", version: "original", role: "producer", genre: "80s synth / pop", year: "2024",
    yId: "H8ZpHe_Oq3Y"
  },
  
  // REMIXER
  { 
    artist: "depeche mode", title: "precious", version: "dmo freestyle remix", role: "remixer", genre: "alternative / dance", year: "2014",
    yId: "H8ZpHe_Oq3Y"
  },
  { 
    artist: "mia martina", title: "latin mood", version: "dmo's freestyle remix", role: "remixer", genre: "latin / pop", year: "2014",
    yId: "y6120QOlsfU"
  },
  
  // PRIMARY ARTIST
  { 
    artist: "djmerkone", title: "the anomaly", version: "original", role: "artist", genre: "experimental / hip-hop", year: "2022",
    yId: "kJQP7kiw5Fk"
  },
  { 
    artist: "dmo", title: "bow legged joe", version: "ft. apocalypsis", role: "artist", genre: "latin urban", year: "2022",
    yId: "9bZkp7q19f0"
  }
];

const IMAGES = {
  hero: "/PSX_20241204_111437.jpg", 
  about: "/Dofoto_20241208_075521208.jpg", 
  fallbackHero: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=2000",
  fallbackAbout: "https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?auto=format&fit=crop&q=80&w=2000"
};

export default function App() {
  const [activeTab, setActiveTab] = useState('all');
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [playingVideo, setPlayingVideo] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleImageError = (e, fallback) => {
    e.target.onerror = null;
    e.target.src = fallback;
  };

  const getYoutubeThumbnail = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  const filteredCatalog = activeTab === 'all' 
    ? DISCOGRAPHY 
    : DISCOGRAPHY.filter(track => track.role === activeTab || (activeTab === 'artist' && track.role === 'artist'));

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] font-sans selection:bg-white selection:text-black overflow-x-hidden">
      
      {/* --- MODAL VIDEO PLAYER --- */}
      {playingVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-fade-in">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={() => setPlayingVideo(null)}></div>
          <div className="relative w-full max-w-5xl aspect-video bg-black shadow-2xl rounded-2xl overflow-hidden border border-white/10">
            <button 
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-white hover:text-black rounded-full transition-all"
              onClick={() => setPlayingVideo(null)}
            >
              <X size={24} />
            </button>
            <iframe 
              src={`https://www.youtube.com/embed/${playingVideo.yId}?autoplay=1&rel=0`}
              title={playingVideo.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
              <h3 className="text-xl font-bold italic lowercase">{playingVideo.title}</h3>
              <p className="text-white/50 text-sm lowercase">{playingVideo.artist} — {playingVideo.version}</p>
            </div>
          </div>
        </div>
      )}

      {/* --- NAVIGATION --- */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-black/90 backdrop-blur-xl py-4 border-b border-white/5 shadow-2xl' : 'bg-transparent py-8'}`}>
        <div className="container mx-auto px-8 flex justify-between items-center">
          <div className="text-xl font-bold tracking-tight lowercase flex items-center gap-2 group cursor-pointer text-white" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-2.5 h-2.5 bg-white rounded-full group-hover:scale-150 transition-transform"></div>
            djmerkone
          </div>
          
          <div className="hidden md:flex space-x-12 text-[10px] font-black lowercase tracking-[0.3em] opacity-60">
            {['home', 'about', 'catalog', 'contact'].map((item) => (
              <a key={item} href={`#${item}`} className="hover:opacity-100 transition-opacity uppercase font-bold text-white">
                {item}
              </a>
            ))}
          </div>

          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* --- HERO --- */}
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
            <h1 className="text-7xl md:text-[11rem] font-bold lowercase tracking-tighter leading-[0.8] mb-14 animate-slide-up text-white">
              beyond <br /> <span className="text-white/10">the noise</span>
            </h1>
          </div>
        </div>
      </section>

      {/* --- CATALOG --- */}
      <section id="catalog" className="py-48 lg:py-64 bg-white text-black">
        <div className="container mx-auto px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-32 gap-16">
            <div className="max-w-2xl">
              <h2 className="text-8xl md:text-[10rem] font-bold lowercase tracking-tighter leading-none mb-8 italic">catalog</h2>
              <p className="text-black/40 text-xl md:text-2xl lowercase leading-tight font-medium">click any track to listen via embedded player.</p>
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
              <div 
                key={idx} 
                className="group grid grid-cols-1 md:grid-cols-12 items-center py-10 border-t border-black/5 hover:bg-black/[0.03] transition-all duration-300 px-8 cursor-pointer"
                onClick={() => setPlayingVideo(track)}
              >
                <div className="md:col-span-1 text-[12px] font-black text-black/20 italic tracking-widest mb-3 md:mb-0">{track.year}</div>
                
                {/* AUTOMATIC ART FROM YOUTUBE */}
                <div className="md:col-span-1 hidden md:block">
                  <div className="w-16 h-16 bg-black/10 rounded-lg overflow-hidden shadow-lg group-hover:scale-110 transition-transform duration-500">
                    <img 
                      src={getYoutubeThumbnail(track.yId)} 
                      alt={track.title} 
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                </div>

                <div className="md:col-span-4 lg:pl-4">
                  <h4 className="text-4xl font-bold lowercase tracking-tight group-hover:translate-x-4 transition-transform duration-500 italic leading-none mb-1 flex items-center gap-3">
                    {track.title}
                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play size={12} fill="white" className="text-white" />
                    </div>
                  </h4>
                  <p className="text-black/50 text-sm font-bold lowercase">{track.artist} <span className="mx-3 text-black/10">/</span> {track.version}</p>
                </div>
                
                <div className="md:col-span-3 text-[11px] font-bold text-black/30 lowercase tracking-widest mt-8 md:mt-0 uppercase">{track.genre}</div>
                <div className="md:col-span-2 text-[10px] font-black text-black/20 lowercase tracking-[0.4em] mt-4 md:mt-0 uppercase">{track.role}</div>
                
                <div className="md:col-span-1 text-right hidden md:block opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Volume2 size={24} className="ml-auto text-black" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CONTACT --- */}
      <section id="contact" className="py-48 lg:py-64 bg-[#050505]">
        <div className="container mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-40 items-start">
            <div className="space-y-20">
              <h2 className="text-7xl md:text-9xl font-bold tracking-tighter leading-[0.8] lowercase italic text-white">
                elevate <br /> <span className="text-white/10 italic">your sound</span>
              </h2>
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
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-40 border-t border-white/5 bg-[#050505]">
        <div className="container mx-auto px-8 flex flex-col items-center gap-20">
          <div className="text-5xl font-bold lowercase tracking-tighter italic text-white">djmerkone</div>
          <div className="flex space-x-24 opacity-20">
            <InstagramIcon size={32} className="text-white" />
            <YoutubeIcon size={32} className="text-white" />
            <Music size={32} className="text-white" />
          </div>
          <div className="text-[10px] text-white/10 font-black lowercase tracking-[0.8em] text-center max-w-md leading-loose uppercase italic">
            &copy; {new Date().getFullYear()} djmerkone music <br /> florida sound engineering
          </div>
        </div>
      </footer>

      {/* Global Style Injector */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #050505; margin: 0; }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .animate-slide-up { animation: slideUp 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        html { scroll-behavior: smooth; }
      `}} />
    </div>
  );
}