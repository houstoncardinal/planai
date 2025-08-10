import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Code, 
  Upload, 
  FileText, 
  Bot, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Info,
  Copy,
  Download,
  Sparkles,
  Zap,
  Shield,
  Eye,
  Settings,
  Play,
  Stop,
  RefreshCw,
  FileCode,
  GitBranch,
  Database,
  Globe,
  Smartphone
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CodeAnalysisResult {
  id: string;
  timestamp: string;
  language: string;
  code: string;
  analysis: {
    syntax: {
      valid: boolean;
      errors: string[];
      warnings: string[];
    };
    security: {
      score: number;
      vulnerabilities: string[];
      recommendations: string[];
    };
    quality: {
      score: number;
      issues: string[];
      suggestions: string[];
    };
    performance: {
      score: number;
      bottlenecks: string[];
      optimizations: string[];
    };
    bestPractices: {
      score: number;
      violations: string[];
      improvements: string[];
    };
    aiInsights: {
      summary: string;
      suggestions: string[];
      patterns: string[];
      refactoring: string[];
    };
  };
  metadata: {
    lines: number;
    complexity: number;
    maintainability: number;
    testability: number;
  };
}

interface AISettings {
  model: 'claude-3-sonnet' | 'claude-3-opus' | 'claude-3-haiku';
  analysisDepth: 'basic' | 'comprehensive' | 'expert';
  focusAreas: string[];
  includeSuggestions: boolean;
  includeRefactoring: boolean;
  includeSecurityScan: boolean;
  includePerformanceAnalysis: boolean;
}

const supportedLanguages = [
  { value: 'javascript', label: 'JavaScript', icon: <FileCode className="h-4 w-4" /> },
  { value: 'typescript', label: 'TypeScript', icon: <FileCode className="h-4 w-4" /> },
  { value: 'python', label: 'Python', icon: <FileCode className="h-4 w-4" /> },
  { value: 'java', label: 'Java', icon: <FileCode className="h-4 w-4" /> },
  { value: 'cpp', label: 'C++', icon: <FileCode className="h-4 w-4" /> },
  { value: 'csharp', label: 'C#', icon: <FileCode className="h-4 w-4" /> },
  { value: 'go', label: 'Go', icon: <FileCode className="h-4 w-4" /> },
  { value: 'rust', label: 'Rust', icon: <FileCode className="h-4 w-4" /> },
  { value: 'php', label: 'PHP', icon: <FileCode className="h-4 w-4" /> },
  { value: 'ruby', label: 'Ruby', icon: <FileCode className="h-4 w-4" /> },
  { value: 'swift', label: 'Swift', icon: <FileCode className="h-4 w-4" /> },
  { value: 'kotlin', label: 'Kotlin', icon: <FileCode className="h-4 w-4" /> },
  { value: 'scala', label: 'Scala', icon: <FileCode className="h-4 w-4" /> },
  { value: 'dart', label: 'Dart', icon: <FileCode className="h-4 w-4" /> },
  { value: 'html', label: 'HTML', icon: <Globe className="h-4 w-4" /> },
  { value: 'css', label: 'CSS', icon: <Globe className="h-4 w-4" /> },
  { value: 'sql', label: 'SQL', icon: <Database className="h-4 w-4" /> },
  { value: 'yaml', label: 'YAML', icon: <FileText className="h-4 w-4" /> },
  { value: 'json', label: 'JSON', icon: <FileText className="h-4 w-4" /> },
  { value: 'markdown', label: 'Markdown', icon: <FileText className="h-4 w-4" /> }
];

const codeTemplates = {
  javascript: `// JavaScript Template
function calculateFibonacci(n) {
  if (n <= 1) return n;
  return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);
}

// Example usage
console.log(calculateFibonacci(10));`,
  
  typescript: `// TypeScript Template
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

class UserService {
  private users: User[] = [];

  addUser(user: User): void {
    this.users.push(user);
  }

  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }
}`,
  
  python: `# Python Template
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

# Example usage
print(fibonacci(10))

class Calculator:
    def __init__(self):
        self.history = []
    
    def add(self, a, b):
        result = a + b
        self.history.append(f"{a} + {b} = {result}")
        return result`,
  
  react: `// React Component Template
import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;`
};

