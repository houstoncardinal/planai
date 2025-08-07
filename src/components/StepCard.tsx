import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  GripVertical, 
  Check, 
  Clock, 
  AlertCircle, 
  Target, 
  Plus, 
  X,
  Calendar,
  User,
  Tag,
  FileText,
  ChevronDown,
  ChevronRight,
  Lightbulb,
  TrendingUp
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StepCardProps {
  step: any;
  index: number;
  onUpdate: (updates: any) => void;
  onToggleCompletion: () => void;
  onDelete?: () => void;
  isDragging?: boolean;
}

const priorityColors = {
  low: "bg-blue-100 text-blue-800 border-blue-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200", 
  high: "bg-red-100 text-red-800 border-red-200",
  critical: "bg-purple-100 text-purple-800 border-purple-200"
};

const statusConfig = {
  not_started: { label: "Not Started", color: "bg-gray-100 text-gray-800", icon: Clock },
  in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-800", icon: Target },
  blocked: { label: "Blocked", color: "bg-red-100 text-red-800", icon: AlertCircle },
  completed: { label: "Completed", color: "bg-green-100 text-green-800", icon: Check }
};

export function StepCard({ step, index, onUpdate, onToggleCompletion, onDelete, isDragging }: StepCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newSubtask, setNewSubtask] = useState("");
  const [newLearning, setNewLearning] = useState("");

  const status = statusConfig[step.status as keyof typeof statusConfig] || statusConfig.not_started;
  const StatusIcon = status.icon;

  const addSubtask = () => {
    if (newSubtask.trim()) {
      onUpdate({
        subtasks: [...(step.subtasks || []), {
          id: Date.now().toString(),
          title: newSubtask,
          completed: false
        }]
      });
      setNewSubtask("");
    }
  };

  const toggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = (step.subtasks || []).map((st: any) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    onUpdate({ subtasks: updatedSubtasks });
  };

  const addLearning = () => {
    if (newLearning.trim()) {
      onUpdate({
        learnings: [...(step.learnings || []), {
          id: Date.now().toString(),
          content: newLearning,
          date: new Date().toISOString()
        }]
      });
      setNewLearning("");
    }
  };

  const completedSubtasks = (step.subtasks || []).filter((st: any) => st.completed).length;
  const totalSubtasks = (step.subtasks || []).length;
  const progressPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  return (
    <Card className={`group transition-all duration-300 hover:shadow-lg ${
      isDragging ? 'rotate-2 scale-105 shadow-2xl' : ''
    } ${step.completed ? 'bg-success/5 border-success/20' : 'hover:border-primary/30'} relative overflow-hidden`}>
      {/* Gradient overlay for visual appeal */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/2 via-transparent to-accent/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <CardContent className="p-6 relative z-10">
        <div className="flex items-start gap-4">
          {/* Drag Handle */}
          <div className="flex flex-col items-center gap-2 pt-1">
            <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab group-hover:text-primary transition-colors" />
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
              {index + 1}
            </div>
          </div>

          <div className="flex-1 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                {isEditing ? (
                  <Input
                    value={step.title}
                    onChange={(e) => onUpdate({ title: e.target.value })}
                    onBlur={() => setIsEditing(false)}
                    onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
                    className="font-semibold text-lg"
                    autoFocus
                  />
                ) : (
                  <h3 
                    className={`font-semibold text-lg cursor-pointer transition-colors ${
                      step.completed ? 'line-through text-muted-foreground' : 'text-foreground hover:text-primary'
                    }`}
                    onClick={() => setIsEditing(true)}
                  >
                    {step.title}
                  </h3>
                )}
                
                {/* Status and Priority Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className={status.color}>
                    <StatusIcon className="mr-1 h-3 w-3" />
                    {status.label}
                  </Badge>
                  
                  {step.priority && (
                    <Badge variant="outline" className={priorityColors[step.priority as keyof typeof priorityColors]}>
                      <AlertCircle className="mr-1 h-3 w-3" />
                      {step.priority} priority
                    </Badge>
                  )}
                  
                  {step.estimatedHours && (
                    <Badge variant="outline" className="bg-gray-50 text-gray-600">
                      <Clock className="mr-1 h-3 w-3" />
                      {step.estimatedHours}h
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  checked={step.completed}
                  onCheckedChange={onToggleCompletion}
                  className="data-[state=checked]:bg-success data-[state=checked]:border-success"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="hover:bg-primary/10 transition-colors"
                >
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Progress Bar for Subtasks */}
            {totalSubtasks > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtasks Progress</span>
                  <span className="font-medium">{completedSubtasks}/{totalSubtasks}</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            )}

            {/* Description (always visible) */}
            {step.description && (
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            )}

            {/* Expanded Content */}
            {isExpanded && (
              <div className="space-y-6 pt-4 border-t border-border/50 animate-fade-in">
                {/* Quick Edits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Description</label>
                    <Textarea
                      placeholder="Describe this step in detail..."
                      value={step.description || ""}
                      onChange={(e) => onUpdate({ description: e.target.value })}
                      className="min-h-[80px] resize-none"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Priority</label>
                      <Select value={step.priority || "medium"} onValueChange={(value) => onUpdate({ priority: value })}>
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
                      <label className="text-sm font-medium text-foreground">Estimated Hours</label>
                      <Input
                        type="number"
                        placeholder="Hours"
                        value={step.estimatedHours || ""}
                        onChange={(e) => onUpdate({ estimatedHours: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Subtasks */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    <h4 className="font-medium text-foreground">Subtasks</h4>
                  </div>
                  
                  <div className="space-y-2">
                    {(step.subtasks || []).map((subtask: any) => (
                      <div key={subtask.id} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                        <Checkbox
                          checked={subtask.completed}
                          onCheckedChange={() => toggleSubtask(subtask.id)}
                          className="data-[state=checked]:bg-success data-[state=checked]:border-success"
                        />
                        <span className={`flex-1 text-sm ${subtask.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {subtask.title}
                        </span>
                      </div>
                    ))}
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add subtask..."
                        value={newSubtask}
                        onChange={(e) => setNewSubtask(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addSubtask()}
                        className="flex-1"
                      />
                      <Button onClick={addSubtask} size="sm" variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Notes Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <h4 className="font-medium text-foreground">Notes & Approach</h4>
                  </div>
                  <Textarea
                    placeholder="Implementation notes, approach, considerations..."
                    value={step.notes || ""}
                    onChange={(e) => onUpdate({ notes: e.target.value })}
                    className="min-h-[100px] resize-none"
                  />
                </div>

                {/* Learnings */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    <h4 className="font-medium text-foreground">Key Learnings</h4>
                  </div>
                  
                  <div className="space-y-2">
                    {(step.learnings || []).map((learning: any) => (
                      <div key={learning.id} className="p-3 bg-accent/20 border border-accent/30 rounded-lg">
                        <p className="text-sm text-foreground">{learning.content}</p>
                      </div>
                    ))}
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder="What did you learn from this step?"
                        value={newLearning}
                        onChange={(e) => setNewLearning(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addLearning()}
                        className="flex-1"
                      />
                      <Button onClick={addLearning} size="sm" variant="outline">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}