import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  ArrowRight, 
  ArrowLeft, 
  Target, 
  Clock, 
  AlertCircle, 
  Lightbulb,
  Wand2,
  CheckCircle2,
  X
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface StepCreationWizardProps {
  onAddStep: (step: any) => void;
  projectTitle?: string;
}

const stepTemplates = [
  {
    id: "research",
    title: "Research & Planning",
    description: "Gather requirements and plan the approach",
    estimatedHours: "4",
    priority: "high",
    subtasks: [
      "Define requirements",
      "Research best practices", 
      "Create technical specifications",
      "Plan implementation approach"
    ]
  },
  {
    id: "setup",
    title: "Project Setup",
    description: "Initialize project structure and dependencies",
    estimatedHours: "2",
    priority: "medium",
    subtasks: [
      "Initialize repository",
      "Setup development environment",
      "Install dependencies",
      "Configure tools and linting"
    ]
  },
  {
    id: "implementation",
    title: "Core Implementation",
    description: "Build the main functionality",
    estimatedHours: "8",
    priority: "high",
    subtasks: [
      "Create core components",
      "Implement business logic",
      "Add error handling",
      "Write unit tests"
    ]
  },
  {
    id: "testing",
    title: "Testing & QA",
    description: "Comprehensive testing and quality assurance",
    estimatedHours: "3",
    priority: "medium",
    subtasks: [
      "Write integration tests",
      "Perform manual testing",
      "Fix bugs and issues",
      "Validate requirements"
    ]
  }
];

export function StepCreationWizard({ onAddStep, projectTitle }: StepCreationWizardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    estimatedHours: "",
    notes: "",
    subtasks: [] as string[]
  });

  const wizardSteps = [
    { title: "Basic Info", icon: Target },
    { title: "Details", icon: AlertCircle },
    { title: "Subtasks", icon: CheckCircle2 },
    { title: "Review", icon: Lightbulb }
  ];

  const resetForm = () => {
    setCurrentStep(0);
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      estimatedHours: "",
      notes: "",
      subtasks: []
    });
  };

  const handleTemplateSelect = (template: any) => {
    setFormData({
      title: template.title,
      description: template.description,
      priority: template.priority,
      estimatedHours: template.estimatedHours,
      notes: "",
      subtasks: template.subtasks
    });
    setCurrentStep(3); // Jump to review
  };

  const addSubtask = (subtask: string) => {
    if (subtask.trim() && !formData.subtasks.includes(subtask)) {
      setFormData(prev => ({
        ...prev,
        subtasks: [...prev.subtasks, subtask]
      }));
    }
  };

  const removeSubtask = (index: number) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    const step = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      estimatedHours: formData.estimatedHours,
      notes: formData.notes,
      status: "not_started",
      completed: false,
      subtasks: formData.subtasks.map((title, index) => ({
        id: `${Date.now()}-${index}`,
        title,
        completed: false
      })),
      learnings: [],
      createdAt: new Date().toISOString()
    };
    
    onAddStep(step);
    setIsOpen(false);
    resetForm();
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.title.trim().length > 0;
      case 1:
        return formData.description.trim().length > 0;
      case 2:
        return true; // Subtasks are optional
      case 3:
        return true; // Review step
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Step Title</label>
              <Input
                placeholder="What needs to be done?"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="text-lg"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background/95 backdrop-blur-sm border shadow-xl z-50">
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Estimated Hours</label>
                <Input
                  type="number"
                  placeholder="Hours"
                  value={formData.estimatedHours}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedHours: e.target.value }))}
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Describe what this step involves..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="min-h-[100px] resize-none"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes & Approach</label>
              <Textarea
                placeholder="Implementation notes, considerations, approach..."
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="min-h-[80px] resize-none"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Subtasks (Optional)</label>
              <p className="text-xs text-muted-foreground">Break this step into smaller actionable items</p>
            </div>
            
            <div className="space-y-2">
              {formData.subtasks.map((subtask, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                  <span className="flex-1 text-sm">{subtask}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSubtask(index)}
                    className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              
              <Input
                placeholder="Add a subtask..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    addSubtask(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">{formData.title}</h3>
              <p className="text-muted-foreground text-sm mb-3">{formData.description}</p>
              
              <div className="flex items-center gap-4 text-sm">
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {formData.priority} priority
                </Badge>
                {formData.estimatedHours && (
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {formData.estimatedHours}h estimated
                  </span>
                )}
              </div>
              
              {formData.subtasks.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium mb-2">Subtasks ({formData.subtasks.length})</p>
                  <div className="space-y-1">
                    {formData.subtasks.map((subtask, index) => (
                      <div key={index} className="text-xs text-muted-foreground">
                        • {subtask}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-primary to-primary/80 text-white hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300">
          <Plus className="mr-2 h-4 w-4" />
          Add Step
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl bg-background/95 backdrop-blur-sm border border-border/50 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Wand2 className="h-5 w-5 text-primary" />
            Create New Step
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Templates */}
          {currentStep === 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-muted-foreground">Quick Templates</h4>
              <div className="grid grid-cols-2 gap-2">
                {stepTemplates.map((template) => (
                  <Button
                    key={template.id}
                    variant="outline"
                    className="p-3 h-auto text-left justify-start hover:bg-primary/5 hover:border-primary/30"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div>
                      <div className="font-medium text-sm">{template.title}</div>
                      <div className="text-xs text-muted-foreground mt-1">{template.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/30" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or create custom</span>
                </div>
              </div>
            </div>
          )}

          {/* Progress Indicator */}
          <div className="flex items-center justify-between">
            {wizardSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div key={index} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all ${
                    isActive 
                      ? 'border-primary bg-primary text-white' 
                      : isCompleted 
                      ? 'border-success bg-success text-white'
                      : 'border-muted-foreground/30 text-muted-foreground'
                  }`}>
                    <StepIcon className="h-4 w-4" />
                  </div>
                  <span className={`ml-2 text-sm ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                    {step.title}
                  </span>
                  {index < wizardSteps.length - 1 && (
                    <ArrowRight className="mx-4 h-4 w-4 text-muted-foreground/50" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Step Content */}
          <div className="min-h-[300px]">
            {renderStepContent()}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-border/30">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            
            <div className="flex items-center gap-2">
              {currentStep < wizardSteps.length - 1 ? (
                <Button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!canProceed()}
                  className="bg-primary hover:bg-primary/90"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed()}
                  className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Create Step
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}