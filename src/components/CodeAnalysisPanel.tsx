import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Code, AlertTriangle, RefreshCw, FileText, GitBranch } from "lucide-react";

interface CodeIssue {
  id: string;
  file: string;
  lines: number;
  type: 'length' | 'duplicate' | 'complexity';
  severity: 'low' | 'medium' | 'high';
  description: string;
  suggestion: string;
}

interface CodeAnalysisPanelProps {
  issues: CodeIssue[];
  onRefresh: () => void;
  onViewFile: (file: string) => void;
}

const severityConfig = {
  low: { color: 'bg-warning', label: 'Low' },
  medium: { color: 'bg-warning', label: 'Medium' },
  high: { color: 'bg-destructive', label: 'High' }
};

const typeConfig = {
  length: { icon: FileText, label: 'File Length', color: 'text-warning' },
  duplicate: { icon: GitBranch, label: 'Duplicate Code', color: 'text-destructive' },
  complexity: { icon: AlertTriangle, label: 'Complexity', color: 'text-warning' }
};

export function CodeAnalysisPanel({ issues, onRefresh, onViewFile }: CodeAnalysisPanelProps) {
  const highIssues = issues.filter(issue => issue.severity === 'high');
  const mediumIssues = issues.filter(issue => issue.severity === 'medium');
  const longFiles = issues.filter(issue => issue.type === 'length' && issue.lines > 200);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" />
              Code Analysis
            </CardTitle>
            <CardDescription>
              Identify refactoring opportunities and code quality issues
            </CardDescription>
          </div>
          <Button onClick={onRefresh} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-destructive/10 rounded-lg">
            <div className="text-2xl font-bold text-destructive">{highIssues.length}</div>
            <div className="text-sm text-muted-foreground">High Priority</div>
          </div>
          <div className="text-center p-3 bg-warning/10 rounded-lg">
            <div className="text-2xl font-bold text-warning">{mediumIssues.length}</div>
            <div className="text-sm text-muted-foreground">Medium Priority</div>
          </div>
          <div className="text-center p-3 bg-primary/10 rounded-lg">
            <div className="text-2xl font-bold text-primary">{longFiles.length}</div>
            <div className="text-sm text-muted-foreground">Long Files (200+ lines)</div>
          </div>
        </div>

        {/* Long Files Alert */}
        {longFiles.length > 0 && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {longFiles.length} file(s) exceed 200 lines and should be considered for refactoring.
            </AlertDescription>
          </Alert>
        )}

        {/* Issues List */}
        <div className="space-y-3">
          {issues.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Code className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No code issues detected</p>
              <p className="text-sm">Your code quality looks good!</p>
            </div>
          ) : (
            issues.map((issue) => {
              const severity = severityConfig[issue.severity];
              const type = typeConfig[issue.type];
              const Icon = type.icon;
              
              return (
                <Card key={issue.id} className="border-l-4 border-l-primary/30">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-accent/30 rounded-full">
                        <Icon className={`h-4 w-4 ${type.color}`} />
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-foreground">{issue.file}</h4>
                            <Badge variant="outline" className="text-xs">
                              {issue.lines} lines
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className={`${severity.color} text-white`}>
                              {severity.label}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {type.label}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">{issue.description}</p>
                        
                        <div className="bg-accent/20 p-3 rounded text-sm">
                          <div className="font-medium text-foreground mb-1">Suggestion:</div>
                          <div className="text-muted-foreground">{issue.suggestion}</div>
                        </div>
                        
                        <Button 
                          onClick={() => onViewFile(issue.file)} 
                          variant="outline" 
                          size="sm"
                          className="mt-2"
                        >
                          View File
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}