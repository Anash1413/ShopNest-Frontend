import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'
import {
  User,
  Mail,
  Shield,
  ShieldCheck,
  Crown,
  LogOut,
  ShoppingBag,
  ClipboardList,
  Heart,
  CheckCircle,
  XCircle,
  Lock,
  Unlock,
  ArrowRight,
  Settings,
} from 'lucide-react'
import toast from 'react-hot-toast';

function Profile() {
  const { user, token, isAdmin, isVerified } = useAuth()
  const [twoFAEnabled, setTwoFAEnabled] = useState(Boolean(user?.twoFA))

  useEffect(() => {
    document.title = 'Profile' 
  }, [])

  useEffect(() => {
    setTwoFAEnabled(Boolean(user?.twoFA))
  }, [user?.twoFA])
  
  const handle2FA = async (id, flag)=>{
    const res = await fetch('api/auth/toggle-2FA',{
      method :'POST',
      headers:{
        'Authorization' :`Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body:JSON.stringify({
        id, flag
      })
    })
    const msg = await res.json()
    if(!res.ok){
      return toast.error(msg.message ||"Can't change 2FA! Something went wrong")
    }
    toast.success('Successfully changed 2FA')
  }

  const handle2FAToggle = () => {
    const nextTwoFAState = !twoFAEnabled
    setTwoFAEnabled(nextTwoFAState)
    handle2FA(user?._id, nextTwoFAState)
  }

  const getInitials = (name) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-ochi-charcoal text-white font-sans overflow-x-hidden border-t border-white/10">
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-10 md:py-16 w-full">
        
        {/* --- Profile Header --- */}
        <div className="border-b border-white/10 pb-8 mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            {/* Avatar Circle */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full border border-white/15 bg-[#1C1C1C] flex items-center justify-center">
                <span className="text-3xl font-black text-white select-none">
                  {getInitials(user?.name)}
                </span>
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider bg-ochi-green text-ochi-charcoal">
                {isAdmin ? 'Admin' : 'User'}
              </div>
            </div>

            {/* Name, Email and Status */}
            <div>
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white flex items-center justify-center md:justify-start gap-2 leading-none mb-2">
                {user?.name || 'User'}
                {isAdmin && (
                  <Crown className="h-6 w-6 text-ochi-green" />
                )}
              </h1>
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 font-mono text-xs uppercase tracking-wider text-white/50">
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3 text-ochi-green" />
                  {user?.email || 'No email'}
                </span>
                <span className="hidden md:inline text-white/20">|</span>
                <span className={`flex items-center gap-1 font-bold ${isVerified ? 'text-emerald-450' : 'text-rose-400'}`}>
                  {isVerified ? (
                    <>
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-450" />
                      <span>Email Verified</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3.5 w-3.5 text-rose-450" />
                      <span>Email Unverified</span>
                      <NavLink className="underline text-rose-500 hover:text-rose-400 ml-1.5" to="/verify">Verify Now</NavLink>
                    </>
                  )}
                </span>
              </div>
            </div>
          </div>

          <Link
            to="/logout"
            className="flex items-center gap-1.5 px-6 py-3 rounded-full border border-rose-500/20 text-rose-400 font-mono text-xs uppercase tracking-wider hover:bg-rose-500 hover:text-white transition-all duration-300 cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Logout Account</span>
          </Link>
        </div>

        {/* --- Info & Quick Actions Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* ===== LEFT: Account Details Table ===== */}
          <div className="lg:col-span-5 flex flex-col gap-6 text-left">
            <h2 className="font-mono text-xs font-bold text-white uppercase tracking-widest border-b border-white/10 pb-4">
              Profile Metadata
            </h2>

            <div className="bg-[#1C1C1C] border border-white/10 rounded-2xl p-6 font-mono text-xs uppercase tracking-wider text-white/70">
              {/* Row: Name */}
              <div className="flex justify-between py-3.5 border-b border-white/5 items-center">
                <span className="text-white/40">Username</span>
                <span className="text-white font-bold">{user?.name}</span>
              </div>

              {/* Row: Email */}
              <div className="flex justify-between py-3.5 border-b border-white/5 items-center">
                <span className="text-white/40">Email ID</span>
                <span className="text-white font-bold break-all max-w-[200px] text-right">{user?.email}</span>
              </div>

              {/* Row: System Privilege */}
              <div className="flex justify-between py-3.5 border-b border-white/5 items-center">
                <span className="text-white/40">Privilege</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider border ${
                  isAdmin
                    ? 'bg-ochi-green/10 border-ochi-green/30 text-ochi-green'
                    : 'bg-white/5 border-white/10 text-white/80'
                }`}>
                  {user?.role || 'user'}
                </span>
              </div>

              {/* Row: Account Status */}
              <div className="flex justify-between py-3.5 border-b border-white/5 items-center">
                <span className="text-white/40">Status</span>
                <span className={`font-bold ${isVerified ? 'text-emerald-405' : 'text-rose-455'}`}>
                  {isVerified ? 'VERIFIED' : 'UNVERIFIED'}
                </span>
              </div>

              {/* Row: Two-Factor Authentication */}
              <div className="flex justify-between py-4 items-center">
                <span className="text-white/40">2FA Security</span>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-full ${
                    twoFAEnabled
                      ? 'bg-ochi-green/10 border-ochi-green/30 text-ochi-green'
                      : 'border-white/10 text-white/30'
                  }`}>
                    {twoFAEnabled ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                  <button
                    type="button"
                    onClick={handle2FAToggle}
                    aria-label="Toggle two-factor authentication"
                    aria-pressed={twoFAEnabled}
                    className={`relative h-6 w-11 rounded-full border transition-all duration-300 cursor-pointer ${
                      twoFAEnabled
                        ? 'bg-ochi-green/20 border-ochi-green/30'
                        : 'bg-white/5 border-white/15'
                    }`}
                  >
                    <span className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white shadow-md transition-all duration-300 ${
                      twoFAEnabled ? 'left-5' : 'left-0.5'
                    }`}></span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ===== RIGHT: Quick Actions Cards ===== */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <h2 className="font-mono text-xs font-bold text-white uppercase tracking-widest border-b border-white/10 pb-4">
              Control Panel
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Orders Dashboard Action */}
              <Link
                to={isAdmin ? '/admin/orders' : '/orders'}
                className="group p-6 rounded-2xl bg-[#1C1C1C] border border-white/10 hover:border-ochi-green/30 transition-all duration-300 flex flex-col justify-between min-h-[160px]"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-white mb-4 group-hover:bg-ochi-green group-hover:text-ochi-charcoal transition-colors">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-black text-white uppercase tracking-tight mb-1">
                    System Orders
                  </h3>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-white/40 leading-normal">
                    {isAdmin ? 'View and modify user orders cargo status.' : 'View your order invoice histories.'}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-ochi-green font-bold mt-4">
                  <span>Enter Logs</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              {/* Cart Action (Non-Admin only) */}
              {!isAdmin && (
                <Link
                  to="/cart"
                  className="group p-6 rounded-2xl bg-[#1C1C1C] border border-white/10 hover:border-ochi-green/30 transition-all duration-300 flex flex-col justify-between min-h-[160px]"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-white mb-4 group-hover:bg-ochi-green group-hover:text-ochi-charcoal transition-colors">
                      <ShoppingBag className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-black text-white uppercase tracking-tight mb-1">
                      Shopping Cart
                    </h3>
                    <p className="text-[11px] font-mono uppercase tracking-wider text-white/40 leading-normal">
                      Check your cargo inventory items and check out.
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-ochi-green font-bold mt-4">
                    <span>Open Cart</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              )}

              {/* Wishlist Action (Non-Admin only) */}
              {!isAdmin && (
                <Link
                  to="/favourites"
                  className="group p-6 rounded-2xl bg-[#1C1C1C] border border-white/10 hover:border-ochi-green/30 transition-all duration-300 flex flex-col justify-between min-h-[160px]"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-white mb-4 group-hover:bg-ochi-green group-hover:text-ochi-charcoal transition-colors">
                      <Heart className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-black text-white uppercase tracking-tight mb-1">
                      Saved Wishlist
                    </h3>
                    <p className="text-[11px] font-mono uppercase tracking-wider text-white/40 leading-normal">
                      Explore saved catalog release bookmarks.
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-ochi-green font-bold mt-4">
                    <span>View Saved</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              )}

              {/* Admin Dashboard Action */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="group p-6 rounded-2xl bg-[#1C1C1C] border border-white/10 hover:border-ochi-green/30 transition-all duration-300 flex flex-col justify-between min-h-[160px]"
                >
                  <div>
                    <div className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-white mb-4 group-hover:bg-ochi-green group-hover:text-ochi-charcoal transition-colors">
                      <Settings className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-black text-white uppercase tracking-tight mb-1">
                      Admin Dashboard
                    </h3>
                    <p className="text-[11px] font-mono uppercase tracking-wider text-white/40 leading-normal">
                      Maintain product spec assets and order pipelines.
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-ochi-green font-bold mt-4">
                    <span>Open Dashboard</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              )}

              {/* Browse Catalog Action */}
              <Link
                to="/products"
                className="group p-6 rounded-2xl bg-[#1C1C1C] border border-white/10 hover:border-ochi-green/30 transition-all duration-300 flex flex-col justify-between min-h-[160px]"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-white mb-4 group-hover:bg-ochi-green group-hover:text-ochi-charcoal transition-colors">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-black text-white uppercase tracking-tight mb-1">
                    Browse Releases
                  </h3>
                  <p className="text-[11px] font-mono uppercase tracking-wider text-white/40 leading-normal">
                    Explore all collections in the ShopNest store catalog.
                    </p>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-ochi-green font-bold mt-4">
                  <span>Explore releases</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Profile;
