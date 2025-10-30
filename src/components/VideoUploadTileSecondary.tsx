import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Upload, X, Lock } from "lucide-react";

interface CultureVideo {
  id: string;
  video_url: string;
  title: string | null;
  file_size: number | null;
  created_at: string;
  category: string;
  user_id?: string | null;
}

const VideoUploadTileSecondary = () => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedVideo, setUploadedVideo] = useState<CultureVideo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    loadLatestVideo();
  }, []);

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    } else {
      setIsAdmin(false);
    }
  }, [user]);

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

  const loadLatestVideo = async () => {
    try {
      const { data, error } = await supabase
        .from('culture_videos')
        .select('*')
        .eq('category', 'secondary')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading video:', error);
        return;
      }

      if (data) {
        setUploadedVideo(data);
      }
    } catch (error) {
      console.error('Error loading video:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/mp4')) {
      toast.error('Please upload an MP4 video file');
      return;
    }

    // Validate file size (50MB max)
    const maxSizeInBytes = 50 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      toast.error('File size must be less than 50MB');
      return;
    }

    setIsUploading(true);

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `culture-videos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('culture-videos')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('culture-videos')
        .getPublicUrl(filePath);

      // Save video metadata to database with 'secondary' category
      const { data: videoData, error: dbError } = await supabase
        .from('culture_videos')
        .insert({
          video_url: publicUrl,
          title: file.name.replace(/\.[^/.]+$/, ""),
          file_size: file.size,
          user_id: user?.id || null,
          category: 'secondary'
        })
        .select()
        .single();

      if (dbError) {
        throw dbError;
      }

      setUploadedVideo(videoData);
      toast.success('Video uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload video');
    } finally {
      setIsUploading(false);
    }
  };

  const removeVideo = async () => {
    if (!uploadedVideo) return;

    try {
      // Extract file path from URL
      const url = new URL(uploadedVideo.video_url);
      const filePath = url.pathname.split('/').slice(-2).join('/');

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('culture-videos')
        .remove([filePath]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('culture_videos')
        .delete()
        .eq('id', uploadedVideo.id);

      if (dbError) {
        throw dbError;
      }

      setUploadedVideo(null);
      toast.success('Video removed successfully');
    } catch (error) {
      console.error('Remove error:', error);
      toast.error('Failed to remove video');
    }
  };

  if (isLoading) {
    return (
      <div className="relative overflow-hidden border border-gray-600 rounded-lg h-full">
        <div className="h-full bg-black flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-blue"></div>
        </div>
      </div>
    );
  }

  // Show uploaded video for everyone, but only allow editing by owner or admin
  if (uploadedVideo) {
    const canEdit = user && (isAdmin || uploadedVideo.user_id === user.id || uploadedVideo.user_id === null);
    
    return (
      <div className="relative overflow-hidden border border-gray-600 hover:border-hot-pink transition-colors rounded-lg h-full group">
        <div className="relative h-full bg-black">
          <video 
            src={uploadedVideo.video_url}
            className="w-full h-full object-cover"
            controls={true}
            muted
            loop
            playsInline
            onTouchEnd={(e) => {
              e.stopPropagation();
              const video = e.currentTarget;
              video.play().catch(console.error);
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const video = e.currentTarget;
              if (video.paused) {
                video.play().catch(console.error);
              } else {
                video.pause();
              }
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
            }}
            autoPlay
            onCanPlay={(e) => {
              const video = e.currentTarget;
              video.play().catch(() => {
                console.log('Autoplay prevented');
              });
            }}
          />
          {canEdit && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white shadow-lg z-50 border border-white"
              onClick={removeVideo}
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Show upload interface only for authenticated users
  if (!user) {
    return (
      <div className="relative overflow-hidden border border-gray-600 rounded-lg h-full">
        <div className="h-full bg-gradient-to-br from-blue-900 to-pink-900 flex items-center justify-center relative">
          <div className="text-center">
            <Lock className="w-8 h-8 text-white/50 mx-auto mb-2" />
            <p className="text-sm text-white/70">Sign in to upload videos</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden border border-gray-600 hover:border-hot-pink transition-colors rounded-lg h-full">
      <div className="h-full bg-gradient-to-br from-blue-900 to-pink-900 flex items-center justify-center relative">
        {isUploading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-hot-pink mx-auto mb-2"></div>
            <p className="text-sm text-white">Uploading...</p>
          </div>
        ) : (
          <label className="cursor-pointer text-center">
            <Upload className="w-8 h-8 text-hot-pink mx-auto mb-2" />
            <p className="text-sm text-white mb-1">Upload Video</p>
            <p className="text-xs text-gray-300">MP4, Max 50MB</p>
            <input
              type="file"
              accept="video/mp4"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default VideoUploadTileSecondary;