import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Music, Users, Ticket, CheckCircle } from "lucide-react";

interface CampusEvent {
  university: string;
  date: string;
  fullDate: string;
  time: string;
  venue: string;
  color: string;
  status: string;
  ticketsAvailable: number;
  attendees: number;
  headliners: string[];
}

const campusEvents: CampusEvent[] = [
  {
    university: "UCL",
    date: "MARCH 14",
    fullDate: "Friday, March 14, 2025",
    time: "7:00 PM - 1:00 AM",
    venue: "Quad Bar & Venue",
    color: "from-acid-green to-electric-blue",
    status: "NEXT UP",
    ticketsAvailable: 47,
    attendees: 253,
    headliners: ["DJ NEXUS", "CRAVE COLLECTIVE", "BASS THERAPY"]
  },
  {
    university: "LOUGHBOROUGH",
    date: "MARCH 22",
    fullDate: "Saturday, March 22, 2025", 
    time: "8:00 PM - 2:00 AM",
    venue: "Students' Union Main Hall",
    color: "from-neon-orange to-warning-red",
    status: "CONFIRMED",
    ticketsAvailable: 89,
    attendees: 311,
    headliners: ["VOLTAGE", "SONIC REBELS", "NIGHT SHIFT"]
  },
  {
    university: "GOLDSMITHS",
    date: "APRIL 5",
    fullDate: "Saturday, April 5, 2025",
    time: "7:30 PM - 1:30 AM", 
    venue: "Great Hall",
    color: "from-cyber-purple to-hot-pink",
    status: "TICKETS LIVE",
    ticketsAvailable: 23,
    attendees: 177,
    headliners: ["ECHO MAZE", "DIGITAL DREAMS", "PULSE"]
  }
];

