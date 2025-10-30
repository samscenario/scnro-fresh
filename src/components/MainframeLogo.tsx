import React from 'react';

interface MainframeLogoProps {
  className?: string;
  variant?: 'festival' | 'simple' | 'tech' | 'icon-only';
}

const MainframeLogo: React.FC<MainframeLogoProps> = ({ className = "w-64 h-32", variant = 'festival' }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Logo container */}
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        
        {/* Windows 95 style logo */}
        <div className="relative mb-4">
          {/* Main flag with curved effect */}
          <div className="relative">
            {/* Flag background with perspective */}
            <div 
              className="relative w-24 h-16 bg-gradient-to-r from-gray-600 to-gray-500"
              style={{
                transform: 'perspective(200px) rotateY(-15deg) rotateX(5deg)',
                borderRadius: '2px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
              }}
            >
              {/* Four colored squares on the flag */}
              <div className="absolute top-1 right-1 w-5 h-4 bg-red-500"></div>
              <div className="absolute top-6 right-1 w-5 h-4 bg-green-500"></div>
              <div className="absolute bottom-6 right-1 w-5 h-4 bg-blue-500"></div>
              <div className="absolute bottom-1 right-1 w-5 h-4 bg-yellow-400"></div>
            </div>
          </div>
          
          {/* Trailing dots effect */}
          <div className="absolute top-0 left-0 w-full h-full">
            {/* Red dots trail */}
            <div className="absolute w-1.5 h-1.5 bg-red-500 rounded-full" style={{ top: '8px', left: '-12px' }}></div>
            <div className="absolute w-1 h-1 bg-red-400 rounded-full" style={{ top: '6px', left: '-20px' }}></div>
            <div className="absolute w-0.5 h-0.5 bg-red-300 rounded-full" style={{ top: '5px', left: '-26px' }}></div>
            
            {/* Green dots trail */}
            <div className="absolute w-1.5 h-1.5 bg-green-500 rounded-full" style={{ top: '28px', left: '-10px' }}></div>
            <div className="absolute w-1 h-1 bg-green-400 rounded-full" style={{ top: '26px', left: '-18px' }}></div>
            <div className="absolute w-0.5 h-0.5 bg-green-300 rounded-full" style={{ top: '25px', left: '-24px' }}></div>
            
            {/* Blue dots trail */}
            <div className="absolute w-1.5 h-1.5 bg-blue-500 rounded-full" style={{ top: '40px', left: '-8px' }}></div>
            <div className="absolute w-1 h-1 bg-blue-400 rounded-full" style={{ top: '42px', left: '-16px' }}></div>
            <div className="absolute w-0.5 h-0.5 bg-blue-300 rounded-full" style={{ top: '43px', left: '-22px' }}></div>
            
            {/* Yellow dots trail */}
            <div className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full" style={{ top: '52px', left: '-6px' }}></div>
            <div className="absolute w-1 h-1 bg-yellow-300 rounded-full" style={{ top: '54px', left: '-14px' }}></div>
            <div className="absolute w-0.5 h-0.5 bg-yellow-200 rounded-full" style={{ top: '55px', left: '-20px' }}></div>
            
            {/* Additional scattered dots for more effect */}
            <div className="absolute w-1 h-1 bg-gray-400 rounded-full" style={{ top: '15px', left: '-28px' }}></div>
            <div className="absolute w-1 h-1 bg-gray-400 rounded-full" style={{ top: '35px', left: '-30px' }}></div>
            <div className="absolute w-0.5 h-0.5 bg-gray-300 rounded-full" style={{ top: '20px', left: '-32px' }}></div>
            <div className="absolute w-0.5 h-0.5 bg-gray-300 rounded-full" style={{ top: '45px', left: '-34px' }}></div>
          </div>
        </div>

        {/* Text variations */}
        <div className="text-center">
          {variant === 'festival' && (
            <>
              <div className="text-xs font-normal text-foreground tracking-wider mb-1">SCNRO®</div>
              <div className="text-2xl font-black text-foreground tracking-tight">
                Mainframe Festival
              </div>
              <div className="text-xs text-muted-foreground mt-1">®</div>
            </>
          )}
          {variant === 'simple' && (
            <div className="text-3xl font-black text-foreground tracking-tight">
              MAINFRAME
            </div>
          )}
          {variant === 'tech' && (
            <>
              <div className="text-lg font-mono text-foreground tracking-widest">
                MAINFRAME
              </div>
              <div className="text-xs text-muted-foreground mt-1 font-mono">SYSTEM_ONLINE</div>
            </>
          )}
          {/* icon-only variant shows no text */}
        </div>
      </div>
    </div>
  );
};

export default MainframeLogo;