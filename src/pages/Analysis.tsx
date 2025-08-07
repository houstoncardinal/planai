import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeAnalysisPanel } from "@/components/CodeAnalysisPanel";
import { Progress } from "@/components/ui/progress";
import { Code, FileText, GitBranch, AlertTriangle, TrendingUp, RefreshCw, CheckCircle } from "lucide-react";

// Enhanced mock code analysis data
const mockCodeIssues = [
  {
    id: '1',
    file: 'src/components/UserDashboard.tsx',
    lines: 285,
    type: 'length' as const,
    severity: 'medium' as const,
    description: 'Component is getting large and handles multiple responsibilities',
    suggestion: 'Split into smaller components: UserProfile, UserStats, and UserActions'
  },
  {
    id: '2',
    file: 'src/utils/validation.ts',
    lines: 95,
    type: 'duplicate' as const,
    severity: 'low' as const,
    description: 'Similar validation patterns repeated in multiple functions',
    suggestion: 'Create a generic validation factory function to reduce duplication'
  },
  {
    id: '3',
    file: 'src/pages/ProductCatalog.tsx',
    lines: 320,
    type: 'length' as const,
    severity: 'high' as const,
    description: 'Large component with complex state management and multiple API calls',
    suggestion: 'Extract custom hooks for data fetching and split into ProductGrid and ProductFilters'
  },
  {
    id: '4',
    file: 'src/hooks/useAuth.ts',
    lines: 150,
    type: 'complexity' as const,
    severity: 'medium' as const,
    description: 'Complex hook with multiple responsibilities and side effects',
    suggestion: 'Split into useAuthState and useAuthActions hooks for better separation of concerns'
  }
];

const codeMetrics = {
  totalFiles: 156,
  totalLines: 12450,
  averageFileSize: 79,
  duplicatedCode: 8.3,
  testCoverage: 78,
  technicalDebt: 2.4, // in hours
  maintainabilityIndex: 85
};

const qualityTrends = [
  { date: '2024-01-01', coverage: 65, debt: 3.2, maintainability: 78 },
  { date: '2024-02-01', coverage: 70, debt: 2.8, maintainability: 82 },
  { date: '2024-03-01', coverage: 78, debt: 2.4, maintainability: 85 },
];

const Analysis = () => {
  const [codeIssues, setCodeIssues] = useState(mockCodeIssues);
  const [activeTab, setActiveTab] = useState("overview");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const refreshCodeAnalysis = async () => {
    setIsAnalyzing(true);
    // Simulate API call
    setTimeout(() => {
      setIsAnalyzing(false);
      console.log('Code analysis refreshed');
    }, 2000);
  };

  const viewFile = (file: string) => {
    console.log('View file:', file);
  };

  const highPriorityIssues = codeIssues.filter(issue => issue.severity === 'high');
  const mediumPriorityIssues = codeIssues.filter(issue => issue.severity === 'medium');
  const longFiles = codeIssues.filter(issue => issue.type === 'length' && issue.lines > 200);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Code Analysis</h1>
          <p className="text-muted-foreground mt-1">
            Track code quality, identify refactoring opportunities, and monitor technical debt
          </p>
        </div>
        
        <Button 
          onClick={refreshCodeAnalysis} 
          disabled={isAnalyzing}
          variant="outline"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          {isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}
        </Button>
      </div>

      {/* Quality Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">Maintainability</div>
              <CheckCircle className="h-4 w-4 text-success" />
            </div>
            <div className="text-2xl font-bold text-success">{codeMetrics.maintainabilityIndex}</div>
            <Progress value={codeMetrics.maintainabilityIndex} className="mt-2 h-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">Test Coverage</div>
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl font-bold text-primary">{codeMetrics.testCoverage}%</div>
            <Progress value={codeMetrics.testCoverage} className="mt-2 h-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-muted-foreground">Technical Debt</div>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </div>
            <div className="text-2xl font-bold text-warning">{codeMetrics.technicalDebt}h</div>
            <div className="text-xs text-muted-foreground mt-1">Estimated time to fix</div>
          </CardContent>
        </Card>
        
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
      </div>

      {/* Main Analysis Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Codebase Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{codeMetrics.totalFiles}</div>
                    <div className="text-sm text-muted-foreground">Total Files</div>
                  </div>
                  <div className="text-center p-3 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{codeMetrics.totalLines.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Lines of Code</div>
                  </div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-lg font-bold text-foreground">{codeMetrics.averageFileSize}</div>
                  <div className="text-sm text-muted-foreground">Average File Size (lines)</div>
                </div>
              </CardContent>
            </Card>

            {/* Priority Issues */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  Priority Issues
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                  <div>
                    <div className="font-medium text-destructive">High Priority</div>
                    <div className="text-sm text-muted-foreground">Needs immediate attention</div>
                  </div>
                  <Badge variant="destructive">{highPriorityIssues.length}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-warning/10 rounded-lg">
                  <div>
                    <div className="font-medium text-warning">Medium Priority</div>
                    <div className="text-sm text-muted-foreground">Should be addressed soon</div>
                  </div>
                  <Badge variant="secondary" className="bg-warning text-white">{mediumPriorityIssues.length}</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                  <div>
                    <div className="font-medium text-primary">Long Files</div>
                    <div className="text-sm text-muted-foreground">Files over 200 lines</div>
                  </div>
                  <Badge variant="secondary" className="bg-primary text-white">{longFiles.length}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="issues">
          <CodeAnalysisPanel
            issues={codeIssues}
            onRefresh={refreshCodeAnalysis}
            onViewFile={viewFile}
          />
        </TabsContent>
        
        <TabsContent value="metrics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Code Complexity</CardTitle>
                <CardDescription>Cyclomatic complexity and maintainability metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Maintainability Index</span>
                    <span className="font-medium">{codeMetrics.maintainabilityIndex}/100</span>
                  </div>
                  <Progress value={codeMetrics.maintainabilityIndex} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Test Coverage</span>
                    <span className="font-medium">{codeMetrics.testCoverage}%</span>
                  </div>
                  <Progress value={codeMetrics.testCoverage} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Code Duplication</span>
                    <span className="font-medium">{codeMetrics.duplicatedCode}%</span>
                  </div>
                  <Progress value={100 - codeMetrics.duplicatedCode} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Refactoring Recommendations</CardTitle>
                <CardDescription>Suggested improvements for better code quality</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 border border-border rounded-lg">
                  <div className="font-medium text-foreground">Extract Components</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    3 large components should be split into smaller, focused components
                  </div>
                </div>
                <div className="p-3 border border-border rounded-lg">
                  <div className="font-medium text-foreground">Remove Duplicates</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    2 files contain similar validation logic that could be shared
                  </div>
                </div>
                <div className="p-3 border border-border rounded-lg">
                  <div className="font-medium text-foreground">Add Tests</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    15 components lack adequate test coverage
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Quality Trends
              </CardTitle>
              <CardDescription>Track your code quality improvements over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Test Coverage</h4>
                  {qualityTrends.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{new Date(trend.date).toLocaleDateString()}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={trend.coverage} className="w-16 h-2" />
                        <span className="text-sm font-medium">{trend.coverage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Technical Debt</h4>
                  {qualityTrends.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{new Date(trend.date).toLocaleDateString()}</span>
                      <span className="text-sm font-medium">{trend.debt}h</span>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Maintainability</h4>
                  {qualityTrends.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{new Date(trend.date).toLocaleDateString()}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={trend.maintainability} className="w-16 h-2" />
                        <span className="text-sm font-medium">{trend.maintainability}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analysis;