import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ProjectCard } from "@/components/ProjectCard";
import { StepPlanningPanel } from "@/components/StepPlanningPanel";
import { LearningLog } from "@/components/LearningLog";
import { CodeAnalysisPanel } from "@/components/CodeAnalysisPanel";
import { HelpCenter, TutorialTooltip, useTutorial } from "@/components/TutorialSystem";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Plus, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Target,
  Sparkles,
  Bot,
  Code,
  Users,
  Calendar,
  ArrowRight,
  Lightbulb,
  BookOpen,
  Zap
} from "lucide-react";
import { useAppStore } from "@/stores/appStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type { Learning, Project, CodeIssue } from "@/types";

// Mock data for enhanced dashboard
const mockProjects: Project[] = [
  {
    id: "1",
    title: "E-commerce Platform",
    description: "Modern e-commerce platform with React and Node.js",
    category: "Web Development",
    priority: "high",
    dueDate: "2024-03-15",
    technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
    team: ["John Doe", "Jane Smith", "Mike Johnson"],
    budget: "$25,000",
    timeSpent: "120 hours",
    estimatedCompletion: "8 weeks",
    progress: 65,
    status: "in-progress",
    stepsCompleted: 13,
    totalSteps: 20,
    createdAt: "2024-01-15T10:00:00Z",
    lastUpdated: "2024-02-20T14:30:00Z"
  },
  {
    id: "2",
    title: "Mobile Fitness App",
    description: "Cross-platform fitness tracking application",
    category: "Mobile Development",
    priority: "medium",
    dueDate: "2024-04-01",
    technologies: ["React Native", "Firebase", "Expo"],
    team: ["Sarah Wilson", "Alex Brown"],
    budget: "$15,000",
    timeSpent: "80 hours",
    estimatedCompletion: "6 weeks",
    progress: 40,
    status: "planning",
    stepsCompleted: 8,
    totalSteps: 20,
    createdAt: "2024-02-01T09:00:00Z",
    lastUpdated: "2024-02-18T16:45:00Z"
  },
  {
    id: "3",
    title: "AI Chat Assistant",
    description: "Intelligent chatbot with natural language processing",
    category: "AI/ML",
    priority: "high",
    dueDate: "2024-03-30",
    technologies: ["Python", "TensorFlow", "FastAPI", "OpenAI"],
    team: ["David Chen", "Emily Davis", "Tom Wilson"],
    budget: "$30,000",
    timeSpent: "150 hours",
    estimatedCompletion: "10 weeks",
    progress: 85,
    status: "review",
    stepsCompleted: 17,
    totalSteps: 20,
    createdAt: "2024-01-10T11:00:00Z",
    lastUpdated: "2024-02-19T10:20:00Z"
  }
];

const mockSteps = [
  {
    id: '1',
    title: 'Set up project structure',
    description: 'Initialize React app with TypeScript and essential dependencies',
    completed: true,
    notes: 'Used Vite for faster development. Added ESLint and Prettier.',
    learnings: ['Vite is much faster than Create React App', 'TypeScript setup was smoother than expected'],
    impact: ['Faster development cycle', 'Better code quality from start']
  },
  {
    id: '2',
    title: 'Design component architecture',
    description: 'Plan reusable components and state management approach',
    completed: true,
    notes: 'Decided on atomic design principles with Zustand for state',
    learnings: ['Atomic design scales well', 'Zustand simpler than Redux for this project'],
    impact: ['Consistent UI patterns', 'Easier testing and maintenance']
  },
  {
    id: '3',
    title: 'Implement authentication',
    description: 'Add user login/signup with JWT tokens',
    completed: false,
    notes: 'Considering Firebase Auth vs custom solution',
    learnings: [],
    impact: []
  }
];

const mockLearnings: Learning[] = [
  {
    id: "1",
    title: "React 18 Concurrent Features",
    content: "Learned about React 18's concurrent features including automatic batching, transitions, and suspense for data fetching. These features significantly improve user experience by making updates feel more responsive.",
    type: "success",
    tags: ["React", "Frontend", "Performance"],
    date: "2 days ago",
    project: "E-commerce Platform",
    projectId: "1"
  },
  {
    id: "2",
    title: "Database Optimization Techniques",
    content: "Discovered several database optimization techniques including proper indexing, query optimization, and connection pooling. This helped reduce query times by 60% in our e-commerce platform.",
    type: "insight",
    tags: ["Database", "Performance", "PostgreSQL"],
    date: "1 week ago",
    project: "E-commerce Platform",
    projectId: "1"
  },
  {
    id: "3",
    title: "Mobile App Performance Issues",
    content: "Encountered performance issues with React Native animations. Learned that using native drivers and optimizing re-renders is crucial for smooth animations on mobile devices.",
    type: "failure",
    tags: ["React Native", "Mobile", "Performance"],
    date: "3 days ago",
    project: "Mobile Fitness App",
    projectId: "2"
  }
];

