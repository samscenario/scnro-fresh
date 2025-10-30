import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

const InstagramTransitionTile = () => {
  const [glitchActive, setGlitchActive] = useState(false);
  const [activeCarousel, setActiveCarousel] = useState(0);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 300);
    }, 3000);

    const carouselInterval = setInterval(() => {
      setActiveCarousel((prev) => (prev + 1) % 4);
    }, 1500);

    return () => {
      clearInterval(glitchInterval);
      clearInterval(carouselInterval);
    };
  }, []);

  return (
    <div className="relative overflow-hidden rounded-lg bg-black border border-purple-500/30 p-4 group hover:border-purple-500/60 transition-all duration-300 h-full flex flex-col justify-between">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-500/20 to-orange-500/20"></div>
      
      {/* Instagram Gradient Background Effects */}
      <div className={`absolute inset-0 transition-all duration-150 ${glitchActive ? 'animate-pulse' : ''}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent translate-x-full animate-[slide-in-right_2.2s_ease-in-out_infinite]"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-pink-500/10 to-transparent -translate-x-full animate-[slide-in-right_3.2s_ease-in-out_infinite]"></div>
      </div>

      {/* Glitch Overlay */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${glitchActive ? 'opacity-30' : ''}`}>
        <div className="absolute inset-0 bg-purple-500/5 transform skew-x-1"></div>
        <div className="absolute inset-0 bg-pink-500/5 transform -skew-x-1"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Top Section - Instagram Camera Icon + Carousel Indicators */}
        <div className="text-center space-y-3">
          {/* Instagram Icon Effect */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center animate-pulse">
                <div className="w-4 h-4 border-2 border-white rounded-sm flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              </div>
              <div className={`absolute inset-0 w-8 h-8 rounded-lg bg-purple-500/20 transform translate-x-1 translate-y-1 transition-transform duration-150 ${glitchActive ? 'translate-x-2 translate-y-2' : ''}`}></div>
            </div>
          </div>

          {/* Carousel Scroll Indicators */}
          <div className="flex justify-center space-x-1">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  activeCarousel === index 
                    ? 'w-4 bg-gradient-to-r from-purple-400 to-pink-400' 
                    : 'w-1 bg-white/30'
                }`}
              />
            ))}
          </div>

          {/* Glitch Text Effect */}
          <div className="relative">
            <p className="text-purple-400 text-xs font-medium opacity-60">
              LIVE STORIES
            </p>
            <div className={`absolute inset-0 text-purple-400 text-xs font-medium transition-all duration-75 ${glitchActive ? 'transform translate-x-0.5 opacity-40' : 'opacity-0'}`}>
              LIVE STORIES
            </div>
          </div>
        </div>

        {/* Middle Section - Tagline */}
        <div className="text-center px-2">
          <p className={`text-xs font-medium leading-tight bg-gradient-to-r from-purple-400 via-pink-300 to-orange-400 bg-clip-text text-transparent transition-all duration-150 ${glitchActive ? 'animate-pulse' : ''}`}>
            SCNRO is live — your feed, your story
          </p>
        </div>

        {/* Bottom Section - CTA */}
        <div className="text-center space-y-2">
          <Button 
            variant="outline"
            size="sm"
            className="bg-transparent border-0 text-purple-400 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white font-bold px-4 py-2 text-sm transition-all duration-300 group-hover:animate-pulse w-full"
            onClick={() => window.open('https://instagram.com/scnro.live', '_blank')}
          >
            <span className="relative flex items-center justify-center gap-1">
              Swipe to Drop In
              <ChevronRight className="w-3 h-3" />
              <div className={`absolute inset-0 flex items-center justify-center gap-1 transition-all duration-75 ${glitchActive ? 'transform translate-x-0.5 text-pink-400' : 'opacity-0'}`}>
                View the Scenario
                <ChevronRight className="w-3 h-3" />
              </div>
            </span>
          </Button>
        </div>

        {/* Animated Border Lines */}
        <div className="absolute -top-4 -left-4 -right-4 h-px bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 animate-pulse"></div>
        <div className="absolute -bottom-4 -left-4 -right-4 h-px bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 animate-pulse"></div>
        <div className="absolute -left-4 -top-4 -bottom-4 w-px bg-gradient-to-b from-purple-500 via-pink-500 to-orange-500 animate-pulse"></div>
        <div className="absolute -right-4 -top-4 -bottom-4 w-px bg-gradient-to-b from-orange-500 via-pink-500 to-purple-500 animate-pulse"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-purple-500 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-pink-400 rounded-full animate-ping animation-delay-500"></div>
        <div className="absolute bottom-1/3 left-2/3 w-1 h-1 bg-orange-400/60 rounded-full animate-ping animation-delay-1000"></div>
      </div>
    </div>
  );
};

export default InstagramTransitionTile;