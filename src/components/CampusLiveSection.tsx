import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import CampusInquiryDialog from "./CampusInquiryDialog";

const campusEvents = [
  {
    university: "UCL",
    date: "MARCH 14",
    location: "LONDON",
    status: "NEXT UP",
    color: "from-acid-green to-electric-blue"
  },
  {
    university: "UEL", 
    date: "MARCH 22",
    location: "LONDON", 
    status: "CONFIRMED",
    color: "from-neon-orange to-warning-red"
  },
  {
    university: "GOLDSMITHS",
    date: "APRIL 5",
    location: "LONDON",
    status: "TICKETS LIVE",
    color: "from-neon-orange to-warning-red"
  },
  {
    university: "KING'S",
    date: "APRIL 12",
    location: "LONDON",
    status: "COMING SOON",
    color: "from-acid-green to-electric-blue"
  }
];

const CampusLiveSection = () => {
  return (
    <section className="py-6 px-4 relative overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:20px_20px] animate-pulse" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-electric-blue rounded-full animate-ping" />
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-hot-pink rounded-full animate-ping animation-delay-500" />
        <div className="absolute bottom-1/3 left-2/3 w-1.5 h-1.5 bg-cyber-purple rounded-full animate-ping animation-delay-1000" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black font-russo text-transparent bg-gradient-to-r from-white to-electric-blue bg-clip-text mb-4 flex items-center justify-center gap-4">
            CAMPUS LIVE
          </h2>
        </div>

        {/* Campus Events Grid - CTA + University Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          
          {/* CTA Section - Desktop Version */}
          <div className="campus-desktop hidden lg:block relative min-h-[400px]">
            <div className="relative bg-black/90 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-white h-full min-h-[400px]">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img 
                  src="/lovable-uploads/39bc824a-7f26-4728-841d-59306610c74e.png" 
                  alt="Invite SCNRO to your campus - boarding pass style"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>
              
              <div className="relative text-left z-10 p-8 h-full flex flex-col justify-end items-start">
                {/* CLICK TO INVITE button positioned in bottom left */}
                <div className="mt-4">
                  <CampusInquiryDialog>
                    <Button 
                      variant="destructive"
                      size="lg"
                      type="button"
                      className="relative overflow-hidden group/btn bg-red-600 hover:bg-red-700 text-white font-black text-lg px-12 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] cursor-pointer"
                    >
                      <span className="relative z-10 uppercase tracking-wider flex items-center gap-3">
                        <span className="text-2xl">▶</span>
                        CLICK TO INVITE
                      </span>
                      
                      {/* Button Effects */}
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                    </Button>
                  </CampusInquiryDialog>
                </div>
              </div>
            </div>
          </div>

          {/* Universities Grid - 2x2 on desktop, 1x4 on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {campusEvents.map((event, index) => (
              <div key={index} className="relative group">
                {/* Event Card Border */}
                <div className={`absolute -inset-1 bg-gradient-to-r ${event.color} rounded-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300`} />
                
                <div className="relative bg-black/90 backdrop-blur-sm rounded-xl p-4 border border-electric-blue/30 h-full flex flex-col">
                  {/* Status Badge */}
                  <div className={`inline-block px-2 py-1 bg-gradient-to-r ${event.color} text-black font-black text-xs uppercase tracking-wider rounded-full mb-2 self-start`}>
                    {event.status}
                  </div>
                  
                  {/* University Name */}
                  <h3 className="text-lg font-black text-white mb-1 uppercase tracking-wider">
                    {event.university}
                  </h3>
                  
                  {/* Location */}
                  <p className="text-electric-blue/80 font-bold uppercase tracking-wide text-xs mb-2">
                    {event.location}
                  </p>
                  
                  {/* Date */}
                  <div className="text-sm font-black text-transparent bg-gradient-to-r from-electric-blue to-hot-pink bg-clip-text uppercase tracking-wider mb-3 flex-grow">
                    {event.date}
                  </div>

                  {/* Get Tickets Button */}
                  <Button 
                    variant="outline"
                    size="sm"
                    asChild
                    className="relative overflow-hidden group/btn border-electric-blue/50 text-electric-blue hover:bg-electric-blue hover:text-black font-black text-xs px-4 py-2 rounded-full transition-all duration-300 hover:scale-105 w-full"
                  >
                    <Link to="/campus-tickets">
                      <span className="relative z-10 uppercase tracking-wider">
                        GET TICKETS NOW
                      </span>
                    </Link>
                  </Button>

                  {/* Corner Accent */}
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-electric-blue/50 rounded-br-lg" />
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section - Mobile Version - SAME AS DESKTOP */}
          <div className="campus-mobile block lg:hidden relative min-h-[350px]">
            <div className="relative rounded-2xl overflow-hidden border-2 border-white h-full min-h-[350px]">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img 
                  src="/lovable-uploads/39bc824a-7f26-4728-841d-59306610c74e.png" 
                  alt="Invite SCNRO to your campus - boarding pass style"
                  className="w-full h-full object-contain object-center scale-95"
                />
              </div>
              
              <div className="relative text-left z-10 p-6 h-full flex flex-col justify-end items-start">
                {/* CLICK TO INVITE button positioned in bottom left */}
                <div className="mt-3">
                  <CampusInquiryDialog>
                    <Button 
                      variant="destructive"
                      size="lg"
                      type="button"
                      className="relative overflow-hidden group/btn bg-red-600 hover:bg-red-700 text-white font-black text-base px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] cursor-pointer"
                    >
                      <span className="relative z-10 uppercase tracking-wider flex items-center gap-2">
                        <span className="text-xl">▶</span>
                        CLICK TO INVITE
                      </span>
                      
                      {/* Button Effects */}
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-200" />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                    </Button>
                  </CampusInquiryDialog>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CampusLiveSection;