import React, { useState } from 'react';
import { useAudio } from '../../context/AudioContext';
import { IoClose } from 'react-icons/io5';
import { FaDiscord, FaSpotify, FaGoogle, FaSoundcloud, FaUserCheck } from 'react-icons/fa';
import { BsShieldLock, BsEnvelope, BsPerson } from 'react-icons/bs';

const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode, setUser } = useAudio();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setUser((prev) => ({
      ...prev,
      name: username || (authMode === 'signin' ? 'Phonk Producer' : 'New Producer'),
      username: username ? `@${username}` : '@phonk_user',
    }));

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsAuthModalOpen(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-[#0e0f17] border border-[#ff0055]/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(255,0,85,0.25)] text-white overflow-hidden">
        {/* Neon Glow background */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#ff0055]/20 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#a855f7]/20 blur-3xl rounded-full pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-slate-800/60 hover:bg-[#ff0055] text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
        >
          <IoClose className="text-xl" />
        </button>

        {/* Header Tabs */}
        <div className="flex border-b border-slate-800 mb-6 font-['Orbitron']">
          <button
            onClick={() => setAuthMode('signin')}
            className={`flex-1 py-3 font-bold text-sm tracking-wider uppercase transition-all border-b-2 cursor-pointer ${
              authMode === 'signin'
                ? 'border-[#ff0055] text-[#ff0055]'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            SIGN IN
          </button>
          <button
            onClick={() => setAuthMode('signup')}
            className={`flex-1 py-3 font-bold text-sm tracking-wider uppercase transition-all border-b-2 cursor-pointer ${
              authMode === 'signup'
                ? 'border-[#ff0055] text-[#ff0055]'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            CREATE ACCOUNT
          </button>
        </div>

        {isSuccess ? (
          <div className="py-10 text-center animate-scaleUp">
            <FaUserCheck className="text-5xl text-[#00f0ff] mx-auto mb-3 animate-bounce" />
            <h3 className="text-xl font-extrabold text-white">SUCCESSFULLY LOGGED IN</h3>
            <p className="text-xs text-slate-400 mt-1">Welcome back to PHONK HUB!</p>
          </div>
        ) : (
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Username</label>
                  <div className="relative">
                    <BsPerson className="absolute left-3.5 top-3.5 text-slate-500 text-base" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. drift_king_99"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 focus:border-[#ff0055] focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Email Address</label>
                <div className="relative">
                  <BsEnvelope className="absolute left-3.5 top-3.5 text-slate-500 text-base" />
                  <input
                    type="email"
                    required
                    placeholder="producer@phonkhub.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-[#ff0055] focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Password</label>
                <div className="relative">
                  <BsShieldLock className="absolute left-3.5 top-3.5 text-slate-500 text-base" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-[#ff0055] focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 mt-2 bg-gradient-to-r from-[#ff0055] to-[#a855f7] hover:opacity-90 text-white font-extrabold tracking-wider rounded-xl shadow-[0_0_20px_rgba(255,0,85,0.4)] transition-all font-['Orbitron'] text-sm uppercase cursor-pointer"
              >
                {authMode === 'signin' ? 'ENTER THE VAULT' : 'JOIN PHONK HUB'}
              </button>
            </form>

            <div className="my-5 flex items-center gap-3">
              <div className="h-[1px] bg-slate-800 flex-1" />
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">OR CONNECT WITH</span>
              <div className="h-[1px] bg-slate-800 flex-1" />
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={handleSubmit}
                className="py-2.5 bg-slate-900 hover:bg-[#5865F2] text-slate-300 hover:text-white rounded-xl border border-slate-800 hover:border-[#5865F2] flex items-center justify-center transition-all cursor-pointer"
                title="Discord"
              >
                <FaDiscord className="text-lg" />
              </button>
              <button
                onClick={handleSubmit}
                className="py-2.5 bg-slate-900 hover:bg-[#1DB954] text-slate-300 hover:text-white rounded-xl border border-slate-800 hover:border-[#1DB954] flex items-center justify-center transition-all cursor-pointer"
                title="Spotify"
              >
                <FaSpotify className="text-lg" />
              </button>
              <button
                onClick={handleSubmit}
                className="py-2.5 bg-slate-900 hover:bg-[#FF5500] text-slate-300 hover:text-white rounded-xl border border-slate-800 hover:border-[#FF5500] flex items-center justify-center transition-all cursor-pointer"
                title="SoundCloud"
              >
                <FaSoundcloud className="text-lg" />
              </button>
              <button
                onClick={handleSubmit}
                className="py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 flex items-center justify-center transition-all cursor-pointer"
                title="Google"
              >
                <FaGoogle className="text-sm" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;
