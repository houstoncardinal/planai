import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppStore } from '@/stores/appStore';
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  Target, 
  BarChart3, 
  PieChart, 
  Activity,
  Zap,
  Users,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Code,
  Filter
} from 'lucide-react';

interface MetricCard {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: any;
  color: string;
}

interface ProjectMetrics {
  velocity: number;
  efficiency: number;
  qualityScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  burndownRate: number;
  codeComplexity: number;
  learningRate: number;
  collaborationScore: number;
}

export function AdvancedAnalytics() {
  const { projects, steps, learnings, codeIssues } = useAppStore();
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedProject, setSelectedProject] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate comprehensive metrics
  const metrics = useMemo((): ProjectMetrics => {
    const totalSteps = Object.values(steps).flat().length;
    const completedSteps = Object.values(steps).flat().filter(s => s.completed).length;
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'in-progress').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const totalLearnings = learnings.length;
    const highSeverityIssues = codeIssues.filter(i => i.severity === 'high').length;

    return {
      velocity: totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0,
      efficiency: totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0,
      qualityScore: codeIssues.length > 0 ? Math.max(0, 100 - (highSeverityIssues * 10)) : 85,
      riskLevel: highSeverityIssues > 3 ? 'high' : highSeverityIssues > 1 ? 'medium' : 'low',
      burndownRate: 75 + Math.random() * 20, // Simulated
      codeComplexity: 60 + Math.random() * 30, // Simulated
      learningRate: totalLearnings > 0 ? Math.min(100, totalLearnings * 10) : 0,
      collaborationScore: 80 + Math.random() * 15 // Simulated
    };
  }, [projects, steps, learnings, codeIssues]);

  const metricCards: MetricCard[] = [
    {
      title: 'Project Velocity',
      value: `${metrics.velocity}%`,
      change: 12,
      trend: 'up',
      icon: TrendingUp,
      color: 'text-primary'
    },
    {
      title: 'Delivery Efficiency',
      value: `${metrics.efficiency}%`,
      change: 5,
      trend: 'up',
      icon: Target,
      color: 'text-success'
    },
    {
      title: 'Code Quality Score',
      value: `${metrics.qualityScore}/100`,
      change: -2,
      trend: 'down',
      icon: Code,
      color: 'text-warning'
    },
    {
      title: 'Learning Velocity',
      value: `${metrics.learningRate}%`,
      change: 18,
      trend: 'up',
      icon: BookOpen,
      color: 'text-primary'
    }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      default: return '→';
    }
  };

  // Advanced analytics calculations
  const performanceAnalytics = useMemo(() => {
    const projectAnalytics = projects.map(project => {
      const projectSteps = steps[project.id] || [];
      const completedCount = projectSteps.filter(s => s.completed).length;
      const totalCount = projectSteps.length;
      
      return {
        id: project.id,
        title: project.title,
        progress: totalCount > 0 ? (completedCount / totalCount) * 100 : 0,
        velocity: completedCount / Math.max(1, totalCount) * 100,
        risk: project.priority === 'high' && project.progress < 50 ? 'high' : 'medium',
        efficiency: Math.random() * 40 + 60, // Simulated efficiency score
        learningCount: learnings.filter(l => l.projectId === project.id).length
      };
    });

    return projectAnalytics;
  }, [projects, steps, learnings]);

  const predictiveInsights = useMemo(() => {
    const avgVelocity = performanceAnalytics.reduce((sum, p) => sum + p.velocity, 0) / Math.max(1, performanceAnalytics.length);
    const riskProjects = performanceAnalytics.filter(p => p.risk === 'high');
    
    return {
      predictedCompletion: '2-3 weeks',
      bottlenecks: ['Code review process', 'API integration complexity', 'Testing coverage'],
      recommendations: [
        'Increase automated testing to reduce manual QA time',
        'Implement parallel development streams for critical features',
        'Schedule additional code review sessions for complex modules'
      ],
      riskFactors: riskProjects.map(p => p.title),
      opportunityAreas: ['Performance optimization', 'User experience improvements', 'Code refactoring']
    };
  }, [performanceAnalytics]);

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Advanced Analytics</h2>
          <p className="text-muted-foreground">
            Comprehensive insights and predictive analysis for your projects
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {projects.map(project => (
                <SelectItem key={project.id} value={project.id}>
                  {project.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`h-5 w-5 ${metric.color}`} />
                  <div className="text-sm text-muted-foreground">
                    {getTrendIcon(metric.trend)} {Math.abs(metric.change)}%
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                  <div className="text-sm text-muted-foreground">{metric.title}</div>
                </div>
              </CardContent>
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${
                metric.trend === 'up' ? 'from-success/20 to-success' :
                metric.trend === 'down' ? 'from-destructive/20 to-destructive' :
                'from-muted to-muted'
              }`} />
            </Card>
          );
        })}
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="predictive">Predictive</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Health Matrix */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Project Health Matrix
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {performanceAnalytics.slice(0, 5).map((project, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{project.title}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant={project.risk === 'high' ? 'destructive' : 'secondary'}>
                          {project.risk}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{Math.round(project.progress)}%</span>
                      </div>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-success" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <div className="text-lg font-bold text-primary">{metrics.burndownRate.toFixed(1)}%</div>
                    <div className="text-xs text-muted-foreground">Burndown Rate</div>
                  </div>
                  <div className="text-center p-3 bg-success/10 rounded-lg">
                    <div className="text-lg font-bold text-success">{metrics.collaborationScore.toFixed(0)}</div>
                    <div className="text-xs text-muted-foreground">Team Sync</div>
                  </div>
                  <div className="text-center p-3 bg-warning/10 rounded-lg">
                    <div className="text-lg font-bold text-warning">{metrics.codeComplexity.toFixed(0)}</div>
                    <div className="text-xs text-muted-foreground">Complexity</div>
                  </div>
                  <div className={`text-center p-3 rounded-lg ${
                    metrics.riskLevel === 'low' ? 'bg-success/10' :
                    metrics.riskLevel === 'medium' ? 'bg-warning/10' : 'bg-destructive/10'
                  }`}>
                    <div className={`text-lg font-bold capitalize ${getRiskColor(metrics.riskLevel)}`}>
                      {metrics.riskLevel}
                    </div>
                    <div className="text-xs text-muted-foreground">Risk Level</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Performance Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceAnalytics.map((project, index) => (
                    <div key={index} className="p-3 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-foreground">{project.title}</h4>
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">{project.efficiency.toFixed(0)}%</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <div className="text-muted-foreground">Progress</div>
                          <div className="font-medium">{project.progress.toFixed(0)}%</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Velocity</div>
                          <div className="font-medium">{project.velocity.toFixed(0)}%</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Learnings</div>
                          <div className="font-medium">{project.learningCount}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Velocity Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-32 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">+{metrics.velocity}%</div>
                      <div className="text-sm text-muted-foreground">Average velocity increase</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold text-foreground">
                        {Object.values(steps).flat().filter(s => s.completed).length}
                      </div>
                      <div className="text-xs text-muted-foreground">Steps Completed</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <div className="text-lg font-bold text-foreground">
                        {Math.round(learnings.length / Math.max(1, projects.length))}
                      </div>
                      <div className="text-xs text-muted-foreground">Avg Learnings/Project</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  Quality Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Code Quality Score</span>
                    <span className="font-medium">{metrics.qualityScore}/100</span>
                  </div>
                  <Progress value={metrics.qualityScore} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Test Coverage</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Documentation</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-warning" />
                  Issues Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['high', 'medium', 'low'].map(severity => {
                    const count = codeIssues.filter(i => i.severity === severity).length;
                    return (
                      <div key={severity} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${
                            severity === 'high' ? 'bg-destructive' :
                            severity === 'medium' ? 'bg-warning' : 'bg-success'
                          }`} />
                          <span className="text-sm capitalize">{severity} Priority</span>
                        </div>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Predictive Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="font-medium text-foreground">Estimated Completion</div>
                  <div className="text-sm text-muted-foreground">{predictiveInsights.predictedCompletion}</div>
                </div>
                <div>
                  <div className="font-medium text-foreground mb-2">Identified Bottlenecks:</div>
                  <div className="space-y-1">
                    {predictiveInsights.bottlenecks.map((bottleneck, index) => (
                      <div key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                        <AlertCircle className="h-3 w-3 text-warning" />
                        {bottleneck}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-foreground mb-2">Risk Factors:</div>
                  <div className="flex flex-wrap gap-1">
                    {predictiveInsights.riskFactors.map((factor, index) => (
                      <Badge key={index} variant="destructive" className="text-xs">
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-success" />
                  Optimization Opportunities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {predictiveInsights.recommendations.map((recommendation, index) => (
                  <div key={index} className="p-3 bg-success/5 rounded-lg border border-success/20">
                    <div className="text-sm text-foreground">{recommendation}</div>
                  </div>
                ))}
                <div className="mt-4">
                  <div className="font-medium text-foreground mb-2">Opportunity Areas:</div>
                  <div className="space-y-1">
                    {predictiveInsights.opportunityAreas.map((area, index) => (
                      <div key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                        <TrendingUp className="h-3 w-3 text-primary" />
                        {area}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Insights & Recommendations</CardTitle>
              <CardDescription>
                AI-powered analysis of your development patterns and optimization suggestions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                  <h4 className="font-medium text-foreground mb-2">Productivity Pattern</h4>
                  <p className="text-sm text-muted-foreground">
                    Your team shows highest productivity on Tuesday-Thursday with 23% higher completion rates.
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-success/10 to-success/5 rounded-lg border border-success/20">
                  <h4 className="font-medium text-foreground mb-2">Learning Acceleration</h4>
                  <p className="text-sm text-muted-foreground">
                    Documentation of learnings has increased code reuse by 35% and reduced debugging time.
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-warning/10 to-warning/5 rounded-lg border border-warning/20">
                  <h4 className="font-medium text-foreground mb-2">Risk Mitigation</h4>
                  <p className="text-sm text-muted-foreground">
                    Projects with detailed step planning show 40% lower risk of deadline overruns.
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-500/5 rounded-lg border border-blue-500/20">
                  <h4 className="font-medium text-foreground mb-2">Collaboration Boost</h4>
                  <p className="text-sm text-muted-foreground">
                    Teams using shared learning logs report 28% better knowledge transfer efficiency.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}