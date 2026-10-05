import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AudioContext = createContext(null);

export const INITIAL_TRACKS = [
  {
    id: 'track-1',
    title: 'MIDNIGHT DRIFT GTR',
    artist: 'KAGE_PHONK',
    album: 'DRIFT NIGHTS VOL. 1',
    subgenre: 'Drift Phonk',
    duration: '2:45',
    durationSec: 165,
    plays: '4.8M',
    likesCount: 184200,
    bpm: 160,
    rating: 5,
    cover: '/assets/phonkimg/drift.jpg',
    audioUrl: 'synth:drift',
    mood: 'Aggressive',
    featured: true,
    description: 'Heavy distorted 808 bass, cowbell riffs & Japanese drifting atmosphere.'
  },
  {
    id: 'track-2',
    title: 'MEMPHIS RITUAL 1996',
    artist: 'DEVILMAN_666',
    album: 'VOID TAPES',
    subgenre: 'Memphis Underground',
    duration: '3:12',
    durationSec: 192,
    plays: '3.2M',
    likesCount: 142100,
    bpm: 145,
    rating: 5,
    cover: '/assets/phonkimg/memphis.jpg',
    audioUrl: 'synth:memphis',
    mood: 'Dark',
    featured: true,
    description: 'Raw tape distortion, lo-fi vocal chops and underground Memphis 808 bounce.'
  },
  {
    id: 'track-3',
    title: 'NIGHTMARE BASS RAGE',
    artist: 'MC BRAZIL_DEMON',
    album: 'RIO SUBWOOFER SHAKE',
    subgenre: 'Brazilian Phonk',
    duration: '2:18',
    durationSec: 138,
    plays: '6.1M',
    likesCount: 298000,
    bpm: 132,
    rating: 5,
    cover: '/assets/phonkimg/brazilian.jpg',
    audioUrl: 'synth:brazilian',
    mood: 'Hype',
    featured: true,
    description: 'Ultra-aggressive Brazilian Funk syncopated basslines and ear-shattering kick drops.'
  },
  {
    id: 'track-4',
    title: 'NEON HIGHWAY WAVE',
    artist: 'CYBER_VIPER',
    album: 'STREET DRIVER',
    subgenre: 'Phonkwave',
    duration: '3:40',
    durationSec: 220,
    plays: '1.9M',
    likesCount: 89400,
    bpm: 128,
    rating: 4,
    cover: '/assets/phonkimg/wave.jpg',
    audioUrl: 'synth:wave',
    mood: 'Chill',
    featured: false,
    description: 'Atmospheric synthwave pads blended with slowed phonk cowbell melodies.'
  },
  {
    id: 'track-5',
    title: 'DARK VOID KILLSWITCH',
    artist: 'SHADOW_REAPER',
    album: 'EXECUTION VOL. 2',
    subgenre: 'Hardcore Bass',
    duration: '2:55',
    durationSec: 175,
    plays: '2.4M',
    likesCount: 112000,
    bpm: 155,
    rating: 5,
    cover: '/assets/phonkimg/drift.jpg',
    audioUrl: 'synth:drift',
    mood: 'Nightmare',
    featured: false,
    description: 'Grave bass frequency overcharged with metallic percussion.'
  },
  {
    id: 'track-6',
    title: 'TOKYO STREET RACER',
    artist: 'AKIRA_808',
    album: 'SHUTOKO SPEEDWAY',
    subgenre: 'Drift Phonk',
    duration: '3:05',
    durationSec: 185,
    plays: '5.4M',
    likesCount: 245000,
    bpm: 165,
    rating: 5,
    cover: '/assets/phonkimg/wave.jpg',
    audioUrl: 'synth:wave',
    mood: 'Hype',
    featured: true,
    description: 'Adrenaline pumping drift anthem with heavy bass drops.'
  }
];

