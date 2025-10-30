import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, Heart, Share, MoreHorizontal, Music, Radio, Smartphone } from "lucide-react";
import AnimatedSpeakers from '../AnimatedSpeakers';
import CircularText from '../CircularText';
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
interface NowPlayingCardProps {
  state: AudioState;
  loading: boolean;
  togglePlayPause: () => void;
  previousTrack: () => void;
  nextTrack: () => void;
  toggleShuffle: () => void;
  setRepeatMode: (mode: 'off' | 'all' | 'one') => void;
  handleVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  formatTime: (time: number) => string;
}
const NowPlayingCard = ({
  state,
  loading,
  togglePlayPause,
  previousTrack,
  nextTrack,
  toggleShuffle,
  setRepeatMode,
  handleVolumeChange,
  handleProgressClick,
  formatTime
}: NowPlayingCardProps) => {
  const getYearFromDate = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };
  return (
    <div className="max-w-4xl mx-auto mb-12">
      <div className="rounded-3xl p-8 bg-black backdrop-blur-sm border-2 border-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {/* Logo in top-left */}
          <div className="flex-shrink-0 flex items-center gap-4">
            <img 
              src="/lovable-uploads/ea42816a-6fc1-4f63-9bee-edcf1cec25b1.png" 
              alt="SCNRO" 
              className="w-40 h-40 sm:w-56 sm:h-56 object-contain"
            />
            <img 
              src="/lovable-uploads/a6dc50d1-d0d1-48d7-a435-237299cb69f2.png" 
              alt="Additional Logo" 
              className="w-40 h-40 sm:w-48 sm:h-48 object-contain animate-pulse"
            />
          </div>
          <div className="hidden sm:flex items-center gap-2">
            {/* Platform Buttons */}
            <button onClick={() => window.open('https://music.apple.com/us/album/afro-drop-ep/1796591753?uo=4', '_blank')} className="w-8 h-8 p-0 cursor-pointer transition-all duration-200 ease-out hover:scale-110 border-none flex items-center justify-center overflow-hidden" style={{
            background: 'transparent',
            border: '2px solid rgba(255,255,255,0.6)',
            borderRadius: '50%',
            boxShadow: `
                  inset 0 1px 2px rgba(255,255,255,0.3),
                  inset 0 -1px 2px rgba(0,0,0,0.1),
                  0 2px 6px rgba(0,0,0,0.2)
                `
          }} title="Listen on Apple Music">
              <img src="/lovable-uploads/3129f0dd-1f98-4f37-8982-943f8a4989e6.png" alt="Apple Music" className="w-5 h-5" />
            </button>
            <button onClick={() => window.open('https://open.spotify.com/album/3CaAdzSua39A0IF6vPnbAR', '_blank')} className="w-8 h-8 p-0 cursor-pointer transition-all duration-200 ease-out hover:scale-110 border-none flex items-center justify-center overflow-hidden" style={{
            background: 'transparent',
            border: '2px solid rgba(255,255,255,0.6)',
            borderRadius: '50%',
            boxShadow: `
                  inset 0 1px 2px rgba(255,255,255,0.3),
                  inset 0 -1px 2px rgba(0,0,0,0.1),
                  0 2px 6px rgba(0,0,0,0.2)
                `
          }} title="Listen on Spotify">
              <img src="/lovable-uploads/76bf4548-f9f7-4470-90a7-ad8db45812ae.png" alt="Spotify" className="w-5 h-5" />
            </button>
            <button onClick={() => window.open('https://www.deezer.com/album/412426467', '_blank')} className="w-8 h-8 p-0 cursor-pointer transition-all duration-200 ease-out hover:scale-110 border-none flex items-center justify-center overflow-hidden" style={{
            background: 'transparent',
            border: '2px solid rgba(255,255,255,0.6)',
            borderRadius: '50%',
            boxShadow: `
                  inset 0 1px 2px rgba(255,255,255,0.3),
                  inset 0 -1px 2px rgba(0,0,0,0.1),
                  0 2px 6px rgba(0,0,0,0.2)
                `
          }} title="Listen on Deezer">
              <img src="/lovable-uploads/5a258abe-aca3-4cf9-bf84-5069817c2487.png" alt="Deezer" className="w-5 h-5" />
            </button>
            
            {/* Divider */}
            <div className="w-px h-6 bg-white/30 mx-1"></div>
            
            {/* Existing buttons */}
            <button className="w-8 h-8 p-0 cursor-pointer transition-all duration-200 ease-out hover:scale-110 border-none flex items-center justify-center" style={{
            background: 'transparent',
            border: '2px solid rgba(255,255,255,0.6)',
            borderRadius: '50%',
            boxShadow: `
                  inset 0 1px 2px rgba(255,255,255,0.3),
                  inset 0 -1px 2px rgba(0,0,0,0.1),
                  0 2px 6px rgba(0,0,0,0.2)
                `
          }}>
              <Heart className="w-4 h-4 text-white" />
            </button>
            <button className="w-8 h-8 p-0 cursor-pointer transition-all duration-200 ease-out hover:scale-110 border-none flex items-center justify-center" style={{
            background: 'transparent',
            border: '2px solid rgba(255,255,255,0.6)',
            borderRadius: '50%',
            boxShadow: `
                  inset 0 1px 2px rgba(255,255,255,0.3),
                  inset 0 -1px 2px rgba(0,0,0,0.1),
                  0 2px 6px rgba(0,0,0,0.2)
                `
          }}>
              <Share className="w-4 h-4 text-white" />
            </button>
            <button className="w-8 h-8 p-0 cursor-pointer transition-all duration-200 ease-out hover:scale-110 border-none flex items-center justify-center" style={{
            background: 'transparent',
            border: '2px solid rgba(255,255,255,0.6)',
            borderRadius: '50%',
            boxShadow: `
                  inset 0 1px 2px rgba(255,255,255,0.3),
                  inset 0 -1px 2px rgba(0,0,0,0.1),
                  0 2px 6px rgba(0,0,0,0.2)
                `
          }}>
              <MoreHorizontal className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Animated OS3 Logo */}
          <div className="absolute right-8 bottom-8 animate-spin-slow">
            <img 
              src="/lovable-uploads/fbbc6e0e-1b22-497a-b09b-1b2390b45223.png" 
              alt="OS3 Mainframe Operating System" 
              className="w-20 h-20 object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
            />
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button onClick={toggleShuffle} className="w-10 h-10 p-0 cursor-pointer transition-all duration-200 ease-out hover:scale-110 border-none flex items-center justify-center" style={{
          background: state.shuffleMode ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
          border: '3px solid',
          borderImage: state.shuffleMode ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%) 1' : 'linear-gradient(135deg, #f0f0f0 0%, #d0d0d0 25%, #b8b8b8 50%, #a0a0a0 75%, #888 100%) 1',
          borderRadius: '50%',
          boxShadow: `
                inset 0 1px 2px rgba(255,255,255,0.3),
                inset 0 -1px 2px rgba(0,0,0,0.1),
                0 2px 6px rgba(0,0,0,0.2)
              `
        }}>
            <Shuffle className={`w-4 h-4 ${state.shuffleMode ? 'text-purple-300' : 'text-white'}`} />
          </button>
          
          <button onClick={previousTrack} disabled={!state.currentTrack} className="w-12 h-12 p-0 cursor-pointer transition-all duration-200 ease-out hover:scale-110 border-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center" style={{
          background: 'transparent',
          border: '3px solid',
          borderImage: 'linear-gradient(135deg, #f0f0f0 0%, #d0d0d0 25%, #b8b8b8 50%, #a0a0a0 75%, #888 100%) 1',
          borderRadius: '50%',
          boxShadow: `
                inset 0 1px 2px rgba(255,255,255,0.3),
                inset 0 -1px 2px rgba(0,0,0,0.1),
                0 2px 6px rgba(0,0,0,0.2)
              `
        }}>
            <SkipBack className="w-5 h-5 text-white" />
          </button>
          
          <button className="chrome-btn group relative w-16 h-16 sm:w-20 sm:h-20 bg-none border-none p-0 cursor-pointer transition-all duration-200 ease-out hover:scale-105 hover:shadow-[0_8px_20px_rgba(0,0,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center flex-shrink-0" onClick={togglePlayPause} disabled={!state.currentTrack} style={{
          background: `
                radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.3) 30%, transparent 70%),
                linear-gradient(135deg, #f0f0f0 0%, #d0d0d0 25%, #b8b8b8 50%, #a0a0a0 75%, #888 100%),
                radial-gradient(circle at center, #4A9FFF 0%, #2563EB  50%, #1D4ED8 100%)
              `,
          backgroundSize: '100% 100%, 100% 100%, 70% 70%',
          backgroundPosition: 'center, center, center',
          backgroundRepeat: 'no-repeat, no-repeat, no-repeat',
          borderRadius: '50%',
          boxShadow: `
                inset 0 2px 4px rgba(255,255,255,0.5),
                inset 0 -2px 4px rgba(0,0,0,0.2),
                0 4px 12px rgba(0,0,0,0.3),
                0 0 0 1px rgba(0,0,0,0.1)
              `
        }}>
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-inner">
              {state.isPlaying ? <Pause className="w-5 h-5 sm:w-7 sm:h-7 text-white drop-shadow-sm" /> : <Play className="w-5 h-5 sm:w-7 sm:h-7 ml-0.5 text-white drop-shadow-sm" />}
            </div>
          </button>
          
          <button onClick={nextTrack} disabled={!state.currentTrack} className="w-12 h-12 p-0 cursor-pointer transition-all duration-200 ease-out hover:scale-110 border-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center" style={{
          background: 'transparent',
          border: '3px solid',
          borderImage: 'linear-gradient(135deg, #f0f0f0 0%, #d0d0d0 25%, #b8b8b8 50%, #a0a0a0 75%, #888 100%) 1',
          borderRadius: '50%',
          boxShadow: `
                inset 0 1px 2px rgba(255,255,255,0.3),
                inset 0 -1px 2px rgba(0,0,0,0.1),
                0 2px 6px rgba(0,0,0,0.2)
              `
        }}>
            <SkipForward className="w-5 h-5 text-white" />
          </button>
          
          <button onClick={() => setRepeatMode(state.repeatMode === 'off' ? 'all' : state.repeatMode === 'all' ? 'one' : 'off')} className="w-10 h-10 p-0 cursor-pointer transition-all duration-200 ease-out hover:scale-110 border-none flex items-center justify-center relative" style={{
          background: state.repeatMode !== 'off' ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
          border: '3px solid',
          borderImage: state.repeatMode !== 'off' ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%) 1' : 'linear-gradient(135deg, #f0f0f0 0%, #d0d0d0 25%, #b8b8b8 50%, #a0a0a0 75%, #888 100%) 1',
          borderRadius: '50%',
          boxShadow: `
                inset 0 1px 2px rgba(255,255,255,0.3),
                inset 0 -1px 2px rgba(0,0,0,0.1),
                0 2px 6px rgba(0,0,0,0.2)
              `
        }}>
            <Repeat className={`w-4 h-4 ${state.repeatMode !== 'off' ? 'text-purple-300' : 'text-white'}`} />
            {state.repeatMode === 'one' && <span className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 text-white text-xs rounded-full flex items-center justify-center font-bold">
                1
              </span>}
          </button>
        </div>

        {/* Track Info with Speakers */}
        <div className="w-full mb-6">
          <div className="flex items-center justify-between gap-4 max-w-2xl mx-auto">
            {/* Left Speakers: Bass + Treble */}
            <div className="flex-shrink-0">
              <AnimatedSpeakers type="left" size="sm" className="animate-fade-in" />
            </div>
            
            {/* Track Title Center */}
            <div className="text-center min-w-0 flex-1">
              <h4 className="text-xl sm:text-2xl font-bold text-foreground mb-1 line-clamp-1">
                {loading ? "Loading..." : state.currentTrack ? state.currentTrack.title : "Select a track"}
              </h4>
              <p className="text-base sm:text-lg text-muted-foreground line-clamp-1">
                {state.currentTrack ? state.currentTrack.artist : "No track selected"}
              </p>
            </div>
            
            {/* Right Speakers: Treble + Bass */}
            <div className="flex-shrink-0">
              <AnimatedSpeakers type="right" size="sm" className="animate-fade-in" />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md mx-auto mb-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>{formatTime(state.currentTime)}</span>
            <span>{state.currentTrack ? formatTime(state.duration - state.currentTime) : "0:00"}</span>
          </div>
          <div className="w-full h-2 bg-white rounded-full cursor-pointer overflow-hidden border border-white/20" onClick={handleProgressClick}>
            <div className="h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-full transition-all duration-100 ease-out shadow-inner" style={{
            width: `${state.duration > 0 ? state.currentTime / state.duration * 100 : 0}%`
          }} />
          </div>
        </div>

        {/* Volume Controls */}
        <div className="w-full max-w-md mx-auto flex items-center gap-3">
          <Volume2 className="w-5 h-5 text-white" />
          <input type="range" min="0" max="1" step="0.01" value={state.isMuted ? 0 : state.volume} onChange={handleVolumeChange} className="flex-1 h-2 bg-white/20 rounded-full appearance-none cursor-pointer" />
        </div>
      </div>
    </div>
  );
};
export default NowPlayingCard;