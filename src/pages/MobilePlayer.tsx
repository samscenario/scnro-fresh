import { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, MoreVertical, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { audioManager } from "@/components/GlobalAudioManager";

interface Track {
  id: string;
  title: string;
  artist: string;
  audio_url: string;
  duration: number;
  cover_image?: string;
}

const MobilePlayer = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([70]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetchTracks();
    
    // Stop all audio when component mounts
    audioManager.stopAll();
    
    // Set up real-time listener for track changes
    const tracksSubscription = supabase
      .channel('mobile_tracks_changes')
      .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'tracks' }, 
          (payload) => {
            console.log('Mobile player: Track database change detected:', payload);
            // Refresh tracks immediately when any change occurs
            fetchTracks();
          }
      )
      .subscribe();
    
    return () => {
      // Stop all audio when component unmounts
      audioManager.stopAll();
      tracksSubscription.unsubscribe();
    };
  }, []);

  const fetchTracks = async () => {
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .eq('content_type', 'sound');
    
    if (data && !error) {
      // Check if current track still exists in the new data
      if (currentTrack && !data.find(track => track.id === currentTrack.id)) {
        console.log('Mobile player: Current track was deleted, stopping playback');
        // Current track was deleted, stop all audio immediately
        audioManager.stopAll();
        setCurrentTrack(null);
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
      }
      
      setTracks(data);
      
      // Set first track as current if no current track and tracks available
      if (!currentTrack && data.length > 0) {
        setCurrentTrack(data[0]);
      }
    } else {
      // Stop audio on fetch error
      audioManager.stopAll();
      setCurrentTrack(null);
      setIsPlaying(false);
      setTracks([]);
    }
  };

  const togglePlay = async () => {
    // EMERGENCY STOP ALL AUDIO IMMEDIATELY
    audioManager.stopAll();
    setIsPlaying(false);
    console.log('MOBILE PLAYER: Audio disabled - no playback allowed');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = (value[0] / 100) * duration;
    }
  };

  // Effect to handle track changes and audio setup
  useEffect(() => {
    if (!currentTrack || !audioRef.current) return;
    
    const audio = audioRef.current;
    
    // Reset audio element
    audio.currentTime = 0;
    audio.volume = volume[0] / 100;
    
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audioManager.setCurrentAudio(null);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, volume]);

  if (!currentTrack) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white pb-20">
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-12">
        <Button variant="ghost" size="icon" className="text-white">
          <ChevronDown className="h-6 w-6" />
        </Button>
        <div className="text-center">
          <p className="text-xs text-zinc-400 uppercase tracking-widest">Playing from</p>
          <p className="text-sm font-medium">SCNRO Scenario</p>
        </div>
        <Button variant="ghost" size="icon" className="text-white">
          <MoreVertical className="h-6 w-6" />
        </Button>
      </div>

      {/* Album Art */}
      <div className="px-8 py-8">
        <div className="aspect-square mx-auto max-w-xs rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-2xl overflow-hidden">
          {currentTrack.cover_image ? (
            <img 
              src={currentTrack.cover_image} 
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-6xl font-bold text-zinc-600">SCNRO</div>
            </div>
          )}
        </div>
      </div>

      {/* Track Info */}
      <div className="px-8 text-center">
        <h1 className="text-2xl font-bold mb-2">{currentTrack.title}</h1>
        <p className="text-zinc-400 text-lg">{currentTrack.artist}</p>
      </div>

      {/* Progress Bar */}
      <div className="px-8 py-6">
        <Slider
          value={[duration ? (currentTime / duration) * 100 : 0]}
          onValueChange={handleProgressChange}
          className="w-full"
          max={100}
          step={1}
        />
        <div className="flex justify-between text-xs text-zinc-400 mt-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="px-8 py-4">
        <div className="flex items-center justify-center space-x-8">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={`h-6 w-6 ${isLiked ? 'fill-primary text-primary' : ''}`} />
          </Button>
          
          <Button variant="ghost" size="icon" className="text-white">
            <SkipBack className="h-8 w-8" />
          </Button>
          
          <Button 
            onClick={togglePlay}
            className="bg-white text-black hover:bg-zinc-200 w-16 h-16 rounded-full"
          >
            {isPlaying ? (
              <Pause className="h-8 w-8" />
            ) : (
              <Play className="h-8 w-8 ml-1" />
            )}
          </Button>
          
          <Button variant="ghost" size="icon" className="text-white">
            <SkipForward className="h-8 w-8" />
          </Button>
          
          <Button variant="ghost" size="icon" className="text-white">
            <Volume2 className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Volume Control */}
      <div className="px-8 py-2">
        <div className="flex items-center space-x-3">
          <Volume2 className="h-4 w-4 text-zinc-400" />
          <Slider
            value={volume}
            onValueChange={setVolume}
            className="flex-1"
            max={100}
            step={1}
          />
        </div>
      </div>

      {/* Up Next */}
      <div className="px-8 py-6">
        <h3 className="text-lg font-semibold mb-4">Up Next</h3>
        <div className="space-y-3">
          {tracks.slice(1, 4).map((track) => (
            <Card key={track.id} className="bg-zinc-800/50 border-zinc-700 p-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-zinc-700 rounded-lg"></div>
                <div className="flex-1">
                  <p className="font-medium text-white">{track.title}</p>
                  <p className="text-sm text-zinc-400">{track.artist}</p>
                </div>
                <Button variant="ghost" size="icon" className="text-zinc-400">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* DISABLED AUDIO ELEMENT - NO MORE PLAYBACK */}
      {false && currentTrack && (
        <audio
          ref={audioRef}
          src=""
          onLoadedMetadata={() => {}}
        />
      )}
    </div>
  );
};

export default MobilePlayer;