import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CampusInquiryDialogProps {
  children: React.ReactNode;
}

const CampusInquiryDialog = ({ children }: CampusInquiryDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    university: "",
    position: "",
    message: ""
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.functions.invoke('send-campus-inquiry', {
        body: formData
      });

      if (error) throw error;

      toast({
        title: "Inquiry Submitted!",
        description: "Thanks for your interest! We'll get back to you within 2-3 business days.",
      });

      setFormData({
        name: "",
        email: "",
        university: "",
        position: "",
        message: ""
      });
      setOpen(false);
    } catch (error: any) {
      console.error("Error submitting inquiry:", error);
      toast({
        title: "Error",
        description: "Failed to submit inquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card border-acid-green/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-acid-green to-electric-blue bg-clip-text text-transparent">
            Bring SCNRO to Your Campus
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                className="border-acid-green/30 focus:border-acid-green"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
                className="border-acid-green/30 focus:border-acid-green"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="university">University *</Label>
            <Input
              id="university"
              value={formData.university}
              onChange={(e) => handleInputChange("university", e.target.value)}
              placeholder="e.g., University College London"
              required
              className="border-acid-green/30 focus:border-acid-green"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Your Role *</Label>
            <Select onValueChange={(value) => handleInputChange("position", value)} required>
              <SelectTrigger className="border-acid-green/30 focus:border-acid-green">
                <SelectValue placeholder="Select your position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student-union">Student Union Representative</SelectItem>
                <SelectItem value="society-president">Society President</SelectItem>
                <SelectItem value="events-coordinator">Events Coordinator</SelectItem>
                <SelectItem value="student-ambassador">Student Ambassador</SelectItem>
                <SelectItem value="faculty-staff">Faculty/Staff Member</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Tell us about your vision *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder="What type of event are you interested in? When would you like to host? Any specific requirements or ideas?"
              rows={4}
              required
              className="border-acid-green/30 focus:border-acid-green"
            />
          </div>

          <Button 
            type="submit" 
            variant="hero" 
            size="lg" 
            disabled={loading}
            className="w-full"
          >
            {loading ? "SUBMITTING..." : "SUBMIT INQUIRY"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CampusInquiryDialog;