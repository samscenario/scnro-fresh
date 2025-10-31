import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
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
      const res = await fetch("/api/brevo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput }),
      });

      if (!res.ok) throw new Error("Failed to submit");

      alert("Success! We will contact you soon.");
      (document.getElementById("schoolEmail") as HTMLInputElement).value = "";
    } catch (err) {
      console.error(err);
      alert("Submission failed. Please try again.");
    }
  };

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

          {/* Example CTA Section with Form */}
          <div className="text-center mt-12">
            <input
              type="email"
              id="schoolEmail"
              placeholder="Enter your school email"
              className="p-2 border rounded w-full max-w-xs mb-4"
            />
            <Button size="lg" className="text-lg px-8 py-6" onClick={handleBrevoSubmit}>
              Register Your School
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Our education team will contact you to discuss programme details and pricing
            </p>
          </div>

          {/* Contact Info */}
          <div className="mt-16 text-center space-y-2">
            <h3 className="text-xl font-semibold">Questions About the Programme?</h3>
            <p className="text-muted-foreground">
              Contact us to discuss how we can support your school
            </p>
            <p className="text-muted-foreground">
              <strong>Email:</strong>{" "}
              <a href="mailto:admin@scenarioarts.co.uk" className="text-electric-blue hover:underline">
                admin@scenarioarts.co.uk
              </a>
            </p>
            <p className="text-muted-foreground">
              <strong>Website:</strong>{" "}
              <a href="https://scnro.live" className="text-electric-blue hover:underline">
                scnro.live
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScnroEdSchools;
