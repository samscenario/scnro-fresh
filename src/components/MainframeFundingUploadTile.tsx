import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Play, X, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface CultureVideo {
  id: string;
  video_url: string;
  title?: string;
  file_size?: number;
  created_at: string;
  user_id?: string | null;
}

const MainframeFundingUploadTile = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedVideo, setUploadedVideo] = useState<CultureVideo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Load existing video on component mount
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
      console.log('Loading latest video from database...');
      const { data, error } = await supabase
        .from('culture_videos')
        .select('*')
        .eq('category', 'mainframe')
        .order('created_at', { ascending: false })
        .limit(1);
      
      console.log('Database response:', { data, error });
      if (error) {
        console.error('Error loading video:', error);
      } else if (data && data.length > 0) {
        console.log('Found video:', data[0]);
        setUploadedVideo(data[0]);
      } else {
        console.log('No videos found in database');
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

    // Check if file is MP4
    if (!file.type.includes('mp4')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an MP4 video file.",
        variant: "destructive",
      });
      return;
    }

    // Check file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a video smaller than 50MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload to Supabase storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random()}.${fileExt}`;
      const filePath = `culture-videos/${fileName}`;
      
      console.log('Starting upload...', { fileName, fileSize: file.size });
      
      const { error: uploadError } = await supabase.storage
        .from('culture-videos')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('Upload successful, getting public URL...');

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('culture-videos')
        .getPublicUrl(filePath);

      console.log('Public URL:', publicUrl);

      // Save to database with 'mainframe' category
      const { data: videoData, error: dbError } = await supabase
        .from('culture_videos')
        .insert({
          video_url: publicUrl,
          title: file.name,
          file_size: file.size,
          user_id: (await supabase.auth.getUser()).data.user?.id || null,
          category: 'mainframe'
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      }

      console.log('Video saved to database:', videoData);
      setUploadedVideo(videoData);

      toast({
        title: "Upload successful!",
        description: "Your video has been uploaded to the Culture Feed.",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your video. Please try again.",
        variant: "destructive",
      });
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

      // Remove from storage
      await supabase.storage.from('culture-videos').remove([filePath]);

      // Remove from database
      await supabase.from('culture_videos').delete().eq('id', uploadedVideo.id);

      setUploadedVideo(null);

      toast({
        title: "Video removed",
        description: "Your video has been removed from the Culture Feed.",
      });
    } catch (error) {
      console.error('Remove error:', error);
      toast({
        title: "Error",
        description: "Failed to remove video. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="relative overflow-hidden border border-electric-blue rounded-lg h-full">
        <div className="h-full bg-gradient-to-br from-purple-900/50 to-blue-900/50 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Show existing video for everyone
  if (uploadedVideo) {
    const canEdit = user && (isAdmin || uploadedVideo.user_id === user.id || uploadedVideo.user_id === null);
    
    return (
      <div className="relative overflow-hidden border border-electric-blue hover:border-acid-green transition-colors rounded-lg h-full group">
        <video 
          ref={(video) => {
            if (video) {
              // Attempt to play video programmatically to handle browser autoplay restrictions
              const playPromise = video.play();
              if (playPromise !== undefined) {
                playPromise.catch(() => {
                  // Autoplay was prevented, video will need user interaction
                  console.log('Autoplay prevented, user interaction required');
                });
              }
            }
          }}
          src={uploadedVideo.video_url} 
          className="w-full h-full object-cover cursor-pointer" 
          controls
          preload="metadata"
          loop
          muted
          autoPlay
          playsInline
          onClick={(e) => {
            const video = e.currentTarget;
            if (video.paused) {
              video.play();
            }
          }}
        />
        
        {/* Control buttons - only show if user can edit */}
        {canEdit && (
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {/* Replace button */}
            <label className="relative cursor-pointer">
              <input 
                type="file" 
                accept="video/mp4" 
                onChange={handleFileUpload} 
                className="sr-only" 
                disabled={isUploading}
              />
              <Button 
                size="sm" 
                className="bg-electric-blue hover:bg-electric-blue/90 text-black pointer-events-none"
                disabled={isUploading}
                asChild
              >
                <div className="pointer-events-auto">
                  <Upload className="w-4 h-4" />
                </div>
              </Button>
            </label>
            
            {/* Remove button */}
            <Button 
              size="sm" 
              variant="destructive" 
              onClick={removeVideo}
              className="bg-red-500 hover:bg-red-600"
              disabled={isUploading}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
        
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    );
  }

  // Show upload interface only for authenticated users
  if (!user) {
    return (
      <div className="relative overflow-hidden border border-electric-blue rounded-lg h-full">
        <div className="h-full bg-gradient-to-br from-purple-900/50 to-blue-900/50 flex flex-col items-center justify-center relative p-4">
          <Lock className="w-8 h-8 text-white/50 mb-2 mx-auto" />
          <p className="text-white/70 text-sm text-center">
            Sign in to upload videos
          </p>
        </div>
      </div>
    );
  }

  return (
    <label className="relative overflow-hidden border border-electric-blue hover:border-acid-green transition-colors rounded-lg h-full cursor-pointer block">
      <input 
        type="file" 
        accept="video/mp4" 
        onChange={handleFileUpload} 
        className="sr-only" 
        disabled={isUploading}
      />
      
      <div className="h-full bg-gradient-to-br from-purple-900/50 to-blue-900/50 flex flex-col items-center justify-center relative p-4">
        <div className="text-center">
          <Upload className={`w-8 h-8 text-white mb-2 mx-auto ${isUploading ? 'animate-pulse' : ''}`} />
          <p className="text-white text-sm font-medium mb-1">
            {isUploading ? 'Uploading...' : 'Upload MP4'}
          </p>
          <p className="text-white/70 text-xs">
            Max 50MB
          </p>
        </div>
        
        {isUploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </label>
  );
};

export default MainframeFundingUploadTile;