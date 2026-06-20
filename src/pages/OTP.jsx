import React, { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Link } from 'react-router-dom'
import { Send, ShieldCheck, ShieldAlert, ArrowLeft, Loader2 } from 'lucide-react'

const OTP = () => {
  useEffect(() => {
    document.title = 'Verify-OTP' 
  }, [])
  const { user, login ,token} = useAuth()
  const [confirm, setconfirm] = useState(false)
  const [loading, setloading] = useState(false)
  const [otp, setOtp] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const sendOtp = async () => {
    setloading(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch('api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await res.json()
      if (res.ok) {
        setconfirm(true)
        setSuccess('Verification code sent to your email.')
      } else {
        setError(data.message || 'Failed to send OTP. Please try again.')
      }
    } catch  {
      setError('Connection error. Please check your network.')
    } finally {
      setloading(false)
    }
  }

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit code.')
      return
    }

    setloading(true)
    setError(null)
    setSuccess(null)
    try {
      const res = await fetch('api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: user?.email,
          otp: otp
        })
      })

      const data = await res.json()
      if (res.ok) {
        setSuccess('Account verified successfully!')
        if (login && data.user && data.token) {
          login(data.user, data.token)
        }
      } else {
        setError(data.message || 'Invalid or expired OTP.')
      }
    } catch  {
      setError('Verification failed. Please check your connection.')
    } finally {
      setloading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-ochi-charcoal flex items-center justify-center border-t border-white/10">
        <div className="flex flex-col items-center gap-4 font-mono">
          <Loader2 className="animate-spin h-10 w-10 text-ochi-green" />
          <span className="text-xs text-white/50 tracking-widest">[ CONTACTING SYSTEM... ]</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ochi-charcoal text-[#F1F1F1] flex flex-col items-center justify-center py-12 px-6 relative overflow-hidden font-sans border-t border-white/10">
      
      {/* Main Card Container */}
      <div className="relative w-full max-w-[450px] bg-[#1C1C1C] border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl flex flex-col gap-8 text-left">
        
        {/* Error / Success Notifications */}
        {error && (
          <div className="px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-455 text-xs font-mono uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* View 1: Send OTP request */}
        {!confirm ? (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-start gap-1">
              <span className="font-mono text-[10px] text-ochi-green uppercase tracking-widest block mb-1">
                Verification Portal
              </span>
              <h3 className="text-3xl md:text-4xl font-black text-white leading-none uppercase tracking-tight">
                Send OTP
              </h3>
              <p className="text-xs font-mono uppercase tracking-wider text-white/40 mt-1 leading-relaxed">
                Verify identity by sending a code to: <span className="text-white font-bold break-all normal-case">{user?.email}</span>
              </p>
            </div>

            <button 
              onClick={sendOtp}
              className="w-full py-4 rounded-full bg-ochi-green text-ochi-charcoal hover:bg-white hover:text-ochi-charcoal font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
            >
              <span>Send Verification Code</span>
              <Send className="h-4 w-4" />
            </button>
          </div>
        ) : (
          /* View 2: Verify OTP input */
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-start gap-1">
              <span className="font-mono text-[10px] text-ochi-green uppercase tracking-widest block mb-1">
                Security Check
              </span>
              <h3 className="text-3xl md:text-4xl font-black text-white leading-none uppercase tracking-tight">
                Enter Code
              </h3>
              <p className="text-xs font-mono uppercase tracking-wider text-white/40 mt-1">
                Input the 6-digit secure code sent to mail
              </p>
            </div>

            <div className="flex flex-col gap-2 font-mono text-xs uppercase tracking-wider">
              <label className="text-white/40">6-Digit OTP Code</label>
              <input 
                type="text" 
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="000000"
                className="w-full text-center py-4 bg-[#212121] border border-white/10 focus:border-ochi-green text-xl font-bold text-white tracking-widest focus:outline-none transition-all placeholder-white/10 rounded-full"
              />
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={verifyOtp}
                className="w-full py-4 rounded-full bg-ochi-green text-ochi-charcoal hover:bg-white hover:text-ochi-charcoal font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Verify & Activate</span>
              </button>
              
              <button 
                onClick={() => setconfirm(false)}
                className="w-full py-3.5 rounded-full border border-white/10 hover:border-white/30 text-white/70 font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Go Back</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default OTP;
