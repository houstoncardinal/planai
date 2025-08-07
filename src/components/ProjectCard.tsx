import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Clock, Eye, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    progress: number;
    status: 'planning' | 'in-progress' | 'review' | 'completed';
    dueDate: string;
    stepsCompleted: number;
    totalSteps: number;
    lastUpdated: string;
  };
  onView: (id: string) => void;
  onEdit: (id: string) => void;
}

const statusConfig = {
  planning: { color: 'bg-warning', label: 'Planning' },
  'in-progress': { color: 'bg-primary', label: 'In Progress' },
  review: { color: 'bg-accent', label: 'Review' },
  completed: { color: 'bg-success', label: 'Completed' }
};

export function ProjectCard({ project, onView, onEdit }: ProjectCardProps) {
  const status = statusConfig[project.status];

  return (
    <Card className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {project.title}
            </CardTitle>
            <CardDescription className="mt-1 text-muted-foreground">
              {project.description}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(project.id)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(project.id)}>
                Edit Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center gap-2 mt-3">
          <Badge variant="secondary" className={`${status.color} text-white`}>
            {status.label}
          </Badge>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="mr-1 h-3 w-3" />
            {project.dueDate}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-muted-foreground">
              <CheckCircle className="mr-1 h-3 w-3" />
              {project.stepsCompleted}/{project.totalSteps} steps
            </div>
            <div className="flex items-center text-muted-foreground">
              <Clock className="mr-1 h-3 w-3" />
              {project.lastUpdated}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}