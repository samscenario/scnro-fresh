import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import heroBackground from "@/assets/hero-background.jpg";
import AnimatedSignature from "./AnimatedSignature";
import scnroDrip from "@/assets/scnro-drip.png";


const HeroSection = () => {
  console.log("🔍 DEBUG: HeroSection rendering");
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Black Background */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Subtle grid pattern for texture */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-grid-white/[0.02] bg-[size:50px_50px]" />
      </div>

      {/* Logos in bottom right corner of hero section */}
      <div className="absolute bottom-4 right-4 z-50 flex items-center gap-4">
        {/* SCNRO DRIP Image */}
        <img 
          src={scnroDrip}
          alt="SCNRO DRIP" 
          className="w-16 h-16 md:w-20 md:h-20 object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
        />
        
        {/* Rotating OS Logo */}
        <div style={{ animation: 'spin 8s linear infinite' }}>
          <img 
            src="/lovable-uploads/ea210f54-da95-49f3-b4d7-b83e8ab8cf5f.png" 
            alt="OS3 Mainframe Operating System" 
            className="w-24 h-24 md:w-32 md:h-32 object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mt-2 md:mt-8">
        {/* Logo */}
        <div className="mb-2">
          <div className="flex items-center justify-center gap-2 relative">
            <div className="relative">
              <img 
                src="/lovable-uploads/a926a997-bc8d-46e2-bce9-4aa0c1c93289.png" 
                alt="Logo"
                className={`h-12 md:h-16 transition-all duration-1000 ${isVisible ? 'animate-scale-in' : 'opacity-0 scale-50'}`}
                style={{ 
                  animationDelay: isVisible ? '0.5s' : '0s',
                  animationFillMode: 'both'
                }}
              />
              
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 animate-fade-in">
                <p className="text-xl md:text-2xl font-bold text-yellow-300 tracking-widest whitespace-nowrap" style={{ textShadow: '0 0 10px rgba(253, 224, 71, 0.5)', letterSpacing: '0.15em' }}>
                  SOUND · STYLE · SCENARIO
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* CTA Buttons */}
        <div className="flex justify-center items-center animate-fade-in mt-14 mr-8" style={{ animationDelay: '0.4s' }}>
          <Button variant="outline" size="xl" className="min-w-[200px]" onClick={() => navigate("/enter-scenario")}>
            ENTER THE SCENARIO
          </Button>
        </div>

        {/* Animated Signature */}
        <div className="flex justify-center items-center animate-fade-in mt-8" style={{ animationDelay: '0.6s' }}>
          <AnimatedSignature />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-electric-blue rounded-full flex justify-center">
          <div className="w-1 h-3 bg-electric-blue rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;