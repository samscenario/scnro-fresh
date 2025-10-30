import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import scnroDripHero from "@/assets/scnro-drip-hero.png";

const ScnroDripPitch = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-purple/20 via-electric-blue/20 to-hot-pink/20" />
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="mb-12">
            <img 
              src={scnroDripHero} 
              alt="SCNRO DRIP - The Official Hydration Partner" 
              className="mx-auto max-w-2xl w-full h-auto"
            />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-foreground mb-6">
            SCNRO DRIP
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            A self-sustaining beverage brand to fund SCNRO's youth arts programs. 
            Culture-first hydration that supports creativity.
          </p>
          
          <Badge variant="outline" className="text-lg px-6 py-2 border-electric-blue text-electric-blue">
            THE OFFICIAL HYDRATION PARTNER
          </Badge>
        </div>
      </section>

      {/* Challenge Section */}
      <section className="py-20 px-4 bg-card/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-12 text-center">
            The Challenge
          </h2>
          <p className="text-lg text-muted-foreground text-center max-w-3xl mx-auto">
            SCNRO (Scenario Arts) needs a self-sustaining, income-generating brand to reduce reliance on grants and donations. 
            Traditional funding is unpredictable and limits our ability to expand youth programs and community impact.
          </p>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-12 text-center">
            The Solution: SCNRO DRIP
          </h2>
          
          <p className="text-lg text-muted-foreground text-center mb-16 max-w-3xl mx-auto">
            A youth-friendly beverage brand with streetwear-style branding where "drip" represents both style and drink.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 text-center border-electric-blue/30 bg-card/50">
              <h3 className="text-2xl font-black text-foreground mb-4">Low Barrier Entry</h3>
              <p className="text-muted-foreground">Accessible pricing for youth market</p>
            </Card>
            
            <Card className="p-8 text-center border-hot-pink/30 bg-card/50">
              <h3 className="text-2xl font-black text-foreground mb-4">Culturally On-Trend</h3>
              <p className="text-muted-foreground">Streetwear aesthetic that resonates</p>
            </Card>
            
            <Card className="p-8 text-center border-cyber-purple/30 bg-card/50">
              <h3 className="text-2xl font-black text-foreground mb-4">Mission-Driven</h3>
              <p className="text-muted-foreground">Every sale funds youth arts programs</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Launch Strategy */}
      <section className="py-20 px-4 bg-card/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-16 text-center">
            Launch Strategy
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Product Development */}
            <div>
              <h3 className="text-3xl font-black text-foreground mb-6">
                <span className="text-electric-blue">1</span> Product Development
              </h3>
              <h4 className="text-xl font-bold text-foreground mb-4">Focus Areas:</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Recipe development & testing</li>
                <li>• Packaging design with youth input</li>
                <li>• Small batch production setup</li>
                <li>• Brand identity refinement</li>
              </ul>
            </div>

            {/* Sales & Distribution */}
            <div>
              <h3 className="text-3xl font-black text-foreground mb-6">
                <span className="text-hot-pink">2</span> Sales & Distribution
              </h3>
              
              <div className="mb-6">
                <h4 className="text-xl font-bold text-foreground mb-4">Direct Sales:</h4>
                <ul className="space-y-2 text-muted-foreground mb-6">
                  <li>• SCNRO festivals & events</li>
                  <li>• Community colleges</li>
                  <li>• Youth events & music gigs</li>
                  <li>• Pop-up stalls + branded fridges</li>
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="text-xl font-bold text-foreground mb-4">Partnerships:</h4>
                <ul className="space-y-2 text-muted-foreground mb-6">
                  <li>• Local stores & gyms</li>
                  <li>• College canteens</li>
                  <li>• Youth clubs & sports teams</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-bold text-foreground mb-4">Online Sales:</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Bundled with SCNRO merch</li>
                  <li>• Website integration</li>
                </ul>
              </div>
            </div>

            {/* Brand Positioning */}
            <div>
              <h3 className="text-3xl font-black text-foreground mb-6">
                <span className="text-cyber-purple">3</span> Brand Positioning
              </h3>
              
              <h4 className="text-xl font-bold text-foreground mb-4">Culture-First Approach:</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>• SCNRO as movement, not just product</li>
                <li>• Art, music & creativity on packaging</li>
                <li>• Young designers for limited editions</li>
                <li>• "Funds SCNRO Youth Projects" on every bottle</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Expected Impact */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-12">
            Expected Impact
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-8 border-neon-orange/30 bg-card/50">
              <h3 className="text-2xl font-black text-foreground mb-4">Revenue Generation</h3>
              <p className="text-muted-foreground">
                Create sustainable income stream independent of grants and donations
              </p>
            </Card>
            
            <Card className="p-8 border-electric-blue/30 bg-card/50">
              <h3 className="text-2xl font-black text-foreground mb-4">Youth Engagement</h3>
              <p className="text-muted-foreground">
                Strengthen connection with target demographic through culturally relevant product
              </p>
            </Card>
          </div>

          <div className="mb-16">
            <h3 className="text-3xl font-black text-foreground mb-8">
              <span className="text-transparent bg-gradient-to-r from-neon-orange via-electric-blue to-hot-pink bg-clip-text">
                Support the Movement
              </span>
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              Every bottle sold directly funds SCNRO's youth arts programs, creating a sustainable ecosystem 
              where creativity and community support each other.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/community')}
                className="bg-gradient-to-r from-electric-blue to-hot-pink text-white font-bold px-8 py-3 text-lg"
              >
                Join the Community
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/mainframe')}
                className="border-cyber-purple text-cyber-purple font-bold px-8 py-3 text-lg"
              >
                Learn More About SCNRO
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ScnroDripPitch;