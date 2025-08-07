import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Search, Filter, Clock, Calendar as CalendarIcon, Star, MapPin, Coins, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";

// Mock data for tutors/learners
const mockUsers = [
  {
    id: 1,
    name: "Sarah Chen",
    bio: "Full-stack developer with 5+ years experience. Love teaching React and Python!",
    skills: ["React", "Python", "JavaScript", "Node.js"],
    rating: 4.9,
    sessions: 127,
    location: "San Francisco, CA",
    availability: "weekends",
    level: "Expert",
    type: "tutor",
    initials: "SC"
  },
  {
    id: 2,
    name: "Mike Rodriguez",
    bio: "Guitar enthusiast looking to learn music production. Can teach acoustic guitar basics.",
    skills: ["Guitar", "Music Theory"],
    wantToLearn: ["Music Production", "Audio Engineering"],
    rating: 4.7,
    sessions: 45,
    location: "Austin, TX",
    availability: "evenings",
    level: "Intermediate",
    type: "learner",
    initials: "MR"
  },
  {
    id: 3,
    name: "Emily Davis",
    bio: "Digital marketing specialist passionate about helping small businesses grow online.",
    skills: ["Digital Marketing", "SEO", "Social Media", "Content Writing"],
    rating: 4.8,
    sessions: 89,
    location: "New York, NY",
    availability: "flexible",
    level: "Expert",
    type: "tutor",
    initials: "ED"
  },
  {
    id: 4,
    name: "Alex Thompson",
    bio: "Data science student eager to learn machine learning. Can help with statistics.",
    skills: ["Statistics", "Excel", "R"],
    wantToLearn: ["Machine Learning", "Python", "TensorFlow"],
    rating: 4.6,
    sessions: 23,
    location: "Boston, MA",
    availability: "weekdays",
    level: "Beginner",
    type: "learner",
    initials: "AT"
  },
  {
    id: 5,
    name: "Lisa Park",
    bio: "Professional photographer with expertise in portrait and landscape photography.",
    skills: ["Photography", "Lightroom", "Photoshop", "Portrait Photography"],
    rating: 4.9,
    sessions: 156,
    location: "Los Angeles, CA",
    availability: "weekends",
    level: "Expert",
    type: "tutor",
    initials: "LP"
  },
  {
    id: 6,
    name: "David Kim",
    bio: "Beginner cook wanting to master Korean cuisine and general cooking techniques.",
    skills: ["Basic Cooking"],
    wantToLearn: ["Korean Cooking", "Baking", "Knife Skills"],
    rating: 4.5,
    sessions: 12,
    location: "Seattle, WA",
    availability: "evenings",
    level: "Beginner",
    type: "learner",
    initials: "DK"
  }
];

// Session request validation schema
const sessionSchema = z.object({
  date: z.date({
    required_error: "Please select a date for your session",
  }),
  timeSlot: z.string().min(1, "Please select a time slot"),
  message: z.string().optional(),
});

type SessionFormData = z.infer<typeof sessionSchema>;

