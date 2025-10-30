import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock, Users, Zap, Heart, Music, Coffee, Palette, Mic } from "lucide-react";
import { useNavigate } from "react-router-dom";
const MainframeNewsletter = () => {
  const navigate = useNavigate();
  const programmeItems = [{
    time: "11:00 – 12:00",
    title: "Future You / Generation Next",
    theme: "Vision, inspiration, and innovation",
    featuring: "Nike • Apple • UEL • Sam Scenario",
    icon: <Zap className="h-6 w-6" />,
    gradient: "from-electric-blue to-cyber-purple"
  }, {
    time: "12:00 – 13:00",
    title: "Mental Toughness & Music",
    theme: "Resilience & creativity in the music industry",
    featuring: "Point Blank Music School • Native Instruments • Pioneer DJ • Ableton Live",
    icon: <Heart className="h-6 w-6" />,
    gradient: "from-hot-pink to-neon-orange"
  }, {
    time: "13:00 – 14:00",
    title: "Lunch + Networking",
    theme: "Fuel up, connect with creatives & industry insiders",
    featuring: "",
    icon: <Coffee className="h-6 w-6" />,
    gradient: "from-neon-orange to-electric-blue"
  }, {
    time: "14:00 – 15:00",
    title: "Q&A + Fashion Show: UBUNTU / AI",
    theme: "Ubuntu philosophy meets AI design in a unique culture-tech showcase",
    featuring: "",
    icon: <Palette className="h-6 w-6" />,
    gradient: "from-cyber-purple to-hot-pink"
  }, {
    time: "15:00 – 18:00",
    title: "MAINFRAME MUSIC FESTIVAL",
    theme: "High-energy DJ sets, live acts, and emerging talent",
    featuring: "",
    icon: <Music className="h-6 w-6" />,
    gradient: "from-hot-pink to-electric-blue"
  }, {
    time: "17:00 – 18:00",
    title: "Sounds of Scenario Finale",
    theme: "Collaborative performances to close the day in style",
    featuring: "",
    icon: <Mic className="h-6 w-6" />,
    gradient: "from-electric-blue to-neon-orange"
  }];
  return <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Animated Neon Glitch Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-neon-orange via-hot-pink to-electric-blue opacity-20">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyber-purple/30 via-transparent to-neon-orange/30 animate-pulse" />
          <div className="absolute inset-0 opacity-10 animate-[fade-in_2s_ease-in-out_infinite_alternate]" style={{
          backgroundImage: `
                repeating-linear-gradient(
                  90deg,
                  transparent,
                  transparent 2px,
                  rgba(255,255,255,0.1) 2px,
                  rgba(255,255,255,0.1) 4px
                ),
                repeating-linear-gradient(
                  0deg,
                  transparent,
                  transparent 2px,
                  rgba(255,255,255,0.1) 2px,
                  rgba(255,255,255,0.1) 4px
                )
              `
        }} />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Home Button */}
          <div className="absolute top-0 left-4 z-20">
            <Button 
              onClick={() => navigate('/')} 
              className="bg-card/80 backdrop-blur-sm border border-border hover:bg-card text-foreground"
            >
              ← Home
            </Button>
          </div>

          {/* SCNRO Logo */}
          <div className="mb-8 animate-scale-in">
            <img src="/lovable-uploads/56a1d6ce-d5e6-4cc9-91d3-cb3f2db90ca4.png" alt="SCNRO Royal Docks London" className="h-20 md:h-32 mx-auto" />
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4 animate-fade-in">
            Conference and Live Music Festival
          </h1>

          {/* Event Details */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-xl md:text-2xl font-bold text-muted-foreground mb-8 animate-fade-in" style={{
          animationDelay: '0.2s'
        }}>
            <div className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-electric-blue" />
              <span className="text-yellow-200">15.08.2026</span>
            </div>
            <div className="hidden md:block w-1 h-1 bg-electric-blue rounded-full" />
            <div className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-hot-pink" />
              <span>TBC</span>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6">
            Don't Miss Out!
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
            Free passes for our talks, workshops, and live shows are flying.<br />
            Join us for a day of <span className="text-white font-bold">SOUND</span>, <span className="text-white font-bold">STYLE</span>, and <span className="text-white font-bold">SCENARIO</span> — from industry insights to unforgettable performances.
          </p>
        </div>
      </section>

      {/* Programme Highlights */}
      <section className="py-16 px-4 bg-card/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black text-center text-foreground mb-12">
            Programme Highlights
          </h2>

          <div className="grid gap-6">
            {programmeItems.map((item, index) => <div key={index} className="relative group animate-fade-in" style={{
            animationDelay: `${index * 0.1}s`
          }}>
                {/* Glowing background effect */}
                <div className={`absolute -inset-2 bg-gradient-to-r ${item.gradient} opacity-20 blur-xl rounded-3xl group-hover:opacity-30 transition-opacity duration-300`} />
                
                <div className="relative bg-card border-2 border-transparent bg-gradient-to-r from-electric-blue/10 via-hot-pink/10 to-cyber-purple/10 rounded-2xl p-6 md:p-8 hover:scale-[1.02] transition-transform duration-300">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Time and Icon */}
                    <div className="flex items-center gap-4 min-w-fit">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${item.gradient} text-background`}>
                        {item.icon}
                      </div>
                      <div className="flex items-center gap-2 text-lg font-bold text-muted-foreground">
                        <Clock className="h-5 w-5" />
                        <span>{item.time}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-2xl md:text-3xl font-black text-foreground mb-2">
                        {item.title}
                      </h3>
                      <p className="text-lg text-muted-foreground mb-3">
                        {item.theme}
                      </p>
                      {item.featuring && <div className="flex items-center gap-2 text-sm font-semibold">
                          <Users className="h-4 w-4 text-electric-blue" />
                          <span className="text-electric-blue">Featuring:</span>
                          <span className="text-muted-foreground">{item.featuring}</span>
                        </div>}
                    </div>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Glitch-styled CTA button */}
          <div className="relative mb-8">
            <div className="absolute -inset-4 bg-gradient-to-r from-neon-orange via-hot-pink to-electric-blue opacity-30 blur-2xl animate-pulse" />
            <Button size="xl" className="relative text-2xl md:text-3xl font-black px-12 py-6 bg-gradient-to-r from-neon-orange via-hot-pink to-electric-blue text-background hover:scale-105 transform transition-all duration-300 shadow-2xl border-4 border-background" onClick={() => window.open('#', '_blank')}>
              BOOK FREE TICKETS
            </Button>
          </div>

          <p className="text-lg text-muted-foreground">
            Limited spaces available - secure your spot today!
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-card border-t border-border">
        <div className="max-w-4xl mx-auto text-center">
          {/* Social Links */}
          <div className="mb-6">
            <p className="text-xl font-bold text-foreground mb-4">Follow SCNRO</p>
            <div className="flex justify-center gap-6 text-lg font-semibold">
              <a href="https://instagram.com/scnro" target="_blank" rel="noopener noreferrer" className="text-hot-pink hover:text-hot-pink/80 transition-colors">
                Instagram
              </a>
              <span className="text-muted-foreground">|</span>
              <a href="https://tiktok.com/@scnro" target="_blank" rel="noopener noreferrer" className="text-electric-blue hover:text-electric-blue/80 transition-colors">
                TikTok
              </a>
              <span className="text-muted-foreground">|</span>
              <a href="https://youtube.com/@scnro" target="_blank" rel="noopener noreferrer" className="text-neon-orange hover:text-neon-orange/80 transition-colors">
                YouTube
              </a>
            </div>
          </div>

          {/* Website Link */}
          <div className="border-t border-border pt-6">
            <a href="https://scnro.live" target="_blank" rel="noopener noreferrer" className="text-2xl font-bold text-transparent bg-gradient-to-r from-electric-blue via-hot-pink to-neon-orange bg-clip-text hover:scale-105 transition-transform inline-block">
              www.scnro.live
            </a>
          </div>
        </div>
      </footer>
    </div>;
};
export default MainframeNewsletter;