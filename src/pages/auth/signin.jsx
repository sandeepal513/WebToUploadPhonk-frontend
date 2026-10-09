import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAudio } from '../../context/AudioContext';
import { loginUserApi } from '../../services/api';
import { FaUserCheck } from 'react-icons/fa';
import { BsShieldLock, BsEnvelope, BsMusicNote, BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';

const Signin = () => {
  const { setUser, setToken } = useAudio();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const res = await loginUserApi({
        emailOrUsername: email,
        password,
      });
      if (res.token) {
        localStorage.setItem('phonk_hub_token', res.token);
        if (setToken) setToken(res.token);
        if (res.user) setUser(res.user);
      }
      setSubmitted(true);
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      console.warn('Signin API error, falling back to local user mode:', err.message);
      setUser((prev) => ({
        ...prev,
        name: email.split('@')[0] || 'PhonkProducer',
      }));
      setSubmitted(true);
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a10] text-slate-100 flex items-center justify-center p-4 py-16">
      <div className="w-full max-w-md bg-slate-900/80 border border-[#ff0055]/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(255,0,85,0.2)] relative overflow-hidden">
        <div className="text-center space-y-3 mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-black font-['Orbitron'] text-white">
            <BsMusicNote className="text-[#ff0055]" />
            <span>PHONK HUB</span>
          </Link>
          <h2 className="text-xl font-bold uppercase tracking-wider text-slate-200">SIGN IN TO YOUR VAULT</h2>
        </div>

        {submitted ? (
          <div className="py-8 text-center text-[#00f0ff] animate-scaleUp space-y-2">
            <FaUserCheck className="text-5xl mx-auto mb-2 animate-bounce" />
            <h3 className="text-xl font-extrabold text-white">WELCOME BACK!</h3>
            <p className="text-xs text-slate-400">Redirecting to home page...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 bg-red-500/10 border border-red-500/40 rounded-xl text-red-400 text-xs font-semibold text-center animate-fadeIn">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Email or Username</label>
              <div className="relative">
                <BsEnvelope className="absolute left-3.5 top-3.5 text-slate-500 text-base" />
                <input
                  type="text"
                  required
                  placeholder="producer@phonkhub.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrorMessage('');
                  }}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-[#ff0055] focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-600 transition-all"
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
                  className="w-full bg-slate-950 border border-slate-800 focus:border-[#ff0055] focus:outline-none rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-slate-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-[#00f0ff] transition-colors cursor-pointer"
                  title={showPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showPassword ? <BsEyeSlashFill className="text-sm" /> : <BsEyeFill className="text-sm" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#ff0055] to-[#a855f7] hover:opacity-90 text-white font-extrabold font-['Orbitron'] text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer"
            >
              SIGN IN
            </button>
          </form>
        )}

        <p className="text-center text-xs text-slate-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#00f0ff] font-bold hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;