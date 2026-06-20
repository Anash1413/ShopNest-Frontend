import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  Mail, 
  Phone, 
  Award, 
  Briefcase, 
  GraduationCap, 
  Heart, 
  Sparkles, 
  Send, 
  Globe, 
  ChevronRight,
  Code
} from 'lucide-react';

const Github = (props) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={props.className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Footer = () => {
  const [activeModal, setActiveModal] = useState(null); // 'about' | 'contact' | null

  return (
    <footer className="w-full bg-[#1C1C1C] border-t border-white/10 text-white/70 py-16 mt-20 font-sans always-dark">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        
        {/* Left Column: Big Typographic Brand Statement */}
        <div className="flex flex-col justify-between h-full min-h-[300px]">
          <div>
            <h1 className="text-[12vw] lg:text-[7vw] font-black leading-none tracking-tighter uppercase text-white select-none">
              SHOP-
            </h1>
            <h1 className="text-[12vw] lg:text-[7vw] font-black leading-none tracking-tighter uppercase text-white select-none">
              NEST.
            </h1>
          </div>
          <div className="mt-8 lg:mt-0 font-mono text-xs uppercase tracking-wider text-white/40">
            © 2026 ShopNest Inc. All rights reserved.
          </div>
        </div>

        {/* Right Column: Navigation & Modal Links */}
        <div className="flex flex-col justify-between h-full min-h-[300px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
            
            {/* Navigation Block */}
            <div className="flex flex-col gap-6">
              <h4 className="font-mono text-xs uppercase tracking-wider text-white font-bold pb-2 border-b border-white/10">
                Navigation
              </h4>
              <ul className="flex flex-col gap-3 font-mono text-xs uppercase tracking-wider">
                <li>
                  <Link to="/" className="hover:text-ochi-green transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/products" className="hover:text-ochi-green transition-colors">
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="hover:text-ochi-green transition-colors">
                    Shopping Cart
                  </Link>
                </li>
                <li>
                  <Link to="/orders" className="hover:text-ochi-green transition-colors">
                    Your Orders
                  </Link>
                </li>
              </ul>
            </div>

            {/* Information Block */}
            <div className="flex flex-col gap-6">
              <h4 className="font-mono text-xs uppercase tracking-wider text-white font-bold pb-2 border-b border-white/10">
                Information
              </h4>
              <ul className="flex flex-col gap-3 font-mono text-xs uppercase tracking-wider">
                <li>
                  <button 
                    onClick={() => setActiveModal('about')}
                    className="hover:text-ochi-green transition-colors cursor-pointer text-left w-full focus:outline-none"
                  >
                    About the Developer
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveModal('contact')}
                    className="hover:text-ochi-green transition-colors cursor-pointer text-left w-full focus:outline-none"
                  >
                    Contact Us
                  </button>
                </li>
              </ul>
            </div>

          </div>

          {/* Developer Credit Row */}
          <div className="mt-12 lg:mt-0 flex items-center justify-between border-t border-white/10 pt-8 font-mono text-xs uppercase tracking-wider">
            <span className="text-white/40">Crafted by</span>
            <span className="text-white font-bold hover:text-ochi-green transition-colors">Anash (Maviz)</span>
          </div>

        </div>

      </div>

      {/* --- Dynamic Modals (Styled to match Ochi) --- */}
      
      {/* 1. About Us Modal */}
      {activeModal === 'about' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/75 backdrop-blur-md">
          <div className="relative w-full max-w-3xl bg-[#212121] border border-white/10 rounded-2xl p-8 md:p-12 max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col gap-8 scrollbar-thin scrollbar-thumb-white/10 text-left always-dark">
            {/* Close Button */}
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header / Intro */}
            <div className="pb-6 border-b border-white/15">
              <span className="px-3 py-1 rounded-full border border-ochi-green/30 text-ochi-green text-[10px] font-mono tracking-wider uppercase bg-ochi-green/5">
                Lead Developer Profile
              </span>
              <h3 className="text-4xl font-black text-white leading-tight uppercase tracking-tight mt-4">
                Maviz Ahmad
              </h3>
              <p className="text-sm font-mono uppercase tracking-wider text-white/50 mt-1">
                MERN Stack Developer (Monster Developer)
              </p>
            </div>

            {/* Content Body Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: About & Qualification */}
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-white font-bold flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-ochi-green" />
                    About Me
                  </h4>
                  <p className="text-sm text-white/70 leading-relaxed font-sans">
                    I am an ambitious, creative, and highly motivated web developer. Known in the project environment as a "Monster Developer," I excel at taking logic-driven structures and breathing premium, high-fidelity styles into them. My passion lies in constructing end-to-end full stack web platforms that are both secure and stunning.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-white font-bold flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-ochi-green" />
                    Education
                  </h4>
                  <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col gap-1">
                    <span className="text-sm font-bold text-white">
                      Bachelor of Technology (B.Tech)
                    </span>
                    <span className="text-xs font-mono uppercase text-ochi-green">
                      Computer Science & Engineering
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Tech Stack & Competence */}
              <div className="flex flex-col gap-6">
                <h4 className="font-mono text-xs uppercase tracking-wider text-white font-bold flex items-center gap-2">
                  <Award className="h-4 w-4 text-ochi-green" />
                  Tech Stack
                </h4>
                <div className="flex flex-col gap-4 font-mono text-[10px] tracking-wider uppercase">
                  {/* Category: Frontend */}
                  <div>
                    <span className="text-[10px] text-white/40 block mb-2 font-bold">
                      Frontend
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {['React 19', 'Tailwind CSS v4', 'Redux Toolkit', 'JavaScript ES6+', 'HTML5 / CSS3', 'Vite'].map((skill, i) => (
                        <span key={i} className="px-3 py-1 rounded-full border border-white/10 text-white bg-white/[0.02]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Category: Backend */}
                  <div>
                    <span className="text-[10px] text-white/40 block mb-2 font-bold">
                      Backend & Database
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {['Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'REST APIs', 'JWT Auth'].map((skill, i) => (
                        <span key={i} className="px-3 py-1 rounded-full border border-white/10 text-white bg-white/[0.02]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Contact Us Modal */}
      {activeModal === 'contact' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/75 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#212121] border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl flex flex-col gap-8 text-left always-dark">
            {/* Close Button */}
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <div className="pb-6 border-b border-white/15">
              <span className="px-3 py-1 rounded-full border border-ochi-green/30 text-ochi-green text-[10px] font-mono tracking-wider uppercase bg-ochi-green/5">
                Let's Connect
              </span>
              <h3 className="text-3xl font-black text-white uppercase tracking-tight mt-4">
                Contact
              </h3>
            </div>

            {/* Contact Details List */}
            <div className="flex flex-col gap-4 font-mono text-xs uppercase tracking-wider">
              {/* Phone */}
              <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                <div className="p-2 rounded-lg bg-ochi-green/10 text-ochi-green">
                  <Phone className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/40 font-bold">Call</span>
                  <a href="tel:+9196852244563" className="text-white hover:text-ochi-green transition-colors mt-1 font-bold">+91 96852 244563</a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                <div className="p-2 rounded-lg bg-ochi-green/10 text-ochi-green">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/40 font-bold">Email</span>
                  <a href="mailto:anash.js.dev@gmail.com" className="text-white hover:text-ochi-green transition-colors mt-1 font-bold">anash.js.dev@gmail.com</a>
                </div>
              </div>

              {/* GitHub */}
              <div className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                <div className="p-2 rounded-lg bg-ochi-green/10 text-ochi-green">
                  <Github className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-white/40 font-bold">GitHub</span>
                  <a 
                    href="https://github.com/Anash1413/Shopnest" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-white hover:text-ochi-green transition-colors mt-1 font-bold underline"
                  >
                    Repository
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};;

export default Footer;