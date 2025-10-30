import React, { createContext, useContext, useReducer, useRef, useEffect, ReactNode } from 'react';

interface Track {
  id: string;
  title: string;
  artist: string;
  genre?: string;
  description?: string;
  audio_url: string;
  cover_image_url?: string;
  duration: number;
  content_type: 'sound' | 'interview';
  created_at: string;
}

interface AudioState {
  currentTrack: Track | null;
  playlist: Track[];
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  shuffleMode: boolean;
  repeatMode: 'off' | 'all' | 'one';
  currentIndex: number;
}

type AudioAction =
  | { type: 'SET_TRACK'; payload: Track }
  | { type: 'SET_PLAYLIST'; payload: Track[] }
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'STOP' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_TIME'; payload: number }
  | { type: 'SET_DURATION'; payload: number }
  | { type: 'SET_VOLUME'; payload: number }
  | { type: 'TOGGLE_MUTE' }
  | { type: 'TOGGLE_SHUFFLE' }
  | { type: 'SET_REPEAT'; payload: 'off' | 'all' | 'one' }
  | { type: 'NEXT_TRACK' }
  | { type: 'PREVIOUS_TRACK' }
  | { type: 'SET_INDEX'; payload: number };

const initialState: AudioState = {
  currentTrack: null,
  playlist: [],
  isPlaying: false,
  isPaused: false,
  isLoading: false,
  currentTime: 0,
  duration: 0,
  volume: 0.7,
  isMuted: false,
  shuffleMode: false,
  repeatMode: 'off',
  currentIndex: -1,
};

