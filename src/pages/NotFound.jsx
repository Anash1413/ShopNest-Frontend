import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Home, HelpCircle } from 'lucide-react'

function NotFound() {
  useEffect(() => {
    document.title = '404 | ShopNest' 
  }, [])
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-ochi-charcoal text-white font-sans overflow-x-hidden border-t border-white/10 flex flex-col items-center justify-center py-16 px-6 relative">
      <div className="relative z-10 text-center flex flex-col items-center max-w-[500px] gap-8">
        
        {/* Navigation Alert */}
        <div className="px-3.5 py-1 rounded-full border border-white/15 bg-white/5 font-mono text-[9px] uppercase tracking-widest text-white/50">
          <span>Navigation Alert</span>
        </div>

        {/* 404 block */}
        <div className="relative">
          <div className="relative border border-white/10 bg-[#1C1C1C] px-12 py-6 rounded-2xl flex flex-col items-center">
            <h1 className="text-7xl md:text-8xl font-black text-white tracking-tighter leading-none select-none">
              404
            </h1>
            <span className="font-mono text-[10px] text-ochi-green uppercase tracking-widest font-black mt-2">
              Route Mismatch
            </span>
          </div>
        </div>

        {/* Messaging block */}
        <div className="space-y-2">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase leading-none">
            Lost In Space
          </h2>
          <p className="font-mono text-xs uppercase tracking-wider text-white/40 leading-relaxed max-w-sm">
            The coordinates you requested are out of reach. Either the route was never registered, or it has drifted permanently out of orbit.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full font-mono text-xs uppercase tracking-wider font-bold">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto flex-1 px-6 py-4 rounded-full border border-white/15 hover:border-white text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>
          
          <Link
            to="/"
            className="w-full sm:w-auto flex-1 px-8 py-4 rounded-full bg-ochi-green text-ochi-charcoal hover:bg-white hover:text-ochi-charcoal transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>Return Home</span>
          </Link>
        </div>

        {/* Help Signal */}
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-white/30 uppercase tracking-widest mt-4">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>Need support? Check invoice records.</span>
        </div>

      </div>
    </div>
  )
}

export default NotFound;
