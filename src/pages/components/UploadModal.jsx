import React, { useState } from 'react';
import { useAudio } from '../../context/AudioContext';
import { IoClose } from 'react-icons/io5';
import { BsCloudUpload, BsMusicNote, BsCheckCircleFill, BsImage, BsSpeedometer2 } from 'react-icons/bs';
import { FaFire } from 'react-icons/fa';

const SUBGENRES = [
  'Drift Phonk',
  'Memphis Underground',
  'Brazilian Phonk',
  'Phonkwave',
  'Hardcore Bass',
  'House Phonk',
  'Cyber Trap',
];

const MOODS = ['Aggressive', 'Dark', 'Hype', 'Chill', 'Nightmare', 'Sad'];

const PRESET_COVERS = [
  '/assets/phonkimg/drift.jpg',
  '/assets/phonkimg/memphis.jpg',
  '/assets/phonkimg/brazilian.jpg',
  '/assets/phonkimg/wave.jpg',
];

const UploadModal = () => {
  const { isUploadModalOpen, setIsUploadModalOpen, uploadTrack, user, setIsAuthModalOpen, setAuthMode } = useAudio();

  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState(user?.name || '');
  const [subgenre, setSubgenre] = useState('Drift Phonk');
  const [mood, setMood] = useState('Aggressive');
  const [bpm, setBpm] = useState(160);
  const [description, setDescription] = useState('');
  const [selectedCover, setSelectedCover] = useState(PRESET_COVERS[0]);
  const [audioFile, setAudioFile] = useState(null);
  const [customCoverUrl, setCustomCoverUrl] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isUploadModalOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAudioFile(file);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return;

    let audioUrl = 'synth:drift';
    if (audioFile) {
      audioUrl = URL.createObjectURL(audioFile);
    }

    await uploadTrack(
      {
        title: title.toUpperCase(),
        artist: artist || user?.name || 'Producer',
        subgenre: subgenre,
        mood: mood,
        bpm: parseInt(bpm),
        cover: customCoverUrl || selectedCover,
        audioUrl: audioUrl,
        description: description || 'Uploaded beat on Phonk Hub.',
      },
      audioFile
    );

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsUploadModalOpen(false);
      setTitle('');
      setAudioFile(null);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0e0f17] border border-[#ff0055]/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(255,0,85,0.25)] text-white overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Neon Glow Accents */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#ff0055]/20 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#00f0ff]/20 blur-3xl rounded-full pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setIsUploadModalOpen(false)}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-slate-800/60 hover:bg-[#ff0055] text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
        >
          <IoClose className="text-xl" />
        </button>

        {!user ? (
          <div className="py-10 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-3xl bg-[#ff0055]/20 border border-[#ff0055]/40 flex items-center justify-center text-[#ff0055] mb-4">
              <BsCloudUpload className="text-3xl" />
            </div>
            <h3 className="text-2xl font-bold font-['Orbitron'] text-white mb-2 uppercase">ACCOUNT REQUIRED</h3>
            <p className="text-sm text-slate-400 max-w-md mb-6">
              Create an account or sign in to upload your Phonk beats to the global community.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setAuthMode('signup');
                  setIsAuthModalOpen(true);
                }}
                className="px-6 py-3 bg-gradient-to-r from-[#ff0055] to-[#a855f7] hover:opacity-95 text-white font-extrabold rounded-2xl shadow-lg uppercase text-xs tracking-wider cursor-pointer font-['Orbitron']"
              >
                CREATE ACCOUNT
              </button>
              <button
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setAuthMode('signin');
                  setIsAuthModalOpen(true);
                }}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-2xl border border-slate-700 uppercase text-xs tracking-wider cursor-pointer font-['Orbitron']"
              >
                SIGN IN
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Modal Title */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[#ff0055]/20 border border-[#ff0055]/40 flex items-center justify-center text-[#ff0055]">
                <BsCloudUpload className="text-2xl" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-wider uppercase font-['Orbitron'] bg-gradient-to-r from-white via-slate-200 to-[#ff0055] bg-clip-text text-transparent">
                  UPLOAD PHONK BEAT
                </h2>
                <p className="text-xs text-slate-400">Publish your track directly as <span className="text-[#00f0ff] font-bold">{user.name}</span>.</p>
              </div>
            </div>

        {isSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center animate-scaleUp">
            <BsCheckCircleFill className="text-6xl text-[#00f0ff] mb-4 animate-bounce" />
            <h3 className="text-2xl font-bold text-white mb-2">BEAT UPLOADED & LIVE!</h3>
            <p className="text-sm text-slate-400">Your track is now playing on PHONK HUB.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Audio Drag and Drop zone */}
            <div className="border-2 border-dashed border-slate-700 hover:border-[#ff0055] bg-slate-900/50 hover:bg-slate-900/80 rounded-2xl p-6 text-center transition-all cursor-pointer relative group">
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              <BsMusicNote className="text-4xl text-[#ff0055] mx-auto mb-2 group-hover:scale-110 transition-transform" />
              {audioFile ? (
                <div>
                  <p className="font-bold text-[#00f0ff]">{audioFile.name}</p>
                  <p className="text-xs text-slate-400 mt-1">{(audioFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to drop</p>
                </div>
              ) : (
                <div>
                  <p className="font-bold text-slate-200 group-hover:text-[#ff0055] transition-colors">
                    Click or drag your MP3 / WAV audio file here
                  </p>
                  <p className="text-xs text-slate-500 mt-1">High quality 320kbps recommended • Maximum 50MB</p>
                </div>
              )}
            </div>

            {/* Track Title & Artist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Track Title <span className="text-[#ff0055]">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TOKYO DRIFT DEMON"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 focus:border-[#ff0055] focus:outline-none rounded-xl px-4 py-2.5 text-sm font-semibold placeholder:text-slate-600 text-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Producer / Artist Name
                </label>
                <input
                  type="text"
                  placeholder="Your Producer Alias"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 focus:border-[#ff0055] focus:outline-none rounded-xl px-4 py-2.5 text-sm font-semibold placeholder:text-slate-600 text-white transition-all"
                />
              </div>
            </div>

            {/* Subgenre & Mood */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Subgenre</label>
                <select
                  value={subgenre}
                  onChange={(e) => setSubgenre(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 focus:border-[#ff0055] focus:outline-none rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all"
                >
                  {SUBGENRES.map((sg) => (
                    <option key={sg} value={sg} className="bg-slate-900 text-white">
                      {sg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Vibe / Mood</label>
                <select
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 focus:border-[#ff0055] focus:outline-none rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all"
                >
                  {MOODS.map((m) => (
                    <option key={m} value={m} className="bg-slate-900 text-white">
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* BPM Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <BsSpeedometer2 className="text-[#00f0ff]" /> BPM Speed: <span className="text-[#00f0ff] font-mono">{bpm} BPM</span>
                </label>
              </div>
              <input
                type="range"
                min="90"
                max="200"
                value={bpm}
                onChange={(e) => setBpm(e.target.value)}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#ff0055]"
              />
            </div>

            {/* Cover Art Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <BsImage className="text-[#ff0055]" /> Select Cover Artwork
              </label>
              <div className="grid grid-cols-4 gap-3">
                {PRESET_COVERS.map((cov, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedCover(cov);
                      setCustomCoverUrl('');
                    }}
                    className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all aspect-square ${
                      selectedCover === cov && !customCoverUrl
                        ? 'border-[#ff0055] ring-2 ring-[#ff0055]/50 scale-95'
                        : 'border-slate-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={cov} alt={`Cover ${idx}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#ff0055] via-[#a855f7] to-[#00f0ff] hover:opacity-95 text-white font-extrabold tracking-wider rounded-2xl shadow-[0_0_25px_rgba(255,0,85,0.4)] transition-all transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer uppercase font-['Orbitron']"
            >
              <FaFire className="text-xl" />
              <span>PUBLISH TRACK TO PHONK HUB</span>
            </button>
          </form>
        )}
        </>
        )}
      </div>
    </div>
  );
};

export default UploadModal;
