import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const YouTubePortalTile = () => {
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 300);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-lg bg-red-600 border border-white p-4 group hover:border-white/80 transition-all duration-300 h-full flex flex-col justify-between">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-700 to-red-800"></div>
      
      {/* Glitch Background Effects */}
      <div className={`absolute inset-0 transition-all duration-150 ${glitchActive ? 'animate-pulse' : ''}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent translate-x-full animate-[slide-in-right_2s_ease-in-out_infinite]"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-orange-500/10 to-transparent -translate-x-full animate-[slide-in-right_2.8s_ease-in-out_infinite]"></div>
      </div>

      {/* Glitch Overlay */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${glitchActive ? 'opacity-30' : ''}`}>
        <div className="absolute inset-0 bg-red-500/5 transform skew-x-1"></div>
        <div className="absolute inset-0 bg-orange-500/5 transform -skew-x-1"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Top Section */}
        <div className="text-center space-y-3">
          {/* YouTube Play Button Effect */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center animate-pulse">
                <Play className="w-4 h-4 text-white fill-white ml-0.5" />
              </div>
              <div className={`absolute inset-0 w-8 h-8 rounded-full bg-red-500/20 transform translate-x-1 translate-y-1 transition-transform duration-150 ${glitchActive ? 'translate-x-2 translate-y-2' : ''}`}></div>
            </div>
          </div>

        </div>

        {/* Middle Section */}
        <div className="text-center px-2">
          <p className={`text-xs leading-tight bg-gradient-to-r from-red-400 via-white to-orange-400 bg-clip-text text-transparent transition-all duration-150 ${glitchActive ? 'animate-pulse' : ''}`}>
            Watch SCNRO content. Vlogs, sessions, festivals.
          </p>
        </div>

        {/* Bottom Section */}
        <div className="flex justify-center">
          <div className="relative">
            <Button 
              variant="outline"
              size="sm"
              className="bg-transparent border-0 text-red-400 hover:bg-red-500 hover:text-white font-bold px-4 py-2 text-sm transition-all duration-300 group-hover:animate-pulse"
              onClick={() => window.open('https://youtube.com/@scnro', '_blank')}
            >
              <span className="relative">
                Visit Our Channel
                <div className={`absolute inset-0 transition-all duration-75 ${glitchActive ? 'transform translate-x-0.5 text-orange-400' : 'opacity-0'}`}>
                  Visit Our Channel
                </div>
              </span>
            </Button>
          </div>
        </div>

        {/* Animated Border Lines */}
        <div className="absolute -top-4 -left-4 -right-4 h-px bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
        <div className="absolute -bottom-4 -left-4 -right-4 h-px bg-gradient-to-r from-transparent via-white to-transparent animate-pulse"></div>
        <div className="absolute -left-4 -top-4 -bottom-4 w-px bg-gradient-to-b from-transparent via-white to-transparent animate-pulse"></div>
        <div className="absolute -right-4 -top-4 -bottom-4 w-px bg-gradient-to-b from-transparent via-white to-transparent animate-pulse"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-red-500 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-orange-400 rounded-full animate-ping animation-delay-500"></div>
        <div className="absolute bottom-1/3 left-2/3 w-1 h-1 bg-red-400/60 rounded-full animate-ping animation-delay-1000"></div>
      </div>
    </div>
  );
};

export default YouTubePortalTile;