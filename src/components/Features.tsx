import { Card } from "@/components/ui/card";
import { Users, BookOpen, Trophy, MessageCircle, Calendar, Shield } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Find Expert Tutors",
    description: "Connect with skilled peers in your field of interest and learn from their expertise."
  },
  {
    icon: BookOpen,
    title: "Teach Your Skills",
    description: "Share your knowledge with others and earn skill points while building your reputation."
  },
  {
    icon: Trophy,
    title: "Earn Skill Points",
    description: "Get rewarded for both learning and teaching with our gamified point system."
  },
  {
    icon: MessageCircle,
    title: "Interactive Sessions",
    description: "Engage in live video sessions, chat discussions, and collaborative projects."
  },
  {
    icon: Calendar,
    title: "Flexible Scheduling",
    description: "Book sessions that fit your schedule with our easy-to-use calendar system."
  },
  {
    icon: Shield,
    title: "Verified Community",
    description: "Learn in a safe, moderated environment with verified users and quality assurance."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              SkillSwap?
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of learners and teachers in our thriving peer-to-peer education community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 border-border/50 bg-gradient-to-br from-card to-card/50">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;