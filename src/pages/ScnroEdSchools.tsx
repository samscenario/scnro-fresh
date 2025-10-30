import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ScnroSchoolsDialog } from "@/components/ScnroSchoolsDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Users, Award, TrendingUp } from "lucide-react";

const ScnroEdSchools = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16 space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-500 to-electric-blue bg-clip-text text-transparent">
              Mental Toughness in Education
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground">
              Schools & Colleges
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Delivered by Scenario Arts, a Newham-based charity
            </p>
          </div>

          {/* Overview */}
          <Card className="mb-12 bg-gradient-to-br from-purple-500/10 to-electric-blue/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                Empowering Students Through Mental Toughness
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The <strong>Mental Toughness in Education Programme</strong> supports schools and colleges in developing students' resilience, 
                motivation, confidence, and self-control — the non-cognitive skills proven to impact academic performance, wellbeing, 
                and transition readiness.
              </p>
              <p>
                This <strong>6-week Saturday (or in-school) programme</strong> blends the <strong>MTQ Psychological Assessment</strong> with 
                coaching and creative workshops to help young people thrive both inside and outside the classroom.
              </p>
            </CardContent>
          </Card>

          {/* Programme Details & Costs */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle>Programme for Schools & Colleges</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-semibold">Target Group:</p>
                  <p className="text-muted-foreground">Years 10–13 (ages 14–19)</p>
                </div>
                <div>
                  <p className="font-semibold">Delivery Format:</p>
                  <p className="text-muted-foreground">6 consecutive sessions – group and 1:1 coaching</p>
                </div>
                <div>
                  <p className="font-semibold">Location:</p>
                  <p className="text-muted-foreground">Central Newham venue (College Theatre Space) or hosted on-site</p>
                </div>
                <div>
                  <p className="font-semibold">Group Size:</p>
                  <p className="text-muted-foreground">10 students per cohort</p>
                </div>
                <div>
                  <p className="font-semibold">Capacity:</p>
                  <p className="text-muted-foreground">20 participants per cycle</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Programme Costs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-semibold text-lg mb-1">Partner School (Standard)</p>
                  <p className="text-3xl font-bold text-electric-blue">£500</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Full 6-week MTQ & Coaching Programme<br />
                    per 10 students (£50 each)
                  </p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-semibold text-lg mb-1">Member School</p>
                  <p className="text-3xl font-bold text-purple-500">£350/year</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Annual contribution for up to 10 student places per term + reduced MTQ fees
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Programme Components */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-6 w-6" />
                Programme Components
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <p>Two professional MTQ Assessments (measure mindset & progress)</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <p>1:1 feedback and coaching sessions for each student</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <p>The 4C's Framework: Control • Commitment • Challenge • Confidence</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
                  <p>Final reflection and progress report for each learner</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Why Schools Get Involved */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6" />
                Why Schools Get Involved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-electric-blue mt-0.5 flex-shrink-0" />
                  <p>Evidence measurable progress in personal development & wellbeing</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-electric-blue mt-0.5 flex-shrink-0" />
                  <p>Strengthen student resilience and self-belief ahead of exams and transitions</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-electric-blue mt-0.5 flex-shrink-0" />
                  <p>Gain data reports from MTQ Assessments for internal evaluation</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-electric-blue mt-0.5 flex-shrink-0" />
                  <p>Access optional staff CPD to embed mental toughness strategies in teaching</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center">
            <ScnroSchoolsDialog>
              <Button size="lg" className="text-lg px-8 py-6">
                Register Your School
              </Button>
            </ScnroSchoolsDialog>
            <p className="text-sm text-muted-foreground mt-4">
              Our education team will contact you to discuss programme details and pricing
            </p>
          </div>

          {/* Contact */}
          <div className="mt-16 text-center space-y-2">
            <h3 className="text-xl font-semibold">Questions About the Programme?</h3>
            <p className="text-muted-foreground">Contact us to discuss how we can support your school</p>
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

export default ScnroEdSchools;
