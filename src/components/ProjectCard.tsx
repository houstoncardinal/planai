import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Clock, 
  Users, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Play,
  Edit,
  Eye,
  Zap,
  Code,
  Database,
  Globe,
  Smartphone,
  Bot,
  Sparkles,
  Timer,
  AlertCircle
} from "lucide-react";
import type { ProjectCardProps } from "@/types";

const statusConfig = {
  planning: { label: "Planning", color: "bg-blue-100 text-blue-800 border-blue-200", icon: Target },
  "in-progress": { label: "In Progress", color: "bg-orange-100 text-orange-800 border-orange-200", icon: Play },
  active: { label: "Active", color: "bg-green-100 text-green-800 border-green-200", icon: Play },
  review: { label: "Review", color: "bg-purple-100 text-purple-800 border-purple-200", icon: Eye },
  completed: { label: "Completed", color: "bg-green-100 text-green-800 border-green-200", icon: CheckCircle },
  paused: { label: "Paused", color: "bg-gray-100 text-gray-800 border-gray-200", icon: Clock },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800 border-red-200", icon: AlertTriangle }
} as const;

const priorityConfig = {
  low: { label: "Low", color: "bg-green-100 text-green-800 border-green-200" },
  medium: { label: "Medium", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  high: { label: "High", color: "bg-red-100 text-red-800 border-red-200" }
} as const;

const categoryConfig = {
  "Web Development": { icon: Globe, color: "text-blue-500", bgColor: "bg-blue-100" },
  "Mobile Development": { icon: Smartphone, color: "text-purple-500", bgColor: "bg-purple-100" },
  "AI/ML": { icon: Bot, color: "text-emerald-500", bgColor: "bg-emerald-100" },
  "Backend Development": { icon: Database, color: "text-orange-500", bgColor: "bg-orange-100" },
  "Frontend Development": { icon: Code, color: "text-pink-500", bgColor: "bg-pink-100" },
  "Full Stack": { icon: Zap, color: "text-indigo-500", bgColor: "bg-indigo-100" },
  "DevOps": { icon: TrendingUp, color: "text-cyan-500", bgColor: "bg-cyan-100" }
} as const;

// Calculate SLA status based on due date and progress
const calculateSLA = (dueDate: string, progress: number) => {
  const now = new Date();
  const due = new Date(dueDate);
  const daysRemaining = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  // SLA Levels based on time remaining and progress
  if (daysRemaining < 0) {
    return { level: "Overdue", color: "bg-red-500", textColor: "text-red-500", days: Math.abs(daysRemaining) };
  } else if (daysRemaining <= 3 && progress < 80) {
    return { level: "Critical", color: "bg-red-500", textColor: "text-red-500", days: daysRemaining };
  } else if (daysRemaining <= 7 && progress < 60) {
    return { level: "At Risk", color: "bg-orange-500", textColor: "text-orange-500", days: daysRemaining };
  } else if (daysRemaining <= 14 && progress < 40) {
    return { level: "Warning", color: "bg-yellow-500", textColor: "text-yellow-500", days: daysRemaining };
  } else {
    return { level: "On Track", color: "bg-green-500", textColor: "text-green-500", days: daysRemaining };
  }
};

const ProjectCard = React.memo<ProjectCardProps>(({ project, onView, onEdit }) => {
  const status = statusConfig[project.status] || statusConfig.active;
  const priority = priorityConfig[project.priority];
  const category = categoryConfig[project.category as keyof typeof categoryConfig] || categoryConfig["Web Development"];
  const StatusIcon = status.icon;
  const CategoryIcon = category.icon;
  
  const sla = calculateSLA(project.dueDate, project.progress);

  return (
    <Card 
      className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-border/50 bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm overflow-hidden relative"
      onClick={() => onView(project.id)}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardHeader className="pb-3 relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`w-12 h-12 rounded-xl ${category.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg flex-shrink-0`}>
              <CategoryIcon className={`h-6 w-6 ${category.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
                {project.title}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {project.description}
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary/10 flex-shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(project.id);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 relative">
        {/* Status, Priority, and SLA */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={`${status.color} border shadow-sm`}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {status.label}
          </Badge>
          <Badge className={`${priority.color} border shadow-sm`}>
            {priority.label}
          </Badge>
          <Badge variant="outline" className="bg-background/50">
            {project.category}
          </Badge>
        </div>

        {/* SLA Status */}
        <div className={`p-3 rounded-lg border-2 ${sla.level === 'Overdue' ? 'border-red-500/50 bg-red-500/10' : sla.level === 'Critical' ? 'border-red-500/50 bg-red-500/10' : sla.level === 'At Risk' ? 'border-orange-500/50 bg-orange-500/10' : sla.level === 'Warning' ? 'border-yellow-500/50 bg-yellow-500/10' : 'border-green-500/50 bg-green-500/10'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${sla.color} animate-pulse`} />
              <span className="text-sm font-semibold">SLA Status: {sla.level}</span>
            </div>
            <div className="flex items-center gap-1 text-sm font-medium">
              <Timer className={`h-4 w-4 ${sla.textColor}`} />
              <span className={sla.textColor}>
                {sla.level === 'Overdue' ? `${sla.days}d overdue` : `${sla.days}d remaining`}
              </span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">Progress</span>
            <span className="font-bold text-foreground">{project.progress}%</span>
          </div>
          <Progress 
            value={project.progress} 
            className="h-2.5 shadow-inner"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              {project.stepsCompleted} of {project.totalSteps} steps
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {project.estimatedCompletion}
            </span>
          </div>
        </div>

        {/* Project Details Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-2 rounded-lg bg-muted/50 border border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Due Date</span>
            </div>
            <p className="text-sm font-semibold text-foreground">
              {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          
          <div className="p-2 rounded-lg bg-muted/50 border border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Time Spent</span>
            </div>
            <p className="text-sm font-semibold text-foreground">{project.timeSpent}</p>
          </div>
          
          <div className="p-2 rounded-lg bg-muted/50 border border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Target className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Budget</span>
            </div>
            <p className="text-sm font-semibold text-foreground">{project.budget}</p>
          </div>
          
          <div className="p-2 rounded-lg bg-muted/50 border border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Users className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Team Size</span>
            </div>
            <p className="text-sm font-semibold text-foreground">{project.team.length} members</p>
          </div>
        </div>

        {/* Team Members */}
        {project.team && project.team.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Users className="h-4 w-4" />
              Team Members
            </div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {project.team.slice(0, 4).map((member, index) => (
                  <div
                    key={index}
                    className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-primary/60 border-2 border-background flex items-center justify-center text-xs font-bold text-foreground hover:scale-110 hover:z-10 transition-transform duration-200 shadow-lg"
                    title={member}
                  >
                    {member.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                ))}
              </div>
              {project.team.length > 4 && (
                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  +{project.team.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Code className="h-4 w-4" />
              Tech Stack
            </div>
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 4).map((tech, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs bg-background/80 hover:bg-background transition-colors shadow-sm"
                >
                  {tech}
                </Badge>
              ))}
              {project.technologies.length > 4 && (
                <Badge variant="outline" className="text-xs bg-background/80 shadow-sm">
                  +{project.technologies.length - 4}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="text-xs text-muted-foreground">
            Updated {new Date(project.lastUpdated).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600">
            <Sparkles className="h-3.5 w-3.5" />
            AI Enhanced
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ProjectCard.displayName = "ProjectCard";

export { ProjectCard };
