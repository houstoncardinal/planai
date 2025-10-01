import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Search, 
  Grid3X3, 
  List, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Copy, 
  Clock, 
  Folder, 
  Smartphone,
  Monitor,
  Palette,
  Database,
  Globe,
  Heart,
  SortAsc, 
  SortDesc,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  status: 'active' | 'archived' | 'completed' | 'draft';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  progress: number;
  createdAt: string;
  lastModified: string;
  tags: string[];
  team: string[];
  isFavorite: boolean;
  thumbnail?: string;
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
  const [showProjectDetails, setShowProjectDetails] = useState<Project | null>(null);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    category: 'web',
    priority: 'medium' as const,
    tags: [] as string[],
  });

  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Load projects from Supabase
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedProjects = (data || []).map((project: any) => ({
        id: project.id,
        name: project.title,
        description: project.description || '',
        category: project.category || 'web',
        status: project.status || 'active',
        priority: project.priority || 'medium',
        progress: project.progress || 0,
        createdAt: project.created_at,
        lastModified: project.updated_at,
        tags: project.technologies || [],
        team: project.team || [],
        isFavorite: false,
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

  // Filter and sort projects
  useEffect(() => {
    let filtered = projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort projects
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'date':
          aValue = new Date(a.lastModified);
          bValue = new Date(b.lastModified);
          break;
        case 'progress':
          aValue = a.progress;
          bValue = b.progress;
          break;
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority as keyof typeof priorityOrder];
          bValue = priorityOrder[b.priority as keyof typeof priorityOrder];
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
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
    { id: 'all', name: 'All Projects', icon: Folder, count: projects.length },
    { id: 'web', name: 'Web Apps', icon: Globe, count: projects.filter(p => p.category === 'web').length },
    { id: 'mobile', name: 'Mobile Apps', icon: Smartphone, count: projects.filter(p => p.category === 'mobile').length },
    { id: 'desktop', name: 'Desktop Apps', icon: Monitor, count: projects.filter(p => p.category === 'desktop').length },
    { id: 'ui', name: 'UI/UX Design', icon: Palette, count: projects.filter(p => p.category === 'ui').length },
    { id: 'api', name: 'API/Backend', icon: Database, count: projects.filter(p => p.category === 'api').length },
  ];

  const statuses = [
    { id: 'all', name: 'All Status', count: projects.length },
    { id: 'active', name: 'Active', count: projects.filter(p => p.status === 'active').length },
    { id: 'completed', name: 'Completed', count: projects.filter(p => p.status === 'completed').length },
    { id: 'archived', name: 'Archived', count: projects.filter(p => p.status === 'archived').length },
    { id: 'draft', name: 'Draft', count: projects.filter(p => p.status === 'draft').length },
  ];

  const createProject = async () => {
    if (!newProject.name.trim()) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('projects')
        .insert({
          title: newProject.name,
          description: newProject.description,
          category: newProject.category,
          status: 'active',
          priority: newProject.priority,
          progress: 0,
          technologies: newProject.tags,
          team: [],
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      await loadProjects();
      
      setNewProject({ name: '', description: '', category: 'web', priority: 'medium', tags: [] });
      setShowCreateDialog(false);
      
      toast({
        title: "Project Created",
        description: `Project "${newProject.name}" has been created successfully!`,
      });
    } catch (error: any) {
      toast({
        title: "Error creating project",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateProject = async (projectId: string, updates: Partial<Project>) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          title: updates.name,
          description: updates.description,
          category: updates.category,
          status: updates.status,
          priority: updates.priority,
          progress: updates.progress,
        })
        .eq('id', projectId);

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
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

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

  const toggleFavorite = (projectId: string) => {
    updateProject(projectId, { isFavorite: !projects.find(p => p.id === projectId)?.isFavorite });
  };

  const duplicateProject = (project: Project) => {
    const duplicatedProject: Project = {
      ...project,
      id: Date.now().toString(),
      name: `${project.name} (Copy)`,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      isFavorite: false,
    };

    const updatedProjects = [...projects, duplicatedProject];
    setProjects(updatedProjects);
    localStorage.setItem('devtracker_projects', JSON.stringify(updatedProjects));
    
    toast({
      title: "Project Duplicated",
      description: `Project "${duplicatedProject.name}" has been created!`,
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'archived': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'draft': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'web': return Globe;
      case 'mobile': return Smartphone;
      case 'desktop': return Monitor;
      case 'ui': return Palette;
      case 'api': return Database;
      default: return Folder;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-600 mt-1">Manage and organize your development projects</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="h-10 px-3"
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
          </Button>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="h-10 px-6 bg-black hover:bg-slate-800"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="h-10 px-3"
              >
                <category.icon className="h-4 w-4 mr-2" />
                {category.name}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Status and Sort */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
          <div className="flex gap-2">
            {statuses.map((status) => (
              <Button
                key={status.id}
                variant={selectedStatus === status.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(status.id)}
                className="h-8 px-3"
              >
                {status.name}
                <Badge variant="secondary" className="ml-2 text-xs">
                  {status.count}
                </Badge>
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-slate-200 rounded-md px-3 py-1 text-sm"
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
              className="h-8 w-8 p-0"
            >
              {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Projects Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}>
        {filteredProjects.map((project) => (
          <Card
            key={project.id}
            className={`group cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
              project.isFavorite ? 'ring-2 ring-yellow-400' : ''
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                                     <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                     {(() => {
                       const IconComponent = getCategoryIcon(project.category);
                       return <IconComponent className="h-5 w-5 text-slate-600" />;
                     })()}
                   </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold text-slate-900 truncate">
                      {project.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-slate-600 truncate">
                      {project.description || 'No description'}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(project.id);
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <Heart className={`h-4 w-4 ${project.isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingProject(project);
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4 text-slate-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowProjectDetails(project);
                    }}
                    className="h-8 w-8 p-0"
                  >
                    <MoreVertical className="h-4 w-4 text-slate-400" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-slate-600">Progress</span>
                  <span className="font-medium">{project.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              {/* Tags and Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge className={getPriorityColor(project.priority)}>
                  {project.priority}
                </Badge>
                <Badge className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
                {project.tags.slice(0, 2).map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {project.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{project.tags.length - 2}
                  </Badge>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock className="h-3 w-3" />
                  {new Date(project.lastModified).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateProject(project);
                    }}
                    className="h-8 px-3 text-xs"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
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

      {/* Create Project Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Set up a new development project with all the details you need.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Project Name</label>
              <Input
                placeholder="Enter project name..."
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700">Description</label>
              <Input
                placeholder="Brief description of your project..."
                value={newProject.description}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                className="mt-1"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Category</label>
                <select
                  value={newProject.category}
                  onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                  className="w-full mt-1 border border-slate-200 rounded-md px-3 py-2"
                >
                  <option value="web">Web App</option>
                  <option value="mobile">Mobile App</option>
                  <option value="desktop">Desktop App</option>
                  <option value="ui">UI/UX Design</option>
                  <option value="api">API/Backend</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700">Priority</label>
                <select
                  value={newProject.priority}
                  onChange={(e) => setNewProject({ ...newProject, priority: e.target.value as any })}
                  className="w-full mt-1 border border-slate-200 rounded-md px-3 py-2"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700">Tags (comma-separated)</label>
              <Input
                placeholder="react, typescript, tailwind..."
                value={newProject.tags.join(', ')}
                onChange={(e) => setNewProject({ 
                  ...newProject, 
                  tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                })}
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={createProject}>
              Create Project
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      {editingProject && (
        <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
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
                  value={editingProject.name}
                  onChange={(e) => setEditingProject({ ...editingProject, name: e.target.value })}
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
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">Category</label>
                  <select
                    value={editingProject.category}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full mt-1 border border-slate-200 rounded-md px-3 py-2"
                  >
                    <option value="web">Web App</option>
                    <option value="mobile">Mobile App</option>
                    <option value="desktop">Desktop App</option>
                    <option value="ui">UI/UX Design</option>
                    <option value="api">API/Backend</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-slate-700">Status</label>
                  <select
                    value={editingProject.status}
                    onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as any })}
                    className="w-full mt-1 border border-slate-200 rounded-md px-3 py-2"
                  >
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                    <option value="draft">Draft</option>
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
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
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
              
              <div>
                <label className="text-sm font-medium text-slate-700">Tags (comma-separated)</label>
                <Input
                  value={editingProject.tags.join(', ')}
                  onChange={(e) => setEditingProject({ 
                    ...editingProject, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
                  })}
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
                    setEditingProject(null);
                  }
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Project
              </Button>
              
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setEditingProject(null)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  updateProject(editingProject.id, editingProject);
                  setEditingProject(null);
                }}>
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Project Details Dialog */}
      {showProjectDetails && (
        <Dialog open={!!showProjectDetails} onOpenChange={() => setShowProjectDetails(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
                             <DialogTitle className="flex items-center gap-3">
                 {(() => {
                   const IconComponent = getCategoryIcon(showProjectDetails.category);
                   return <IconComponent className="h-6 w-6" />;
                 })()}
                 {showProjectDetails.name}
               </DialogTitle>
              <DialogDescription>
                {showProjectDetails.description}
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Project Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Status:</span>
                        <Badge className={getStatusColor(showProjectDetails.status)}>
                          {showProjectDetails.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Priority:</span>
                        <Badge className={getPriorityColor(showProjectDetails.priority)}>
                          {showProjectDetails.priority}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Progress:</span>
                        <span className="font-medium">{showProjectDetails.progress}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Created:</span>
                        <span>{new Date(showProjectDetails.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Modified:</span>
                        <span>{new Date(showProjectDetails.lastModified).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {showProjectDetails.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                        {showProjectDetails.tags.length === 0 && (
                          <span className="text-slate-500 text-sm">No tags</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Project Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">Favorite</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(showProjectDetails.id)}
                        >
                          <Heart className={`h-4 w-4 ${showProjectDetails.isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="actions" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      duplicateProject(showProjectDetails);
                      setShowProjectDetails(null);
                    }}
                    className="h-12"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate Project
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this project?')) {
                        deleteProject(showProjectDetails.id);
                        setShowProjectDetails(null);
                      }
                    }}
                    className="h-12"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Project
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Projects;