import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Upload, Music, Video, Trash2 } from "lucide-react";

// This component would be used by admins to manage curated content
// In a real implementation, this would connect to a CMS or admin database

const AdminContentManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  // This would check if user has admin role
  const isAdmin = false; // Replace with actual admin check

  const [newTrack, setNewTrack] = useState({
    title: "",
    artist: "",
    genre: "",
    description: "",
    contentType: "sound" as "sound" | "interview"
  });

  const [newVideo, setNewVideo] = useState({
    title: "",
    description: "",
    type: ""
  });

  const handleTrackSubmit = async () => {
    if (!newTrack.title || !newTrack.artist) {
      toast({
        title: "Error",
        description: "Title and artist are required",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    // Here you would upload to your CMS or admin-managed database
    // For now, just show success message
    
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Track added to curated content"
      });
      setNewTrack({ title: "", artist: "", genre: "", description: "", contentType: "sound" });
      setIsUploading(false);
    }, 1000);
  };

  const handleVideoSubmit = async () => {
    if (!newVideo.title) {
      toast({
        title: "Error", 
        description: "Title is required",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    // Here you would upload to your CMS or admin-managed database
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Video added to curated content"
      });
      setNewVideo({ title: "", description: "", type: "" });
      setIsUploading(false);
    }, 1000);
  };

  if (!user || !isAdmin) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Admin Access Required</CardTitle>
          <CardDescription>
            This content management area is restricted to administrators
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>SCNRO Content Management</CardTitle>
          <CardDescription>
            Manage curated content displayed on the platform
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="tracks" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tracks">Manage Tracks</TabsTrigger>
          <TabsTrigger value="videos">Manage Videos</TabsTrigger>
        </TabsList>

        <TabsContent value="tracks">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                Add New Track
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="track-title">Title</Label>
                  <Input
                    id="track-title"
                    value={newTrack.title}
                    onChange={(e) => setNewTrack({ ...newTrack, title: e.target.value })}
                    placeholder="Track title"
                  />
                </div>
                <div>
                  <Label htmlFor="track-artist">Artist</Label>
                  <Input
                    id="track-artist"
                    value={newTrack.artist}
                    onChange={(e) => setNewTrack({ ...newTrack, artist: e.target.value })}
                    placeholder="Artist name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="track-genre">Genre</Label>
                  <Input
                    id="track-genre"
                    value={newTrack.genre}
                    onChange={(e) => setNewTrack({ ...newTrack, genre: e.target.value })}
                    placeholder="Music genre"
                  />
                </div>
                <div>
                  <Label htmlFor="content-type">Content Type</Label>
                  <select
                    id="content-type"
                    className="w-full p-2 border rounded-md"
                    value={newTrack.contentType}
                    onChange={(e) => setNewTrack({ ...newTrack, contentType: e.target.value as "sound" | "interview" })}
                  >
                    <option value="sound">Sound/Music</option>
                    <option value="interview">Interview/Live</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="track-description">Description</Label>
                <Textarea
                  id="track-description"
                  value={newTrack.description}
                  onChange={(e) => setNewTrack({ ...newTrack, description: e.target.value })}
                  placeholder="Track description"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="track-file">Audio File</Label>
                <Input
                  id="track-file"
                  type="file"
                  accept="audio/*"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="track-cover">Cover Image</Label>
                <Input
                  id="track-cover"
                  type="file"
                  accept="image/*"
                  className="mt-1"
                />
              </div>

              <Button onClick={handleTrackSubmit} disabled={isUploading} className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? "Adding..." : "Add Track"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="videos">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5" />
                Add New Video
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="video-title">Title</Label>
                <Input
                  id="video-title"
                  value={newVideo.title}
                  onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                  placeholder="Video title"
                />
              </div>

              <div>
                <Label htmlFor="video-type">Video Type</Label>
                <Input
                  id="video-type"
                  value={newVideo.type}
                  onChange={(e) => setNewVideo({ ...newVideo, type: e.target.value })}
                  placeholder="e.g. Live Session, Interview, Documentary"
                />
              </div>

              <div>
                <Label htmlFor="video-description">Description</Label>
                <Textarea
                  id="video-description"
                  value={newVideo.description}
                  onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                  placeholder="Video description"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="video-file">Video File</Label>
                <Input
                  id="video-file"
                  type="file"
                  accept="video/*"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="video-thumbnail">Thumbnail Image</Label>
                <Input
                  id="video-thumbnail"
                  type="file"
                  accept="image/*"
                  className="mt-1"
                />
              </div>

              <Button onClick={handleVideoSubmit} disabled={isUploading} className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? "Adding..." : "Add Video"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminContentManager;