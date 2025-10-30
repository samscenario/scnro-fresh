import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Loader2, Upload, Lock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CultureVideo {
  id: string;
  video_url: string;
  title: string;
  file_size: number;
  created_at: string;
  user_id?: string;
}

const MainframeVideoUploadTile = () => {
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
    }
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.rpc('is_admin', { user_id: user.id });
      if (error) {
        console.error('Error checking admin status:', error);
        return;
      }
      setIsAdmin(data || false);
    } catch (error) {
      console.error('Error checking admin status:', error);
    }
  };

  const loadLatestVideo = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('culture_videos')
        .select('*')
        .eq('category', 'mainframe')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error loading video:', error);
        return;
      }

      if (data && data.length > 0) {
        setUploadedVideo(data[0]);
      }
    } catch (error) {
      console.error('Error loading video:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Check file type
    if (!file.type.startsWith('video/mp4')) {
      toast.error('Please upload an MP4 video file');
      return;
    }

    // Check file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('File size must be less than 50MB');
      return;
    }

    setIsUploading(true);
    
    try {
      // Generate unique filename
      const fileName = `mainframe-${Date.now()}.mp4`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('culture-videos')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error('Failed to upload video');
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('culture-videos')
        .getPublicUrl(fileName);

      // Save video info to database
      const { data: videoData, error: dbError } = await supabase
        .from('culture_videos')
        .insert([
          {
            video_url: urlData.publicUrl,
            title: file.name,
            file_size: file.size,
            user_id: user.id,
            category: 'mainframe'
          }
        ])
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        toast.error('Failed to save video info');
        return;
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
      // Extract filename from URL
      const fileName = uploadedVideo.video_url.split('/').pop();
      
      if (fileName) {
        // Delete from storage
        const { error: storageError } = await supabase.storage
          .from('culture-videos')
          .remove([fileName]);

        if (storageError) {
          console.error('Storage deletion error:', storageError);
        }
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('culture_videos')
        .delete()
        .eq('id', uploadedVideo.id);

      if (dbError) {
        console.error('Database deletion error:', dbError);
        toast.error('Failed to remove video');
        return;
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
      <div className="bg-black border-2 border-white rounded-xl px-4 py-6 md:px-8 md:py-12 text-center font-bold text-lg md:text-xl transition-all duration-300 transform hover:scale-105 md:hover:scale-105 hover:scale-[1.02] relative overflow-hidden group text-white">
        <div className="flex flex-col items-center gap-3 md:gap-6 h-[80px] md:h-[120px] justify-center">
          <Loader2 className="h-6 md:h-8 w-6 md:w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black border-2 border-white rounded-xl px-4 py-6 md:px-8 md:py-12 text-center font-bold text-lg md:text-xl transition-all duration-300 transform hover:scale-105 md:hover:scale-105 hover:scale-[1.02] relative overflow-hidden group text-white">
      <div className="flex flex-col items-center gap-3 md:gap-6 h-[80px] md:h-[120px] justify-center relative z-10">
        {uploadedVideo ? (
          <div className="h-full w-full flex items-center justify-center relative bg-transparent">
            <video 
              src={uploadedVideo.video_url} 
              className="w-full h-full object-cover rounded-lg"
              controls
              muted
              playsInline
            />
            
            {/* Controls overlay */}
            {(user?.id === uploadedVideo.user_id || isAdmin) && (
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <input
                  type="file"
                  accept="video/mp4"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="mainframe-replace-upload"
                  disabled={isUploading}
                />
                <label htmlFor="mainframe-replace-upload">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-8 w-8 p-0"
                    disabled={isUploading}
                    asChild
                  >
                    <span className="cursor-pointer">
                      {isUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                    </span>
                  </Button>
                </label>
                
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-8 w-8 p-0"
                  onClick={removeVideo}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <div className="text-white text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                  <div className="text-sm">Uploading...</div>
                </div>
              </div>
            )}
          </div>
        ) : !user ? (
          <>
            <Lock className="h-6 md:h-8 w-6 md:w-8 mb-2 opacity-60" />
            <div className="text-xs md:text-sm text-center opacity-80">
              Sign in to upload
            </div>
          </>
        ) : (
          <>
            {isUploading ? (
              <div className="text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                <div className="text-xs md:text-sm">Uploading...</div>
              </div>
            ) : (
              <>
                <input
                  type="file"
                  accept="video/mp4"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="mainframe-upload"
                />
                <label htmlFor="mainframe-upload">
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-black text-xs md:text-sm"
                    asChild
                  >
                    <span className="cursor-pointer flex items-center gap-2">
                      <Upload className="h-3 md:h-4 w-3 md:w-4" />
                      Upload MP4
                    </span>
                  </Button>
                </label>
                <div className="text-xs opacity-60 text-center mt-1">
                  Max 50MB
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MainframeVideoUploadTile;