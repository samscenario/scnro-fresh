import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Upload, Music, X } from "lucide-react";

interface AudioUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete?: () => void;
  playlistNumber?: number;
}

const AudioUploadModal: React.FC<AudioUploadModalProps> = ({ isOpen, onClose, onUploadComplete, playlistNumber = 1 }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    genre: "",
    description: "",
    contentType: "sound" as "sound" | "interview"
  });
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [audioDuration, setAudioDuration] = useState<number>(0);
  const { user } = useAuth();

  const resetForm = () => {
    setFormData({
      title: "",
      artist: "",
      genre: "",
      description: "",
      contentType: "sound"
    });
    setAudioFile(null);
    setCoverFile(null);
    setAudioDuration(0);
  };

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/aac'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid audio file (MP3, WAV, M4A, AAC)');
      return;
    }

    // Validate file size (100MB max)
    const maxSizeInBytes = 100 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      toast.error('File size must be less than 100MB');
      return;
    }

    setAudioFile(file);

    // Get audio duration
    const audio = new Audio();
    audio.src = URL.createObjectURL(file);
    audio.addEventListener('loadedmetadata', () => {
      setAudioDuration(audio.duration);
      URL.revokeObjectURL(audio.src);
    });
  };

  const handleCoverFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image file (JPEG, PNG, WebP)');
      return;
    }

    // Validate file size (10MB max)
    const maxSizeInBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    setCoverFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to upload tracks');
      return;
    }

    if (!audioFile || !formData.title || !formData.artist) {
      toast.error('Please fill in all required fields and select an audio file');
      return;
    }

    setIsUploading(true);

    try {
      // Upload audio file
      const audioExt = audioFile.name.split('.').pop();
      const audioFileName = `${Date.now()}_${Math.random()}.${audioExt}`;
      const audioPath = `tracks/${audioFileName}`;

      const { error: audioUploadError } = await supabase.storage
        .from('tracks')
        .upload(audioPath, audioFile);

      if (audioUploadError) {
        throw audioUploadError;
      }

      // Get audio public URL
      const { data: { publicUrl: audioUrl } } = supabase.storage
        .from('tracks')
        .getPublicUrl(audioPath);

      // Upload cover image if provided
      let coverImageUrl = null;
      if (coverFile) {
        const coverExt = coverFile.name.split('.').pop();
        const coverFileName = `${Date.now()}_${Math.random()}.${coverExt}`;
        const coverPath = `covers/${coverFileName}`;

        const { error: coverUploadError } = await supabase.storage
          .from('covers')
          .upload(coverPath, coverFile);

        if (coverUploadError) {
          console.warn('Cover upload failed:', coverUploadError);
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('covers')
            .getPublicUrl(coverPath);
          coverImageUrl = publicUrl;
        }
      }

      // Save track metadata to database
      const { error: dbError } = await supabase
        .from('tracks')
        .insert({
          title: formData.title,
          artist: formData.artist,
          genre: formData.genre || null,
          description: formData.description || null,
          audio_url: audioUrl,
          cover_image_url: coverImageUrl,
          duration: Math.floor(audioDuration),
          content_type: formData.contentType,
          file_size: audioFile.size,
          user_id: user.id,
          playlist_number: playlistNumber
        });

      if (dbError) {
        throw dbError;
      }

      toast.success('Track uploaded successfully! 🎵');
      resetForm();
      onUploadComplete?.();
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload track. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-2 border-electric-blue/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Upload className="w-6 h-6 text-electric-blue" />
                Upload Track
              </CardTitle>
              <CardDescription>
                Share your music with the SCNRO community
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Audio File Upload */}
            <div className="space-y-2">
              <Label htmlFor="audio-file" className="text-lg font-semibold">Audio File *</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                {audioFile ? (
                  <div className="space-y-2">
                    <Music className="w-12 h-12 text-electric-blue mx-auto" />
                    <p className="font-medium">{audioFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(audioFile.size)} • {audioDuration > 0 ? formatDuration(audioDuration) : 'Loading...'}
                    </p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setAudioFile(null)}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <label htmlFor="audio-file" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="font-medium">Click to upload audio file</p>
                    <p className="text-sm text-muted-foreground">MP3, WAV, M4A, AAC (max 100MB)</p>
                    <input
                      id="audio-file"
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Track Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Track title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="artist">Artist *</Label>
                <Input
                  id="artist"
                  value={formData.artist}
                  onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                  placeholder="Artist name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="genre">Genre</Label>
                <Input
                  id="genre"
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  placeholder="e.g. Electronic, Hip-Hop, Rock"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content-type">Content Type</Label>
                <Select 
                  value={formData.contentType} 
                  onValueChange={(value: "sound" | "interview") => setFormData({ ...formData, contentType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sound">Music/Sound</SelectItem>
                    <SelectItem value="interview">Interview/Podcast</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tell us about your track..."
                rows={3}
              />
            </div>

            {/* Cover Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="cover-file">Cover Art (Optional)</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                {coverFile ? (
                  <div className="space-y-2">
                    <img 
                      src={URL.createObjectURL(coverFile)} 
                      alt="Cover preview" 
                      className="w-20 h-20 object-cover rounded-lg mx-auto"
                    />
                    <p className="font-medium">{coverFile.name}</p>
                    <p className="text-sm text-muted-foreground">{formatFileSize(coverFile.size)}</p>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCoverFile(null)}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <label htmlFor="cover-file" className="cursor-pointer">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium">Upload cover art</p>
                    <p className="text-xs text-muted-foreground">JPEG, PNG, WebP (max 10MB)</p>
                    <input
                      id="cover-file"
                      type="file"
                      accept="image/*"
                      onChange={handleCoverFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isUploading || !audioFile || !formData.title || !formData.artist}
                className="flex-1"
              >
                {isUploading ? "Uploading..." : "Upload Track"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AudioUploadModal;