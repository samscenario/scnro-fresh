import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, User, Shield, Menu } from "lucide-react";
import { ScenarioAlertDialog } from "@/components/ScenarioAlertDialog";
import { ScnroEdDialog } from "@/components/ScnroEdDialog";
import { ScnroSchoolsDialog } from "@/components/ScnroSchoolsDialog";
import ScnroLogo from "@/components/ScnroLogo";
import { useIsMobile } from "@/hooks/use-mobile";
const Header = () => {
  console.log("Header component rendering");
  console.log("🔍 DEBUG: Header rendering");
  const location = useLocation();
  const {
    user,
    signOut
  } = useAuth();
  const isMobile = useIsMobile();
  const isActive = (path: string) => location.pathname === path;
  const handleSignOut = async () => {
    await signOut();
  };
  return <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/20">
      <div className="container mx-auto px-3 py-0.5 md:py-4">
        <div className="flex items-center justify-between min-h-[2rem] md:min-h-[4rem]">
          {/* Mobile Layout - Ultra minimal */}
          {isMobile ? <>
              {/* Mobile Hamburger Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white p-1.5">
                    <Menu className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[280px] bg-background">
                  <SheetHeader>
                    <SheetTitle>Navigation</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-4 mt-6">
                    <Link to="/" className="text-lg font-medium hover:text-primary transition-colors">
                      Home
                    </Link>
                    
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="experience" className="border-b-0">
                        <AccordionTrigger className="text-lg font-medium hover:text-primary hover:no-underline py-2">
                          Experience
                        </AccordionTrigger>
                        <AccordionContent className="pb-2">
                          <div className="flex flex-col gap-2 ml-4">
                            <Link to="/enter-scenario" className="text-base font-medium hover:text-primary transition-colors py-1">
                              Enter the Scenario
                            </Link>
                            <a href="https://www.scnro.live/mainframe" className="text-base font-medium hover:text-primary transition-colors py-1">
                              Mainframe
                            </a>
                            <Link to="/sounds-of-scenario" className="text-base font-medium hover:text-primary transition-colors py-1">
                              Sounds Of Scenario
                            </Link>
                            <Link to="/mainframe/newsletter" className="text-base font-medium hover:text-primary transition-colors py-1">
                              Newsletter
                            </Link>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="create" className="border-b-0">
                        <AccordionTrigger className="text-lg font-medium hover:text-primary hover:no-underline py-2">
                          Create
                        </AccordionTrigger>
                        <AccordionContent className="pb-2">
                          <div className="flex flex-col gap-2 ml-4">
                            <Link to="/labs" className="text-base font-medium hover:text-primary transition-colors py-1">
                              Labs
                            </Link>
                            <Link to="/campus" className="text-base font-medium hover:text-primary transition-colors py-1">
                              Campus
                            </Link>
                            <Link to="/academic-calendar" className="text-base font-medium hover:text-primary transition-colors py-1">
                              Academic Calendar
                            </Link>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="education" className="border-b-0">
                        <AccordionTrigger className="text-lg font-medium hover:text-primary hover:no-underline py-2">
                          Education
                        </AccordionTrigger>
                        <AccordionContent className="pb-2">
                          <div className="flex flex-col gap-2 ml-4">
                            <Link to="/scnro-ed" className="text-base font-medium hover:text-primary transition-colors py-1">
                              Mental Toughness Programme
                            </Link>
                            <Link to="/scnro-ed-schools" className="text-base font-medium hover:text-primary transition-colors py-1">
                              Schools & Colleges
                            </Link>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    
                    <Link to="/drop" className="text-lg font-medium hover:text-primary transition-colors">
                      The Drop
                    </Link>
                    
                    <div className="mt-6 pt-6 border-t">
                      <div className="flex flex-col gap-3">
                        <Button variant="scenario" size="sm" asChild className="w-full">
                          <Link to="/scnro-drip-pitch">SCNRO DRIP</Link>
                        </Button>
                        <Button variant="scenario" size="sm" onClick={() => window.location.href = 'https://www.scnro.live/mainframe'} className="w-full text-xs px-2 py-1">
                          SCNRO CONFERENCE '26
                        </Button>
                        <ScenarioAlertDialog>
                          <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-black w-full">
                            SIGN UP FOR ALERTS
                          </Button>
                        </ScenarioAlertDialog>
                        <ScnroEdDialog>
                          <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-black w-full">
                            MENTAL TOUGHNESS
                          </Button>
                        </ScnroEdDialog>
                        <Button variant="scenario" size="sm" asChild className="w-full">
                          <Link to="/sponsors">SPONSORS PAGE</Link>
                        </Button>
                        
                        {/* Admin access if authenticated */}
                        {user && <div className="pt-4 border-t">
                            <Button variant="ghost" size="sm" asChild className="w-full">
                              <Link to="/admin">
                                <Shield className="h-4 w-4 mr-2" />
                                Admin Panel
                              </Link>
                            </Button>
                            <Button variant="ghost" size="sm" asChild className="w-full mt-2">
                              <Link to="/campus-admin">
                                <Shield className="h-4 w-4 mr-2" />
                                Campus Admin
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleSignOut} className="w-full mt-2">
                              <LogOut className="h-4 w-4 mr-2" />
                              Sign Out
                            </Button>
                          </div>}
                        
                        {/* Sign In for Admin Access */}
                        {!user && <Button variant="outline" size="sm" asChild className="w-full mt-4">
                            <Link to="/auth">Sign In for Admin</Link>
                          </Button>}
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sign In button - minimal but visible on mobile */}
              {!user && <Button variant="ghost" size="sm" asChild className="text-white p-1.5">
                  <Link to="/auth">
                    <User className="h-4 w-4" />
                  </Link>
                </Button>}
              
              {/* Admin indicator if logged in */}
              {user && <Button variant="ghost" size="sm" asChild className="text-primary p-1.5">
                  <Link to="/admin">
                    <Shield className="h-4 w-4" />
                  </Link>
                </Button>}
            </> : (/* Desktop Layout */
        <Link to="/" className="flex items-center justify-center hover:scale-105 transition-all duration-300 border-2 border-white px-3 py-1 rounded-lg hover:border-electric-blue">
              <img src="/lovable-uploads/b945c63f-87df-4701-ac10-24c5dde261fe.png" alt="SCNRO Logo" className="h-8 w-auto" />
            </Link>)}

          {/* Navigation Menu */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Experience</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-electric-blue/50 to-electric-blue/20 p-6 no-underline outline-none focus:shadow-md" to="/enter-scenario">
                          <div className="mb-2 mt-4 text-lg font-medium text-foreground">
                            Enter the Scenario
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Step into SCNRO's immersive world of culture and creativity.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a href="https://www.scnro.live/mainframe" className={cn("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground")}>
                          <div className="text-sm font-medium leading-none">Mainframe</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            The hub of all SCNRO operations
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/sounds-of-scenario" className={cn("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground")}>
                          <div className="text-sm font-medium leading-none">Sounds Of Scenario</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Unreleased tracks and demos not posted elsewhere
Extended mixes and full-length sets
Behind-the-scenes content </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/mainframe/newsletter" className={cn("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground")}>
                          <div className="text-sm font-medium leading-none">Newsletter</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            MAINFRAME 2026 updates and programme
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Create</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/labs" className={cn("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground")}>
                          <div className="text-sm font-medium leading-none">Labs</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Creative workshops and skill building
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/campus" className={cn("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground")}>
                          <div className="text-sm font-medium leading-none">Campus</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            University events and collaborations
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/campus-tickets" className={cn("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground")}>
                          <div className="text-sm font-medium leading-none">Campus Tickets</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Get tickets for campus live events
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/academic-calendar" className={cn("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground")}>
                          <div className="text-sm font-medium leading-none">Academic Calendar</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            East London academic calendar with events
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger>Education</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                    <li className="row-span-2">
                      <NavigationMenuLink asChild>
                        <Link className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-purple-500/50 to-purple-500/20 p-6 no-underline outline-none focus:shadow-md" to="/scnro-ed">
                          <div className="mb-2 mt-4 text-lg font-medium text-foreground">
                            Mental Toughness Programme
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            6-week programme for ages 16-19 in Newham
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <Link to="/scnro-ed-schools" className={cn("block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground")}>
                          <div className="text-sm font-medium leading-none">Schools & Colleges</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Bring the programme to your institution
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link to="/drop" className={cn(navigationMenuTriggerStyle(), isActive('/drop') && 'bg-accent text-accent-foreground')}>
                  The Drop
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* CTA Buttons */}
          <div className="hidden md:flex gap-3">
            <Button variant="scenario" size="sm" asChild>
              <Link to="/scnro-drip-pitch">SCNRO DRIP</Link>
            </Button>
            <Button variant="scenario" size="sm" onClick={() => window.location.href = 'https://www.scnro.live/mainframe'} className="text-xs px-2 py-1">
              SCNRO CONFERENCE '26
            </Button>
            <ScenarioAlertDialog>
              <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-black">
                SIGN UP FOR ALERTS
              </Button>
            </ScenarioAlertDialog>
            <ScnroEdDialog>
              <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-black">
                MENTAL TOUGHNESS
              </Button>
            </ScnroEdDialog>
          </div>

          {/* Desktop Auth Controls */}
          <div className="hidden md:flex items-center gap-2">
            {user ? <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin">
                    <Shield className="h-4 w-4 mr-2" />
                    Admin
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/campus-admin">
                    <Shield className="h-4 w-4 mr-2" />
                    Campus Admin
                  </Link>
                </Button>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user.email}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </> : <>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button variant="scenario" size="sm" asChild>
                  <Link to="/sponsors">Sponsors Page</Link>
                </Button>
              </>}
          </div>
        </div>
      </div>
    </header>;
};
export default Header;