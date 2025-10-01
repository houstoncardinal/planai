import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AICodeAnalyzer } from "@/components/AICodeAnalyzer";
import { CodeAnalysisPanel } from "@/components/CodeAnalysisPanel";
import { 
  Code, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText,
  GitBranch,
  Zap,
  Shield,
  Brain,
  TrendingUp,
  Settings
} from "lucide-react";

const CodeReviewPage = () => {
  const [activeTab, setActiveTab] = useState("analyzer");

  const codeIssues = [
    {
      id: "1",
      file: "src/components/UserDashboard.tsx",
      lines: 285,
      type: "length" as const,
      severity: "medium" as const,
      description: "Component is getting large and handles multiple responsibilities",
      suggestion: "Split into smaller components: UserProfile, UserStats, and UserActions",
      resolved: false
    },
    {
      id: "2",
      file: "src/utils/validation.ts",
      lines: 95,
      type: "duplicate" as const,
      severity: "low" as const,
      description: "Similar validation patterns repeated in multiple functions",
      suggestion: "Create a generic validation factory function to reduce duplication",
      resolved: false
    },
    {
      id: "3",
      file: "src/hooks/useAuth.ts",
      lines: 150,
      type: "complexity" as const,
      severity: "medium" as const,
      description: "Complex hook with multiple responsibilities and side effects",
      suggestion: "Split into useAuthState and useAuthActions hooks for better separation of concerns",
      resolved: false
    },
    {
      id: "4",
      file: "src/api/endpoints.ts",
      lines: 67,
      type: "complexity" as const,
      severity: "high" as const,
      description: "Missing input validation for user data",
      suggestion: "Add comprehensive input validation and sanitization",
      resolved: false
    }
  ];

  const reviewStats = {
    totalFiles: 156,
    issuesFound: 23,
    criticalIssues: 3,
    resolvedIssues: 18,
    codeQuality: 87
  };

  const recentReviews = [
    {
      id: "1",
      file: "src/components/UserDashboard.tsx",
      reviewer: "John Doe",
      status: "completed",
      timestamp: "2 hours ago",
      issues: 5
    },
    {
      id: "2",
      file: "src/utils/validation.ts",
      reviewer: "Jane Smith",
      status: "in-progress",
      timestamp: "4 hours ago",
      issues: 3
    },
    {
      id: "3",
      file: "src/hooks/useAuth.ts",
      reviewer: "Mike Johnson",
      status: "pending",
      timestamp: "1 day ago",
      issues: 8
    }
  ];

  const quickActions = [
    {
      title: "Analyze Current File",
      description: "Review the currently open file",
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-100"
    },
    {
      title: "Security Scan",
      description: "Check for security vulnerabilities",
      icon: Shield,
      color: "text-red-500",
      bgColor: "bg-red-100"
    },
    {
      title: "Performance Review",
      description: "Analyze performance bottlenecks",
      icon: Zap,
      color: "text-green-500",
      bgColor: "bg-green-100"
    },
    {
      title: "Best Practices",
      description: "Check against coding standards",
      icon: CheckCircle,
      color: "text-purple-500",
      bgColor: "bg-purple-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center shadow-lg">
              <Code className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Code Review</h1>
              <p className="text-muted-foreground">AI-powered code analysis and review</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Files</p>
                  <p className="text-2xl font-bold">{reviewStats.totalFiles}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Issues Found</p>
                  <p className="text-2xl font-bold">{reviewStats.issuesFound}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                  <p className="text-2xl font-bold">{reviewStats.resolvedIssues}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quality Score</p>
                  <p className="text-2xl font-bold">{reviewStats.codeQuality}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Code Analysis */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="analyzer">AI Code Analyzer</TabsTrigger>
                    <TabsTrigger value="issues">Issues Panel</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="flex-1">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsContent value="analyzer" className="h-full">
                    <AICodeAnalyzer />
                  </TabsContent>
                  <TabsContent value="issues" className="h-full">
                    <CodeAnalysisPanel
                      issues={codeIssues}
                      onRefresh={() => {}}
                      onViewFile={(file) => {}}
                    />
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

            {/* Recent Reviews */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Reviews
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentReviews.map((review) => (
                  <div
                    key={review.id}
                    className="p-3 rounded-lg border border-border/50 hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{review.file}</h4>
                      <Badge 
                        variant={review.status === 'completed' ? 'default' : review.status === 'in-progress' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {review.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Reviewed by {review.reviewer}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{review.timestamp}</span>
                      <span className="text-xs font-medium">{review.issues} issues</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Review Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Review Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Auto-scan on save</span>
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Security checks</span>
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Performance analysis</span>
                  <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Best practices</span>
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

export default CodeReviewPage; 