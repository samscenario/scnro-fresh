import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

// Curated images from uploads
const carouselImages = [
  {
    id: "1",
    src: "/lovable-uploads/9e56f24e-63c1-4040-a2b5-d54f52a42de4.png",
    alt: "Basketball Court Layout",
    title: "Multi-Court Design"
  },
  {
    id: "2", 
    src: "/lovable-uploads/bc757326-07e7-43b0-ad68-26a567c0ca7f.png",
    alt: "Modern Campus Architecture",
    title: "Campus Venue"
  }
];

const ImageCarouselTile = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % carouselImages.length);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const currentImage = carouselImages[currentIndex];

  return (
    <div className="relative overflow-hidden border border-gray-600 hover:border-primary transition-colors rounded-lg h-full group">
      {/* Main Image */}
      <div className="relative w-full h-full">
        <img
          src={currentImage.src}
          alt={currentImage.alt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Navigation Controls */}
        <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            onClick={goToPrevious}
            variant="ghost"
            size="sm"
            className="bg-black/50 hover:bg-black/70 text-white border-none rounded-full w-8 h-8 p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={goToNext}
            variant="ghost"
            size="sm"
            className="bg-black/50 hover:bg-black/70 text-white border-none rounded-full w-8 h-8 p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Image Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon className="w-4 h-4 text-primary" />
            <span className="text-xs uppercase tracking-wide opacity-80">Gallery</span>
          </div>
          <h3 className="text-sm font-semibold line-clamp-1">
            {currentImage.title}
          </h3>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-3 right-3 flex gap-1">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIndex(index);
                setTimeout(() => setIsAutoPlaying(true), 5000);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-primary scale-110' 
                  : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Animated Border */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/30 rounded-lg transition-colors duration-300" />
      
      {/* Corner Effects */}
      <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

export default ImageCarouselTile;