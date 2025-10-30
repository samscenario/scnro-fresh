import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Header from "@/components/Header";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Edit, Save, X } from "lucide-react";

interface FundingBreakdownItem {
  area: string;
  cost: number;
  impact: string;
}

interface MainframeContent {
  id: string;
  title: string;
  subtitle: string;
  current_raised: number;
  target_amount: number;
  supporter_count: number;
  event_date: string;
  event_location: string;
  event_audience: string;
  about_title: string;
  about_content: string;
  funding_breakdown: FundingBreakdownItem[];
}

const MainframeFunding = () => {
  const { isAdmin, loading: adminLoading } = useAdminCheck();
  const { user } = useAuth();
  
  const [content, setContent] = useState<MainframeContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<MainframeContent>>({});

  // Fetch content from database
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('mainframe_content')
          .select('*')
          .single();

        if (error) {
          console.error('Error fetching content:', error);
          toast.error('Failed to load content');
          return;
        }

        // Parse funding_breakdown from JSON
        const parsedData = {
          ...data,
          funding_breakdown: typeof data.funding_breakdown === 'string' 
            ? JSON.parse(data.funding_breakdown) 
            : data.funding_breakdown || []
        };

        setContent(parsedData);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  // Update content in database
  const updateContent = async (updates: Partial<MainframeContent>) => {
    if (!content) return;

    try {
      // Convert funding_breakdown to JSON for database storage
      const dbUpdates = {
        ...updates,
        ...(updates.funding_breakdown && {
          funding_breakdown: JSON.stringify(updates.funding_breakdown)
        })
      };

      const { error } = await supabase
        .from('mainframe_content')
        .update(dbUpdates)
        .eq('id', content.id);

      if (error) {
        console.error('Error updating content:', error);
        toast.error('Failed to update content');
        return;
      }

      setContent({ ...content, ...updates });
      toast.success('Content updated successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to update content');
    }
  };

  // Start editing a field
  const startEditing = (field: string) => {
    if (!content) return;
    setEditingField(field);
    setEditValues({ [field]: content[field as keyof MainframeContent] });
  };

  // Save edit
  const saveEdit = async () => {
    if (!editingField || !editValues) return;
    
    await updateContent(editValues);
    setEditingField(null);
    setEditValues({});
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingField(null);
    setEditValues({});
  };

  // Show loading state
  if (loading || adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-blue mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">No content found</p>
        </div>
      </div>
    );
  }
  // Render editable field for simple types
  const renderEditableField = (field: Exclude<keyof MainframeContent, 'funding_breakdown'>, value: string | number, isTextarea = false) => {
    const isEditing = editingField === field;
    
    return (
      <div className="relative group">
        {isEditing ? (
          <div className="flex items-center gap-2">
            {isTextarea ? (
              <Textarea
                value={String(editValues[field] || '')}
                onChange={(e) => setEditValues({ ...editValues, [field]: e.target.value as any })}
                className="flex-1"
                rows={3}
              />
            ) : (
              <Input
                value={String(editValues[field] || '')}
                onChange={(e) => setEditValues({ ...editValues, [field]: field.includes('amount') || field.includes('count') || field.includes('raised') ? Number(e.target.value) as any : e.target.value as any })}
                className="flex-1"
                type={typeof value === 'number' ? 'number' : 'text'}
              />
            )}
            <Button size="sm" onClick={saveEdit} className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={cancelEdit}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-start gap-2">
            <span className="flex-1">{value}</span>
            {isAdmin && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => startEditing(field)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-electric-blue via-cyber-purple to-hot-pink text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            {renderEditableField('title', content.title)}
          </h1>
          <div className="text-xl md:text-2xl mb-10 opacity-90">
            {renderEditableField('subtitle', content.subtitle, true)}
          </div>
        </div>
      </section>

      {/* Progress Section */}
      <div className="container mx-auto px-4">
        <Card className="relative -mt-16 z-10 max-w-4xl mx-auto p-8 bg-card border-electric-blue/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6 text-center">
            <div>
              <h3 className="text-3xl font-bold text-electric-blue mb-2">
                £{renderEditableField('current_raised', content.current_raised)}
              </h3>
              <p className="text-muted-foreground">raised</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-electric-blue mb-2">
                £{renderEditableField('target_amount', content.target_amount)}
              </h3>
              <p className="text-muted-foreground">target</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-electric-blue mb-2">
                {renderEditableField('supporter_count', content.supporter_count)}
              </h3>
              <p className="text-muted-foreground">supporters</p>
            </div>
          </div>
          
          <div className="w-full h-3 bg-muted rounded-full mb-6 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-electric-blue to-cyber-purple transition-all duration-300" 
              style={{ width: `${Math.min((content.current_raised / content.target_amount) * 100, 100)}%` }} 
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="cta" size="lg" className="min-w-[180px]">
              ❤️ Donate Now
            </Button>
            <Button variant="outline" size="lg" className="min-w-[180px]">
              📤 Share Campaign
            </Button>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Event Details */}
          <Card className="p-8 mb-8 bg-card/50 border-electric-blue/20">
            <h2 className="text-3xl font-bold text-electric-blue mb-6">Event Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 text-electric-blue">📅</div>
                <div>
                  <strong className="block text-foreground">When</strong>
                  <div className="text-muted-foreground">
                    {renderEditableField('event_date', content.event_date)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 text-electric-blue">📍</div>
                <div>
                  <strong className="block text-foreground">Where</strong>
                  <div className="text-muted-foreground">
                    {renderEditableField('event_location', content.event_location)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-6 h-6 text-electric-blue">👥</div>
                <div>
                  <strong className="block text-foreground">Who</strong>
                  <div className="text-muted-foreground">
                    {renderEditableField('event_audience', content.event_audience)}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* About Section */}
          <Card className="p-8 mb-8 bg-card/50 border-hot-pink/20">
            <h2 className="text-3xl font-bold text-hot-pink mb-6">
              {renderEditableField('about_title', content.about_title)}
            </h2>
            <div className="text-muted-foreground leading-relaxed">
              {renderEditableField('about_content', content.about_content, true)}
            </div>
          </Card>

          {/* Funding Breakdown */}
          <Card className="p-8 mb-8 bg-card/50 border-neon-orange/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-neon-orange">What Your Donation Supports</h2>
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newBreakdown = prompt('Enter funding breakdown as JSON:', JSON.stringify(content.funding_breakdown, null, 2));
                    if (newBreakdown) {
                      try {
                        const parsed = JSON.parse(newBreakdown);
                        updateContent({ funding_breakdown: parsed });
                      } catch (error) {
                        toast.error('Invalid JSON format');
                      }
                    }
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Table
                </Button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-muted">
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Area</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Cost</th>
                    <th className="text-left py-4 px-4 font-semibold text-foreground">Impact</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {content.funding_breakdown.map((item, index) => (
                    <tr key={index} className="border-b border-muted/50">
                      <td className="py-4 px-4 text-foreground">{item.area}</td>
                      <td className="py-4 px-4 text-warning-red font-semibold">£{item.cost.toLocaleString()}</td>
                      <td className="py-4 px-4 text-muted-foreground">{item.impact}</td>
                    </tr>
                  ))}
                  <tr className="bg-electric-blue/10 font-semibold">
                    <td className="py-4 px-4 text-electric-blue font-bold">TOTAL TARGET</td>
                    <td className="py-4 px-4 text-warning-red font-bold">
                      £{content.funding_breakdown.reduce((sum, item) => sum + item.cost, 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-electric-blue font-bold">Full build of MAINFRAME, free and accessible to all</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          {/* Why It Matters */}
          <Card className="p-8 mb-8 bg-card/50 border-cyber-purple/20">
            <h2 className="text-3xl font-bold text-cyber-purple mb-6">Why It Matters</h2>
            <p className="text-lg mb-4"><strong>Young people aren&apos;t waiting for permission.</strong></p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              They&apos;re building brands, sounds, content, and identity from the ground up. But many still face real barriers — access, space, training, funding.
            </p>
            <p className="text-lg mb-6"><strong>MAINFRAME breaks those barriers.</strong></p>
            <div>
              <p className="text-lg font-semibold mb-4">Your support powers:</p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-electric-blue font-bold">•</span>
                  <span className="text-muted-foreground">Free entry for underserved students and creatives</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-electric-blue font-bold">•</span>
                  <span className="text-muted-foreground">Paid roles + training in live events and production</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-electric-blue font-bold">•</span>
                  <span className="text-muted-foreground">Real platforms for expression, confidence, and connection</span>
                </li>
              </ul>
            </div>
          </Card>

          {/* How You Can Help */}
          <Card className="p-8 mb-8 bg-card/50 border-neon-orange/20">
            <h2 className="text-3xl font-bold text-neon-orange mb-6">How You Can Help</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-neon-orange font-bold">•</span>
                <span className="text-muted-foreground"><strong>Donate what you can</strong> – every £ counts</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-neon-orange font-bold">•</span>
                <span className="text-muted-foreground">Share this page with your network</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-neon-orange font-bold">•</span>
                <span className="text-muted-foreground">Partner with us as a local business, school, or brand</span>
              </li>
            </ul>
          </Card>

          {/* Our Promise */}
          <Card className="p-8 mb-8 bg-card/50 border-electric-blue/20">
            <h2 className="text-3xl font-bold text-electric-blue mb-6">Our Promise</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              All funds are managed by Scenario Arts CIO, a registered UK charity.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Everything raised goes directly into youth delivery, artist training, production, and safety.
            </p>
          </Card>

          {/* Final CTA */}
          <div className="text-center mt-16">
            <Button variant="cta" size="xl" className="text-lg px-12 py-4">
              ❤️ Support MAINFRAME 2026
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal-deep text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-electric-blue mb-6">📩Questions or want to collaborate?</h3>
          <p className="mb-2"><strong className="text-electric-blue">Contact:</strong> admin@scenarioarts.co.uk</p>
          <p className="mb-2"><strong className="text-electric-blue">Website:</strong> www.scnro.live | www.scenarioarts.co.uk</p>
          <p><strong className="text-electric-blue">Instagram:</strong> @scnro.live</p>
        </div>
      </footer>
    </div>
  );
};
export default MainframeFunding;