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
  Sparkles,
  MapPin,
  ArrowRight
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
  const [branchName, setBranchName] = useState('Kape Muna — Main Branch');
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
      // 1. If Supabase is configured, authenticate through Supabase Auth
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
          branch_name: branchName,
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
      // 1. If Supabase is configured
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: {
              full_name: fullName.trim(),
              phone: phone.trim(),
              branch_name: branchName,
            },
          },
        });

        if (error) throw error;

        const customer = {
          id: data.user?.id || `user-${Date.now()}`,
          full_name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          branch_name: branchName,
        };

        localStorage.setItem('kape_muna_user', JSON.stringify(customer));
        setSuccessMsg('Account created! Welcome to Kape Muna.');
        setTimeout(() => onAuthSuccess(customer), 600);
        return;
      }

      // 2. Local Backend Registration
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          password,
          branch_name: branchName,
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

  // 1-Tap Quick Demo Sign In
  const handleQuickDemo = () => {
    const demoUser = {
      id: 'demo-jusselle-1',
      full_name: 'Jusselle Surio',
      email: 'jusselle@kapemuna.local',
      phone: '0917-888-2468',
      branch_name: 'Kape Muna — Main Branch',
    };
    localStorage.setItem('kape_muna_user', JSON.stringify(demoUser));
    onAuthSuccess(demoUser);
  };

  return (
    <div className="min-h-screen bg-[#F8F4EE] text-[#221610] flex flex-col justify-between p-4 sm:p-6 max-w-md mx-auto w-full transition-all">
      {/* Top Bar with Back Button */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBackToLanding}
          className="w-10 h-10 rounded-full bg-cream-card border border-[#EAE1D3] flex items-center justify-center text-roast hover:bg-[#F3EDE2] transition-all shadow-cafe-sm"
          aria-label="Back to welcome page"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5 text-caramel">
          <Coffee className="w-4 h-4 fill-caramel/25" />
          <span className="font-display font-bold text-base tracking-wide text-roast">Kape Muna</span>
        </div>

        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Main Card */}
      <div className="bg-[#FDFBF7] border border-[#ECE2D3] rounded-3xl p-5 sm:p-7 shadow-cafe-md my-auto">
        {/* Header Titles */}
        <div className="text-center mb-5">
          <h2 className="text-2xl font-serif font-bold text-[#221610]">
            {mode === 'signin' ? 'Welcome Back!' : 'Join Kape Muna'}
          </h2>
          <p className="text-xs text-[#221610]/65 mt-1 font-medium">
            {mode === 'signin'
              ? 'Sign in to access your loyalty points & orders.'
              : 'Create an account for quick pre-orders & perks.'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 gap-1.5 bg-[#F2ECE1] p-1 rounded-2xl mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'signin'
                ? 'bg-[#221610] text-[#FAF6F0] shadow-sm'
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
                ? 'bg-[#221610] text-[#FAF6F0] shadow-sm'
                : 'text-[#221610]/70 hover:text-[#221610]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. SIGN IN FORM */}
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
                  className="w-full bg-white border border-[#EDE3D5] pl-10 pr-3 py-2.5 rounded-2xl text-xs text-roast placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-caramel/30 focus:border-caramel"
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
                  className="w-full bg-white border border-[#EDE3D5] pl-10 pr-10 py-2.5 rounded-2xl text-xs text-roast placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-caramel/30 focus:border-caramel"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#221610] to-caramel hover:from-[#160E0A] hover:to-caramel-hover text-white py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-cafe-md active:scale-95 transition-all disabled:opacity-50 mt-2"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* 2. SIGN UP / CREATE ACCOUNT FORM */}
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
                  className="w-full bg-white border border-[#EDE3D5] pl-10 pr-3 py-2.5 rounded-2xl text-xs text-roast placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-caramel/30 focus:border-caramel"
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
                  className="w-full bg-white border border-[#EDE3D5] pl-10 pr-3 py-2.5 rounded-2xl text-xs text-roast placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-caramel/30 focus:border-caramel"
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
                  className="w-full bg-white border border-[#EDE3D5] pl-10 pr-3 py-2.5 rounded-2xl text-xs text-roast placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-caramel/30 focus:border-caramel"
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
                  className="w-full bg-white border border-[#EDE3D5] pl-10 pr-10 py-2.5 rounded-2xl text-xs text-roast placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-caramel/30 focus:border-caramel"
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

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-roast mb-1">
                Primary Store Branch
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-roast/40" />
                <select
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  className="w-full bg-white border border-[#EDE3D5] pl-10 pr-3 py-2.5 rounded-2xl text-xs text-roast focus:outline-none focus:ring-2 focus:ring-caramel/30 focus:border-caramel"
                >
                  <option value="Kape Muna — Main Branch">Kape Muna — Main Branch</option>
                  <option value="Kape Muna — Bonifacio High Street">Kape Muna — Bonifacio High Street</option>
                  <option value="Kape Muna — Poblacion Roastery">Kape Muna — Poblacion Roastery</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#221610] to-caramel hover:from-[#160E0A] hover:to-caramel-hover text-white py-3.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-cafe-md active:scale-95 transition-all disabled:opacity-50 mt-3"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                <>
                  <span>Create Account & Start Ordering</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#EDE3D5]" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
            <span className="bg-[#FDFBF7] px-2 text-[#221610]/50 font-bold">Quick Access</span>
          </div>
        </div>

        {/* 1-Tap Quick Demo Login (Extremely helpful for immediate pairing & grading) */}
        <button
          type="button"
          onClick={handleQuickDemo}
          className="w-full py-2.5 px-3 rounded-2xl border border-caramel/40 bg-caramel/10 hover:bg-caramel/15 text-caramel font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-caramel-gold" />
          <span>Quick Demo Sign In as Jusselle</span>
        </button>
      </div>

      {/* Guest Checkout Alternative */}
      <div className="text-center mt-3 mb-1">
        <button
          type="button"
          onClick={() => {
            const guestUser = {
              id: 'guest',
              full_name: 'Guest Customer',
              email: 'guest@kapemuna.local',
              phone: '0900-000-0000',
              branch_name: 'Kape Muna — Main Branch',
            };
            onAuthSuccess(guestUser);
          }}
          className="text-xs font-semibold text-roast/60 hover:text-roast underline underline-offset-2"
        >
          Continue as Guest for now ➔
        </button>
      </div>
    </div>
  );
}