export const AudioProvider = ({ children }) => {
  // Load stored tracks from localStorage if available
  const [tracks, setTracks] = useState(() => {
    try {
      const saved = localStorage.getItem('phonk_hub_tracks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Could not read saved tracks:', e);
    }
    return INITIAL_TRACKS;
  });

  const [currentTrack, setCurrentTrack] = useState(tracks[0] || INITIAL_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(currentTrack?.durationSec || 165);
  const [likedTrackIds, setLikedTrackIds] = useState(new Set(['track-1', 'track-3']));
  const [subgenreFilter, setSubgenreFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [user, setUser] = useState({
    name: 'PhonkProducer_808',
    username: '@phonk808',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    verified: true,
    bio: 'Underground Drift Phonk producer based in Tokyo. Creating heavy 808s and distorted tape cuts.',
    followers: '24.5K',
    following: '142',
    tracksCount: 14,
  });

  // Audio Context & HTML Audio ref
  const audioCtxRef = useRef(null);
  const synthTimerRef = useRef(null);
  const htmlAudioRef = useRef(new Audio());

  // Spectrum visualizer array
  const [visualizerData, setVisualizerData] = useState(new Array(24).fill(15));

  // Save tracks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('phonk_hub_tracks', JSON.stringify(tracks));
    } catch (e) {
      console.warn('Could not save tracks to localStorage:', e);
    }
  }, [tracks]);

  // Sync volume with HTML Audio
  useEffect(() => {
    if (htmlAudioRef.current) {
      htmlAudioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Handle HTML audio track ends
  useEffect(() => {
    const audio = htmlAudioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || currentTrack?.durationSec || 180);
    };

    const handleEnded = () => {
      playNext();
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack]);

  // Visualizer spectrum generator when playing
  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        setVisualizerData(
          Array.from({ length: 28 }, () => Math.floor(Math.random() * 85) + 15)
        );
        // Advance timer for synth playback
        if (!currentTrack?.audioUrl || currentTrack.audioUrl.startsWith('synth:')) {
          setCurrentTime((prev) => {
            if (prev >= duration) {
              playNext();
              return 0;
            }
            return prev + 0.25;
          });
        }
      }, 200);
    } else {
      setVisualizerData(new Array(28).fill(12));
    }
    return () => clearInterval(timer);
  }, [isPlaying, duration, currentTrack]);

  // Trigger procedural 808 & cowbell synthesizer
  const startSynthPlayback = (trackType) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (synthTimerRef.current) clearInterval(synthTimerRef.current);

      let step = 0;
      synthTimerRef.current = setInterval(() => {
        if (!isPlaying) return;
        const now = ctx.currentTime;
        const effectiveVol = isMuted ? 0 : volume;

        // 808 Bass Kick
        if (step % 4 === 0) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(trackType === 'brazilian' ? 120 : 95, now);
          osc.frequency.exponentialRampToValueAtTime(28, now + 0.32);

          gain.gain.setValueAtTime(0.45 * effectiveVol, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.35);
        }

        // Cowbell Synth Melody
        if (step % 2 === 1) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          const notes = trackType === 'memphis' ? [440, 523, 659, 392] : [587, 698, 880, 523, 784];
          const note = notes[step % notes.length];
          osc.frequency.setValueAtTime(note, now);

          gain.gain.setValueAtTime(0.25 * effectiveVol, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.22);
        }

        // Hi-Hat roll
        if (step % 1 === 0) {
          const bufferSize = ctx.sampleRate * 0.03;
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
          }
          const noise = ctx.createBufferSource();
          noise.buffer = buffer;

          const filter = ctx.createBiquadFilter();
          filter.type = 'highpass';
          filter.frequency.value = 7500;

          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.09 * effectiveVol, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

          noise.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);
          noise.start(now);
        }

        step = (step + 1) % 16;
      }, 125);
    } catch (e) {
      console.warn('Web Audio synth playback warning:', e);
    }
  };

  const stopSynthPlayback = () => {
    if (synthTimerRef.current) {
      clearInterval(synthTimerRef.current);
      synthTimerRef.current = null;
    }
  };

  // Trigger Sound Effect (808 Bass Drop / Cowbell Solo / Vinyl Scratch)
  const triggerSoundFX = (type = 'bassdrop') => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;
      const effectiveVol = isMuted ? 0 : volume;

      if (type === 'bassdrop') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(25, now + 0.8);

        gain.gain.setValueAtTime(0.6 * effectiveVol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.85);
      } else if (type === 'cowbell') {
        [587, 880, 1174].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, now + idx * 0.1);
          gain.gain.setValueAtTime(0.3 * effectiveVol, now + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.1);
          osc.stop(now + idx * 0.1 + 0.2);
        });
      }
    } catch (e) {
      console.warn('Sound FX error:', e);
    }
  };

  const playTrack = (track) => {
    if (currentTrack?.id === track.id) {
      if (isPlaying) {
        pauseTrack();
      } else {
        setIsPlaying(true);
        if (track.audioUrl && (track.audioUrl.startsWith('blob:') || track.audioUrl.startsWith('http') || track.audioUrl.startsWith('data:'))) {
          stopSynthPlayback();
          if (htmlAudioRef.current) {
            htmlAudioRef.current.src = track.audioUrl;
            htmlAudioRef.current.play().catch((e) => console.warn('HTML Audio play error:', e));
          }
        } else {
          startSynthPlayback(track.audioUrl?.split(':')[1] || 'drift');
        }
      }
    } else {
      setCurrentTrack(track);
      setCurrentTime(0);
      setDuration(track.durationSec || 180);
      setIsPlaying(true);
      if (track.audioUrl && (track.audioUrl.startsWith('blob:') || track.audioUrl.startsWith('http') || track.audioUrl.startsWith('data:'))) {
        stopSynthPlayback();
        if (htmlAudioRef.current) {
          htmlAudioRef.current.src = track.audioUrl;
          htmlAudioRef.current.play().catch((e) => console.warn('HTML Audio play error:', e));
        }
      } else {
        startSynthPlayback(track.audioUrl?.split(':')[1] || 'drift');
      }
    }
  };

  const pauseTrack = () => {
    setIsPlaying(false);
    stopSynthPlayback();
    if (htmlAudioRef.current) {
      htmlAudioRef.current.pause();
    }
  };

  const togglePlay = () => {
    if (!currentTrack) return;
    if (isPlaying) {
      pauseTrack();
    } else {
      playTrack(currentTrack);
    }
  };

  const playNext = () => {
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    playTrack(tracks[nextIndex]);
  };

  const playPrev = () => {
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length;
    playTrack(tracks[prevIndex]);
  };

  const toggleLike = (trackId, e) => {
    if (e) e.stopPropagation();
    setLikedTrackIds((prev) => {
      const next = new Set(prev);
      if (next.has(trackId)) {
        next.delete(trackId);
      } else {
        next.add(trackId);
      }
      return next;
    });

    setTracks((prev) =>
      prev.map((t) => {
        if (t.id === trackId) {
          const isLiked = likedTrackIds.has(trackId);
          return {
            ...t,
            likesCount: isLiked ? Math.max(0, t.likesCount - 1) : t.likesCount + 1,
          };
        }
        return t;
      })
    );
  };

  const uploadTrack = (newTrack) => {
    const createdTrack = {
      id: `track-${Date.now()}`,
      title: newTrack.title || 'UNTITLED PHONK BEAT',
      artist: newTrack.artist || user.name,
      album: newTrack.album || 'SINGLE',
      subgenre: newTrack.subgenre || 'Drift Phonk',
      duration: newTrack.duration || '2:30',
      durationSec: 150,
      plays: '1',
      likesCount: 0,
      bpm: newTrack.bpm || 150,
      rating: 5,
      cover: newTrack.cover || '/assets/phonkimg/drift.jpg',
      audioUrl: newTrack.audioUrl || 'synth:drift',
      mood: newTrack.mood || 'Aggressive',
      featured: false,
      description: newTrack.description || 'Uploaded by user on Phonk Hub.',
    };

    setTracks((prev) => [createdTrack, ...prev]);
    playTrack(createdTrack);
    setIsUploadModalOpen(false);
  };

  const seekTo = (seconds) => {
    setCurrentTime(seconds);
    if (htmlAudioRef.current && currentTrack?.audioUrl && (currentTrack.audioUrl.startsWith('blob:') || currentTrack.audioUrl.startsWith('http') || currentTrack.audioUrl.startsWith('data:'))) {
      htmlAudioRef.current.currentTime = seconds;
    }
  };

  return (
    <AudioContext.Provider
      value={{
        tracks,
        setTracks,
        currentTrack,
        isPlaying,
        playTrack,
        pauseTrack,
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
        subgenreFilter,
        setSubgenreFilter,
        searchQuery,
        setSearchQuery,
        isUploadModalOpen,
        setIsUploadModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        user,
        setUser,
        uploadTrack,
        visualizerData,
        triggerSoundFX,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
