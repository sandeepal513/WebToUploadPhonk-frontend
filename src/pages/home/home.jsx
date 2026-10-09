import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAudio } from '../../context/AudioContext';
import { BsPlayFill, BsPauseFill, BsHeartFill, BsHeart, BsCloudUpload, BsMusicNote, BsCheckCircleFill, BsVolumeUpFill } from 'react-icons/bs';
import { IoMdTime } from 'react-icons/io';
import { FaFire, FaCompactDisc } from 'react-icons/fa';
import { IoSparkles } from 'react-icons/io5';

const DEFAULT_PRODUCERS = [
  {
    name: 'KAGE_PHONK',
    role: 'Drift Phonk Master',
    followers: '128.4K',
    tracksCount: 24,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    verified: true,
  },
  {
    name: 'DEVILMAN_666',
    role: 'Memphis Underground Legend',
    followers: '94.2K',
    tracksCount: 31,
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    verified: true,
  },
  {
    name: 'MC BRAZIL_DEMON',
    role: 'Brazilian Subwoofer Producer',
    followers: '210.8K',
    tracksCount: 18,
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=200&q=80',
    verified: true,
  },
  {
    name: 'CYBER_VIPER',
    role: 'Phonkwave & Synthwave Specialist',
    followers: '65.1K',
    tracksCount: 15,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    verified: false,
  },
];

const SUBGENRE_FILTERS = [
  'All',
  'Drift Phonk',
  'Memphis Underground',
  'Brazilian Phonk',
  'Phonkwave',
  'Hardcore Bass',
];

