import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  Disc, 
  Music, 
  ChevronDown, 
  Menu, 
  X, 
  Mail,
  Youtube,
  ExternalLink,
  Facebook
} from 'lucide-react';

// --- CUSTOM BRAND ICONS (SVG) ---
const InstagramIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

const YoutubeIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>
);

const TikTokIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
);

const AppleMusicIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
);

const AmazonIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 14c.5 2 4 4.5 9 4.5s8.5-2.5 9-4.5"/><path d="M17 12c-2 4-4.5 4-7 4"/></svg>
);

// --- VERIFIED LATEST RELEASES ---
const LATEST_RELEASES = [
  { 
    artist: "marilyn torres", 
    title: "don't let me", 
    work: "Writer, Producer, Engineer, Mastering Engineer", 
    year: "2026",
    amazonUrl: "https://www.amazon.com/Dont-Let-Me-Marilyn-Torres/dp/B0GHSXW5BV",
    youtubeUrl: "https://music.youtube.com/playlist?list=OLAK5uy_l6vs4GPW_kLZl21rvPS02g5c8kFhUBSiY&si=8BM4bBAkYnuSpCGD",
    appleUrl: "https://music.apple.com/us/album/dont-let-me/1870639799",
    cover: "https://m.media-amazon.com/images/I/41gl0MgSbrL._UX358_FMwebp_QL85_.jpg"
  },
  { 
    artist: "jase david", 
    title: "threads", 
    work: "Writer, Producer, Mastering Engineer", 
    year: "2026",
    amazonUrl: "https://www.amazon.com/THREADS-Jase-David/dp/B0GCH1SLZW",
    youtubeUrl: "https://music.youtube.com/playlist?list=OLAK5uy_lewAjL6bRcVMaeIHR7SsMkE8tLqKV5tUg&si=BIbZW2k24YUAjDrI",
    appleUrl: "https://music.apple.com/us/album/threads-ep/1864168921",
    cover: "https://m.media-amazon.com/images/I/51VA2eGveuL._UX358_FMwebp_QL85_.jpg"
  },
  { 
    artist: "marilyn torres", 
    title: "the ep", 
    work: "Writer, Producer, Engineer, Mastering Engineer", 
    year: "2026",
    amazonUrl: "https://www.amazon.com/dp/B0FYCWF875/ref=sr_1_1?crid=20PTTRWIWS2DN&dib=eyJ2IjoiMSJ9.yXyPDni48zQ11EnVLo7a4A.MKk7XTWdMsgiQDArcu2FfMSQR3vJVKlKjTeb3BTyOmE&dib_tag=se&keywords=marilyn+torres+the+ep&qid=1775272699&sprefix=marilyn+torres+the+ep%2Caps%2C181&sr=8-1",
    youtubeUrl: "https://music.youtube.com/playlist?list=OLAK5uy_kY9dUC_i_GeUWXTc8fFH8Iy8WfBHlHVlg&si=kkfOPHSeDCf58fTA",
    appleUrl: "https://music.apple.com/us/album/the-ep/1850311861",
    cover: "https://m.media-amazon.com/images/I/41w+uNCU8ZL._UX358_FMwebp_QL85_.jpg"
  },
];

const IMAGES = {
  hero: "/PSX_20241204_111437.jpg", 
  about: "/Dofoto_20241208_075521208.jpg", 
  fallbackHero: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=2000",
  fallbackAbout: "https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?auto=format&fit=crop&q=80&w=2000"
};

