import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Plus } from "lucide-react";

const SubmitToFeedTile = () => {
  const [glitchActive, setGlitchActive] = useState(false);
  const [stickerAnimation, setStickerAnimation] = useState(0);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 400);
    }, 3500);

    const stickerInterval = setInterval(() => {
      setStickerAnimation((prev) => (prev + 1) % 3);
    }, 2000);

    return () => {
      clearInterval(glitchInterval);
      clearInterval(stickerInterval);
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-lg bg-black border border-yellow-400/30 p-4 group hover:border-yellow-400/60 transition-all duration-300 h-full flex flex-col justify-between">
      {/* Base Paper Texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/60 via-gray-700/40 to-gray-900/80"></div>
      
      {/* Torn Paper Overlays */}
      <div className="absolute inset-0">
        {/* Top torn edge */}
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-gray-600/30 to-transparent transform -rotate-1 opacity-70"></div>
        <div className="absolute top-2 right-0 w-3/4 h-6 bg-gradient-to-b from-gray-500/40 to-transparent transform rotate-2 opacity-60"></div>
        
        {/* Side tears */}
        <div className="absolute left-0 top-1/4 w-4 h-20 bg-gradient-to-r from-gray-600/40 to-transparent transform -skew-y-6 opacity-50"></div>
        <div className="absolute right-0 bottom-1/3 w-6 h-16 bg-gradient-to-l from-gray-500/30 to-transparent transform skew-y-3 opacity-60"></div>
      </div>

      {/* Sticker Bomb Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated Stickers */}
        <div className={`absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-hot-pink to-cyber-purple rounded-full transform transition-all duration-500 ${stickerAnimation === 0 ? 'scale-110 rotate-12' : 'scale-100 rotate-0'}`}>
          <div className="absolute inset-1 bg-black/20 rounded-full"></div>
        </div>
        
        <div className={`absolute bottom-6 left-2 w-6 h-6 bg-gradient-to-br from-electric-blue to-neon-orange transform transition-all duration-700 ${stickerAnimation === 1 ? 'scale-105 -rotate-6' : 'scale-95 rotate-3'} clip-path-polygon`} style={{clipPath: 'polygon(0% 0%, 100% 25%, 100% 100%, 25% 100%)'}}></div>
        
        <div className={`absolute top-1/3 left-4 w-4 h-8 bg-gradient-to-b from-yellow-400 to-orange-500 transform transition-all duration-600 ${stickerAnimation === 2 ? 'scale-110 rotate-45' : 'scale-100 rotate-12'}`}></div>
        
        {/* Static Elements */}
        <div className="absolute top-2 left-6 w-2 h-2 bg-neon-orange rounded-full opacity-80"></div>
        <div className="absolute bottom-8 right-6 w-3 h-1 bg-hot-pink transform rotate-45 opacity-70"></div>
        <div className="absolute top-1/2 right-2 w-1 h-4 bg-electric-blue transform -rotate-12 opacity-60"></div>
      </div>

      {/* Handwritten Style Overlays */}
      <div className="absolute inset-0">
        <div className="absolute top-8 left-2 text-xs text-yellow-300/40 transform -rotate-12 font-mono">ART</div>
        <div className="absolute bottom-12 right-4 text-xs text-hot-pink/30 transform rotate-6 font-mono">AUDIO</div>
        <div className="absolute top-1/2 left-1 text-xs text-electric-blue/40 transform -rotate-45 font-mono">STORY</div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Top Section - Upload Icon */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400/80 to-orange-500/80 rounded-lg flex items-center justify-center transform rotate-3 shadow-lg">
                <Upload className={`w-4 h-4 text-black transition-transform duration-300 ${glitchActive ? 'scale-110' : ''}`} />
              </div>
              <div className="absolute inset-0 w-8 h-8 bg-yellow-400/20 rounded-lg transform translate-x-1 translate-y-1 -rotate-2"></div>
              
              {/* Plus icon overlay */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-hot-pink rounded-full flex items-center justify-center">
                <Plus className="w-2 h-2 text-white" />
              </div>
            </div>
          </div>

          {/* Street Style Tag */}
          <div className="relative">
            <div className="inline-block px-2 py-1 bg-black/60 border border-yellow-400/50 transform -rotate-1">
              <p className="text-yellow-300 text-xs font-bold tracking-wider">DROPBOX</p>
            </div>
            <div className={`absolute inset-0 inline-block px-2 py-1 bg-black/40 border border-yellow-400/30 transform transition-all duration-75 ${glitchActive ? 'translate-x-0.5 rotate-1' : 'opacity-0'}`}>
              <p className="text-yellow-300 text-xs font-bold tracking-wider">DROPBOX</p>
            </div>
          </div>
        </div>

        {/* Middle Section - Main Text */}
        <div className="text-center px-2">
          <p className={`text-xs font-bold leading-tight bg-gradient-to-r from-yellow-300 via-white to-orange-300 bg-clip-text text-transparent transition-all duration-150 ${glitchActive ? 'animate-pulse' : ''}`}>
            Submit your art, audio, or story
          </p>
        </div>

        {/* Bottom Section - CTA */}
        <div className="text-center">
          <Button 
            variant="outline"
            size="sm"
            className="bg-transparent border-0 text-yellow-300 hover:bg-yellow-400 hover:text-black font-black px-4 py-2 text-sm transition-all duration-300 transform hover:rotate-1 group-hover:animate-pulse"
            onClick={() => {
              // This could link to a submission form or email
              window.open('mailto:submit@scnro.live?subject=Culture Feed Submission', '_blank');
            }}
          >
            <span className="relative flex items-center gap-1">
              Drop It Here
              <div className={`absolute inset-0 flex items-center gap-1 transition-all duration-75 ${glitchActive ? 'transform translate-x-0.5 text-orange-300' : 'opacity-0'}`}>
                Drop It Here
              </div>
            </span>
          </Button>
        </div>

        {/* Graffiti-style Border Effects */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/60 to-transparent"></div>
        <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-yellow-400/60 to-transparent"></div>
        <div className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-orange-500/60 to-transparent"></div>
      </div>

      {/* Spray Paint Dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/5 left-1/5 w-0.5 h-0.5 bg-yellow-400 rounded-full opacity-60"></div>
        <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-orange-400/80 rounded-full"></div>
        <div className="absolute bottom-1/4 left-3/5 w-0.5 h-0.5 bg-hot-pink/60 rounded-full"></div>
        <div className="absolute top-1/2 right-1/6 w-0.5 h-0.5 bg-electric-blue/40 rounded-full"></div>
      </div>
    </div>
  );
};

export default SubmitToFeedTile;