import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAudio } from "@/contexts/AudioContext";
import AudioUploadButton from "./AudioUploadButton";
import { 
  Play, 
  Pause, 
  Music, 
  Search, 
  Filter,
  Clock,
  User,
  Tag,
  Volume2
} from "lucide-react";

interface Track {
  id: string;
  title: string;
  artist: string;
  genre?: string;
  description?: string;
  audio_url: string;
  cover_image_url?: string;
  duration: number;
  content_type: 'sound' | 'interview';
  created_at: string;
  play_count: number;
}

const AudioLibrary = () => {
  const [allTracks, setAllTracks] = useState<Track[]>([]);
  const [filteredTracks, setFilteredTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [selectedContentType, setSelectedContentType] = useState<"all" | "sound" | "interview">("all");

  const { state, playTrack, setPlaylist, formatTime } = useAudio();

  useEffect(() => {
    fetchAllTracks();
  }, []);

  useEffect(() => {
    filterTracks();
  }, [allTracks, searchQuery, selectedGenre, selectedContentType]);

  const fetchAllTracks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tracks')
        .select('*')
        .order('position', { ascending: true });

      if (error) throw error;

      const validTracks = (data || []).filter(track => track.audio_url);
      setAllTracks(validTracks);
    } catch (error) {
      console.error('Error fetching tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterTracks = () => {
    let filtered = [...allTracks];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(track => 
        track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.genre?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by genre
    if (selectedGenre !== "all") {
      filtered = filtered.filter(track => track.genre === selectedGenre);
    }

    // Filter by content type
    if (selectedContentType !== "all") {
      filtered = filtered.filter(track => track.content_type === selectedContentType);
    }

    setFilteredTracks(filtered);
  };

  const getUniqueGenres = () => {
    const genres = allTracks
      .map(track => track.genre)
      .filter(Boolean)
      .filter((genre, index, arr) => arr.indexOf(genre) === index);
    return genres as string[];
  };

  const handlePlayTrack = (track: Track) => {
    playTrack(track, filteredTracks);
  };

  const handlePlayAll = () => {
    if (filteredTracks.length > 0) {
      playTrack(filteredTracks[0], filteredTracks);
    }
  };

  const getTotalDuration = () => {
    return filteredTracks.reduce((total, track) => total + track.duration, 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Music className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium">Loading your music library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Music Library</h1>
          <p className="text-muted-foreground">
            {filteredTracks.length} tracks • {formatTime(getTotalDuration())} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handlePlayAll} disabled={filteredTracks.length === 0}>
            <Play className="w-4 h-4 mr-2" />
            Play All
          </Button>
          <AudioUploadButton onUploadComplete={fetchAllTracks} />
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tracks, artists, or genres..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Content Type</label>
              <Tabs value={selectedContentType} onValueChange={(value: any) => setSelectedContentType(value)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="sound">Music</TabsTrigger>
                  <TabsTrigger value="interview">Podcasts</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Genre</label>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant={selectedGenre === "all" ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedGenre("all")}
                >
                  All Genres
                </Badge>
                {getUniqueGenres().map(genre => (
                  <Badge 
                    key={genre}
                    variant={selectedGenre === genre ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setSelectedGenre(genre)}
                  >
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Track List */}
      <Card>
        <CardHeader>
          <CardTitle>Tracks</CardTitle>
          <CardDescription>
            {filteredTracks.length === 0 ? "No tracks found" : `${filteredTracks.length} tracks found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTracks.length === 0 ? (
            <div className="text-center py-12">
              <Music className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">No tracks found</p>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTracks.map((track, index) => (
                <div
                  key={track.id}
                  onClick={() => handlePlayTrack(track)}
                  className={`
                    flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 
                    hover:bg-muted/50 group
                    ${state.currentTrack?.id === track.id ? 'bg-muted border border-border' : ''}
                  `}
                >
                  {/* Index/Play State */}
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                    {state.currentTrack?.id === track.id && state.isPlaying ? (
                      <Volume2 className="w-4 h-4 text-primary animate-pulse" />
                    ) : (
                      <span className="text-sm text-muted-foreground group-hover:hidden">
                        {index + 1}
                      </span>
                    )}
                    <Play className="w-4 h-4 text-primary hidden group-hover:block" />
                  </div>

                  {/* Cover Art */}
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center overflow-hidden">
                    {track.cover_image_url ? (
                      <img 
                        src={track.cover_image_url} 
                        alt={track.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Music className="w-6 h-6 text-primary/60" />
                    )}
                  </div>

                  {/* Track Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold truncate">{track.title}</h4>
                      {state.currentTrack?.id === track.id && (
                        <Badge variant="outline" className="text-xs">
                          {state.isPlaying ? "Playing" : "Paused"}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {track.artist}
                      </span>
                      {track.genre && (
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {track.genre}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(track.duration)}
                      </span>
                    </div>
                  </div>

                  {/* Content Type Badge */}
                  <div className="flex-shrink-0">
                    <Badge variant={track.content_type === 'sound' ? 'default' : 'secondary'}>
                      {track.content_type === 'sound' ? 'Music' : 'Podcast'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AudioLibrary;