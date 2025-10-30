import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";

const QuickAccessCard = () => {
  const navigate = useNavigate();

  return (
    <Card className="bg-gradient-to-br from-electric-blue/10 to-hot-pink/10 border-electric-blue/30 mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-electric-blue">
          <ExternalLink className="h-5 w-5" />
          Quick Access
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-300">
          View the LinkedIn Campaign Pack created for MAINFRAME Festival 2026 partnership outreach.
        </p>
        <Button 
          onClick={() => navigate("/linkedin-campaign")}
          className="w-full bg-gradient-to-r from-electric-blue to-hot-pink hover:from-electric-blue/80 hover:to-hot-pink/80 text-white font-bold"
        >
          View LinkedIn Campaign Pack
        </Button>
      </CardContent>
    </Card>
  );
};

export default QuickAccessCard;