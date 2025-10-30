import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import { Link } from "react-router-dom";
import { Play } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { MentorContactDialog } from "@/components/MentorContactDialog";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { LabsAdminPanel } from "@/components/LabsAdminPanel";

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
  mentor_id: string;
  name: string;
  expertise: string;
  background?: string;
  bio?: string;
  is_active: boolean;
}

const Labs = () => {
  const { isAdmin } = useAdminCheck();
  const [sessions, setSessions] = useState<LabSession[]>([]);
  const [mentors, setMentors] = useState<LabMentor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch sessions with mentor info
      const { data: sessionsData } = await supabase
        .from('lab_sessions')
        .select(`
          *,
          mentor:lab_mentors(name, expertise)
        `)
        .eq('status', 'upcoming')
        .order('session_date', { ascending: true });

      // Fetch secure mentors (public profiles only)
      const { data: mentorsData } = await supabase
        .from('lab_mentors_secure')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });

      setSessions(sessionsData as LabSession[] || []);
      setMentors(mentorsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Admin Panel */}
      {isAdmin && (
        <div className="py-8 px-4 bg-muted/50">
          <div className="max-w-6xl mx-auto">
            <LabsAdminPanel />
          </div>
        </div>
      )}
      {/* Header Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-electric-blue/20 via-background/60 to-background/90" />
        
        {/* Animated Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-blue/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-acid-green/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="text-6xl md:text-8xl">🎨</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-gradient-to-r from-electric-blue to-acid-green bg-clip-text mb-6">
            SCNRO: LABS
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold text-electric-blue mb-8">
            LEARN. BUILD. CREATE.
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            SCNRO: LABS is where creators level up. From beat-making and DJ sets to visual storytelling, editing, and fashion design — every session is led by students, pros, or collectives shaping the scene.
          </p>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
            <Button variant="hero" size="xl" className="min-w-[200px]" asChild>
              <Link to="/apply-lab">APPLY FOR A LAB</Link>
            </Button>
            <Button variant="outline" size="xl" className="min-w-[200px]" asChild>
              <Link to="/become-mentor">BECOME A MENTOR</Link>
            </Button>
            <Button variant="cta" size="xl" className="min-w-[200px]" asChild>
              <Link to="/upcoming-sessions">VIEW UPCOMING SESSIONS</Link>
            </Button>
          </div>

          {/* Signal Visuals */}
          <div className="mb-20">
            <h3 className="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-cyber-purple to-electric-blue bg-clip-text mb-8 text-center">
              SCENARIO VISUALS
            </h3>
            <div className="grid grid-cols-2 gap-4">
            {/* Video Thumbnail 1 - DJ */}
            <Card className="relative overflow-hidden border-2 border-gray-600 hover:border-cyber-purple transition-colors">
              <div className="aspect-video bg-gradient-to-br from-purple-900 to-red-900 flex items-center justify-center relative">
                <img 
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop" 
                  alt="DJ performing" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Button className="bg-white/20 hover:bg-white/30 border border-white/50 w-16 h-16 rounded-full">
                    <Play className="w-8 h-8 text-white" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Video Thumbnail 2 - Performer */}
            <Card className="relative overflow-hidden border-2 border-gray-600 hover:border-electric-blue transition-colors">
              <div className="aspect-video bg-gradient-to-br from-orange-900 to-purple-900 flex items-center justify-center relative">
                <img 
                  src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop" 
                  alt="Artist performing" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Button className="bg-white/20 hover:bg-white/30 border border-white/50 w-16 h-16 rounded-full">
                    <Play className="w-8 h-8 text-white" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Video Thumbnail 3 - Studio */}
            <Card className="relative overflow-hidden border-2 border-gray-600 hover:border-acid-green transition-colors">
              <div className="aspect-video bg-gradient-to-br from-green-900 to-purple-900 flex items-center justify-center relative">
                <img 
                  src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=400&h=300&fit=crop" 
                  alt="Studio session" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Button className="bg-white/20 hover:bg-white/30 border border-white/50 w-16 h-16 rounded-full">
                    <Play className="w-8 h-8 text-white" />
                  </Button>
                </div>
              </div>
            </Card>

            {/* Video Thumbnail 4 - Crowd */}
            <Card className="relative overflow-hidden border-2 border-gray-600 hover:border-hot-pink transition-colors">
              <div className="aspect-video bg-gradient-to-br from-blue-900 to-pink-900 flex items-center justify-center relative">
                <img 
                  src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop" 
                  alt="Crowd at concert" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <Button className="bg-white/20 hover:bg-white/30 border border-white/50 w-16 h-16 rounded-full">
                    <Play className="w-8 h-8 text-white" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="mb-20">
            <h3 className="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-electric-blue to-acid-green bg-clip-text mb-8 text-center">
              UPCOMING LABS
            </h3>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading sessions...</p>
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No upcoming sessions scheduled.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sessions.map((session) => (
                  <Card key={session.id} className="p-6 bg-card/50 border-electric-blue/20 hover:border-acid-green/40 transition-all duration-300">
                    <div className="space-y-3">
                      <h4 className="text-xl font-bold text-foreground">{session.title}</h4>
                      <p className="text-electric-blue font-semibold">
                        with {session.mentor?.name || 'TBA'}
                      </p>
                      <div className="flex justify-between items-center text-muted-foreground">
                        <span>{format(new Date(session.session_date), 'MMM dd')}</span>
                        <span>{session.start_time} - {session.end_time}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {session.current_participants}/{session.max_participants} participants
                      </div>
                      {session.description && (
                        <p className="text-sm text-muted-foreground">{session.description}</p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Mentor Spotlights */}
          <div className="mb-20">
            <h3 className="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-acid-green to-electric-blue bg-clip-text mb-8 text-center">
              MEET THE MENTORS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mentors.map((mentor, index) => (
                <Card key={index} className="p-6 bg-card/50 border-acid-green/20 hover:border-electric-blue/40 transition-all duration-300 text-center">
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-muted/40 rounded-full mx-auto flex items-center justify-center mb-4">
                      <span className="text-2xl">👤</span>
                    </div>
                    <h4 className="text-lg font-bold text-foreground">{mentor.name}</h4>
                    <p className="text-electric-blue font-semibold">{mentor.expertise}</p>
                    <p className="text-sm text-muted-foreground">{mentor.background}</p>
                    <div className="mt-4">
                      <MentorContactDialog 
                        mentorId={mentor.mentor_id} 
                        mentorName={mentor.name}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Creator Resources */}
          <div className="text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-electric-blue to-hot-pink bg-clip-text mb-8">
              CREATOR RESOURCES
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-8 bg-card/50 border-electric-blue/20 hover:border-hot-pink/40 transition-all duration-300">
                <div className="text-center">
                  <span className="text-4xl mb-4 block">📚</span>
                  <h4 className="text-xl font-bold text-foreground mb-4">Learning Library</h4>
                  <p className="text-muted-foreground">Access tutorials, templates, and guides from past labs.</p>
                </div>
              </Card>

              <Card className="p-8 bg-card/50 border-electric-blue/20 hover:border-acid-green/40 transition-all duration-300">
                <div className="text-center">
                  <span className="text-4xl mb-4 block">🤝</span>
                  <h4 className="text-xl font-bold text-foreground mb-4">Peer Network</h4>
                  <p className="text-muted-foreground">Connect with other creators and form collaboration groups.</p>
                </div>
              </Card>

              <Card className="p-8 bg-card/50 border-electric-blue/20 hover:border-neon-orange/40 transition-all duration-300">
                <div className="text-center">
                  <span className="text-4xl mb-4 block">🛠️</span>
                  <h4 className="text-xl font-bold text-foreground mb-4">Equipment Access</h4>
                  <p className="text-muted-foreground">Book studio time and borrow professional equipment.</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Labs;