import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import { Link } from "react-router-dom";

const Community = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-acid-green/20 via-background/60 to-background/90" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="text-6xl md:text-8xl">🌟</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-gradient-to-r from-acid-green to-hot-pink bg-clip-text mb-6">
            JOIN OUR COMMUNITY
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Connect with creators, artists, and innovators who are shaping the future.
          </p>
          <Button variant="hero" size="xl" asChild>
            <Link to="/signal">Explore SCNRO</Link>
          </Button>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 bg-card/50 border-acid-green/20 hover:border-electric-blue/40 transition-all duration-300">
              <div className="text-center space-y-4">
                <span className="text-3xl block">💬</span>
                <h3 className="text-lg font-bold">Chat & Connect</h3>
                <p className="text-sm text-muted-foreground">Join conversations with fellow creators.</p>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 border-acid-green/20 hover:border-hot-pink/40 transition-all duration-300">
              <div className="text-center space-y-4">
                <span className="text-3xl block">🎨</span>
                <h3 className="text-lg font-bold">Share Your Work</h3>
                <p className="text-sm text-muted-foreground">Show off your latest creations and get feedback.</p>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 border-acid-green/20 hover:border-neon-orange/40 transition-all duration-300">
              <div className="text-center space-y-4">
                <span className="text-3xl block">🤝</span>
                <h3 className="text-lg font-bold">Collaborate</h3>
                <p className="text-sm text-muted-foreground">Find partners for your next creative project.</p>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 border-acid-green/20 hover:border-electric-blue/40 transition-all duration-300">
              <div className="text-center space-y-4">
                <span className="text-3xl block">📚</span>
                <h3 className="text-lg font-bold">Learn Together</h3>
                <p className="text-sm text-muted-foreground">Access resources and learn from each other.</p>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Community;