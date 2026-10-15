import React, { useState } from 'react';
import {
  Coffee,
  ArrowLeft,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export default function AuthPage({ initialMode = 'signin', onBackToLanding, onAuthSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'signin' | 'signup'

  // Form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status & validation
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Handle Sign In Submission
  const handleSignIn = async (e) => {
    e?.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter your email/phone and password.');
      return;
    }

    setLoading(true);

    try {
      // 1. Supabase Auth if configured
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });

        if (error) throw error;

        const customer = {
          id: data.user.id,
          full_name: data.user.user_metadata?.full_name || email.split('@')[0],
          email: data.user.email,
          phone: data.user.user_metadata?.phone || '',
          branch_name: 'Kape Muna — Main Branch',
        };

        localStorage.setItem('kape_muna_user', JSON.stringify(customer));
        onAuthSuccess(customer);
        return;
      }

      // 2. Local Backend Authentication Endpoint
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid email or password.');
      }

      localStorage.setItem('kape_muna_user', JSON.stringify(data.user));
      onAuthSuccess(data.user);
    } catch (err) {
      console.error('Sign in error:', err);
      setErrorMsg(err.message || 'Unable to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign Up Submission
  const handleSignUp = async (e) => {
    e?.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password.trim() || password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      // 1. Supabase Auth if configured
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: {
              full_name: fullName.trim(),
              phone: phone.trim(),
              branch_name: 'Kape Muna — Main Branch',
            },
          },
        });

        if (error) throw error;

        const customer = {
          id: data.user?.id || `user-${Date.now()}`,
          full_name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          branch_name: 'Kape Muna — Main Branch',
        };

        localStorage.setItem('kape_muna_user', JSON.stringify(customer));
        setSuccessMsg('Account created! Welcome to Kape Muna.');
        setTimeout(() => onAuthSuccess(customer), 600);
        return;
      }

      // 2. Local Backend Registration Endpoint
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          password,
          branch_name: 'Kape Muna — Main Branch',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Registration failed.');
      }

      localStorage.setItem('kape_muna_user', JSON.stringify(data.user));
      setSuccessMsg('Account created successfully! Welcome to Kape Muna.');
      setTimeout(() => onAuthSuccess(data.user), 600);
    } catch (err) {
      console.error('Registration error:', err);
      setErrorMsg(err.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between p-4 sm:p-6 overflow-hidden select-none">
      {/* 3rd Picture Background: Luscious Swirling Iced Coffee with Ice Cubes */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 scale-105 filter brightness-[0.88] contrast-[1.05]"
        style={{ backgroundImage: `url('/images/auth_coffee_bg.jpg')` }}
      />

      {/* Warm Ambient Glassmorphism Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#180F0A]/60 via-[#20140D]/40 to-[#120B07]/75 backdrop-blur-[1px] z-0" />

      {/* Top Bar with Frosted Glass Back Button & Brand Header */}
      <div className="relative z-10 w-full max-w-md mx-auto flex items-center justify-between mb-2 pt-2">
        <button
          onClick={onBackToLanding}
          className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-md text-white border border-white/30 flex items-center justify-center transition-all shadow-lg active:scale-95"
          aria-label="Back to landing page"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Elegant Top Brand Pill */}
        <div className="flex items-center gap-2 bg-[#221610]/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 shadow-lg">
          <Coffee className="w-4 h-4 text-caramel-gold fill-caramel-gold/30" />
          <span className="font-display font-bold text-sm tracking-wide text-[#FAF6F0]">
            Kape Muna
          </span>
        </div>

        <div className="w-10" /> {/* Balancer */}
      </div>

      {/* Main Glassmorphic Auth Card */}
      <div className="relative z-10 w-full max-w-md mx-auto bg-[#FDFBF7]/95 sm:bg-[#FDFBF7]/95 backdrop-blur-2xl border border-white/60 rounded-3xl p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.5)] my-auto transition-all animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header Greeting */}
        <div className="text-center mb-4">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#221610] tracking-tight">
            {mode === 'signin' ? 'Welcome Back!' : 'Join Kape Muna'}
          </h2>
          <p className="text-xs text-[#221610]/70 mt-1 font-medium italic">
            {mode === 'signin'
              ? 'Your freshly brewed pause is waiting for you.'
              : 'Create your account and savor every sip.'}
          </p>
        </div>

        {/* Segmented Mode Switcher Tabs */}
        <div className="grid grid-cols-2 gap-1.5 bg-[#EFE8DD] p-1 rounded-2xl mb-4 border border-[#E2D5C4]/80">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'signin'
                ? 'bg-[#221610] text-[#FAF6F0] shadow-md'
                : 'text-[#221610]/70 hover:text-[#221610]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'signup'
                ? 'bg-[#221610] text-[#FAF6F0] shadow-md'
                : 'text-[#221610]/70 hover:text-[#221610]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Feedback Alert Banners */}
        {errorMsg && (
          <div className="mb-3.5 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-3.5 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. SIGN IN FORM (Clean, professional, without quick access button) */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-roast mb-1">
                Email or Mobile Number
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-roast/40" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. jusselle@kapemuna.local"
                  className="w-full bg-white border border-[#EDE3D5] pl-10 pr-3 py-2.5 rounded-2xl text-xs sm:text-sm text-roast placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-caramel/40 focus:border-caramel shadow-xs"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-roast">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset link will be sent to your registered email.')}
                  className="text-[10px] text-caramel hover:underline font-semibold"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-roast/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-white border border-[#EDE3D5] pl-10 pr-10 py-2.5 rounded-2xl text-xs sm:text-sm text-roast placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-caramel/40 focus:border-caramel shadow-xs"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-roast/40 hover:text-roast"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#221610] via-[#2A180F] to-caramel hover:from-[#160E0A] hover:to-caramel-hover text-white py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-cafe-md active:scale-95 transition-all disabled:opacity-50 mt-4 group"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        )}

        {/* 2. SIGN UP / CREATE ACCOUNT FORM (No primary branch, no quick demo button) */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-roast mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-roast/40" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jusselle Surio"
                  className="w-full bg-white border border-[#EDE3D5] pl-10 pr-3 py-2.5 rounded-2xl text-xs sm:text-sm text-roast placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-caramel/40 focus:border-caramel shadow-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-roast mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-roast/40" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 0917-888-2468"
                  className="w-full bg-white border border-[#EDE3D5] pl-10 pr-3 py-2.5 rounded-2xl text-xs sm:text-sm text-roast placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-caramel/40 focus:border-caramel shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-roast mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-roast/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. jusselle@kapemuna.local"
                  className="w-full bg-white border border-[#EDE3D5] pl-10 pr-3 py-2.5 rounded-2xl text-xs sm:text-sm text-roast placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-caramel/40 focus:border-caramel shadow-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-roast mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-roast/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-white border border-[#EDE3D5] pl-10 pr-10 py-2.5 rounded-2xl text-xs sm:text-sm text-roast placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-caramel/40 focus:border-caramel shadow-xs"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-roast/40 hover:text-roast"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#221610] via-[#2A180F] to-caramel hover:from-[#160E0A] hover:to-caramel-hover text-white py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-cafe-md active:scale-95 transition-all disabled:opacity-50 mt-4 group"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Switch Mode Prompt Link */}
        <div className="mt-4 pt-3 border-t border-[#EDE3D5] text-center">
          <p className="text-xs text-[#221610]/70">
            {mode === 'signin' ? (
              <>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="font-bold text-caramel hover:text-caramel-hover underline underline-offset-2 ml-0.5"
                >
                  Create one now
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="font-bold text-caramel hover:text-caramel-hover underline underline-offset-2 ml-0.5"
                >
                  Sign In
                </button>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Bottom Subtle Brand Footer */}
      <div className="relative z-10 text-center py-2">
        <p className="text-[11px] font-medium text-white/80 drop-shadow-md">
          Kape Muna • Your daily pause in a cup
        </p>
      </div>
    </div>
  );
}
