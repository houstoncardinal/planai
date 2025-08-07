import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Clock, Eye, MoreHorizontal, ArrowRight } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

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
    technologies?: string[];
    priority?: string;
  };
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
}

const statusConfig = {
  planning: { color: 'bg-warning', label: 'Planning' },
  'in-progress': { color: 'bg-primary', label: 'In Progress' },
  review: { color: 'bg-accent', label: 'Review' },
  completed: { color: 'bg-success', label: 'Completed' }
};

export function ProjectCard({ project, onView, onEdit }: ProjectCardProps) {
  const status = statusConfig[project.status];
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/projects/${project.id}`);
  };

  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card 
      className="group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 cursor-pointer border-border/50 bg-gradient-to-br from-card/95 via-card to-card/90 backdrop-blur-sm animate-fade-in hover-scale"
      onClick={handleCardClick}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <CardHeader className="pb-3 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-all duration-300">
              {project.title}
            </CardTitle>
            <CardDescription className="mt-1 text-muted-foreground line-clamp-2 group-hover:text-muted-foreground/80 transition-colors duration-300">
              {project.description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 shrink-0" onClick={handleDropdownClick}>
            <Button 
              variant="ghost" 
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 hover:bg-primary/10"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-muted/80 transition-colors duration-200">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-sm border border-border shadow-xl animate-scale-in">
                <DropdownMenuItem onClick={() => onView?.(project.id)} className="hover:bg-primary/10 transition-colors duration-200">
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit?.(project.id)} className="hover:bg-primary/10 transition-colors duration-200">
                  Edit Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-4">
          <Badge variant="secondary" className={`${status.color} text-white border-0 shadow-sm transition-all duration-300 group-hover:shadow-md`}>
            {status.label}
          </Badge>
          {project.priority && (
            <Badge variant="outline" className="text-xs border-border/60 bg-background/50 transition-all duration-300 hover:border-primary/50">
              {project.priority} priority
            </Badge>
          )}
          <div className="flex items-center text-xs text-muted-foreground ml-auto transition-colors duration-300 group-hover:text-muted-foreground/80">
            <Calendar className="mr-1 h-3 w-3" />
            {project.dueDate}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 relative z-10">
        <div className="space-y-4">
          {/* Technologies - Fixed single line with horizontal scroll */}
          {project.technologies && project.technologies.length > 0 && (
             <div className="relative">
               <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                 {project.technologies.map((tech) => (
                  <Badge 
                    key={tech} 
                    variant="secondary" 
                    className="text-xs bg-primary/10 text-primary border-primary/20 whitespace-nowrap shrink-0 transition-all duration-300 hover:bg-primary/20 hover:scale-105"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
              {/* Fade indicator for overflow */}
              <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-card to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          )}
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground transition-colors duration-300 group-hover:text-muted-foreground/80">Progress</span>
              <span className="font-medium text-foreground transition-colors duration-300 group-hover:text-primary">{project.progress}%</span>
            </div>
            <div className="relative">
              <Progress value={project.progress} className="h-2.5 transition-all duration-500 group-hover:h-3" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-muted-foreground transition-colors duration-300 group-hover:text-muted-foreground/80">
              <CheckCircle className="mr-1 h-3 w-3 transition-colors duration-300 group-hover:text-success" />
              {project.stepsCompleted}/{project.totalSteps} steps
            </div>
            <div className="flex items-center text-muted-foreground transition-colors duration-300 group-hover:text-muted-foreground/80">
              <Clock className="mr-1 h-3 w-3" />
              {project.lastUpdated}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}