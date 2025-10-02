import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Code, 
  GitBranch, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Zap,
  Bot,
  Sparkles,
  FileCode,
  Shield,
  Brain,
  Loader2
} from "lucide-react";
import { AICodeAnalyzer } from "@/components/AICodeAnalyzer";
import { HelpCenter, TutorialTooltip } from "@/components/TutorialSystem";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Analysis() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [codeIssues, setCodeIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCodeIssues();
  }, []);

  const loadCodeIssues = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('code_issues')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCodeIssues(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading code issues",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const codeMetrics = {
    totalLines: 15420,
    functions: 342,
    classes: 28,
    complexity: 156,
    testCoverage: 78,
    duplicatedCode: 12,
    technicalDebt: 8,
    securityIssues: codeIssues.filter(i => i.type === 'security').length,
    performanceIssues: codeIssues.filter(i => i.type === 'performance').length,
    maintainability: 85
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "text-destructive bg-destructive/10";
      case "medium": return "text-warning bg-warning/10";
      case "low": return "text-success bg-success/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
              AI Powered
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
          <TabsList className="grid w-full grid-cols-3">
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
                {codeIssues.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No code issues found. Great job!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {codeIssues.slice(0, 5).map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                            <Code className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-medium text-foreground">{item.file}</div>
                            <div className="text-sm text-muted-foreground">{item.description}</div>
                          </div>
                        </div>
                        <Badge className={getSeverityColor(item.severity)}>
                          {item.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
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
                <div className="text-center py-8 text-muted-foreground">
                  AI insights will appear here as your codebase is analyzed
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
