import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  ArrowUpRight,
  Loader2
} from 'lucide-react';

function Register() {
  useEffect(() => {
    document.title = 'Register' 
  }, [])
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const { 
    register, 
    handleSubmit, 
    watch, 
    formState: { errors } 
  } = useForm({
    mode: 'onTouched'
  });

  const password = watch("password");

  const onSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const result = await res.json();
      if (res.ok) {
        setSuccess(result.message || 'Registration successful! Verification code sent to email.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch  {
      setError('Connection error. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ochi-charcoal flex items-center justify-center border-t border-white/10">
        <div className="flex flex-col items-center gap-4 font-mono">
          <Loader2 className="animate-spin h-10 w-10 text-ochi-green" />
          <span className="text-xs text-white/50 tracking-widest">[ CREATING PROFILE... ]</span>
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

        {/* Title Block */}
        <div className="flex flex-col items-start gap-1">
          <span className="font-mono text-[10px] text-ochi-green uppercase tracking-widest block mb-1">
            Secure Registry
          </span>
          <h3 className="text-3xl md:text-4xl font-black text-white leading-none uppercase tracking-tight">
            Create Account
          </h3>
          <p className="text-xs font-mono uppercase tracking-wider text-white/40 mt-1">
            Register your credentials to access catalog releases
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          
          {/* Field: Full Name */}
          <div className="flex flex-col gap-2 font-mono text-xs uppercase tracking-wider">
            <label className="text-white/40">Full Name</label>
            <input 
              type="text" 
              placeholder="Enter your name"
              className={`w-full bg-[#212121] border focus:border-ochi-green hover:border-white/20 text-white rounded-full outline-none py-3.5 px-6 font-mono text-xs placeholder-white/20 ${errors.name ? 'border-rose-500' : 'border-white/10'}`}
              {...register("name", {
                required: "Full Name is required",
                minLength: {
                  value: 3,
                  message: "Name must be at least 3 characters long"
                }
              })}
            />
            {errors.name && (
              <span className="text-rose-400 text-[10px] mt-1 flex items-center gap-1 font-semibold">
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>{errors.name.message}</span>
              </span>
            )}
          </div>

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
              <span className="text-rose-400 text-[10px] mt-1 flex items-center gap-1 font-semibold">
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
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long"
                }
              })}
            />
            {errors.password && (
              <span className="text-rose-400 text-[10px] mt-1 flex items-center gap-1 font-semibold">
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>{errors.password.message}</span>
              </span>
            )}
          </div>

          {/* Field: Confirm Password */}
          <div className="flex flex-col gap-2 font-mono text-xs uppercase tracking-wider">
            <label className="text-white/40">Confirm Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className={`w-full bg-[#212121] border focus:border-ochi-green hover:border-white/20 text-white rounded-full outline-none py-3.5 px-6 font-mono text-xs placeholder-white/20 ${errors.confirmPassword ? 'border-rose-500' : 'border-white/10'}`}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) => value === password || "Passwords do not match"
              })}
            />
            {errors.confirmPassword && (
              <span className="text-rose-400 text-[10px] mt-1 flex items-center gap-1 font-semibold">
                <ShieldAlert className="h-3.5 w-3.5" />
                <span>{errors.confirmPassword.message}</span>
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full py-4 rounded-full bg-ochi-green text-ochi-charcoal hover:bg-white hover:text-ochi-charcoal font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
          >
            <span>Register & Validate</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Bottom Link */}
        <p className="font-mono text-[10px] uppercase tracking-wider text-white/40 text-center mt-2 border-t border-white/5 pt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-ochi-green hover:text-white font-bold underline transition-colors inline-flex items-center gap-1">
            <span>Sign In</span>
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;