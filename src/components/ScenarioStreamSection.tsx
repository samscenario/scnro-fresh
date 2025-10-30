import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAudio } from "@/contexts/AudioContext";
import { useAuth } from "@/hooks/useAuth";
import NowPlayingCard from "./stream/NowPlayingCard";
import StreamPlaylist from "./stream/StreamPlaylist";
import StreamPlaylist2 from "./stream/StreamPlaylist2";
import { RealtimeChannel } from '@supabase/supabase-js';

interface Track {
  id: string;
  title: string;
  artist: string;
  genre?: string;
  producer?: string;
  platform?: string;
  description?: string;
  audio_url: string;
  cover_image_url?: string;
  duration: number;
  content_type: 'sound' | 'interview';
  created_at: string;
}

const ScenarioStreamSection = () => {
  const [playlist1Tracks, setPlaylist1Tracks] = useState<Track[]>([]);
  const [playlist2Tracks, setPlaylist2Tracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuth();
  
  // Get audio context and methods with safety check
  const audioContext = useAudio();
  
  // If audio context is not available (during hot reload), show loading
  if (!audioContext) {
    return (
      <section id="scenario-stream" className="py-20 px-4 bg-gradient-to-b from-card to-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <img 
              src="/lovable-uploads/e7ca2fe5-8211-4feb-b487-555525492b42.png" 
              alt="SCENARIO" 
              className="h-8 w-auto mx-auto mb-4"
            />
            <p className="text-white/70">Loading audio player...</p>
          </div>
        </div>
      </section>
    );
  }

  const {
    state,
    audioRef,
    analyser,
    playTrack,
    togglePlayPause,
    nextTrack,
    previousTrack,
    seekTo,
    setVolume,
    toggleMute,
    setPlaylist,
    toggleShuffle,
    setRepeatMode,
    formatTime,
    stop
  } = audioContext;

  useEffect(() => {
    fetchTracks();
    if (user) {
      checkAdminStatus();
    }

    // Set up real-time listener for track changes
    const channel: RealtimeChannel = supabase
      .channel('tracks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tracks',
          filter: 'content_type=eq.sound'
        },
        (payload) => {
          console.log('🔥 Track database change detected:', payload);
          
          if (payload.eventType === 'DELETE') {
            console.log('🗑️ Track deleted:', payload.old);
            // If currently playing track was deleted, stop it immediately
            if (state.currentTrack && payload.old && payload.old.id === state.currentTrack.id) {
              console.log('⏹️ Currently playing track was deleted, EMERGENCY STOP');
              emergencyStopAll();
            }
          }
          
          // Always refresh tracks list after any change
          console.log('🔄 Refreshing tracks list...');
          fetchTracks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, state.currentTrack]);

  const checkAdminStatus = async () => {
    try {
      const { data, error } = await supabase.rpc('is_admin');
      if (error) throw error;
      setIsAdmin(data || false);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  
  // SAFE EMERGENCY STOP FUNCTION - No DOM removal
  const emergencyStopAll = () => {
    console.log('🚨 SAFE EMERGENCY STOP ALL AUDIO 🚨');
    
    // Stop our audio context
    stop();
    
    // Stop ALL audio elements on the page (but don't remove from DOM)
    const allAudio = document.querySelectorAll('audio');
    console.log(`Found ${allAudio.length} audio elements to stop`);
    allAudio.forEach((audio, index) => {
      console.log(`Stopping audio element ${index}:`, audio.src);
      audio.pause();
      audio.currentTime = 0;
      audio.src = '';
      audio.load();
      // DON'T remove from DOM - React manages that
    });
    
    // Stop ALL video elements too (but don't remove from DOM)
    const allVideo = document.querySelectorAll('video');
    allVideo.forEach((video, index) => {
      console.log(`Stopping video element ${index}:`, video.src);
      video.pause();
      video.currentTime = 0;
      // Don't clear video src
    });
    
    console.log('🛑 SAFE EMERGENCY STOP COMPLETE');
  };

  const fetchTracks = async () => {
    try {
      // Fetch tracks for both playlists
      const { data, error } = await supabase
        .from('tracks')
        .select('*')
        .eq('content_type', 'sound')
        .order('position', { ascending: true })
        .limit(20);

      if (error) throw error;

      const validTracks = (data || []).filter(track => track.audio_url);
      
      // Separate tracks by playlist
      const playlist1 = validTracks.filter(track => track.playlist_number === 1);
      const playlist2 = validTracks.filter(track => track.playlist_number === 2);
      
      console.log(`📊 Found ${playlist1.length} tracks in playlist 1, ${playlist2.length} tracks in playlist 2`);
      
      setPlaylist1Tracks(playlist1);
      setPlaylist2Tracks(playlist2);
      
      // Combine all tracks for global playlist context
      const allTracks = [...playlist1, ...playlist2];
      
      // Update playlist in global context
      if (allTracks.length > 0) {
        console.log('✅ Setting global playlist with all tracks');
        setPlaylist(allTracks);
        
        // Check if current track still exists in the new list
        if (state.currentTrack) {
          const currentTrackExists = allTracks.find(track => track.id === state.currentTrack?.id);
          if (!currentTrackExists) {
            console.log('❌ Current track no longer exists in playlist, SAFE EMERGENCY STOP');
            emergencyStopAll();
          }
        }
        
        // Only set initial track if no current track exists
        if (!state.currentTrack && allTracks.length > 0) {
          console.log('🎵 Setting initial track (but not playing)');
          const firstTrack = allTracks[0];
          playTrack(firstTrack, allTracks);
        }
      } else {
        // NO TRACKS AVAILABLE - SAFE EMERGENCY STOP
        console.log('🚨 NO TRACKS AVAILABLE - SAFE EMERGENCY STOP ALL AUDIO 🚨');
        emergencyStopAll();
        setPlaylist([]);
      }
    } catch (error) {
      console.error('Error fetching tracks:', error);
      setPlaylist1Tracks([]);
      setPlaylist2Tracks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    setVolume(volume);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    const newTime = percentage * state.duration;
    seekTo(newTime);
  };

  const handleTrackSelect = (track: Track) => {
    const allTracks = [...playlist1Tracks, ...playlist2Tracks];
    playTrack(track, allTracks);
  };

  return (
    <section id="scenario-stream" className="py-20 px-4 bg-gradient-to-b from-card to-background">
      <div className="max-w-6xl mx-auto">

        <NowPlayingCard
          state={state}
          loading={loading}
          togglePlayPause={togglePlayPause}
          previousTrack={previousTrack}
          nextTrack={nextTrack}
          toggleShuffle={toggleShuffle}
          setRepeatMode={setRepeatMode}
          handleVolumeChange={handleVolumeChange}
          handleProgressClick={handleProgressClick}
          formatTime={formatTime}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <StreamPlaylist
            tracks={playlist1Tracks}
            state={state}
            loading={loading}
            isAdmin={isAdmin}
            user={user}
            playlistNumber={1}
            onTrackSelect={handleTrackSelect}
            onUploadComplete={fetchTracks}
            formatTime={formatTime}
          />

          <StreamPlaylist2
            tracks={playlist2Tracks}
            state={state}
            loading={loading}
            isAdmin={isAdmin}
            user={user}
            playlistNumber={2}
            onTrackSelect={handleTrackSelect}
            onUploadComplete={fetchTracks}
            formatTime={formatTime}
          />
        </div>

      </div>
    </section>
  );
};

export default ScenarioStreamSection;