const Home = () => {
  const {
    tracks,
    currentTrack,
    isPlaying,
    playTrack,
    likedTrackIds,
    toggleLike,
    subgenreFilter,
    setSubgenreFilter,
    setIsUploadModalOpen,
    visualizerData,
    triggerSoundFX,
  } = useAudio();

  const navigate = useNavigate();

  const featuredProducers = useMemo(() => {
    if (!tracks || tracks.length === 0) return DEFAULT_PRODUCERS;
    const map = new Map();
    tracks.forEach((t) => {
      if (t.artist && !map.has(t.artist)) {
        const artistTracks = tracks.filter((tr) => tr.artist === t.artist);
        map.set(t.artist, {
          name: t.artist,
          role: `${t.subgenre || 'Phonk'} Producer`,
          followers: `${(artistTracks.length * 12.5 + 4.2).toFixed(1)}K`,
          tracksCount: artistTracks.length,
          avatar: t.cover || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          verified: true,
        });
      }
    });
    const dynamicList = Array.from(map.values());
    return dynamicList.length >= 4 ? dynamicList.slice(0, 4) : [...dynamicList, ...DEFAULT_PRODUCERS].slice(0, 4);
  }, [tracks]);

  const filteredTracks = tracks.filter((t) => {
    if (subgenreFilter === 'All') return true;
    return t.subgenre === subgenreFilter;
  });

  return (
    <div className="min-h-screen bg-[#08090f] text-slate-100 overflow-x-hidden cyber-grid">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Background Glowing Neon Blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#ff0055]/15 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-[#00f0ff]/10 blur-[110px] rounded-full pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff0055]/10 border border-[#ff0055]/40 text-[#ff0055] text-xs font-extrabold uppercase tracking-widest shadow-[0_0_20px_rgba(255,0,85,0.3)] animate-pulse">
              <FaFire />
              <span>THE WORLD'S PHONK VAULT • 夜走狂</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black font-['Orbitron'] tracking-tight leading-tight uppercase bg-gradient-to-r from-white via-slate-100 to-[#ff0055] bg-clip-text text-transparent drop-shadow-md">
              DOMINATE THE <span className="text-[#ff0055] drop-shadow-[0_0_30px_rgba(255,0,85,0.9)]">UNDERGROUND</span> PHONK VIBE
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-medium max-w-2xl leading-relaxed mx-auto lg:mx-0">
              Stream heavy distorted 808s, drift cowbells, Memphis tape bounce, and Brazilian nightmare bass. Upload your tracks and connect with millions of underground listeners worldwide.
            </p>

            {/* Interactive Sound FX Station Bar */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <BsVolumeUpFill className="text-[#ff0055] text-base animate-pulse" />
                <span>INSTANT SOUND TEST:</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => triggerSoundFX('bassdrop')}
                  className="flex-1 sm:flex-none px-3.5 py-2 bg-[#ff0055]/20 hover:bg-[#ff0055] text-[#ff0055] hover:text-white border border-[#ff0055]/50 rounded-xl text-xs font-extrabold font-['Orbitron'] uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(255,0,85,0.3)]"
                >
                  🔊 808 BASS DROP
                </button>
                <button
                  onClick={() => triggerSoundFX('cowbell')}
                  className="flex-1 sm:flex-none px-3.5 py-2 bg-[#00f0ff]/20 hover:bg-[#00f0ff] text-[#00f0ff] hover:text-black border border-[#00f0ff]/50 rounded-xl text-xs font-extrabold font-['Orbitron'] uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                >
                  🔔 COWBELL SOLO
                </button>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={() => navigate('/discover')}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#ff0055] via-[#a855f7] to-[#00f0ff] hover:opacity-95 text-white font-extrabold font-['Orbitron'] tracking-wider text-sm uppercase rounded-2xl shadow-[0_0_35px_rgba(255,0,85,0.5)] transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 cursor-pointer"
              >
                <BsMusicNote className="text-xl" />
                <span>EXPLORE VAULT</span>
              </button>

              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="w-full sm:w-auto px-8 py-4 bg-slate-900/90 hover:bg-slate-800 text-white font-extrabold font-['Orbitron'] tracking-wider text-sm uppercase rounded-2xl border border-slate-700 hover:border-[#ff0055] shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <BsCloudUpload className="text-xl text-[#ff0055]" />
                <span>UPLOAD YOUR BEAT</span>
              </button>
            </div>

            {/* Stats row */}
            <div className="pt-8 border-t border-slate-900/80 grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <h4 className="text-2xl font-black font-['Orbitron'] text-white">45K+</h4>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Tracks Uploaded</p>
              </div>
              <div>
                <h4 className="text-2xl font-black font-['Orbitron'] text-[#00f0ff]">1.8M</h4>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Active Listeners</p>
              </div>
              <div>
                <h4 className="text-2xl font-black font-['Orbitron'] text-[#ff0055]">12K+</h4>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Producers</p>
              </div>
            </div>
          </div>

          {/* Hero Right Graphic & Visualizer */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative space-y-6">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-[#ff0055] via-[#a855f7] to-[#00f0ff] p-1.5 shadow-[0_0_90px_rgba(255,0,85,0.45)] animate-spin-slow">
              <div className="w-full h-full bg-[#08090f] rounded-full p-6 flex items-center justify-center border-4 border-black relative overflow-hidden">
                <img
                  src={currentTrack?.cover || '/assets/phonkimg/drift.jpg'}
                  alt="Turntable Vinyl"
                  className="w-full h-full rounded-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-black/60 rounded-full" />
                <div className="w-20 h-20 bg-black rounded-full border-4 border-[#ff0055] flex items-center justify-center shadow-2xl relative z-10">
                  <FaCompactDisc className={`text-3xl text-white ${isPlaying ? 'animate-spin' : ''}`} />
                </div>
              </div>
            </div>

            {/* Bouncing Audio Visualizer Bar Graphic */}
            <div className="w-full max-w-xs h-12 bg-slate-950/80 border border-slate-800 rounded-2xl px-4 flex items-end justify-between gap-1 shadow-inner">
              {visualizerData.slice(0, 20).map((height, i) => (
                <div
                  key={i}
                  style={{ height: `${height}%` }}
                  className={`w-full rounded-t-sm transition-all duration-150 ${
                    i % 2 === 0 ? 'bg-gradient-to-t from-[#ff0055] to-[#a855f7]' : 'bg-gradient-to-t from-[#00f0ff] to-[#ff0055]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SUBGENRE CHIPS SELECTOR */}
      <section className="px-4 max-w-7xl mx-auto my-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none">
          {SUBGENRE_FILTERS.map((sg) => (
            <button
              key={sg}
              onClick={() => setSubgenreFilter(sg)}
              className={`px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer border ${
                subgenreFilter === sg
                  ? 'bg-[#ff0055] text-white border-[#ff0055] shadow-[0_0_20px_rgba(255,0,85,0.5)] scale-105'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {sg}
            </button>
          ))}
        </div>
      </section>

      {/* TRENDING TRACKS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-slate-800/60 pb-4">
          <div>
            <div className="flex items-center gap-2 text-[#ff0055]">
              <FaFire className="text-lg animate-bounce" />
              <span className="text-xs font-bold uppercase tracking-widest">HOT IN THE VAULT</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-['Orbitron'] text-white tracking-wide">
              TRENDING PHONK TRACKS
            </h2>
          </div>
          <button
            onClick={() => navigate('/discover')}
            className="text-xs font-extrabold text-[#00f0ff] hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
          >
            VIEW ALL TRACKS →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredTracks.map((track) => {
            const isCurrPlaying = isPlaying && currentTrack?.id === track.id;
            const isLiked = likedTrackIds.has(track.id);

            return (
              <div
                key={track.id}
                onClick={() => playTrack(track)}
                className={`group relative bg-slate-900/60 hover:bg-slate-900 border rounded-3xl p-4 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer overflow-hidden ${
                  isCurrPlaying
                    ? 'border-[#ff0055] shadow-[0_0_30px_rgba(255,0,85,0.35)] ring-1 ring-[#ff0055]'
                    : 'border-slate-800/80 hover:border-[#ff0055]/50 hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)]'
                }`}
              >
                {/* Artwork */}
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-slate-950">
                  <img
                    src={track.cover}
                    alt={track.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Subgenre Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest bg-black/70 backdrop-blur-md text-[#ff0055] border border-[#ff0055]/40 rounded-full">
                      {track.subgenre}
                    </span>
                  </div>

                  {/* Like Button */}
                  <button
                    onClick={(e) => toggleLike(track.id, e)}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md text-slate-300 hover:text-[#ff0055] flex items-center justify-center transition-colors"
                  >
                    {isLiked ? <BsHeartFill className="text-[#ff0055] text-base" /> : <BsHeart className="text-base" />}
                  </button>

                  {/* Play Button Center Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 rounded-full bg-[#ff0055] text-white flex items-center justify-center shadow-[0_0_25px_rgba(255,0,85,0.8)] transform group-hover:scale-100 scale-75 transition-transform">
                      {isCurrPlaying ? <BsPauseFill className="text-3xl" /> : <BsPlayFill className="text-3xl ml-1" />}
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-base text-white group-hover:text-[#ff0055] transition-colors truncate">
                    {track.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold">{track.artist}</span>
                    <span className="font-mono text-[#00f0ff]">{track.bpm} BPM</span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed pt-1">{track.description}</p>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                    <div className="flex items-center gap-1 text-slate-300">
                      <BsPlayFill className="text-sm text-[#ff0055]" />
                      <span>{track.plays} plays</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <IoMdTime className="text-slate-400" />
                      <span>{track.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* TOP PRODUCERS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-[#08090f]/60 border-y border-slate-900">
        <div className="mb-10 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#00f0ff]">CREATORS & BEATMAKERS</span>
          <h2 className="text-3xl font-black font-['Orbitron'] text-white tracking-wide mt-1">
            FEATURED UNDERGROUND PRODUCERS
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducers.map((producer, idx) => (
            <div
              key={idx}
              className="bg-slate-900/80 border border-slate-800 hover:border-[#a855f7] rounded-3xl p-6 text-center space-y-4 transition-all hover:-translate-y-1.5 group"
            >
              <div className="relative w-20 h-20 mx-auto">
                <img
                  src={producer.avatar}
                  alt={producer.name}
                  className="w-full h-full rounded-full object-cover border-2 border-[#a855f7] group-hover:scale-105 transition-transform"
                />
                {producer.verified && (
                  <BsCheckCircleFill className="absolute bottom-0 right-0 text-[#00f0ff] bg-black rounded-full text-base" />
                )}
              </div>

              <div>
                <h4 className="font-extrabold text-base text-white group-hover:text-[#a855f7] transition-colors">
                  {producer.name}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">{producer.role}</p>
              </div>

              <div className="flex items-center justify-around py-2 border-y border-slate-800 text-xs font-mono text-slate-400">
                <div>
                  <span className="block font-bold text-white text-sm">{producer.followers}</span>
                  <span>Followers</span>
                </div>
                <div>
                  <span className="block font-bold text-white text-sm">{producer.tracksCount}</span>
                  <span>Tracks</span>
                </div>
              </div>

              <button className="w-full py-2 bg-slate-800 hover:bg-[#a855f7] text-slate-200 hover:text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer">
                FOLLOW PRODUCER
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* UPLOAD BEAT BANNER CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#14061a] via-[#1f0015] to-[#0d1626] border border-[#ff0055]/30 p-8 sm:p-12 overflow-hidden shadow-[0_0_50px_rgba(255,0,85,0.15)] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff0055]/20 text-[#ff0055] text-xs font-extrabold uppercase tracking-widest">
              <IoSparkles />
              <span>BEATMAKER VAULT ACCESS</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-['Orbitron'] text-white uppercase leading-tight">
              READY TO DROP YOUR PHONK BEAT?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Upload your MP3 or WAV files instantly. Gain exposure on our global trending charts, feature in playlists, and monetize your beats.
            </p>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="relative z-10 px-8 py-4 bg-gradient-to-r from-[#ff0055] to-[#a855f7] hover:opacity-95 text-white font-extrabold font-['Orbitron'] text-sm uppercase tracking-wider rounded-2xl shadow-[0_0_30px_rgba(255,0,85,0.6)] transition-all transform hover:scale-105 cursor-pointer whitespace-nowrap"
          >
            START UPLOADING NOW
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;