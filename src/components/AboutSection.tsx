import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const AboutSection = () => {
  return (
    <section className="py-12 px-4 bg-muted">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="lg:w-2/3 text-center">
            <h2 className="text-lg sm:text-xl md:text-5xl font-black text-foreground flex flex-wrap items-center justify-center gap-1 sm:gap-2 md:gap-4 mb-4">
              <img 
                src="/lovable-uploads/b945c63f-87df-4701-ac10-24c5dde261fe.png" 
                alt="SCNRO Logo" 
                className="h-4 sm:h-6 md:h-16 w-auto inline-block max-w-full"
              />
            </h2>
            <p className="text-sm sm:text-base md:text-2xl text-yellow-300 font-dm-sans font-normal px-2">
              "Building Future Scenarios."
            </p>
          </div>
          
          <div className="lg:w-1/3 flex justify-center">
            <Button variant="outline" size="xl" className="animate-scale-in" asChild>
              <Link to="/our-story">OUR STORY</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;