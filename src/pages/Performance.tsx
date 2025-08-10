import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdvancedAnalytics } from "@/components/AdvancedAnalytics";
import { 
  Zap, 
  TrendingUp, 
  Clock, 
  Activity, 
  Gauge, 
  Target,
  BarChart3,
  LineChart,
  PieChart,
  Settings,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown
} from "lucide-react";

const PerformancePage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const performanceMetrics = {
    pageLoadTime: 2.3,
    bundleSize: 1.8,
    lighthouseScore: 92,
    apiResponseTime: 180,
    memoryUsage: 45,
    cpuUsage: 23
  };

  const performanceHistory = [
    { date: "2024-01-01", pageLoad: 2.1, bundleSize: 1.7, lighthouse: 89 },
    { date: "2024-01-08", pageLoad: 2.3, bundleSize: 1.8, lighthouse: 91 },
    { date: "2024-01-15", pageLoad: 2.0, bundleSize: 1.6, lighthouse: 93 },
    { date: "2024-01-22", pageLoad: 2.3, bundleSize: 1.8, lighthouse: 92 },
    { date: "2024-01-29", pageLoad: 2.1, bundleSize: 1.7, lighthouse: 94 }
  ];

  const performanceIssues = [
    {
      id: "1",
      title: "Large Bundle Size",
      description: "JavaScript bundle is larger than recommended",
      severity: "medium",
      impact: "Slower initial page load",
      suggestion: "Implement code splitting and lazy loading",
      status: "open"
    },
    {
      id: "2",
      title: "Slow API Response",
      description: "API endpoints taking longer than 200ms",
      severity: "high",
      impact: "Poor user experience",
      suggestion: "Optimize database queries and add caching",
      status: "in-progress"
    },
    {
      id: "3",
      title: "Memory Leak",
      description: "Memory usage increasing over time",
      severity: "critical",
      impact: "Application crashes",
      suggestion: "Fix event listener cleanup in components",
      status: "resolved"
    }
  ];

  const optimizationSuggestions = [
    {
      title: "Implement Code Splitting",
      description: "Split your bundle into smaller chunks",
      impact: "Reduce initial load time by 40%",
      effort: "Medium",
      priority: "High"
    },
    {
      title: "Add Service Worker",
      description: "Cache static assets for offline access",
      impact: "Improve repeat visit performance",
      effort: "Low",
      priority: "Medium"
    },
    {
      title: "Optimize Images",
      description: "Use WebP format and proper sizing",
      impact: "Reduce image load time by 60%",
      effort: "Low",
      priority: "High"
    }
  ];

  const quickActions = [
    {
      title: "Run Performance Test",
      description: "Execute comprehensive performance analysis",
      icon: Activity,
      color: "text-blue-500",
      bgColor: "bg-blue-100"
    },
    {
      title: "Bundle Analyzer",
      description: "Analyze JavaScript bundle composition",
      icon: BarChart3,
      color: "text-green-500",
      bgColor: "bg-green-100"
    },
    {
      title: "Lighthouse Audit",
      description: "Run Lighthouse performance audit",
      icon: Target,
      color: "text-purple-500",
      bgColor: "bg-purple-100"
    },
    {
      title: "Memory Profiler",
      description: "Profile memory usage and leaks",
      icon: Gauge,
      color: "text-orange-500",
      bgColor: "bg-orange-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Performance</h1>
              <p className="text-muted-foreground">Monitor and optimize application performance</p>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Page Load Time</p>
                  <p className="text-2xl font-bold">{performanceMetrics.pageLoadTime}s</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <ArrowUp className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-500">+9.5%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Bundle Size</p>
                  <p className="text-2xl font-bold">{performanceMetrics.bundleSize}MB</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <ArrowDown className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-500">-5.2%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Lighthouse Score</p>
                  <p className="text-2xl font-bold">{performanceMetrics.lighthouseScore}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <ArrowUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-500">+3.4%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">API Response</p>
                  <p className="text-2xl font-bold">{performanceMetrics.apiResponseTime}ms</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Activity className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <ArrowUp className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-500">+12.1%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Memory Usage</p>
                  <p className="text-2xl font-bold">{performanceMetrics.memoryUsage}%</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                  <Gauge className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <ArrowDown className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-500">-8.3%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">CPU Usage</p>
                  <p className="text-2xl font-bold">{performanceMetrics.cpuUsage}%</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-cyan-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-cyan-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <ArrowDown className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-500">-15.2%</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Analysis */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="issues">Issues</TabsTrigger>
                    <TabsTrigger value="optimizations">Optimizations</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="flex-1">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsContent value="overview" className="h-full">
                    <AdvancedAnalytics />
                  </TabsContent>
                  
                  <TabsContent value="issues" className="h-full space-y-4">
                    <div className="space-y-4">
                      {performanceIssues.map((issue) => (
                        <Card key={issue.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-medium">{issue.title}</h4>
                                  <Badge 
                                    variant={issue.severity === 'critical' ? 'destructive' : issue.severity === 'high' ? 'default' : 'secondary'}
                                    className="text-xs"
                                  >
                                    {issue.severity}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {issue.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{issue.description}</p>
                                <p className="text-sm font-medium mb-1">Impact: {issue.impact}</p>
                                <p className="text-sm text-muted-foreground">Suggestion: {issue.suggestion}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="optimizations" className="h-full space-y-4">
                    <div className="space-y-4">
                      {optimizationSuggestions.map((suggestion, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-medium">{suggestion.title}</h4>
                                  <Badge 
                                    variant={suggestion.priority === 'High' ? 'default' : 'secondary'}
                                    className="text-xs"
                                  >
                                    {suggestion.priority}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{suggestion.description}</p>
                                <div className="flex items-center gap-4 text-sm">
                                  <span className="text-green-600 font-medium">Impact: {suggestion.impact}</span>
                                  <span className="text-blue-600">Effort: {suggestion.effort}</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={action.title}
                      variant="outline"
                      className="w-full justify-start h-auto p-3 hover:scale-105 transition-all duration-200"
                    >
                      <div className={`w-8 h-8 rounded-lg ${action.bgColor} flex items-center justify-center mr-3`}>
                        <Icon className={`h-4 w-4 ${action.color}`} />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{action.title}</div>
                        <div className="text-xs text-muted-foreground">{action.description}</div>
                      </div>
                    </Button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Performance Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Performance Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">High Memory Usage</span>
                  </div>
                  <p className="text-xs text-red-700">Memory usage is above 80% threshold</p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">Slow API Response</span>
                  </div>
                  <p className="text-xs text-yellow-700">API response time increased by 15%</p>
                </div>
              </CardContent>
            </Card>

            {/* Performance Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Performance Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Auto-monitoring</span>
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Performance alerts</span>
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Bundle analysis</span>
                  <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Memory profiling</span>
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformancePage; 