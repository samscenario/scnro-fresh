import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ExternalLink, Crown, Star, Award } from "lucide-react";

const sponsors = {
  platinum: [
    {
      name: "TechCorp Global",
      logo: "/lovable-uploads/42149761-652e-43da-b1bb-5a21382e31b4.png",
      website: "https://techcorp.com",
      description: "Leading technology solutions for creative industries"
    }
  ],
  gold: [
    {
      name: "Creative Studios",
      logo: "/lovable-uploads/3c94039c-0810-4fd5-8c4a-ba2782f91894.png", 
      website: "https://creativestudios.com",
      description: "Professional audio and video production services"
    },
    {
      name: "Digital Media Pro",
      logo: "/lovable-uploads/5210333c-85bb-4350-ab55-9294f7469653.png",
      website: "https://digitalmediapro.com", 
      description: "Content creation and digital marketing solutions"
    }
  ],
  supporters: [
    {
      name: "Local Music Store",
      logo: "/lovable-uploads/56a1d6ce-d5e6-4cc9-91d3-cb3f2db90ca4.png",
      website: "https://localmusicstore.com",
      description: "Supporting local artists and musicians"
    },
    {
      name: "Community Arts Fund",
      logo: "/lovable-uploads/61867d72-7763-4295-8206-dcd72d104a40.png", 
      website: "https://communityarts.org",
      description: "Funding creative projects in our community"
    },
    {
      name: "Artist Collective",
      logo: "/lovable-uploads/66819d5d-881d-4679-aa66-be4194a91ed8.png",
      website: "https://artistcollective.com",
      description: "Connecting artists and creators worldwide"
    }
  ]
};

const SponsorsSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-background to-card">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black font-russo text-transparent bg-gradient-to-r from-white to-electric-blue bg-clip-text mb-4">
            SPONSORS & SUPPORTERS
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            We're grateful to our amazing sponsors and supporters who make our creative community possible
          </p>
        </div>

        {/* Platinum Tier */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Crown className="h-6 w-6 text-yellow-400" />
            <h3 className="text-2xl font-bold text-white">Platinum Sponsors</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sponsors.platinum.map((sponsor, index) => (
              <div key={index} className="bg-card/50 backdrop-blur-sm rounded-xl p-6 border border-electric-blue/20 hover:border-electric-blue/40 transition-all duration-300 group">
                <div className="aspect-video bg-white/90 rounded-lg p-4 mb-4 flex items-center justify-center">
                  <img 
                    src={sponsor.logo} 
                    alt={sponsor.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">{sponsor.name}</h4>
                <p className="text-white/70 text-sm mb-4">{sponsor.description}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => window.open(sponsor.website, '_blank')}
                >
                  Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Gold Tier */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Star className="h-6 w-6 text-yellow-500" />
            <h3 className="text-2xl font-bold text-white">Gold Sponsors</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sponsors.gold.map((sponsor, index) => (
              <div key={index} className="bg-card/30 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all duration-300 group">
                <div className="aspect-square bg-white/90 rounded-lg p-3 mb-3 flex items-center justify-center">
                  <img 
                    src={sponsor.logo} 
                    alt={sponsor.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <h4 className="text-lg font-semibold text-white mb-1">{sponsor.name}</h4>
                <p className="text-white/60 text-xs mb-3">{sponsor.description}</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-xs"
                  onClick={() => window.open(sponsor.website, '_blank')}
                >
                  Visit <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Supporters */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Award className="h-6 w-6 text-blue-400" />
            <h3 className="text-2xl font-bold text-white">Community Supporters</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {sponsors.supporters.map((supporter, index) => (
              <div key={index} className="bg-card/30 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all duration-300 group">
                <div className="aspect-square bg-white/90 rounded-lg p-3 mb-3 flex items-center justify-center">
                  <img 
                    src={supporter.logo} 
                    alt={supporter.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <h4 className="text-lg font-semibold text-white mb-1">{supporter.name}</h4>
                <p className="text-white/60 text-xs mb-3">{supporter.description}</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-xs"
                  onClick={() => window.open(supporter.website, '_blank')}
                >
                  Visit <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button 
            onClick={() => navigate('/sponsors')}
            className="bg-electric-blue hover:bg-electric-blue/80 text-white font-semibold px-8 py-3"
          >
            View All Sponsors & Partners
          </Button>
        </div>

      </div>
    </section>
  );
};

export default SponsorsSection;