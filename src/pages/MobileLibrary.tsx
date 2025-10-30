import { useState, useEffect } from "react";
import { Search, Grid, List, Play, Heart, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

interface Track {
  id: string;
  title: string;
  artist: string;
  audio_url: string;
  duration: number;
  cover_image?: string;
  genre?: string;
}

const MobileLibrary = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");

  const genres = ["all", "electronic", "hip-hop", "ambient", "experimental"];

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    const { data, error } = await supabase
      .from('tracks')
      .select('*')
      .eq('content_type', 'sound');
    
    if (data && !error) {
      setTracks(data);
    }
  };

  const filteredTracks = tracks.filter(track => {
    const matchesSearch = track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         track.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === "all" || track.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white pb-20">
      {/* Header */}
      <div className="p-4 pt-12">
        <h1 className="text-2xl font-bold mb-4">Your Library</h1>
        
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
          <Input
            placeholder="Search tracks, artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400"
          />
        </div>

        {/* Genre Filter */}
        <div className="flex space-x-2 mb-4 overflow-x-auto">
          {genres.map((genre) => (
            <Badge
              key={genre}
              variant={selectedGenre === genre ? "default" : "outline"}
              className={`cursor-pointer whitespace-nowrap ${
                selectedGenre === genre 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-zinc-800 text-zinc-300 border-zinc-600"
              }`}
              onClick={() => setSelectedGenre(genre)}
            >
              {genre.charAt(0).toUpperCase() + genre.slice(1)}
            </Badge>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-zinc-400">{filteredTracks.length} tracks</p>
          <div className="flex space-x-2">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="h-8 w-8"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Tracks */}
      <div className="px-4 pb-20">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredTracks.map((track) => (
              <Card key={track.id} className="bg-zinc-800/50 border-zinc-700 p-3">
                <div className="aspect-square bg-zinc-700 rounded-lg mb-3 relative overflow-hidden">
                  {track.cover_image ? (
                    <img 
                      src={track.cover_image} 
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-2xl font-bold text-zinc-600">S</div>
                    </div>
                  )}
                  <Button 
                    size="icon" 
                    className="absolute bottom-2 right-2 bg-primary hover:bg-primary/80 h-8 w-8"
                  >
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
                <h3 className="font-medium text-sm truncate">{track.title}</h3>
                <p className="text-xs text-zinc-400 truncate">{track.artist}</p>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredTracks.map((track) => (
              <Card key={track.id} className="bg-zinc-800/50 border-zinc-700 p-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-zinc-700 rounded-lg overflow-hidden">
                    {track.cover_image ? (
                      <img 
                        src={track.cover_image} 
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-sm font-bold text-zinc-600">S</div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-white truncate">{track.title}</h3>
                    <p className="text-sm text-zinc-400 truncate">{track.artist}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-zinc-400">{formatDuration(track.duration || 0)}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileLibrary;