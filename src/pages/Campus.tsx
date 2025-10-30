import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";

const Campus = () => {
  const tourDates = [
    { university: "Goldsmiths", location: "London", date: "March 15", status: "Confirmed", societies: ["DJ Society", "Film Club"] },
    { university: "UAL", location: "London", date: "March 22", status: "Confirmed", societies: ["Art Students Union", "Fashion Collective"] },
    { university: "KCL", location: "London", date: "April 5", status: "Planning", societies: ["Music Society", "Creative Writing"] },
    { university: "Westminster", location: "London", date: "April 12", status: "Planning", societies: ["Media Society", "Photography Club"] },
    { university: "Loughborough", location: "Leicester", date: "April 19", status: "Requested", societies: ["Student Union", "Arts Society"] },
    { university: "Your Uni", location: "Anywhere", date: "TBA", status: "Apply Now", societies: ["Your Society"] }
  ];

  const streetTeam = [
    { name: "Ayo", uni: "Goldsmiths", role: "Campus Rep" },
    { name: "Marcus", uni: "Westminster", role: "Event Coordinator" },
    { name: "Zara", uni: "KCL", role: "Social Media" },
    { name: "Kojo", uni: "UAL", role: "Artist Liaison" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Header Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-acid-green/20 via-background/60 to-background/90" />
        
        {/* Animated Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-acid-green/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-electric-blue/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="text-6xl md:text-8xl">📍</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-gradient-to-r from-acid-green to-electric-blue bg-clip-text mb-6">
            SCNRO: CAMPUS
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold text-acid-green mb-8">
            TAKING OVER UNI, ONE CAMPUS AT A TIME
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Live events. Open mics. Workshops. Drops. SCNRO pops up at universities across London and beyond. If you want us at yours — make it happen.
          </p>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Button variant="hero" size="xl" className="min-w-[200px]">
              HOST US AT YOUR UNI
            </Button>
            <Button variant="outline" size="xl" className="min-w-[200px]">
              VIEW TOUR DATES
            </Button>
            <Button variant="cta" size="xl" className="min-w-[200px]">
              MEET THE STREET TEAM
            </Button>
          </div>

          {/* Tour Map & Dates */}
          <div className="mb-20">
            <h3 className="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-acid-green to-electric-blue bg-clip-text mb-8 text-center">
              CAMPUS TOUR 2024
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tourDates.map((tour, index) => (
                <Card key={index} className="p-6 bg-card/50 border-acid-green/20 hover:border-electric-blue/40 transition-all duration-300">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xl font-bold text-foreground">{tour.university}</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        tour.status === 'Confirmed' ? 'bg-acid-green/20 text-acid-green' :
                        tour.status === 'Planning' ? 'bg-neon-orange/20 text-neon-orange' :
                        tour.status === 'Requested' ? 'bg-cyber-purple/20 text-cyber-purple' :
                        'bg-electric-blue/20 text-electric-blue'
                      }`}>
                        {tour.status}
                      </span>
                    </div>
                    <p className="text-acid-green font-semibold">{tour.location}</p>
                    <p className="text-muted-foreground">{tour.date}</p>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">Partner Societies:</p>
                      {tour.societies.map((society, idx) => (
                        <p key={idx} className="text-sm text-muted-foreground">• {society}</p>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* What We Bring */}
          <div className="mb-20">
            <h3 className="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-electric-blue to-hot-pink bg-clip-text mb-8 text-center">
              WHAT WE BRING TO YOUR CAMPUS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 bg-card/50 border-electric-blue/20 hover:border-acid-green/40 transition-all duration-300 text-center">
                <span className="text-4xl mb-4 block">🎤</span>
                <h4 className="text-lg font-bold text-foreground mb-2">Live Events</h4>
                <p className="text-sm text-muted-foreground">Concerts, showcases, and performance nights</p>
              </Card>

              <Card className="p-6 bg-card/50 border-electric-blue/20 hover:border-hot-pink/40 transition-all duration-300 text-center">
                <span className="text-4xl mb-4 block">🎨</span>
                <h4 className="text-lg font-bold text-foreground mb-2">Creative Workshops</h4>
                <p className="text-sm text-muted-foreground">SCNRO: LABS sessions on your campus</p>
              </Card>

              <Card className="p-6 bg-card/50 border-electric-blue/20 hover:border-neon-orange/40 transition-all duration-300 text-center">
                <span className="text-4xl mb-4 block">🛍️</span>
                <h4 className="text-lg font-bold text-foreground mb-2">Pop-Up Shops</h4>
                <p className="text-sm text-muted-foreground">Exclusive campus drops and merch</p>
              </Card>

              <Card className="p-6 bg-card/50 border-electric-blue/20 hover:border-cyber-purple/40 transition-all duration-300 text-center">
                <span className="text-4xl mb-4 block">📢</span>
                <h4 className="text-lg font-bold text-foreground mb-2">Open Mics</h4>
                <p className="text-sm text-muted-foreground">Spotlight local student talent</p>
              </Card>
            </div>
          </div>

          {/* Street Team */}
          <div className="mb-20">
            <h3 className="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-hot-pink to-acid-green bg-clip-text mb-8 text-center">
              MEET THE STREET TEAM
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {streetTeam.map((member, index) => (
                <Card key={index} className="p-6 bg-card/50 border-hot-pink/20 hover:border-acid-green/40 transition-all duration-300 text-center">
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-muted/40 rounded-full mx-auto flex items-center justify-center mb-4">
                      <span className="text-2xl">👤</span>
                    </div>
                    <h4 className="text-lg font-bold text-foreground">{member.name}</h4>
                    <p className="text-hot-pink font-semibold">{member.uni}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* How to Host */}
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-neon-orange to-cyber-purple bg-clip-text mb-8">
              BRING SCNRO TO YOUR CAMPUS
            </h3>
            <div className="max-w-4xl mx-auto">
              <Card className="p-8 bg-card/50 border-neon-orange/20 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <span className="text-4xl mb-4 block">📝</span>
                    <h4 className="text-xl font-bold text-foreground mb-4">Step 1: Apply</h4>
                    <p className="text-muted-foreground">Fill out our campus partnership form with your society details and event ideas.</p>
                  </div>

                  <div className="text-center">
                    <span className="text-4xl mb-4 block">🤝</span>
                    <h4 className="text-xl font-bold text-foreground mb-4">Step 2: Plan</h4>
                    <p className="text-muted-foreground">We'll work with your student union and societies to plan the perfect SCNRO experience.</p>
                  </div>

                  <div className="text-center">
                    <span className="text-4xl mb-4 block">🎉</span>
                    <h4 className="text-xl font-bold text-foreground mb-4">Step 3: Party</h4>
                    <p className="text-muted-foreground">Host an unforgettable event that puts your campus on the SCNRO map.</p>
                  </div>
                </div>
              </Card>

              <div className="space-y-4">
                <p className="text-lg text-muted-foreground">
                  We partner with student unions, societies, and creative collectives to bring SCNRO's full experience to your university.
                </p>
                <Button variant="hero" size="xl" className="min-w-[250px]">
                  APPLY FOR LAB
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Campus;