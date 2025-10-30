import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const OurStory = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-black text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/4c66c6a2-43af-4418-828b-e6d55a12a305.png" 
              alt="Logo"
              className="h-8 w-auto"
            />
            <span className="text-lg font-bold">OUR STORY</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-16">
          
          {/* Hero Section */}
          <section className="text-center space-y-4">
            <h1 className="text-5xl md:text-7xl font-black text-primary">
              THIS IS THE SCENARIO.
            </h1>
          </section>

          {/* Who We Are Section Header */}
          <section className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-black text-foreground">
              SCENARIO ARTS & SCNRO: WHO WE ARE
            </h2>
            
            {/* Scenario Arts Section */}
            {isMobile ? (
              <Accordion type="single" collapsible className="border border-border rounded-xl">
                <AccordionItem value="scenario-arts" className="border-none">
                  <AccordionTrigger className="text-2xl font-bold text-primary px-6 pt-6 pb-3 hover:no-underline">
                    Scenario Arts
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 space-y-3 text-lg">
                    <p className="text-yellow-300 text-xl">A UK-based charitable organisation supporting young people through creative programmes.</p>
                    <p>We create pathways in music, arts, and media that help 14–25-year-olds grow, express themselves, and build careers.</p>
                    <p>We work with schools, communities, and funders to bring opportunity where it's needed most.</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-primary">Scenario Arts</h3>
                <div className="space-y-3 text-lg">
                  <p className="text-yellow-300 text-xl">A UK-based charitable organisation supporting young people through creative programmes.</p>
                  <p>We create pathways in music, arts, and media that help 14–25-year-olds grow, express themselves, and build careers.</p>
                  <p>We work with schools, communities, and funders to bring opportunity where it's needed most.</p>
                </div>
              </div>
            )}

            {/* SCNRO Section */}
            {isMobile ? (
              <Accordion type="single" collapsible className="bg-gradient-to-r from-card via-background to-card rounded-xl">
                <AccordionItem value="scnro" className="border-none">
                  <AccordionTrigger className="text-2xl font-bold text-primary px-6 pt-6 pb-3 hover:no-underline">
                    SCNRO
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 space-y-3 text-lg">
                    <p className="text-yellow-300 text-xl">SCNRO is the youth culture brand born from Scenario Arts — built to feel like the culture students actually live in.</p>
                    <p>It's a <span className="text-primary font-semibold">festival-first, visual, music-driven</span> movement for Gen Z.</p>
                    <div className="space-y-2">
                      <p className="font-semibold">Think of it as:</p>
                      <ul className="space-y-1 ml-4">
                        <li>• A <span className="text-primary">platform</span>, not a programme</li>
                        <li>• A <span className="text-primary">brand</span>, not just a project</li>
                        <li>• A space where <span className="text-primary">music, fashion, media, and energy collide</span></li>
                      </ul>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-primary">SCNRO</h3>
                <div className="space-y-3 text-lg">
                  <p className="text-yellow-300 text-xl">SCNRO is the youth culture brand born from Scenario Arts — built to feel like the culture students actually live in.</p>
                  <p>It's a <span className="text-primary font-semibold">festival-first, visual, music-driven</span> movement for Gen Z.</p>
                  <div className="space-y-2">
                    <p className="font-semibold">Think of it as:</p>
                    <ul className="space-y-1 ml-4">
                      <li>• A <span className="text-primary">platform</span>, not a programme</li>
                      <li>• A <span className="text-primary">brand</span>, not just a project</li>
                      <li>• A space where <span className="text-primary">music, fashion, media, and energy collide</span></li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Mission Section */}
          {isMobile ? (
            <Accordion type="single" collapsible className="bg-gradient-to-r from-card via-background to-card rounded-xl">
              <AccordionItem value="mission" className="border-none">
                <AccordionTrigger className="text-3xl md:text-4xl font-black text-primary px-8 pt-8 pb-4 hover:no-underline">
                  MISSION
                </AccordionTrigger>
                <AccordionContent className="px-8 pb-8 space-y-6">
                  <p className="text-xl md:text-2xl text-yellow-300 font-semibold">
                    We're not just throwing events. We're building futures — through culture.
                  </p>
                  <p className="text-lg leading-relaxed">
                    SCNRO is a youth-powered platform born in London, built to elevate the next wave of creators. Through music, fashion, art, and media, we connect young talent with real tools, mentors, and opportunities.
                  </p>
                  <p className="text-lg leading-relaxed">
                    From campus pop-ups to high-energy festivals, we turn good times into growth — and help young people turn creativity into confidence, community, and careers.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : (
            <section className="bg-gradient-to-r from-card via-background to-card p-8 rounded-xl space-y-6">
              <h2 className="text-3xl md:text-4xl font-black text-primary">MISSION</h2>
              <p className="text-xl md:text-2xl text-yellow-300 font-semibold">
                We're not just throwing events. We're building futures — through culture.
              </p>
              <p className="text-lg leading-relaxed">
                SCNRO is a youth-powered platform born in London, built to elevate the next wave of creators. Through music, fashion, art, and media, we connect young talent with real tools, mentors, and opportunities.
              </p>
              <p className="text-lg leading-relaxed">
                From campus pop-ups to high-energy festivals, we turn good times into growth — and help young people turn creativity into confidence, community, and careers.
              </p>
            </section>
          )}

          {/* Our Story Section */}
          {isMobile ? (
            <Accordion type="single" collapsible className="border border-border rounded-xl">
              <AccordionItem value="story" className="border-none">
                <AccordionTrigger className="text-3xl md:text-4xl font-black text-primary px-8 pt-8 pb-4 hover:no-underline">
                  OUR STORY
                </AccordionTrigger>
                <AccordionContent className="px-8 pb-8 space-y-6">
                  <div className="space-y-6 text-lg leading-relaxed">
                    <p className="text-xl md:text-2xl text-yellow-300">
                      SCNRO started with one question: What happens when we give young people the space to create their own future?
                    </p>
                    <p>
                      From that spark, we launched a movement — not just a programme.
                    </p>
                    <p>
                      We use the culture young people already live in — music, fashion, art, street visuals — and remix it into real platforms. Platforms to learn. To express. To launch. Whether it's on a stage, behind a lens, or through a streetwear drop, SCNRO is where raw energy becomes real opportunity.
                    </p>
                    
                    <div className="grid md:grid-cols-2 gap-6 my-8">
                      <div className="space-y-4">
                        <h3 className="text-xl font-bold text-yellow-300">We believe in:</h3>
                        <ul className="space-y-3">
                          <li><span className="text-primary font-semibold">Creativity</span> — Everyone's got a vision. We help bring it to life.</li>
                          <li><span className="text-primary font-semibold">Inclusivity</span> — All cultures. All stories. All in.</li>
                          <li><span className="text-primary font-semibold">Empowerment</span> — Talent meets tools, support, and self-belief.</li>
                          <li><span className="text-primary font-semibold">Community</span> — From the underground to the mainstage, we build together.</li>
                        </ul>
                      </div>
                      
                      <div className="space-y-4 text-center md:text-left">
                        <p className="text-2xl font-black text-primary">This isn't charity work.</p>
                        <p className="text-2xl font-black text-yellow-300">It's culture work.</p>
                        <p className="text-xl font-bold">This isn't just a vibe.</p>
                        <p className="text-xl font-bold text-primary">It's your Scenario.</p>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : (
            <section className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-black text-primary">OUR STORY</h2>
              <div className="space-y-6 text-lg leading-relaxed">
                <p className="text-xl md:text-2xl text-yellow-300">
                  SCNRO started with one question: What happens when we give young people the space to create their own future?
                </p>
                <p>
                  From that spark, we launched a movement — not just a programme.
                </p>
                <p>
                  We use the culture young people already live in — music, fashion, art, street visuals — and remix it into real platforms. Platforms to learn. To express. To launch. Whether it's on a stage, behind a lens, or through a streetwear drop, SCNRO is where raw energy becomes real opportunity.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 my-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-yellow-300">We believe in:</h3>
                    <ul className="space-y-3">
                      <li><span className="text-primary font-semibold">Creativity</span> — Everyone's got a vision. We help bring it to life.</li>
                      <li><span className="text-primary font-semibold">Inclusivity</span> — All cultures. All stories. All in.</li>
                      <li><span className="text-primary font-semibold">Empowerment</span> — Talent meets tools, support, and self-belief.</li>
                      <li><span className="text-primary font-semibold">Community</span> — From the underground to the mainstage, we build together.</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4 text-center md:text-left">
                    <p className="text-2xl font-black text-primary">This isn't charity work.</p>
                    <p className="text-2xl font-black text-yellow-300">It's culture work.</p>
                    <p className="text-xl font-bold">This isn't just a vibe.</p>
                    <p className="text-xl font-bold text-primary">It's your Scenario.</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Why Now Section */}
          {isMobile ? (
            <Accordion type="single" collapsible className="bg-gradient-to-r from-primary/10 via-yellow-300/10 to-primary/10 rounded-xl">
              <AccordionItem value="why-now" className="border-none">
                <AccordionTrigger className="text-3xl md:text-4xl font-black text-primary px-8 pt-8 pb-4 hover:no-underline">
                  WHY NOW?
                </AccordionTrigger>
                <AccordionContent className="px-8 pb-8 space-y-6">
                  <p className="text-xl md:text-2xl text-yellow-300 font-semibold">
                    Because this generation isn't waiting for permission.
                  </p>
                  <div className="space-y-4 text-lg">
                    <p>
                      Young people are building brands, creating content, and starting movements — with or without support. But too many still face real barriers: access, representation, guidance, and space.
                    </p>
                    <p className="text-primary font-semibold text-xl">SCNRO exists to flip that script.</p>
                    <p>
                      We meet Gen Z where they are — on campus, online, in the culture — and build the bridge to where they could be.
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-4 my-6">
                      <div className="text-center">
                        <p className="font-bold text-primary">We turn sounds</p>
                        <p className="text-yellow-300">into scenarios.</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-primary">Looks</p>
                        <p className="text-yellow-300">into launches.</p>
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-primary">Ideas</p>
                        <p className="text-yellow-300">into infrastructure.</p>
                      </div>
                    </div>
                    
                    <div className="text-center space-y-2 mt-8">
                      <p className="text-xl font-bold">Now's the time — because this generation isn't next.</p>
                      <p className="text-2xl font-black text-primary">They're now.</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : (
            <section className="bg-gradient-to-r from-primary/10 via-yellow-300/10 to-primary/10 p-8 rounded-xl space-y-6">
              <h2 className="text-3xl md:text-4xl font-black text-primary">
                WHY NOW?
              </h2>
              <p className="text-xl md:text-2xl text-yellow-300 font-semibold">
                Because this generation isn't waiting for permission.
              </p>
              <div className="space-y-4 text-lg">
                <p>
                  Young people are building brands, creating content, and starting movements — with or without support. But too many still face real barriers: access, representation, guidance, and space.
                </p>
                <p className="text-primary font-semibold text-xl">SCNRO exists to flip that script.</p>
                <p>
                  We meet Gen Z where they are — on campus, online, in the culture — and build the bridge to where they could be.
                </p>
                
                <div className="grid md:grid-cols-3 gap-4 my-6">
                  <div className="text-center">
                    <p className="font-bold text-primary">We turn sounds</p>
                    <p className="text-yellow-300">into scenarios.</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-primary">Looks</p>
                    <p className="text-yellow-300">into launches.</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-primary">Ideas</p>
                    <p className="text-yellow-300">into infrastructure.</p>
                  </div>
                </div>
                
                <div className="text-center space-y-2 mt-8">
                  <p className="text-xl font-bold">Now's the time — because this generation isn't next.</p>
                  <p className="text-2xl font-black text-primary">They're now.</p>
                </div>
              </div>
            </section>
          )}

          {/* CTA Section */}
          <section className="text-center space-y-6 py-12">
            <Button variant="cta" size="lg" asChild>
              <Link to="/signal">EXPLORE SCENARIO STREAM</Link>
            </Button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default OurStory;