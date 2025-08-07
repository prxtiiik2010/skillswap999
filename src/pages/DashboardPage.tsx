import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chat from '@/components/Chat';
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Star, Trophy, BookOpen, Users, TrendingUp } from "lucide-react";
import { Navigate } from "react-router-dom";

const DashboardPage = () => {
  const { isAuthenticated, user } = useAuth();

  // Redirect to home if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Mock dashboard data
  const stats = [
    { label: "Sessions Completed", value: "23", icon: BookOpen, color: "text-blue-600" },
    { label: "Skills Learned", value: "7", icon: Trophy, color: "text-green-600" },
    { label: "Hours Taught", value: "45", icon: Clock, color: "text-purple-600" },
    { label: "Rating", value: "4.8", icon: Star, color: "text-yellow-600" }
  ];

  const recentSessions = [
    { 
      title: "JavaScript Fundamentals",
      type: "learned",
      tutor: "Sarah Chen",
      date: "2 days ago",
      status: "completed"
    },
    {
      title: "Guitar Basics",
      type: "taught",
      student: "Mike Rodriguez",
      date: "1 week ago",
      status: "completed"
    },
    {
      title: "Digital Marketing",
      type: "learned",
      tutor: "Emily Davis",
      date: "1 week ago",
      status: "completed"
    }
  ];

  const upcomingSessions = [
    {
      title: "React Hooks Deep Dive",
      type: "learning",
      tutor: "Alex Thompson",
      date: "Tomorrow, 2:00 PM",
      duration: "1 hour"
    },
    {
      title: "Photography Techniques",
      type: "teaching",
      student: "Lisa Park",
      date: "Friday, 4:00 PM",
      duration: "1.5 hours"
    }
  ];

  // Placeholder for demonstration
  const otherUserId = 'demoUserId2';
  const otherUserName = 'Demo User';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's your learning and teaching summary
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="p-6">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Sessions */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Recent Sessions
            </h2>
            <div className="space-y-4">
              {recentSessions.map((session, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{session.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {session.type === "learned" ? `with ${session.tutor}` : `taught to ${session.student}`}
                    </p>
                    <p className="text-xs text-muted-foreground">{session.date}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={session.type === "learned" ? "secondary" : "default"}>
                      {session.type === "learned" ? "Learned" : "Taught"}
                    </Badge>
                    <Badge variant="outline">Completed</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Sessions */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Upcoming Sessions
            </h2>
            <div className="space-y-4">
              {upcomingSessions.map((session, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{session.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {session.type === "learning" ? `with ${session.tutor}` : `teaching ${session.student}`}
                    </p>
                    <p className="text-xs text-muted-foreground">{session.date}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={session.type === "learning" ? "secondary" : "default"}>
                      {session.type === "learning" ? "Learning" : "Teaching"}
                    </Badge>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Users className="h-6 w-6" />
              <span>Find Tutors</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <BookOpen className="h-6 w-6" />
              <span>Start Teaching</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <Calendar className="h-6 w-6" />
              <span>Schedule Session</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
              <TrendingUp className="h-6 w-6" />
              <span>View Progress</span>
            </Button>
          </div>
        </Card>

        {user && (
          <div className="max-w-xl mx-auto mt-8">
            <Chat currentUserId={user.id} otherUserId={otherUserId} otherUserName={otherUserName} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default DashboardPage;