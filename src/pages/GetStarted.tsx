import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import { Link } from "react-router-dom";

const GetStarted = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neon-orange/20 via-background/60 to-background/90" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="text-6xl md:text-8xl">🚀</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-gradient-to-r from-neon-orange to-electric-blue bg-clip-text mb-6">
            GET STARTED
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Your journey into the SCNRO universe begins here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" asChild>
              <Link to="/enter-scenario">Enter the Scenario</Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link to="/signal">Explore Scenario Stream</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 bg-card/50 border-neon-orange/20 hover:border-electric-blue/40 transition-all duration-300">
              <div className="text-center space-y-4">
                <span className="text-4xl block">🎵</span>
                <h3 className="text-xl font-bold">Create Music</h3>
                <p className="text-muted-foreground">Join our labs and learn beat making, DJing, and production.</p>
                <Button variant="outline" asChild>
                  <Link to="/labs">Explore Labs</Link>
                </Button>
              </div>
            </Card>

            <Card className="p-8 bg-card/50 border-neon-orange/20 hover:border-acid-green/40 transition-all duration-300">
              <div className="text-center space-y-4">
                <span className="text-4xl block">📱</span>
                <h3 className="text-xl font-bold">Go Live</h3>
                <p className="text-muted-foreground">Stream your content and connect with the community.</p>
                <Button variant="outline" asChild>
                  <Link to="/signal">Visit Scenario</Link>
                </Button>
              </div>
            </Card>

            <Card className="p-8 bg-card/50 border-neon-orange/20 hover:border-hot-pink/40 transition-all duration-300">
              <div className="text-center space-y-4">
                <span className="text-4xl block">🎯</span>
                <h3 className="text-xl font-bold">Join Events</h3>
                <p className="text-muted-foreground">Participate in campus events and university collaborations.</p>
                <Button variant="outline" asChild>
                  <Link to="/campus">Visit Campus</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GetStarted;