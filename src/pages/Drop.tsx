import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const Drop = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Header Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neon-orange/20 via-background/60 to-background/90" />
        
        {/* Animated Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-orange/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-hot-pink/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="text-6xl md:text-8xl">🧢</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-gradient-to-r from-neon-orange to-hot-pink bg-clip-text mb-6">
            SCNRO: DROP
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold text-neon-orange mb-8">
            THIS AIN'T MERCH. THIS IS A DROP.
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            SCNRO: DROP is where culture becomes collectible. Limited runs, real collabs, and giveaways.
          </p>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Button variant="hero" size="xl" className="min-w-[200px]">
              SHOP DROPS
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Drop;