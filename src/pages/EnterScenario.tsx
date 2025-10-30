import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import scnroLogo from "@/assets/scnro-manifesto-logo.png";
import fnycLogo from "@/assets/fnyc-logo.png";

const EnterScenario = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* SCNRO MANIFESTO */}
      <section className="relative min-h-screen overflow-hidden bg-black">
        {/* Textured Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_40%,rgba(255,255,255,0.05)_50%,transparent_60%)]" />
        </div>

        <div className="relative z-10 px-4 py-20 max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="mb-8 mt-12">
              <img 
                src={scnroLogo} 
                alt="SCNRO" 
                className="h-16 md:h-20 lg:h-24 w-auto mx-auto mb-6"
              />
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center justify-center gap-6">
                  <img 
                    src={fnycLogo} 
                    alt="FNYC" 
                    className="h-20 md:h-24 lg:h-28 w-auto"
                  />
                  <div className="inline-block bg-white px-8 py-4">
                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-black tracking-wider">
                      OUR MANIFESTO
                    </h2>
                  </div>
                </div>
                <p className="text-white text-xs md:text-sm lg:text-base font-medium text-center whitespace-nowrap">
                  Future Newham Youth Culture
                </p>
              </div>
            </div>
            <p className="text-xl md:text-2xl lg:text-3xl text-white font-medium tracking-wide">
              "THE PLATFORM. THE STORY. THE GENERATION."
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            {/* Left Column */}
            <div className="space-y-6">
              <div className="text-white text-lg md:text-xl lg:text-2xl leading-relaxed font-medium space-y-4">
                <p>SCNRO IS THE OPPORTUNITY THE PATHWAY THE PLATFORM. A STAGE FOR THE UNHEARD A CANVAS FOR THE UNSEEN SCNRO IS AN EVENT BUT NOT JUST ONE. ITS A MOVEMENT A MOMENT A MEMORY</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="text-white text-lg md:text-xl lg:text-2xl leading-relaxed font-medium space-y-4">
                <p>IT'S GLOBAL. LOUD. CULTURE IN MOTION. IT TELLS STORIES ACROSS BORDERS, GENRES, GENERATIONS. AND EVERY STORY HAS CHARACTERS. EVERY CHARACTER IS INDIVIDUAL. EVERY INDIVIDUAL HAS A PURPOSE.</p>
              </div>
            </div>
          </div>

          {/* Second Section Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            {/* Left Column */}
            <div className="space-y-6">
              <div className="text-white text-lg md:text-xl lg:text-2xl leading-relaxed font-medium space-y-4">
                <p>SCNRO IS A WORLD WHERE BRANDS BECOME EVENTS. EVENTS BECOME CAMPAIGNS. CAMPAIGNS BECOME MESSAGES. AND MESSAGES? MESSAGES INSPIRE GENERATIONS</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="text-white text-lg md:text-xl lg:text-2xl leading-relaxed font-medium space-y-4">
                <p>WE'RE NOT HERE TO FOLLOW TRENDS. WE'RE HERE TO BUILD SCENARIOS. THE KIND THAT SPARK IDENTITY, INVENTION, AND IMPACT. THIS IS YOUR SCNRO. <span className="text-yellow-400">ENTER IT. LIVE IT. MAKE IT YOURS.</span></p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center animate-fade-in" style={{ animationDelay: '0.9s' }}>
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg md:text-xl font-bold tracking-wider"
                size="lg"
              >
                BE PART OF THE MOVEMENT
              </Button>
              <div className="flex items-center gap-3">
                <img 
                  src={fnycLogo} 
                  alt="FNYC" 
                  className="h-12 md:h-16 w-auto"
                />
                <p className="text-white text-xs md:text-sm font-medium whitespace-nowrap">
                  Future Newham Youth Culture
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default EnterScenario;