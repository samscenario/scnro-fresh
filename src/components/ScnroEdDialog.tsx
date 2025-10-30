import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ScnroEdDialogProps {
  children: React.ReactNode;
}

export const ScnroEdDialog = ({ children }: ScnroEdDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    age: "",
    addressNewham: "",
    previousExperience: "",
    motivation: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.phoneNumber || !formData.age || !formData.addressNewham || !formData.motivation) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from("scnro_ed_registrations")
        .insert({
          full_name: formData.fullName,
          email: formData.email,
          phone_number: formData.phoneNumber,
          age: parseInt(formData.age),
          address_newham: formData.addressNewham,
          previous_experience: formData.previousExperience || null,
          motivation: formData.motivation,
        });

      if (insertError) throw insertError;

      await supabase.functions.invoke("send-scnro-ed-notification", {
        body: {
          fullName: formData.fullName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          age: parseInt(formData.age),
          addressNewham: formData.addressNewham,
          previousExperience: formData.previousExperience,
          motivation: formData.motivation,
        },
      });

      toast.success("Registration submitted! Check your email for confirmation.");
      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        age: "",
        addressNewham: "",
        previousExperience: "",
        motivation: "",
      });
      setOpen(false);
    } catch (error: any) {
      console.error("Error submitting registration:", error);
      toast.error("Failed to submit registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>SCNRO Mental Toughness Programme</DialogTitle>
          <DialogDescription>
            6-Week Mental Toughness & Performing Arts Programme. Register now for upcoming sessions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div>
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                name="age"
                type="number"
                min="16"
                max="19"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="16-19"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="addressNewham">Address in Newham *</Label>
            <Textarea
              id="addressNewham"
              name="addressNewham"
              value={formData.addressNewham}
              onChange={handleInputChange}
              placeholder="Please provide your address (must live, work, or study in Newham)"
              rows={2}
              required
            />
          </div>

          <div>
            <Label htmlFor="previousExperience">Previous Performance/Creative Experience</Label>
            <Textarea
              id="previousExperience"
              name="previousExperience"
              value={formData.previousExperience}
              onChange={handleInputChange}
              placeholder="Tell us about any previous experience in performing arts, music, theatre, etc. (optional)"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="motivation">Why do you want to join this programme? *</Label>
            <Textarea
              id="motivation"
              name="motivation"
              value={formData.motivation}
              onChange={handleInputChange}
              placeholder="Tell us what you hope to gain from this programme and why you're interested"
              rows={4}
              required
            />
          </div>

          <div className="bg-muted p-4 rounded-lg text-sm">
            <p className="font-semibold mb-2">Programme Details:</p>
            <p>• Venue: Newham Sixth Form College Theatre Space</p>
            <p>• Ages: 16–19 (living, working, or studying in Newham)</p>
            <p>• Cost: £10 per session or £50 for all 6 sessions</p>
            <p className="italic mt-2">Scholarships available for low-income participants</p>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Submitting..." : "Submit Registration"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
