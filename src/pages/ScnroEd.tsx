import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ScnroEdDialog } from "@/components/ScnroEdDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const ScnroEd = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16 space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-electric-blue to-purple-500 bg-clip-text text-transparent">
              SCNRO SIX WEEK MENTAL TOUGHNESS
            </h1>
            <h2 className="text-2xl md:text-4xl font-bold text-foreground">
              & PERFORMING ARTS PROGRAMME
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground italic">
              "Confidence in Self. Confidence in Life."
            </p>
          </div>

          {/* Programme Details */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle>Programme Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-semibold">Venue:</p>
                  <p className="text-muted-foreground">Newham Sixth Form College Theatre Space</p>
                </div>
                <div>
                  <p className="font-semibold">Ages:</p>
                  <p className="text-muted-foreground">16–19 (living, working, or studying in Newham)</p>
                </div>
                <div>
                  <p className="font-semibold">Capacity:</p>
                  <p className="text-muted-foreground">20 participants per cycle</p>
                </div>
                <div>
                  <p className="font-semibold">Cost:</p>
                  <p className="text-muted-foreground">£10 per session or £50 for all 6 sessions (if paid in advance)</p>
                  <p className="text-sm italic text-muted-foreground mt-1">Scholarships available for low-income participants</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Weekly Themes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-electric-blue mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Week 1</span> – Finding Your Voice (Control)
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-electric-blue mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Week 2</span> – Overcoming Nerves (Confidence)
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-electric-blue mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Week 3</span> – Working With Others (Commitment)
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-electric-blue mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Week 4</span> – Express Yourself (Challenge)
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-electric-blue mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Week 5</span> – Telling Your Story (Confidence + Challenge)
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-electric-blue mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold">Week 6</span> – Showcase & Celebration
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Why Join */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle>Why Join?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-electric-blue mt-0.5 flex-shrink-0" />
                  <p>Build confidence in public speaking & performance</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-electric-blue mt-0.5 flex-shrink-0" />
                  <p>Learn resilience & stress management tools</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-electric-blue mt-0.5 flex-shrink-0" />
                  <p>Work as part of a supportive creative team</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-electric-blue mt-0.5 flex-shrink-0" />
                  <p>Gain real-world life skills for school, uni & work</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-electric-blue mt-0.5 flex-shrink-0" />
                  <p>Celebrate achievements in a live showcase</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center">
            <ScnroEdDialog>
              <Button size="lg" className="text-lg px-8 py-6">
                Register Now
              </Button>
            </ScnroEdDialog>
            <p className="text-sm text-muted-foreground mt-4">
              By submitting this form, you agree to be contacted about the Mental Toughness programme.
            </p>
          </div>

          {/* Contact */}
          <div className="mt-16 text-center space-y-2">
            <h3 className="text-xl font-semibold">Need Help or Have Questions?</h3>
            <p className="text-muted-foreground">Contact us directly for more information about the programme</p>
            <p className="text-muted-foreground">
              <strong>Email:</strong> <a href="mailto:admin@scenarioarts.co.uk" className="text-electric-blue hover:underline">admin@scenarioarts.co.uk</a>
            </p>
            <p className="text-muted-foreground">
              <strong>Website:</strong> <a href="https://scnro.live" className="text-electric-blue hover:underline">scnro.live</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScnroEd;
