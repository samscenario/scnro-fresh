import Header from "@/components/Header";
import CuratedTracks from "@/components/CuratedTracks";

const SoundsOfScenario = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Comic Cover Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-card/50 to-background">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-purple/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-electric-blue/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-neon-orange/5 via-transparent to-hot-pink/5" />
        </div>

        {/* Comic Cover Container */}
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <div className="relative bg-gradient-to-br from-zinc-900 via-zinc-800 to-black border-4 border-electric-blue/50 rounded-3xl p-8 shadow-2xl shadow-electric-blue/20">
            
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-6xl md:text-8xl font-black text-transparent bg-gradient-to-r from-neon-orange via-electric-blue to-hot-pink bg-clip-text mb-4 tracking-wider">
                SOUNDS
              </h1>
              <h2 className="text-4xl md:text-6xl font-black text-transparent bg-gradient-to-r from-cyber-purple to-electric-blue bg-clip-text tracking-widest">
                OF SCENARIO
              </h2>
              <div className="h-1 w-32 bg-gradient-to-r from-neon-orange to-hot-pink mx-auto mt-4 rounded-full" />
            </div>

            {/* Characters Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Left Character - Woman */}
              <div className="relative transform hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-cyber-purple/20 to-electric-blue/20 rounded-2xl blur-xl" />
                <div className="relative bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 rounded-2xl p-6 border border-electric-blue/30">
                  <img 
                    src="/lovable-uploads/00370f85-7ce6-4fa2-8a64-1dfd32141812.png" 
                    alt="Female character in green tracksuit" 
                    className="w-full h-auto max-w-sm mx-auto drop-shadow-2xl"
                  />
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-hot-pink to-neon-orange text-white text-xs font-bold px-3 py-1 rounded-full">
                    CREATOR
                  </div>
                </div>
              </div>

              {/* Right Character - Man with Mic */}
              <div className="relative transform hover:scale-105 transition-transform duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-orange/20 to-hot-pink/20 rounded-2xl blur-xl" />
                <div className="relative bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 rounded-2xl p-6 border border-hot-pink/30">
                  <img 
                    src="/lovable-uploads/19318198-5017-4f95-9e2e-fef0a38651c4.png" 
                    alt="Male character with microphone and backpack" 
                    className="w-full h-auto max-w-sm mx-auto drop-shadow-2xl"
                  />
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-electric-blue to-cyber-purple text-white text-xs font-bold px-3 py-1 rounded-full">
                    PERFORMER
                  </div>
                </div>
              </div>
            </div>

            {/* Tagline */}
            <div className="text-center mt-8">
              <p className="text-xl md:text-2xl text-transparent bg-gradient-to-r from-electric-blue via-hot-pink to-neon-orange bg-clip-text font-bold tracking-wide">
                WHERE SOUND MEETS STORY
              </p>
              <div className="flex justify-center items-center space-x-4 mt-4">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-electric-blue" />
                <span className="text-muted-foreground text-sm font-semibold tracking-widest">COMING SOON</span>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-hot-pink" />
              </div>
            </div>

            {/* Corner Details */}
            <div className="absolute top-4 left-4 bg-gradient-to-r from-cyber-purple to-electric-blue text-white text-xs font-bold px-3 py-1 rounded-full">
              ISSUE #001
            </div>
            <div className="absolute bottom-4 left-4 text-xs text-muted-foreground font-mono">
              SCNRO STUDIOS
            </div>
            <div className="absolute bottom-4 right-4 text-xs text-muted-foreground font-mono">
              EST. 2024
            </div>
          </div>
        </div>
      </section>

      {/* Curated Content Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <CuratedTracks />
        </div>
      </section>
    </div>
  );
};

export default SoundsOfScenario;