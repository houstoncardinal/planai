import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ProjectCard } from "@/components/ProjectCard";
import { StepPlanningPanel } from "@/components/StepPlanningPanel";
import { LearningLog } from "@/components/LearningLog";
import { CodeAnalysisPanel } from "@/components/CodeAnalysisPanel";
import { Plus, Search, Target, TrendingUp, BookOpen, Code } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data - in a real app, this would come from a database
const mockProjects = [
  {
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
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe']
  },
  {
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
    technologies: ['React Native', 'Firebase', 'Redux']
  },
  {
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
    technologies: ['React', 'Tailwind', 'Framer Motion']
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

const mockLearnings = [
  {
    id: '1',
    title: 'TypeScript generics mastery',
    content: 'Finally understood how to use TypeScript generics effectively for reusable components. The key was starting simple and building up complexity.',
    type: 'insight' as const,
    date: '2 days ago',
    tags: ['typescript', 'components'],
    relatedStep: '1'
  },
  {
    id: '2',
    title: 'Authentication flow complexity',
    content: 'Underestimated the complexity of handling token refresh and logout scenarios. Need to plan auth state management more carefully.',
    type: 'failure' as const,
    date: '1 day ago',
    tags: ['auth', 'state-management'],
    relatedStep: '3'
  }
];

const mockCodeIssues = [
  {
    id: '1',
    file: 'src/components/UserDashboard.tsx',
    lines: 285,
    type: 'length' as const,
    severity: 'medium' as const,
    description: 'Component is getting large and handles multiple responsibilities',
    suggestion: 'Split into smaller components: UserProfile, UserStats, and UserActions'
  },
  {
    id: '2',
    file: 'src/utils/validation.ts',
    lines: 95,
    type: 'duplicate' as const,
    severity: 'low' as const,
    description: 'Similar validation patterns repeated in multiple functions',
    suggestion: 'Create a generic validation factory function to reduce duplication'
  }
];

const Index = () => {
  console.log('Index component rendering...');
  
  const navigate = useNavigate();
  const [projects, setProjects] = useState(mockProjects);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [steps, setSteps] = useState(mockSteps);
  const [learnings, setLearnings] = useState(mockLearnings);
  const [codeIssues, setCodeIssues] = useState(mockCodeIssues);

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewProject = (id: string) => {
    navigate(`/projects/${id}`);
  };

  const handleEditProject = (id: string) => {
    console.log('Edit project:', id);
  };

  const handleNewProject = () => {
    navigate('/projects');
  };

  const addLearning = (learning: any) => {
    const newLearning = {
      ...learning,
      id: Date.now().toString(),
      date: 'Just now'
    };
    setLearnings([newLearning, ...learnings]);
  };

  const refreshCodeAnalysis = () => {
    console.log('Refreshing code analysis...');
    // In a real app, this would run actual code analysis
  };

  const viewFile = (file: string) => {
    console.log('View file:', file);
    // In a real app, this would open the file in an editor
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              App Planner
            </h1>
            <p className="text-muted-foreground mt-1">
              Track ideas, plan development, and learn from your journey
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
              <TrendingUp className="mr-1 h-3 w-3" />
              {projects.filter(p => p.status === 'completed').length} Completed
            </Badge>
            <Button 
              className="bg-gradient-to-r from-primary to-primary-glow text-white"
              onClick={handleNewProject}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>

        {/* Search and Quick Stats */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              {projects.filter(p => p.status === 'in-progress').length} Active
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              {learnings.length} Learnings
            </div>
            <div className="flex items-center gap-1">
              <Code className="h-4 w-4" />
              {codeIssues.length} Code Issues
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
                  steps={steps}
                  onStepsChange={setSteps}
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
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onView={handleViewProject}
                onEdit={handleEditProject}
              />
            ))}
            
            {/* Add New Project Card */}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;