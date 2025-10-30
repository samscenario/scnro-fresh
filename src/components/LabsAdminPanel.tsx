import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Plus, Save, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface LabSession {
  id: string;
  title: string;
  description?: string;
  mentor_id?: string;
  session_date: string;
  start_time: string;
  end_time: string;
  max_participants: number;
  current_participants: number;
  status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled';
  mentor?: {
    name: string;
    expertise: string;
  };
}

interface LabMentor {
  id: string;
  name: string;
  expertise: string;
  background?: string;
  bio?: string;
  avatar_url?: string;
  email?: string;
  phone?: string;
  is_active: boolean;
}

interface LabApplication {
  id: string;
  applicant_name: string;
  applicant_email: string;
  phone?: string;
  lab_title: string;
  lab_description: string;
  target_audience?: string;
  duration_hours?: number;
  equipment_needed?: string;
  mentor_experience?: string;
  motivation?: string;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  admin_notes?: string;
  submitted_at: string;
}

export const LabsAdminPanel = () => {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<LabSession[]>([]);
  const [mentors, setMentors] = useState<LabMentor[]>([]);
  const [applications, setApplications] = useState<LabApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSession, setEditingSession] = useState<string | null>(null);
  const [editingMentor, setEditingMentor] = useState<string | null>(null);

  // New session form
  const [newSession, setNewSession] = useState({
    title: '',
    description: '',
    mentor_id: '',
    session_date: '',
    start_time: '',
    end_time: '',
    max_participants: 20,
    status: 'upcoming' as const
  });

  // New mentor form
  const [newMentor, setNewMentor] = useState({
    name: '',
    expertise: '',
    background: '',
    bio: '',
    email: '',
    phone: '',
    is_active: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch sessions with mentor info
      const { data: sessionsData } = await supabase
        .from('lab_sessions')
        .select(`
          *,
          mentor:lab_mentors(name, expertise)
        `)
        .order('session_date', { ascending: true });

      // Fetch mentors
      const { data: mentorsData } = await supabase
        .from('lab_mentors')
        .select('*')
        .order('name', { ascending: true });

      // Fetch applications
      const { data: applicationsData } = await supabase
        .from('lab_applications')
        .select('*')
        .order('submitted_at', { ascending: false });

      setSessions(sessionsData as LabSession[] || []);
      setMentors(mentorsData || []);
      setApplications(applicationsData as LabApplication[] || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async () => {
    try {
      const { error } = await supabase
        .from('lab_sessions')
        .insert([newSession]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Session created successfully"
      });

      setNewSession({
        title: '',
        description: '',
        mentor_id: '',
        session_date: '',
        start_time: '',
        end_time: '',
        max_participants: 20,
        status: 'upcoming'
      });

      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create session",
        variant: "destructive"
      });
    }
  };

  const handleCreateMentor = async () => {
    try {
      const { error } = await supabase
        .from('lab_mentors')
        .insert([newMentor]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Mentor created successfully"
      });

      setNewMentor({
        name: '',
        expertise: '',
        background: '',
        bio: '',
        email: '',
        phone: '',
        is_active: true
      });

      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create mentor",
        variant: "destructive"
      });
    }
  };

  const updateApplicationStatus = async (id: string, status: string, adminNotes?: string) => {
    try {
      const { error } = await supabase
        .from('lab_applications')
        .update({ 
          status,
          admin_notes: adminNotes,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Application status updated"
      });

      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update application",
        variant: "destructive"
      });
    }
  };

  const deleteSession = async (id: string) => {
    try {
      const { error } = await supabase
        .from('lab_sessions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Session deleted successfully"
      });

      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete session",
        variant: "destructive"
      });
    }
  };

  const deleteMentor = async (id: string) => {
    try {
      const { error } = await supabase
        .from('lab_mentors')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Mentor deactivated successfully"
      });

      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to deactivate mentor",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-electric-blue to-acid-green bg-clip-text">
          Labs Admin Panel
        </h2>
      </div>

      <Tabs defaultValue="sessions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="mentors">Mentors</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-6">
          {/* Create New Session */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create New Session
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="session-title">Title</Label>
                  <Input
                    id="session-title"
                    value={newSession.title}
                    onChange={(e) => setNewSession({...newSession, title: e.target.value})}
                    placeholder="Session title"
                  />
                </div>
                <div>
                  <Label htmlFor="session-mentor">Mentor</Label>
                  <Select value={newSession.mentor_id} onValueChange={(value) => setNewSession({...newSession, mentor_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select mentor" />
                    </SelectTrigger>
                    <SelectContent>
                      {mentors.filter(m => m.is_active).map((mentor) => (
                        <SelectItem key={mentor.id} value={mentor.id}>
                          {mentor.name} - {mentor.expertise}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="session-date">Date</Label>
                  <Input
                    id="session-date"
                    type="date"
                    value={newSession.session_date}
                    onChange={(e) => setNewSession({...newSession, session_date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="session-max">Max Participants</Label>
                  <Input
                    id="session-max"
                    type="number"
                    value={newSession.max_participants}
                    onChange={(e) => setNewSession({...newSession, max_participants: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <Label htmlFor="session-start">Start Time</Label>
                  <Input
                    id="session-start"
                    type="time"
                    value={newSession.start_time}
                    onChange={(e) => setNewSession({...newSession, start_time: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="session-end">End Time</Label>
                  <Input
                    id="session-end"
                    type="time"
                    value={newSession.end_time}
                    onChange={(e) => setNewSession({...newSession, end_time: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="session-description">Description</Label>
                <Textarea
                  id="session-description"
                  value={newSession.description}
                  onChange={(e) => setNewSession({...newSession, description: e.target.value})}
                  placeholder="Session description"
                />
              </div>
              <Button onClick={handleCreateSession} className="w-full">
                Create Session
              </Button>
            </CardContent>
          </Card>

          {/* Sessions List */}
          <div className="grid gap-4">
            {sessions.map((session) => (
              <Card key={session.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{session.title}</h3>
                      <p className="text-muted-foreground">
                        {session.mentor?.name} • {format(new Date(session.session_date), 'MMM dd, yyyy')} • {session.start_time} - {session.end_time}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {session.current_participants}/{session.max_participants} participants
                      </p>
                      {session.description && (
                        <p className="text-sm mt-2">{session.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={session.status === 'upcoming' ? 'default' : 'secondary'}>
                        {session.status}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteSession(session.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mentors" className="space-y-6">
          {/* Create New Mentor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add New Mentor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mentor-name">Name</Label>
                  <Input
                    id="mentor-name"
                    value={newMentor.name}
                    onChange={(e) => setNewMentor({...newMentor, name: e.target.value})}
                    placeholder="Mentor name"
                  />
                </div>
                <div>
                  <Label htmlFor="mentor-expertise">Expertise</Label>
                  <Input
                    id="mentor-expertise"
                    value={newMentor.expertise}
                    onChange={(e) => setNewMentor({...newMentor, expertise: e.target.value})}
                    placeholder="e.g. Music Production"
                  />
                </div>
                <div>
                  <Label htmlFor="mentor-background">Background</Label>
                  <Input
                    id="mentor-background"
                    value={newMentor.background}
                    onChange={(e) => setNewMentor({...newMentor, background: e.target.value})}
                    placeholder="e.g. Goldsmiths Graduate"
                  />
                </div>
                <div>
                  <Label htmlFor="mentor-email">Email</Label>
                  <Input
                    id="mentor-email"
                    type="email"
                    value={newMentor.email}
                    onChange={(e) => setNewMentor({...newMentor, email: e.target.value})}
                    placeholder="mentor@example.com"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="mentor-bio">Bio</Label>
                <Textarea
                  id="mentor-bio"
                  value={newMentor.bio}
                  onChange={(e) => setNewMentor({...newMentor, bio: e.target.value})}
                  placeholder="Brief bio about the mentor"
                />
              </div>
              <Button onClick={handleCreateMentor} className="w-full">
                Add Mentor
              </Button>
            </CardContent>
          </Card>

          {/* Mentors List */}
          <div className="grid gap-4">
            {mentors.map((mentor) => (
              <Card key={mentor.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{mentor.name}</h3>
                      <p className="text-electric-blue font-medium">{mentor.expertise}</p>
                      <p className="text-muted-foreground">{mentor.background}</p>
                      {mentor.bio && (
                        <p className="text-sm mt-2">{mentor.bio}</p>
                      )}
                      {mentor.email && (
                        <p className="text-sm text-muted-foreground">{mentor.email}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={mentor.is_active ? 'default' : 'secondary'}>
                        {mentor.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      {mentor.is_active && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deleteMentor(mentor.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-6">
          <div className="grid gap-4">
            {applications.map((application) => (
              <Card key={application.id}>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{application.lab_title}</h3>
                        <p className="text-muted-foreground">
                          by {application.applicant_name} • {format(new Date(application.submitted_at), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <Badge variant={
                        application.status === 'approved' ? 'default' : 
                        application.status === 'rejected' ? 'destructive' : 
                        'secondary'
                      }>
                        {application.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Email:</strong> {application.applicant_email}</p>
                        {application.phone && <p><strong>Phone:</strong> {application.phone}</p>}
                        {application.target_audience && <p><strong>Target Audience:</strong> {application.target_audience}</p>}
                        {application.duration_hours && <p><strong>Duration:</strong> {application.duration_hours} hours</p>}
                      </div>
                      <div>
                        {application.equipment_needed && <p><strong>Equipment:</strong> {application.equipment_needed}</p>}
                        {application.mentor_experience && <p><strong>Experience:</strong> {application.mentor_experience}</p>}
                      </div>
                    </div>
                    
                    <div>
                      <p><strong>Description:</strong></p>
                      <p className="text-sm text-muted-foreground">{application.lab_description}</p>
                    </div>
                    
                    {application.motivation && (
                      <div>
                        <p><strong>Motivation:</strong></p>
                        <p className="text-sm text-muted-foreground">{application.motivation}</p>
                      </div>
                    )}
                    
                    {application.admin_notes && (
                      <div>
                        <p><strong>Admin Notes:</strong></p>
                        <p className="text-sm text-muted-foreground">{application.admin_notes}</p>
                      </div>
                    )}

                    {application.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => updateApplicationStatus(application.id, 'approved')}
                        >
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => updateApplicationStatus(application.id, 'under_review')}
                        >
                          Under Review
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => updateApplicationStatus(application.id, 'rejected')}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};