import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { 
  Music, 
  Trash2, 
  Edit, 
  Save, 
  X, 
  Play,
  Upload,
  ChevronUp,
  ChevronDown
} from "lucide-react";

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
  playlist_number?: number;
  position?: number;
}

interface PlaylistManagementProps {
  playlistNumber: number;
  onRefresh?: () => void;
}

const PlaylistManagement: React.FC<PlaylistManagementProps> = ({ 
  playlistNumber, 
  onRefresh 
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTrack, setEditingTrack] = useState<string | null>(null);
  const [editData, setEditData] = useState({
    title: "",
    artist: "",
    genre: "",
    producer: "",
    platform: "",
    description: ""
  });

  useEffect(() => {
    fetchPlaylistTracks();
  }, [playlistNumber]);

  const fetchPlaylistTracks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tracks')
        .select('*')
        .eq('playlist_number', playlistNumber)
        .order('position', { ascending: true });

      if (error) throw error;
      setTracks(data || []);
    } catch (error) {
      console.error('Error fetching playlist tracks:', error);
      toast({
        title: "Error",
        description: `Failed to fetch playlist ${playlistNumber} tracks`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (track: Track) => {
    setEditingTrack(track.id);
    setEditData({
      title: track.title,
      artist: track.artist,
      genre: track.genre || "",
      producer: track.producer || "",
      platform: track.platform || "",
      description: track.description || ""
    });
  };

  const saveEdit = async (trackId: string) => {
    try {
      const { error } = await supabase
        .from('tracks')
        .update({
          title: editData.title,
          artist: editData.artist,
          genre: editData.genre || null,
          producer: editData.producer || null,
          platform: editData.platform || null,
          description: editData.description || null
        })
        .eq('id', trackId);

      if (error) throw error;

      toast({
        title: "Updated!",
        description: "Track updated successfully"
      });

      setEditingTrack(null);
      fetchPlaylistTracks();
      onRefresh?.();
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: "Update failed",
        description: "There was an error updating the track",
        variant: "destructive"
      });
    }
  };

  const deleteTrack = async (track: Track) => {
    if (!confirm(`Delete "${track.title}" from Playlist ${playlistNumber}? This cannot be undone.`)) return;

    try {
      // Delete from database first
      const { error: deleteError } = await supabase
        .from('tracks')
        .delete()
        .eq('id', track.id);

      if (deleteError) throw deleteError;

      // Delete files from storage
      if (track.audio_url) {
        const audioPath = track.audio_url.split('/').slice(-3).join('/');
        await supabase.storage.from('tracks').remove([audioPath]);
      }
      
      if (track.cover_image_url) {
        const coverPath = track.cover_image_url.split('/').slice(-2).join('/');
        await supabase.storage.from('covers').remove([coverPath]);
      }

      toast({
        title: "Deleted",
        description: `"${track.title}" has been removed from Playlist ${playlistNumber}`
      });

      fetchPlaylistTracks();
      onRefresh?.();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete failed",
        description: "There was an error deleting the track",
        variant: "destructive"
      });
    }
  };

  const moveTrack = async (trackId: string, direction: 'up' | 'down') => {
    const track = tracks.find(t => t.id === trackId);
    if (!track || !track.position) return;

    const currentPosition = track.position;
    const newPosition = direction === 'up' ? currentPosition - 1 : currentPosition + 1;
    
    const otherTrack = tracks.find(t => t.position === newPosition);
    if (!otherTrack) return;

    try {
      // Swap positions
      await supabase
        .from('tracks')
        .update({ position: currentPosition })
        .eq('id', otherTrack.id);

      await supabase
        .from('tracks')
        .update({ position: newPosition })
        .eq('id', trackId);

      toast({
        title: "Position updated",
        description: "Track position has been changed"
      });

      fetchPlaylistTracks();
      onRefresh?.();
    } catch (error) {
      console.error('Move error:', error);
      toast({
        title: "Move failed",
        description: "There was an error moving the track",
        variant: "destructive"
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Playlist #{playlistNumber} ({tracks.length} tracks)
        </h3>
        <Badge variant="outline">
          Total Duration: {formatTime(tracks.reduce((acc, track) => acc + track.duration, 0))}
        </Badge>
      </div>

      {tracks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No tracks in this playlist</h3>
            <p className="text-muted-foreground">Upload tracks and assign them to Playlist #{playlistNumber}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tracks.map((track) => (
            <Card key={track.id}>
              <CardContent className="p-6">
                {editingTrack === track.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`edit-title-${track.id}`}>Title</Label>
                        <Input
                          id={`edit-title-${track.id}`}
                          value={editData.title}
                          onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`edit-artist-${track.id}`}>Artist</Label>
                        <Input
                          id={`edit-artist-${track.id}`}
                          value={editData.artist}
                          onChange={(e) => setEditData(prev => ({ ...prev, artist: e.target.value }))}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`edit-genre-${track.id}`}>Genre</Label>
                        <Input
                          id={`edit-genre-${track.id}`}
                          value={editData.genre}
                          onChange={(e) => setEditData(prev => ({ ...prev, genre: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`edit-producer-${track.id}`}>Producer</Label>
                        <Input
                          id={`edit-producer-${track.id}`}
                          value={editData.producer}
                          onChange={(e) => setEditData(prev => ({ ...prev, producer: e.target.value }))}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`edit-description-${track.id}`}>Description</Label>
                      <Textarea
                        id={`edit-description-${track.id}`}
                        value={editData.description}
                        onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                        rows={2}
                      />
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={() => saveEdit(track.id)} size="sm">
                        <Save className="h-3 w-3 mr-2" />
                        Save
                      </Button>
                      <Button 
                        onClick={() => setEditingTrack(null)} 
                        variant="outline" 
                        size="sm"
                      >
                        <X className="h-3 w-3 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-semibold">
                        {track.position || 1}
                      </div>
                      <div className="flex flex-col gap-1">
                        <Button
                          onClick={() => moveTrack(track.id, 'up')}
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 p-0"
                          disabled={track.position === 1}
                        >
                          <ChevronUp className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={() => moveTrack(track.id, 'down')}
                          variant="outline"
                          size="sm"
                          className="h-6 w-6 p-0"
                          disabled={track.position === tracks.length}
                        >
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      {track.cover_image_url ? (
                        <img 
                          src={track.cover_image_url} 
                          alt={track.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Music className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{track.title}</h3>
                          <p className="text-electric-blue font-medium">{track.artist}</p>
                          {track.genre && (
                            <Badge variant="secondary" className="mt-1 mr-2">
                              {track.genre}
                            </Badge>
                          )}
                          {track.content_type === 'interview' && (
                            <Badge variant="outline" className="mt-1">
                              Interview
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => window.open(track.audio_url, '_blank')} 
                            variant="outline" 
                            size="sm"
                          >
                            <Play className="h-3 w-3" />
                          </Button>
                          <Button 
                            onClick={() => startEdit(track)} 
                            variant="outline" 
                            size="sm"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            onClick={() => deleteTrack(track)} 
                            variant="destructive" 
                            size="sm"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-2 space-y-1">
                        {track.producer && (
                          <p className="text-sm text-muted-foreground">
                            Producer: {track.producer}
                          </p>
                        )}
                        {track.platform && (
                          <p className="text-sm text-muted-foreground">
                            Platform: {track.platform}
                          </p>
                        )}
                        {track.description && (
                          <p className="text-sm text-muted-foreground">
                            {track.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Duration: {formatTime(track.duration)}</span>
                          <span>Uploaded: {new Date(track.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlaylistManagement;