import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Wifi } from "lucide-react";

const systemItems = [{
  name: "",
  descriptor: "creativity & culture",
  color: "bg-black border-2 border-white",
  hoverColor: "hover:bg-gray-900",
  logo: "/lovable-uploads/33208f42-1caa-4a1d-89b2-898c18ec2107.png",
  scenarioImage: "/lovable-uploads/edc3c308-1d0f-49ad-b83b-e7d28b698769.png",
  leftImage: "/lovable-uploads/33208f42-1caa-4a1d-89b2-898c18ec2107.png",
  rightLogo: "/lovable-uploads/2c5ef961-d9a8-4c05-9bd4-1a98899503dc.png",
  route: "/mainframe",
  textColor: "text-white"
}, {
  name: "",
  descriptor: "creator workshops",
  color: "bg-blue-600",
  hoverColor: "hover:bg-blue-500",
  textColor: "text-white",
  logo: "/lovable-uploads/80a58777-e432-468b-9b36-a3b5a58fb4ec.png",
  scenarioImage: "/lovable-uploads/c6582346-2387-464a-8bf0-0fe64358c2b4.png",
  route: "/labs"
}, {
  name: "",
  descriptor: "merch & art",
  color: "bg-blue-600",
  hoverColor: "hover:bg-blue-500",
  logo: "/lovable-uploads/d6ec7fd7-bce6-49e1-8dcc-5782c5450c61.png",
  scenarioImage: "/lovable-uploads/4ffd0c6f-f400-46c8-abb0-2f4a65a20764.png",
  route: "/drop",
  textColor: "text-white"
}, {
  name: "",
  descriptor: "SECRET SHOWS + DJ SETS",
  color: "bg-black border-2 border-white",
  hoverColor: "hover:bg-gray-900",
  logo: "/lovable-uploads/42149761-652e-43da-b1bb-5a21382e31b4.png",
  scenarioImage: "/lovable-uploads/8f999063-7732-47f0-ab07-8af4039a8fc4.png",
  route: "/signal",
  textColor: "text-white"
}];

const FeaturedScenarios = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        // Show tagline after SYSTEM text appears
        setTimeout(() => {
          setShowTagline(true);
        }, 1500);
      }
    }, {
      threshold: 0.2
    });

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleItemClick = (route: string) => {
    navigate(route);
  };

  return (
    <section ref={sectionRef} className="py-12 px-4 bg-black border-t border-white/20">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className={`text-4xl md:text-5xl font-black font-russo text-white mb-4 flex items-center justify-center gap-4 transition-all duration-1000 ${isVisible ? 'animate-fade-in' : 'opacity-0 translate-y-16'}`}>
            CORE
          </h2>
          
          {/* Tagline */}
          {showTagline && (
            <div className={`text-center mb-8 transition-all duration-1000 ${showTagline ? 'animate-fade-in' : 'opacity-0 translate-y-4'}`}>
              
            </div>
          )}
        </div>

        {/* MOBILE: Collapsible system */}
        <div className="md:hidden">
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger className="w-full bg-gray-900 rounded-lg px-4 py-4 font-semibold text-lg hover:bg-gray-800 transition-colors duration-200 flex items-center justify-between">
              <span>Open CORE</span>
              <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <div className="flex flex-col gap-4">
                {systemItems.map((item, index) => (
                  <button 
                    key={`mobile-${item.route}-${index}`} 
                    onClick={() => handleItemClick(item.route)} 
                    className={`
                      ${item.color} ${item.hoverColor} ${item.textColor || 'text-white'}
                      rounded-xl px-4 py-6 text-center font-bold text-lg 
                      transition-all duration-300 transform hover:scale-[1.02]
                      relative overflow-hidden group
                      ${showTagline ? 'animate-fade-in' : 'opacity-0'}
                    `} 
                    style={{
                      animationDelay: showTagline ? `${index * 0.1}s` : '0s',
                      animationFillMode: 'forwards'
                    }}
                  >
                     {/* WiFi Signal for Mainframe */}
                     {item.route === '/mainframe' && (
                       <div className="absolute top-3 right-3 z-20">
                         <Wifi className="h-7 w-7 text-white animate-pulse" />
                       </div>
                     )}
                     
                     {/* Green Status Light for Connected Boxes */}
                     {item.route !== '/mainframe' && (
                       <div className="absolute top-3 right-3 z-20">
                         <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                       </div>
                     )}

                     <div className={`flex flex-col items-center ${item.route === '/signal' ? 'gap-1' : 'gap-3'} h-[80px] justify-center relative z-10`}>
                         {item.scenarioImage ? (
                           <img 
                             src={item.scenarioImage} 
                             alt="SCENARIO" 
                             className={`${item.route === '/signal' ? 'h-20 w-auto mt-2 animate-pulse' : item.route === '/mainframe' ? 'h-36 w-auto animate-spin-slow' : 'h-16 w-auto'}`} 
                           />
                         ) : (
                         <div className="text-xl font-black">{item.name}</div>
                       )}
                       {item.route !== '/mainframe' && (
                         <div className={`text-base font-medium opacity-80 ${item.textColor || 'text-white'}`}>
                           {item.descriptor}
                         </div>
                       )}
                     </div>
                  </button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* DESKTOP: 2x2 grid */}
        <div className="hidden md:grid md:grid-cols-2 gap-6">
          {systemItems.map((item, index) => (
            <button 
              key={`desktop-${item.route}-${index}`} 
              onClick={() => handleItemClick(item.route)} 
              className={`
                ${item.color} ${item.hoverColor} ${item.textColor || 'text-white'}
                rounded-xl px-8 py-12 text-center font-bold text-xl 
                transition-all duration-300
                relative overflow-hidden group
                ${showTagline ? 'animate-fade-in' : 'opacity-0'}
              `}
              style={{
                animationDelay: showTagline ? `${index * 0.2}s` : '0s',
                animationFillMode: 'forwards'
              }}
             >
               {/* WiFi Signal for Mainframe */}
               {item.route === '/mainframe' && (
                 <div className="absolute top-4 right-4 z-20">
                   <Wifi className="h-8 w-8 text-white animate-pulse" />
                 </div>
               )}
               
               {/* Green Status Light for Connected Boxes */}
               {item.route !== '/mainframe' && (
                 <div className="absolute top-4 right-4 z-20">
                   <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
                 </div>
               )}

               <div className={`flex flex-col items-center ${item.route === '/signal' ? 'gap-2' : 'gap-6'} h-[120px] justify-center relative z-10`}>
                  {item.scenarioImage ? (
                    <img 
                      src={item.scenarioImage} 
                      alt="SCENARIO" 
                      className={`${item.route === '/signal' ? 'h-32 w-auto mt-3 animate-pulse' : item.route === '/mainframe' ? 'h-52 w-auto animate-spin-slow' : 'h-24 w-auto'}`}
                    />
                  ) : (
                  <div className="text-3xl font-black">{item.name}</div>
                )}
                {item.route !== '/mainframe' && (
                  <div className={`text-xl font-medium opacity-90 ${item.textColor || 'text-white'}`}>
                    {item.descriptor}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedScenarios;