import React, { useState, useEffect } from 'react';
import { useAudio } from '../../context/AudioContext';
import { IoClose } from 'react-icons/io5';
import { BsPencilSquare, BsMusicNote, BsCheckCircleFill, BsImage, BsSpeedometer2 } from 'react-icons/bs';
import { FaSave } from 'react-icons/fa';

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

const EditTrackModal = ({ track, isOpen, onClose }) => {
  const { editTrack } = useAudio();

  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [subgenre, setSubgenre] = useState('Drift Phonk');
  const [mood, setMood] = useState('Aggressive');
  const [bpm, setBpm] = useState(160);
  const [description, setDescription] = useState('');
  const [selectedCover, setSelectedCover] = useState(PRESET_COVERS[0]);
  const [audioFile, setAudioFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (track) {
      setTitle(track.title || '');
      setArtist(track.artist || '');
      setSubgenre(track.subgenre || 'Drift Phonk');
      setMood(track.mood || 'Aggressive');
      setBpm(track.bpm || 160);
      setDescription(track.description || '');
      setSelectedCover(track.cover || PRESET_COVERS[0]);
      setAudioFile(null);
      setCoverFile(null);
    }
  }, [track]);

  if (!isOpen || !track) return null;

  const handleAudioChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAudioFile(e.target.files[0]);
    }
  };

  const handleCoverChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCoverFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title) return;

    try {
      setIsSaving(true);
      await editTrack(
        track.id,
        {
          title: title.toUpperCase(),
          artist,
          subgenre,
          mood,
          bpm: parseInt(bpm),
          cover: coverFile ? null : selectedCover,
          description,
        },
        audioFile,
        coverFile
      );

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setIsSaving(false);
        onClose();
      }, 1000);
    } catch (err) {
      console.error('Save edited track error:', err);
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0e0f17] border border-[#ff0055]/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(255,0,85,0.25)] text-white overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Glow Accents */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#ff0055]/20 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#00f0ff]/20 blur-3xl rounded-full pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-slate-800/60 hover:bg-[#ff0055] text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
        >
          <IoClose className="text-xl" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#ff0055]/20 border border-[#ff0055]/40 flex items-center justify-center text-[#ff0055]">
            <BsPencilSquare className="text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-wider uppercase font-['Orbitron'] bg-gradient-to-r from-white via-slate-200 to-[#ff0055] bg-clip-text text-transparent">
              EDIT PHONK BEAT
            </h2>
            <p className="text-xs text-slate-400">Update track details, custom cover art, or audio file.</p>
          </div>
        </div>

        {isSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center animate-scaleUp">
            <BsCheckCircleFill className="text-6xl text-[#00f0ff] mb-4 animate-bounce" />
            <h3 className="text-2xl font-bold text-white mb-2">BEAT UPDATED!</h3>
            <p className="text-sm text-slate-400">Your track changes are live on PHONK HUB.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Optional New Audio File Drag and Drop */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                <BsMusicNote className="text-[#00f0ff]" /> Replace Audio File (Optional)
              </label>
              <div className="border border-dashed border-slate-700 hover:border-[#ff0055] bg-slate-900/50 hover:bg-slate-900/80 rounded-2xl p-4 text-center transition-all cursor-pointer relative">
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                />
                {audioFile ? (
                  <p className="font-bold text-[#00f0ff] text-xs truncate">{audioFile.name} • Ready to upload to Supabase</p>
                ) : (
                  <p className="text-xs text-slate-400">
                    Click to select new audio file (MP3 / WAV) to replace current beat
                  </p>
                )}
              </div>
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
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 focus:border-[#ff0055] focus:outline-none rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Producer / Artist
                </label>
                <input
                  type="text"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 focus:border-[#ff0055] focus:outline-none rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-all"
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

            {/* Cover Art Upload / Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <BsImage className="text-[#ff0055]" /> Cover Artwork
              </label>

              <div className="flex items-center gap-3 mb-3">
                <label className="flex-1 px-4 py-2.5 bg-slate-900/80 border border-slate-700 hover:border-[#ff0055] rounded-xl text-xs font-semibold text-slate-300 hover:text-white cursor-pointer transition-all text-center">
                  {coverFile ? coverFile.name : 'Upload New Custom Artwork to Supabase'}
                  <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
                </label>
              </div>

              {!coverFile && (
                <div className="grid grid-cols-4 gap-3">
                  {PRESET_COVERS.map((cov, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedCover(cov)}
                      className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all aspect-square ${
                        selectedCover === cov
                          ? 'border-[#ff0055] ring-2 ring-[#ff0055]/50 scale-95'
                          : 'border-slate-800 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={cov} alt={`Cover ${idx}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3.5 bg-gradient-to-r from-[#ff0055] via-[#a855f7] to-[#00f0ff] hover:opacity-95 text-white font-extrabold tracking-wider rounded-2xl shadow-[0_0_25px_rgba(255,0,85,0.4)] transition-all transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer uppercase font-['Orbitron']"
            >
              <FaSave className="text-xl" />
              <span>{isSaving ? 'SAVING CHANGES...' : 'SAVE CHANGES'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditTrackModal;
