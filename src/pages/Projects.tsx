import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Search, 
  Grid3X3, 
  List, 
  Edit, 
  Trash2, 
  Copy, 
  Clock, 
  Folder,
  SortAsc, 
  SortDesc,
  Loader2,
  DollarSign,
  Users,
  Calendar,
  X,
  UserPlus,
  UserMinus,
  Timer
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ProjectCard } from "@/components/ProjectCard";
import type { Project } from "@/types";

interface DatabaseProject {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  priority: string;
  progress: number;
  created_at: string;
  updated_at: string;
  technologies: string[];
  team: string[];
  user_id: string;
  due_date?: string;
  budget?: string;
  time_spent?: string;
  estimated_completion?: string;
  steps_completed?: number;
  total_steps?: number;
  payment_method?: string;
  time_tracking?: Record<string, number>;
}

interface TimeEntry {
  user: string;
  hours: number;
}

interface EnhancedProjectForm {
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'planning' | 'in-progress' | 'active' | 'review' | 'completed' | 'archived' | 'draft';
  dueDate: string;
  budget: string;
  paymentMethod: string;
  technologies: string[];
  team: string[];
  estimatedCompletion: string;
  timeTracking: TimeEntry[];
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'progress' | 'priority'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState<EnhancedProjectForm>({
    title: '',
    description: '',
    category: 'Web Development',
    priority: 'medium',
    status: 'planning',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    budget: '$0',
    paymentMethod: 'Not Set',
    technologies: [],
    team: [],
    estimatedCompletion: '2 weeks',
    timeTracking: [],
  });
  const [newTech, setNewTech] = useState('');
  const [newTeamMember, setNewTeamMember] = useState('');
  const [newTimeUser, setNewTimeUser] = useState('');
  const [newTimeHours, setNewTimeHours] = useState('');

  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedProjects: Project[] = (data || []).map((project: DatabaseProject) => ({
        id: project.id,
        title: project.title,
        description: project.description || '',
        category: project.category || 'Web Development',
        status: (project.status || 'planning') as Project['status'],
        priority: (project.priority || 'medium') as Project['priority'],
        progress: project.progress || 0,
        createdAt: project.created_at,
        lastUpdated: project.updated_at,
        technologies: project.technologies || [],
        team: project.team || [],
        dueDate: project.due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        budget: project.budget || '$0',
        timeSpent: project.time_spent || '0h',
        estimatedCompletion: project.estimated_completion || '2 weeks',
        stepsCompleted: project.steps_completed || 0,
        totalSteps: project.total_steps || 0,
      }));
      
