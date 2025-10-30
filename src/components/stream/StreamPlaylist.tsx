import { Music, Play, Pause } from "lucide-react";
import AudioUploadButton from "../AudioUploadButton";

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

interface AudioState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  shuffleMode: boolean;
  repeatMode: 'off' | 'all' | 'one';
}

interface StreamPlaylistProps {
  tracks: Track[];
  state: AudioState;
  loading: boolean;
  isAdmin: boolean;
  user: any;
  playlistNumber: number;
  onTrackSelect: (track: Track) => void;
  onUploadComplete: () => void;
  formatTime: (time: number) => string;
}

const StreamPlaylist = ({
  tracks,
  state,
  loading,
  isAdmin,
  user,
  playlistNumber,
  onTrackSelect,
  onUploadComplete,
  formatTime
}: StreamPlaylistProps) => {
  const getYearFromDate = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  const getTrackMetadata = (track: Track) => {
    const parts = [];
    if (track.genre) parts.push(track.genre);
    if (track.producer) parts.push(`Produced by ${track.producer}`);
    return parts.join(' • ');
  };

  return (
    <div className="max-w-md">
      <div className="bg-background/95 backdrop-blur-sm border border-border rounded-2xl shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <p className="text-sm text-muted-foreground">Playlist</p>
            <h3 className="text-lg font-semibold text-foreground">Scenario Music Playlist #{playlistNumber}</h3>
          </div>
          {isAdmin && user && <AudioUploadButton onUploadComplete={onUploadComplete} playlistNumber={playlistNumber} />}
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading tracks...</div>
          </div>
        ) : tracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
              <Music className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium mb-1">No tracks available</p>
            <p className="text-muted-foreground text-sm">Upload some tracks to get started</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {tracks.map((track, index) => (
              <div
                key={track.id}
                onClick={() => onTrackSelect(track)}
                className={`
                  group flex items-center gap-3 p-3 cursor-pointer transition-all duration-150 hover:bg-muted/30
                  ${state.currentTrack?.id === track.id ? 'bg-electric-blue/10' : ''}
                `}
              >
                {/* Small Circular Play Button */}
                <div className="flex-shrink-0">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150
                    ${state.currentTrack?.id === track.id ? 'bg-electric-blue text-white' : 'bg-background border border-border text-muted-foreground group-hover:bg-electric-blue/20 group-hover:text-electric-blue'}
                  `}>
                    {state.currentTrack?.id === track.id && state.isPlaying ? (
                      <Pause className="w-3 h-3" />
                    ) : (
                      <Play className="w-3 h-3 ml-0.5" />
                    )}
                  </div>
                </div>
                
                {/* Track Info - Artist on top, title below */}
                <div className="flex-1 min-w-0">
                  <p className="text-electric-blue text-sm font-medium truncate">
                    {track.artist}
                  </p>
                  <p className="text-foreground text-sm truncate font-normal">
                    {track.title}
                  </p>
                </div>
                
                {/* Duration and Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-muted-foreground text-xs font-medium">
                    {formatTime(track.duration)}
                  </span>
                  <div className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-full h-full">
                      <circle cx="12" cy="12" r="1"></circle>
                      <circle cx="19" cy="12" r="1"></circle>
                      <circle cx="5" cy="12" r="1"></circle>
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StreamPlaylist;