const mockCodeIssues: CodeIssue[] = [
  {
    id: "1",
    file: "src/components/UserDashboard.tsx",
    lines: 285,
    type: "length",
    severity: "medium",
    description: "Component is getting large and handles multiple responsibilities",
    suggestion: "Split into smaller components: UserProfile, UserStats, and UserActions",
    resolved: false
  },
  {
    id: "2",
    file: "src/utils/validation.ts",
    lines: 95,
    type: "duplicate",
    severity: "low",
    description: "Similar validation patterns repeated in multiple functions",
    suggestion: "Create a generic validation factory function to reduce duplication",
    resolved: false
  },
  {
    id: "3",
    file: "src/hooks/useAuth.ts",
    lines: 150,
    type: "complexity",
    severity: "medium",
    description: "Complex hook with multiple responsibilities and side effects",
    suggestion: "Split into useAuthState and useAuthActions hooks for better separation of concerns",
    resolved: false
  }
];

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { projects, steps, learnings, codeIssues, addProject, updateProject, deleteProject, addLearning } = useAppStore();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Tutorial system
  const { startTutorial } = useTutorial();

  // Use mock data for demonstration
  const allProjects = useMemo(() => [...projects, ...mockProjects], [projects]);
  const allLearnings = useMemo(() => [...learnings, ...mockLearnings], [learnings]);
  const allCodeIssues = useMemo(() => [...codeIssues, ...mockCodeIssues], [codeIssues]);

  const handleViewProject = (id: string) => {
    navigate(`/projects/${id}`);
  };

  const handleEditProject = (id: string) => {
    const project = allProjects.find(p => p.id === id);
    if (project) {
      setEditingProject(project);
      setShowEditDialog(true);
    }
  };

  const handleNewProject = () => {
    navigate('/projects');
  };

  const refreshCodeAnalysis = () => {
    // TODO: Implement actual code analysis refresh
  };

  const viewFile = (file: string) => {
    // TODO: Implement file viewing functionality
  };



  const dashboardStats = {
    totalProjects: allProjects.length,
    activeProjects: allProjects.filter(p => p.status === 'in-progress').length,
    completedProjects: allProjects.filter(p => p.status === 'completed').length,
    totalLearnings: allLearnings.length,
    codeIssues: allCodeIssues.length,
    averageProgress: Math.round(allProjects.reduce((acc, p) => acc + p.progress, 0) / allProjects.length)
  };

  const recentActivity = [
    { id: "1", action: "Project Updated", project: "E-commerce Platform", time: "2 hours ago", icon: <TrendingUp className="h-4 w-4" /> },
    { id: "2", action: "Learning Added", project: "Mobile Fitness App", time: "4 hours ago", icon: <BookOpen className="h-4 w-4" /> },
    { id: "3", action: "Code Analysis", project: "AI Chat Assistant", time: "6 hours ago", icon: <Code className="h-4 w-4" /> },
    { id: "4", action: "Goal Completed", project: "General", time: "1 day ago", icon: <CheckCircle className="h-4 w-4" /> }
  ];

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
        {selectedProject ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => setSelectedProject(null)}>
                ← Back to Projects
              </Button>
              <h2 className="text-2xl font-semibold">
                {projects.find(p => p.id === selectedProject)?.title}
              </h2>
            </div>
            
            <Tabs defaultValue="planning" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="planning">Planning</TabsTrigger>
                <TabsTrigger value="learnings">Learnings</TabsTrigger>
                <TabsTrigger value="analysis">Code Analysis</TabsTrigger>
              </TabsList>
              
              <TabsContent value="planning">
                <StepPlanningPanel
                  projectId={selectedProject}
                  steps={steps[selectedProject] || []}
                  onStepsChange={() => {}}
                />
              </TabsContent>
              
              <TabsContent value="learnings">
                <LearningLog learnings={learnings} onAddLearning={addLearning} />
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
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {allProjects.map((project) => (
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
          </div>
        )}
      </div>

      {/* Edit Project Dialog */}
      {editingProject && (
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
              <DialogDescription>
                Update your project details and settings.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Project Name</label>
                <Input
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="mt-1"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700">Description</label>
                <Input
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Category</label>
                  <select
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full mt-1 border border-slate-200 rounded-md px-3 py-2"
                  >
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile Development">Mobile Development</option>
                    <option value="AI/ML">AI/ML</option>
                    <option value="Backend Development">Backend Development</option>
                    <option value="Frontend Development">Frontend Development</option>
                    <option value="Full Stack">Full Stack</option>
                    <option value="DevOps">DevOps</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700">Priority</label>
                  <select
                    value={editingProject.priority}
                    onChange={(e) => setEditingProject({ ...editingProject, priority: e.target.value as any })}
                    className="w-full mt-1 border border-slate-200 rounded-md px-3 py-2"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Status</label>
                  <select
                    value={editingProject.status}
                    onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as any })}
                    className="w-full mt-1 border border-slate-200 rounded-md px-3 py-2"
                  >
                    <option value="planning">Planning</option>
                    <option value="in-progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                    <option value="paused">Paused</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700">Progress (%)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={editingProject.progress}
                    onChange={(e) => setEditingProject({ ...editingProject, progress: parseInt(e.target.value) || 0 })}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700">Due Date</label>
                <Input
                  type="date"
                  value={editingProject.dueDate}
                  onChange={(e) => setEditingProject({ ...editingProject, dueDate: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="flex justify-between pt-4">
              <Button 
                variant="destructive" 
                onClick={() => {
                  if (confirm('Are you sure you want to delete this project?')) {
                    deleteProject(editingProject.id);
                    setShowEditDialog(false);
                    setEditingProject(null);
                    toast({
                      title: "Project Deleted",
                      description: "Project has been deleted successfully!",
                    });
                  }
                }}
              >
                Delete Project
              </Button>
              
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => {
                  setShowEditDialog(false);
                  setEditingProject(null);
                }}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  updateProject(editingProject.id, editingProject);
                  setShowEditDialog(false);
                  setEditingProject(null);
                  toast({
                    title: "Project Updated",
                    description: "Project has been updated successfully!",
                  });
                }}>
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Index;