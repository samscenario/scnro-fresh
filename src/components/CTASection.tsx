import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-background via-card to-background">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main CTA */}
        <div className="relative mb-16">
          {/* Background glow effects */}
          <div className="absolute -inset-4 bg-gradient-to-r from-electric-blue/20 via-hot-pink/20 to-cyber-purple/20 blur-xl"></div>
          
          <div className="relative bg-card border-4 border-transparent bg-gradient-to-r from-electric-blue/20 via-hot-pink/20 to-cyber-purple/20 rounded-3xl p-4 md:p-12">
            <div className="bg-card rounded-2xl p-4 md:p-8 border-2 border-electric-blue/30">
              <h2 className="text-4xl md:text-6xl font-black text-foreground mb-6">
                Got a voice?<br />
                Got a vision?
              </h2>
              <h3 className="text-3xl md:text-5xl font-black mb-8">
                <span className="text-transparent bg-gradient-to-r from-neon-orange via-electric-blue to-hot-pink bg-clip-text">
                  Drop it. Share it. Build it.
                </span>
              </h3>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CTASection;