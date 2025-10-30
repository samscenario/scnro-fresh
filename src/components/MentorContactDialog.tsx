import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail } from "lucide-react";

interface MentorContactDialogProps {
  mentorId: string;
  mentorName: string;
  children?: React.ReactNode;
}

interface ContactForm {
  requesterName: string;
  requesterEmail: string;
  message: string;
}

export const MentorContactDialog = ({ mentorId, mentorName, children }: MentorContactDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ContactForm>({
    requesterName: "",
    requesterEmail: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('mentor_contact_requests')
        .insert({
          mentor_id: mentorId,
          requester_name: formData.requesterName,
          requester_email: formData.requesterEmail,
          message: formData.message
        });

      if (error) throw error;

      toast.success('Contact request sent successfully! We\'ll forward your message to the mentor.');
      setFormData({
        requesterName: "",
        requesterEmail: "",
        message: ""
      });
      setOpen(false);
    } catch (error) {
      console.error('Error sending contact request:', error);
      toast.error('Failed to send contact request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.requesterName && formData.requesterEmail && formData.message;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Mail className="h-4 w-4 mr-2" />
            Contact Mentor
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Contact {mentorName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="requesterName">Your Name</Label>
            <Input
              id="requesterName"
              name="requesterName"
              value={formData.requesterName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="requesterEmail">Your Email</Label>
            <Input
              id="requesterEmail"
              name="requesterEmail"
              type="email"
              value={formData.requesterEmail}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Please describe what you'd like to discuss with this mentor..."
              className="min-h-[100px]"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || loading}
            >
              {loading ? "Sending..." : "Send Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};