import { useEffect } from 'react';

// Global audio manager to ensure only one audio plays at a time
class AudioManager {
  private static instance: AudioManager;
  private currentAudio: HTMLAudioElement | null = null;
  private listeners: Set<() => void> = new Set();

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  setCurrentAudio(audio: HTMLAudioElement | null) {
    // Stop previous audio
    if (this.currentAudio && this.currentAudio !== audio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }
    
    this.currentAudio = audio;
    this.notifyListeners();
  }

  getCurrentAudio(): HTMLAudioElement | null {
    return this.currentAudio;
  }

  stopAll() {
    // Stop all audio elements on the page AGGRESSIVELY
    const allAudio = document.querySelectorAll('audio');
    allAudio.forEach(audio => {
      try {
        audio.pause();
        audio.currentTime = 0;
        audio.src = '';
        audio.load(); // Force reload to clear buffer
        audio.remove(); // Remove from DOM if possible
      } catch (e) {
        console.log('Error stopping audio:', e);
      }
    });
    
    // Stop all video elements too
    const allVideo = document.querySelectorAll('video');
    allVideo.forEach(video => {
      try {
        video.pause();
        video.currentTime = 0;
        video.src = '';
        video.load();
      } catch (e) {
        console.log('Error stopping video:', e);
      }
    });
    
    this.currentAudio = null;
    this.notifyListeners();
    
    console.log('EMERGENCY STOP: All audio/video stopped!');
  }

  addListener(callback: () => void) {
    this.listeners.add(callback);
  }

  removeListener(callback: () => void) {
    this.listeners.delete(callback);
  }

  private notifyListeners() {
    this.listeners.forEach(callback => callback());
  }
}

export const audioManager = AudioManager.getInstance();

// React hook to use the audio manager
export const useGlobalAudio = () => {
  useEffect(() => {
    const handleBeforeUnload = () => {
      audioManager.stopAll();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return audioManager;
};

export default AudioManager;