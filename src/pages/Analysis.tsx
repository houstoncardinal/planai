import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Code, 
  GitBranch, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Zap,
  Bot,
  Sparkles,
  FileCode,
  Shield,
  Database,
  Globe,
  Smartphone,
  Layers,
  Target,
  Brain
} from "lucide-react";
import { AICodeAnalyzer } from "@/components/AICodeAnalyzer";
import { AIAssistant } from "@/components/AIAssistant";
import { HelpCenter, TutorialTooltip } from "@/components/TutorialSystem";

// Mock data for code metrics
const codeMetrics = {
  totalLines: 15420,
  functions: 342,
  classes: 28,
  complexity: 156,
  testCoverage: 78,
  duplicatedCode: 12,
  technicalDebt: 8,
  securityIssues: 3,
  performanceIssues: 7,
  maintainability: 85
};

// Mock data for recent analysis
const recentAnalysis = [
  {
    id: "1",
    file: "src/components/App.tsx",
    type: "performance",
    severity: "medium",
    message: "Consider using React.memo for expensive components",
    timestamp: "2 hours ago"
  },
  {
    id: "2",
    file: "src/hooks/useData.ts",
    type: "security",
    severity: "high",
    message: "Potential SQL injection vulnerability detected",
    timestamp: "4 hours ago"
  },
  {
    id: "3",
    file: "src/utils/helpers.ts",
    type: "quality",
    severity: "low",
    message: "Function could be simplified for better readability",
    timestamp: "6 hours ago"
  }
];

// Mock data for AI insights
const aiInsights = [
  {
    id: "1",
    category: "Performance",
    title: "Bundle Size Optimization",
    description: "Your bundle size has increased by 15% in the last week. Consider code splitting and lazy loading.",
    impact: "high",
    effort: "medium"
  },
  {
    id: "2",
    category: "Security",
    title: "Authentication Enhancement",
    description: "Implement JWT refresh tokens to improve security posture.",
    impact: "high",
    effort: "low"
  },
  {
    id: "3",
    category: "Code Quality",
    title: "TypeScript Migration",
    description: "Consider migrating JavaScript files to TypeScript for better type safety.",
    impact: "medium",
    effort: "high"
  }
];

