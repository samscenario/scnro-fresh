import { useEffect, useState } from "react";

const AnimatedSignature = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex justify-center mt-6 mb-4">
      <div 
        className={`transition-all duration-1000 ${
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        style={{ 
          animationDelay: isVisible ? '0.5s' : '0s',
          animationFillMode: 'both'
        }}
      >
        <img
          src="/lovable-uploads/6dc615e0-9ed3-4b55-9512-ba4a363bb522.png"
          alt="Sam Scenario Signature"
          className="h-20 md:h-24 object-contain filter brightness-0 invert"
          style={{
            filter: 'brightness(0) saturate(100%) invert(47%) sepia(96%) saturate(6457%) hue-rotate(180deg) brightness(98%) contrast(101%)'
          }}
        />
      </div>
    </div>
  );
};

export default AnimatedSignature;