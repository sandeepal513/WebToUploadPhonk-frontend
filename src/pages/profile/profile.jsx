import React, { useState } from 'react';
import { useAudio } from '../../context/AudioContext';
import { BsPlayFill, BsPauseFill, BsHeartFill, BsCloudUpload, BsCheckCircleFill, BsGearFill, BsShareFill, BsBarChartLineFill } from 'react-icons/bs';
import { FaSpotify, FaSoundcloud, FaInstagram, FaDiscord } from 'react-icons/fa';

const Profile = () => {
  const { user, tracks, currentTrack, isPlaying, playTrack, likedTrackIds, setIsUploadModalOpen } = useAudio();
  const [activeTab, setActiveTab] = useState('my-tracks');

  const myTracks = tracks.filter((t) => t.artist === user?.name || t.artist === 'KAGE_PHONK');
  const likedTracks = tracks.filter((t) => likedTrackIds.has(t.id));

  return (
    <div className="min-h-screen bg-[#090a10] text-slate-100 pb-20">
      {/* Banner */}
      <div className="relative h-60 sm:h-72 w-full bg-gradient-to-r from-[#ff0055]/30 via-[#a855f7]/30 to-[#00f0ff]/30 border-b border-slate-800 overflow-hidden">
        <img
          src="/assets/phonkimg/drift.jpg"
          alt="Profile Banner"
          className="w-full h-full object-cover opacity-30 blur-sm scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090a10] via-transparent to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        {/* Profile Card Header */}
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 pb-8 border-b border-slate-800">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-3xl overflow-hidden border-4 border-[#ff0055] shadow-[0_0_30px_rgba(255,0,85,0.4)]">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black font-['Orbitron'] text-white">{user.name}</h1>
                {user.verified && <BsCheckCircleFill className="text-[#00f0ff] text-xl" title="Verified Producer" />}
              </div>
              <p className="text-xs font-mono text-slate-400">{user.username}</p>
              <p className="text-xs text-slate-300 max-w-lg leading-relaxed pt-1">{user.bio}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#ff0055] to-[#a855f7] hover:opacity-90 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer"
            >
              <BsCloudUpload className="text-base" />
              <span>Upload Beat</span>
            </button>
            <button className="p-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl" title="Share Vault">
              <BsShareFill />
            </button>
            <button className="p-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl" title="Settings">
              <BsGearFill />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-8">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
            <span className="block text-2xl font-black font-['Orbitron'] text-white">1.4M</span>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Plays</span>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
            <span className="block text-2xl font-black font-['Orbitron'] text-[#00f0ff]">{user.followers}</span>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Followers</span>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
            <span className="block text-2xl font-black font-['Orbitron'] text-[#ff0055]">{myTracks.length}</span>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Tracks</span>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
            <span className="block text-2xl font-black font-['Orbitron'] text-purple-400">{likedTracks.length}</span>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Liked Beats</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 mb-6 font-['Orbitron']">
          <button
            onClick={() => setActiveTab('my-tracks')}
            className={`px-6 py-3 font-bold text-xs tracking-wider uppercase transition-all border-b-2 cursor-pointer ${
              activeTab === 'my-tracks' ? 'border-[#ff0055] text-[#ff0055]' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            My Published Beats ({myTracks.length})
          </button>
          <button
            onClick={() => setActiveTab('liked-tracks')}
            className={`px-6 py-3 font-bold text-xs tracking-wider uppercase transition-all border-b-2 cursor-pointer ${
              activeTab === 'liked-tracks' ? 'border-[#ff0055] text-[#ff0055]' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Liked Beats ({likedTracks.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {(activeTab === 'my-tracks' ? myTracks : likedTracks).map((track) => {
            const isCurrPlaying = isPlaying && currentTrack?.id === track.id;

            return (
              <div
                key={track.id}
                onClick={() => playTrack(track)}
                className={`flex items-center justify-between gap-4 p-4 bg-slate-900/60 border rounded-2xl transition-all cursor-pointer group hover:bg-slate-900 ${
                  isCurrPlaying ? 'border-[#ff0055] shadow-[0_0_20px_rgba(255,0,85,0.2)]' : 'border-slate-800'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      {isCurrPlaying ? <BsPauseFill className="text-white text-2xl" /> : <BsPlayFill className="text-white text-2xl" />}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-sm text-white group-hover:text-[#ff0055] transition-colors">{track.title}</h4>
                    <p className="text-xs text-slate-400 font-semibold">{track.artist}</p>
                  </div>
                </div>

                <div className="hidden sm:block text-xs font-mono text-[#00f0ff]">{track.subgenre}</div>

                <div className="hidden md:block text-xs font-mono text-slate-400">{track.plays} plays</div>

                <div className="text-xs font-mono text-slate-400">{track.duration}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Profile;