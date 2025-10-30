import { useState, useEffect } from "react";
import { Play, Video } from "lucide-react";

// Curated featured video content
const featuredVideo = {
  name: "SCNRO Underground Sessions",
  thumbnail: "/placeholder.svg",
  duration: "15:30",
  description: "Exclusive live performance from our underground studio"
};

const VideoDisplayTile = () => {
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(prev => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, []);


  const handleClick = () => {
    // Navigate to curated video content
    window.open('/signal#curated-content', '_blank');
  };


  return (
    <div 
      className="aspect-[9/16] bg-black border-2 border-electric-blue/30 rounded-xl overflow-hidden relative cursor-pointer group transform hover:scale-105 transition-all duration-300"
      onClick={handleClick}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20 animate-pulse" />
      
      {/* Glitch Overlay */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r from-electric-blue/30 to-transparent transition-opacity duration-300 ${
          glitchActive ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Content */}
      <div className="relative w-full h-full flex flex-col items-center justify-center p-4 text-center">
        {/* Featured Video Preview */}
        <div className="w-full h-2/3 mb-4 rounded-lg overflow-hidden bg-gray-900 flex items-center justify-center">
          <img 
            src={featuredVideo.thumbnail} 
            alt="Featured SCNRO content"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Video Info */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-2">FEATURED</p>
          <h3 className="text-sm font-bold text-white truncate max-w-full">
            {featuredVideo.name}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {featuredVideo.duration}
          </p>
        </div>

        {/* Animated Border Lines */}
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-electric-blue to-transparent animate-pulse" />
        <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
      </div>

      {/* Floating Particles */}
      <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-ping opacity-60" />
      <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-electric-blue rounded-full animate-ping opacity-40 animation-delay-1000" />
    </div>
  );
};

export default VideoDisplayTile;