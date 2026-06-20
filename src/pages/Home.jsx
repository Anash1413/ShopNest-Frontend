import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { Link } from "react-router-dom";
import { ArrowRight, ShoppingBag } from "lucide-react";

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
            <h1 className="text-[12vw] lg:text-[7.5vw] font-black leading-none tracking-tighter uppercase text-white select-none">
              WE CURATE
            </h1>
            <div className="flex items-center gap-[2vw]">
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
            <h1 className="text-[12vw] lg:text-[7.5vw] font-black leading-none tracking-tighter uppercase text-white select-none">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <ProductCard limit={6} />
          </div>

        </div>
      </section>

      {/* --- OCHI CTA BANNER --- */}
      <section className="w-full py-16 px-8 lg:px-16">
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