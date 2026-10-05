import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAudio } from '../../context/AudioContext';
import { FaUserCheck } from 'react-icons/fa';
import { BsMusicNote } from 'react-icons/bs';

const Signup = () => {
  const { setUser } = useAudio();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser((prev) => ({
      ...prev,
      name: username || 'Phonk Producer',
      username: username ? `@${username}` : '@producer',
    }));
    setSubmitted(true);
    setTimeout(() => {
      navigate('/');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#090a10] text-slate-100 flex items-center justify-center p-4 py-16">
      <div className="w-full max-w-md bg-slate-900/80 border border-[#ff0055]/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(255,0,85,0.2)]">
        <div className="text-center space-y-3 mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-black font-['Orbitron'] text-white">
            <BsMusicNote className="text-[#ff0055]" />
            <span>PHONK HUB</span>
          </Link>
          <h2 className="text-xl font-bold uppercase tracking-wider text-slate-200">JOIN THE PRODUCER VAULT</h2>
        </div>

        {submitted ? (
          <div className="py-8 text-center text-[#00f0ff] animate-scaleUp space-y-2">
            <FaUserCheck className="text-5xl mx-auto mb-2 animate-bounce" />
            <h3 className="text-xl font-extrabold text-white">ACCOUNT CREATED!</h3>
            <p className="text-xs text-slate-400">Welcome to PHONK HUB...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Producer Username</label>
              <input
                type="text"
                required
                placeholder="e.g. drift_master_99"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-[#ff0055] focus:outline-none rounded-xl px-4 py-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="producer@phonkhub.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-[#ff0055] focus:outline-none rounded-xl px-4 py-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-[#ff0055] focus:outline-none rounded-xl px-4 py-2.5 text-xs text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#ff0055] to-[#a855f7] hover:opacity-90 text-white font-extrabold font-['Orbitron'] text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer"
            >
              CREATE FREE ACCOUNT
            </button>
          </form>
        )}

        <p className="text-center text-xs text-slate-400 mt-6">
          Already registered?{' '}
          <Link to="/login" className="text-[#00f0ff] font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;