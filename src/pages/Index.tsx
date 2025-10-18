import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/ProjectCard";
import { HelpCenter, TutorialTooltip, useTutorial } from "@/components/TutorialSystem";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Project } from "@/types";
import { Loader2 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Tutorial system
  const { startTutorial } = useTutorial();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error("Auth error:", userError);
        navigate('/auth');
        return;
      }

      if (!user) {
        console.log("No user found, redirecting to auth");
        navigate('/auth');
        return;
      }

      console.log("Loading projects for user:", user.id);

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Projects fetch error:", error);
        throw error;
      }
      
      console.log("Loaded projects:", data?.length || 0);
      
      // Format data to match UI expectations
      const formattedData = (data || []).map(p => ({
        id: p.id,
        title: p.title,
        description: p.description || '',
        progress: p.progress || 0,
        status: p.status as any,
        dueDate: p.due_date || '',
        stepsCompleted: 0, // Will be calculated from steps table
        totalSteps: 0, // Will be calculated from steps table
        lastUpdated: new Date(p.updated_at).toLocaleDateString(),
        category: p.category || '',
        priority: p.priority as any,
        technologies: p.technologies || [],
        team: p.team || [],
        budget: p.budget || '',
        timeSpent: p.time_spent || '',
        estimatedCompletion: p.estimated_completion || '',
        createdAt: p.created_at
      }));
      
      setProjects(formattedData);
    } catch (error: any) {
      console.error("Error in loadProjects:", error);
      toast({
        title: "Error loading projects",
        description: error.message || "Failed to load projects. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewProject = (id: string) => {
    navigate(`/projects/${id}`);
  };

  const handleEditProject = (id: string) => {
    navigate(`/projects/${id}`);
  };

  const handleNewProject = () => {
    navigate('/projects');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 overflow-x-hidden w-full">
      <div className="w-full max-w-none px-4 md:px-6 py-6 space-y-6">
        {/* Header */}
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between">
            {/* Title Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-primary to-primary/60 rounded-full"></div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-foreground">
                  App Planner
                </h1>
              </div>
              <p className="text-sm md:text-base text-muted-foreground font-medium pl-7">
                Strategic development planning & execution tracking
              </p>
            </div>
            
            {/* Actions Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
              {/* Stats Badge */}
              <div className="flex items-center gap-2 px-3 py-2 bg-background/80 border border-border/60 rounded-lg">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-muted-foreground">
                  {projects.filter(p => p.status === 'completed').length} Projects Completed
                </span>
              </div>
              
              {/* New Project Button */}
              <Button 
                onClick={handleNewProject}
                className="h-11 px-6 bg-foreground text-background hover:bg-foreground/90 font-medium shadow-sm transition-all duration-200 hover:shadow-md"
                size="default"
              >
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <TutorialTooltip 
              key={project.id} 
              content={`View details and manage ${project.title}`}
            >
              <ProjectCard
                key={project.id}
                project={project}
                onView={handleViewProject}
                onEdit={handleEditProject}
              />
            </TutorialTooltip>
          ))}
          
          {/* Add New Project Card */}
          <TutorialTooltip content="Start planning your next project">
            <Card 
              className="border-dashed border-2 border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer group"
              onClick={handleNewProject}
            >
              <CardContent className="flex items-center justify-center h-48">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto group-hover:bg-primary/20 transition-colors">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium text-foreground">New Project</h3>
                  <p className="text-sm text-muted-foreground">Start planning your next idea</p>
                </div>
              </CardContent>
            </Card>
          </TutorialTooltip>

          {projects.length === 0 && (
            <div className="col-span-full text-center py-12">
              <h3 className="text-lg font-medium text-foreground mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first project to get started
              </p>
            </div>
          )}
        </div>
      </div>

      <HelpCenter />
    </div>
  );
};

export default Index;
