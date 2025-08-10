import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Lock, 
  Eye, 
  Key,
  Scan,
  Settings,
  Clock,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  XCircle,
  AlertCircle
} from "lucide-react";

const SecurityPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const securityMetrics = {
    overallScore: 87,
    vulnerabilities: 3,
    criticalIssues: 1,
    resolvedIssues: 24,
    lastScan: "2 hours ago",
    nextScan: "6 hours"
  };

  const securityIssues = [
    {
      id: "1",
      title: "SQL Injection Vulnerability",
      description: "User input not properly sanitized in login form",
      severity: "critical",
      cve: "CVE-2024-001",
      status: "open",
      affectedFiles: ["src/api/auth.ts", "src/components/LoginForm.tsx"],
      recommendation: "Use parameterized queries and input validation"
    },
    {
      id: "2",
      title: "XSS in User Comments",
      description: "User-generated content not properly escaped",
      severity: "high",
      cve: "CVE-2024-002",
      status: "in-progress",
      affectedFiles: ["src/components/CommentSection.tsx"],
      recommendation: "Implement proper HTML escaping and CSP headers"
    },
    {
      id: "3",
      title: "Weak Password Policy",
      description: "Password requirements not enforced",
      severity: "medium",
      cve: "CVE-2024-003",
      status: "resolved",
      affectedFiles: ["src/utils/validation.ts"],
      recommendation: "Enforce strong password requirements"
    }
  ];

  const securityChecks = [
    {
      title: "Authentication",
      status: "passed",
      score: 95,
      checks: ["JWT tokens", "Password hashing", "Session management"]
    },
    {
      title: "Authorization",
      status: "passed",
      score: 88,
      checks: ["Role-based access", "Permission checks", "API security"]
    },
    {
      title: "Input Validation",
      status: "failed",
      score: 72,
      checks: ["SQL injection", "XSS prevention", "File upload security"]
    },
    {
      title: "Data Protection",
      status: "passed",
      score: 91,
      checks: ["Encryption at rest", "HTTPS enforcement", "Data sanitization"]
    }
  ];

  const recentScans = [
    {
      id: "1",
      date: "2024-01-29 14:30",
      type: "Full Security Scan",
      status: "completed",
      issues: 3,
      score: 87
    },
    {
      id: "2",
      date: "2024-01-28 10:15",
      type: "Dependency Scan",
      status: "completed",
      issues: 1,
      score: 92
    },
    {
      id: "3",
      date: "2024-01-27 16:45",
      type: "Code Analysis",
      status: "completed",
      issues: 5,
      score: 85
    }
  ];

  const quickActions = [
    {
      title: "Run Security Scan",
      description: "Execute comprehensive security analysis",
      icon: Scan,
      color: "text-blue-500",
      bgColor: "bg-blue-100"
    },
    {
      title: "Dependency Check",
      description: "Scan for vulnerable dependencies",
      icon: AlertTriangle,
      color: "text-red-500",
      bgColor: "bg-red-100"
    },
    {
      title: "Code Analysis",
      description: "Analyze code for security issues",
      icon: Eye,
      color: "text-green-500",
      bgColor: "bg-green-100"
    },
    {
      title: "Penetration Test",
      description: "Run automated penetration tests",
      icon: Shield,
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-lime-500 to-green-600 flex items-center justify-center shadow-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Security</h1>
              <p className="text-muted-foreground">Monitor and protect your application security</p>
            </div>
          </div>
        </div>

        {/* Security Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Security Score</p>
                  <p className="text-2xl font-bold">{securityMetrics.overallScore}/100</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="mt-2">
                <Progress value={securityMetrics.overallScore} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Vulnerabilities</p>
                  <p className="text-2xl font-bold text-red-600">{securityMetrics.vulnerabilities}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <ArrowUp className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-500">+1 from yesterday</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical Issues</p>
                  <p className="text-2xl font-bold text-orange-600">{securityMetrics.criticalIssues}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Requires immediate attention</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Resolved Issues</p>
                  <p className="text-2xl font-bold text-green-600">{securityMetrics.resolvedIssues}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <ArrowUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-500">+3 this week</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Last Scan</p>
                  <p className="text-2xl font-bold">{securityMetrics.lastScan}</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Next scan in {securityMetrics.nextScan}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Security Trend</p>
                  <p className="text-2xl font-bold text-green-600">+12%</p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-cyan-100 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-cyan-600" />
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <ArrowUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-500">Improving over time</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Security Analysis */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="issues">Vulnerabilities</TabsTrigger>
                    <TabsTrigger value="checks">Security Checks</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsContent value="overview" className="h-full space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {securityChecks.map((check) => (
                        <Card key={check.title}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg">{check.title}</CardTitle>
                              <Badge 
                                variant={check.status === 'passed' ? 'default' : 'destructive'}
                                className="text-xs"
                              >
                                {check.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="mb-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm text-muted-foreground">Score</span>
                                <span className="text-sm font-medium">{check.score}%</span>
                              </div>
                              <Progress value={check.score} className="h-2" />
                            </div>
                            <div className="space-y-1">
                              {check.checks.map((item) => (
                                <div key={item} className="flex items-center gap-2">
                                  <CheckCircle className="h-3 w-3 text-green-500" />
                                  <span className="text-xs">{item}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="issues" className="h-full space-y-4">
                    <div className="space-y-4">
                      {securityIssues.map((issue) => (
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="font-medium mb-1">CVE: {issue.cve}</p>
                                    <p className="text-muted-foreground">Affected Files:</p>
                                    <ul className="text-xs text-muted-foreground list-disc list-inside">
                                      {issue.affectedFiles.map((file) => (
                                        <li key={file}>{file}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <p className="font-medium mb-1">Recommendation:</p>
                                    <p className="text-xs text-muted-foreground">{issue.recommendation}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="checks" className="h-full space-y-4">
                    <div className="space-y-4">
                      {recentScans.map((scan) => (
                        <Card key={scan.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h4 className="font-medium">{scan.type}</h4>
                                  <Badge 
                                    variant={scan.status === 'completed' ? 'default' : 'secondary'}
                                    className="text-xs"
                                  >
                                    {scan.status}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{scan.date}</p>
                                <div className="flex items-center gap-4 text-sm">
                                  <span className="text-red-600 font-medium">{scan.issues} issues found</span>
                                  <span className="text-green-600">Score: {scan.score}/100</span>
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
                  <Shield className="h-5 w-5" />
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

            {/* Security Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Security Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <div className="flex items-center gap-2 mb-1">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium text-red-800">Critical Vulnerability</span>
                  </div>
                  <p className="text-xs text-red-700">SQL injection detected in auth endpoint</p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-800">XSS Warning</span>
                  </div>
                  <p className="text-xs text-yellow-700">User input not properly sanitized</p>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Auto-scanning</span>
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Vulnerability alerts</span>
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Dependency monitoring</span>
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Code analysis</span>
                  <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityPage; 