import React from 'react';

interface ScnroLogoProps {
  className?: string;
}

const ScnroLogo: React.FC<ScnroLogoProps> = ({ className = "h-8 w-auto" }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Base logo */}
      <img 
        src="/lovable-uploads/61867d72-7763-4295-8206-dcd72d104a40.png" 
        alt="SCNRO Logo" 
        className="h-full w-auto"
      />
      
      {/* Decorative circles around the 'o' */}
      <div className="absolute top-1/2 right-2 transform -translate-y-1/2 pointer-events-none">
        {/* Yellow outer circle */}
        <div className="absolute inset-0 w-3 h-3 bg-yellow-400 rounded-full opacity-80"></div>
        {/* White inner circle */}
        <div className="absolute inset-0 w-2 h-2 bg-white rounded-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>
    </div>
  );
};

export default ScnroLogo;