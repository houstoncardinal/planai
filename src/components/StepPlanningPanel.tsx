import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Target, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  BarChart3,
  Filter,
  Search,
  Calendar,
  ArrowUpDown,
  Eye,
  EyeOff
} from "lucide-react";
import { StepCard } from "@/components/StepCard";
import { StepCreationWizard } from "@/components/StepCreationWizard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { Step, StepFormData } from "@/types";

interface StepPlanningPanelProps {
  projectId: string;
  steps: Step[];
  onStepsChange?: (steps: Step[]) => void;
}

export function StepPlanningPanel({ projectId, steps: initialSteps, onStepsChange }: StepPlanningPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [sortBy, setSortBy] = useState("created");
  const [viewMode, setViewMode] = useState("expanded");
  const [steps, setSteps] = useState<Step[]>(initialSteps);
  const [project, setProject] = useState<any>(null);

  useEffect(() => {
    setSteps(initialSteps);
  }, [initialSteps]);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .eq('user_id', user.id)
        .single();

      if (data) {
        setProject(data);
      }
    } catch (error) {
      console.error('Error loading project:', error);
    }
  };

  const handleAddStep = async (stepData: StepFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in to add steps");
        return;
      }

      const { data, error } = await supabase
        .from('steps')
        .insert({
          title: stepData.title,
          description: stepData.description || '',
          completed: false,
          notes: stepData.notes || '',
          learnings: stepData.learnings || [],
          impact: stepData.impact || [],
          project_id: projectId,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newStep: Step = {
          id: data.id,
          title: data.title,
          description: data.description || '',
          completed: data.completed,
          notes: data.notes || '',
          learnings: data.learnings || [],
          impact: data.impact || [],
          projectId: data.project_id,
          createdAt: data.created_at,
          priority: stepData.priority || 'medium',
          status: 'not_started',
          estimatedHours: stepData.estimatedHours || 0,
        };

        setSteps(prev => [...prev, newStep]);
        toast.success(`"${stepData.title}" has been added to your project.`);
        
        if (onStepsChange) {
          onStepsChange([...steps, newStep]);
        }
      }
    } catch (error: any) {
      console.error('Error adding step:', error);
      toast.error(error.message || "Failed to add step");
    }
  };

  const handleUpdateStep = async (stepId: string, updates: Partial<Step>) => {
    try {
      const { error } = await supabase
        .from('steps')
        .update({
          title: updates.title,
          description: updates.description,
          notes: updates.notes,
          learnings: updates.learnings,
          impact: updates.impact,
        })
        .eq('id', stepId);

      if (error) throw error;

      setSteps(prev => prev.map(step => 
        step.id === stepId ? { ...step, ...updates } : step
      ));

      if (onStepsChange) {
        const updatedSteps = steps.map(step => 
          step.id === stepId ? { ...step, ...updates } : step
        );
        onStepsChange(updatedSteps);
      }
      
      toast.success("Step updated successfully");
    } catch (error: any) {
      console.error('Error updating step:', error);
      toast.error(error.message || "Failed to update step");
    }
  };

  const handleToggleCompletion = async (stepId: string) => {
    try {
      const step = steps.find(s => s.id === stepId);
      if (!step) return;

      const newCompletedState = !step.completed;

      const { error } = await supabase
        .from('steps')
        .update({
          completed: newCompletedState,
          completed_at: newCompletedState ? new Date().toISOString() : null,
        })
        .eq('id', stepId);

      if (error) throw error;

      setSteps(prev => prev.map(s => 
        s.id === stepId 
          ? { ...s, completed: newCompletedState, completedAt: newCompletedState ? new Date().toISOString() : undefined }
          : s
      ));

      toast.success(
        newCompletedState 
          ? `"${step.title}" marked as complete! 🎉`
          : `"${step.title}" reopened`
      );

      if (onStepsChange) {
        const updatedSteps = steps.map(s => 
          s.id === stepId 
            ? { ...s, completed: newCompletedState, completedAt: newCompletedState ? new Date().toISOString() : undefined }
            : s
        );
        onStepsChange(updatedSteps);
      }
    } catch (error: any) {
      console.error('Error toggling step completion:', error);
      toast.error(error.message || "Failed to update step");
    }
  };

  // Filter and sort steps
  const filteredSteps = steps
    .filter(step => {
      const matchesSearch = step.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (step.description || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === "all" || 
                           (filterStatus === "completed" && step.completed) ||
                           (filterStatus === "active" && !step.completed && step.status === "in_progress") ||
                           (filterStatus === "pending" && !step.completed && step.status !== "in_progress");
      const matchesPriority = filterPriority === "all" || step.priority === filterPriority;
      
      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "priority":
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) - 
                 (priorityOrder[a.priority as keyof typeof priorityOrder] || 0);
        case "created":
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  // Calculate statistics
  const totalSteps = steps.length;
  const completedSteps = steps.filter(s => s.completed).length;
  const activeSteps = steps.filter(s => !s.completed && s.status === "in_progress").length;
  const blockedSteps = steps.filter(s => s.status === "blocked").length;
  const totalEstimatedHours = steps.reduce((sum, step) => sum + (step.estimatedHours || 0), 0);
  const completedHours = steps
    .filter(s => s.completed)
    .reduce((sum, step) => sum + (step.estimatedHours || 0), 0);

  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <Card className="bg-gradient-to-br from-card/95 via-card to-card/90 backdrop-blur-sm border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <Target className="h-5 w-5 text-primary" />
                </div>
                Project Planning
              </CardTitle>
              <p className="text-muted-foreground">
                {project?.title} - Strategic step-by-step execution plan
              </p>
            </div>
            <StepCreationWizard onAddStep={handleAddStep} projectTitle={project?.title} />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Progress</p>
                  <p className="text-xl font-semibold text-primary">{Math.round(progressPercentage)}%</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-success/10 to-success/5 rounded-lg border border-success/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-xl font-semibold text-success">{completedSteps}/{totalSteps}</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-lg border border-blue-500/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-xl font-semibold text-blue-500">{activeSteps}</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-500/5 rounded-lg border border-orange-500/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Est. Hours</p>
                  <p className="text-xl font-semibold text-orange-500">{completedHours}/{totalEstimatedHours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Overall Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">Project Progress</span>
              <span className="text-muted-foreground">{completedSteps} of {totalSteps} steps completed</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search steps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background/95 backdrop-blur-sm border shadow-xl z-50">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background/95 backdrop-blur-sm border shadow-xl z-50">
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background/95 backdrop-blur-sm border shadow-xl z-50">
                  <SelectItem value="created">Date Created</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === "expanded" ? "compact" : "expanded")}
              >
                {viewMode === "expanded" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Steps List */}
      <div className="space-y-4">
        {filteredSteps.length === 0 ? (
          <Card className="border-dashed border-2 border-muted-foreground/25">
            <CardContent className="flex items-center justify-center h-48 text-center">
              <div className="space-y-3">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto">
                  <Target className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">No steps found</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {steps.length === 0 
                      ? "Create your first step to start planning" 
                      : "Try adjusting your search or filters"}
                  </p>
                </div>
                {steps.length === 0 && (
                  <StepCreationWizard onAddStep={handleAddStep} projectTitle={project?.title} />
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {filteredSteps.map((step, index) => (
              <StepCard
                key={step.id}
                step={step}
                index={index}
                onUpdate={(updates) => handleUpdateStep(step.id, updates)}
                onToggleCompletion={() => handleToggleCompletion(step.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