const SessionRequestModal = ({ user, open, onOpenChange }: { user: any, open: boolean, onOpenChange: (open: boolean) => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      message: "",
    },
  });

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", 
    "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"
  ];

  const handleConfirm = async (data: SessionFormData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call with potential failure
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.85) {
            reject(new Error("Failed to send request. The tutor may be unavailable at this time."));
          } else {
            resolve(true);
          }
        }, 1500);
      });

      toast({
        title: "Session request sent!",
        description: `Your request for ${format(data.date, "PPP")} at ${data.timeSlot} has been sent to ${user.name}.`,
      });
      
      onOpenChange(false);
      form.reset();
    } catch (error) {
      toast({
        title: "Request failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <span>Request Session with {user.name}</span>
          </DialogTitle>
          <DialogDescription>
            Schedule a skill-sharing session with {user.name}. Select your preferred date and time.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleConfirm)} className="space-y-6">
            {/* Date Selection */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Select Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={isLoading}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Time Selection */}
            <FormField
              control={form.control}
              name="timeSlot"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Time</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a time slot" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4" />
                              {time}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Optional Message */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Add any specific topics you'd like to cover or questions you have..."
                      rows={3}
                      disabled={isLoading}
                      className="resize-none"
                      maxLength={300}
                    />
                  </FormControl>
                  <FormMessage />
                  <div className="text-xs text-muted-foreground text-right">
                    {field.value?.length || 0}/300 characters
                  </div>
                </FormItem>
              )}
            />

            {/* Cost */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">Session Cost:</span>
                <div className="flex items-center space-x-1 text-primary font-bold">
                  <Coins className="h-4 w-4" />
                  <span>10 Skill Points</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => onOpenChange(false)} 
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                variant="gradient" 
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Sending request..." : "Confirm Request"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const UserCard = ({ user }: { user: any }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Card className="p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] bg-gradient-to-br from-card to-card/50 animate-fade-in">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{user.name}</h3>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{user.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{user.location}</span>
                </div>
              </div>
            </div>
            <Badge variant={user.type === 'tutor' ? 'default' : 'secondary'}>
              {user.type === 'tutor' ? 'Tutor' : 'Learner'}
            </Badge>
          </div>

          {/* Bio */}
          <p className="text-muted-foreground text-sm">{user.bio}</p>

          {/* Skills */}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
            {user.wantToLearn && (
              <div>
                <span className="text-xs text-muted-foreground">Wants to learn: </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {user.wantToLearn.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Stats and Action */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="text-sm text-muted-foreground">
              {user.sessions} sessions • {user.availability}
            </div>
            <Button variant="gradient" size="sm" onClick={() => setIsModalOpen(true)}>
              Request Session
            </Button>
          </div>
        </div>
      </Card>

      <SessionRequestModal 
        user={user} 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
      />
    </>
  );
};

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  // Filter users based on search and filters
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = searchQuery === "" || 
      user.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.wantToLearn && user.wantToLearn.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAvailability = availabilityFilter === "" || availabilityFilter === "all" || user.availability === availabilityFilter;
    const matchesLevel = levelFilter === "" || levelFilter === "all" || user.level === levelFilter;
    const matchesType = typeFilter === "" || typeFilter === "all" || user.type === typeFilter;

    return matchesSearch && matchesAvailability && matchesLevel && matchesType;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Find Your Perfect{" "}
            <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Learning Partner
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with tutors and fellow learners to expand your skills and knowledge.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-2xl p-6 shadow-sm border mb-8 animate-fade-in">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for Python, Guitar, Photography..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-lg h-12"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="tutor">Tutors</SelectItem>
                <SelectItem value="learner">Learners</SelectItem>
              </SelectContent>
            </Select>

            <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Times</SelectItem>
                <SelectItem value="weekdays">Weekdays</SelectItem>
                <SelectItem value="weekends">Weekends</SelectItem>
                <SelectItem value="evenings">Evenings</SelectItem>
                <SelectItem value="flexible">Flexible</SelectItem>
              </SelectContent>
            </Select>

            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Skill Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Expert">Expert</SelectItem>
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            {(searchQuery || (availabilityFilter && availabilityFilter !== "all") || (levelFilter && levelFilter !== "all") || (typeFilter && typeFilter !== "all")) && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setSearchQuery("");
                  setAvailabilityFilter("all");
                  setLevelFilter("all");
                  setTypeFilter("all");
                }}
              >
                Clear All
              </Button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredUsers.length} result{filteredUsers.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* User Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user, index) => (
            <div key={user.id} style={{ animationDelay: `${index * 100}ms` }}>
              <UserCard user={user} />
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <div className="max-w-md mx-auto">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <Button variant="outline" onClick={() => {
                setSearchQuery("");
                setAvailabilityFilter("all");
                setLevelFilter("all");
                setTypeFilter("all");
              }}>
                Clear All Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;