import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ScnroSchoolsDialogProps {
  children: React.ReactNode;
}

export const ScnroSchoolsDialog = ({ children }: ScnroSchoolsDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    schoolName: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    schoolType: "",
    studentCount: "",
    preferredStartDate: "",
    additionalInfo: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, schoolType: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.schoolName || !formData.contactName || !formData.contactEmail || !formData.contactPhone || !formData.schoolType || !formData.studentCount) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const { error: insertError } = await supabase
        .from("scnro_ed_schools_registrations")
        .insert({
          school_name: formData.schoolName,
          contact_name: formData.contactName,
          contact_email: formData.contactEmail,
          contact_phone: formData.contactPhone,
          school_type: formData.schoolType,
          student_count: parseInt(formData.studentCount),
          preferred_start_date: formData.preferredStartDate || null,
          additional_info: formData.additionalInfo || null,
        });

      if (insertError) throw insertError;

      await supabase.functions.invoke("send-scnro-schools-notification", {
        body: {
          schoolName: formData.schoolName,
          contactName: formData.contactName,
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone,
          schoolType: formData.schoolType,
          studentCount: parseInt(formData.studentCount),
          preferredStartDate: formData.preferredStartDate,
          additionalInfo: formData.additionalInfo,
        },
      });

      toast.success("School registration submitted! Check your email for confirmation.");
      setFormData({
        schoolName: "",
        contactName: "",
        contactEmail: "",
        contactPhone: "",
        schoolType: "",
        studentCount: "",
        preferredStartDate: "",
        additionalInfo: "",
      });
      setOpen(false);
    } catch (error: any) {
      console.error("Error submitting school registration:", error);
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
          <DialogTitle>Mental Toughness in Education - Schools & Colleges</DialogTitle>
          <DialogDescription>
            Register your school or college for the 6-week Mental Toughness Programme
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="schoolName">School/College Name *</Label>
            <Input
              id="schoolName"
              name="schoolName"
              value={formData.schoolName}
              onChange={handleInputChange}
              placeholder="Enter your school/college name"
              required
            />
          </div>

          <div>
            <Label htmlFor="schoolType">School Type *</Label>
            <Select value={formData.schoolType} onValueChange={handleSelectChange} required>
              <SelectTrigger>
                <SelectValue placeholder="Select school type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="secondary">Secondary School</SelectItem>
                <SelectItem value="sixth_form">Sixth Form College</SelectItem>
                <SelectItem value="fe_college">FE College</SelectItem>
                <SelectItem value="academy">Academy</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactName">Contact Name *</Label>
              <Input
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <Label htmlFor="contactEmail">Contact Email *</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleInputChange}
                placeholder="Your email"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactPhone">Contact Phone *</Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={handleInputChange}
                placeholder="Your phone number"
                required
              />
            </div>

            <div>
              <Label htmlFor="studentCount">Number of Students *</Label>
              <Input
                id="studentCount"
                name="studentCount"
                type="number"
                min="1"
                max="50"
                value={formData.studentCount}
                onChange={handleInputChange}
                placeholder="10-20 recommended"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="preferredStartDate">Preferred Start Date</Label>
            <Input
              id="preferredStartDate"
              name="preferredStartDate"
              value={formData.preferredStartDate}
              onChange={handleInputChange}
              placeholder="e.g., September 2025, Next term"
            />
          </div>

          <div>
            <Label htmlFor="additionalInfo">Additional Information</Label>
            <Textarea
              id="additionalInfo"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleInputChange}
              placeholder="Any specific requirements, questions, or information about your students"
              rows={4}
            />
          </div>

          <div className="bg-muted p-4 rounded-lg text-sm space-y-2">
            <p className="font-semibold">Programme Overview:</p>
            <p>• Target Group: Years 10–13 (ages 14–19)</p>
            <p>• Delivery: 6 consecutive sessions - group and 1:1 coaching</p>
            <p>• Location: Central Newham venue or on-site at your school</p>
            <p>• Includes: MTQ Assessments, coaching sessions, progress reports</p>
            <p className="font-semibold mt-3">Pricing:</p>
            <p>• Partner School: £500 per 10 students (£50 each)</p>
            <p>• Member School: £350/year membership + reduced rates</p>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Submitting..." : "Submit School Registration"}
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