function audioReducer(state: AudioState, action: AudioAction): AudioState {
  switch (action.type) {
    case 'SET_TRACK':
      return {
        ...state,
        currentTrack: action.payload,
        currentTime: 0,
        isLoading: true,
      };
    
    case 'SET_PLAYLIST':
      return {
        ...state,
        playlist: action.payload,
      };
    
    case 'PLAY':
      return {
        ...state,
        isPlaying: true,
        isPaused: false,
        isLoading: false,
      };
    
    case 'PAUSE':
      return {
        ...state,
        isPlaying: false,
        isPaused: true,
      };
    
    case 'STOP':
      return {
        ...state,
        isPlaying: false,
        isPaused: false,
        currentTime: 0,
        currentTrack: null, // Clear current track on stop
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    
    case 'SET_TIME':
      return {
        ...state,
        currentTime: action.payload,
      };
    
    case 'SET_DURATION':
      return {
        ...state,
        duration: action.payload,
      };
    
    case 'SET_VOLUME':
      return {
        ...state,
        volume: Math.max(0, Math.min(1, action.payload)),
        isMuted: action.payload === 0,
      };
    
    case 'TOGGLE_MUTE':
      return {
        ...state,
        isMuted: !state.isMuted,
      };
    
    case 'TOGGLE_SHUFFLE':
      return {
        ...state,
        shuffleMode: !state.shuffleMode,
      };
    
    case 'SET_REPEAT':
      return {
        ...state,
        repeatMode: action.payload,
      };
    
    case 'SET_INDEX':
      return {
        ...state,
        currentIndex: action.payload,
      };
    
    case 'NEXT_TRACK':
      if (state.playlist.length === 0) return state;
      
      let nextIndex = state.currentIndex + 1;
      
      if (state.shuffleMode) {
        // Generate random index excluding current
        const availableIndices = state.playlist
          .map((_, i) => i)
          .filter(i => i !== state.currentIndex);
        if (availableIndices.length > 0) {
          nextIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        } else {
          nextIndex = state.currentIndex; // Stay on current if no other tracks
        }
      } else if (nextIndex >= state.playlist.length) {
        if (state.repeatMode === 'all') {
          nextIndex = 0; // Loop back to beginning
        } else {
          nextIndex = state.currentIndex; // Stay on last track if no repeat
        }
      }
      
      return {
        ...state,
        currentIndex: nextIndex,
        currentTrack: state.playlist[nextIndex] || state.currentTrack,
        currentTime: 0,
        isLoading: true,
      };
    
    case 'PREVIOUS_TRACK':
      if (state.playlist.length === 0) return state;
      
      let prevIndex = state.currentIndex - 1;
      
      if (prevIndex < 0) {
        prevIndex = state.repeatMode === 'all' ? state.playlist.length - 1 : 0;
      }
      
      return {
        ...state,
        currentIndex: prevIndex,
        currentTrack: state.playlist[prevIndex] || state.currentTrack,
        currentTime: 0,
        isLoading: true,
      };
    
    default:
      return state;
  }
}

interface AudioContextType {
  state: AudioState;
  audioRef: React.RefObject<HTMLAudioElement>;
  audioContext: AudioContext | null;
  analyser: AnalyserNode | null;
  
  // Playback controls
  playTrack: (track: Track, playlist?: Track[]) => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  togglePlayPause: () => void;
  
  // Navigation
  nextTrack: () => void;
  previousTrack: () => void;
  seekTo: (time: number) => void;
  
  // Volume controls
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  
  // Playlist controls
  setPlaylist: (tracks: Track[]) => void;
  addToPlaylist: (track: Track) => void;
  removeFromPlaylist: (trackId: string) => void;
  
  // Mode controls
  toggleShuffle: () => void;
  setRepeatMode: (mode: 'off' | 'all' | 'one') => void;
  
  // Utility
  formatTime: (seconds: number) => string;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(audioReducer, initialState);
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const wasPlayingRef = useRef<boolean>(false);
  
  // Monitor all audio elements on the page for state sync
  useEffect(() => {
    const checkAudioState = () => {
      const allAudio = document.querySelectorAll('audio');
      let hasPlayingAudio = false;
      
      allAudio.forEach(audio => {
        if (!audio.paused && !audio.ended) {
          hasPlayingAudio = true;
        }
      });
      
      // Update state if our tracked audio is playing but state doesn't reflect it
      if (audioRef.current && !audioRef.current.paused && !state.isPlaying) {
        dispatch({ type: 'PLAY' });
      } else if (audioRef.current && audioRef.current.paused && state.isPlaying) {
        dispatch({ type: 'PAUSE' });
      }
    };
    
    const interval = setInterval(checkAudioState, 100);
    return () => clearInterval(interval);
  }, [state.isPlaying]);

  // Initialize Web Audio API
  useEffect(() => {
    const initAudioContext = async () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        analyserRef.current.smoothingTimeConstant = 0.8;
      }
    };

    initAudioContext();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Connect audio element to Web Audio API when track changes
  useEffect(() => {
    if (audioRef.current && audioContextRef.current && analyserRef.current && state.currentTrack) {
      try {
        // Only create source if it doesn't exist yet
        if (!sourceRef.current) {
          sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
          sourceRef.current.connect(analyserRef.current);
          analyserRef.current.connect(audioContextRef.current.destination);
          console.log('Audio context connected successfully');
        }
      } catch (error) {
        console.log('Audio analysis setup skipped (likely already connected):', error);
        // If we get the "already connected" error, it means the connection exists, so we're good
      }
    }
  }, [state.currentTrack]);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadStart = () => dispatch({ type: 'SET_LOADING', payload: true });
    const handleCanPlay = () => dispatch({ type: 'SET_LOADING', payload: false });
    const handleLoadedMetadata = () => {
      dispatch({ type: 'SET_DURATION', payload: audio.duration });
    };
    
    const handleTimeUpdate = () => {
      dispatch({ type: 'SET_TIME', payload: audio.currentTime });
    };
    
    const handleEnded = () => {
      console.log('Track ended, repeat mode:', state.repeatMode, 'current index:', state.currentIndex, 'playlist length:', state.playlist.length);
      
      if (state.repeatMode === 'one') {
        // Repeat current track - directly control audio
        audio.currentTime = 0;
        audio.play().catch(console.error);
        console.log('Repeating current track');
      } else if (state.repeatMode === 'all' || state.currentIndex < state.playlist.length - 1) {
        // Auto-advance to next track - just dispatch, let the effect handle playback
        console.log('Moving to next track via auto-advance');
        dispatch({ type: 'NEXT_TRACK' });
      } else {
        // Playlist ended, stop playing
        console.log('Playlist ended, stopping');
        dispatch({ type: 'STOP' });
      }
    };

    const handlePlay = () => dispatch({ type: 'PLAY' });
    const handlePause = () => dispatch({ type: 'PAUSE' });

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [state.repeatMode, state.currentIndex, state.playlist.length]);

  // Control methods
  const playTrack = (track: Track, playlist?: Track[]) => {
    console.log('🎵 PlayTrack called for:', track.title);
    
    // EMERGENCY: Stop ALL audio elements on the page first
    const allAudio = document.querySelectorAll('audio');
    console.log(`🛑 Stopping ${allAudio.length} audio elements before starting new track`);
    allAudio.forEach((audio, index) => {
      console.log(`Stopping audio element ${index}:`, audio.src);
      audio.pause();
      audio.currentTime = 0;
    });
    
    if (playlist) {
      dispatch({ type: 'SET_PLAYLIST', payload: playlist });
      const index = playlist.findIndex(t => t.id === track.id);
      dispatch({ type: 'SET_INDEX', payload: index });
    }
    dispatch({ type: 'SET_TRACK', payload: track });
    
    // IMPORTANT: Don't auto-play, let user decide
    wasPlayingRef.current = false;
    dispatch({ type: 'PAUSE' }); // Ensure state shows paused
    console.log('✅ Track set, waiting for user to press play');
  };

  const play = async () => {
    // EMERGENCY: Stop ALL audio elements on the page first
    const allAudio = document.querySelectorAll('audio');
    allAudio.forEach(audio => {
      if (audio !== audioRef.current) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    
    if (audioRef.current && state.currentTrack) {
      try {
        // Resume audio context if suspended
        if (audioContextRef.current?.state === 'suspended') {
          await audioContextRef.current.resume();
        }
        
        // Ensure audio is loaded
        if (audioRef.current.readyState < 2) {
          audioRef.current.load();
        }
        
        await audioRef.current.play();
        console.log('Audio playing successfully');
      } catch (error) {
        console.error('Error playing audio:', error);
      }
    }
  };

  // Auto-play when track loads and was previously playing
  useEffect(() => {
    if (state.currentTrack && !state.isLoading && wasPlayingRef.current && !state.isPlaying) {
      const timer = setTimeout(() => {
        play();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [state.currentTrack, state.isLoading, state.isPlaying]);

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    wasPlayingRef.current = false;
  };

  const stop = () => {
    console.log('🛑 STOP function called');
    
    // Stop ALL audio elements on the page
    const allAudio = document.querySelectorAll('audio');
    console.log(`Found ${allAudio.length} audio elements to stop`);
    allAudio.forEach((audio, index) => {
      console.log(`Stopping audio element ${index}:`, audio.src);
      audio.pause();
      audio.currentTime = 0;
      audio.src = ''; // Clear the source
      audio.load(); // Force reload
    });
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
      audioRef.current.load();
    }
    
    dispatch({ type: 'STOP' });
    wasPlayingRef.current = false;
    console.log('✅ STOP complete - all audio should be silent');
  };

  const togglePlayPause = () => {
    if (state.isPlaying) {
      pause();
      wasPlayingRef.current = false;
    } else {
      play();
      wasPlayingRef.current = true;
    }
  };

  const nextTrack = () => {
    console.log('Next track called, current playing:', state.isPlaying);
    dispatch({ type: 'NEXT_TRACK' });
    // Don't auto-play here - let the useEffect handle it to avoid conflicts
  };

  const previousTrack = () => {
    dispatch({ type: 'PREVIOUS_TRACK' });
    // Don't auto-play here - let the useEffect handle it to avoid conflicts
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const setVolume = (volume: number) => {
    console.log('Setting volume to:', volume);
    dispatch({ type: 'SET_VOLUME', payload: volume });
    if (audioRef.current) {
      audioRef.current.volume = volume;
      console.log('Audio element volume set to:', audioRef.current.volume);
    }
  };

  const toggleMute = () => {
    dispatch({ type: 'TOGGLE_MUTE' });
    if (audioRef.current) {
      audioRef.current.muted = !state.isMuted;
      console.log('Audio element muted:', audioRef.current.muted);
    }
  };

  const setPlaylist = (tracks: Track[]) => {
    dispatch({ type: 'SET_PLAYLIST', payload: tracks });
  };

  const addToPlaylist = (track: Track) => {
    dispatch({ type: 'SET_PLAYLIST', payload: [...state.playlist, track] });
  };

  const removeFromPlaylist = (trackId: string) => {
    const newPlaylist = state.playlist.filter(track => track.id !== trackId);
    dispatch({ type: 'SET_PLAYLIST', payload: newPlaylist });
  };

  const toggleShuffle = () => {
    dispatch({ type: 'TOGGLE_SHUFFLE' });
  };

  const setRepeatMode = (mode: 'off' | 'all' | 'one') => {
    dispatch({ type: 'SET_REPEAT', payload: mode });
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const value: AudioContextType = {
    state,
    audioRef,
    audioContext: audioContextRef.current,
    analyser: analyserRef.current,
    
    playTrack,
    play,
    pause,
    stop,
    togglePlayPause,
    
    nextTrack,
    previousTrack,
    seekTo,
    
    setVolume,
    toggleMute,
    
    setPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    
    toggleShuffle,
    setRepeatMode,
    
    formatTime,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        src={state.currentTrack?.audio_url}
        preload="metadata"
        crossOrigin="anonymous"
      />
    </AudioContext.Provider>
  );
};

export default AudioProvider;