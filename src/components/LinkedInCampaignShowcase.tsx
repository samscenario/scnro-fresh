import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import linkedInHeroTile from "@/assets/linkedin-hero-tile.jpg";
import linkedInProgrammeHighlights from "@/assets/linkedin-programme-highlights.jpg";
import linkedInCoverBanner from "@/assets/linkedin-cover-banner.jpg";

const LinkedInCampaignShowcase = () => {
  const downloadHeroTile = () => {
    // Download the image
    const imageLink = document.createElement('a');
    imageLink.href = linkedInHeroTile;
    imageLink.download = 'SCNRO-LinkedIn-Hero-Tile.jpg';
    document.body.appendChild(imageLink);
    imageLink.click();
    document.body.removeChild(imageLink);

    // Create and download the content strategy text file
    const contentStrategy = `SCNRO LinkedIn Hero Tile - Content Strategy

• Headlines partnership opportunity
• Features MAINFRAME Festival date
• Clear CTA for sponsor engagement

---
MAINFRAME Festival 2026 Partnership Outreach
Static Hero Tile (1200×1200)`;

    const blob = new Blob([contentStrategy], { type: 'text/plain' });
    const textLink = document.createElement('a');
    textLink.href = URL.createObjectURL(blob);
    textLink.download = 'SCNRO-LinkedIn-Hero-Tile-Strategy.txt';
    document.body.appendChild(textLink);
    textLink.click();
    document.body.removeChild(textLink);
    URL.revokeObjectURL(textLink.href);
  };
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-4 bg-gradient-to-r from-neon-orange via-electric-blue to-hot-pink bg-clip-text text-transparent">
            SCNRO LinkedIn Campaign Pack
          </h1>
          <p className="text-xl text-gray-300">MAINFRAME Festival 2026 Partnership Outreach</p>
        </div>

        {/* LinkedIn Cover Banner */}
        <Card className="mb-8 bg-card border-electric-blue/30">
          <CardHeader>
            <CardTitle className="text-electric-blue">LinkedIn Cover Banner</CardTitle>
            <p className="text-gray-400">Professional header for LinkedIn company page</p>
          </CardHeader>
          <CardContent>
            <img 
              src={linkedInCoverBanner} 
              alt="SCNRO LinkedIn Cover Banner" 
              className="w-full rounded-lg border border-electric-blue/20 shadow-lg"
            />
          </CardContent>
        </Card>

        {/* Campaign Tiles Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Hero Tile */}
          <Card className="bg-card border-electric-blue/30">
            <CardHeader>
              <CardTitle className="text-hot-pink">Static Hero Tile</CardTitle>
              <p className="text-gray-400">Main partnership invitation post (1200×1200)</p>
            </CardHeader>
            <CardContent>
              <img 
                src={linkedInHeroTile} 
                alt="SCNRO LinkedIn Hero Tile" 
                className="w-full rounded-lg border border-hot-pink/20 shadow-lg"
              />
              <Button
                onClick={downloadHeroTile}
                className="w-full mt-4 bg-gradient-to-r from-hot-pink to-electric-blue hover:from-hot-pink/80 hover:to-electric-blue/80 text-white font-bold"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Static Hero Tile
              </Button>
              <div className="mt-4 p-4 bg-black/50 rounded-lg">
                <h3 className="font-bold text-hot-pink mb-2">Content Strategy:</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• Headlines partnership opportunity</li>
                  <li>• Features MAINFRAME Festival date</li>
                  <li>• Clear CTA for sponsor engagement</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Programme Highlights */}
          <Card className="bg-card border-electric-blue/30">
            <CardHeader>
              <CardTitle className="text-neon-orange">Programme Highlights</CardTitle>
              <p className="text-gray-400">Event ecosystem overview (1200×1200)</p>
            </CardHeader>
            <CardContent>
              <img 
                src={linkedInProgrammeHighlights} 
                alt="SCNRO Programme Highlights" 
                className="w-full rounded-lg border border-neon-orange/20 shadow-lg"
              />
              <div className="mt-4 p-4 bg-black/50 rounded-lg">
                <h3 className="font-bold text-neon-orange mb-2">Value Proposition:</h3>
                <ul className="text-sm text-gray-300 space-y-1">
                  <li>• MAINFRAME Festival reach</li>
                  <li>• SIGNAL STREAM monthly events</li>
                  <li>• CAMPUS STAGE student network</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaign Notes */}
        <Card className="mt-8 bg-card border-cyber-purple/30">
          <CardHeader>
            <CardTitle className="text-cyber-purple">Campaign Strategy Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-bold text-electric-blue mb-2">Visual Theme</h3>
                <p className="text-sm text-gray-300">High-contrast B&W photography with red/yellow/orange glitch effects</p>
              </div>
              <div>
                <h3 className="font-bold text-hot-pink mb-2">Target Audience</h3>
                <p className="text-sm text-gray-300">Brand partnerships, event sponsors, cultural collaborators</p>
              </div>
              <div>
                <h3 className="font-bold text-neon-orange mb-2">Next Steps</h3>
                <p className="text-sm text-gray-300">Create animated MP4s and carousel versions for maximum reach</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LinkedInCampaignShowcase;