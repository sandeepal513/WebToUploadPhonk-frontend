import React, { useState, useMemo } from 'react';
import { useAudio } from '../../context/AudioContext';
import {
  BsSearch,
  BsPlayFill,
  BsPauseFill,
  BsHeartFill,
  BsHeart,
  BsFilter,
  BsGridFill,
  BsListUl,
  BsSpeedometer2,
  BsStarFill,
} from 'react-icons/bs';
import { IoClose } from 'react-icons/io5';
import { MdMood } from 'react-icons/md';
import { FaFire } from 'react-icons/fa';

const SUBGENRES = [
  'All',
  'Drift Phonk',
  'Memphis Underground',
  'Brazilian Phonk',
  'Phonkwave',
  'Hardcore Bass',
];

const MOODS = ['All', 'Aggressive', 'Dark', 'Hype', 'Chill', 'Nightmare', 'Sad'];

const Discover = () => {
  const {
    tracks,
    currentTrack,
    isPlaying,
    playTrack,
    likedTrackIds,
    toggleLike,
    searchQuery,
    setSearchQuery,
  } = useAudio();

  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedMood, setSelectedMood] = useState('All');
  const [minBpm, setMinBpm] = useState(90);
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filtered and sorted content
  const filteredContent = useMemo(() => {
    let result = [...tracks];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.artist.toLowerCase().includes(q) ||
          t.subgenre.toLowerCase().includes(q) ||
          t.mood.toLowerCase().includes(q)
      );
    }

    if (selectedGenre !== 'All') {
      result = result.filter((t) => t.subgenre === selectedGenre);
    }

    if (selectedMood !== 'All') {
      result = result.filter((t) => t.mood === selectedMood);
    }

    if (minBpm > 90) {
      result = result.filter((t) => t.bpm >= minBpm);
    }

    if (sortBy === 'popular') {
      result.sort((a, b) => b.likesCount - a.likesCount);
    } else if (sortBy === 'latest') {
      result.reverse();
    } else if (sortBy === 'bpm') {
      result.sort((a, b) => b.bpm - a.bpm);
    }

    return result;
  }, [tracks, searchQuery, selectedGenre, selectedMood, minBpm, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedGenre('All');
    setSelectedMood('All');
    setMinBpm(90);
    setSortBy('popular');
  };

  return (
    <div className="min-h-screen bg-[#090a10] text-slate-100 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black font-['Orbitron'] tracking-wide uppercase bg-gradient-to-r from-white to-[#00f0ff] bg-clip-text text-transparent">
            DISCOVER PHONK TRACKS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Filter through thousands of underground beats by BPM, vibe, subgenre, and popularity.
          </p>
        </div>

        {/* View Mode & Controls */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-1 flex items-center">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-sm transition-all cursor-pointer ${
                viewMode === 'grid' ? 'bg-[#ff0055] text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Grid View"
            >
              <BsGridFill />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg text-sm transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-[#ff0055] text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="List View"
            >
              <BsListUl />
            </button>
          </div>

          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-200"
          >
            <BsFilter />
            <span>Filters</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar Filters */}
        <div
          className={`md:col-span-3 space-y-6 bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 h-fit ${
            isMobileFilterOpen ? 'block' : 'hidden md:block'
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-sm uppercase tracking-wider font-['Orbitron'] text-white">FILTER VAULT</h3>
            <button onClick={handleResetFilters} className="text-xs text-[#00f0ff] hover:underline font-bold">
              Reset
            </button>
          </div>

          {/* Search */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Search</label>
            <div className="relative">
              <BsSearch className="absolute left-3.5 top-3 text-slate-500 text-xs" />
              <input
                type="text"
                placeholder="Track, artist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:border-[#ff0055] focus:outline-none"
              />
            </div>
          </div>

          {/* Subgenres */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Subgenre</label>
            <div className="space-y-1">
              {SUBGENRES.map((sg) => (
                <button
                  key={sg}
                  onClick={() => setSelectedGenre(sg)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedGenre === sg
                      ? 'bg-[#ff0055] text-white font-bold'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  {sg}
                </button>
              ))}
            </div>
          </div>

          {/* Mood / Vibe */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <MdMood className="text-yellow-400" /> Vibe / Mood
            </label>
            <div className="flex flex-wrap gap-1.5">
              {MOODS.map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMood(m)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                    selectedMood === m
                      ? 'bg-[#00f0ff] text-slate-950'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Minimum BPM */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-400 flex items-center gap-1">
                <BsSpeedometer2 className="text-[#00f0ff]" /> Min BPM
              </span>
              <span className="font-mono font-bold text-[#00f0ff]">{minBpm} BPM</span>
            </div>
            <input
              type="range"
              min="90"
              max="180"
              step="5"
              value={minBpm}
              onChange={(e) => setMinBpm(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#ff0055]"
            />
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-semibold focus:outline-none"
            >
              <option value="popular">Most Liked / Popular</option>
              <option value="latest">Latest Drops</option>
              <option value="bpm">Fastest BPM</option>
            </select>
          </div>
        </div>

        {/* Content Area */}
        <div className="md:col-span-9">
          <div className="mb-4 text-xs font-semibold text-slate-400 flex justify-between items-center">
            <span>Showing {filteredContent.length} Phonk Tracks</span>
            {selectedGenre !== 'All' && <span className="text-[#ff0055] font-bold">Filter: {selectedGenre}</span>}
          </div>

          {filteredContent.length === 0 ? (
            <div className="py-20 text-center bg-slate-900/40 border border-slate-800 rounded-3xl p-8 space-y-4">
              <div className="text-5xl">🎧</div>
              <h3 className="text-xl font-bold text-white">No tracks match your current filter</h3>
              <p className="text-xs text-slate-400">Try adjusting your BPM slider or clearing the search term.</p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-[#ff0055] text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-lg"
              >
                Clear All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContent.map((track) => {
                const isCurrPlaying = isPlaying && currentTrack?.id === track.id;
                const isLiked = likedTrackIds.has(track.id);

                return (
                  <div
                    key={track.id}
                    onClick={() => playTrack(track)}
                    className={`group bg-slate-900/60 border rounded-3xl p-4 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer ${
                      isCurrPlaying
                        ? 'border-[#ff0055] shadow-[0_0_25px_rgba(255,0,85,0.4)]'
                        : 'border-slate-800 hover:border-[#ff0055]/50'
                    }`}
                  >
                    <div className="relative aspect-square rounded-2xl overflow-hidden mb-3 bg-slate-950">
                      <img src={track.cover} alt={track.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />

                      <button
                        onClick={(e) => toggleLike(track.id, e)}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-slate-300 hover:text-[#ff0055] flex items-center justify-center"
                      >
                        {isLiked ? <BsHeartFill className="text-[#ff0055]" /> : <BsHeart />}
                      </button>

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 rounded-full bg-[#ff0055] text-white flex items-center justify-center shadow-lg">
                          {isCurrPlaying ? <BsPauseFill className="text-2xl" /> : <BsPlayFill className="text-2xl ml-0.5" />}
                        </div>
                      </div>
                    </div>

                    <h4 className="font-extrabold text-sm text-white group-hover:text-[#ff0055] transition-colors truncate">
                      {track.title}
                    </h4>
                    <p className="text-xs text-slate-400 font-semibold">{track.artist}</p>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span className="text-[#00f0ff] font-bold">{track.subgenre}</span>
                      <span>{track.bpm} BPM</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* List View */
            <div className="space-y-3">
              {filteredContent.map((track) => {
                const isCurrPlaying = isPlaying && currentTrack?.id === track.id;
                const isLiked = likedTrackIds.has(track.id);

                return (
                  <div
                    key={track.id}
                    onClick={() => playTrack(track)}
                    className={`flex items-center justify-between gap-4 p-3 bg-slate-900/60 border rounded-2xl transition-all cursor-pointer group ${
                      isCurrPlaying ? 'border-[#ff0055] bg-slate-900' : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-4 min-w-[200px]">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          {isCurrPlaying ? <BsPauseFill className="text-white text-xl" /> : <BsPlayFill className="text-white text-xl" />}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-sm text-white group-hover:text-[#ff0055] transition-colors truncate">
                          {track.title}
                        </h4>
                        <p className="text-xs text-slate-400">{track.artist}</p>
                      </div>
                    </div>

                    <div className="hidden sm:block text-xs font-semibold text-[#00f0ff]">{track.subgenre}</div>

                    <div className="hidden md:block text-xs font-mono text-slate-400">{track.bpm} BPM</div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-400">{track.duration}</span>
                      <button onClick={(e) => toggleLike(track.id, e)} className="text-slate-400 hover:text-[#ff0055]">
                        {isLiked ? <BsHeartFill className="text-[#ff0055]" /> : <BsHeart />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Discover;