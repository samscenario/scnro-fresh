import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, MapPin, Clock, Users, Ticket, Check, Shield } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface CampusEvent {
  id: string;
  university: string;
  location: string;
  event_date: string;
  event_time: string;
  venue: string;
  status: string;
  ticket_price: number;
  max_capacity: number;
  current_attendees: number;
  headliners: string[];
  societies: string[];
  description?: string;
}

interface CampusTicketBookingDialogProps {
  event: CampusEvent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBookingComplete: () => void;
}

interface BookingForm {
  student_name: string;
  student_email: string;
  university: string;
  course: string;
  year_of_study: string;
  phone_number: string;
  dietary_requirements: string;
  emergency_contact: string;
}

const CampusTicketBookingDialog = ({ event, open, onOpenChange, onBookingComplete }: CampusTicketBookingDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);
  const [ticketCode, setTicketCode] = useState("");
  const { user, session } = useAuth();
  const [formData, setFormData] = useState<BookingForm>({
    student_name: "",
    student_email: user?.email || "",
    university: event.university,
    course: "",
    year_of_study: "",
    phone_number: "",
    dietary_requirements: "",
    emergency_contact: ""
  });

  const handleInputChange = (field: keyof BookingForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if user is authenticated
      if (!user || !session) {
        throw new Error("You must be signed in to book tickets. Please sign in and try again.");
      }

      // Validate email matches authenticated user
      if (formData.student_email.toLowerCase().trim() !== user.email?.toLowerCase()) {
        throw new Error("Email must match your signed-in account email.");
      }

      // Validate email format on client side
      const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      if (!emailRegex.test(formData.student_email)) {
        throw new Error("Please enter a valid email address");
      }

      // Validate phone number format if provided
      if (formData.phone_number && !/^\+?[0-9\s\-\(\)]{10,15}$/.test(formData.phone_number)) {
        throw new Error("Please enter a valid phone number");
      }

      // Validate name length
      if (formData.student_name.length < 2 || formData.student_name.length > 100) {
        throw new Error("Name must be between 2 and 100 characters");
      }

      // Create secure booking by inserting directly with user_id
      const { data: booking, error: bookingError } = await supabase
        .from('campus_ticket_bookings')
        .insert({
          event_id: event.id,
          student_name: formData.student_name.trim(),
          student_email: formData.student_email.toLowerCase().trim(),
          university: formData.university.trim(),
          course: formData.course?.trim() || null,
          year_of_study: formData.year_of_study ? parseInt(formData.year_of_study) : null,
          user_id: user.id, // Link to authenticated user
          ticket_code: undefined // Let the database generate this
        })
        .select('id, ticket_code')
        .single();

      if (bookingError) {
        // Handle specific error cases with user-friendly messages
        if (bookingError.message.includes('Rate limit exceeded')) {
          throw new Error("Please wait a few minutes before making another booking.");
        }
        if (bookingError.message.includes('must be authenticated')) {
          throw new Error("Authentication required. Please sign in and try again.");
        }
        if (bookingError.message.includes('email must match')) {
          throw new Error("Email must match your signed-in account.");
        }
        throw bookingError;
      }

      // Create sensitive data record if any sensitive data is provided
      if (formData.phone_number?.trim() || formData.emergency_contact?.trim() || formData.dietary_requirements?.trim()) {
        const { error: sensitiveError } = await supabase
          .from('campus_booking_sensitive_data')
          .insert({
            booking_id: booking.id,
            phone_number: formData.phone_number?.trim() || null,
            emergency_contact: formData.emergency_contact?.trim() || null,
            dietary_requirements: formData.dietary_requirements?.trim() || null
          });

        if (sensitiveError) {
          console.warn('Failed to save sensitive data:', sensitiveError);
          // Don't fail the booking for this, but log it
        }
      }

      if (!booking || !booking.ticket_code) {
        throw new Error("Booking created but failed to retrieve ticket code");
      }

      setTicketCode(booking.ticket_code);
      setBooked(true);
      toast.success("Ticket booked successfully!");
      onBookingComplete();
    } catch (error: any) {
      console.error("Booking error:", error);
      toast.error(error.message || "Failed to book ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setBooked(false);
    setTicketCode("");
    setFormData({
      student_name: "",
      student_email: user?.email || "",
      university: event.university,
      course: "",
      year_of_study: "",
      phone_number: "",
      dietary_requirements: "",
      emergency_contact: ""
    });
    onOpenChange(false);
  };

  // Show authentication required message if user is not signed in
  if (!user || !session) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md bg-black/95 border-electric-blue/30">
          <div className="text-center space-y-6 py-8">
            <div className="w-16 h-16 bg-gradient-to-r from-electric-blue to-hot-pink rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-black" />
            </div>
            
            <div>
              <h3 className="text-2xl font-black text-transparent bg-gradient-to-r from-electric-blue to-hot-pink bg-clip-text uppercase tracking-wider mb-2">
                AUTHENTICATION REQUIRED
              </h3>
              <p className="text-electric-blue/80 font-bold uppercase tracking-wide text-sm">
                // SECURE BOOKING SYSTEM
              </p>
            </div>

            <div className="bg-gradient-to-r from-electric-blue/10 to-hot-pink/10 rounded-lg p-6 border border-electric-blue/30">
              <p className="text-sm text-foreground/80 mb-4">
                For security and data protection, you must be signed in to book tickets. This ensures your personal information is protected and linked to your verified account.
              </p>
              <p className="text-xs text-electric-blue/60 uppercase tracking-wider">
                Enhanced Security • Data Protection • Verified Bookings
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => onOpenChange(false)}
                variant="outline"
                className="flex-1 border-electric-blue/30 text-electric-blue hover:bg-electric-blue/10"
              >
                CANCEL
              </Button>
              <Button
                onClick={() => {
                  onOpenChange(false);
                  window.location.href = '/auth';
                }}
                className="flex-1 bg-gradient-to-r from-electric-blue to-hot-pink hover:from-hot-pink hover:to-cyber-purple text-black font-black uppercase tracking-wider"
              >
                SIGN IN
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (booked) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md bg-black/95 border-electric-blue/30">
          <div className="text-center space-y-6 py-8">
            <div className="w-16 h-16 bg-gradient-to-r from-acid-green to-electric-blue rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-black" />
            </div>
            
            <div>
              <h3 className="text-2xl font-black text-transparent bg-gradient-to-r from-electric-blue to-hot-pink bg-clip-text uppercase tracking-wider mb-2">
                TICKET SECURED!
              </h3>
              <p className="text-electric-blue/80 font-bold uppercase tracking-wide text-sm">
                // YOUR SPOT IS RESERVED
              </p>
            </div>

            <div className="bg-gradient-to-r from-electric-blue/10 to-hot-pink/10 rounded-lg p-6 border border-electric-blue/30">
              <p className="text-xs text-electric-blue/60 uppercase tracking-wider mb-1">Ticket Code</p>
              <p className="text-2xl font-black text-white tracking-wider">{ticketCode}</p>
              <p className="text-xs text-foreground/60 mt-2">Save this code - you'll need it for entry!</p>
            </div>

            <div className="space-y-2 text-left bg-black/50 rounded-lg p-4 border border-electric-blue/20">
              <div className="flex items-center text-electric-blue/80 text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                {format(new Date(event.event_date), 'MMMM d, yyyy')} at {event.event_time}
              </div>
              <div className="flex items-center text-electric-blue/80 text-sm">
                <MapPin className="w-4 h-4 mr-2" />
                {event.venue}, {event.location}
              </div>
            </div>

            <Button
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-electric-blue to-hot-pink hover:from-hot-pink hover:to-cyber-purple text-black font-black uppercase tracking-wider"
            >
              CLOSE
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-black/95 border-electric-blue/30 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-transparent bg-gradient-to-r from-electric-blue to-hot-pink bg-clip-text uppercase tracking-wider">
            BOOK YOUR TICKET
          </DialogTitle>
        </DialogHeader>

        {/* Event Details */}
        <div className="bg-gradient-to-r from-electric-blue/10 to-hot-pink/10 rounded-lg p-4 border border-electric-blue/30 mb-6">
          <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">{event.university}</h3>
          <div className="space-y-1 text-sm">
            <div className="flex items-center text-electric-blue/80">
              <Calendar className="w-4 h-4 mr-2" />
              {format(new Date(event.event_date), 'MMMM d, yyyy')} at {event.event_time}
            </div>
            <div className="flex items-center text-electric-blue/80">
              <MapPin className="w-4 h-4 mr-2" />
              {event.venue}, {event.location}
            </div>
            <div className="flex items-center text-electric-blue/80">
              <Ticket className="w-4 h-4 mr-2" />
              £{event.ticket_price.toFixed(2)}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="student_name" className="text-electric-blue font-bold uppercase tracking-wide text-xs">
                Full Name *
              </Label>
              <Input
                id="student_name"
                value={formData.student_name}
                onChange={(e) => handleInputChange('student_name', e.target.value)}
                required
                className="bg-black/50 border-electric-blue/30 text-white"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <Label htmlFor="student_email" className="text-electric-blue font-bold uppercase tracking-wide text-xs">
                Email * (Verified Account)
              </Label>
              <Input
                id="student_email"
                type="email"
                value={formData.student_email}
                onChange={(e) => handleInputChange('student_email', e.target.value)}
                required
                disabled
                className="bg-black/50 border-electric-blue/30 text-white/60"
                placeholder="your.email@university.ac.uk"
              />
              <p className="text-xs text-electric-blue/60 mt-1">
                🔒 Verified account email - ensures secure booking
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="university" className="text-electric-blue font-bold uppercase tracking-wide text-xs">
                University *
              </Label>
              <Input
                id="university"
                value={formData.university}
                onChange={(e) => handleInputChange('university', e.target.value)}
                required
                className="bg-black/50 border-electric-blue/30 text-white"
                placeholder="University name"
              />
            </div>

            <div>
              <Label htmlFor="course" className="text-electric-blue font-bold uppercase tracking-wide text-xs">
                Course
              </Label>
              <Input
                id="course"
                value={formData.course}
                onChange={(e) => handleInputChange('course', e.target.value)}
                className="bg-black/50 border-electric-blue/30 text-white"
                placeholder="e.g. Computer Science"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="year_of_study" className="text-electric-blue font-bold uppercase tracking-wide text-xs">
                Year of Study
              </Label>
              <Select value={formData.year_of_study} onValueChange={(value) => handleInputChange('year_of_study', value)}>
                <SelectTrigger className="bg-black/50 border-electric-blue/30 text-white">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1st Year</SelectItem>
                  <SelectItem value="2">2nd Year</SelectItem>
                  <SelectItem value="3">3rd Year</SelectItem>
                  <SelectItem value="4">4th Year</SelectItem>
                  <SelectItem value="5">Postgraduate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="phone_number" className="text-electric-blue font-bold uppercase tracking-wide text-xs">
                Phone Number
              </Label>
              <Input
                id="phone_number"
                value={formData.phone_number}
                onChange={(e) => handleInputChange('phone_number', e.target.value)}
                className="bg-black/50 border-electric-blue/30 text-white"
                placeholder="+44 7XXX XXXXXX"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="emergency_contact" className="text-electric-blue font-bold uppercase tracking-wide text-xs">
              Emergency Contact
            </Label>
            <Input
              id="emergency_contact"
              value={formData.emergency_contact}
              onChange={(e) => handleInputChange('emergency_contact', e.target.value)}
              className="bg-black/50 border-electric-blue/30 text-white"
              placeholder="Name and phone number"
            />
          </div>

          <div>
            <Label htmlFor="dietary_requirements" className="text-electric-blue font-bold uppercase tracking-wide text-xs">
              Dietary Requirements
            </Label>
            <Textarea
              id="dietary_requirements"
              value={formData.dietary_requirements}
              onChange={(e) => handleInputChange('dietary_requirements', e.target.value)}
              className="bg-black/50 border-electric-blue/30 text-white"
              placeholder="Any allergies or dietary restrictions..."
              rows={3}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="flex-1 border-electric-blue/30 text-electric-blue hover:bg-electric-blue/10"
            >
              CANCEL
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.student_name || !formData.student_email}
              className="flex-1 bg-gradient-to-r from-electric-blue to-hot-pink hover:from-hot-pink hover:to-cyber-purple text-black font-black uppercase tracking-wider disabled:opacity-50"
            >
              {loading ? "BOOKING..." : `BOOK TICKET - £${event.ticket_price.toFixed(2)}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CampusTicketBookingDialog;