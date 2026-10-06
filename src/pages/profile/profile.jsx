import React, { useState } from 'react';
import { useAudio } from '../../context/AudioContext';
import { BsPlayFill, BsPauseFill, BsHeartFill, BsCloudUpload, BsCheckCircleFill, BsGearFill, BsShareFill, BsBarChartLineFill, BsCameraFill, BsPencilSquare, BsTrash } from 'react-icons/bs';
import { FaSpotify, FaSoundcloud, FaInstagram, FaDiscord } from 'react-icons/fa';
import EditTrackModal from '../components/EditTrackModal';

const Profile = () => {
  const { user, logoutUser, tracks, currentTrack, isPlaying, playTrack, likedTrackIds, setIsUploadModalOpen, setIsAuthModalOpen, setAuthMode, updateUserAvatar, deleteTrack } = useAudio();
  const [activeTab, setActiveTab] = useState('my-tracks');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [editingTrack, setEditingTrack] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [trackToDelete, setTrackToDelete] = useState(null);

  const handleAvatarChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        setIsUploadingAvatar(true);
        await updateUserAvatar(file);
      } catch (err) {
        console.error('Avatar update failed:', err);
      } finally {
        setIsUploadingAvatar(false);
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#090a10] text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#0e0f17] border border-[#ff0055]/30 rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(255,0,85,0.2)]">
          <div className="w-16 h-16 rounded-3xl bg-[#ff0055]/20 border border-[#ff0055]/40 flex items-center justify-center text-[#ff0055] mx-auto mb-4">
            <BsCloudUpload className="text-3xl" />
          </div>
          <h2 className="text-2xl font-black font-['Orbitron'] text-white uppercase mb-2">PRODUCER VAULT</h2>
          <p className="text-xs text-slate-400 mb-6">
            Create an account or sign in to access your producer dashboard, uploaded Phonk beats, and statistics.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setAuthMode('signup');
                setIsAuthModalOpen(true);
              }}
              className="w-full py-3.5 bg-gradient-to-r from-[#ff0055] to-[#a855f7] hover:opacity-90 text-white font-extrabold rounded-2xl shadow-lg font-['Orbitron'] text-xs uppercase tracking-wider cursor-pointer"
            >
              CREATE PRODUCER ACCOUNT
            </button>
            <button
              onClick={() => {
                setAuthMode('signin');
                setIsAuthModalOpen(true);
              }}
              className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl border border-slate-700 font-['Orbitron'] text-xs uppercase tracking-wider cursor-pointer"
            >
              SIGN IN TO ACCOUNT
            </button>
          </div>
        </div>
      </div>
    );
  }

  const myTracks = tracks.filter((t) => t.artist === user.name || t.uploader?.username === user.username);
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
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-3xl overflow-hidden border-4 border-[#ff0055] shadow-[0_0_30px_rgba(255,0,85,0.4)] group">
              <img src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'} alt={user.name} className="w-full h-full object-cover" />
              <label title="Upload avatar image to Supabase phonkhub-profile bucket" className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity">
                <BsCameraFill className="text-2xl mb-1 text-[#00f0ff]" />
                <span className="text-[10px] font-extrabold uppercase font-['Orbitron']">
                  {isUploadingAvatar ? 'UPLOADING...' : 'CHANGE PIC'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  disabled={isUploadingAvatar}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black font-['Orbitron'] text-white">{user.name}</h1>
                <BsCheckCircleFill className="text-[#00f0ff] text-xl" title="Verified Producer" />
              </div>
              <p className="text-xs font-mono text-slate-400">{user.username}</p>
              <p className="text-xs text-slate-300 max-w-lg leading-relaxed pt-1">{user.bio || 'Underground Phonk Producer'}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#ff0055] to-[#a855f7] hover:opacity-90 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg cursor-pointer font-['Orbitron']"
            >
              <BsCloudUpload className="text-base" />
              <span>Upload Beat</span>
            </button>
            <button
              onClick={logoutUser}
              className="px-4 py-2.5 bg-slate-900 border border-slate-800 hover:border-[#ff0055] text-slate-300 hover:text-[#ff0055] text-xs font-bold rounded-xl transition-all cursor-pointer font-['Orbitron'] uppercase"
              title="Sign Out"
            >
              Sign Out
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

                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-400">{track.duration}</span>

                  {activeTab === 'my-tracks' && (
                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          setEditingTrack(track);
                          setIsEditModalOpen(true);
                        }}
                        className="p-2 rounded-xl bg-slate-800/80 hover:bg-[#00f0ff]/20 text-slate-300 hover:text-[#00f0ff] border border-slate-700 hover:border-[#00f0ff]/50 transition-all cursor-pointer"
                        title="Edit Track Details"
                      >
                        <BsPencilSquare className="text-sm" />
                      </button>

                      <button
                        onClick={() => setTrackToDelete(track)}
                        className="p-2 rounded-xl bg-slate-800/80 hover:bg-[#ff0055]/20 text-slate-300 hover:text-[#ff0055] border border-slate-700 hover:border-[#ff0055]/50 transition-all cursor-pointer"
                        title="Delete Track"
                      >
                        <BsTrash className="text-sm" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Track Modal */}
      <EditTrackModal
        track={editingTrack}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTrack(null);
        }}
      />

      {/* Custom Delete Confirmation Popup Modal */}
      {trackToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#0e0f17] border border-[#ff0055]/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(255,0,85,0.3)] text-white text-center">
            {/* Glow Accent */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#ff0055]/20 blur-2xl rounded-full pointer-events-none" />

            <div className="w-16 h-16 rounded-3xl bg-[#ff0055]/20 border border-[#ff0055]/40 flex items-center justify-center text-[#ff0055] mx-auto mb-4 animate-bounce">
              <BsTrash className="text-3xl" />
            </div>

            <h3 className="text-xl font-black font-['Orbitron'] text-white uppercase mb-2">
              DELETE BEAT?
            </h3>

            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              Are you sure you want to permanently delete <span className="text-[#ff0055] font-bold font-mono">"{trackToDelete.title}"</span>? This action cannot be undone.
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setTrackToDelete(null)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl border border-slate-700 font-['Orbitron'] text-xs uppercase tracking-wider cursor-pointer transition-all"
              >
                CANCEL
              </button>
              <button
                onClick={async () => {
                  await deleteTrack(trackToDelete.id);
                  setTrackToDelete(null);
                }}
                className="flex-1 py-3 bg-gradient-to-r from-[#ff0055] to-red-700 hover:opacity-90 text-white font-extrabold rounded-2xl shadow-lg font-['Orbitron'] text-xs uppercase tracking-wider cursor-pointer transition-all shadow-[0_0_20px_rgba(255,0,85,0.4)]"
              >
                DELETE BEAT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;