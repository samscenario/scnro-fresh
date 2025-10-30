import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import StudioSection from "@/components/StudioSection";
import FeaturedScenarios from "@/components/FeaturedScenarios";
import TheDropSection from "@/components/TheDropSection";
import CampusLiveSection from "@/components/CampusLiveSection";
import ScenarioStreamSection from "@/components/ScenarioStreamSection";
import SponsorsSection from "@/components/SponsorsSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();
  console.log("Index component rendering");
  console.log("🔍 DEBUG: isMobile:", isMobile);
  console.log("🔍 DEBUG: window.innerWidth:", typeof window !== 'undefined' ? window.innerWidth : 'undefined');
  
  // Smart audio cleanup - only on mount to stop any leftover audio from previous sessions
  useEffect(() => {
    const cleanupAudio = () => {
      console.log('🧹 Cleaning up leftover audio elements on mount');
      
      // Only target audio elements that might be left over from previous sessions
      // Don't touch audio elements that are part of our current player
      const allAudio = document.querySelectorAll('audio');
      let cleanedCount = 0;
      
      allAudio.forEach((audio) => {
        // Only clean audio that is currently playing but has suspicious/empty src
        if (!audio.paused && (!audio.src || audio.src.includes('token'))) {
          console.log(`🧹 Cleaning suspicious audio:`, audio.src);
          audio.pause();
          audio.currentTime = 0;
          cleanedCount++;
        }
      });
      
      if (cleanedCount > 0) {
        console.log(`✅ Cleaned ${cleanedCount} suspicious audio elements`);
      } else {
        console.log('✅ No cleanup needed');
      }
    };
    
    // Only run cleanup once on mount, not continuously
    cleanupAudio();
  }, []);
  
  console.log("🔍 DEBUG: About to render Index page components");
  
  return (
    <div className="min-h-screen bg-zinc-900 text-white p-4" style={{minHeight: '-webkit-fill-available', backgroundColor: '#18181b'}}>
      
      <Header />
      
      <HeroSection />
      <AboutSection />
      <StudioSection />
      <FeaturedScenarios />
      <CampusLiveSection />
      <TheDropSection />
      <ScenarioStreamSection />
      {/* <SponsorsSection /> */}
      
      <CTASection />
      <Footer />
      
      {isMobile && <MobileBottomNav />}
    </div>
  );
};

export default Index;
