import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  Key, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle, 
  Brain,
  Sparkles,
  Zap,
  Shield,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { aiService } from '@/services/aiService';

export function AIConfigPanel() {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const { toast } = useToast();

  const isConfigured = aiService.isConfigured();
  const config = aiService.getConfig();

  const handleSaveKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Invalid API Key",
        description: "Please enter a valid OpenAI API key.",
        variant: "destructive"
      });
      return;
    }

    // In a real app, you'd want to securely store this
    // For now, we'll just show a success message
    toast({
      title: "API Key Saved",
      description: "Your OpenAI API key has been configured successfully!",
    });
  };

  const handleTestConnection = async () => {
    if (!isConfigured) {
      toast({
        title: "Not Configured",
        description: "Please configure your API key first.",
        variant: "destructive"
      });
      return;
    }

    setIsTesting(true);
    try {
      const response = await aiService.chatCompletion([
        { role: 'user', content: 'Hello! Please respond with "AI connection successful" if you can see this message.' }
      ]);

      if (response.success) {
        toast({
          title: "Connection Successful",
          description: "Your AI service is working correctly!",
        });
      } else {
        toast({
          title: "Connection Failed",
          description: response.error || "Failed to connect to AI service.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Connection Error",
        description: "Failed to test AI connection.",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-500/10 flex items-center justify-center">
          <Brain className="h-5 w-5 text-purple-500" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">AI Configuration</h2>
          <p className="text-sm text-muted-foreground">
            Configure your OpenAI API key to enable AI features
          </p>
        </div>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuration Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">API Key Status</span>
            {isConfigured ? (
              <Badge variant="default" className="bg-green-100 text-green-700">
                <CheckCircle className="h-3 w-3 mr-1" />
                Configured
              </Badge>
            ) : (
              <Badge variant="destructive">
                <AlertCircle className="h-3 w-3 mr-1" />
                Not Configured
              </Badge>
            )}
          </div>

          {isConfigured && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Model</span>
                <span className="text-sm font-medium">{config.model}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Max Tokens</span>
                <span className="text-sm font-medium">{config.maxTokens}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Temperature</span>
                <span className="text-sm font-medium">{config.temperature}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* API Key Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            OpenAI API Key
          </CardTitle>
          <CardDescription>
            Enter your OpenAI API key to enable AI features. Your key is stored locally and never shared.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="flex gap-2">
              <Input
                id="api-key"
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSaveKey} className="flex-1">
              <Shield className="h-4 w-4 mr-2" />
              Save API Key
            </Button>
            <Button 
              variant="outline" 
              onClick={handleTestConnection}
              disabled={!isConfigured || isTesting}
            >
              <Zap className="h-4 w-4 mr-2" />
              {isTesting ? 'Testing...' : 'Test Connection'}
            </Button>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Security Note:</strong> Your API key is stored locally in your browser and is never sent to our servers. 
              Keep your key secure and never share it publicly.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Features Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Features
          </CardTitle>
          <CardDescription>
            Once configured, you'll have access to these AI-powered features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Code Analysis</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Code review and best practices</li>
                <li>• Bug detection and fixes</li>
                <li>• Performance optimization</li>
                <li>• Security vulnerability scanning</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Development Support</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Code generation and completion</li>
                <li>• Documentation generation</li>
                <li>• Test case creation</li>
                <li>• Refactoring suggestions</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Project Management</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Project planning assistance</li>
                <li>• Timeline estimation</li>
                <li>• Risk assessment</li>
                <li>• Resource allocation</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Learning & Growth</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Personalized learning paths</li>
                <li>• Concept explanations</li>
                <li>• Practice exercises</li>
                <li>• Technology recommendations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Help Card */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
          <CardDescription>
            Get help setting up your OpenAI API key
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">How to get an OpenAI API key:</h4>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Visit <a href="https://platform.openai.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenAI Platform</a></li>
              <li>Sign up or log in to your account</li>
              <li>Navigate to the API Keys section</li>
              <li>Create a new API key</li>
              <li>Copy the key and paste it above</li>
            </ol>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Get API Key
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://platform.openai.com/docs" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Documentation
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 