export default function Analysis() {
  const [activeTab, setActiveTab] = useState("overview");

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "text-red-600 bg-red-100";
      case "medium": return "text-yellow-600 bg-yellow-100";
      case "low": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "performance": return <Zap className="h-4 w-4" />;
      case "security": return <Shield className="h-4 w-4" />;
      case "quality": return <CheckCircle className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "text-red-600";
      case "medium": return "text-yellow-600";
      case "low": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="w-full overflow-x-hidden">
      <div className="w-full max-w-none px-4 md:px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Code Analysis</h1>
            <p className="text-muted-foreground mt-1">
              AI-powered code analysis, performance monitoring, and quality insights
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              <Bot className="h-3 w-3 mr-1" />
              Claude AI Powered
            </Badge>
            <TutorialTooltip 
              content="Get help with AI code analysis features and learn how to use them effectively"
              featureId="ai-code-analyzer"
            >
              <HelpCenter />
            </TutorialTooltip>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="ai-analyzer" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Code Analyzer
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              AI Insights
            </TabsTrigger>
            <TabsTrigger value="metrics" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Metrics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Code Health Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <TutorialTooltip content="Test coverage percentage across your codebase">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-muted-foreground">Test Coverage</div>
                      <CheckCircle className="h-4 w-4 text-success" />
                    </div>
                    <div className="text-2xl font-bold text-success">{codeMetrics.testCoverage}%</div>
                    <div className="text-xs text-muted-foreground mt-1">Target: 80%</div>
                  </CardContent>
                </Card>
              </TutorialTooltip>

              <TutorialTooltip content="Code maintainability score based on complexity and structure">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-muted-foreground">Maintainability</div>
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-primary">{codeMetrics.maintainability}/100</div>
                    <div className="text-xs text-muted-foreground mt-1">Excellent</div>
                  </CardContent>
                </Card>
              </TutorialTooltip>

              <TutorialTooltip content="Number of security vulnerabilities detected in your code">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-muted-foreground">Security Issues</div>
                      <Shield className="h-4 w-4 text-warning" />
                    </div>
                    <div className="text-2xl font-bold text-warning">{codeMetrics.securityIssues}</div>
                    <div className="text-xs text-muted-foreground mt-1">Needs attention</div>
                  </CardContent>
                </Card>
              </TutorialTooltip>

              <TutorialTooltip content="Percentage of duplicated code in your codebase">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-muted-foreground">Duplicated Code</div>
                      <GitBranch className="h-4 w-4 text-destructive" />
                    </div>
                    <div className="text-2xl font-bold text-destructive">{codeMetrics.duplicatedCode}%</div>
                    <div className="text-xs text-muted-foreground mt-1">Of total codebase</div>
                  </CardContent>
                </Card>
              </TutorialTooltip>
            </div>

            {/* Recent Analysis Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  Recent Analysis Results
                </CardTitle>
                <CardDescription>
                  Latest code analysis findings and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAnalysis.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                          {getTypeIcon(item.type)}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{item.file}</div>
                          <div className="text-sm text-muted-foreground">{item.message}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getSeverityColor(item.severity)}>
                          {item.severity}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Common analysis tasks and tools
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <TutorialTooltip content="Run a comprehensive analysis of your entire codebase">
                    <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                      <FileCode className="h-6 w-6 text-primary" />
                      <span>Run Full Analysis</span>
                    </Button>
                  </TutorialTooltip>
                  <TutorialTooltip content="Scan your code for security vulnerabilities">
                    <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                      <Shield className="h-6 w-6 text-primary" />
                      <span>Security Scan</span>
                    </Button>
                  </TutorialTooltip>
                  <TutorialTooltip content="Check your code for performance bottlenecks">
                    <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                      <TrendingUp className="h-6 w-6 text-primary" />
                      <span>Performance Check</span>
                    </Button>
                  </TutorialTooltip>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-analyzer" className="space-y-6">
            <AICodeAnalyzer />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            {/* AI Insights Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  AI-Generated Insights
                </CardTitle>
                <CardDescription>
                  Intelligent recommendations based on your codebase analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiInsights.map((insight) => (
                    <div key={insight.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{insight.category}</Badge>
                          <h4 className="font-semibold text-foreground">{insight.title}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getImpactColor(insight.impact)} bg-opacity-10`}>
                            Impact: {insight.impact}
                          </Badge>
                          <Badge variant="secondary">
                            Effort: {insight.effort}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-3">{insight.description}</p>
                      <div className="flex gap-2">
                        <Button size="sm">View Details</Button>
                        <Button size="sm" variant="outline">Dismiss</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Technology Stack Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-primary" />
                  Technology Stack Analysis
                </CardTitle>
                <CardDescription>
                  AI analysis of your technology choices and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Frontend</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      React 18, TypeScript, Tailwind CSS
                    </div>
                    <Badge className="mt-2 bg-green-100 text-green-800">Excellent Choice</Badge>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Database className="h-4 w-4 text-green-500" />
                      <span className="font-medium">Database</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      PostgreSQL, Prisma ORM
                    </div>
                    <Badge className="mt-2 bg-green-100 text-green-800">Solid Choice</Badge>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Smartphone className="h-4 w-4 text-purple-500" />
                      <span className="font-medium">Mobile</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      React Native, Expo
                    </div>
                    <Badge className="mt-2 bg-yellow-100 text-yellow-800">Consider Native</Badge>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-4 w-4 text-red-500" />
                      <span className="font-medium">Security</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      JWT, bcrypt, CORS
                    </div>
                    <Badge className="mt-2 bg-red-100 text-red-800">Needs Review</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            {/* Detailed Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    Code Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Lines of Code</span>
                      <span className="font-medium">{codeMetrics.totalLines.toLocaleString()}</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Functions</span>
                      <span className="font-medium">{codeMetrics.functions}</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Classes</span>
                      <span className="font-medium">{codeMetrics.classes}</span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Cyclomatic Complexity</span>
                      <span className="font-medium">{codeMetrics.complexity}</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Quality Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Test Coverage</span>
                      <span className="font-medium">{codeMetrics.testCoverage}%</span>
                    </div>
                    <Progress value={codeMetrics.testCoverage} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Maintainability Index</span>
                      <span className="font-medium">{codeMetrics.maintainability}/100</span>
                    </div>
                    <Progress value={codeMetrics.maintainability} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Technical Debt</span>
                      <span className="font-medium">{codeMetrics.technicalDebt} days</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Duplicated Code</span>
                      <span className="font-medium">{codeMetrics.duplicatedCode}%</span>
                    </div>
                    <Progress value={codeMetrics.duplicatedCode} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Performance Trends
                </CardTitle>
                <CardDescription>
                  Historical performance metrics and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Performance charts and trends will be displayed here
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* AI Assistant */}
      <AIAssistant />
    </div>
  );
}