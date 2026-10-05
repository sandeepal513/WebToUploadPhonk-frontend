import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaSpotify, FaDiscord, FaYoutube, FaSoundcloud } from 'react-icons/fa';
import { BsTwitterX, BsMusicNote } from 'react-icons/bs';
import { BiWorld } from 'react-icons/bi';
import { IoSparkles } from 'react-icons/io5';

const FooterBar = () => {
  return (
    <footer className="bg-[#07080e] border-t border-[#ff0055]/20 text-slate-400 pt-16 pb-28 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-900">
          {/* About Section */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <BsMusicNote className="text-2xl text-[#ff0055]" />
              <span className="font-['Orbitron'] text-2xl font-black tracking-wider text-white">
                PHONK<span className="text-[#ff0055]">HUB</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              The world's premier community platform dedicated to underground Phonk music culture. Discover heavy 808 distortion, Memphis tape bounce, Brazilian sub-bass drops, and night drift vibes. Built for artists, listeners, and beatmakers.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a href="https://spotify.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-[#1DB954] text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-800">
                <FaSpotify />
              </a>
              <a href="https://soundcloud.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-[#FF5500] text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-800">
                <FaSoundcloud />
              </a>
              <a href="https://discord.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-[#5865F2] text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-800">
                <FaDiscord />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-[#FF0000] text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-800">
                <FaYoutube />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-[#E4405F] text-slate-300 hover:text-white flex items-center justify-center transition-all border border-slate-800">
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Subgenre Tags */}
          <div className="space-y-3">
            <h4 className="font-['Orbitron'] text-xs font-black tracking-widest text-white uppercase">PHONK VAULT</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link to="/discover?genre=Drift+Phonk" className="hover:text-[#ff0055] transition-colors">🏎️ Drift Phonk</Link>
              </li>
              <li>
                <Link to="/discover?genre=Memphis+Underground" className="hover:text-[#ff0055] transition-colors">📼 Memphis 1996</Link>
              </li>
              <li>
                <Link to="/discover?genre=Brazilian+Phonk" className="hover:text-[#ff0055] transition-colors">🔥 Brazilian Phonk</Link>
              </li>
              <li>
                <Link to="/discover?genre=Phonkwave" className="hover:text-[#ff0055] transition-colors">🌃 Phonkwave & Synth</Link>
              </li>
              <li>
                <Link to="/discover?genre=Hardcore+Bass" className="hover:text-[#ff0055] transition-colors">⚡ Hardcore Bass</Link>
              </li>
            </ul>
          </div>

          {/* Quick Links & Platform Status */}
          <div className="space-y-3">
            <h4 className="font-['Orbitron'] text-xs font-black tracking-widest text-white uppercase">NAVIGATION</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link to="/discover" className="hover:text-white transition-colors">Discover Tracks</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">Producer Profile</Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-white transition-colors">Producer Support FAQ</Link>
              </li>
            </ul>

            {/* Hosting Status Pill */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Hosting Ready • Production Vercel / Netlify</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} PHONK HUB. Built for underground producers & listeners.</p>
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full text-slate-300">
            <BiWorld className="text-slate-400" />
            <select defaultValue="en" className="bg-transparent text-xs font-semibold focus:outline-none cursor-pointer">
              <option value="en" className="bg-slate-900">English (Global)</option>
              <option value="si" className="bg-slate-900">සිංහල (Sinhala)</option>
              <option value="ja" className="bg-slate-900">日本語 (Japanese)</option>
              <option value="pt" className="bg-slate-900">Português (Brasil)</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterBar;