import React, { useState } from 'react';
import { useAudio } from '../../context/AudioContext';
import {
  BsPlayFill,
  BsPauseFill,
  BsSkipEndFill,
  BsSkipStartFill,
  BsHeartFill,
  BsHeart,
  BsVolumeUpFill,
  BsVolumeMuteFill,
  BsMusicNote,
  BsShuffle,
  BsRepeat,
  BsCloudUpload,
} from 'react-icons/bs';
import { IoMdTime } from 'react-icons/io';

const AudioPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    playNext,
    playPrev,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    currentTime,
    setCurrentTime,
    duration,
    seekTo,
    likedTrackIds,
    toggleLike,
    visualizerData,
    setIsUploadModalOpen,
  } = useAudio();

  const [isExpanded, setIsExpanded] = useState(false);

  if (!currentTrack) return null;

  const isLiked = likedTrackIds.has(currentTrack.id);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    seekTo(newTime);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-3 py-2 sm:px-6 sm:py-3 bg-[#0c0d14]/90 backdrop-blur-xl border-t border-[#ff0055]/30 shadow-[0_-10px_30px_rgba(255,0,85,0.15)] text-white transition-all">
      {/* Visualizer Spectrum Bar */}
      <div className="absolute -top-1 left-0 right-0 h-[3px] bg-gradient-to-r from-[#ff0055] via-[#a855f7] to-[#00f0ff] flex items-center justify-around opacity-80 overflow-hidden">
        {isPlaying &&
          visualizerData.slice(0, 12).map((h, idx) => (
            <div
              key={idx}
              className="w-1 bg-[#ff0055] animate-pulse rounded-full"
              style={{ height: `${(h / 100) * 12 + 2}px` }}
            />
          ))}
      </div>

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-6">
        {/* Track Info */}
        <div className="flex items-center gap-3 w-1/3 min-w-[180px]">
          <div className="relative group flex-shrink-0 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover shadow-lg border border-white/10 group-hover:scale-105 transition-all ${
                isPlaying ? 'ring-2 ring-[#ff0055] shadow-[0_0_15px_rgba(255,0,85,0.5)]' : ''
              }`}
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
                <BsMusicNote className="text-[#ff0055] animate-bounce text-lg" />
              </div>
            )}
          </div>

          <div className="overflow-hidden">
            <h4 className="font-extrabold text-sm sm:text-base text-white tracking-wide truncate group flex items-center gap-2">
              <span className="truncate">{currentTrack.title}</span>
              <span className="hidden lg:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest bg-[#ff0055]/20 text-[#ff0055] border border-[#ff0055]/40 rounded-full">
                {currentTrack.subgenre}
              </span>
            </h4>
            <p className="text-xs text-slate-400 font-medium truncate">{currentTrack.artist}</p>
          </div>

          <button
            onClick={(e) => toggleLike(currentTrack.id, e)}
            className="ml-1 sm:ml-2 text-slate-400 hover:text-[#ff0055] transition-colors p-1"
            title={isLiked ? 'Unlike track' : 'Like track'}
          >
            {isLiked ? <BsHeartFill className="text-[#ff0055] text-lg animate-pulse" /> : <BsHeart className="text-lg" />}
          </button>
        </div>

        {/* Player Controls & Scrubber */}
        <div className="flex flex-col items-center justify-center w-2/3 max-w-xl">
          <div className="flex items-center gap-3 sm:gap-6">
            <button className="text-slate-400 hover:text-white transition-colors text-sm hidden sm:block" title="Shuffle">
              <BsShuffle />
            </button>

            <button
              onClick={playPrev}
              className="text-slate-300 hover:text-white transition-colors text-lg sm:text-xl"
              title="Previous Track"
            >
              <BsSkipStartFill />
            </button>

            <button
              onClick={togglePlay}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-r from-[#ff0055] to-[#a855f7] hover:scale-105 active:scale-95 text-white flex items-center justify-center shadow-[0_0_20px_rgba(255,0,85,0.6)] transition-all cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <BsPauseFill className="text-2xl" /> : <BsPlayFill className="text-2xl ml-0.5" />}
            </button>

            <button
              onClick={playNext}
              className="text-slate-300 hover:text-white transition-colors text-lg sm:text-xl"
              title="Next Track"
            >
              <BsSkipEndFill />
            </button>

            <button className="text-slate-400 hover:text-white transition-colors text-sm hidden sm:block" title="Repeat">
              <BsRepeat />
            </button>
          </div>

          {/* Timeline bar */}
          <div className="w-full flex items-center gap-2 mt-1 sm:mt-2">
            <span className="text-[11px] font-mono text-slate-400 w-10 text-right">{formatTime(currentTime)}</span>
            <div className="relative flex-1 flex items-center">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#ff0055] hover:accent-[#00f0ff] transition-all"
              />
            </div>
            <span className="text-[11px] font-mono text-slate-400 w-10">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume & Quick Upload */}
        <div className="hidden md:flex items-center justify-end gap-4 w-1/3 min-w-[160px]">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#ff0055]/20 hover:bg-[#ff0055] text-[#ff0055] hover:text-white border border-[#ff0055]/40 rounded-full font-bold text-xs transition-all shadow-[0_0_10px_rgba(255,0,85,0.2)]"
          >
            <BsCloudUpload />
            <span>Upload</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? <BsVolumeMuteFill className="text-lg" /> : <BsVolumeUpFill className="text-lg" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#a855f7]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
