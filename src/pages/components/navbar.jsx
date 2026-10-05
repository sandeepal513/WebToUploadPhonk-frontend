import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAudio } from '../../context/AudioContext';
import { BsSearch, BsCloudUpload, BsPersonCircle, BsMusicNote } from 'react-icons/bs';
import { FaFire } from 'react-icons/fa';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import { IoSparkles } from 'react-icons/io5';

const Navbar = () => {
  const { searchQuery, setSearchQuery, setIsUploadModalOpen, setIsAuthModalOpen, setAuthMode, user } = useAudio();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (window.location.pathname !== '/discover') {
      navigate('/discover');
    }
  };

  return (
    <nav className="sticky top-0 z-40 bg-[#090a10]/85 backdrop-blur-xl border-b border-[#ff0055]/20 shadow-[0_4px_30px_rgba(0,0,0,0.5)] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ff0055] via-[#a855f7] to-[#00f0ff] p-0.5 shadow-[0_0_20px_rgba(255,0,85,0.5)] group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#090a10] rounded-[10px] flex items-center justify-center">
              <BsMusicNote className="text-xl text-[#ff0055] group-hover:animate-pulse" />
            </div>
          </div>
          <span className="font-['Orbitron'] text-xl sm:text-2xl font-black tracking-wider bg-gradient-to-r from-white via-slate-100 to-[#ff0055] bg-clip-text text-transparent group-hover:to-[#00f0ff] transition-all">
            PHONK HUB
          </span>
        </Link>

        {/* Live Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
          <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search Drift, Memphis, Brazilian Phonk..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full bg-slate-900/90 border border-slate-800 focus:border-[#ff0055] focus:outline-none rounded-full pl-11 pr-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 shadow-inner transition-all focus:shadow-[0_0_20px_rgba(255,0,85,0.2)]"
          />
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-8 font-semibold text-sm tracking-wide">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `transition-colors hover:text-[#ff0055] ${isActive ? 'text-[#ff0055] font-extrabold border-b-2 border-[#ff0055] py-1' : 'text-slate-300'}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/discover"
            className={({ isActive }) =>
              `transition-colors hover:text-[#ff0055] ${isActive ? 'text-[#ff0055] font-extrabold border-b-2 border-[#ff0055] py-1' : 'text-slate-300'}`
            }
          >
            Discover
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `transition-colors hover:text-[#ff0055] ${isActive ? 'text-[#ff0055] font-extrabold border-b-2 border-[#ff0055] py-1' : 'text-slate-300'}`
            }
          >
            Profile
          </NavLink>
          <NavLink
            to="/support"
            className={({ isActive }) =>
              `transition-colors hover:text-[#ff0055] ${isActive ? 'text-[#ff0055] font-extrabold border-b-2 border-[#ff0055] py-1' : 'text-slate-300'}`
            }
          >
            Support
          </NavLink>
        </div>

        {/* CTA & User Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#ff0055] to-[#a855f7] hover:opacity-90 text-white font-extrabold text-xs uppercase tracking-wider rounded-full shadow-[0_0_15px_rgba(255,0,85,0.4)] transition-all transform hover:-translate-y-0.5 cursor-pointer font-['Orbitron']"
          >
            <BsCloudUpload className="text-base" />
            <span>Upload Beat</span>
          </button>

          {user ? (
            <Link
              to="/profile"
              className="flex items-center gap-2 pl-2 pr-3 py-1 bg-slate-900 border border-slate-800 hover:border-[#ff0055] rounded-full transition-all group"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-[#ff0055]"
              />
              <span className="text-xs font-bold text-slate-200 group-hover:text-[#ff0055] max-w-[90px] truncate">
                {user.name}
              </span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setAuthMode('signin');
                  setIsAuthModalOpen(true);
                }}
                className="px-4 py-2 text-xs font-extrabold text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setIsAuthModalOpen(true);
                }}
                className="px-4 py-2 text-xs font-extrabold bg-slate-800 hover:bg-slate-700 text-white rounded-full border border-slate-700 transition-all cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <HiX className="text-2xl" /> : <HiMenuAlt3 className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0b12] border-b border-slate-800 px-4 py-6 space-y-4 animate-slideDown">
          <div className="relative mb-4">
            <BsSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Search tracks..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-slate-900 border border-slate-800 rounded-full pl-11 pr-4 py-2 text-sm text-slate-200"
            />
          </div>

          <div className="flex flex-col space-y-3 font-semibold text-base">
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="text-slate-200 hover:text-[#ff0055]">
              Home
            </Link>
            <Link to="/discover" onClick={() => setMobileMenuOpen(false)} className="text-slate-200 hover:text-[#ff0055]">
              Discover
            </Link>
            <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="text-slate-200 hover:text-[#ff0055]">
              Profile
            </Link>
            <Link to="/support" onClick={() => setMobileMenuOpen(false)} className="text-slate-200 hover:text-[#ff0055]">
              Support
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsUploadModalOpen(true);
              }}
              className="w-full py-2.5 bg-gradient-to-r from-[#ff0055] to-[#a855f7] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2"
            >
              <BsCloudUpload />
              <span>Upload Beat</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsAuthModalOpen(true);
              }}
              className="w-full py-2.5 bg-slate-800 text-slate-200 font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-700"
            >
              Account Sign In / Register
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;