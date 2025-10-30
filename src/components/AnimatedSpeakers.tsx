import React, { useRef, useEffect, useState } from 'react';
import { useAudio } from '@/contexts/AudioContext';

interface AnimatedSpeakersProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  type?: 'left' | 'right'; // left = bass+treble, right = treble+bass
}

const AnimatedSpeakers: React.FC<AnimatedSpeakersProps> = ({ 
  className = '',
  size = 'md',
  type = 'left'
}) => {
  const { state, audioContext, analyser, audioRef } = useAudio();
  const [audioLevels, setAudioLevels] = useState<number[]>([0, 0]);
  const [isInitialized, setIsInitialized] = useState(false);
  const animationFrameRef = useRef<number>();
  const dataArrayRef = useRef<Uint8Array>();

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24', 
    lg: 'w-32 h-32'
  };

  // Initialize audio analysis
  useEffect(() => {
    if (!state.currentTrack || !audioRef.current || !audioContext || !analyser || isInitialized) return;

    try {
      const source = audioContext.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(audioContext.destination);
      
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const buffer = new ArrayBuffer(bufferLength);
      dataArrayRef.current = new Uint8Array(buffer);
      
      setIsInitialized(true);
      console.log('Speaker animation audio analysis initialized');
    } catch (error) {
      console.log('Audio analysis setup skipped (likely already connected):', error);
      // Set up with existing analyser
      if (analyser.fftSize === 0) {
        analyser.fftSize = 256;
      }
      const bufferLength = analyser.frequencyBinCount;
      const buffer = new ArrayBuffer(bufferLength);
      dataArrayRef.current = new Uint8Array(buffer);
      setIsInitialized(true);
    }
  }, [state.currentTrack, audioContext, analyser, audioRef, isInitialized]);

  // Animation loop
  useEffect(() => {
    if (!isInitialized || !analyser || !dataArrayRef.current || !state.isPlaying) {
      setAudioLevels([0, 0]);
      return;
    }

    const animate = () => {
      if (!dataArrayRef.current) return;

      // @ts-ignore - TypeScript type mismatch with AnalyserNode.getByteFrequencyData
      analyser.getByteFrequencyData(dataArrayRef.current);
      
      // Get bass and treble frequencies for different speaker responses
      const bassRange = Array.from(dataArrayRef.current.slice(0, 20));
      const trebleRange = Array.from(dataArrayRef.current.slice(15, 80)); // Wider range for more sensitivity
      
      // Calculate average levels
      const bassLevel = bassRange.reduce((sum, value) => sum + value, 0) / bassRange.length / 255;
      const trebleLevel = (trebleRange.reduce((sum, value) => sum + value, 0) / trebleRange.length / 255) * 1.4; // Boost treble sensitivity
      
      setAudioLevels([bassLevel, trebleLevel]);
      
      if (state.isPlaying) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isInitialized, analyser, state.isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const getSpeakerAnimation = (level: number, delay: number = 0) => {
    const intensity = Math.max(0.1, level * 2); // Minimum movement + audio response
    return {
      transform: `scale(${0.8 + intensity * 0.4})`,
      transition: `transform 0.1s ease-out`,
      transitionDelay: `${delay}ms`
    };
  };

  const getBassGlowIntensity = (level: number) => {
    const glowAmount = level * 15; // Reduced glow for bass
    return {
      boxShadow: `0 0 ${8 + glowAmount}px hsl(var(--primary) / ${0.2 + level * 0.4})` // Much more subtle
    };
  };

  const getSoundWaveStyle = (level: number, index: number) => {
    const scale = 1 + (level * 2) + (index * 0.3);
    const opacity = Math.max(0, level - (index * 0.2));
    return {
      transform: `scale(${scale})`,
      opacity: opacity,
      animationDelay: `${index * 100}ms`
    };
  };

  // Render bass speaker
  const renderBassLoudspeaker = (delay: number = 0, glowMultiplier: number = 1) => (
    <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
      <div 
        className="w-full h-full rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg relative overflow-hidden"
        style={{
          ...getSpeakerAnimation(audioLevels[0] * glowMultiplier, delay),
          ...getBassGlowIntensity(audioLevels[0] * glowMultiplier)
        }}
      >
        {/* Speaker Cone */}
        <div 
          className="w-3/4 h-3/4 rounded-full bg-gradient-to-br from-muted-foreground/80 to-muted-foreground/40 flex items-center justify-center relative"
          style={getSpeakerAnimation(audioLevels[0] * 1.2 * glowMultiplier, delay + 20)}
        >
          {/* Inner Cone */}
          <div 
            className="w-1/2 h-1/2 rounded-full bg-gradient-to-br from-background/60 to-background/20 border border-muted-foreground/30"
            style={getSpeakerAnimation(audioLevels[0] * 1.5 * glowMultiplier, delay + 40)}
          />
          
          {/* Center Dust Cap */}
          <div 
            className="absolute w-1/4 h-1/4 rounded-full bg-muted-foreground/60 border border-muted-foreground/50"
            style={getSpeakerAnimation(audioLevels[0] * 2 * glowMultiplier, delay + 60)}
          />
        </div>
        
        {/* Audio Rings */}
        {state.isPlaying && audioLevels[0] > 0.1 && (
          <>
            <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" style={{ animationDelay: `${delay}ms` }} />
            <div className="absolute inset-2 rounded-full border border-primary/20 animate-pulse" style={{ animationDelay: `${delay + 50}ms` }} />
          </>
        )}
      </div>
    </div>
  );

  // Render treble speaker
  const renderTrebleVoltage = (delay: number = 0, glowMultiplier: number = 1, waveKey: string = 'wave') => (
    <div className={`${sizeClasses[size]} relative flex items-center justify-center`}>
      {/* Sound Wave Circles */}
      {state.isPlaying && audioLevels[1] > 0.1 && (
        <>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={`${waveKey}-${i}`}
              className="absolute inset-0 rounded-full border-2 border-white/60 animate-ping pointer-events-none"
              style={{
                ...getSoundWaveStyle(audioLevels[1] * glowMultiplier, i),
                animationDuration: `${1.5 + i * 0.3}s`,
                animationDelay: `${delay + i * 50}ms`
              }}
            />
          ))}
        </>
      )}
      
      <div 
        className="w-full h-full rounded-full bg-gradient-to-br from-secondary to-secondary/60 flex items-center justify-center shadow-lg relative overflow-visible z-10"
        style={getSpeakerAnimation(audioLevels[1] * glowMultiplier, delay)}
      >
        {/* Speaker Cone */}
        <div 
          className="w-3/4 h-3/4 rounded-full bg-gradient-to-br from-muted-foreground/80 to-muted-foreground/40 flex items-center justify-center relative"
          style={getSpeakerAnimation(audioLevels[1] * 1.8 * glowMultiplier, delay + 20)}
        >
          {/* Inner Cone */}
          <div 
            className="w-1/2 h-1/2 rounded-full bg-gradient-to-br from-background/60 to-background/20 border border-muted-foreground/30"
            style={getSpeakerAnimation(audioLevels[1] * 2.2 * glowMultiplier, delay + 40)}
          />
          
          {/* Center Dust Cap */}
          <div 
            className="absolute w-1/4 h-1/4 rounded-full bg-muted-foreground/60 border border-muted-foreground/50"
            style={getSpeakerAnimation(audioLevels[1] * 2.8 * glowMultiplier, delay + 60)}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {type === 'left' ? (
        <>
          {renderBassLoudspeaker(0, 1)}
          {renderTrebleVoltage(30, 0.9, 'left-treble')}
        </>
      ) : (
        <>
          {renderTrebleVoltage(0, 1, 'right-treble')}
          {renderBassLoudspeaker(30, 0.9)}
        </>
      )}
    </div>
  );
};

export default AnimatedSpeakers;