import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import { Link } from "react-router-dom";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ApplyLab = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [application, setApplication] = useState({
    applicant_name: '',
    applicant_email: '',
    phone: '',
    lab_title: '',
    lab_description: '',
    target_audience: '',
    duration_hours: '',
    equipment_needed: '',
    mentor_experience: '',
    motivation: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('lab_applications')
        .insert([{
          ...application,
          duration_hours: application.duration_hours ? parseInt(application.duration_hours) : null
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your lab application has been submitted! We'll review it and get back to you soon."
      });

      // Reset form
      setApplication({
        applicant_name: '',
        applicant_email: '',
        phone: '',
        lab_title: '',
        lab_description: '',
        target_audience: '',
        duration_hours: '',
        equipment_needed: '',
        mentor_experience: '',
        motivation: ''
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setApplication(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-electric-blue/20 via-background/60 to-background/90" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="text-6xl md:text-8xl">🎯</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-gradient-to-r from-electric-blue to-acid-green bg-clip-text mb-6">
            APPLY FOR A LAB
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
            Ready to lead your own creative lab? Share your vision with the SCNRO community.
          </p>
          <Button variant="hero" size="xl" asChild>
            <Link to="/labs">Back to Labs</Link>
          </Button>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-card/50 border-electric-blue/20">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Lab Application Form</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-electric-blue">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="applicant_name">Full Name *</Label>
                      <Input
                        id="applicant_name"
                        required
                        value={application.applicant_name}
                        onChange={(e) => handleInputChange('applicant_name', e.target.value)}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="applicant_email">Email *</Label>
                      <Input
                        id="applicant_email"
                        type="email"
                        required
                        value={application.applicant_email}
                        onChange={(e) => handleInputChange('applicant_email', e.target.value)}
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={application.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Your phone number"
                    />
                  </div>
                </div>

                {/* Lab Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-electric-blue">Lab Details</h3>
                  <div>
                    <Label htmlFor="lab_title">Lab Title *</Label>
                    <Input
                      id="lab_title"
                      required
                      value={application.lab_title}
                      onChange={(e) => handleInputChange('lab_title', e.target.value)}
                      placeholder="e.g., Beat Making Fundamentals"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lab_description">Lab Description *</Label>
                    <Textarea
                      id="lab_description"
                      required
                      value={application.lab_description}
                      onChange={(e) => handleInputChange('lab_description', e.target.value)}
                      placeholder="Describe what your lab will cover, what participants will learn, and the format"
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="target_audience">Target Audience</Label>
                      <Input
                        id="target_audience"
                        value={application.target_audience}
                        onChange={(e) => handleInputChange('target_audience', e.target.value)}
                        placeholder="e.g., Beginners, Intermediate, All levels"
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration_hours">Duration (hours)</Label>
                      <Input
                        id="duration_hours"
                        type="number"
                        min="1"
                        max="8"
                        value={application.duration_hours}
                        onChange={(e) => handleInputChange('duration_hours', e.target.value)}
                        placeholder="2"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="equipment_needed">Equipment Needed</Label>
                    <Textarea
                      id="equipment_needed"
                      value={application.equipment_needed}
                      onChange={(e) => handleInputChange('equipment_needed', e.target.value)}
                      placeholder="List any equipment, software, or materials needed for the lab"
                      rows={3}
                    />
                  </div>
                </div>

                {/* Experience & Motivation */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-electric-blue">About You</h3>
                  <div>
                    <Label htmlFor="mentor_experience">Your Experience & Qualifications</Label>
                    <Textarea
                      id="mentor_experience"
                      value={application.mentor_experience}
                      onChange={(e) => handleInputChange('mentor_experience', e.target.value)}
                      placeholder="Tell us about your background, experience, and qualifications relevant to this lab"
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="motivation">Why do you want to run this lab?</Label>
                    <Textarea
                      id="motivation"
                      value={application.motivation}
                      onChange={(e) => handleInputChange('motivation', e.target.value)}
                      placeholder="What motivates you to share this knowledge with the community?"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? 'Submitting...' : 'Submit Application'}
                  </Button>
                  <Button type="button" variant="outline" asChild>
                    <Link to="/labs">Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default ApplyLab;