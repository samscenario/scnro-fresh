import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import { Link } from "react-router-dom";

const BecomeMentor = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-acid-green/20 via-background/60 to-background/90" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="text-6xl md:text-8xl">🎓</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-gradient-to-r from-acid-green to-electric-blue bg-clip-text mb-6">
            BECOME A MENTOR
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Share your expertise and help shape the next generation of creators.
          </p>
          <Button variant="hero" size="xl" asChild>
            <Link to="/labs">Back to Labs</Link>
          </Button>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-card/50 border-acid-green/20">
            <h2 className="text-2xl font-bold text-center mb-8">Mentor Application Coming Soon</h2>
            <p className="text-center text-muted-foreground">
              This page will contain the mentor application form and requirements.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default BecomeMentor;