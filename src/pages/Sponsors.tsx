import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ExternalLink, Crown, Star, Award, Heart, Mail, Handshake } from "lucide-react";

const allSponsors = {
  platinum: [
    {
      name: "TechCorp Global",
      logo: "/lovable-uploads/42149761-652e-43da-b1bb-5a21382e31b4.png",
      website: "https://techcorp.com",
      description: "Leading technology solutions for creative industries",
      fullDescription: "TechCorp Global has been at the forefront of creative technology for over 15 years, providing cutting-edge solutions that empower artists, musicians, and content creators worldwide. Their commitment to innovation and community support makes them an invaluable partner in our mission.",
      contributions: ["Studio Equipment Sponsorship", "Technology Infrastructure", "Educational Workshops", "Mentorship Programs"]
    },
    {
      name: "Creative Solutions Inc",
      logo: "/lovable-uploads/4c66c6a2-43af-4418-828b-e6d55a12a305.png",
      website: "https://creativesolutions.com",
      description: "Comprehensive creative services and production support",
      fullDescription: "Creative Solutions Inc specializes in end-to-end creative production services, from concept development to final delivery. Their generous support enables us to maintain professional standards across all our projects and provide top-tier resources to our community.",
      contributions: ["Production Services", "Equipment Loans", "Professional Development", "Industry Connections"]
    }
  ],
  gold: [
    {
      name: "Creative Studios",
      logo: "/lovable-uploads/3c94039c-0810-4fd5-8c4a-ba2782f91894.png",
      website: "https://creativestudios.com",
      description: "Professional audio and video production services",
      fullDescription: "Creative Studios brings decades of experience in professional media production to our community.",
      contributions: ["Studio Access", "Production Training", "Equipment Support"]
    },
    {
      name: "Digital Media Pro",
      logo: "/lovable-uploads/5210333c-85bb-4350-ab55-9294f7469653.png",
      website: "https://digitalmediapro.com",
      description: "Content creation and digital marketing solutions",
      fullDescription: "Digital Media Pro helps creators maximize their reach through strategic digital marketing and content optimization.",
      contributions: ["Marketing Support", "Content Strategy", "Platform Optimization"]
    },
    {
      name: "Audio Innovations",
      logo: "/lovable-uploads/70297e01-ba1c-4e7c-8f57-0fbc10b7820b.png",
      website: "https://audioinnovations.com",
      description: "Cutting-edge audio technology and equipment",
      fullDescription: "Audio Innovations provides state-of-the-art audio equipment and expertise to enhance our creative productions.",
      contributions: ["Audio Equipment", "Technical Support", "Training Programs"]
    },
    {
      name: "Visual Arts Collective",
      logo: "/lovable-uploads/76bf4548-f9f7-4470-90a7-ad8db45812ae.png",
      website: "https://visualartscollective.com",
      description: "Supporting visual artists and designers",
      fullDescription: "Visual Arts Collective champions visual creativity through funding, resources, and community building.",
      contributions: ["Design Resources", "Creative Funding", "Artist Networking"]
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
    },
    {
      name: "Music Education Initiative",
      logo: "/lovable-uploads/68b7280e-f415-4e0b-82bf-3cf0290927db.png",
      website: "https://musiceducation.org",
      description: "Promoting music education and accessibility"
    },
    {
      name: "Digital Arts Academy",
      logo: "/lovable-uploads/6dc615e0-9ed3-4b55-9512-ba4a363bb522.png",
      website: "https://digitalarts.edu",
      description: "Training the next generation of digital artists"
    },
    {
      name: "Creative Commons",
      logo: "/lovable-uploads/6e274fd0-3e33-48f6-a2d0-5baca163f161.png",
      website: "https://creativecommons.org",
      description: "Promoting open creative collaboration"
    }
  ]
};

