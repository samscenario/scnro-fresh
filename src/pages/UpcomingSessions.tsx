import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import { Link } from "react-router-dom";

const UpcomingSessions = () => {
  const sessions = [
    { title: "Beat Making Fundamentals", mentor: "DJ Kojo", date: "Feb 15", time: "7-9 PM", spots: 12 },
    { title: "Visual Storytelling", mentor: "Nia Chen", date: "Feb 18", time: "6-8 PM", spots: 8 },
    { title: "Fashion Design Lab", mentor: "Zara M.", date: "Feb 22", time: "2-5 PM", spots: 6 },
    { title: "Photography Workshop", mentor: "Marcus K.", date: "Feb 25", time: "1-4 PM", spots: 10 },
    { title: "DJ Mixing Masterclass", mentor: "Alex R.", date: "Mar 1", time: "3-6 PM", spots: 15 },
    { title: "Creative Writing Workshop", mentor: "Sam T.", date: "Mar 5", time: "5-7 PM", spots: 20 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-hot-pink/20 via-background/60 to-background/90" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="text-6xl md:text-8xl">📅</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-gradient-to-r from-hot-pink to-electric-blue bg-clip-text mb-6">
            UPCOMING SESSIONS
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Book your spot in the next SCNRO labs and level up your creative skills.
          </p>
          <Button variant="hero" size="xl" asChild>
            <Link to="/labs">Back to Labs</Link>
          </Button>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session, index) => (
              <Card key={index} className="p-6 bg-card/50 border-hot-pink/20 hover:border-electric-blue/40 transition-all duration-300">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-foreground">{session.title}</h3>
                  <p className="text-electric-blue font-semibold">with {session.mentor}</p>
                  <div className="space-y-2 text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span>{session.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span>{session.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Available spots:</span>
                      <span className="text-acid-green font-semibold">{session.spots}</span>
                    </div>
                  </div>
                  <Button variant="cta" className="w-full">
                    Book Spot
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default UpcomingSessions;