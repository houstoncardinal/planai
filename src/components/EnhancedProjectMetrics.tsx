import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/stores/appStore';
import { 
  TrendingUp, 
  Target, 
  Clock, 
  Zap, 
  Users, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Calendar,
  Code
} from 'lucide-react';

interface ProjectMetricsProps {
  projectId: string;
}

interface ProjectHealth {
  overallScore: number;
  velocity: number;
  quality: number;
  risk: 'low' | 'medium' | 'high';
  efficiency: number;
  timeline: 'on-track' | 'at-risk' | 'delayed';
  teamProuctivity: number;
  codeHealthScore: number;
}

export function EnhancedProjectMetrics({ projectId }: ProjectMetricsProps) {
  const { getProjectById, getStepsByProjectId, getLearningsByProjectId, getCodeIssuesByProjectId } = useAppStore();
  
  const project = getProjectById(projectId);
  const steps = getStepsByProjectId(projectId);
  const learnings = getLearningsByProjectId(projectId);
  const codeIssues = getCodeIssuesByProjectId(projectId);

  const projectHealth = useMemo((): ProjectHealth => {
    const totalSteps = steps.length;
    const completedSteps = steps.filter(s => s.completed).length;
    const progressRate = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
    
    const highSeverityIssues = codeIssues.filter(i => i.severity === 'high').length;
    const mediumSeverityIssues = codeIssues.filter(i => i.severity === 'medium').length;
    
    // Calculate quality score based on code issues
    const qualityScore = Math.max(0, 100 - (highSeverityIssues * 15) - (mediumSeverityIssues * 5));
    
    // Calculate velocity (completion rate over time)
    const velocity = progressRate;
    
    // Risk assessment
    let risk: 'low' | 'medium' | 'high' = 'low';
    if (highSeverityIssues > 2 || progressRate < 30) risk = 'high';
    else if (highSeverityIssues > 0 || progressRate < 60) risk = 'medium';
    
    // Timeline assessment
    let timeline: 'on-track' | 'at-risk' | 'delayed' = 'on-track';
    if (progressRate < 40 && project?.status === 'in-progress') timeline = 'delayed';
    else if (progressRate < 70 && project?.status === 'in-progress') timeline = 'at-risk';
    
    // Efficiency calculation
    const learningsCount = learnings.length;
    const efficiency = Math.min(100, 60 + (learningsCount * 5) + (progressRate * 0.3));
    
    // Overall health score
    const overallScore = Math.round((velocity * 0.3) + (qualityScore * 0.25) + (efficiency * 0.25) + (100 - (risk === 'high' ? 30 : risk === 'medium' ? 15 : 0)) * 0.2);

    return {
      overallScore,
      velocity,
      quality: qualityScore,
      risk,
      efficiency,
      timeline,
      teamProuctivity: 75 + Math.random() * 20, // Simulated
      codeHealthScore: qualityScore
    };
  }, [steps, codeIssues, learnings, project]);

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-success';
      case 'medium': return 'text-warning';
      case 'high': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getTimelineColor = (timeline: string) => {
    switch (timeline) {
      case 'on-track': return 'text-success';
      case 'at-risk': return 'text-warning';
      case 'delayed': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  if (!project) return null;

  return (
    <div className="space-y-6">
      {/* Overall Health Score */}
      <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <BarChart3 className="h-4 w-4 text-primary" />
            </div>
            Project Health Score
          </CardTitle>
          <CardDescription>
            Comprehensive analysis of project performance and health
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-32 h-32">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-muted"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - projectHealth.overallScore / 100)}`}
                  className={getHealthColor(projectHealth.overallScore)}
                  style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getHealthColor(projectHealth.overallScore)}`}>
                    {projectHealth.overallScore}
                  </div>
                  <div className="text-xs text-muted-foreground">Health</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <div className={`text-lg font-bold ${getRiskColor(projectHealth.risk)}`}>
                {projectHealth.risk.toUpperCase()}
              </div>
              <div className="text-xs text-muted-foreground">Risk Level</div>
            </div>
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <div className={`text-lg font-bold ${getTimelineColor(projectHealth.timeline)}`}>
                {projectHealth.timeline.replace('-', ' ').toUpperCase()}
              </div>
              <div className="text-xs text-muted-foreground">Timeline</div>
            </div>
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <div className={`text-lg font-bold ${getHealthColor(projectHealth.velocity)}`}>
                {Math.round(projectHealth.velocity)}%
              </div>
              <div className="text-xs text-muted-foreground">Velocity</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Code Quality */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Code className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium text-foreground">Code Quality</div>
                <div className="text-sm text-muted-foreground">Health & Standards</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Quality Score</span>
                <span className={`font-medium ${getHealthColor(projectHealth.quality)}`}>
                  {Math.round(projectHealth.quality)}/100
                </span>
              </div>
              <Progress value={projectHealth.quality} className="h-2" />
              <div className="text-xs text-muted-foreground">
                {codeIssues.length} issues detected
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Productivity */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Users className="h-5 w-5 text-success" />
              <div>
                <div className="font-medium text-foreground">Team Productivity</div>
                <div className="text-sm text-muted-foreground">Collaboration & Output</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Productivity</span>
                <span className={`font-medium ${getHealthColor(projectHealth.teamProuctivity)}`}>
                  {Math.round(projectHealth.teamProuctivity)}%
                </span>
              </div>
              <Progress value={projectHealth.teamProuctivity} className="h-2" />
              <div className="text-xs text-muted-foreground">
                {learnings.length} learnings documented
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Efficiency */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="h-5 w-5 text-warning" />
              <div>
                <div className="font-medium text-foreground">Efficiency</div>
                <div className="text-sm text-muted-foreground">Resource Optimization</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Efficiency</span>
                <span className={`font-medium ${getHealthColor(projectHealth.efficiency)}`}>
                  {Math.round(projectHealth.efficiency)}%
                </span>
              </div>
              <Progress value={projectHealth.efficiency} className="h-2" />
              <div className="text-xs text-muted-foreground">
                {steps.filter(s => s.completed).length}/{steps.length} steps completed
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Performance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <div>
              <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                Strengths
              </h4>
              <div className="space-y-2">
                {projectHealth.quality > 80 && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-success" />
                    Excellent code quality standards
                  </div>
                )}
                {projectHealth.velocity > 70 && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-success" />
                    Strong development velocity
                  </div>
                )}
                {learnings.length > 2 && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-success" />
                    Active learning and documentation
                  </div>
                )}
                {projectHealth.risk === 'low' && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-success" />
                    Low risk profile
                  </div>
                )}
              </div>
            </div>

            {/* Areas for Improvement */}
            <div>
              <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-warning" />
                Areas for Improvement
              </h4>
              <div className="space-y-2">
                {projectHealth.quality < 70 && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-warning" />
                    Code quality needs attention
                  </div>
                )}
                {projectHealth.velocity < 50 && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-warning" />
                    Development velocity could be improved
                  </div>
                )}
                {codeIssues.filter(i => i.severity === 'high').length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                    High-priority code issues need resolution
                  </div>
                )}
                {projectHealth.timeline === 'at-risk' && (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-warning" />
                    Timeline at risk - consider resource adjustment
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}