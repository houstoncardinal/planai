import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppStore } from "@/stores/appStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  CheckCircle, 
  Clock, 
  Target, 
  TrendingUp,
  Users,
  GitBranch,
  Star
} from "lucide-react";

// Enhanced project data with detailed information
const projectsData = {
  '1': {
    id: '1',
    title: 'E-commerce Platform',
    description: 'Building a modern e-commerce solution with React and Node.js',
    progress: 65,
    status: 'in-progress' as const,
    dueDate: 'Dec 15, 2024',
    stepsCompleted: 8,
    totalSteps: 12,
    lastUpdated: '2 hours ago',
    category: 'Web Development',
    priority: 'high',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    team: ['You', 'Sarah Chen', 'Mike Rodriguez'],
    budget: '$45,000',
    timeSpent: '180 hours',
    estimatedCompletion: '3 weeks'
  },
  '2': {
    id: '2',
    title: 'Mobile App MVP',
    description: 'React Native app for task management with offline support',
    progress: 30,
    status: 'planning' as const,
    dueDate: 'Jan 20, 2025',
    stepsCompleted: 3,
    totalSteps: 10,
    lastUpdated: '1 day ago',
    category: 'Mobile Development',
    priority: 'medium',
    technologies: ['React Native', 'Firebase', 'Redux'],
    team: ['You', 'Alex Thompson'],
    budget: '$25,000',
    timeSpent: '45 hours',
    estimatedCompletion: '6 weeks'
  },
  '3': {
    id: '3',
    title: 'Portfolio Website',
    description: 'Personal portfolio built with React and Tailwind CSS',
    progress: 100,
    status: 'completed' as const,
    dueDate: 'Nov 30, 2024',
    stepsCompleted: 6,
    totalSteps: 6,
    lastUpdated: '1 week ago',
    category: 'Web Development',
    priority: 'low',
    technologies: ['React', 'Tailwind', 'Framer Motion'],
    team: ['You'],
    budget: '$5,000',
    timeSpent: '80 hours',
    estimatedCompletion: 'Completed'
  }
};

const mockSteps = {
  '1': [
    {
      id: '1',
      title: 'Set up project architecture',
      description: 'Initialize React app with TypeScript and essential dependencies',
      completed: true,
      notes: 'Used Vite for faster development. Added ESLint and Prettier.',
      learnings: ['Vite is much faster than Create React App', 'TypeScript setup was smoother than expected'],
      impact: ['Faster development cycle', 'Better code quality from start']
    },
    {
      id: '2',
      title: 'Design product catalog system',
      description: 'Create reusable components for product display and filtering',
      completed: true,
      notes: 'Implemented with React Query for caching and state management',
      learnings: ['React Query simplifies server state', 'Component composition patterns'],
      impact: ['Improved performance', 'Better user experience']
    },
    {
      id: '3',
      title: 'Implement shopping cart',
      description: 'Add cart functionality with local storage persistence',
      completed: true,
      notes: 'Used Context API with useReducer for cart state',
      learnings: ['Context API good for app-wide state', 'useReducer for complex state logic'],
      impact: ['Seamless cart experience', 'Data persistence']
    },
    {
      id: '4',
      title: 'Payment integration',
      description: 'Integrate Stripe for secure payment processing',
      completed: false,
      notes: 'Researching best practices for PCI compliance',
      learnings: [],
      impact: []
    }
  ]
};

const statusConfig = {
  planning: { color: 'bg-warning text-white', label: 'Planning' },
  'in-progress': { color: 'bg-primary text-white', label: 'In Progress' },
  review: { color: 'bg-accent text-white', label: 'Review' },
  completed: { color: 'bg-success text-white', label: 'Completed' }
};

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    getProjectById, 
    getStepsByProjectId, 
    getLearningsByProjectId, 
    getCodeIssuesByProjectId,
    addLearning
  } = useAppStore();

  const project = getProjectById(id || '');
  const steps = getStepsByProjectId(id || '');
  const learnings = getLearningsByProjectId(id || '');
  const codeIssues = getCodeIssuesByProjectId(id || '');

  useEffect(() => {
    if (!project) {
      navigate('/projects');
    }
  }, [project, navigate]);

  if (!project) {
    return null;
  }

  const handleAddLearning = (learning: any) => {
    addLearning({
      ...learning,
      project: project.title,
      projectId: project.id
    });
  };

  const status = statusConfig[project.status];

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
        <TabsList className="grid w-full grid-cols-6">
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
            onStepsChange={() => {}} // Steps are managed by the store
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
              console.log('Applied insight to project:', insight);
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
            onRefresh={() => console.log('Refreshing analysis for', project.title)}
            onViewFile={(file) => console.log('Viewing file:', file)}
          />
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};

export default ProjectDetail;