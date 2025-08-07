import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Users, BookOpen, Trophy, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";
import { useState } from "react";
import AuthModal from "./AuthModal";

const teachBenefits = [
  {
    icon: Trophy,
    title: "Earn Skill Points",
    description: "Get rewarded for every session you teach and build up your reputation score."
  },
  {
    icon: Users,
    title: "Build Your Network",
    description: "Connect with learners from diverse backgrounds and expand your professional network."
  },
  {
    icon: TrendingUp,
    title: "Improve Your Skills",
    description: "Teaching others is the best way to deepen your own understanding and expertise."
  },
  {
    icon: BookOpen,
    title: "Share Your Passion",
    description: "Help others discover and develop skills you're passionate about."
  }
];

const steps = [
  {
    number: "1",
    title: "Create Your Profile",
    description: "Sign up and showcase your skills, experience, and teaching style."
  },
  {
    number: "2",
    title: "Set Your Availability",
    description: "Choose when you're available to teach and set your preferred session formats."
  },
  {
    number: "3",
    title: "Start Teaching",
    description: "Accept session requests from learners and begin sharing your knowledge."
  },
  {
    number: "4",
    title: "Earn and Grow",
    description: "Build your reputation, earn points, and expand your teaching portfolio."
  }
];

const Teach = () => {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  const handleStartTeaching = () => {
    setIsSignupModalOpen(true);
  };

  return (
    <section id="teach" className="py-20 bg-gradient-to-br from-primary/5 via-background to-primary-glow/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Start{" "}
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Teaching Today
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Share your expertise, help others grow, and earn rewards while building your teaching reputation.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {teachBenefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/50">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </Card>
            );
          })}
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-12">How It Works</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-primary-foreground font-bold text-lg">
                  {step.number}
                </div>
                <h4 className="text-lg font-semibold mb-2">{step.title}</h4>
                <p className="text-muted-foreground text-sm">{step.description}</p>
                {index < steps.length - 1 && (
                  <ArrowRight className="h-5 w-5 text-muted-foreground mx-auto mt-4 hidden lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Skills You Can Teach */}
        <div className="bg-card rounded-2xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Popular Skills to Teach</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Programming & Web Development",
              "Design & Creative Arts",
              "Digital Marketing",
              "Data Science & Analytics",
              "Photography & Video",
              "Music & Audio Production",
              "Languages & Communication",
              "Business & Entrepreneurship",
              "Cooking & Culinary Arts"
            ].map((skill, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-sm">{skill}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="hero" size="lg" className="text-lg" onClick={handleStartTeaching}>
            Start Teaching Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Join thousands of teachers already sharing their knowledge
          </p>
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

export default Teach;