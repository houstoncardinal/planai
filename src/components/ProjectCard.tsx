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
  Sparkles
} from "lucide-react";
import type { ProjectCardProps } from "@/types";

const statusConfig = {
  planning: { label: "Planning", color: "bg-blue-100 text-blue-800 border-blue-200", icon: Target },
  "in-progress": { label: "In Progress", color: "bg-orange-100 text-orange-800 border-orange-200", icon: Play },
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

const ProjectCard = React.memo<ProjectCardProps>(({ project, onView, onEdit }) => {
  const status = statusConfig[project.status];
  const priority = priorityConfig[project.priority];
  const category = categoryConfig[project.category as keyof typeof categoryConfig] || categoryConfig["Web Development"];
  const StatusIcon = status.icon;
  const CategoryIcon = category.icon;

  // Color theme based on category
  const getCardTheme = () => {
    switch (project.category) {
      case "Web Development": return "card-glow-blue";
      case "Mobile Development": return "card-glow-purple";
      case "AI/ML": return "card-glow-emerald";
      case "Backend Development": return "card-glow-orange";
      case "Frontend Development": return "card-glow-pink";
      case "Full Stack": return "card-glow-indigo";
      case "DevOps": return "card-glow-cyan";
      default: return "card-enhanced";
    }
  };

  const getIconTheme = () => {
    switch (project.category) {
      case "Web Development": return "icon-glow-blue";
      case "Mobile Development": return "icon-glow-purple";
      case "AI/ML": return "icon-glow-emerald";
      case "Backend Development": return "icon-glow-orange";
      case "Frontend Development": return "icon-glow-pink";
      case "Full Stack": return "icon-glow-indigo";
      case "DevOps": return "icon-glow-cyan";
      default: return "text-muted-foreground";
    }
  };

  const getBadgeTheme = () => {
    switch (project.category) {
      case "Web Development": return "badge-glow-blue";
      case "Mobile Development": return "badge-glow-purple";
      case "AI/ML": return "badge-glow-emerald";
      case "Backend Development": return "badge-glow-orange";
      case "Frontend Development": return "badge-glow-pink";
      case "Full Stack": return "badge-glow-indigo";
      case "DevOps": return "badge-glow-cyan";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <Card className={`${getCardTheme()} cursor-pointer group`} onClick={() => onView(project.id)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${category.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
              <CategoryIcon className={`h-5 w-5 ${category.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold text-foreground group-hover:text-gradient-blue transition-all duration-300">
                {project.title}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {project.description}
              </CardDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary/10"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(project.id);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Status and Priority */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={`${status.color} border ${getBadgeTheme()}`}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {status.label}
          </Badge>
          <Badge className={`${priority.color} border ${getBadgeTheme()}`}>
            {priority.label}
          </Badge>
          <Badge className={`${getBadgeTheme()} border`}>
            {project.category}
          </Badge>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">{project.progress}%</span>
          </div>
          <Progress 
            value={project.progress} 
            className="h-2 progress-glow"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{project.stepsCompleted} of {project.totalSteps} steps</span>
            <span>{project.estimatedCompletion}</span>
          </div>
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{project.timeSpent}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{project.team.length} members</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Target className="h-4 w-4" />
            <span>{project.budget}</span>
          </div>
        </div>

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-foreground">Technologies</div>
            <div className="flex flex-wrap gap-1">
              {project.technologies.slice(0, 3).map((tech, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs bg-background/50 hover:bg-background/80 transition-colors"
                >
                  {tech}
                </Badge>
              ))}
              {project.technologies.length > 3 && (
                <Badge variant="outline" className="text-xs bg-background/50">
                  +{project.technologies.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Team Members */}
        {project.team && project.team.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-foreground">Team</div>
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {project.team.slice(0, 3).map((member, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 border-2 border-background flex items-center justify-center text-xs font-medium text-foreground hover:scale-110 transition-transform duration-200"
                    title={member}
                  >
                    {member.split(' ').map(n => n[0]).join('')}
                  </div>
                ))}
              </div>
              {project.team.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{project.team.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Last Updated */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
          <span>Last updated: {new Date(project.lastUpdated).toLocaleDateString()}</span>
          <div className="flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-500" />
            <span>AI Enhanced</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ProjectCard.displayName = "ProjectCard";

export { ProjectCard };