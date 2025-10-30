import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import ScenarioStreamSection from "@/components/ScenarioStreamSection";
import { ScenarioAlertDialog } from "@/components/ScenarioAlertDialog";
const Signal = () => {
  const recentEvents = [{
    title: "Warehouse Session #3",
    location: "East London",
    status: "Happened",
    vibe: "Raw Energy"
  }, {
    title: "Rooftop Cypher",
    location: "South Bank",
    status: "Happened",
    vibe: "City Views"
  }, {
    title: "Underground Mic",
    location: "Secret Location",
    status: "Coming Soon",
    vibe: "Pure Talent"
  }, {
    title: "Late Night Studio",
    location: "TBA",
    status: "Scenario Drop",
    vibe: "Creative Flow"
  }];
  return <div className="min-h-screen bg-background">
      <Header />
      {/* Header Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cyber-purple/20 via-background/60 to-background/90" />
        
        {/* Animated Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-purple/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-electric-blue/10 rounded-full blur-3xl animate-pulse-glow" style={{
          animationDelay: '1s'
        }} />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-gradient-to-r from-cyber-purple to-electric-blue bg-clip-text mb-6">
        </h1>
          <h2 className="text-3xl md:text-5xl font-bold text-cyber-purple mb-8">
        </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">Music and content from the SCNRO Collective . No lineups posted. Warehouse shows. Rooftop sets.  Find the scenario. Stay locked.</p>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Button variant="outline" size="xl" className="min-w-[200px]">
              GET THE CODE
            </Button>
            <ScenarioAlertDialog>
              <Button variant="cta" size="xl" className="min-w-[200px]">
                SIGN UP FOR ALERTS
              </Button>
            </ScenarioAlertDialog>
          </div>


          {/* Scenario Stream Section with new categories */}
          <ScenarioStreamSection />

        </div>
      </section>
    </div>;
};
export default Signal;