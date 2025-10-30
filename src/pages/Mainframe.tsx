import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import MainframeLogo from "@/components/MainframeLogo";

const Mainframe = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Header Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-24">
        <div className="absolute inset-0 bg-gradient-to-b from-warning-red/20 via-background/60 to-background/90" />
        
        {/* Animated Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-warning-red/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-foreground/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-8">
            <img 
              src="/lovable-uploads/704a6bc7-8e08-4070-ac17-a5b9d6e35e36.png" 
              alt="Mainframe Festival Image" 
              className="w-full max-w-2xl mx-auto rounded-lg shadow-2xl"
            />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-warning-red mb-8">
            THE ANNUAL CULTURE DROP EVENT
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Royal Docks London, one stage, 4 Labs unlimited expression, This is SCNRO an annual festival of sound, movement, and meaning. Live performances, fashion, and surprise acts. It's more than music — it's your moment!
          </p>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Button variant="hero" size="xl" className="min-w-[200px]">
              VIEW LINEUP
            </Button>
            <Button variant="outline" size="xl" className="min-w-[200px]">
              JOIN THE CREW
            </Button>
            <Button variant="cta" size="xl" className="min-w-[200px]" onClick={() => window.location.href = '/mainframe/funding'}>
              SUPPORT SCNRO '26
            </Button>
            <Button variant="scenario" size="xl" className="min-w-[200px]" onClick={() => window.location.href = '/mainframe/newsletter'}>
              VIEW NEWSLETTER
            </Button>
            <Button variant="outline" size="xl" className="min-w-[200px]">
              GET TICKETS
            </Button>
          </div>


          {/* Past Gallery Preview */}
          <div className="mt-20 text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-warning-red to-hot-pink bg-clip-text mb-8">
              PAST MAINFRAME MOMENTS
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-muted/40 rounded-lg flex items-center justify-center hover:bg-warning-red/20 transition-colors duration-300">
                  <span className="text-2xl text-muted-foreground">📸</span>
                </div>
              ))}
            </div>
            <Button variant="outline" size="lg">
              VIEW FULL GALLERY
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Mainframe;