const CampusLiveTicketCard = () => {
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(null);
  const [ticketBooked, setTicketBooked] = useState<{ [key: string]: boolean }>({});

  const handleGetTicket = (event: CampusEvent) => {
    setTicketBooked(prev => ({ ...prev, [event.university]: true }));
    // In real app, this would trigger actual ticket booking
  };

  return (
    <div className="max-w-6xl mx-auto relative z-10">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-6xl font-black font-russo text-foreground mb-6 flex items-center justify-center gap-4 animate-fade-in">
          <img 
            src="/lovable-uploads/b945c63f-87df-4701-ac10-24c5dde261fe.png" 
            alt="SCNRO Logo" 
            className="h-12 md:h-16 w-auto animate-pulse"
          />
          : <span className="text-transparent bg-gradient-to-r from-acid-green via-electric-blue to-hot-pink bg-clip-text animate-pulse">CAMPUS LIVE</span>
        </h2>
        <p className="text-xl font-bold text-electric-blue uppercase tracking-wider animate-fade-in">
          // GET YOUR TICKETS NOW
        </p>
      </div>

      <Tabs defaultValue={campusEvents[0].university} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8 bg-black/50 border border-electric-blue/30 rounded-2xl p-2">
          {campusEvents.map((event) => (
            <TabsTrigger 
              key={event.university}
              value={event.university}
              className={`relative rounded-xl font-black text-sm md:text-base tracking-wider data-[state=active]:bg-gradient-to-r data-[state=active]:${event.color} data-[state=active]:text-black transition-all duration-300`}
              onClick={() => setSelectedEvent(event)}
            >
              {event.university}
            </TabsTrigger>
          ))}
        </TabsList>

        {campusEvents.map((event) => (
          <TabsContent key={event.university} value={event.university} className="mt-0">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Event Info Card */}
              <Card className="group relative overflow-hidden rounded-3xl bg-black/90 border border-electric-blue/30 hover:border-electric-blue/60 transition-all duration-500">
                <div className="absolute -inset-1 bg-gradient-to-r from-electric-blue/20 via-hot-pink/20 to-cyber-purple/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                
                <CardContent className="relative p-8 space-y-6">
                  <div className={`w-full h-32 rounded-2xl bg-gradient-to-br ${event.color} flex items-center justify-center mb-6`}>
                    <h3 className="text-4xl font-black text-white drop-shadow-lg">
                      {event.university}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-foreground">
                      <Calendar className="w-5 h-5 text-electric-blue" />
                      <div>
                        <p className="font-bold">{event.fullDate}</p>
                        <p className="text-sm text-muted-foreground">{event.time}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-foreground">
                      <MapPin className="w-5 h-5 text-hot-pink" />
                      <p className="font-semibold">{event.venue}</p>
                    </div>

                    <div className="flex items-center gap-3 text-foreground">
                      <Users className="w-5 h-5 text-cyber-purple" />
                      <p className="font-semibold">{event.attendees} attending</p>
                    </div>

                    <div className="flex items-center gap-3 text-foreground">
                      <Ticket className="w-5 h-5 text-acid-green" />
                      <p className="font-semibold">{event.ticketsAvailable} tickets left</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Music className="w-5 h-5 text-electric-blue" />
                      <p className="font-bold text-foreground">Headliners</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {event.headliners.map((artist) => (
                        <Badge 
                          key={artist} 
                          variant="outline" 
                          className="bg-gradient-to-r from-electric-blue/10 to-hot-pink/10 border-electric-blue/30 text-foreground font-semibold"
                        >
                          {artist}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Badge 
                    variant="outline" 
                    className={`${
                      event.status === 'TICKETS LIVE' ? 'bg-acid-green/20 border-acid-green text-acid-green' :
                      event.status === 'NEXT UP' ? 'bg-electric-blue/20 border-electric-blue text-electric-blue' :
                      'bg-neon-orange/20 border-neon-orange text-neon-orange'
                    } font-black tracking-wider`}
                  >
                    {event.status}
                  </Badge>
                </CardContent>
              </Card>

              {/* Ticket Card */}
              <Card className="relative overflow-hidden rounded-3xl bg-black/90 border border-hot-pink/30">
                <div className="absolute -inset-1 bg-gradient-to-r from-hot-pink/20 via-cyber-purple/20 to-electric-blue/20 rounded-3xl opacity-75 animate-pulse" />
                
                <CardContent className="relative p-8">
                  {!ticketBooked[event.university] ? (
                    <div className="text-center space-y-6">
                      <div className={`w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br ${event.color} flex items-center justify-center`}>
                        <Ticket className="w-16 h-16 text-white" />
                      </div>
                      
                      <div>
                        <h4 className="text-2xl font-black text-foreground mb-2">
                          GET YOUR TICKET
                        </h4>
                        <p className="text-electric-blue font-semibold">
                          {event.university} CAMPUS LIVE
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          {event.date} • {event.venue}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div className="text-3xl font-black text-transparent bg-gradient-to-r from-acid-green to-electric-blue bg-clip-text">
                          FREE
                        </div>
                        
                        <Button 
                          onClick={() => handleGetTicket(event)}
                          className={`w-full relative overflow-hidden group/btn bg-gradient-to-r ${event.color} hover:scale-105 text-black font-black text-lg py-6 rounded-2xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]`}
                        >
                          <span className="relative z-10 uppercase tracking-wider flex items-center gap-2">
                            <Ticket className="w-5 h-5" />
                            GET TICKET
                          </span>
                          
                          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200" />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-6">
                      <div className="w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br from-acid-green to-electric-blue flex items-center justify-center animate-pulse">
                        <CheckCircle className="w-16 h-16 text-white" />
                      </div>
                      
                      <div>
                        <h4 className="text-2xl font-black text-acid-green mb-2">
                          TICKET SECURED!
                        </h4>
                        <p className="text-electric-blue font-semibold">
                          {event.university} CAMPUS LIVE
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          {event.date} • {event.venue}
                        </p>
                      </div>

                      <div className="space-y-4 p-6 rounded-2xl bg-gradient-to-br from-acid-green/10 to-electric-blue/10 border border-acid-green/30">
                        <div className="text-xs font-bold text-acid-green uppercase tracking-wider">
                          DIGITAL TICKET
                        </div>
                        <div className="text-lg font-black text-foreground">
                          SCNRO-{event.university}-{Math.random().toString(36).substr(2, 6).toUpperCase()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Show this at the door • Screenshot for backup
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default CampusLiveTicketCard;