import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag, Award, Star, ShieldCheck, Terminal } from "lucide-react";
import devImg from "../assets/IMG_20260620_212548.jpg";

function Home() {
  const [rotate, setRotate] = useState(0);

  useEffect(() => {
    document.title = 'ShopNest';

    const handleMouseMove = (e) => {
      let mouseX = e.clientX;
      let mouseY = e.clientY;

      let deltaX = mouseX - window.innerWidth / 2;
      let deltaY = mouseY - window.innerHeight / 2;

      var angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      setRotate(angle - 180);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-ochi-charcoal text-white flex flex-col font-sans overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative w-full pt-[12vh] pb-[6vh] px-8 lg:px-16 flex flex-col justify-between min-h-[85vh]">
        
        {/* Massive Bold Headlines */}
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col">
            <h1 
              style={{ transform: 'translateX(calc(var(--scroll-y, 0px) * -0.15))' }}
              className="text-[12vw] lg:text-[7.5vw] font-black leading-none tracking-tighter uppercase text-white select-none transition-transform duration-100 ease-out"
            >
              WE CURATE
            </h1>
            <div 
              style={{ transform: 'translateX(calc(var(--scroll-y, 0px) * 0.08))' }}
              className="flex items-center gap-[2vw] transition-transform duration-100 ease-out"
            >
              <div className="w-[12vw] lg:w-[9vw] h-[7vw] lg:h-[5.5vw] rounded-full bg-ochi-green relative overflow-hidden transition-all duration-500 hover:scale-105">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[3vw] h-[3vw] rounded-full flex items-center justify-center" style={{ backgroundColor: '#ffffff' }}>
                    <div style={{ transform: `rotate(${rotate}deg)` }} className="w-full relative h-2">
                      <div className="w-1.5 h-1.5 rounded-full absolute right-0" style={{ backgroundColor: '#212121' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              <h1 className="text-[12vw] lg:text-[7.5vw] font-black leading-none tracking-tighter uppercase text-white select-none">
                EYE-CATCHING
              </h1>
            </div>
            <h1 
              style={{ transform: 'translateX(calc(var(--scroll-y, 0px) * -0.1))' }}
              className="text-[12vw] lg:text-[7.5vw] font-black leading-none tracking-tighter uppercase text-white select-none transition-transform duration-100 ease-out"
            >
              DAILY ESSENTIALS.
            </h1>
          </div>
        </div>

        {/* Bottom Hero Ribbon */}
        <div className="max-w-7xl mx-auto w-full border-t border-white/10 mt-20 pt-8 flex flex-col md:flex-row justify-between items-center text-xs font-mono uppercase tracking-wider text-white/50 gap-6">
          <span>For design purists & aesthetic fans</span>
          <span>Curating premium everyday essentials</span>
          
          <a 
            href="#releases"
            className="px-5 py-2.5 rounded-full border border-white/20 text-white font-mono text-xs uppercase tracking-wider flex items-center gap-3 hover:bg-white hover:text-ochi-charcoal hover:border-white transition-all duration-300"
          >
            <span>Explore releases</span>
            <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-ochi-charcoal transition-colors">
              <ArrowRight className="h-3 w-3" />
            </div>
          </a>
        </div>

      </section>

      {/* --- INFINITE TEXT MARQUEE SECTION --- */}
      <section className="w-full bg-ochi-green text-ochi-charcoal py-12 rounded-t-3xl overflow-hidden select-none">
        <div className="border-t border-b border-ochi-charcoal/10 py-4 flex whitespace-nowrap overflow-hidden">
          <div className="animate-marquee font-sans font-black text-[12vw] lg:text-[8vw] leading-none uppercase tracking-tighter flex gap-8 pr-8">
            <span>SHOPNEST TRENDING COLLECTIONS •</span>
            <span>SHOPNEST TRENDING COLLECTIONS •</span>
          </div>
        </div>
      </section>

      {/* --- INTERACTIVE EYEBALLS SECTION (CREAM BACKGROUND) --- */}
      <section className="w-full bg-ochi-cream text-ochi-charcoal py-24 px-8 lg:px-16 rounded-b-3xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-16">
          
          <div className="max-w-xl flex flex-col gap-8 text-left">
            <h2 className="text-4xl lg:text-5xl font-black uppercase tracking-tight leading-none text-ochi-charcoal">
              Aesthetic essentials, crafted for modern life.
            </h2>
            <p className="text-sm lg:text-base text-ochi-charcoal/70 leading-relaxed font-sans font-medium">
              We focus heavily on rich designs, using soft layouts, clean border lines, and intuitive user experiences. Discover an immersive digital catalog built for style purists.
            </p>
            <div>
              <Link 
                to="/register"
                className="px-6 py-4 rounded-full bg-ochi-charcoal text-white font-mono text-xs uppercase tracking-wider inline-flex items-center gap-4 hover:bg-ochi-black transition-colors"
              >
                <span>Create account</span>
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </Link>
            </div>
          </div>

          {/* Interactive Eyes Container */}
          <div className="flex gap-8 justify-center items-center w-full md:w-auto py-8">
            
            {/* Eye 1 */}
            <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full flex items-center justify-center shadow-lg shadow-black/5" style={{ backgroundColor: '#ffffff' }}>
              <div className="relative w-3/5 h-3/5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#212121' }}>
                <div style={{ transform: `translate(-50%, -50%) rotate(${rotate}deg)` }} className="absolute top-1/2 left-1/2 w-full h-8 flex items-center justify-start">
                  <div className="w-5 h-5 rounded-full ml-1" style={{ backgroundColor: '#ffffff' }}></div>
                </div>
              </div>
            </div>

            {/* Eye 2 */}
            <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full flex items-center justify-center shadow-lg shadow-black/5" style={{ backgroundColor: '#ffffff' }}>
              <div className="relative w-3/5 h-3/5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#212121' }}>
                <div style={{ transform: `translate(-50%, -50%) rotate(${rotate}deg)` }} className="absolute top-1/2 left-1/2 w-full h-8 flex items-center justify-start">
                  <div className="w-5 h-5 rounded-full ml-1" style={{ backgroundColor: '#ffffff' }}></div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* --- FEATURED PRODUCTS SECTION --- */}
      <section id="releases" className="w-full py-24 px-8 lg:px-16 bg-ochi-charcoal scroll-mt-20">
        <div className="max-w-7xl mx-auto flex flex-col gap-12">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 gap-6">
            <div className="flex flex-col items-start gap-1">
              <span className="font-mono text-xs uppercase tracking-wider text-ochi-green">
                Premium releases
              </span>
              <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-tight text-white flex items-center gap-3">
                <ShoppingBag className="h-6 w-6 text-ochi-green" />
                <span>Trending Collections</span>
              </h2>
            </div>
            <p className="font-mono text-xs uppercase tracking-wider text-white/40 max-w-sm">
              Explore our physically cataloged inventory, built to combine elegance and functionality.
            </p>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            <ProductCard limit={12} />
          </div>

        </div>
      </section>

      {/* --- DEVELOPER PROFILE SECTION (OCHI STYLE CREAM SEGMENT) --- */}
      <section className="w-full bg-ochi-cream text-ochi-charcoal py-24 px-8 lg:px-16 rounded-t-3xl relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start justify-between gap-16">
          
          {/* Left Column: Details */}
          <div className="w-full lg:w-1/2 flex flex-col gap-8 text-left">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-ochi-charcoal/50 block mb-2">
                Engineering & Design
              </span>
              <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tight leading-none text-ochi-charcoal">
                The Architect
              </h2>
            </div>

            <p className="text-xl lg:text-2xl font-bold uppercase tracking-tight leading-snug text-ochi-charcoal">
              Maviz Ahmad is the developer behind ShopNest. A B.Tech Computer Science graduate specializing in premium full-stack architectures.
            </p>

            <div className="flex flex-col gap-6 text-sm lg:text-base text-ochi-charcoal/70 leading-relaxed font-sans font-medium">
              <p>
                Maviz Ahmad is a dedicated MERN Stack Engineer who merges industrial-grade logic with sophisticated web aesthetics. Specializing in high-performance architectures, dynamic caching patterns, and elegant interfaces, he focuses on writing clean, scalable, and responsive systems.
              </p>
              <p>
                By bridging frontend design systems with highly optimized backend APIs, he creates complete digital products that engage users and ensure effortless performance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 font-mono text-xs uppercase tracking-wider text-ochi-charcoal/80 border-t border-ochi-charcoal/10 pt-8">
              {/* Phone & Email */}
              <div className="flex flex-col gap-4">
                <h4 className="font-bold text-ochi-charcoal pb-2 border-b border-ochi-charcoal/10">Inquiries</h4>
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] text-ochi-charcoal/50">Telephone</span>
                  <a href="tel:+9196852244563" className="hover:text-ochi-green font-bold text-sm transition-colors text-ochi-charcoal">+91 96852 244563</a>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  <span className="text-[10px] text-ochi-charcoal/50">Electronic Mail</span>
                  <a href="mailto:anash.js.dev@gmail.com" className="hover:text-ochi-green font-bold text-sm transition-colors break-all text-ochi-charcoal">anash.js.dev@gmail.com</a>
                </div>
              </div>

              {/* Technologies */}
              <div className="flex flex-col gap-4">
                <h4 className="font-bold text-ochi-charcoal pb-2 border-b border-ochi-charcoal/10">Capabilities</h4>
                <div className="flex flex-col gap-3">
                  <div>
                    <span className="text-[10px] text-ochi-charcoal/50 block mb-1">Frontend Engineering</span>
                    <span className="font-bold text-ochi-charcoal block leading-relaxed">
                      React 19 / Redux Toolkit / Next.js / Vite / TS / Tailwind v4 / Axios
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-ochi-charcoal/50 block mb-1">Backend & Database</span>
                    <span className="font-bold text-ochi-charcoal block leading-relaxed">
                      Node.js / Express.js / MongoDB / Mongoose / Firebase Admin / JWT
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-ochi-charcoal/50 block mb-1">DevOps & Services</span>
                    <span className="font-bold text-ochi-charcoal block leading-relaxed">
                      Netlify / Render / Vercel / Git / CI/CD / nodemailer / CORS
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <a 
                href="https://github.com/Anash1413/Shopnest"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-4 rounded-full bg-ochi-charcoal text-white font-mono text-xs uppercase tracking-wider inline-flex items-center gap-4 hover:bg-ochi-black transition-colors"
              >
                <span>Browse Github Code</span>
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </a>
            </div>
          </div>

          {/* Right Column: Layered Parallax Profile Photo & Badge Card (Side-by-Side Response) */}
          <div className="w-full lg:w-1/2 flex flex-row items-center justify-center lg:justify-end gap-4 sm:gap-6 relative py-6 lg:py-12">
            
            {/* Profile Photo Card */}
            <div 
              className="relative w-1/2 max-w-[170px] sm:max-w-[220px] lg:max-w-[200px] xl:max-w-[240px] aspect-[3/4] bg-ochi-charcoal always-dark rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-transform duration-100 ease-out z-10 flex flex-col justify-end"
              style={{
                transform: 'translateY(calc(var(--scroll-y, 0px) * -0.04)) rotate(-2deg)',
              }}
            >
              {/* Developer Image */}
              <img 
                src={devImg} 
                alt="Maviz Ahmad" 
                className="absolute inset-0 w-full h-full object-cover object-top filter grayscale contrast-125 brightness-95 hover:grayscale-0 transition-all duration-500" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              
              {/* Photo Card Overlay details */}
              <div className="p-3 sm:p-6 z-20 text-left">
                <span className="px-2 py-0.5 rounded-full border border-ochi-green/30 text-ochi-green text-[8px] sm:text-[9px] font-mono tracking-wider uppercase bg-ochi-green/10">
                  Full Stack Engineer
                </span>
                <h3 className="text-lg sm:text-2xl font-black text-white uppercase tracking-tight mt-1 sm:mt-2">
                  Maviz Ahmad
                </h3>
              </div>
            </div>

            {/* Overlapping "Monster Developer" Badge Card */}
            <div 
              className="relative w-1/2 max-w-[150px] sm:max-w-[200px] lg:max-w-[180px] xl:max-w-[220px] aspect-[3/4] bg-gradient-to-br from-[#1C1C1C] to-[#111111] always-dark rounded-2xl overflow-hidden border border-ochi-green/20 hover:border-ochi-green/45 shadow-2xl flex flex-col justify-between p-3 sm:p-6 transition-transform duration-100 ease-out z-10"
              style={{
                transform: 'translateY(calc(var(--scroll-y, 0px) * -0.02)) rotate(2deg)',
              }}
            >
              {/* Subtle grid pattern inside card */}
              <div className="absolute inset-0 dot-grid-pattern opacity-10 pointer-events-none" />

              <div className="flex justify-between items-start z-10">
                <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full border border-ochi-green/30 text-ochi-green text-[8px] sm:text-[9px] font-mono tracking-wider uppercase bg-ochi-green/10 flex items-center gap-1 sm:gap-1.5">
                  <Award className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 text-ochi-green" />
                  <span>Profile</span>
                </span>
                <span className="text-white/30 font-mono text-[8px] sm:text-[10px]">[ 2026 ]</span>
              </div>

              {/* Large branding middle of card */}
              <div className="flex flex-col z-10 my-auto text-left select-none gap-0.5">
                <span className="text-[9px] sm:text-xs font-mono text-white/40 tracking-widest uppercase">Ranked</span>
                <h3 className="text-xl sm:text-4xl font-black text-white leading-none uppercase tracking-tighter">
                  MONSTER
                </h3>
                <h3 className="text-xl sm:text-4xl font-black text-ochi-green leading-none uppercase tracking-tighter">
                  DEVELOPER.
                </h3>
              </div>

              <div className="flex justify-between items-end border-t border-white/10 pt-2 sm:pt-4 z-10">
                <div>
                  <span className="text-[7px] sm:text-[8px] font-mono text-white/40 block uppercase tracking-wider">Engineering Lead</span>
                  <span className="text-[10px] sm:text-xs font-black text-white uppercase tracking-tight">Maviz Ahmad</span>
                </div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-ochi-green/30 flex items-center justify-center text-ochi-green text-[9px] sm:text-xs font-bold bg-ochi-green/5 shadow-inner">
                  ★
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* --- OCHI CTA BANNER --- */}
      <section className="w-full py-16 px-8 lg:px-16 always-dark">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-ochi-green text-ochi-charcoal py-20 px-8 rounded-3xl flex flex-col items-center justify-center text-center gap-8 shadow-2xl select-none">
            <div className="flex flex-col gap-1">
              <h2 className="text-5xl lg:text-7xl font-black leading-none uppercase tracking-tighter">
                READY TO START
              </h2>
              <h2 className="text-5xl lg:text-7xl font-black leading-none uppercase tracking-tighter">
                SHOPPING?
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link 
                to="/register" 
                className="px-6 py-4 rounded-full bg-ochi-charcoal text-white font-mono text-xs uppercase tracking-wider inline-flex items-center gap-4 hover:bg-ochi-black transition-colors"
              >
                <span>Create Account</span>
                <div className="w-2 h-2 rounded-full bg-white"></div>
              </Link>
              <Link 
                to="/products" 
                className="px-6 py-4 rounded-full border border-ochi-charcoal text-ochi-charcoal font-mono text-xs uppercase tracking-wider inline-flex items-center gap-4 hover:bg-ochi-charcoal hover:text-white transition-colors"
              >
                <span>View Products</span>
                <div className="w-2 h-2 rounded-full bg-current"></div>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;