const Sponsors = () => {
  return (
    <div className="min-h-screen bg-charcoal-deep">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-gradient-to-b from-charcoal-deep to-card">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-black font-russo text-transparent bg-gradient-to-r from-white to-electric-blue bg-clip-text mb-6">
              OUR SPONSORS & PARTNERS
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
              We're proud to partner with incredible organizations who share our vision of empowering creativity and supporting the next generation of artists, musicians, and content creators.
            </p>
          </div>
        </section>

        {/* Platinum Sponsors */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <Crown className="h-8 w-8 text-yellow-400" />
              <h2 className="text-4xl font-bold text-white">Platinum Sponsors</h2>
            </div>
            
            <div className="space-y-8">
              {allSponsors.platinum.map((sponsor, index) => (
                <Card key={index} className="bg-card/50 backdrop-blur-sm border-electric-blue/30">
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-3 gap-8 items-center">
                      <div className="md:col-span-1">
                        <div className="aspect-video bg-white/95 rounded-lg p-6 flex items-center justify-center">
                          <img 
                            src={sponsor.logo} 
                            alt={sponsor.name}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <h3 className="text-2xl font-bold text-white mb-4">{sponsor.name}</h3>
                        <p className="text-white/80 mb-6 leading-relaxed">{sponsor.fullDescription}</p>
                        
                        <div className="mb-6">
                          <h4 className="text-lg font-semibold text-white mb-3">Key Contributions:</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {sponsor.contributions.map((contribution, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-white/70">
                                <div className="w-2 h-2 bg-electric-blue rounded-full"></div>
                                {contribution}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => window.open(sponsor.website, '_blank')}
                          className="bg-electric-blue hover:bg-electric-blue/80 text-white"
                        >
                          Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Gold Sponsors */}
        <section className="py-16 px-4 bg-gradient-to-b from-background to-card">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <Star className="h-8 w-8 text-yellow-500" />
              <h2 className="text-4xl font-bold text-white">Gold Sponsors</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {allSponsors.gold.map((sponsor, index) => (
                <Card key={index} className="bg-card/30 backdrop-blur-sm border-white/20">
                  <CardContent className="p-6">
                    <div className="aspect-video bg-white/95 rounded-lg p-4 mb-4 flex items-center justify-center">
                      <img 
                        src={sponsor.logo} 
                        alt={sponsor.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{sponsor.name}</h3>
                    <p className="text-white/70 mb-4 text-sm leading-relaxed">{sponsor.fullDescription}</p>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-white mb-2">Contributions:</h4>
                      <div className="space-y-1">
                        {sponsor.contributions.map((contribution, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-white/60 text-sm">
                            <div className="w-1.5 h-1.5 bg-electric-blue rounded-full"></div>
                            {contribution}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => window.open(sponsor.website, '_blank')}
                    >
                      Visit Website <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Community Supporters */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-12">
              <Heart className="h-8 w-8 text-red-400" />
              <h2 className="text-4xl font-bold text-white">Community Supporters</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
              {allSponsors.supporters.map((supporter, index) => (
                <div key={index} className="bg-card/20 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer text-center"
                     onClick={() => window.open(supporter.website, '_blank')}>
                  <div className="aspect-square bg-white/95 rounded-lg p-3 mb-3 flex items-center justify-center">
                    <img 
                      src={supporter.logo} 
                      alt={supporter.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <h4 className="text-sm font-medium text-white mb-1">{supporter.name}</h4>
                  <p className="text-xs text-white/60">{supporter.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partnership CTA */}
        <section className="py-16 px-4 bg-gradient-to-b from-card to-background">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Handshake className="h-16 w-16 text-electric-blue" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">Become a Partner</h2>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Interested in supporting creativity and innovation? Join our community of sponsors and partners who are making a real difference in the creative industry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-electric-blue hover:bg-electric-blue/80 text-white px-8"
                onClick={() => window.open('mailto:partnerships@scenario.com', '_blank')}
              >
                <Mail className="mr-2 h-5 w-5" />
                Partnership Inquiry
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="px-8"
              >
                Download Partnership Pack
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Sponsors;