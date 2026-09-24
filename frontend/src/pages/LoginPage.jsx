import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Github, Mail, Lock, Music, UserPlus, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { GlassCard } from '../components/ui/GlassCard';

export const LoginPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { currentUser: user, login, signUp } = useAuth();
  const navigate = useNavigate();

  // Watch for successful authentication
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Debugging trace (Optional: remove in production)
    console.log(`Attempting Authentication: Mode=${isSignUp ? 'SignUp' : 'SignIn'}`);

    try {
      if (isSignUp === true) {
        // Explicitly trigger Firebase Create Account
        await signUp(email, password);
      } else {
        // Explicitly trigger Firebase Sign In
        await login(email, password);
      }
      // Manual navigate removed - handled by useEffect
    } catch (err) {
      // Map common Firebase errors to user-friendly messages
      let message = err.message;
      if (err.code === 'auth/email-already-in-use') {
        message = "This email is already registered. Try signing in.";
      } else if (err.code === 'auth/weak-password') {
        message = "Encryption key is too weak. Use at least 6 characters.";
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        message = "Invalid credentials. Please verify your email and key.";
      } else if (err.code === 'auth/user-not-found') {
        message = "No producer found with this email.";
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };


  const handleGoogleLogin = async () => {
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Manual navigate removed - handled by useEffect
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Gradients */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-primary/20 via-transparent to-transparent pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [0, -90, 0],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 25, repeat: Infinity }}
        className="absolute bottom-0 right-0 w-full h-full bg-gradient-radial from-secondary/20 via-transparent to-transparent pointer-events-none"
      />

      <GlassCard className="max-w-md w-full p-10 border-white/5" hover={false}>
        <div className="flex flex-col items-center mb-10">
          <motion.div
            whileHover={{ rotate: 15 }}
            className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(249,115,22,0.4)]"
          >
            <Music className="w-10 h-10 text-white" />
          </motion.div>
          <motion.h1
            key={isSignUp ? 'signup' : 'signin'}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black outfit tracking-tighter mb-2"
          >
            {isSignUp ? 'INITIALIZE NODE' : 'IsaiCraft'}<span className="text-primary prose-primary">.</span>
          </motion.h1>
          <p className="text-slate-400 text-sm font-medium tracking-wide outfit uppercase opacity-60">
            {isSignUp ? 'Join the Neuro-Acoustic Network' : 'Neuro-Acoustic Production Studio'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex gap-3 items-start">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs font-bold outfit text-red-400 leading-relaxed uppercase tracking-wide">
                  {error}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Producer Email"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 transition-all font-medium outfit"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Encryption Key"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 transition-all font-medium outfit"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            type="submit"
            className="btn-primary w-full py-4 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(249,115,22,0.2)] disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isSignUp ? (
              <UserPlus className="w-5 h-5" />
            ) : (
              <LogIn className="w-5 h-5" />
            )}
            <span className="outfit font-black tracking-widest uppercase">
              {isSignUp ? 'Initialize Neural Node' : 'Establish Connection'}
            </span>
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="text-xs font-bold outfit text-slate-500 hover:text-primary transition-colors uppercase tracking-[0.15em]"
          >
            {isSignUp ? (
              <>Already a producer? <span className="text-secondary underline underline-offset-4 ml-1">Establish </span></>
            ) : (
              <>New to the network? <span className="text-primary underline underline-offset-4 ml-1">Sign Up</span></>
            )}
          </button>
        </div>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.25em]">
            <span className="bg-[#0f172a] px-4 text-slate-500 outfit">External Auth Stacks</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 text-sm font-bold outfit transition-all group"
          >
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.94 0 3.68.67 5.05 1.97L20.61 3.5C18.39 1.43 15.43.17 12 .17 7.31.17 3.27 2.87 1.25 6.81l3.54 2.74c.85-2.54 3.21-4.51 7.21-4.51z" />
              <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.71 2.88c2.16-1.99 3.41-4.91 3.41-8.7z" />
              <path fill="#FBBC05" d="M4.79 14.55c-.21-.63-.33-1.3-.33-2 0-.7.12-1.37.33-2L1.25 7.81C.45 9.38 0 11.14 0 13c0 1.86.45 3.62 1.25 5.19l3.54-2.64z" />
              <path fill="#34A853" d="M12 23.83c3.15 0 5.79-1.04 7.72-2.82l-3.71-2.88c-1.04.7-2.38 1.11-4.01 1.11-4 0-7.36-2.71-8.57-6.36l-3.54 2.74c2.02 3.94 6.06 6.21 10.11 6.21z" />
            </svg>
            Google
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 text-sm font-bold outfit transition-all group"
          >
            <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
            GitHub
          </button>
        </div>
      </GlassCard>
    </div>
  );
};