export default function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleImageError = (e, fallback) => {
    e.target.onerror = null;
    e.target.src = fallback;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] font-sans selection:bg-white selection:text-black overflow-x-hidden">
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
        <div className="container mx-auto px-8 relative z-10 text-white text-left">
          <div className="max-w-5xl">
            <h2 className="text-white/40 font-bold tracking-[0.5em] lowercase mb-8 text-xs flex items-center gap-4 animate-fade-in uppercase">
              <span className="w-12 h-[1px] bg-white/20"></span> engineering the florida sound
            </h2>
            <h1 className="text-7xl md:text-[11rem] font-bold lowercase tracking-tighter leading-[0.8] mb-14 animate-slide-up">
              beyond <br /> <span className="text-white/10">the noise</span>
            </h1>
          </div>
        </div>
      </section>

      {/* --- ABOUT --- */}
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
            
            <div className="lg:col-span-7 space-y-16 lg:pl-16 text-white">
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
                  <ul className="text-sm font-bold opacity-80 space-y-2 lowercase italic text-white/60">
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

      {/* --- LATEST RELEASES --- */}
      <section id="catalog" className="py-48 lg:py-64 bg-white text-black">
        <div className="container mx-auto px-8">
          <div className="max-w-3xl mb-32">
            <h2 className="text-8xl md:text-[10rem] font-bold lowercase tracking-tighter leading-none mb-8 italic text-left">latest releases</h2>
            <p className="text-black/40 text-xl md:text-2xl lowercase leading-tight font-medium text-left">available for streaming and digital acquisition.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-20">
            {LATEST_RELEASES.map((item, idx) => (
              <div key={idx} className="group flex flex-col">
                <div className="aspect-square bg-black/5 overflow-hidden rounded-2xl shadow-2xl relative mb-8">
                  <img 
                    src={item.cover} 
                    alt={item.title} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                </div>
                
                <div className="flex-1 flex flex-col text-left">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-4xl font-bold lowercase tracking-tight italic leading-none">{item.title}</h4>
                    <span className="text-black/20 font-black italic text-sm">{item.year}</span>
                  </div>
                  <p className="text-black/60 text-lg font-bold lowercase mb-4">{item.artist}</p>
                  
                  <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em] leading-relaxed mb-8 flex-1">
                    {item.work}
                  </p>
                  
                  <div className="flex flex-col gap-2 mt-auto">
                    <a 
                      href={item.youtubeUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-5 py-4 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors rounded-lg group/btn"
                    >
                      <span className="flex items-center gap-3"><YoutubeIcon size={16} /> YouTube Music</span>
                      <ArrowUpRight size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </a>
                    <a 
                      href={item.appleUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-5 py-4 border-2 border-black text-black text-[10px] font-black uppercase tracking-widest hover:bg-[#fa243c] hover:border-[#fa243c] hover:text-white transition-all rounded-lg group/btn"
                    >
                      <span className="flex items-center gap-3"><AppleMusicIcon size={16} /> Apple Music</span>
                      <ArrowUpRight size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </a>
                    <a 
                      href={item.amazonUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between px-5 py-4 border-2 border-black text-black text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 hover:border-orange-500 hover:text-white transition-all rounded-lg group/btn"
                    >
                      <span className="flex items-center gap-3"><AmazonIcon size={16} /> Amazon Music</span>
                      <ArrowUpRight size={14} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                    </a>
                  </div>
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
            <div className="space-y-20 text-white text-left">
              <div className="space-y-6">
                <h2 className="text-7xl md:text-9xl font-bold tracking-tighter leading-[0.8] lowercase italic">
                  elevate <br /> <span className="text-white/10 italic">your sound</span>
                </h2>
              </div>
              
              <div className="space-y-6 pt-10">
                <div className="flex items-center gap-10 text-white/50 hover:text-white transition-all cursor-pointer group">
                  <div className="p-5 rounded-full border border-white/5 group-hover:border-white group-hover:bg-white group-hover:text-black transition-all">
                    <Mail size={24} />
                  </div>
                  <span className="text-2xl font-bold tracking-tight italic">djmerkone@gmail.com</span>
                </div>
                <div className="flex items-center gap-10 text-white/50 hover:text-white transition-all cursor-pointer group">
                  <div className="p-5 rounded-full border border-white/5 group-hover:border-white group-hover:bg-white group-hover:text-black transition-all">
                    <YoutubeIcon size={24} />
                  </div>
                  <span className="text-2xl font-bold tracking-tight italic">@djmerkone</span>
                </div>
                <div className="flex items-center gap-10 text-white/50 hover:text-white transition-all cursor-pointer group">
                  <div className="p-5 rounded-full border border-white/5 group-hover:border-white group-hover:bg-white group-hover:text-black transition-all">
                    <TikTokIcon size={24} />
                  </div>
                  <span className="text-2xl font-bold tracking-tight italic">@djmerkone</span>
                </div>
                <div className="flex items-center gap-10 text-white/50 hover:text-white transition-all cursor-pointer group">
                  <div className="p-5 rounded-full border border-white/5 group-hover:border-white group-hover:bg-white group-hover:text-black transition-all">
                    <Facebook size={24} />
                  </div>
                  <span className="text-2xl font-bold tracking-tight italic">facebook.com/djmerkone</span>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.01] p-12 md:p-24 rounded-[4rem] border border-white/5 backdrop-blur-3xl shadow-3xl">
              <form className="space-y-14" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-10 text-white text-left">
                  <div className="space-y-4">
                    <label className="text-[11px] font-black lowercase tracking-[0.5em] text-white/20 uppercase ml-1">artist identity</label>
                    <input type="text" placeholder="name / moniker" className="w-full bg-transparent border-b border-white/10 py-6 focus:border-white outline-none transition-all placeholder:text-white/5 lowercase text-3xl font-light italic" />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[11px] font-black lowercase tracking-[0.5em] text-white/20 uppercase ml-1">contact channel</label>
                    <input type="email" placeholder="email address" className="w-full bg-transparent border-b border-white/10 py-6 focus:border-white outline-none transition-all placeholder:text-white/5 lowercase text-3xl font-light italic" />
                  </div>
                </div>
                <div className="space-y-4 text-white text-left">
                  <label className="text-[11px] font-black lowercase tracking-[0.5em] text-white/20 uppercase ml-1">the vision</label>
                  <textarea placeholder="describe the sonic direction..." rows="3" className="w-full bg-transparent border-b border-white/10 py-6 focus:border-white outline-none transition-all placeholder:text-white/5 lowercase text-3xl font-light italic"></textarea>
                </div>
                <button className="flex items-center gap-10 text-4xl font-bold lowercase group border-b-2 border-white pb-4 hover:gap-16 transition-all italic w-full justify-between text-white">
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
          <div className="text-5xl font-bold lowercase tracking-tighter italic text-white">djmerkone</div>
          <div className="flex space-x-20 opacity-20">
            <a href="https://youtube.com/@djmerkone" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity hover:text-white"><YoutubeIcon size={32} /></a>
            <a href="https://tiktok.com/@djmerkone" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity hover:text-white"><TikTokIcon size={32} /></a>
            <a href="https://instagram.com/djmerkone" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity hover:text-white"><InstagramIcon size={32} /></a>
            <a href="https://www.facebook.com/djmerkone/" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity hover:text-white"><Facebook size={32} /></a>
          </div>
          <div className="text-[10px] text-white/10 font-black lowercase tracking-[0.8em] text-center max-w-md leading-loose uppercase italic">
             &copy; {new Date().getFullYear()} djmerkone music <br /> florida sound engineering / high-end production
          </div>
        </div>
      </footer>

      {/* Global Style Injector */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #050505; margin: 0; }
        .animate-fade-in { animation: fadeIn 2s ease-out forwards; }
        .animate-slide-up { animation: slideUp 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        html { scroll-behavior: smooth; }
        ::placeholder { font-style: italic; opacity: 0.1; }
      `}} />
    </div>
  );
}