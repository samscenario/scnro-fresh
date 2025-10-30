import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Lock, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CultureImage {
  id: string;
  image_url: string;
  title: string;
  file_size: number;
  created_at: string;
  user_id?: string;
}

const ImageUploadTileBottomRight = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<CultureImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadLatestImage();
  }, []);

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase.rpc('is_admin');
      if (error) throw error;
      setIsAdmin(data || false);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const loadLatestImage = async () => {
    try {
      // Check if we need to create a culture_images table or use existing storage
      // For now, let's use the covers bucket for images
      const { data, error } = await supabase.storage
        .from('covers')
        .list('culture-images/', {
          limit: 1,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error && error.message !== 'The resource was not found') {
        throw error;
      }

      if (data && data.length > 0) {
        const latestFile = data[0];
        const { data: { publicUrl } } = supabase.storage
          .from('covers')
          .getPublicUrl(`culture-images/${latestFile.name}`);
        
        setUploadedImage({
          id: latestFile.id || latestFile.name,
          image_url: publicUrl,
          title: latestFile.name,
          file_size: latestFile.metadata?.size || 0,
          created_at: latestFile.created_at || new Date().toISOString(),
          user_id: user?.id
        });
      }
    } catch (error) {
      console.error('Error loading image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.match(/^image\/(png|jpe?g)$/i)) {
      toast.error('Please upload a PNG or JPEG image file');
      return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image file must be smaller than 10MB');
      return;
    }

    setIsUploading(true);

    try {
      // Upload to Supabase Storage
      const fileExtension = file.name.split('.').pop();
      const fileName = `culture-images/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExtension}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('covers')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('covers')
        .getPublicUrl(fileName);

      const newImage: CultureImage = {
        id: fileName,
        image_url: publicUrl,
        title: file.name,
        file_size: file.size,
        created_at: new Date().toISOString(),
        user_id: user.id
      };

      setUploadedImage(newImage);
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = async () => {
    if (!uploadedImage || !user) return;

    try {
      // Extract file path from the stored ID (which is the file path)
      const filePath = uploadedImage.id;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('covers')
        .remove([filePath]);

      if (storageError) throw storageError;

      setUploadedImage(null);
      toast.success('Image removed successfully!');
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Failed to remove image');
    }
  };

  if (isLoading) {
    return (
      <div className="relative overflow-hidden border border-gray-600 rounded-lg h-full">
        <div className="h-full bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (uploadedImage) {
    return (
      <div className="relative overflow-hidden border border-gray-600 hover:border-hot-pink transition-colors rounded-lg h-full group">
        <img 
          src={uploadedImage.image_url}
          alt={uploadedImage.title}
          className="w-full h-full object-cover"
        />
        
        {/* Admin/Owner Controls Overlay */}
        {(isAdmin || uploadedImage.user_id === user?.id) && (
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              onClick={removeImage}
              size="sm"
              variant="destructive"
              className="w-8 h-8 p-0"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Upload New Image Button for Admins/Owners */}
        {(isAdmin || uploadedImage.user_id === user?.id) && (
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <label htmlFor="culture-image-upload" className="cursor-pointer">
              <div className="bg-white/20 hover:bg-white/30 border border-white/50 rounded-md p-2 inline-flex items-center justify-center">
                {isUploading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Upload className="w-4 h-4 text-white" />
                )}
              </div>
            </label>
            <input
              id="culture-image-upload"
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
          </div>
        )}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative overflow-hidden border border-gray-600 rounded-lg h-full">
        <div className="h-full bg-gradient-to-br from-purple-900 to-pink-900 flex flex-col items-center justify-center text-white p-4">
          <Lock className="w-8 h-8 mb-2 opacity-60" />
          <p className="text-sm text-center opacity-80">Sign in to upload</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden border border-gray-600 hover:border-hot-pink transition-colors rounded-lg h-full">
      <div className="h-full bg-gradient-to-br from-purple-900 to-pink-900 flex flex-col items-center justify-center text-white p-4">
        <label htmlFor="culture-image-upload-new" className="cursor-pointer flex flex-col items-center">
          <div className="mb-3 bg-white/20 hover:bg-white/30 border border-white/50 w-12 h-12 rounded-full flex items-center justify-center transition-colors">
            {isUploading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
            ) : (
              <ImageIcon className="w-6 h-6" />
            )}
          </div>
          <p className="text-sm text-center font-medium">
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </p>
          <p className="text-xs text-center opacity-80 mt-1">PNG/JPEG, Max 10MB</p>
        </label>
        <input
          id="culture-image-upload-new"
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          onChange={handleFileUpload}
          className="hidden"
          disabled={isUploading}
        />
      </div>
    </div>
  );
};

export default ImageUploadTileBottomRight;