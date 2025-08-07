import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Camera, Star, MapPin, Clock, Plus, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { storage, db } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import Chat from '@/components/Chat';

// Validation schema
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  bio: z.string().min(10, "Bio must be at least 10 characters").max(500, "Bio cannot exceed 500 characters"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  availability: z.string().min(1, "Please select your availability"),
  level: z.string().min(1, "Please select your experience level"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newWantToLearn, setNewWantToLearn] = useState("");
  
  const [profile, setProfile] = useState({
    name: "Sarah Chen",
    email: "sarah.chen@example.com",
    bio: "Full-stack developer with 5+ years experience. Love teaching React and Python!",
    location: "San Francisco, CA",
    availability: "weekends",
    level: "Expert",
    skills: ["React", "Python", "JavaScript", "Node.js"],
    wantToLearn: ["Machine Learning", "DevOps"],
    rating: 4.9,
    sessions: 127,
    joinedDate: "January 2023"
  });

  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);

  // Form setup
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name,
      email: profile.email,
      bio: profile.bio,
      location: profile.location,
      availability: profile.availability,
      level: profile.level,
    },
  });

  const handleSave = async (data: ProfileFormData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call with potential failure
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.9) {
            reject(new Error("Failed to update profile. Please try again."));
          } else {
            resolve(true);
          }
        }, 1500);
      });

      // Update local state
      setProfile(prev => ({
        ...prev,
        ...data,
      }));

      toast({
        title: "Profile updated!",
        description: "Your changes have been saved successfully.",
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = () => {
    setIsEditing(true);
    // Reset form with current profile data
    form.reset({
      name: profile.name,
      email: profile.email,
      bio: profile.bio,
      location: profile.location,
      availability: profile.availability,
      level: profile.level,
    });
  };

  const cancelEditing = () => {
    setIsEditing(false);
    form.reset();
  };

  const addSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      if (profile.skills.length >= 10) {
        toast({
          title: "Maximum skills reached",
          description: "You can add a maximum of 10 skills.",
          variant: "destructive",
        });
        return;
      }
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    if (profile.skills.length <= 1) {
      toast({
        title: "Cannot remove skill",
        description: "You must have at least one skill.",
        variant: "destructive",
      });
      return;
    }
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const addWantToLearn = () => {
    if (newWantToLearn.trim() && !profile.wantToLearn.includes(newWantToLearn.trim())) {
      if (profile.wantToLearn.length >= 10) {
        toast({
          title: "Maximum learning goals reached",
          description: "You can add a maximum of 10 learning goals.",
          variant: "destructive",
        });
        return;
      }
      setProfile(prev => ({
        ...prev,
        wantToLearn: [...prev.wantToLearn, newWantToLearn.trim()]
      }));
      setNewWantToLearn("");
    }
  };

  const removeWantToLearn = (skill: string) => {
    setProfile(prev => ({
      ...prev,
      wantToLearn: prev.wantToLearn.filter(s => s !== skill)
    }));
  };

  // Add a function to handle profile picture upload
  const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `profilePictures/${user.id}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      setProfilePicUrl(url);
      // Save download URL in Firestore user document
      await updateDoc(doc(db, 'users', user.id), { profilePicUrl: url });
      toast({ title: 'Profile picture updated!' });
    } catch (error) {
      toast({ title: 'Upload failed', description: 'Could not upload profile picture.', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  // When loading profile, set profilePicUrl if available
  useEffect(() => {
    if (user && user.profilePicUrl) {
      setProfilePicUrl(user.profilePicUrl);
    }
  }, [user]);

  // Assume you have access to profileOwnerId and profileOwnerName
  // For demonstration, let's use a placeholder for profileOwnerId and profileOwnerName
  const profileOwnerId = user?.id || 'demoUserId'; // Replace with actual logic
  const profileOwnerName = profile.name;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      {profilePicUrl ? (
                        <AvatarImage src={profilePicUrl} alt="Profile" />
                      ) : (
                        <AvatarFallback className="text-lg">
                          {profile.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                        asChild
                        disabled={uploading}
                      >
                        <label htmlFor="profile-pic-upload" className="cursor-pointer flex items-center justify-center w-full h-full">
                          <Camera className="h-4 w-4" />
                          <input
                            id="profile-pic-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleProfilePicChange}
                            disabled={uploading}
                          />
                        </label>
                      </Button>
                    )}
                  </div>

                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold">{profile.name}</h2>
                    <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{profile.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{profile.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 w-full text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">{profile.sessions}</div>
                      <div className="text-sm text-muted-foreground">Sessions</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">4.9</div>
                      <div className="text-sm text-muted-foreground">Rating</div>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Joined {profile.joinedDate}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Profile Information</CardTitle>
                <div className="flex space-x-2">
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={cancelEditing} disabled={isLoading}>
                        Cancel
                      </Button>
                      <Button
                        variant="default"
                        onClick={form.handleSubmit(handleSave)}
                        disabled={isLoading}
                      >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isLoading ? "Saving..." : "Save Changes"}
                      </Button>
                    </>
                  ) : (
                    <Button onClick={startEditing}>
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">Basic Info</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-6 mt-6">
                    <Form {...form}>
                      <div className="grid gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={!isEditing || isLoading}
                                  placeholder="Enter your full name"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="email"
                                  disabled={!isEditing || isLoading}
                                  placeholder="Enter your email address"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  disabled={!isEditing || isLoading}
                                  rows={4}
                                  placeholder="Tell others about yourself and what you love to teach or learn..."
                                  className="resize-none"
                                />
                              </FormControl>
                              <FormMessage />
                              <div className="text-xs text-muted-foreground text-right">
                                {field.value?.length || 0}/500 characters
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={!isEditing || isLoading}
                                  placeholder="City, State"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </Form>
                  </TabsContent>

                  <TabsContent value="skills" className="space-y-6 mt-6">
                    {/* Teaching Skills */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-medium">Skills I Can Teach</Label>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill, index) => (
                          <Badge key={index} variant="default" className="text-sm">
                            {skill}
                            {isEditing && (
                              <button
                                onClick={() => removeSkill(skill)}
                                className="ml-2 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </Badge>
                        ))}
                      </div>
                        {isEditing && (
                          <div className="flex gap-2">
                            <Input
                              value={newSkill}
                              onChange={(e) => setNewSkill(e.target.value)}
                              placeholder="Add a skill (e.g., React, Photography)..."
                              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                              disabled={isLoading}
                              maxLength={30}
                            />
                            <Button onClick={addSkill} size="sm" disabled={!newSkill.trim() || isLoading}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                    </div>

                    {/* Learning Goals */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium">Skills I Want to Learn</Label>
                      <div className="flex flex-wrap gap-2">
                        {profile.wantToLearn.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-sm">
                            {skill}
                            {isEditing && (
                              <button
                                onClick={() => removeWantToLearn(skill)}
                                className="ml-2 hover:text-destructive"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </Badge>
                        ))}
                      </div>
                        {isEditing && (
                          <div className="flex gap-2">
                            <Input
                              value={newWantToLearn}
                              onChange={(e) => setNewWantToLearn(e.target.value)}
                              placeholder="Add a learning goal (e.g., Machine Learning)..."
                              onKeyPress={(e) => e.key === 'Enter' && addWantToLearn()}
                              disabled={isLoading}
                              maxLength={30}
                            />
                            <Button onClick={addWantToLearn} size="sm" disabled={!newWantToLearn.trim() || isLoading}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                    </div>
                  </TabsContent>

                  <TabsContent value="preferences" className="space-y-6 mt-6">
                    <Form {...form}>
                      <div className="grid gap-4">
                        <FormField
                          control={form.control}
                          name="availability"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Availability</FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  disabled={!isEditing || isLoading}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your availability" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="weekdays">Weekdays</SelectItem>
                                    <SelectItem value="weekends">Weekends</SelectItem>
                                    <SelectItem value="evenings">Evenings</SelectItem>
                                    <SelectItem value="flexible">Flexible</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="level"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Experience Level</FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  disabled={!isEditing || isLoading}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your experience level" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                    <SelectItem value="Expert">Expert</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </Form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
        {user && profileOwnerId !== user.id && (
          <div className="mt-8">
            <Chat currentUserId={user.id} otherUserId={profileOwnerId} otherUserName={profileOwnerName} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;