import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Upload, 
  Music, 
  Trash2, 
  Edit, 
  Save, 
  X, 
  Plus,
  Eye,
  EyeOff,
  Home,
  Video 
} from "lucide-react";
import PlaylistManagement from "@/components/PlaylistManagement";
import { Link } from "react-router-dom";

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
  is_featured?: boolean;
}

interface CultureVideo {
  id: string;
  video_url: string;
  title?: string;
  file_size?: number;
  created_at: string;
  user_id?: string | null;
  category?: string;
}

const AdminContent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [videos, setVideos] = useState<CultureVideo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [editingTrack, setEditingTrack] = useState<string | null>(null);

  // Form states
  const [newTrack, setNewTrack] = useState({
    title: "",
    artist: "",
    genre: "",
    producer: "",
    platform: "",
    description: "",
    contentType: "sound" as "sound" | "interview",
    playlistNumber: 1
  });
  
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  
  const [editData, setEditData] = useState({
    title: "",
    artist: "",
    genre: "",
    producer: "",
    platform: "",
    description: ""
  });

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      fetchTracks();
      fetchVideos();
    }
  }, [isAdmin]);

  const checkAdminStatus = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.rpc('is_admin');
      if (error) throw error;
      
      setIsAdmin(data || false);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('culture_videos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVideos(data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast({
        title: "Error",
        description: "Failed to fetch videos",
        variant: "destructive"
      });
    }
  };

  const fetchTracks = async (playlistFilter?: number) => {
    try {
      let query = supabase
        .from('tracks')
        .select('*');
      
      if (playlistFilter) {
        query = query.eq('playlist_number', playlistFilter);
      }
      
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;

      if (error) throw error;
      setTracks(data || []);
    } catch (error) {
      console.error('Error fetching tracks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch tracks",
        variant: "destructive"
      });
    }
  };

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('mp4')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an MP4 video file.",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a video smaller than 50MB.",
        variant: "destructive"
      });
      return;
    }

    setUploadingVideo(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `admin_${Date.now()}_${Math.random()}.${fileExt}`;
      const filePath = `culture-videos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('culture-videos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('culture-videos')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('culture_videos')
        .insert({
          video_url: publicUrl,
          title: file.name,
          file_size: file.size,
          user_id: user?.id || null,
          category: 'general'
        });

      if (dbError) throw dbError;

      toast({
        title: "Upload successful!",
        description: "Your video has been uploaded."
      });

      fetchVideos();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your video.",
        variant: "destructive"
      });
    } finally {
      setUploadingVideo(false);
    }
  };

  const deleteVideo = async (video: CultureVideo) => {
    if (!confirm(`Delete video "${video.title}"? This cannot be undone.`)) return;

    try {
      const url = new URL(video.video_url);
      const filePath = url.pathname.split('/').slice(-2).join('/');

      await supabase.storage.from('culture-videos').remove([filePath]);
      
      const { error: dbError } = await supabase
        .from('culture_videos')
        .delete()
        .eq('id', video.id);

      if (dbError) throw dbError;

      toast({
        title: "Video deleted",
        description: "Video has been removed successfully."
      });

      fetchVideos();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete video.",
        variant: "destructive"
      });
    }
  };

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('audio/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an audio file",
          variant: "destructive"
        });
        return;
      }
      setAudioFile(file);
    }
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type", 
          description: "Please select an image file",
          variant: "destructive"
        });
        return;
      }
      setCoverFile(file);
    }
  };

  const uploadFile = async (file: File, bucket: string, path: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return publicUrl;
  };

  const handleUploadTrack = async () => {
    if (!audioFile || !newTrack.title || !newTrack.artist) {
      toast({
        title: "Missing information",
        description: "Please fill in title, artist and select an audio file",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);
    try {
      // Upload audio file
      const audioPath = `admin/${newTrack.contentType}/${Date.now()}_${audioFile.name}`;
      const audioUrl = await uploadFile(audioFile, 'tracks', audioPath);

      // Upload cover image if provided
      let coverUrl = null;
      if (coverFile) {
        const coverPath = `admin/${Date.now()}_${coverFile.name}`;
        coverUrl = await uploadFile(coverFile, 'covers', coverPath);
      }

      // Get audio duration
      const audio = new Audio();
      audio.src = URL.createObjectURL(audioFile);
      await new Promise((resolve) => {
        audio.addEventListener('loadedmetadata', resolve);
        audio.load();
      });

      // Insert track record
      const { error: insertError } = await supabase
        .from('tracks')
        .insert({
          title: newTrack.title,
          artist: newTrack.artist,
          genre: newTrack.genre || null,
          producer: newTrack.producer || null,
          platform: newTrack.platform || null,
          description: newTrack.description || null,
          audio_url: audioUrl,
          cover_image_url: coverUrl,
          content_type: newTrack.contentType,
          user_id: user?.id,
          file_size: audioFile.size,
          duration: Math.floor(audio.duration),
          playlist_number: newTrack.playlistNumber
        });

      if (insertError) throw insertError;

      toast({
        title: "Success!",
        description: "Track uploaded successfully"
      });

      // Reset form
      setNewTrack({
        title: "",
        artist: "",
        genre: "",
        producer: "",
        platform: "",
        description: "",
        contentType: "sound",
        playlistNumber: 1
      });
      setAudioFile(null);
      setCoverFile(null);
      
      // Refresh tracks
      fetchTracks();

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading the track",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
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
      fetchTracks();
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
    if (!confirm(`Delete "${track.title}"? This cannot be undone.`)) return;

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
        description: `"${track.title}" has been removed`
      });

      fetchTracks();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete failed",
        description: "There was an error deleting the track",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>
              You need to be signed in to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/auth">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="outline">
              <Link to="/">Back to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">SCNRO Content Management</h1>
            <p className="text-muted-foreground">Manage your tracks and content</p>
          </div>
          <Button asChild variant="outline" className="flex items-center gap-2">
            <Link to="/">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Upload Track
            </TabsTrigger>
            <TabsTrigger value="playlist1" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              Playlist #1
            </TabsTrigger>
            <TabsTrigger value="playlist2" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              Playlist #2
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Videos ({videos.length})
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              All Tracks ({tracks.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload New Track
                </CardTitle>
                <CardDescription>
                  Add new audio content to your SCNRO collection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={newTrack.title}
                      onChange={(e) => setNewTrack(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Track title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="artist">Artist *</Label>
                    <Input
                      id="artist"
                      value={newTrack.artist}
                      onChange={(e) => setNewTrack(prev => ({ ...prev, artist: e.target.value }))}
                      placeholder="Artist name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="genre">Genre</Label>
                    <Input
                      id="genre"
                      value={newTrack.genre}
                      onChange={(e) => setNewTrack(prev => ({ ...prev, genre: e.target.value }))}
                      placeholder="e.g. Electronic, Hip-Hop"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contentType">Content Type</Label>
                    <select
                      id="contentType"
                      className="w-full p-2 border rounded-md bg-background"
                      value={newTrack.contentType}
                      onChange={(e) => setNewTrack(prev => ({ ...prev, contentType: e.target.value as "sound" | "interview" }))}
                    >
                      <option value="sound">Sound/Music</option>
                      <option value="interview">Interview/Live</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="producer">Producer</Label>
                    <Input
                      id="producer"
                      value={newTrack.producer}
                      onChange={(e) => setNewTrack(prev => ({ ...prev, producer: e.target.value }))}
                      placeholder="Producer name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="platform">Platform/Distributor</Label>
                    <select
                      id="platform"
                      className="w-full p-2 border rounded-md bg-background"
                      value={newTrack.platform}
                      onChange={(e) => setNewTrack(prev => ({ ...prev, platform: e.target.value }))}
                    >
                      <option value="">Select platform...</option>
                      <option value="YouTube">YouTube</option>
                      <option value="Spotify">Spotify</option>
                      <option value="Apple Music">Apple Music</option>
                      <option value="SoundCloud">SoundCloud</option>
                      <option value="Bandcamp">Bandcamp</option>
                      <option value="DistroKid">Distributed by DistroKid</option>
                      <option value="CD Baby">Distributed by CD Baby</option>
                      <option value="TuneCore">Distributed by TuneCore</option>
                      <option value="LANDR">Distributed by LANDR</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="playlistNumber">Playlist *</Label>
                    <select
                      id="playlistNumber"
                      className="w-full p-2 border rounded-md bg-background"
                      value={newTrack.playlistNumber}
                      onChange={(e) => setNewTrack(prev => ({ ...prev, playlistNumber: parseInt(e.target.value) }))}
                    >
                      <option value={1}>Playlist #1</option>
                      <option value={2}>Playlist #2</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newTrack.description}
                    onChange={(e) => setNewTrack(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Track description..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="audioFile">Audio File *</Label>
                    <Input
                      id="audioFile"
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioFileChange}
                      className="mt-1"
                    />
                    {audioFile && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Selected: {audioFile.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="coverFile">Cover Image</Label>
                    <Input
                      id="coverFile"
                      type="file"
                      accept="image/*"
                      onChange={handleCoverFileChange}
                      className="mt-1"
                    />
                    {coverFile && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Selected: {coverFile.name}
                      </p>
                    )}
                  </div>
                </div>

                <Button 
                  onClick={handleUploadTrack} 
                  disabled={uploading || !audioFile || !newTrack.title || !newTrack.artist}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? "Uploading..." : "Upload Track"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="playlist1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Playlist #1 Management
                </CardTitle>
                <CardDescription>
                  Manage tracks in Scenario Music Playlist #1
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PlaylistManagement 
                  playlistNumber={1}
                  onRefresh={() => fetchTracks(1)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="playlist2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="h-5 w-5" />
                  Playlist #2 Management
                </CardTitle>
                <CardDescription>
                  Manage tracks in Scenario Music Playlist #2
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PlaylistManagement 
                  playlistNumber={2}
                  onRefresh={() => fetchTracks(2)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="videos">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Video Management
                </CardTitle>
                <CardDescription>
                  Upload and manage MP4 videos for the culture feed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept="video/mp4"
                    onChange={handleVideoUpload}
                    className="hidden"
                    id="video-upload"
                    disabled={uploadingVideo}
                  />
                  <label htmlFor="video-upload" className="cursor-pointer">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-lg font-medium mb-2">
                      {uploadingVideo ? 'Uploading...' : 'Upload MP4 Video'}
                    </p>
                    <p className="text-muted-foreground">
                      Click to select an MP4 file (max 50MB)
                    </p>
                  </label>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Current Videos ({videos.length})</h3>
                  {videos.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">No videos yet</h3>
                        <p className="text-muted-foreground">Upload your first video to get started</p>
                      </CardContent>
                    </Card>
                  ) : (
                    videos.map((video) => (
                      <Card key={video.id}>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                              <video 
                                src={video.video_url} 
                                className="w-full h-full object-cover"
                                muted
                              />
                            </div>
                            
                            <div className="flex-1">
                              <h3 className="font-semibold">{video.title || 'Untitled Video'}</h3>
                              <p className="text-sm text-muted-foreground">
                                Category: {video.category || 'general'}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Size: {video.file_size ? (video.file_size / (1024 * 1024)).toFixed(2) + ' MB' : 'Unknown'}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Uploaded: {new Date(video.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => window.open(video.video_url, '_blank')} 
                                variant="outline" 
                                size="sm"
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button 
                                onClick={() => deleteVideo(video)} 
                                variant="destructive" 
                                size="sm"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage">
            <div className="space-y-4">
              {tracks.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">No tracks yet</h3>
                    <p className="text-muted-foreground">Upload your first track to get started</p>
                  </CardContent>
                </Card>
              ) : (
                tracks.map((track) => (
                  <Card key={track.id}>
                    <CardContent className="p-6">
                      {editingTrack === track.id ? (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              value={editData.title}
                              onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                              placeholder="Title"
                            />
                            <Input
                              value={editData.artist}
                              onChange={(e) => setEditData(prev => ({ ...prev, artist: e.target.value }))}
                              placeholder="Artist"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                              value={editData.genre}
                              onChange={(e) => setEditData(prev => ({ ...prev, genre: e.target.value }))}
                              placeholder="Genre"
                            />
                            <Input
                              value={editData.producer}
                              onChange={(e) => setEditData(prev => ({ ...prev, producer: e.target.value }))}
                              placeholder="Producer"
                            />
                          </div>
                          <select
                            className="w-full p-2 border rounded-md bg-background"
                            value={editData.platform}
                            onChange={(e) => setEditData(prev => ({ ...prev, platform: e.target.value }))}
                          >
                            <option value="">Select platform...</option>
                            <option value="YouTube">YouTube</option>
                            <option value="Spotify">Spotify</option>
                            <option value="Apple Music">Apple Music</option>
                            <option value="SoundCloud">SoundCloud</option>
                            <option value="Bandcamp">Bandcamp</option>
                            <option value="DistroKid">Distributed by DistroKid</option>
                            <option value="CD Baby">Distributed by CD Baby</option>
                            <option value="TuneCore">Distributed by TuneCore</option>
                            <option value="LANDR">Distributed by LANDR</option>
                          </select>
                          <Textarea
                            value={editData.description}
                            onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Description"
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button onClick={() => saveEdit(track.id)} size="sm">
                              <Save className="h-3 w-3 mr-2" />
                              Save
                            </Button>
                            <Button onClick={() => setEditingTrack(null)} variant="outline" size="sm">
                              <X className="h-3 w-3 mr-2" />
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                            {track.cover_image_url ? (
                              <img src={track.cover_image_url} alt={track.title} className="w-full h-full object-cover" />
                            ) : (
                              <Music className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="font-semibold">{track.title}</h3>
                            <p className="text-sm text-muted-foreground">{track.artist}</p>
                            <div className="flex items-center gap-4 mt-1 flex-wrap">
                              <span className="text-xs bg-secondary px-2 py-1 rounded-full">
                                {track.content_type}
                              </span>
                              {track.genre && (
                                <span className="text-xs text-muted-foreground">{track.genre}</span>
                              )}
                              {track.producer && (
                                <span className="text-xs text-muted-foreground">Produced by {track.producer}</span>
                              )}
                              {track.platform && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                  {track.platform}
                                </span>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button onClick={() => startEdit(track)} variant="outline" size="sm">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button onClick={() => deleteTrack(track)} variant="destructive" size="sm">
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminContent;