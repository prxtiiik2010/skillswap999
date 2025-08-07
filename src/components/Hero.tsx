import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, BookOpen, Star } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import AuthModal from "./AuthModal";

const Hero = () => {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const handleGetStarted = () => {
    setIsSignupModalOpen(true);
  };
  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-primary-glow/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                Learn and Teach Skills{" "}
                <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  Peer-to-Peer
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Exchange knowledge, earn skill points, and grow together in our supportive learning community.
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-medium">10K+ Learners</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="font-medium">500+ Skills</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-primary" />
                <span className="font-medium">4.9/5 Rating</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="text-lg" onClick={handleGetStarted}>
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg" asChild>
                <a href="/search">Find Tutors</a>
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={heroImage}
                alt="Peer learning community"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-card rounded-2xl p-4 shadow-lg border">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Live Sessions</span>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-card rounded-2xl p-4 shadow-lg border">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium">Earn Points</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AuthModal 
        open={isSignupModalOpen} 
        onOpenChange={setIsSignupModalOpen} 
        defaultTab="signup"
      />
    </section>
  );
};

export default Hero;