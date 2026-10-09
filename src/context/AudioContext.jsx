import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { fetchTracks, uploadTrackApi, updateTrackApi, deleteTrackApi, toggleLikeApi, uploadAvatarApi } from '../services/api';
import { uploadProfileImageToSupabaseClient } from '../services/supabase';

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
  const [tracks, setTracks] = useState(() => {
    try {
      const saved = localStorage.getItem('phonk_hub_tracks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Could not read saved tracks:', e);
    }
    return [];
  });

  const [currentTrack, setCurrentTrack] = useState(tracks[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(currentTrack?.durationSec || 165);
  const [likedTrackIds, setLikedTrackIds] = useState(new Set());
  const [subgenreFilter, setSubgenreFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signin');
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('phonk_hub_user');
      if (savedUser) return JSON.parse(savedUser);
    } catch (e) {
      console.warn('Could not parse user from localStorage:', e);
    }
    return null;
  });

  // Save user changes to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('phonk_hub_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('phonk_hub_user');
    }
  }, [user]);

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('phonk_hub_token');
    localStorage.removeItem('phonk_hub_user');
  };

  // Audio Context & HTML Audio ref
  const audioCtxRef = useRef(null);
  const synthTimerRef = useRef(null);
  const htmlAudioRef = useRef(new Audio());

  // Spectrum visualizer array
  const [visualizerData, setVisualizerData] = useState(new Array(24).fill(15));

  const [token, setToken] = useState(() => localStorage.getItem('phonk_hub_token') || null);

  // Sync tracks with backend API on mount / filter change
  useEffect(() => {
    let isMounted = true;
    async function loadApiTracks() {
      const apiTracks = await fetchTracks(subgenreFilter, searchQuery);
      if (isMounted && apiTracks && Array.isArray(apiTracks) && apiTracks.length > 0) {
        setTracks(apiTracks);
      }
    }
    loadApiTracks();
    return () => { isMounted = false; };
  }, [subgenreFilter, searchQuery]);

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

  const toggleLike = async (trackId, e) => {
    if (e) e.stopPropagation();
    const isLikedCurrently = likedTrackIds.has(trackId);

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
          return {
            ...t,
            likesCount: isLikedCurrently ? Math.max(0, (t.likesCount || 0) - 1) : (t.likesCount || 0) + 1,
          };
        }
        return t;
      })
    );

    // Sync with backend API
    await toggleLikeApi(trackId, token);
  };

  const uploadTrack = async (newTrack, audioFile, coverFile) => {
    try {
      // Try backend upload if audio file is provided
      if (audioFile || coverFile) {
        const formData = new FormData();
        formData.append('title', newTrack.title);
        formData.append('artist', newTrack.artist || user.name);
        formData.append('subgenre', newTrack.subgenre);
        formData.append('mood', newTrack.mood);
        formData.append('bpm', newTrack.bpm);
        formData.append('description', newTrack.description || '');
        if (newTrack.cover) formData.append('customCoverUrl', newTrack.cover);
        if (audioFile) formData.append('audio', audioFile);
        if (coverFile) formData.append('cover', coverFile);

        const res = await uploadTrackApi(formData, token);
        if (res && res.track) {
          setTracks((prev) => [res.track, ...prev]);
          playTrack(res.track);
          setIsUploadModalOpen(false);
          return res.track;
        }
      }
    } catch (err) {
      console.warn('Backend upload failed, falling back to local track state:', err);
    }

    // Local fallback creation
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
    return createdTrack;
  };

  const seekTo = (seconds) => {
    setCurrentTime(seconds);
    if (htmlAudioRef.current && currentTrack?.audioUrl && (currentTrack.audioUrl.startsWith('blob:') || currentTrack.audioUrl.startsWith('http') || currentTrack.audioUrl.startsWith('data:'))) {
      htmlAudioRef.current.currentTime = seconds;
    }
  };

  const editTrack = async (trackId, updatedTrackData, audioFile, coverFile) => {
    try {
      const formData = new FormData();
      if (updatedTrackData.title) formData.append('title', updatedTrackData.title);
      if (updatedTrackData.artist) formData.append('artist', updatedTrackData.artist);
      if (updatedTrackData.subgenre) formData.append('subgenre', updatedTrackData.subgenre);
      if (updatedTrackData.mood) formData.append('mood', updatedTrackData.mood);
      if (updatedTrackData.bpm) formData.append('bpm', updatedTrackData.bpm);
      if (updatedTrackData.description) formData.append('description', updatedTrackData.description);
      if (updatedTrackData.cover) formData.append('customCoverUrl', updatedTrackData.cover);
      if (audioFile) formData.append('audio', audioFile);
      if (coverFile) formData.append('cover', coverFile);

      const res = await updateTrackApi(trackId, formData, token);
      if (res && res.track) {
        setTracks((prev) =>
          prev.map((t) => (t.id === trackId ? { ...t, ...res.track } : t))
        );
        if (currentTrack?.id === trackId) {
          setCurrentTrack((prev) => ({ ...prev, ...res.track }));
        }
        return res.track;
      }
    } catch (err) {
      console.warn('Backend editTrack failed, applying local edit state:', err);
    }

    setTracks((prev) =>
      prev.map((t) => {
        if (t.id === trackId) {
          const localUpdated = {
            ...t,
            title: updatedTrackData.title || t.title,
            artist: updatedTrackData.artist || t.artist,
            subgenre: updatedTrackData.subgenre || t.subgenre,
            mood: updatedTrackData.mood || t.mood,
            bpm: updatedTrackData.bpm || t.bpm,
            description: updatedTrackData.description || t.description,
            cover: updatedTrackData.cover || t.cover,
            audioUrl: updatedTrackData.audioUrl || t.audioUrl,
          };
          if (currentTrack?.id === trackId) {
            setCurrentTrack(localUpdated);
          }
          return localUpdated;
        }
        return t;
      })
    );
  };

  const deleteTrack = async (trackId) => {
    try {
      await deleteTrackApi(trackId, token);
    } catch (err) {
      console.warn('Backend deleteTrack failed, removing locally:', err);
    }

    setTracks((prev) => prev.filter((t) => t.id !== trackId));
    if (currentTrack?.id === trackId) {
      pauseTrack();
      setCurrentTrack(null);
    }
  };

  const updateUserAvatar = async (avatarFile) => {
    try {
      const res = await uploadAvatarApi(avatarFile, token);
      if (res && res.user) {
        setUser(res.user);
        return res.user.avatar;
      }
    } catch (err) {
      console.warn('Backend avatar upload failed, falling back to client Supabase upload:', err);
      try {
        const publicUrl = await uploadProfileImageToSupabaseClient(avatarFile);
        if (publicUrl) {
          const updatedUser = { ...user, avatar: publicUrl };
          setUser(updatedUser);
          return publicUrl;
        }
      } catch (supaErr) {
        console.error('Client Supabase avatar upload error:', supaErr);
        throw supaErr;
      }
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
        token,
        setToken,
        logoutUser,
        uploadTrack,
        editTrack,
        deleteTrack,
        updateUserAvatar,
        visualizerData,
        triggerSoundFX,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => useContext(AudioContext);
