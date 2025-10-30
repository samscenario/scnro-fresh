import { useEffect, useRef } from 'react';
import { useAudio } from '@/contexts/AudioContext';

interface VUMeterProps {
  width?: number;
  height?: number;
  className?: string;
}

const VUMeter: React.FC<VUMeterProps> = ({ 
  width = 300, 
  height = 150, 
  className = "" 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const { state, audioRef, audioContext } = useAudio();

  useEffect(() => {
    const canvas = canvasRef.current;
    const audio = audioRef.current;
    
    if (!canvas || !audio) {
      console.log('Canvas or audio not available');
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let analyser: AnalyserNode | null = null;
    let source: MediaElementAudioSourceNode | null = null;
    let audioCtx: AudioContext | null = null;

    const initAudioAnalysis = async () => {
      try {
        // Create new audio context if needed
        if (!audioContext) {
          audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        } else {
          audioCtx = audioContext;
        }

        // Resume context if suspended
        if (audioCtx.state === 'suspended') {
          await audioCtx.resume();
        }

        // Create analyser
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;

        // Create source and connect (only if not already connected)
        if (!audio.dataset.vuConnected) {
          source = audioCtx.createMediaElementSource(audio);
          source.connect(analyser);
          analyser.connect(audioCtx.destination);
          audio.dataset.vuConnected = 'true';
        }

        console.log('VU Meter audio analysis initialized');
      } catch (error) {
        console.error('Error initializing audio analysis:', error);
      }
    };

    const drawNeedle = (level: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height * 0.9;
      const radius = Math.min(canvas.width, canvas.height) * 0.4;

      // Draw meter arc (background)
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, Math.PI, 2 * Math.PI);
      ctx.strokeStyle = '#444';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Draw colored sections of the arc
      const sections = [
        { start: 0, end: 0.6, color: '#10b981' }, // green
        { start: 0.6, end: 0.8, color: '#fbbf24' }, // yellow
        { start: 0.8, end: 1, color: '#ef4444' } // red
      ];

      sections.forEach(section => {
        const startAngle = Math.PI + (Math.PI * section.start);
        const endAngle = Math.PI + (Math.PI * section.end);
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, endAngle);
        ctx.strokeStyle = section.color;
        ctx.lineWidth = 3;
        ctx.stroke();
      });

      // Map audio level to angle
      const minAngle = Math.PI;
      const maxAngle = 2 * Math.PI;
      const angle = minAngle + (maxAngle - minAngle) * Math.min(1, level);

      // Draw needle
      const needleLength = radius - 10;
      const needleX = centerX + needleLength * Math.cos(angle);
      const needleY = centerY + needleLength * Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(needleX, needleY);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw center dot
      ctx.beginPath();
      ctx.arc(centerX, centerY, 5, 0, 2 * Math.PI);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      // Draw labels
      ctx.fillStyle = '#888';
      ctx.font = '12px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('0', centerX - radius + 15, centerY + 25);
      ctx.fillText('100', centerX + radius - 15, centerY + 25);
      
      // Draw level percentage
      ctx.fillStyle = '#fff';
      ctx.font = '14px system-ui';
      ctx.fillText(`${Math.round(level * 100)}%`, centerX, centerY - radius - 10);
    };

    const animate = () => {
      if (!analyser) {
        drawNeedle(0);
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      analyser.getByteFrequencyData(dataArray);
      
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
      }
      
      const average = sum / bufferLength;
      const level = Math.min(1, average / 128); // normalize 0–1
      
      drawNeedle(level);
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Initialize when there's a current track
    if (state.currentTrack) {
      initAudioAnalysis();
    }

    // Start animation
    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state.currentTrack, audioRef, audioContext]);

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={`bg-gray-900 rounded-lg border border-gray-700 ${className}`}
        style={{ display: 'block' }}
      />
      <p className="text-xs text-muted-foreground mt-2">VU Meter</p>
    </div>
  );
};

export default VUMeter;