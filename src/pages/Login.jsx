import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { 
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  ArrowUpRight,
  KeyRound,
  ArrowLeft,
  Loader2
} from 'lucide-react';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [showOtp, setShowOtp] = useState(false);
  const [regEmail, setRegEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    mode: 'onTouched'
  });

  useEffect(() => {
    document.title = 'Login' 
  }, [])

  const onSubmitLogin = async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok && data) {
        if (data.twoFA) {
          setRegEmail(formData.email);
          setShowOtp(true);
          setSuccess(data.message || 'Please enter the 2FA code sent to your email.');
        } else if (data.User) {
          setSuccess('Login successful!');
          login(data.User, data.User.token);
          navigate('/');
        } else {
          setLoading(false);
          setError('Failed to login. Invalid user response structure.');
        }
      } else {
        setLoading(false);
        setError(data.message || 'Invalid email or password.');
      }
    } catch {
      setLoading(false);
      setError('Connection error. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitOtp = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit code.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: regEmail,
          otp: otp
        })
      });

      const data = await res.json();

      if (res.ok && data) {
        const verifiedUser = data.user || data.User;
        if (verifiedUser) {
          setSuccess('2FA Verification successful!');
          login(verifiedUser, verifiedUser.token);
          navigate('/');
        } else {
          setError(data.message || 'Invalid response structure from verification.');
        }
      } else {
        setError(data.message || 'Invalid or expired OTP code.');
      }
    } catch  {
      setError('Verification failed. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ochi-charcoal flex items-center justify-center border-t border-white/10">
        <div className="flex flex-col items-center gap-4 font-mono">
          <Loader2 className="animate-spin h-10 w-10 text-ochi-green" />
          <span className="text-xs text-white/50 tracking-widest">[ SECURING SESSION... ]</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ochi-charcoal text-[#F1F1F1] flex flex-col items-center justify-center py-12 px-6 relative overflow-hidden font-sans border-t border-white/10">
      
      {/* Main Structural Container */}
      <div className="relative w-full max-w-[450px] bg-[#1C1C1C] border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl flex flex-col gap-8 text-left">
        
        {/* Error / Success Notifications */}
        {error && (
          <div className="px-4 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono uppercase tracking-wider flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-405 text-xs font-mono uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* View 1: Standard Credentials Login */}
        {!showOtp ? (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-start gap-1">
              <span className="font-mono text-[10px] text-ochi-green uppercase tracking-widest block mb-1">
                Security Gateway
              </span>
              <h3 className="text-3xl md:text-4xl font-black text-white leading-none uppercase tracking-tight">
                Sign In
              </h3>
              <p className="text-xs font-mono uppercase tracking-wider text-white/40 mt-1">
                Input your credentials to access profiles
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmitLogin)} className="flex flex-col gap-5">
              {/* Field: Email */}
              <div className="flex flex-col gap-2 font-mono text-xs uppercase tracking-wider">
                <label className="text-white/40">Email Address</label>
                <input 
                  type="text" 
                  placeholder="Enter your email"
                  className={`w-full bg-[#212121] border focus:border-ochi-green hover:border-white/20 text-white rounded-full outline-none py-3.5 px-6 font-mono text-xs placeholder-white/20 ${errors.email ? 'border-rose-500' : 'border-white/10'}`}
                  {...register("email", {
                    required: "Email address is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email format"
                    }
                  })}
                />
                {errors.email && (
                  <span className="text-rose-455 text-[10px] mt-1 flex items-center gap-1 font-semibold">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    <span>{errors.email.message}</span>
                  </span>
                )}
              </div>

              {/* Field: Password */}
              <div className="flex flex-col gap-2 font-mono text-xs uppercase tracking-wider">
                <label className="text-white/40">Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className={`w-full bg-[#212121] border focus:border-ochi-green hover:border-white/20 text-white rounded-full outline-none py-3.5 px-6 font-mono text-xs placeholder-white/20 ${errors.password ? 'border-rose-500' : 'border-white/10'}`}
                  {...register("password", {
                    required: "Password is required"
                  })}
                />
                {errors.password && (
                  <span className="text-rose-455 text-[10px] mt-1 flex items-center gap-1 font-semibold">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    <span>{errors.password.message}</span>
                  </span>
                )}
              </div>

              <button 
                type="submit" 
                className="w-full py-4 rounded-full bg-ochi-green text-ochi-charcoal hover:bg-white hover:text-ochi-charcoal font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                <span>Authorize Login</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <p className="font-mono text-[10px] uppercase tracking-wider text-white/40 text-center mt-2 border-t border-white/5 pt-4">
              New to ShopNest?{' '}
              <Link to="/register" className="text-ochi-green hover:text-white font-bold underline transition-colors inline-flex items-center gap-1">
                <span>Register Account</span>
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </p>
          </div>
        ) : (
          /* View 2: 2FA Verification Form */
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-start gap-1">
              <span className="font-mono text-[10px] text-ochi-green uppercase tracking-widest block mb-1">
                2FA Verification
              </span>
              <h3 className="text-3xl md:text-4xl font-black text-white leading-none uppercase tracking-tight">
                Enter Code
              </h3>
              <p className="text-xs font-mono uppercase tracking-wider text-white/40 mt-1">
                6-digit code sent to your email to verify
              </p>
            </div>

            <div className="flex flex-col gap-2 font-mono text-xs uppercase tracking-wider">
              <label className="text-white/40 text-center w-full block">6-Digit OTP</label>
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
                onClick={onSubmitOtp}
                className="w-full py-4 rounded-full bg-ochi-green text-ochi-charcoal hover:bg-white hover:text-ochi-charcoal font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Verify & Login</span>
              </button>
              
              <button 
                onClick={() => setShowOtp(false)}
                className="w-full py-3.5 rounded-full border border-white/10 hover:border-white/30 text-white/70 font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Sign In</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default Login;