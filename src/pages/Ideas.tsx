import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Filter, Lightbulb, Sparkles, Target, TrendingUp, Loader2 } from "lucide-react";
import { IdeaGenerator } from "@/components/IdeaGenerator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Idea {
  id: string;
  title: string;
  category: string;
  createdAt: string;
  status?: 'concept' | 'planning' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  description?: string;
}

const quickSuggestions = [
  { id: "q1", title: "AI-powered task manager", category: "Productivity", createdAt: new Date().toISOString() },
  { id: "q2", title: "Social media for developers", category: "Social", createdAt: new Date().toISOString() },
  { id: "q3", title: "Keyboard shortcuts for navigation", category: "DevEx", createdAt: new Date().toISOString() },
  { id: "q4", title: "E-commerce platform for local businesses", category: "E-commerce", createdAt: new Date().toISOString() },
  { id: "q5", title: "Mobile app for fitness tracking", category: "Health", createdAt: new Date().toISOString() },
  { id: "q6", title: "Real-time collaboration tool", category: "Productivity", createdAt: new Date().toISOString() }
];

export default function Ideas() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("generator");

  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedIdeas = (data || []).map((idea: any) => ({
        id: idea.id,
        title: idea.title,
        description: idea.description,
        category: idea.category,
        status: idea.status,
        priority: idea.priority,
        createdAt: idea.created_at
      }));

      setIdeas(formattedIdeas);
    } catch (error: any) {
      toast({
        title: "Error loading ideas",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addIdea = async () => {
    if (!title.trim() || !category) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('ideas')
        .insert({
          user_id: user.id,
          title: title.trim(),
          category,
          status: 'concept',
          priority: 'medium'
        });

      if (error) throw error;

      await loadIdeas();
      setTitle("");
      setCategory("");
      toast({
        title: "Idea added",
        description: "Your idea has been saved successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error adding idea",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addQuickSuggestions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newIdeas = quickSuggestions.map(s => ({
        user_id: user.id,
        title: s.title,
        category: s.category,
        status: 'concept' as const,
        priority: 'medium' as const
      }));

      const { error } = await supabase
        .from('ideas')
        .insert(newIdeas);

      if (error) throw error;

      await loadIdeas();
      toast({
        title: "Suggestions added",
        description: "All quick suggestions have been added to your ideas.",
      });
    } catch (error: any) {
      toast({
        title: "Error adding suggestions",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredIdeas = useMemo(() => {
    return ideas.filter((idea) => {
      const matchesSearch = idea.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === "all" || idea.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [ideas, searchQuery, filterCategory]);

  const categories = [...new Set(ideas.map((i) => i.category))];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-hidden">
      <div className="w-full max-w-none px-4 md:px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Idea Generator</h1>
            <p className="text-muted-foreground mt-1">
              Transform your ideas into comprehensive development plans with AI-powered organization
            </p>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Generator
            </TabsTrigger>
            <TabsTrigger value="ideas" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              My Ideas
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Templates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="space-y-6">
            <IdeaGenerator />
          </TabsContent>

          <TabsContent value="ideas" className="space-y-6">
            {/* Quick Add Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  Quick Add Idea
                </CardTitle>
                <CardDescription>
                  Quickly add ideas to your collection for later development
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="idea-title">Idea Title</Label>
                    <Input
                      id="idea-title"
                      placeholder="Enter your idea..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addIdea();
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="idea-category">Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Productivity">Productivity</SelectItem>
                        <SelectItem value="Social">Social</SelectItem>
                        <SelectItem value="E-commerce">E-commerce</SelectItem>
                        <SelectItem value="Health">Health</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Entertainment">Entertainment</SelectItem>
                        <SelectItem value="DevEx">Developer Experience</SelectItem>
                        <SelectItem value="AI/ML">AI/ML</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-end">
                    <Button onClick={addIdea} disabled={!title.trim() || !category} className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Idea
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Quick Suggestions
                </CardTitle>
                <CardDescription>
                  Popular app ideas to get you started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {quickSuggestions.map((suggestion) => (
                    <Card key={suggestion.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-foreground">{suggestion.title}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {suggestion.category}
                          </Badge>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setTitle(suggestion.title);
                            setCategory(suggestion.category);
                            setActiveTab("generator");
                          }}
                          className="w-full mt-2"
                        >
                          <Sparkles className="mr-2 h-3 w-3" />
                          Generate Plan
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline" onClick={addQuickSuggestions} className="w-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Add All Suggestions to My Ideas
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Ideas List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      My Ideas ({ideas.length})
                    </CardTitle>
                    <CardDescription>
                      Your collection of app ideas and concepts
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search ideas..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Ideas Grid */}
                {filteredIdeas.length === 0 ? (
                  <div className="text-center py-12">
                    <Lightbulb className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No ideas yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start by adding your first idea or use the AI generator to create comprehensive plans
                    </p>
                    <Button onClick={() => setActiveTab("generator")}>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Use AI Generator
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredIdeas.map((idea) => (
                      <Card key={idea.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-foreground">{idea.title}</h4>
                            <Badge variant="secondary" className="text-xs">
                              {idea.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {new Date(idea.createdAt).toLocaleDateString()}
                          </p>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                setTitle(idea.title);
                                setCategory(idea.category);
                                setActiveTab("generator");
                              }}
                              className="flex-1"
                            >
                              <Sparkles className="mr-2 h-3 w-3" />
                              Generate Plan
                            </Button>
                            <Button variant="ghost" size="sm">
                              <TrendingUp className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  App Templates
                </CardTitle>
                <CardDescription>
                  Pre-built templates for common app types to jumpstart your development
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: "E-commerce Platform",
                      description: "Complete online store with payment processing, inventory management, and customer analytics",
                      category: "E-commerce",
                      features: ["Payment Integration", "Inventory Management", "Customer Analytics", "Order Processing"],
                      techStack: ["React", "Node.js", "Stripe", "PostgreSQL"]
                    },
                    {
                      title: "Social Media App",
                      description: "Social networking platform with real-time messaging, content sharing, and user profiles",
                      category: "Social",
                      features: ["Real-time Chat", "Content Sharing", "User Profiles", "Notifications"],
                      techStack: ["React Native", "Firebase", "Socket.io", "MongoDB"]
                    },
                    {
                      title: "Task Management Tool",
                      description: "Project management application with task tracking, team collaboration, and progress analytics",
                      category: "Productivity",
                      features: ["Task Tracking", "Team Collaboration", "Progress Analytics", "File Sharing"],
                      techStack: ["React", "Express", "PostgreSQL", "Redis"]
                    },
                    {
                      title: "Fitness Tracking App",
                      description: "Health and fitness application with workout tracking, nutrition logging, and progress visualization",
                      category: "Health",
                      features: ["Workout Tracking", "Nutrition Logging", "Progress Charts", "Goal Setting"],
                      techStack: ["React Native", "Node.js", "MongoDB", "Chart.js"]
                    },
                    {
                      title: "Learning Management System",
                      description: "Educational platform with course creation, student management, and progress tracking",
                      category: "Education",
                      features: ["Course Creation", "Student Management", "Progress Tracking", "Video Streaming"],
                      techStack: ["Next.js", "Django", "PostgreSQL", "AWS S3"]
                    },
                    {
                      title: "AI Chat Application",
                      description: "Intelligent chatbot application with natural language processing and conversation management",
                      category: "AI/ML",
                      features: ["Natural Language Processing", "Conversation History", "Multi-language Support", "Analytics"],
                      techStack: ["React", "Python", "OpenAI API", "FastAPI"]
                    }
                  ].map((template, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="font-semibold text-lg">{template.title}</h3>
                          <Badge variant="secondary">{template.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                        
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Key Features:</h4>
                            <div className="flex flex-wrap gap-1">
                              {template.features.map((feature) => (
                                <Badge key={feature} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-medium mb-2">Tech Stack:</h4>
                            <div className="flex flex-wrap gap-1">
                              {template.techStack.map((tech) => (
                                <Badge key={tech} variant="secondary" className="text-xs">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <Button 
                          className="w-full mt-4"
                          onClick={() => {
                            setTitle(template.title);
                            setCategory(template.category);
                            setActiveTab("generator");
                          }}
                        >
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Custom Plan
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
