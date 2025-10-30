import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";
import TikTokPortalTile from "@/components/TikTokPortalTile";
import YouTubePortalTile from "@/components/YouTubePortalTile";
import InstagramTransitionTile from "@/components/InstagramTransitionTile";
import SubmitToFeedTile from "@/components/SubmitToFeedTile";
import VideoUploadTile from "@/components/VideoUploadTile";
import VideoUploadTileSecondary from "@/components/VideoUploadTileSecondary";
import MainframeFundingUploadTile from "@/components/MainframeFundingUploadTile";
import ImageCarouselTile from "@/components/ImageCarouselTile";
import tshirtImage from "@/assets/merch-tshirt-white-border.jpg";
import hoodieImage from "@/assets/merch-hoodie-final.jpg";
import rucksackImage from "@/assets/merch-rucksack-final.jpg";
import waterFlaskImage from "@/assets/merch-water-flask-final.jpg";

const dropItems = [
  {
    type: "T-Shirt",
    design: "SCNRO Classic",
    image: tshirtImage,
    price: "£25"
  },
  {
    type: "Hoodie", 
    design: "SCNRO Classic",
    image: hoodieImage,
    price: "£45"
  },
  {
    type: "Rucksack",
    design: "SCNRO Classic",
    image: rucksackImage,
    price: "£55"
  },
  {
    type: "Water Flask",
    design: "SCNRO Classic",
    image: waterFlaskImage,
    price: "£22"
  }
];

const TheDropSection = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-4 px-4 bg-gradient-to-b from-background to-card">
      <div className="max-w-6xl mx-auto">

        {/* Culture Feed Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-black font-russo text-transparent bg-gradient-to-r from-white to-electric-blue bg-clip-text mb-4 flex items-center justify-center gap-4">
            CULTURE FEED
          </h2>
        </div>

        {/* Culture Feed Grid - Featured Content + Tiles Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          
          {/* Featured Content Section - Desktop Version */}
          <div className="hidden lg:block relative">
            <div className="relative bg-black/90 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-electric-blue/30">
              
              <div className="relative z-10 p-4">
                
                {/* 4 Panel Image Grid */}
                <div className="grid grid-cols-2 gap-4 min-h-[400px]">
                  {/* MAINFRAME Funding Upload Tile */}
                  <MainframeFundingUploadTile />

                  {/* Video Upload Tile */}
                  <VideoUploadTile />

                  {/* Video Upload Tile Secondary */}
                  <VideoUploadTileSecondary />

                  {/* Image Carousel Tile */}
                  <ImageCarouselTile />
                </div>
              </div>
            </div>
          </div>

          {/* Culture Tiles Grid - 2x2 */}
          <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
            {/* TikTok Portal Tile */}
            <TikTokPortalTile />
            
            {/* YouTube Portal Tile */}
            <YouTubePortalTile />
            
            {/* Instagram Transition Tile */}
            <InstagramTransitionTile />
            
            {/* Submit to Feed Tile */}
            <SubmitToFeedTile />
          </div>
          
          {/* Featured Content Section - Mobile Version */}
          <div className="block lg:hidden">
            <div className="relative bg-black/90 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-electric-blue/30 p-4">
              <div className="">
                
                {/* 2x2 Grid for Mobile */}
                <div className="grid grid-cols-2 gap-4 min-h-[300px]">
                  <MainframeFundingUploadTile />
                  
                  <VideoUploadTile />
                  
                  <VideoUploadTileSecondary />
                  
                  <ImageCarouselTile />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default TheDropSection;