      setProjects(formattedProjects);
    } catch (error: any) {
      toast({
        title: "Error loading projects",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.lastUpdated);
          bValue = new Date(b.lastUpdated);
          break;
        case 'progress':
          aValue = a.progress;
          bValue = b.progress;
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder];
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder];
          break;
        default:
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredProjects(filtered);
  }, [projects, searchTerm, selectedCategory, selectedStatus, sortBy, sortOrder]);

  const categories = [
    { id: 'all', name: 'All Projects', count: projects.length },
    { id: 'Web Development', name: 'Web Development', count: projects.filter(p => p.category === 'Web Development').length },
    { id: 'Mobile Development', name: 'Mobile Development', count: projects.filter(p => p.category === 'Mobile Development').length },
    { id: 'AI/ML', name: 'AI/ML', count: projects.filter(p => p.category === 'AI/ML').length },
    { id: 'Backend Development', name: 'Backend', count: projects.filter(p => p.category === 'Backend Development').length },
    { id: 'Frontend Development', name: 'Frontend', count: projects.filter(p => p.category === 'Frontend Development').length },
  ];

  const statuses = [
    { id: 'all', name: 'All Status', count: projects.length },
    { id: 'planning', name: 'Planning', count: projects.filter(p => p.status === 'planning').length },
    { id: 'in-progress', name: 'In Progress', count: projects.filter(p => p.status === 'in-progress').length },
    { id: 'review', name: 'Review', count: projects.filter(p => p.status === 'review').length },
    { id: 'completed', name: 'Completed', count: projects.filter(p => p.status === 'completed').length },
  ];

  const createProject = async () => {
    const trimmedTitle = newProject.title.trim();
    const trimmedDescription = newProject.description.trim();
    
    if (!trimmedTitle) {
      toast({
        title: "Error",
        description: "Project title is required",
        variant: "destructive",
      });
      return;
    }

    if (trimmedTitle.length > 100) {
      toast({
        title: "Error",
        description: "Project title must be less than 100 characters",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create projects",
          variant: "destructive",
        });
        navigate('/auth');
        return;
      }

      const totalHours = newProject.timeTracking.reduce((sum, entry) => sum + entry.hours, 0);
      const timeSpent = `${totalHours}h`;

      const insertData: any = {
        title: trimmedTitle,
        description: trimmedDescription,
        category: newProject.category,
        status: newProject.status,
        priority: newProject.priority,
        progress: 0,
        technologies: newProject.technologies,
        team: newProject.team,
        user_id: user.id,
      };

      // Add optional fields if they exist in the schema
      if (newProject.dueDate) insertData.due_date = newProject.dueDate;
      if (newProject.budget) insertData.budget = newProject.budget;
      if (newProject.estimatedCompletion) insertData.estimated_completion = newProject.estimatedCompletion;
      
      // Try to add new fields, but don't fail if they don't exist yet
      try {
        insertData.payment_method = newProject.paymentMethod;
        insertData.time_spent = timeSpent;
        insertData.steps_completed = 0;
        insertData.total_steps = 0;
        insertData.time_tracking = newProject.timeTracking.reduce((acc, entry) => {
          acc[entry.user] = entry.hours;
          return acc;
        }, {} as Record<string, number>);
      } catch (e) {
        // Fields don't exist yet, skip them
      }

      const { data, error } = await supabase
        .from('projects')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      await loadProjects();
      
      setNewProject({
        title: '',
        description: '',
        category: 'Web Development',
        priority: 'medium',
        status: 'planning',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        budget: '$0',
        paymentMethod: 'Not Set',
        technologies: [],
        team: [],
        estimatedCompletion: '2 weeks',
        timeTracking: [],
      });
      setShowCreateDialog(false);
      
      toast({
        title: "Project Created",
        description: `Project "${trimmedTitle}" has been created successfully!`,
      });
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({
        title: "Error creating project",
        description: error.message || "Failed to create project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateProject = async (projectId: string, updates: Partial<Project>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { error} = await (supabase
        .from('projects') as any)
        .update({
          title: updates.title,
          description: updates.description,
          category: updates.category,
          status: updates.status,
          priority: updates.priority,
          progress: updates.progress,
          due_date: updates.dueDate,
          budget: updates.budget,
          estimated_completion: updates.estimatedCompletion,
          technologies: updates.technologies,
          team: updates.team,
        })
        .eq('id', projectId)
        .eq('user_id', user.id);

      if (error) throw error;

      await loadProjects();
      
      toast({
        title: "Project Updated",
        description: "Project has been updated successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error updating project",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('user_id', user.id);

      if (error) throw error;

      await loadProjects();
      
      toast({
        title: "Project Deleted",
        description: "Project has been deleted successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting project",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const duplicateProject = async (project: Project) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { error } = await supabase
        .from('projects')
        .insert({
          title: `${project.title} (Copy)`,
          description: project.description,
          category: project.category,
          status: 'planning',
          priority: project.priority,
          progress: 0,
          technologies: project.technologies,
          team: project.team,
          user_id: user.id,
          due_date: project.dueDate,
          budget: project.budget,
          estimated_completion: project.estimatedCompletion,
        } as any);

      if (error) throw error;

      await loadProjects();
      
      toast({
        title: "Project Duplicated",
        description: `Project "${project.title} (Copy)" has been created!`,
      });
    } catch (error: any) {
      toast({
        title: "Error duplicating project",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleViewProject = (id: string) => {
    navigate(`/project/${id}`);
  };

  const handleEditProject = (id: string) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      setEditingProject(project);
    }
  };

  const addTechnology = () => {
    if (newTech.trim() && !newProject.technologies.includes(newTech.trim())) {
      setNewProject({
        ...newProject,
        technologies: [...newProject.technologies, newTech.trim()]
      });
      setNewTech('');
    }
  };

  const removeTechnology = (tech: string) => {
    setNewProject({
      ...newProject,
      technologies: newProject.technologies.filter(t => t !== tech)
    });
  };

  const addTeamMember = () => {
    if (newTeamMember.trim() && !newProject.team.includes(newTeamMember.trim())) {
      setNewProject({
        ...newProject,
        team: [...newProject.team, newTeamMember.trim()]
      });
      setNewTeamMember('');
    }
  };

  const removeTeamMember = (member: string) => {
    setNewProject({
      ...newProject,
      team: newProject.team.filter(m => m !== member)
    });
  };

  const addTimeEntry = () => {
    if (newTimeUser.trim() && newTimeHours && parseFloat(newTimeHours) > 0) {
      const existingEntry = newProject.timeTracking.find(e => e.user === newTimeUser.trim());
      if (existingEntry) {
        setNewProject({
          ...newProject,
          timeTracking: newProject.timeTracking.map(e =>
            e.user === newTimeUser.trim()
              ? { ...e, hours: e.hours + parseFloat(newTimeHours) }
              : e
          )
        });
      } else {
        setNewProject({
          ...newProject,
          timeTracking: [...newProject.timeTracking, { user: newTimeUser.trim(), hours: parseFloat(newTimeHours) }]
        });
      }
      setNewTimeUser('');
      setNewTimeHours('');
    }
  };

  const removeTimeEntry = (user: string) => {
    setNewProject({
      ...newProject,
      timeTracking: newProject.timeTracking.filter(e => e.user !== user)
    });
  };

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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Projects</h1>
            <p className="text-slate-600 mt-1">Manage and organize your development projects</p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="h-10 px-3"
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
            </Button>
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="h-10 px-4 md:px-6 bg-black hover:bg-slate-800 flex-1 sm:flex-initial"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        <div className="bg-white dark:bg-black/40 dark:border-white/20 rounded-xl border border-slate-200 p-4 md:p-6">
          <div className="flex flex-col gap-4">
            <div className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-white/60" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10 dark:bg-white/5 dark:border-white/20 dark:text-white dark:placeholder:text-white/40"
                />
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <div className="flex gap-2 pb-2 min-w-max">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={`h-9 px-3 whitespace-nowrap flex-shrink-0 ${
                      selectedCategory === category.id 
                        ? "dark:bg-white dark:text-black dark:hover:bg-white" 
                        : "dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                    }`}
                  >
                    <span className={`text-xs ${selectedCategory === category.id ? "dark:text-black" : ""}`}>{category.name}</span>
                    <Badge variant="secondary" className={`ml-1.5 text-xs px-1.5 ${selectedCategory === category.id ? "dark:bg-black/20 dark:text-black" : "dark:bg-white/20 dark:text-white"}`}>
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 pt-4 border-t border-slate-200 dark:border-white/20 gap-3">
            <div className="w-full overflow-x-auto">
              <div className="flex gap-2 pb-1 min-w-max">
                {statuses.map((status) => (
                  <Button
                    key={status.id}
                    variant={selectedStatus === status.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedStatus(status.id)}
                    className={`h-8 px-3 flex-shrink-0 ${
                      selectedStatus === status.id 
                        ? "dark:bg-white dark:text-black dark:hover:bg-white" 
                        : "dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                    }`}
                  >
                    <span className={`text-xs ${selectedStatus === status.id ? "dark:text-black" : ""}`}>{status.name}</span>
                    <Badge variant="secondary" className={`ml-1.5 text-xs px-1.5 ${selectedStatus === status.id ? "dark:bg-black/20 dark:text-black" : "dark:bg-white/20 dark:text-white"}`}>
                      {status.count}
                    </Badge>
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs sm:text-sm text-slate-600 dark:text-white/80 whitespace-nowrap">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="border border-slate-200 dark:border-white/20 dark:bg-white/5 dark:text-white rounded-md px-2 py-1 text-xs sm:text-sm flex-1 sm:flex-initial"
              >
                <option value="name">Name</option>
                <option value="date">Date</option>
                <option value="progress">Progress</option>
                <option value="priority">Priority</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="h-8 w-8 p-0 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
              >
                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onView={handleViewProject}
              onEdit={handleEditProject}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <Folder className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-900 mb-2">No projects found</h3>
            <p className="text-slate-600 mb-6">
              {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all'
                ? "Try adjusting your filters or search terms"
                : "Create your first project to get started"}
            </p>
            {!searchTerm && selectedCategory === 'all' && selectedStatus === 'all' && (
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Project
              </Button>
            )}
          </div>
        )}

        <Dialog open={showCreateDialog || !!editingProject} onOpenChange={(open) => {
          if (!open) {
            setShowCreateDialog(false);
            setEditingProject(null);
          }
        }}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProject ? 'Edit Project' : 'Create New Project'}</DialogTitle>
              <DialogDescription>
                {editingProject ? 'Update your project details' : 'Set up a new development project with comprehensive details'}
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="team">Team & Tech</TabsTrigger>
                <TabsTrigger value="budget">Budget & Time</TabsTrigger>
                <TabsTrigger value="tracking">Time Tracking</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter project title..."
                    value={editingProject ? editingProject.title : newProject.title}
                    onChange={(e) => editingProject 
                      ? setEditingProject({ ...editingProject, title: e.target.value })
                      : setNewProject({ ...newProject, title: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of your project..."
                    value={editingProject ? editingProject.description : newProject.description}
                    onChange={(e) => editingProject
                      ? setEditingProject({ ...editingProject, description: e.target.value })
                      : setNewProject({ ...newProject, description: e.target.value })
                    }
                    className="mt-1"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={editingProject ? editingProject.category : newProject.category}
                      onChange={(e) => editingProject
                        ? setEditingProject({ ...editingProject, category: e.target.value })
                        : setNewProject({ ...newProject, category: e.target.value })
                      }
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
                    <Label htmlFor="priority">Priority</Label>
                    <select
                      id="priority"
                      value={editingProject ? editingProject.priority : newProject.priority}
                      onChange={(e) => editingProject
                        ? setEditingProject({ ...editingProject, priority: e.target.value as any })
                        : setNewProject({ ...newProject, priority: e.target.value as any })
                      }
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
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      value={editingProject ? editingProject.status : newProject.status}
                      onChange={(e) => editingProject
                        ? setEditingProject({ ...editingProject, status: e.target.value as any })
                        : setNewProject({ ...newProject, status: e.target.value as any })
                      }
                      className="w-full mt-1 border border-slate-200 rounded-md px-3 py-2"
                    >
                      <option value="planning">Planning</option>
                      <option value="in-progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={editingProject 
                        ? new Date(editingProject.dueDate).toISOString().split('T')[0]
                        : newProject.dueDate
                      }
                      onChange={(e) => editingProject
                        ? setEditingProject({ ...editingProject, dueDate: e.target.value })
                        : setNewProject({ ...newProject, dueDate: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="estimatedCompletion">Estimated Completion</Label>
                  <Input
                    id="estimatedCompletion"
                    placeholder="e.g., 2 weeks, 1 month"
                    value={editingProject ? editingProject.estimatedCompletion : newProject.estimatedCompletion}
                    onChange={(e) => editingProject
                      ? setEditingProject({ ...editingProject, estimatedCompletion: e.target.value })
                      : setNewProject({ ...newProject, estimatedCompletion: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
              </TabsContent>

              <TabsContent value="team" className="space-y-4 mt-4">
                <div>
                  <Label>Technologies</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      placeholder="Add technology (e.g., React, Node.js)"
                      value={newTech}
                      onChange={(e) => setNewTech(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTechnology()}
                    />
                    <Button type="button" onClick={addTechnology}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newProject.technologies.map((tech, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tech}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeTechnology(tech)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <Label>Team Members</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      placeholder="Add team member name"
                      value={newTeamMember}
                      onChange={(e) => setNewTeamMember(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTeamMember()}
                    />
                    <Button type="button" onClick={addTeamMember}>
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newProject.team.map((member, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {member}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeTeamMember(member)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="budget" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budget">Budget</Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="budget"
                        placeholder="0"
                        value={newProject.budget.replace('$', '')}
                        onChange={(e) => setNewProject({ ...newProject, budget: `$${e.target.value}` })}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <select
                      id="paymentMethod"
                      value={newProject.paymentMethod}
                      onChange={(e) => setNewProject({ ...newProject, paymentMethod: e.target.value })}
                      className="w-full mt-1 border border-slate-200 rounded-md px-3 py-2"
                    >
                      <option value="Not Set">Not Set</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="PayPal">PayPal</option>
                      <option value="Cryptocurrency">Cryptocurrency</option>
                      <option value="Invoice">Invoice</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label>Budget Breakdown</Label>
                  <Card className="mt-2">
                    <CardContent className="pt-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Total Budget:</span>
                          <span className="font-semibold">{newProject.budget}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Payment Method:</span>
                          <span className="font-semibold">{newProject.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Team Size:</span>
                          <span className="font-semibold">{newProject.team.length} members</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="tracking" className="space-y-4 mt-4">
                <div>
                  <Label>Time Tracking (Hours per User)</Label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    <Input
                      placeholder="User name"
                      value={newTimeUser}
                      onChange={(e) => setNewTimeUser(e.target.value)}
                    />
                    <Input
                      type="number"
                      placeholder="Hours"
                      value={newTimeHours}
                      onChange={(e) => setNewTimeHours(e.target.value)}
                      min="0"
                      step="0.5"
                    />
                    <Button type="button" onClick={addTimeEntry}>
                      <Timer className="h-4 w-4 mr-2" />
                      Add
                    </Button>
                  </div>
                </div>

                <div>
                  {newProject.timeTracking.length > 0 ? (
                    <Card>
                      <CardContent className="pt-4">
                        <div className="space-y-2">
                          {newProject.timeTracking.map((entry, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-slate-600" />
                                <span className="font-medium">{entry.user}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{entry.hours}h</Badge>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeTimeEntry(entry.user)}
                                  className="h-6 w-6 p-0"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          <Separator />
                          <div className="flex justify-between items-center pt-2">
                            <span className="font-semibold">Total Hours:</span>
                            <Badge variant="default">
                              {newProject.timeTracking.reduce((sum, entry) => sum + entry.hours, 0)}h
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      <Timer className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No time entries yet</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between pt-4 border-t">
              {editingProject && (
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this project?')) {
                      deleteProject(editingProject.id);
                      setEditingProject(null);
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              )}
              <div className="flex gap-3 ml-auto">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateDialog(false);
                    setEditingProject(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (editingProject) {
                      updateProject(editingProject.id, editingProject);
                      setEditingProject(null);
                    } else {
                      createProject();
                    }
                  }}
                >
                  {editingProject ? 'Save Changes' : 'Create Project'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Projects;
