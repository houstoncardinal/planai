import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/stores/appStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  Plus, 
  X, 
  Calendar, 
  Sparkles, 
  Target, 
  Users, 
  Code, 
  DollarSign, 
  Clock,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Zap,
  Globe,
  Smartphone,
  Brain,
  Monitor,
  Server,
  Database,
  GamepadIcon,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { validateProjectData, sanitizeString, type ProjectInput } from "@/lib/validation";

interface ProjectFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

interface FormData {
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  technologies: string[];
  team: string[];
  budget: string;
  timeSpent: string;
  estimatedCompletion: string;
  accountEmail: string;
  accountPlatform: string;
  projectUrl: string;
  accountNotes: string;
}

const categoryIcons = {
  'Web Development': Globe,
  'Mobile Development': Smartphone,
  'AI/ML': Brain,
  'Desktop App': Monitor,
  'API/Backend': Server,
  'DevOps': Zap,
  'Data Science': BarChart3,
  'Game Development': GamepadIcon,
};

const priorityColors = {
  low: 'bg-green-100 text-green-700 border-green-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  high: 'bg-red-100 text-red-700 border-red-200',
};

export function ProjectForm({ onCancel, onSuccess }: ProjectFormProps) {
  const navigate = useNavigate();
  const { addProject } = useAppStore();
  const { toast } = useToast();
  
  const [newTech, setNewTech] = useState("");
  const [newTeamMember, setNewTeamMember] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    category: "",
    priority: "medium",
    dueDate: "",
    technologies: [],
    team: ["You"],
    budget: "",
    timeSpent: "",
    estimatedCompletion: "",
    accountEmail: "",
    accountPlatform: "lovable",
    projectUrl: "",
    accountNotes: ""
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Sanitize and validate input data
      const sanitizedData = {
        ...formData,
        title: sanitizeString(formData.title),
        description: sanitizeString(formData.description),
        technologies: formData.technologies.map(sanitizeString),
        team: formData.team.map(sanitizeString),
        budget: sanitizeString(formData.budget),
        timeSpent: sanitizeString(formData.timeSpent),
        estimatedCompletion: sanitizeString(formData.estimatedCompletion)
      };

      // Validate the data
      const validatedData = validateProjectData(sanitizedData);
      
      // Add the project with required properties
      addProject({
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
        priority: validatedData.priority,
        dueDate: validatedData.dueDate || '',
        technologies: validatedData.technologies,
        team: validatedData.team,
        budget: validatedData.budget || '',
        timeSpent: validatedData.timeSpent || '',
        estimatedCompletion: validatedData.estimatedCompletion || '',
        progress: 0,
        status: 'planning',
        stepsCompleted: 0,
        totalSteps: 0
      });
      
      toast({
        title: "🎉 Project Created!",
        description: "Your new project has been successfully created and is ready to go!",
      });
      
      onSuccess();
      
      // Navigate to the new project after a brief delay
      setTimeout(() => {
        navigate('/projects');
      }, 500);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create project';
      toast({
        title: "❌ Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const addTechnology = () => {
    const sanitizedTech = sanitizeString(newTech);
    if (sanitizedTech && !formData.technologies.includes(sanitizedTech)) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, sanitizedTech]
      }));
      setNewTech('');
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const addTeamMember = () => {
    const sanitizedMember = sanitizeString(newTeamMember);
    if (sanitizedMember && !formData.team.includes(sanitizedMember)) {
      setFormData(prev => ({
        ...prev,
        team: [...prev.team, sanitizedMember]
      }));
      setNewTeamMember('');
    }
  };

  const removeTeamMember = (member: string) => {
    if (member !== 'You') { // Prevent removing yourself
      setFormData(prev => ({
        ...prev,
        team: prev.team.filter(m => m !== member)
      }));
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Project Basics</h3>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="title" className="text-sm font-medium">Project Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter project title..."
                  className="h-10"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="description" className="text-sm font-medium">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of your project..."
                  className="min-h-[80px] resize-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="category" className="text-sm font-medium">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  required
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Choose category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryIcons).map(([category, Icon]) => (
                      <SelectItem key={category} value={category}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {category}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-blue-500/20 to-blue-500/10 rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold">Project Details</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="priority" className="text-sm font-medium">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value: 'low' | 'medium' | 'high') => 
                    setFormData(prev => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="dueDate" className="text-sm font-medium">Due Date</Label>
                <div className="relative">
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="h-10"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="budget" className="text-sm font-medium">Budget</Label>
                <div className="relative">
                  <Input
                    id="budget"
                    value={formData.budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
                    placeholder="$10,000"
                    className="h-10 pl-8"
                  />
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="estimatedCompletion" className="text-sm font-medium">Timeline</Label>
                <div className="relative">
                  <Input
                    id="estimatedCompletion"
                    value={formData.estimatedCompletion}
                    onChange={(e) => setFormData(prev => ({ ...prev, estimatedCompletion: e.target.value }))}
                    placeholder="4 weeks"
                    className="h-10 pl-8"
                  />
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-xl flex items-center justify-center">
                <Code className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="text-lg font-semibold">Technologies & Team</h3>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-sm font-medium">Technologies</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    placeholder="Add technology..."
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                    className="h-10"
                  />
                  <Button type="button" onClick={addTechnology} variant="outline" size="sm" className="h-10 px-3">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formData.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary" className="bg-primary/10 text-primary text-xs px-2 py-1">
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechnology(tech)}
                          className="ml-1 hover:text-destructive transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="space-y-1">
                <Label className="text-sm font-medium">Team Members</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTeamMember}
                    onChange={(e) => setNewTeamMember(e.target.value)}
                    placeholder="Add team member..."
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTeamMember())}
                    className="h-10"
                  />
                  <Button type="button" onClick={addTeamMember} variant="outline" size="sm" className="h-10 px-3">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                {formData.team.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formData.team.map((member) => (
                      <Badge key={member} variant="outline" className="text-xs px-2 py-1">
                        {member}
                        {member !== 'You' && (
                          <button
                            type="button"
                            onClick={() => removeTeamMember(member)}
                            className="ml-1 hover:text-destructive transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-gradient-to-br from-orange-500/20 to-orange-500/10 rounded-xl flex items-center justify-center">
                <Globe className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold">Account Tracking</h3>
              <p className="text-xs text-muted-foreground">Track which platform/account this project lives in</p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="accountPlatform" className="text-sm font-medium">Platform</Label>
                <Select
                  value={formData.accountPlatform}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, accountPlatform: value }))}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lovable">Lovable</SelectItem>
                    <SelectItem value="github">GitHub</SelectItem>
                    <SelectItem value="vercel">Vercel</SelectItem>
                    <SelectItem value="netlify">Netlify</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="accountEmail" className="text-sm font-medium">Account Email</Label>
                <Input
                  id="accountEmail"
                  type="email"
                  value={formData.accountEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, accountEmail: e.target.value }))}
                  placeholder="account@example.com"
                  className="h-10"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="projectUrl" className="text-sm font-medium">Project URL</Label>
                <Input
                  id="projectUrl"
                  type="url"
                  value={formData.projectUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, projectUrl: e.target.value }))}
                  placeholder="https://..."
                  className="h-10"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="accountNotes" className="text-sm font-medium">Notes</Label>
                <Textarea
                  id="accountNotes"
                  value={formData.accountNotes}
                  onChange={(e) => setFormData(prev => ({ ...prev, accountNotes: e.target.value }))}
                  placeholder="Any notes about this project location..."
                  className="min-h-[60px] resize-none"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto h-[600px] flex flex-col">
      {/* Header */}
      <div className="text-center mb-4">
        <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-1">Create New Project</h2>
        <p className="text-sm text-muted-foreground">Let's build something amazing together</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium">Step {currentStep} of {totalSteps}</span>
          <span className="text-xs text-muted-foreground">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      {/* Form Content */}
      <div className="flex-1 flex flex-col">
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          <div className="flex-1">
            {renderStep()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 border-t mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={currentStep === 1 ? onCancel : prevStep}
              className="px-4"
            >
              {currentStep === 1 ? 'Cancel' : 'Previous'}
            </Button>
            
            <div className="flex gap-2">
              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="px-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="px-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Create Project
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}