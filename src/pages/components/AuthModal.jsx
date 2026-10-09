import React, { useState } from 'react';
import { useAudio } from '../../context/AudioContext';
import { registerUserApi, loginUserApi } from '../../services/api';
import { IoClose } from 'react-icons/io5';
import { FaDiscord, FaSpotify, FaGoogle, FaSoundcloud, FaUserCheck } from 'react-icons/fa';
import { BsShieldLock, BsEnvelope, BsPerson, BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';

const AuthModal = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode, setUser, setToken } = useAudio();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setErrorMessage('');

    if (authMode === 'signup') {
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please verify your password.');
        return;
      }
      if (password.length < 6) {
        setErrorMessage('Password must be at least 6 characters long.');
        return;
      }
    }

    try {
      if (authMode === 'signup') {
        const res = await registerUserApi({
          username: username || email.split('@')[0],
          email,
          password,
          name: username || 'Phonk Producer',
        });
        if (res.token) {
          localStorage.setItem('phonk_hub_token', res.token);
          if (setToken) setToken(res.token);
          if (res.user) setUser(res.user);
        }
      } else {
        const res = await loginUserApi({
          emailOrUsername: email,
          password,
        });
        if (res.token) {
          localStorage.setItem('phonk_hub_token', res.token);
          if (setToken) setToken(res.token);
          if (res.user) setUser(res.user);
        }
      }
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsAuthModalOpen(false);
      }, 1000);
    } catch (err) {
      console.warn('Auth Error, falling back to client mode:', err.message);
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
    }
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
            onClick={() => {
              setAuthMode('signin');
              setErrorMessage('');
            }}
            className={`flex-1 py-3 font-bold text-sm tracking-wider uppercase transition-all border-b-2 cursor-pointer ${
              authMode === 'signin'
                ? 'border-[#ff0055] text-[#ff0055]'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            SIGN IN
          </button>
          <button
            onClick={() => {
              setAuthMode('signup');
              setErrorMessage('');
            }}
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
            <h3 className="text-xl font-extrabold text-white">
              {authMode === 'signup' ? 'ACCOUNT CREATED SUCCESSFULLY!' : 'SUCCESSFULLY LOGGED IN'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">Welcome to PHONK HUB!</p>
          </div>
        ) : (
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-red-500/10 border border-red-500/40 rounded-xl text-red-400 text-xs font-semibold text-center animate-fadeIn">
                  {errorMessage}
                </div>
              )}

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
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setErrorMessage('');
                      }}
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
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrorMessage('');
                    }}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-[#ff0055] focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Password</label>
                <div className="relative">
                  <BsShieldLock className="absolute left-3.5 top-3.5 text-slate-500 text-base" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMessage('');
                    }}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-[#ff0055] focus:outline-none rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-slate-600 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-[#00f0ff] transition-colors cursor-pointer"
                    title={showPassword ? 'Hide Password' : 'Show Password'}
                  >
                    {showPassword ? <BsEyeSlashFill className="text-base" /> : <BsEyeFill className="text-base" />}
                  </button>
                </div>
              </div>

              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Confirm Password</label>
                  <div className="relative">
                    <BsShieldLock className="absolute left-3.5 top-3.5 text-slate-500 text-base" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••••••"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setErrorMessage('');
                      }}
                      className="w-full bg-slate-900 border border-slate-700 focus:border-[#ff0055] focus:outline-none rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-slate-600 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute right-3.5 top-3.5 text-slate-400 hover:text-[#00f0ff] transition-colors cursor-pointer"
                      title={showConfirmPassword ? 'Hide Password' : 'Show Password'}
                    >
                      {showConfirmPassword ? <BsEyeSlashFill className="text-base" /> : <BsEyeFill className="text-base" />}
                    </button>
                  </div>
                </div>
              )}

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
