interface CircularTextProps {
  className?: string;
  size?: number;
  textColor?: string;
}

const CircularText = ({ 
  className = "", 
  size = 180, 
  textColor = "#ffffff"
}: CircularTextProps) => {
  const radius = size / 2 - 25;
  const centerX = size / 2;
  const centerY = size / 2;
  
  const renderTextAlong = (text: string, startAngle: number, clockwise = true, reverse = false, customAngleSpan?: number) => {
    let characters = text.split('');
    
    // Reverse characters if needed (for bottom text to read left to right)
    if (reverse) {
      characters = characters.reverse();
    }
    
    const angleSpan = customAngleSpan || Math.PI * 0.4; // Use custom or default
    const angleStep = angleSpan / (characters.length - 1);
    
    return characters.map((char, index) => {
      const angle = startAngle + (clockwise ? index : -index) * angleStep;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      // Calculate rotation for each character
      const rotation = (angle * 180) / Math.PI + (clockwise ? 90 : -90);
      
      return (
        <text
          key={`${text}-${index}`}
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="16"
          fontWeight="900"
          fontFamily="Russo One, system-ui, -apple-system, sans-serif"
          fill={textColor}
          transform={`rotate(${rotation}, ${x}, ${y})`}
          className="select-none"
        >
          {char}
        </text>
      );
    });
  };

  // Calculate individual letter positions
  const musicStartAngle = -Math.PI * 0.6;
  const musicAngleSpan = Math.PI * 0.2;
  const musicAngleStep = musicAngleSpan / ("MUSIC".length - 1);
  const musicEndAngle = musicStartAngle + (musicAngleStep * ("MUSIC".length - 1)); // "C" position
  
  const playerStartAngle = Math.PI * 0.6;
  const playerAngleSpan = Math.PI * 0.25;
  const playerAngleStep = playerAngleSpan / ("PLAYER".length - 1);
  const playerEndAngle = playerStartAngle - (playerAngleStep * ("PLAYER".length - 1)); // "R" position
  
  
  return (
    <div className={`relative ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        {/* Decorative curve on far right - slightly longer arc */}
        <path
          d={`M ${centerX + radius * Math.cos(-Math.PI * 0.25)} ${centerY + radius * Math.sin(-Math.PI * 0.25)} A ${radius} ${radius} 0 0 1 ${centerX + radius * Math.cos(Math.PI * 0.25)} ${centerY + radius * Math.sin(Math.PI * 0.25)}`}
          fill="none"
          stroke="#ffffff"
          strokeWidth="3"
          opacity="0.8"
        />
        
        {/* Decorative curve on left side - slightly longer arc */}
        <path
          d={`M ${centerX + radius * Math.cos(Math.PI * 0.75)} ${centerY + radius * Math.sin(Math.PI * 0.75)} A ${radius} ${radius} 0 0 1 ${centerX + radius * Math.cos(Math.PI * 1.25)} ${centerY + radius * Math.sin(Math.PI * 1.25)}`}
          fill="none"
          stroke="#ffffff"
          strokeWidth="3"
          opacity="0.8"
        />
        
        {/* PLAYER on left side */}
        {renderTextAlong("PLAYER", Math.PI * 0.6, false, false, playerAngleSpan)}
        
        {/* MUSIC at top */}
        {renderTextAlong("MUSIC", musicStartAngle, true, false, musicAngleSpan)}
      </svg>
      
      {/* Center content with logo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <img 
          src="/lovable-uploads/68b7280e-f415-4e0b-82bf-3cf0290927db.png" 
          alt="Logo" 
          className="w-24 h-24 object-contain"
        />
      </div>
    </div>
  );
};

export default CircularText;