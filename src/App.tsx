import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Emergency component removed - audio issue resolved
import { AuthProvider } from "@/hooks/useAuth";
import { AudioProvider } from "@/contexts/AudioContext";

import MobileLibrary from "./pages/MobileLibrary";
import MobilePlayer from "./pages/MobilePlayer";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import EnterScenario from "./pages/EnterScenario";
import Mainframe from "./pages/Mainframe";
import MainframeFunding from "./pages/MainframeFunding";
import Labs from "./pages/Labs";
import Signal from "./pages/Signal";
import Drop from "./pages/Drop";
import Campus from "./pages/Campus";
import CampusTickets from "./pages/CampusTickets";
import CampusAdmin from "./pages/CampusAdmin";
import AcademicCalendar from "./pages/AcademicCalendar";

import OurStory from "./pages/OurStory";
import ApplyLab from "./pages/ApplyLab";
import BecomeMentor from "./pages/BecomeMentor";
import UpcomingSessions from "./pages/UpcomingSessions";
import GetStarted from "./pages/GetStarted";
import Community from "./pages/Community";
import Admin from "./pages/Admin";
import AdminContent from "./pages/AdminContent";
import AdminLabs from "./pages/AdminLabs";
import LinkedInCampaignShowcase from "./components/LinkedInCampaignShowcase";
import MainframeNewsletter from "./pages/MainframeNewsletter";
import SoundsOfScenario from "./pages/SoundsOfScenario";
import ScnroDripPitch from "./pages/ScnroDripPitch";
import ScnroEd from "./pages/ScnroEd";
import ScnroEdSchools from "./pages/ScnroEdSchools";

import Sponsors from "./pages/Sponsors";

const queryClient = new QueryClient();

const App = () => {
  console.log("App component rendering");
  console.log("React import:", React);
  console.log("QueryClient:", QueryClient);
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AudioProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/enter-scenario" element={<EnterScenario />} />
                <Route path="/mainframe" element={<Mainframe />} />
                <Route path="/mainframe/funding" element={<MainframeFunding />} />
                <Route path="/labs" element={<Labs />} />
                <Route path="/signal" element={<Signal />} />
                <Route path="/drop" element={<Drop />} />
                <Route path="/campus" element={<Campus />} />
                <Route path="/campus-tickets" element={<CampusTickets />} />
                <Route path="/campus-admin" element={<CampusAdmin />} />
                <Route path="/academic-calendar" element={<AcademicCalendar />} />
                <Route path="/mobile-library" element={<MobileLibrary />} />
                <Route path="/mobile-player" element={<MobilePlayer />} />
                <Route path="/discover" element={<Index />} />
                <Route path="/profile" element={<Auth />} />
                
                <Route path="/our-story" element={<OurStory />} />
                <Route path="/apply-lab" element={<ApplyLab />} />
                <Route path="/become-mentor" element={<BecomeMentor />} />
                <Route path="/upcoming-sessions" element={<UpcomingSessions />} />
                <Route path="/get-started" element={<GetStarted />} />
                <Route path="/community" element={<Community />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/content" element={<AdminContent />} />
                <Route path="/admin/labs" element={<AdminLabs />} />
                <Route path="/linkedin-campaign" element={<LinkedInCampaignShowcase />} />
                <Route path="/mainframe/newsletter" element={<MainframeNewsletter />} />
                <Route path="/sounds-of-scenario" element={<SoundsOfScenario />} />
                <Route path="/scnro-drip-pitch" element={<ScnroDripPitch />} />
                <Route path="/scnro-ed" element={<ScnroEd />} />
                <Route path="/scnro-ed-schools" element={<ScnroEdSchools />} />
                
                <Route path="/sponsors" element={<Sponsors />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AudioProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
