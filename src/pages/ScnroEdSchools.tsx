import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { ScnroSchoolsDialog } from "@/components/ScnroSchoolsDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Users, Award, TrendingUp } from "lucide-react";

const ScnroEdSchools = () => {
  // Brevo submit handler
  const handleBrevoSubmit = async () => {
    const emailInput = (document.getElementById("schoolEmail") as HTMLInputElement).value;
    if (!emailInput) {
      alert("Please enter your email");
      return;
    }

    try {
      const apiKey = "YOUR_BREVO_API_KEY"; // replace with your actual key
      const listId = YOUR_LIST_ID; // replace with your Brevo list ID (no quotes)

      await fetch("https://api.brevo.com/v3/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey
        },
        body: JSON.stringify({
          email: emailInput,
          listIds: [listId],
          updateEnabled: true
        })
      });

      alert("Success! We will contact you soon.");
      (document.getElementById("schoolEmail") as HTMLInputElement).value = "";
    } catch (err) {
      console.error(err);
      alert("Submission failed. Please try again.");
    }
  };

  // Return JSX
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
                <Ca

