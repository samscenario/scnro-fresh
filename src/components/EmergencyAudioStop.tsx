import { useEffect } from 'react';
import { audioManager } from './GlobalAudioManager';

// Emergency component to stop all audio immediately - DISABLED FOR NOW
const EmergencyAudioStop = () => {
  useEffect(() => {
    // One-time stop on mount only
    console.log('🚨 FINAL AUDIO STOP 🚨');
    audioManager.stopAll();
    
    // Kill ALL audio elements one final time
    const allAudio = document.querySelectorAll('audio, video');
    allAudio.forEach((element) => {
      try {
        const audioElement = element as HTMLAudioElement | HTMLVideoElement;
        audioElement.pause();
        audioElement.currentTime = 0;
        audioElement.src = '';
        audioElement.load();
      } catch (e) {
        console.log('Error stopping element:', e);
      }
    });
    
    console.log('🛑 FINAL STOP COMPLETE - Component will now be silent');
  }, []);

  return null; // Component renders nothing and does nothing after initial stop
};

export default EmergencyAudioStop;