export function AICodeAnalyzer() {
  const [code, setCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [analysisResults, setAnalysisResults] = useState<CodeAnalysisResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('input');
  const [aiSettings, setAISettings] = useState<AISettings>({
    model: 'claude-3-sonnet',
    analysisDepth: 'comprehensive',
    focusAreas: ['security', 'performance', 'quality'],
    includeSuggestions: true,
    includeRefactoring: true,
    includeSecurityScan: true,
    includePerformanceAnalysis: true
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const analyzeCode = useCallback(async () => {
    if (!code.trim()) {
      toast({
        title: "Code Required",
        description: "Please enter or upload code to analyze.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Simulate AI analysis with Claude
      await new Promise(resolve => setTimeout(resolve, 3000));

      const result: CodeAnalysisResult = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        language: selectedLanguage,
        code,
        analysis: {
          syntax: {
            valid: Math.random() > 0.1,
            errors: Math.random() > 0.7 ? ['Missing semicolon on line 3', 'Undefined variable "x"'] : [],
            warnings: Math.random() > 0.5 ? ['Unused variable "temp"', 'Consider using const instead of let'] : []
          },
          security: {
            score: Math.floor(Math.random() * 40) + 60,
            vulnerabilities: Math.random() > 0.6 ? ['Potential SQL injection', 'Hardcoded credentials'] : [],
            recommendations: ['Use parameterized queries', 'Implement input validation', 'Use environment variables for secrets']
          },
          quality: {
            score: Math.floor(Math.random() * 30) + 70,
            issues: Math.random() > 0.5 ? ['Function too long', 'High cyclomatic complexity'] : [],
            suggestions: ['Break function into smaller parts', 'Add error handling', 'Use meaningful variable names']
          },
          performance: {
            score: Math.floor(Math.random() * 25) + 75,
            bottlenecks: Math.random() > 0.6 ? ['Inefficient algorithm', 'Memory leak potential'] : [],
            optimizations: ['Use memoization', 'Implement lazy loading', 'Optimize database queries']
          },
          bestPractices: {
            score: Math.floor(Math.random() * 20) + 80,
            violations: Math.random() > 0.4 ? ['Missing documentation', 'Inconsistent naming'] : [],
            improvements: ['Add JSDoc comments', 'Follow naming conventions', 'Implement proper error handling']
          },
          aiInsights: {
            summary: `This ${selectedLanguage} code shows ${Math.random() > 0.5 ? 'good' : 'room for improvement in'} structure and logic. The AI analysis reveals several areas for enhancement.`,
            suggestions: [
              'Consider implementing error boundaries for better error handling',
              'Add comprehensive unit tests for critical functions',
              'Use TypeScript for better type safety',
              'Implement logging for debugging and monitoring'
            ],
            patterns: [
              'Observer pattern could improve event handling',
              'Factory pattern for object creation',
              'Strategy pattern for algorithm selection'
            ],
            refactoring: [
              'Extract common functionality into utility functions',
              'Implement dependency injection for better testability',
              'Use composition over inheritance where applicable'
            ]
          }
        },
        metadata: {
          lines: code.split('\n').length,
          complexity: Math.floor(Math.random() * 10) + 1,
          maintainability: Math.floor(Math.random() * 30) + 70,
          testability: Math.floor(Math.random() * 25) + 75
        }
      };

      setAnalysisResults(prev => [result, ...prev]);
      setActiveTab('results');
      
      toast({
        title: "Analysis Complete! 🎉",
        description: "Your code has been analyzed with AI-powered insights.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [code, selectedLanguage, toast]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCode(content);
        
        // Auto-detect language from file extension
        const extension = file.name.split('.').pop()?.toLowerCase();
        const languageMap: Record<string, string> = {
          'js': 'javascript',
          'ts': 'typescript',
          'py': 'python',
          'java': 'java',
          'cpp': 'cpp',
          'cs': 'csharp',
          'go': 'go',
          'rs': 'rust',
          'php': 'php',
          'rb': 'ruby',
          'swift': 'swift',
          'kt': 'kotlin',
          'scala': 'scala',
          'dart': 'dart',
          'html': 'html',
          'css': 'css',
          'sql': 'sql',
          'yml': 'yaml',
          'yaml': 'yaml',
          'json': 'json',
          'md': 'markdown'
        };
        
        if (extension && languageMap[extension]) {
          setSelectedLanguage(languageMap[extension]);
        }
      };
      reader.readAsText(file);
    }
  }, []);

  const loadTemplate = useCallback(() => {
    const template = codeTemplates[selectedLanguage as keyof typeof codeTemplates];
    if (template) {
      setCode(template);
      toast({
        title: "Template Loaded",
        description: `Loaded ${selectedLanguage} template for analysis.`,
      });
    }
  }, [selectedLanguage, toast]);

  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code Copied",
      description: "Code has been copied to clipboard.",
    });
  }, [code, toast]);

  const downloadCode = useCallback(() => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${selectedLanguage}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [code, selectedLanguage]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (score >= 80) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>;
    if (score >= 70) return <Badge className="bg-orange-100 text-orange-800">Fair</Badge>;
    return <Badge className="bg-red-100 text-red-800">Poor</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">AI-Powered Code Analyzer</CardTitle>
              <CardDescription>
                Analyze your code with Claude AI for syntax, security, performance, and best practices
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="input" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Code Input
          </TabsTrigger>
          <TabsTrigger value="results" disabled={analysisResults.length === 0} className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Analysis Results
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            AI Settings
          </TabsTrigger>
          <TabsTrigger value="history" disabled={analysisResults.length === 0} className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-6">
          {/* Language Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCode className="h-5 w-5 text-primary" />
                Language & Input Method
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Programming Language</label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {supportedLanguages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value} className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            {lang.icon}
                            {lang.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Input Method</label>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload File
                    </Button>
                    <Button variant="outline" onClick={loadTemplate}>
                      <FileText className="mr-2 h-4 w-4" />
                      Load Template
                    </Button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".js,.ts,.py,.java,.cpp,.cs,.go,.rs,.php,.rb,.swift,.kt,.scala,.dart,.html,.css,.sql,.yml,.yaml,.json,.md"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
              
              {uploadedFile && (
                <Alert>
                  <FileText className="h-4 w-4" />
                  <AlertDescription>
                    File uploaded: <strong>{uploadedFile.name}</strong> ({uploadedFile.size} bytes)
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Code Editor */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  Code Editor
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyCode}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadCode}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={`Enter your ${selectedLanguage} code here...`}
                className="min-h-[400px] font-mono text-sm"
              />
            </CardContent>
          </Card>

          {/* Analysis Button */}
          <Card>
            <CardContent className="pt-6">
              <Button 
                onClick={analyzeCode}
                disabled={isAnalyzing || !code.trim()}
                className="w-full h-12 text-lg"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Analyzing with Claude AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Analyze Code with AI
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {analysisResults.length > 0 && (
            <>
              {analysisResults.map((result) => (
                <Card key={result.id} className="border-l-4 border-l-primary">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Bot className="h-5 w-5 text-primary" />
                          Analysis Results
                        </CardTitle>
                        <CardDescription>
                          {result.language.toUpperCase()} • {new Date(result.timestamp).toLocaleString()} • {result.metadata.lines} lines
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {getScoreBadge(result.analysis.quality.score)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Quick Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className={`text-2xl font-bold ${getScoreColor(result.analysis.security.score)}`}>
                          {result.analysis.security.score}
                        </div>
                        <div className="text-sm text-muted-foreground">Security</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className={`text-2xl font-bold ${getScoreColor(result.analysis.quality.score)}`}>
                          {result.analysis.quality.score}
                        </div>
                        <div className="text-sm text-muted-foreground">Quality</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className={`text-2xl font-bold ${getScoreColor(result.analysis.performance.score)}`}>
                          {result.analysis.performance.score}
                        </div>
                        <div className="text-sm text-muted-foreground">Performance</div>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className={`text-2xl font-bold ${getScoreColor(result.analysis.bestPractices.score)}`}>
                          {result.analysis.bestPractices.score}
                        </div>
                        <div className="text-sm text-muted-foreground">Best Practices</div>
                      </div>
                    </div>

                    {/* Detailed Analysis */}
                    <Tabs defaultValue="ai-insights" className="space-y-4">
                      <TabsList className="grid w-full grid-cols-6">
                        <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
                        <TabsTrigger value="security">Security</TabsTrigger>
                        <TabsTrigger value="quality">Quality</TabsTrigger>
                        <TabsTrigger value="performance">Performance</TabsTrigger>
                        <TabsTrigger value="syntax">Syntax</TabsTrigger>
                        <TabsTrigger value="metadata">Metadata</TabsTrigger>
                      </TabsList>

                      <TabsContent value="ai-insights" className="space-y-4">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">AI Summary</h4>
                            <p className="text-muted-foreground">{result.analysis.aiInsights.summary}</p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">Suggestions</h4>
                              <ul className="space-y-1">
                                {result.analysis.aiInsights.suggestions.map((suggestion, index) => (
                                  <li key={index} className="flex items-start gap-2 text-sm">
                                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    {suggestion}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-2">Design Patterns</h4>
                              <ul className="space-y-1">
                                {result.analysis.aiInsights.patterns.map((pattern, index) => (
                                  <li key={index} className="flex items-start gap-2 text-sm">
                                    <Zap className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                    {pattern}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2">Refactoring Opportunities</h4>
                            <ul className="space-y-1">
                              {result.analysis.aiInsights.refactoring.map((refactor, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <RefreshCw className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                                  {refactor}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="security" className="space-y-4">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary" />
                            <h4 className="font-semibold">Security Analysis</h4>
                            <Badge className={getScoreColor(result.analysis.security.score)}>
                              Score: {result.analysis.security.score}/100
                            </Badge>
                          </div>
                          
                          {result.analysis.security.vulnerabilities.length > 0 && (
                            <div>
                              <h5 className="font-medium text-red-600 mb-2">Vulnerabilities Found</h5>
                              <ul className="space-y-1">
                                {result.analysis.security.vulnerabilities.map((vuln, index) => (
                                  <li key={index} className="flex items-start gap-2 text-sm">
                                    <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                                    {vuln}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          <div>
                            <h5 className="font-medium text-green-600 mb-2">Security Recommendations</h5>
                            <ul className="space-y-1">
                              {result.analysis.security.recommendations.map((rec, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="quality" className="space-y-4">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5 text-primary" />
                            <h4 className="font-semibold">Code Quality</h4>
                            <Badge className={getScoreColor(result.analysis.quality.score)}>
                              Score: {result.analysis.quality.score}/100
                            </Badge>
                          </div>
                          
                          {result.analysis.quality.issues.length > 0 && (
                            <div>
                              <h5 className="font-medium text-orange-600 mb-2">Issues Found</h5>
                              <ul className="space-y-1">
                                {result.analysis.quality.issues.map((issue, index) => (
                                  <li key={index} className="flex items-start gap-2 text-sm">
                                    <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                    {issue}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          <div>
                            <h5 className="font-medium text-green-600 mb-2">Quality Suggestions</h5>
                            <ul className="space-y-1">
                              {result.analysis.quality.suggestions.map((suggestion, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  {suggestion}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="performance" className="space-y-4">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-primary" />
                            <h4 className="font-semibold">Performance Analysis</h4>
                            <Badge className={getScoreColor(result.analysis.performance.score)}>
                              Score: {result.analysis.performance.score}/100
                            </Badge>
                          </div>
                          
                          {result.analysis.performance.bottlenecks.length > 0 && (
                            <div>
                              <h5 className="font-medium text-red-600 mb-2">Performance Bottlenecks</h5>
                              <ul className="space-y-1">
                                {result.analysis.performance.bottlenecks.map((bottleneck, index) => (
                                  <li key={index} className="flex items-start gap-2 text-sm">
                                    <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                                    {bottleneck}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          <div>
                            <h5 className="font-medium text-green-600 mb-2">Optimization Suggestions</h5>
                            <ul className="space-y-1">
                              {result.analysis.performance.optimizations.map((optimization, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm">
                                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                                  {optimization}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="syntax" className="space-y-4">
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <Code className="h-5 w-5 text-primary" />
                            <h4 className="font-semibold">Syntax Analysis</h4>
                            <Badge className={result.analysis.syntax.valid ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                              {result.analysis.syntax.valid ? "Valid" : "Invalid"}
                            </Badge>
                          </div>
                          
                          {result.analysis.syntax.errors.length > 0 && (
                            <div>
                              <h5 className="font-medium text-red-600 mb-2">Syntax Errors</h5>
                              <ul className="space-y-1">
                                {result.analysis.syntax.errors.map((error, index) => (
                                  <li key={index} className="flex items-start gap-2 text-sm">
                                    <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                                    {error}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {result.analysis.syntax.warnings.length > 0 && (
                            <div>
                              <h5 className="font-medium text-yellow-600 mb-2">Warnings</h5>
                              <ul className="space-y-1">
                                {result.analysis.syntax.warnings.map((warning, index) => (
                                  <li key={index} className="flex items-start gap-2 text-sm">
                                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                    {warning}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="metadata" className="space-y-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <div className="text-2xl font-bold">{result.metadata.lines}</div>
                            <div className="text-sm text-muted-foreground">Lines of Code</div>
                          </div>
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <div className="text-2xl font-bold">{result.metadata.complexity}</div>
                            <div className="text-sm text-muted-foreground">Complexity</div>
                          </div>
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <div className="text-2xl font-bold">{result.metadata.maintainability}</div>
                            <div className="text-sm text-muted-foreground">Maintainability</div>
                          </div>
                          <div className="text-center p-4 bg-muted/50 rounded-lg">
                            <div className="text-2xl font-bold">{result.metadata.testability}</div>
                            <div className="text-sm text-muted-foreground">Testability</div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ))}
            </>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                AI Analysis Settings
              </CardTitle>
              <CardDescription>
                Configure Claude AI analysis parameters and focus areas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Claude Model</label>
                    <Select value={aiSettings.model} onValueChange={(value: any) => setAISettings(prev => ({ ...prev, model: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="claude-3-haiku">Claude 3 Haiku (Fast)</SelectItem>
                        <SelectItem value="claude-3-sonnet">Claude 3 Sonnet (Balanced)</SelectItem>
                        <SelectItem value="claude-3-opus">Claude 3 Opus (Most Capable)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Analysis Depth</label>
                    <Select value={aiSettings.analysisDepth} onValueChange={(value: any) => setAISettings(prev => ({ ...prev, analysisDepth: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic (Quick)</SelectItem>
                        <SelectItem value="comprehensive">Comprehensive (Recommended)</SelectItem>
                        <SelectItem value="expert">Expert (Detailed)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Focus Areas</label>
                    <div className="space-y-2">
                      {['security', 'performance', 'quality', 'best-practices', 'accessibility'].map((area) => (
                        <label key={area} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={aiSettings.focusAreas.includes(area)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setAISettings(prev => ({
                                  ...prev,
                                  focusAreas: [...prev.focusAreas, area]
                                }));
                              } else {
                                setAISettings(prev => ({
                                  ...prev,
                                  focusAreas: prev.focusAreas.filter(f => f !== area)
                                }));
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-sm capitalize">{area.replace('-', ' ')}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Analysis Options</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={aiSettings.includeSuggestions}
                      onChange={(e) => setAISettings(prev => ({ ...prev, includeSuggestions: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Include improvement suggestions</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={aiSettings.includeRefactoring}
                      onChange={(e) => setAISettings(prev => ({ ...prev, includeRefactoring: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Include refactoring recommendations</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={aiSettings.includeSecurityScan}
                      onChange={(e) => setAISettings(prev => ({ ...prev, includeSecurityScan: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Include security vulnerability scan</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={aiSettings.includePerformanceAnalysis}
                      onChange={(e) => setAISettings(prev => ({ ...prev, includePerformanceAnalysis: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Include performance analysis</span>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Analysis History
              </CardTitle>
              <CardDescription>
                View your previous code analysis results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysisResults.map((result) => (
                  <div key={result.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileCode className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{result.language.toUpperCase()}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(result.timestamp).toLocaleString()} • {result.metadata.lines} lines
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getScoreBadge(result.analysis.quality.score)}
                      <Button variant="outline" size="sm" onClick={() => setActiveTab('results')}>
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 