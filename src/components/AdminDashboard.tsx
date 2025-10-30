import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Music, Users, Settings, GraduationCap, Home, Calendar, Zap } from 'lucide-react';
import { SignalEventsAdmin } from '@/components/SignalEventsAdmin';

interface SignalInvitation {
  id: string;
  email: string;
  full_name: string;
  telephone: string;
  invitation_code: string;
  event_id: string;
  created_at: string;
  used_at: string | null;
  is_active: boolean;
}

interface AlertSubscription {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  subscription_types: string[];
  created_at: string;
  is_active: boolean;
}

interface SignalEvent {
  id: string;
  title: string;
  event_date: string;
  location: string;
}

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [signalInvitations, setSignalInvitations] = useState<SignalInvitation[]>([]);
  const [alertSubscriptions, setAlertSubscriptions] = useState<AlertSubscription[]>([]);
  const [signalEvents, setSignalEvents] = useState<SignalEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    } else {
      setCheckingAdmin(false);
    }
  }, [user]);

  const checkAdminStatus = async () => {
    try {
      const { data, error } = await supabase.rpc('is_admin');
      if (error) throw error;
      setIsAdmin(data);
      if (data) {
        fetchData();
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
      setLoading(false);
    } finally {
      setCheckingAdmin(false);
    }
  };

  const fetchData = async () => {
    try {
      // Fetch signal invitations
      const { data: invitations } = await supabase
        .from('signal_invitations')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch alert subscriptions
      const { data: subscriptions } = await supabase
        .from('alert_subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch signal events
      const { data: events } = await supabase
        .from('signal_events')
        .select('id, title, event_date, location')
        .order('event_date', { ascending: false });

      setSignalInvitations(invitations || []);
      setAlertSubscriptions(subscriptions || []);
      setSignalEvents(events || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventTitle = (eventId: string) => {
    const event = signalEvents.find(e => e.id === eventId);
    return event ? event.title : 'Unknown Event';
  };

  if (!user) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center space-y-4">
            <h2 className="text-xl font-semibold">Admin Access Required</h2>
            <p>Please sign in to view the admin dashboard.</p>
            <Button asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (checkingAdmin) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <p>Checking admin permissions...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center space-y-4">
            <h2 className="text-xl font-semibold">Access Denied</h2>
            <p>You do not have administrator privileges to view this dashboard.</p>
            <Button asChild>
              <Link to="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <p>Loading data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" asChild>
          <Link to="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Home
          </Link>
        </Button>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Music className="h-8 w-8 text-primary" />
              <div>
                <h3 className="text-lg font-semibold">Upload and manage audio and media</h3>
                <p className="text-sm text-muted-foreground">Manage content and media files</p>
              </div>
            </div>
            <Button asChild className="w-full mt-3">
              <Link to="/admin/content">Manage Content</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <h3 className="text-lg font-semibold">Campus Events</h3>
                <p className="text-sm text-muted-foreground">Manage campus events</p>
              </div>
            </div>
            <Button asChild className="w-full mt-3">
              <Link to="/campus-admin">Campus Admin</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary" />
              <div>
                <h3 className="text-lg font-semibold">Labs Management</h3>
                <p className="text-sm text-muted-foreground">Manage labs & applications</p>
              </div>
            </div>
            <Button asChild className="w-full mt-3">
              <Link to="/admin/labs">Manage Labs</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-primary" />
              <div>
                <h3 className="text-lg font-semibold">Academic Calendar</h3>
                <p className="text-sm text-muted-foreground">Manage academic calendar</p>
              </div>
            </div>
            <Button asChild className="w-full mt-3">
              <Link to="/academic-calendar">Manage Calendar</Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Settings className="h-8 w-8 text-primary" />
              <div>
                <h3 className="text-lg font-semibold">System Stats</h3>
                <p className="text-sm text-muted-foreground">View overview</p>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <p className="text-xs text-muted-foreground">Signal Invitations: {signalInvitations.length}</p>
              <p className="text-xs text-muted-foreground">Alert Subscriptions: {alertSubscriptions.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="signal-events" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="signal-events">
            <Zap className="h-4 w-4 mr-2" />
            Signal Events
          </TabsTrigger>
          <TabsTrigger value="signal-invitations">
            SIGNAL Invitations ({signalInvitations.length})
          </TabsTrigger>
          <TabsTrigger value="alert-subscriptions">
            Alert Subscriptions ({alertSubscriptions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="signal-events">
          <SignalEventsAdmin />
        </TabsContent>

        <TabsContent value="signal-invitations">
          <Card>
            <CardHeader>
              <CardTitle>SIGNAL Event Invitations & Codes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Invitation Code</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Signed Up</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {signalInvitations.map((invitation) => (
                      <TableRow key={invitation.id}>
                        <TableCell className="font-medium">{invitation.full_name}</TableCell>
                        <TableCell>{invitation.email}</TableCell>
                        <TableCell>{invitation.telephone}</TableCell>
                        <TableCell className="font-mono text-primary bg-primary/10 px-2 py-1 rounded">
                          {invitation.invitation_code}
                        </TableCell>
                        <TableCell>{getEventTitle(invitation.event_id)}</TableCell>
                        <TableCell>
                          {new Date(invitation.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            invitation.used_at 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {invitation.used_at ? 'Used' : 'Active'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {signalInvitations.length === 0 && (
                  <p className="text-center py-4 text-muted-foreground">
                    No SIGNAL invitations found.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alert-subscriptions">
          <Card>
            <CardHeader>
              <CardTitle>Alert Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Subscription Types</TableHead>
                      <TableHead>Signed Up</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {alertSubscriptions.map((subscription) => (
                      <TableRow key={subscription.id}>
                        <TableCell className="font-medium">{subscription.full_name}</TableCell>
                        <TableCell>{subscription.email}</TableCell>
                        <TableCell>{subscription.phone}</TableCell>
                        <TableCell>
                          {subscription.subscription_types.join(', ')}
                        </TableCell>
                        <TableCell>
                          {new Date(subscription.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            subscription.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {subscription.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {alertSubscriptions.length === 0 && (
                  <p className="text-center py-4 text-muted-foreground">
                    No alert subscriptions found.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};