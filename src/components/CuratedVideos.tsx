import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Video } from "lucide-react";

// Curated video content - this would eventually come from a CMS or admin-managed database
const curatedVideos = [
  {
    id: "1",
    title: "SCNRO Live Session #1",
    description: "Exclusive live performance from our underground studio",
    thumbnail: "/placeholder.svg",
    duration: "15:30",
    type: "Live Session"
  },
  {
    id: "2",
    title: "Behind the Scenes: Studio Life",
    description: "A glimpse into the creative process at SCNRO",
    thumbnail: "/placeholder.svg", 
    duration: "8:45",
    type: "Documentary"
  },
  {
    id: "3",
    title: "Artist Spotlight: Underground Voices",
    description: "Featuring emerging artists from the SCNRO collective",
    thumbnail: "/placeholder.svg",
    duration: "22:10", 
    type: "Interview"
  },
  {
    id: "4",
    title: "SCNRO Campus Tour",
    description: "Bringing the underground sound to university campuses",
    thumbnail: "/placeholder.svg",
    duration: "12:20",
    type: "Event Coverage"
  }
];

const CuratedVideos = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const handleVideoClick = (videoId: string) => {
    setSelectedVideo(selectedVideo === videoId ? null : videoId);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">SCNRO Visual</h2>
        <p className="text-muted-foreground">Curated video content and exclusive behind-the-scenes footage</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {curatedVideos.map((video) => (
          <Card 
            key={video.id} 
            className="bg-background/50 backdrop-blur border-muted hover:bg-background/80 transition-all duration-300 cursor-pointer group"
            onClick={() => handleVideoClick(video.id)}
          >
            <CardContent className="p-0">
              <div className="relative aspect-video overflow-hidden rounded-t-lg">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="rounded-full bg-primary/90 hover:bg-primary text-primary-foreground"
                  >
                    <Play className="h-6 w-6 ml-1" />
                  </Button>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                  {video.type}
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <Video className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground text-sm line-clamp-2 mb-1">
                      {video.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {video.description}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Placeholder for video player modal - would integrate with actual video player */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg p-4 max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {curatedVideos.find(v => v.id === selectedVideo)?.title}
              </h3>
              <Button
                variant="ghost"
                onClick={() => setSelectedVideo(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </Button>
            </div>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Video player would be integrated here</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CuratedVideos;