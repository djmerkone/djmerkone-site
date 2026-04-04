import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  Disc, 
  Music, 
  ChevronDown, 
  Menu, 
  X, 
  Mail,
  ExternalLink,
  CheckCircle2,
  Loader2,
  Facebook,
  BookOpen
} from 'lucide-react';

// --- BULLETPROOF CUSTOM BRAND ICONS (Fixed Alignment & Cutoff) ---
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
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 14c.5 2 4 4.5 8 4.5s7.5-2.5 8-4.5"/>
    <path d="M17.5 12c-1 3-4 3-5.5 3"/>
  </svg>
);

const FacebookIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

// --- VERIFIED LATEST RELEASES DATA ---
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
    amazonUrl: "https://www.amazon.com/dp/B0FYCWF875/ref=sr_1_1?crid=20PTTRWIWS2DN&keywords=marilyn+torres+the+ep",
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
  const [formStatus, setFormStatus] = useState('idle'); 
  const [bioOpen, setBioOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', vibe: '' });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleImageError = (e, fallback) => {
    e.target.onerror = null;
    e.target.src = fallback;
  };

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
      alert("Submission error. Please check your internet or email djmerkone@gmail.com directly.");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] font-sans selection:bg-white selection:text-black overflow-x-hidden relative">
      
      {/* --- BIO MODAL (WINDOW LAYER) --- */}
      {bioOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-fade-in">
          {/* Blur Overlay - Click to close */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-2xl transition-all duration-500 cursor-pointer" 
            onClick={() => setBioOpen(false)}
          ></div>
          
          {/* The Bio Window */}
          <div className="relative w-full max-w-3xl bg-[#0a0a0a] border border-white/10 p-8 md:p-16 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] max-h-[85vh] overflow-y-auto scrollbar-hide animate-slide-up">
            <button 
              onClick={() => setBioOpen(false)}
              className="absolute top-6 right-6 md:top-10 md:right-10 text-white/40 hover:text-white transition-colors"
            >
              <X size={32} />
            </button>
            
            <div className="space-y-12 text-left">
              <div className="space-y-2">
                <h3 className="text-4xl md:text-6xl font-bold tracking-tighter lowercase italic text-white">merkone</h3>
                <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white/30">sonic architect & multidisciplinary engineer</p>
              </div>

              <div className="space-y-8 text-lg md:text-xl text-white/70 leading-relaxed font-light lowercase">
                <p>
                  <span className="text-white font-bold">djmerkone</span> operates at the high-fidelity intersection of rhythm and precision. with a professional career spanning over two decades, he has established himself as a definitive architect of the florida sound—a multidisciplinary engineer whose work bridges the gap between classic foundations and futuristic clarity.
                </p>
                <p>
                  rooted in the high-energy late 90s DJ scene, <span className="text-white font-bold">merk's</span> evolution into professional production in 1999 set the stage for a technical mastery that culminated in his first official release in 2001. his catalog is a diverse registry of credits that move seamlessly between the gritty low-end of experimental hip-hop, soulful textures of r&b, and the driving heart of latin freestyle and house music.
                </p>
                <p>
                  as a producer and mastering engineer, <span className="text-white font-bold">merkone</span> views sound as architecture. whether he is building a track from the ground up or providing the final clinical polish to a release, his philosophy remains the same: engineering is the science of emotion. his precision in the studio ensures that every frequency serves a purpose, allowing the artist's vision to cut through the digital noise with absolute authority.
                </p>
                <p>
                  entering 2026, <span className="text-white font-bold">merk</span> remains a sought-after collaborator for artists seeking a signature sonic identity. his recent works—including extensive production and engineering for marilyn torres' <span className="italic">the ep</span> and jase david's <span className="italic">threads</span>—showcase a continued dedication to pushing the boundaries of modern sound.
                </p>
                <p>
                  <span className="text-white font-bold">djmerkone</span> is more than a technician; he is a curator of the sonic experience. he doesn't just record music—he engineers the future.
                </p>
              </div>

              <button 
                onClick={() => setBioOpen(false)}
                className="inline-flex items-center gap-4 text-xs font-black uppercase tracking-widest border-b border-white pb-2 hover:opacity-50 transition-opacity text-white"
              >
                return to vault <ArrowUpRight size={14}/>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- SITE CONTENT LAYER --- */}
      <div className={`transition-all duration-700 ${bioOpen ? 'blur-sm scale-[0.98]' : 'blur-0 scale-100'}`}>
        {/* --- NAVIGATION --- */}
        <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-black/90 backdrop-blur-xl py-4 border-b border-white/5 shadow-2xl' : 'bg-transparent py-8'}`}>
          <div className="container mx-auto px-8 flex justify-between items-center">
            <div className="text-xl font-bold tracking-tight lowercase flex items-center gap-2 group cursor-pointer text-white" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
              djmerkone
            </div>
            <div className="hidden md:flex space-x-12 text-[10px] font-black lowercase tracking-[0.3em] opacity-60">
              {['home', 'about', 'catalog', 'contact'].map((item) => (
                <a key={item} href={`#${item}`} className="hover:opacity-100 transition-opacity uppercase font-bold text-white">{item}</a>
              ))}
            </div>
          </div>
        </nav>

        {/* --- HERO --- */}
        <section id="home" className="relative h-screen flex items-end pb-32 text-left">
          <div className="absolute inset-0 z-0">
            <img src={IMAGES.hero} alt="djmerkone" onError={(e) => handleImageError(e, IMAGES.fallbackHero)} className="w-full h-full object-cover object-center grayscale brightness-[0.35]"/>
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent"></div>
          </div>
          <div className="container mx-auto px-8 relative z-10 text-white">
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
        <section id="about" className="py-48 lg:py-64 bg-[#050505] text-left">
          <div className="container mx-auto px-8">
            <div className="grid lg:grid-cols-12 gap-24 items-start">
              <div className="lg:col-span-5 relative group">
                <img 
                  src={IMAGES.about} 
                  alt="about djmerkone" 
                  onError={(e) => handleImageError(e, IMAGES.fallbackAbout)}
                  className="relative w-full h-auto grayscale transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-[1.01] shadow-2xl border border-white/5 rounded-lg" 
                />
                <div className="absolute -bottom-8 -right-8 bg-white text-black px-8 py-6 text-xs font-black uppercase tracking-[0.3em] italic shadow-2xl hidden md:block">
                  pioneer / since 2001
                </div>
              </div>
              
              <div className="lg:col-span-7 space-y-16 lg:pl-16 text-white">
                <div className="space-y-8">
                  <h3 className="text-6xl md:text-[5.5rem] font-bold tracking-tighter lowercase leading-[0.85] italic">
                    sonic architect <br /> & producer
                  </h3>
                  <p className="text-2xl md:text-3xl text-white/40 leading-tight lowercase font-light max-w-2xl">
                    with over 20 years of sonic evolution, <span className="text-white italic">"merkone"</span> operates at the intersection of rhythm and precision.
                  </p>
                  <button 
                    onClick={() => setBioOpen(true)}
                    className="group flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] border border-white/20 px-8 py-4 hover:bg-white hover:text-black transition-all"
                  >
                    <BookOpen size={14} /> full bio <ArrowUpRight size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-16 border-t border-white/5">
                  <div className="space-y-4">
                    <h4 className="text-[11px] font-black lowercase tracking-[0.3em] text-white/20 uppercase">the range</h4>
                    <p className="text-sm font-bold opacity-80 lowercase italic text-white/70">hip-hop / house / r&b / latin freestyle</p>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[11px] font-black lowercase tracking-[0.3em] text-white/20 uppercase">the expertise</h4>
                    <ul className="text-sm font-bold opacity-80 space-y-2 lowercase italic text-white/70">
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
        <section id="catalog" className="py-48 lg:py-64 bg-white text-black text-left">
          <div className="container mx-auto px-8">
            <div className="max-w-3xl mb-32">
              <h2 className="text-8xl md:text-[10rem] font-bold lowercase tracking-tighter leading-none mb-8 italic">latest releases</h2>
              <p className="text-black/40 text-xl md:text-2xl lowercase leading-tight font-medium">available for streaming and digital acquisition.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-24">
              {LATEST_RELEASES.map((item, idx) => (
                <div key={idx} className="group flex flex-col">
                  <div className="aspect-square bg-black/5 overflow-hidden rounded-2xl shadow-2xl relative mb-10">
                    <img src={item.cover} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"/>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <div className="flex-1 flex flex-col text-left">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-4xl font-bold lowercase tracking-tight italic leading-none">{item.title}</h4>
                      <span className="text-black/20 font-black italic text-sm">{item.year}</span>
                    </div>
                    <p className="text-black/60 text-lg font-bold lowercase mb-6">{item.artist}</p>
                    <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em] leading-relaxed mb-10 flex-1 min-h-[60px]">{item.work}</p>
                    <div className="flex flex-col gap-3 mt-auto">
                      <a href={item.youtubeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-6 py-5 bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-colors rounded-xl group/btn">
                        <span className="flex items-center gap-4"><YoutubeIcon size={18} /> YouTube Music</span>
                        <ArrowUpRight size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                      </a>
                      <a href={item.appleUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-6 py-5 border-2 border-black text-black text-[10px] font-black uppercase tracking-widest hover:bg-[#fa243c] hover:border-[#fa243c] hover:text-white transition-all rounded-xl group/btn">
                        <span className="flex items-center gap-4"><AppleMusicIcon size={18} /> Apple Music</span>
                        <ArrowUpRight size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                      </a>
                      <a href={item.amazonUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-6 py-5 border-2 border-black text-black text-[10px] font-black uppercase tracking-widest hover:bg-[#ff9900] hover:border-[#ff9900] hover:text-white transition-all rounded-xl group/btn">
                        <span className="flex items-center gap-4"><AmazonIcon size={18} /> Amazon Music</span>
                        <ArrowUpRight size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- CONTACT --- */}
        <section id="contact" className="py-48 lg:py-64 bg-[#050505] text-left">
          <div className="container mx-auto px-8">
            <div className="grid lg:grid-cols-2 gap-40 items-start">
              <div className="space-y-20 text-white">
                <h2 className="text-7xl md:text-9xl font-bold tracking-tighter leading-[0.8] lowercase italic text-white">elevate <br /> <span className="text-white/10 italic">your sound</span></h2>
                <div className="space-y-6 pt-10">
                  <div className="flex items-center gap-10 text-white/50 hover:text-white transition-all cursor-pointer group">
                    <div className="p-5 rounded-full border border-white/5 group-hover:border-white group-hover:bg-white group-hover:text-black transition-all"><Mail size={24} /></div>
                    <span className="text-2xl font-bold tracking-tight italic">djmerkone@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-10 text-white/50 hover:text-white transition-all cursor-pointer group">
                    <div className="p-5 rounded-full border border-white/5 group-hover:border-white group-hover:bg-white group-hover:text-black transition-all"><YoutubeIcon size={24} /></div>
                    <span className="text-2xl font-bold tracking-tight italic">@djmerkone</span>
                  </div>
                  <div className="flex items-center gap-10 text-white/50 hover:text-white transition-all cursor-pointer group">
                    <div className="p-5 rounded-full border border-white/5 group-hover:border-white group-hover:bg-white group-hover:text-black transition-all"><TikTokIcon size={24} /></div>
                    <span className="text-2xl font-bold tracking-tight italic">@djmerkone</span>
                  </div>
                  <div className="flex items-center gap-10 text-white/50 hover:text-white transition-all cursor-pointer group">
                    <div className="p-5 rounded-full border border-white/5 group-hover:border-white group-hover:bg-white group-hover:text-black transition-all"><FacebookIcon size={24} /></div>
                    <span className="text-2xl font-bold tracking-tight italic">facebook.com/djmerkone</span>
                  </div>
                </div>
              </div>
              <div className="bg-white/[0.01] p-12 md:p-24 rounded-[4rem] border border-white/5 backdrop-blur-3xl shadow-3xl">
                {formStatus === 'success' ? (
                  <div className="py-24 text-center space-y-8 animate-fade-in">
                    <CheckCircle2 size={80} className="mx-auto text-white/80" />
                    <h3 className="text-4xl font-bold italic text-white lowercase">inquiry received</h3>
                    <button onClick={() => setFormStatus('idle')} className="text-xs font-black uppercase tracking-widest border-b border-white/20 pb-2 hover:border-white transition-all text-white/60 hover:text-white">send another</button>
                  </div>
                ) : (
                  <form className="space-y-14" onSubmit={handleSubmit}>
                    <div className="space-y-10 text-white text-left">
                      <div className="space-y-4"><label className="text-[11px] font-black lowercase tracking-[0.5em] text-white/20 uppercase ml-1">artist identity</label><input type="text" required placeholder="name / moniker" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-transparent border-b border-white/10 py-6 focus:border-white outline-none transition-all placeholder:text-white/5 lowercase text-3xl font-light italic" /></div>
                      <div className="space-y-4"><label className="text-[11px] font-black lowercase tracking-[0.5em] text-white/20 uppercase ml-1">contact channel</label><input type="email" required placeholder="email address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-transparent border-b border-white/10 py-6 focus:border-white outline-none transition-all placeholder:text-white/5 lowercase text-3xl font-light italic" /></div>
                    </div>
                    <div className="space-y-4 text-white text-left"><label className="text-[11px] font-black lowercase tracking-[0.5em] text-white/20 uppercase ml-1">the vision</label><textarea required placeholder="describe the sonic direction..." rows="3" value={formData.vibe} onChange={(e) => setFormData({...formData, vibe: e.target.value})} className="w-full bg-transparent border-b border-white/10 py-6 focus:border-white outline-none transition-all placeholder:text-white/5 lowercase text-3xl font-light italic"></textarea></div>
                    <button type="submit" disabled={formStatus === 'sending'} className="flex items-center gap-10 text-4xl font-bold lowercase group border-b-2 border-white pb-4 hover:gap-16 transition-all italic w-full justify-between text-white disabled:opacity-50">
                      {formStatus === 'sending' ? <span className="flex items-center gap-4 italic lowercase"><Loader2 className="animate-spin" /> sending...</span> : <>submit inquiry <ArrowUpRight size={44} /></>}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="py-40 border-t border-white/5 bg-[#050505]">
          <div className="container mx-auto px-8 flex flex-col items-center gap-20">
            <div className="text-5xl font-bold lowercase tracking-tighter italic text-white cursor-pointer group flex items-center gap-4" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
              <div className="w-3 h-3 bg-white rounded-full"></div>
              djmerkone
            </div>
            <div className="flex space-x-20 opacity-20">
              <a href="https://youtube.com/@djmerkone" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity hover:text-white"><YoutubeIcon size={32} /></a>
              <a href="https://tiktok.com/@djmerkone" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity hover:text-white"><TikTokIcon size={32} /></a>
              <a href="https://instagram.com/djmerkone" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity hover:text-white"><InstagramIcon size={32} /></a>
              <a href="https://www.facebook.com/djmerkone/" target="_blank" rel="noopener noreferrer" className="hover:opacity-100 transition-opacity hover:text-white"><FacebookIcon size={32} /></a>
            </div>
            <div className="text-[10px] text-white/10 font-black lowercase tracking-[0.8em] text-center max-w-md leading-loose uppercase italic">
               &copy; {new Date().getFullYear()} djmerkone music <br /> florida sound engineering / high-end production
            </div>
          </div>
        </footer>
      </div>

      {/* Global Style Injector */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #050505; margin: 0; }
        .animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
        .animate-slide-up { animation: slideUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        html { scroll-behavior: smooth; }
        ::placeholder { font-style: italic; opacity: 0.1; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}