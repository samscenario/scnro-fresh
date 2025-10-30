import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Music, Plus } from "lucide-react";
import AudioUploadModal from "./AudioUploadModal";
import { useAuth } from "@/hooks/useAuth";

interface AudioUploadButtonProps {
  onUploadComplete?: () => void;
  variant?: "button" | "tile" | "fab";
  className?: string;
  playlistNumber?: number;
}

const AudioUploadButton: React.FC<AudioUploadButtonProps> = ({ 
  onUploadComplete, 
  variant = "button",
  className = "",
  playlistNumber = 1
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  const handleUploadComplete = () => {
    onUploadComplete?.();
    setIsModalOpen(false);
  };

  if (variant === "tile") {
    return (
      <>
        <div 
          onClick={() => setIsModalOpen(true)}
          className={`
            relative overflow-hidden border-2 border-dashed border-electric-blue/50 hover:border-electric-blue 
            rounded-2xl cursor-pointer transition-all duration-200 hover:scale-105 group 
            bg-gradient-to-br from-electric-blue/10 to-cyber-purple/10 hover:from-electric-blue/20 hover:to-cyber-purple/20
            ${className}
          `}
        >
          <div className="flex flex-col items-center justify-center p-8 text-center h-full min-h-[200px]">
            <div className="w-16 h-16 bg-gradient-to-br from-electric-blue to-cyber-purple rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Upload Your Track</h3>
            <p className="text-sm text-white/70 mb-4">Share your music with the community</p>
            {!user && (
              <p className="text-xs text-electric-blue">Login required</p>
            )}
          </div>
        </div>
        
        {isModalOpen && (
          <AudioUploadModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onUploadComplete={handleUploadComplete}
            playlistNumber={playlistNumber}
          />
        )}
      </>
    );
  }

  if (variant === "fab") {
    return (
      <>
        <Button
          onClick={() => setIsModalOpen(true)}
          disabled={!user}
          className={`
            fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg bg-gradient-to-r from-electric-blue to-cyber-purple 
            hover:from-electric-blue/80 hover:to-cyber-purple/80 border-2 border-white/20 z-40
            ${className}
          `}
        >
          <Plus className="w-6 h-6" />
        </Button>
        
        {isModalOpen && (
          <AudioUploadModal 
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onUploadComplete={handleUploadComplete}
            playlistNumber={playlistNumber}
          />
        )}
      </>
    );
  }

  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        disabled={!user}
        className={`flex items-center gap-2 ${className}`}
      >
        <Upload className="w-4 h-4" />
        Upload Track
      </Button>
      
      {isModalOpen && (
        <AudioUploadModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUploadComplete={handleUploadComplete}
          playlistNumber={playlistNumber}
        />
      )}
    </>
  );
};

export default AudioUploadButton;