import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Music, Mic } from "lucide-react";

// Curated content - this would eventually come from a CMS or admin-managed database
const curatedSounds = [{
  id: "1",
  title: "Midnight Groove",
  artist: "SCNRO Artist",
  genre: "Electronic",
  description: "A deep electronic track perfect for late-night sessions",
  duration: 240,
  cover_image_url: "/placeholder.svg"
}, {
  id: "2",
  title: "Urban Pulse",
  artist: "SCNRO Collective",
  genre: "Hip-Hop",
  description: "Street-inspired beats with modern production",
  duration: 180,
  cover_image_url: "/placeholder.svg"
}];
const curatedInterviews = [{
  id: "3",
  title: "Behind the Beat: Producer Stories",
  artist: "SCNRO Podcast",
  genre: "Interview",
  description: "Exclusive conversation with underground producers",
  duration: 1800,
  cover_image_url: "/placeholder.svg"
}, {
  id: "4",
  title: "Live from the Studio",
  artist: "SCNRO Sessions",
  genre: "Live Recording",
  description: "Unfiltered creative process captured live",
  duration: 2400,
  cover_image_url: "/placeholder.svg"
}];
const CuratedTracks = () => {
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  const togglePlay = (trackId: string) => {
    // DISABLED - No actual audio playback
    console.log('🚫 CuratedTracks audio disabled - this is just UI demo');
    setPlayingTrack(playingTrack === trackId ? null : trackId);
  };
  const renderTrackList = (tracks: typeof curatedSounds, icon: React.ReactNode) => <div className="space-y-4">
      {tracks.map(track => <Card key={track.id} className="bg-background/50 backdrop-blur border-muted hover:bg-background/80 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <img src={track.cover_image_url} alt={`${track.title} cover`} className="w-16 h-16 rounded-lg object-cover" />
                <Button variant="secondary" size="sm" className="absolute inset-0 m-auto w-8 h-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => togglePlay(track.id)}>
                  {playingTrack === track.id ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 ml-0.5" />}
                </Button>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {icon}
                  <h3 className="font-semibold text-foreground truncate">{track.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{track.artist}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{track.description}</p>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <span className="text-sm font-medium text-muted-foreground">
                  {formatDuration(track.duration)}
                </span>
                <span className="text-xs px-2 py-1 bg-secondary rounded-full">
                  {track.genre}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>)}
    </div>;
  return <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-8">
        
        <p className="text-muted-foreground">
      </p>
      </div>

      <Tabs defaultValue="sounds" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="sounds" className="text-lg py-3">
            🎵 SCNRO Sounds
          </TabsTrigger>
          <TabsTrigger value="interviews" className="text-lg py-3">
            🎤 Interviews/Live
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="sounds" className="space-y-6">
          {renderTrackList(curatedSounds, <Music className="h-4 w-4 text-primary" />)}
        </TabsContent>
        
        <TabsContent value="interviews" className="space-y-6">
          {renderTrackList(curatedInterviews, <Mic className="h-4 w-4 text-primary" />)}
        </TabsContent>
      </Tabs>
    </div>;
};
export default CuratedTracks;