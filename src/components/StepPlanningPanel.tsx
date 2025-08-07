import { useState } from "react";
import { useAppStore } from "@/stores/appStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, GripVertical, Check, X, ArrowRight, Lightbulb } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface StepPlanningPanelProps {
  projectId: string;
  steps: any[];
  onStepsChange?: (steps: any[]) => void; // Optional for backward compatibility
}

export function StepPlanningPanel({ projectId, steps }: StepPlanningPanelProps) {
  const [newStepTitle, setNewStepTitle] = useState("");
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const { addStep, updateStep, toggleStepCompletion } = useAppStore();
  const { toast } = useToast();

  const handleAddStep = () => {
    if (!newStepTitle.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a step title.",
        variant: "destructive"
      });
      return;
    }
    
    addStep(projectId, {
      title: newStepTitle,
      description: "",
      completed: false,
      notes: "",
      learnings: [],
      impact: []
    });
    
    setNewStepTitle("");
    
    toast({
      title: "Step Added",
      description: `"${newStepTitle}" has been added to your project.`,
    });
  };

  const handleUpdateStep = (stepId: string, updates: any) => {
    updateStep(projectId, stepId, updates);
  };

  const handleToggleCompletion = (stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    toggleStepCompletion(projectId, stepId);
    
    if (step) {
      toast({
        title: step.completed ? "Step Reopened" : "Step Completed!",
        description: `"${step.title}" has been ${step.completed ? 'reopened' : 'marked as complete'}.`,
      });
    }
  };

  const addLearning = (stepId: string, learning: string) => {
    const step = steps.find(s => s.id === stepId);
    if (step && learning.trim()) {
      handleUpdateStep(stepId, { learnings: [...step.learnings, learning] });
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-primary" />
            Step-by-Step Planning
          </CardTitle>
          <CardDescription>
            Break down your project into manageable steps and track progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Add new step */}
            <div className="flex gap-2">
              <Input
                placeholder="Add new step..."
                value={newStepTitle}
                onChange={(e) => setNewStepTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddStep()}
                className="flex-1"
              />
              <Button onClick={handleAddStep} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Steps list */}
            <div className="space-y-3">
              {steps.map((step, index) => (
                <Card key={step.id} className={`transition-all ${step.completed ? 'bg-success/5 border-success/20' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center gap-2 mt-1">
                        <GripVertical className="h-4 w-4 text-muted-foreground" />
                        <Checkbox
                          checked={step.completed}
                          onCheckedChange={() => handleToggleCompletion(step.id)}
                        />
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className={`font-medium ${step.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                            {index + 1}. {step.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            {step.completed && (
                              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                                <Check className="mr-1 h-3 w-3" />
                                Completed
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                            >
                              {expandedStep === step.id ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>
                        
                        {expandedStep === step.id && (
                          <div className="space-y-3 pt-2 border-t border-border/50">
                            <Textarea
                              placeholder="Add description..."
                              value={step.description}
                              onChange={(e) => handleUpdateStep(step.id, { description: e.target.value })}
                              className="min-h-[80px]"
                            />
                            
                            <Textarea
                              placeholder="Notes and approach..."
                              value={step.notes}
                              onChange={(e) => handleUpdateStep(step.id, { notes: e.target.value })}
                              className="min-h-[60px]"
                            />
                            
                            {step.learnings.length > 0 && (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                  <Lightbulb className="h-4 w-4" />
                                  Learnings
                                </div>
                                <div className="space-y-1">
                                  {step.learnings.map((learning, idx) => (
                                    <div key={idx} className="text-sm text-muted-foreground bg-accent/30 p-2 rounded">
                                      {learning}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}