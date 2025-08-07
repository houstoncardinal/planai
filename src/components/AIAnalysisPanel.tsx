import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAIAnalysis, AIAnalysisResult } from '@/hooks/useAIAnalysis';
import { 
  Brain, 
  Zap, 
  AlertTriangle, 
  TrendingUp, 
  Code, 
  BookOpen, 
  Target, 
  Clock,
  Settings,
  Lightbulb,
  ShieldCheck,
  BarChart3,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIAnalysisPanelProps {
  projectId?: string;
  onInsightApplied?: (insight: any) => void;
}

export function AIAnalysisPanel({ projectId, onInsightApplied }: AIAnalysisPanelProps) {
  const { isAnalyzing, settings, lastAnalysis, runAnalysis, updateSettings } = useAIAnalysis();
  const [activeTab, setActiveTab] = useState('overview');
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Auto-run analysis on component mount if enabled
    if (settings.analysisFrequency === 'daily' && !lastAnalysis) {
      handleRunAnalysis();
    }
  }, []);

  const handleRunAnalysis = async () => {
    try {
      await runAnalysis(projectId);
      toast({
        title: "AI Analysis Complete",
        description: "Your project has been analyzed with actionable insights generated.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to complete AI analysis. Please try again.",
        variant: "destructive"
      });
    }
  };

  const applyInsight = (insight: any) => {
    onInsightApplied?.(insight);
    toast({
      title: "Insight Applied",
      description: "The AI recommendation has been implemented.",
    });
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      high: 'destructive',
      medium: 'default',
      low: 'secondary'
    };
    return variants[priority as keyof typeof variants] || 'default';
  };

  return (
    <div className="space-y-6">
      {/* Header with AI Branding */}
      <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  AI Project Analysis
                  <Sparkles className="h-5 w-5 text-primary" />
                </CardTitle>
                <CardDescription className="text-base">
                  Advanced insights powered by machine learning algorithms
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button
                onClick={handleRunAnalysis}
                disabled={isAnalyzing}
                className="bg-gradient-to-r from-primary to-primary-glow text-white"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Run Analysis
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        {showSettings && (
          <CardContent className="border-t border-primary/20 bg-background/50">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">AI Provider</label>
                  <Select value={settings.provider} onValueChange={(value: any) => updateSettings({ provider: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="openai">OpenAI GPT-4</SelectItem>
                      <SelectItem value="anthropic">Anthropic Claude</SelectItem>
                      <SelectItem value="local">Local Model</SelectItem>
                      <SelectItem value="custom">Custom Endpoint</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Analysis Frequency</label>
                  <Select value={settings.analysisFrequency} onValueChange={(value: any) => updateSettings({ analysisFrequency: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual Only</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="on-milestone">On Milestones</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Enabled Features</h4>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(settings.enabledFeatures).map(([key, enabled]) => (
                    <div key={key} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <Switch
                        checked={enabled}
                        onCheckedChange={(checked) => 
                          updateSettings({
                            enabledFeatures: { ...settings.enabledFeatures, [key]: checked }
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Analysis Results */}
      {lastAnalysis ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="optimization">Optimization</TabsTrigger>
            <TabsTrigger value="quality">Code Quality</TabsTrigger>
            <TabsTrigger value="learning">Learning</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Risk Assessment */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className={`h-5 w-5 ${getRiskColor(lastAnalysis.projectOptimization.riskAssessment.level)}`} />
                    <div>
                      <div className="text-sm text-muted-foreground">Risk Level</div>
                      <div className={`text-lg font-bold capitalize ${getRiskColor(lastAnalysis.projectOptimization.riskAssessment.level)}`}>
                        {lastAnalysis.projectOptimization.riskAssessment.level}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Technical Debt */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Code className="h-5 w-5 text-warning" />
                    <div>
                      <div className="text-sm text-muted-foreground">Technical Debt</div>
                      <div className="text-lg font-bold text-warning">
                        {lastAnalysis.codeQualityInsights.technicalDebtScore}/100
                      </div>
                    </div>
                  </div>
                  <Progress value={lastAnalysis.codeQualityInsights.technicalDebtScore} className="mt-2" />
                </CardContent>
              </Card>

              {/* Learning Velocity */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Learning Velocity</div>
                      <div className="text-lg font-bold text-primary">
                        {lastAnalysis.learningInsights.learningVelocity.current}/week
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    Key Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {lastAnalysis.projectOptimization.suggestedSteps.slice(0, 3).map((step, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{step.title}</div>
                        <div className="text-sm text-muted-foreground">{step.estimatedHours}h estimated</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getPriorityBadge(step.priority) as any}>
                          {step.priority}
                        </Badge>
                        <Button size="sm" variant="outline" onClick={() => applyInsight(step)}>
                          Apply
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    Risk Factors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {lastAnalysis.projectOptimization.riskAssessment.factors.map((factor, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-warning" />
                        {factor}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="optimization" className="space-y-4">
            {/* ... Additional optimization content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Suggested Steps
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {lastAnalysis.projectOptimization.suggestedSteps.map((step, index) => (
                  <Card key={index} className="border-l-4 border-l-primary/30">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground">{step.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{step.estimatedHours}h</span>
                            </div>
                            <Badge variant={getPriorityBadge(step.priority) as any}>
                              {step.priority}
                            </Badge>
                          </div>
                        </div>
                        <Button variant="outline" onClick={() => applyInsight(step)}>
                          Add to Project
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quality" className="space-y-4">
            {/* Code Quality insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Refactoring Priorities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {lastAnalysis.codeQualityInsights.refactoringPriorities.map((item, index) => (
                    <div key={index} className="p-3 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <code className="text-sm font-mono">{item.file}</code>
                        <Badge variant={getPriorityBadge(item.impact) as any}>
                          {item.impact} impact
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.reason}</p>
                      <div className="text-xs text-muted-foreground mt-1">
                        Estimated effort: {item.effort} hours
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Optimizations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {lastAnalysis.codeQualityInsights.performanceOptimizations.map((optimization, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Zap className="h-4 w-4 text-primary shrink-0" />
                      {optimization}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="learning" className="space-y-4">
            {/* Learning recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Skill Development
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {lastAnalysis.learningInsights.recommendedLearning.map((learning, index) => (
                    <div key={index} className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                      <h4 className="font-medium text-foreground">{learning.topic}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{learning.reason}</p>
                      <div className="mt-2">
                        <div className="text-xs font-medium text-muted-foreground mb-1">Resources:</div>
                        {learning.resources.map((resource, idx) => (
                          <div key={idx} className="text-xs text-primary">• {resource}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Learning Velocity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current Velocity</span>
                      <span className="font-medium">{lastAnalysis.learningInsights.learningVelocity.current}/week</span>
                    </div>
                    <Progress value={lastAnalysis.learningInsights.learningVelocity.current * 20} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Recommended</span>
                      <span className="font-medium text-primary">{lastAnalysis.learningInsights.learningVelocity.recommended}/week</span>
                    </div>
                    <Progress value={lastAnalysis.learningInsights.learningVelocity.recommended * 20} />
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Improvement Strategies:</div>
                    {lastAnalysis.learningInsights.learningVelocity.improvement.map((strategy, index) => (
                      <div key={index} className="text-xs text-muted-foreground">
                        • {strategy}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <Card className="border-dashed border-2 border-muted-foreground/25">
          <CardContent className="flex items-center justify-center h-48 text-center">
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto">
                <Brain className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">AI Analysis Ready</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Run an analysis to get AI-powered insights and recommendations
                </p>
              </div>
              <Button onClick={handleRunAnalysis} disabled={isAnalyzing}>
                <Brain className="h-4 w-4 mr-2" />
                Start Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}