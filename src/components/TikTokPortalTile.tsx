import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const TikTokPortalTile = () => {
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 300);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-lg bg-black border border-electric-blue/30 p-4 group hover:border-electric-blue/60 transition-all duration-300 h-full flex flex-col justify-between">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-900/20 to-black"></div>
      
      {/* Glitch Background Effects */}
      <div className={`absolute inset-0 transition-all duration-150 ${glitchActive ? 'animate-pulse' : ''}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-electric-blue/10 to-transparent translate-x-full animate-[slide-in-right_2s_ease-in-out_infinite]"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-purple-500/10 to-transparent -translate-x-full animate-[slide-in-right_2.5s_ease-in-out_infinite]"></div>
      </div>

      {/* Glitch Overlay */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${glitchActive ? 'opacity-30' : ''}`}>
        <div className="absolute inset-0 bg-electric-blue/5 transform skew-x-1"></div>
        <div className="absolute inset-0 bg-purple-500/5 transform -skew-x-1"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Top Section */}
        <div className="text-center space-y-3">
          {/* TikTok Icon Effect */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-electric-blue to-purple-500 flex items-center justify-center text-lg font-bold text-black animate-pulse overflow-hidden">
                <img 
                  src="/lovable-uploads/6e274fd0-3e33-48f6-a2d0-5baca163f161.png" 
                  alt="TikTok Logo" 
                  className="w-5 h-5 object-contain"
                />
              </div>
              <div className={`absolute inset-0 w-8 h-8 rounded-lg bg-electric-blue/20 transform translate-x-1 translate-y-1 transition-transform duration-150 ${glitchActive ? 'translate-x-2 translate-y-2' : ''}`}></div>
            </div>
          </div>

          {/* Glitch Text Effect */}
          <div className="relative">
            <p className="text-electric-blue text-xs font-medium opacity-60">
              DISCOVER MORE
            </p>
            <div className={`absolute inset-0 text-electric-blue text-xs font-medium transition-all duration-75 ${glitchActive ? 'transform translate-x-0.5 opacity-40' : 'opacity-0'}`}>
              DISCOVER MORE
            </div>
          </div>
        </div>

        {/* Middle Section */}
        <div className="text-center">
          <h3 className={`text-sm font-bold bg-gradient-to-r from-electric-blue via-white to-purple-400 bg-clip-text text-transparent transition-all duration-150 ${glitchActive ? 'animate-pulse' : ''}`}>
            Follow SCNRO<br />on TikTok
          </h3>
        </div>

        {/* Bottom Section */}
        <div className="text-center">
          <Button 
            variant="outline"
            size="sm"
            className="bg-transparent border-0 text-electric-blue hover:bg-electric-blue hover:text-black font-bold px-4 py-2 text-sm transition-all duration-300 group-hover:animate-pulse"
            onClick={() => window.open('https://tiktok.com/@scnro.live', '_blank')}
          >
            <span className="relative">
              @scnro.live
              <div className={`absolute inset-0 transition-all duration-75 ${glitchActive ? 'transform translate-x-0.5 text-purple-400' : 'opacity-0'}`}>
                @scnro.live
              </div>
            </span>
          </Button>
        </div>

        {/* Animated Border Lines */}
        <div className="absolute -top-4 -left-4 -right-4 h-px bg-gradient-to-r from-transparent via-electric-blue to-transparent animate-pulse"></div>
        <div className="absolute -bottom-4 -left-4 -right-4 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse"></div>
        <div className="absolute -left-4 -top-4 -bottom-4 w-px bg-gradient-to-b from-transparent via-electric-blue to-transparent animate-pulse"></div>
        <div className="absolute -right-4 -top-4 -bottom-4 w-px bg-gradient-to-b from-transparent via-purple-500 to-transparent animate-pulse"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-electric-blue rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-ping animation-delay-500"></div>
        <div className="absolute bottom-1/3 left-2/3 w-1 h-1 bg-electric-blue/60 rounded-full animate-ping animation-delay-1000"></div>
      </div>
    </div>
  );
};

export default TikTokPortalTile;