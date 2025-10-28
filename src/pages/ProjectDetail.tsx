import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StepPlanningPanel } from "@/components/StepPlanningPanel";
import { LearningLog } from "@/components/LearningLog";
import { CodeAnalysisPanel } from "@/components/CodeAnalysisPanel";
import { AIAnalysisPanel } from "@/components/AIAnalysisPanel";
import { RealTimeCollaboration } from "@/components/RealTimeCollaboration";
import { EnhancedProjectMetrics } from "@/components/EnhancedProjectMetrics";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Target,
  Users,
  GitBranch,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

const statusConfig = {
  planning: { color: 'bg-warning text-white', label: 'Planning' },
  'in-progress': { color: 'bg-primary text-white', label: 'In Progress' },
  active: { color: 'bg-primary text-white', label: 'Active' },
  review: { color: 'bg-accent text-white', label: 'Review' },
  completed: { color: 'bg-success text-white', label: 'Completed' }
};

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<any>(null);
  const [steps, setSteps] = useState<any[]>([]);
  const [learnings, setLearnings] = useState<any[]>([]);
  const [codeIssues, setCodeIssues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProjectData();
  }, [id]);

  const loadProjectData = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      // Load project
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (projectError) throw projectError;

      if (!projectData) {
        navigate('/projects');
        return;
      }

      const anyData = projectData as any;
      setProject({
        id: anyData.id,
        title: anyData.title,
        description: anyData.description || '',
        progress: anyData.progress || 0,
        status: anyData.status || 'active',
        dueDate: anyData.due_date || '',
        category: anyData.category || '',
        priority: anyData.priority || 'medium',
        technologies: anyData.technologies || [],
        team: anyData.team || [],
        budget: anyData.budget || '',
        timeSpent: anyData.time_spent || '',
        estimatedCompletion: anyData.estimated_completion || '',
        stepsCompleted: 0,
        totalSteps: 0,
      });

      // Load steps
      const { data: stepsData } = await supabase
        .from('steps')
        .select('*')
        .eq('project_id', id)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      setSteps(stepsData || []);

      // Load learnings
      const { data: learningsData } = await supabase
        .from('learnings')
        .select('*')
        .eq('project_id', id)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setLearnings(learningsData || []);

      // Load code issues
      const { data: issuesData } = await supabase
        .from('code_issues')
        .select('*')
        .eq('project_id', id)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setCodeIssues(issuesData || []);
    } catch (error: any) {
      toast.error(error.message || "Error loading project data");
      navigate('/projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLearning = async (learning: any) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('learnings')
        .insert({
          ...learning,
          project_id: id,
          user_id: user.id,
        });

      if (error) throw error;
      await loadProjectData();
      toast.success("Learning added successfully");
    } catch (error: any) {
      toast.error(error.message || "Error adding learning");
    }
  };

  const refreshCodeAnalysis = async () => {
    await loadProjectData();
  };

  const viewFile = (file: string) => {
    console.log('View file:', file);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return null;
  }

  const status = statusConfig[project.status] || statusConfig.active;

  return (
    <div className="w-full overflow-x-hidden">
      <div className="w-full max-w-none px-4 md:px-6 py-6 space-y-6">{/* Fixed container */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/projects')}
          className="shrink-0"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground truncate">
            {project.title}
          </h1>
          <p className="text-muted-foreground mt-1">
            {project.description}
          </p>
        </div>
      </div>

      {/* Project Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <Target className="h-4 w-4 text-primary" />
              <Badge className={status.color}>{status.label}</Badge>
            </div>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-foreground">{project.progress}%</div>
              <Progress value={project.progress} className="h-2" />
              <div className="text-xs text-muted-foreground">
                {project.stepsCompleted}/{project.totalSteps} steps completed
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-warning" />
              <span className="text-sm font-medium text-foreground">Timeline</span>
            </div>
            <div className="text-lg font-bold text-foreground">{project.estimatedCompletion}</div>
            <div className="text-xs text-muted-foreground">Due: {project.dueDate}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-foreground">Time Spent</span>
            </div>
            <div className="text-lg font-bold text-foreground">{project.timeSpent}</div>
            <div className="text-xs text-muted-foreground">Budget: {project.budget}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Team</span>
            </div>
            <div className="text-lg font-bold text-foreground">{project.team.length}</div>
            <div className="text-xs text-muted-foreground">
              {project.team.slice(0, 2).join(', ')}
              {project.team.length > 2 && ` +${project.team.length - 2}`}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technologies */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <GitBranch className="h-4 w-4 text-primary" />
            <span className="font-medium text-foreground">Technologies</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="secondary" className="bg-primary/10 text-primary">
                {tech}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="planning" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="planning">Planning</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="collaboration">Team</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          <TabsTrigger value="learnings">Learnings</TabsTrigger>
          <TabsTrigger value="analysis">Code Quality</TabsTrigger>
        </TabsList>

        <TabsContent value="planning">
          <StepPlanningPanel
            projectId={project.id}
            steps={steps}
            onStepsChange={loadProjectData}
          />
        </TabsContent>

        <TabsContent value="metrics">
          <EnhancedProjectMetrics projectId={project.id} />
        </TabsContent>

        <TabsContent value="collaboration">
          <RealTimeCollaboration projectId={project.id} />
        </TabsContent>

        <TabsContent value="ai-insights">
          <AIAnalysisPanel 
            projectId={project.id}
            onInsightApplied={(insight) => {
              // console.log('Applied insight to project:', insight);
            }}
          />
        </TabsContent>

        <TabsContent value="learnings">
          <LearningLog 
            learnings={learnings} 
            onAddLearning={handleAddLearning}
          />
        </TabsContent>

        <TabsContent value="analysis">
          <CodeAnalysisPanel
            issues={codeIssues}
            onRefresh={refreshCodeAnalysis}
            onViewFile={viewFile}
          />
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};

export default ProjectDetail;
