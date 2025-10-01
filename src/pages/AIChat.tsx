import { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Code, 
  Target, 
  TrendingUp, 
  Zap,
  Lightbulb,
  Copy,
  RefreshCw,
  CheckCircle,
  Brain,
  MessageSquare,
  Play,
  Square
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAIChat } from '@/hooks/useAIChat';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  context?: {
    page?: string;
    action?: string;
    data?: any;
  };
}

interface QuickPrompt {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: 'code' | 'project' | 'learning' | 'analysis' | 'general';
  icon: React.ReactNode;
}

const quickPrompts: QuickPrompt[] = [
  {
    id: 'code-review',
    title: 'Code Review',
    description: 'Review my code for best practices',
    prompt: 'Please review this code for best practices, potential bugs, and improvements:',
    category: 'code',
    icon: <Code className="h-4 w-4" />
  },
  {
    id: 'bug-fix',
    title: 'Bug Fixer',
    description: 'Help me fix this bug',
    prompt: 'I have a bug in my code. Here\'s the error and the code:',
    category: 'code',
    icon: <Zap className="h-4 w-4" />
  },
  {
    id: 'project-plan',
    title: 'Project Planning',
    description: 'Create a project plan',
    prompt: 'Help me create a detailed project plan for:',
    category: 'project',
    icon: <Target className="h-4 w-4" />
  },
  {
    id: 'performance',
    title: 'Performance Optimization',
    description: 'Optimize my code performance',
    prompt: 'Please analyze and optimize this code for better performance:',
    category: 'analysis',
    icon: <TrendingUp className="h-4 w-4" />
  },
  {
    id: 'learning',
    title: 'Learning Path',
    description: 'Create a learning plan',
    prompt: 'I want to learn about this technology. Create a learning path:',
    category: 'learning',
    icon: <Lightbulb className="h-4 w-4" />
  },
  {
    id: 'code-generation',
    title: 'Code Generation',
    description: 'Generate code for me',
    prompt: 'Please generate code for this functionality:',
    category: 'code',
    icon: <Sparkles className="h-4 w-4" />
  }
];

export default function AIChat() {
  const [inputValue, setInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { messages, isLoading, sendMessage, clearMessages } = useAIChat();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) return;
    const content = inputValue;
    setInputValue('');
    await sendMessage(content);
  }, [inputValue, sendMessage]);

  const handleQuickPrompt = useCallback((prompt: QuickPrompt) => {
    setInputValue(prompt.prompt);
  }, []);

  const copyConversation = () => {
    const conversation = messages.map(msg => 
      `${msg.type === 'user' ? 'You' : 'AI Assistant'}: ${msg.content}`
    ).join('\n\n');
    
    navigator.clipboard.writeText(conversation);
    toast({
      title: "Conversation Copied",
      description: "The conversation has been copied to your clipboard."
    });
  };

  const filteredPrompts = selectedCategory === 'all' 
    ? quickPrompts 
    : quickPrompts.filter(prompt => prompt.category === selectedCategory);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/10 flex items-center justify-center">
            <Brain className="h-6 w-6 text-purple-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">AI Chat Assistant</h1>
            <p className="text-muted-foreground mt-1">
              Your AI-powered development companion
            </p>
          </div>
        </div>
        <Badge variant="default" className="bg-green-100 text-green-700">
          <CheckCircle className="h-3 w-3 mr-1" />
          Powered by OpenAI GPT-5 Mini
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Area */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  AI Chat
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={copyConversation}>
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={clearMessages}>
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                        <div className="text-sm whitespace-pre-wrap">
                          Hello! I'm your AI development assistant powered by OpenAI GPT-5 Mini. I can help you with:

• **Code Review & Analysis** - Review your code for best practices and bugs
• **Code Generation** - Generate code from descriptions
• **Project Planning** - Create detailed project plans and timelines
• **Performance Optimization** - Analyze and optimize your code
• **Learning Support** - Create learning paths and explain concepts
• **Bug Fixing** - Help identify and fix bugs

What would you like to work on today?
                        </div>
                      </div>
                    </div>
                  )}
                  {messages.map((message, idx) => (
                    <div
                      key={idx}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                        <div className="text-xs opacity-70 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-sm text-muted-foreground">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Ask me anything about development, code, projects..."
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={!inputValue.trim() || isLoading}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Prompts Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Quick Prompts
              </CardTitle>
              <CardDescription>
                Click any prompt to get started quickly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Filter by Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="code">Code & Development</SelectItem>
                    <SelectItem value="project">Project Management</SelectItem>
                    <SelectItem value="learning">Learning & Growth</SelectItem>
                    <SelectItem value="analysis">Analysis & Optimization</SelectItem>
                    <SelectItem value="general">General Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {filteredPrompts.map((prompt) => (
                    <Button
                      key={prompt.id}
                      variant="outline"
                      className="w-full justify-start h-auto p-3"
                      onClick={() => handleQuickPrompt(prompt)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          {prompt.icon}
                        </div>
                        <div className="text-left">
                          <div className="font-medium text-sm">{prompt.title}</div>
                          <div className="text-xs text-muted-foreground">{prompt.description}</div>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* AI Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">AI Provider</span>
                <Badge variant="default" className="bg-green-100 text-green-700">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Model</span>
                <span className="text-sm font-medium">GPT-5 Mini</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Status</span>
                {isLoading ? (
                  <Badge variant="secondary">
                    <Play className="h-3 w-3 mr-1" />
                    Processing
                  </Badge>
                ) : (
                                     <Badge variant="outline">
                     <Square className="h-3 w-3 mr-1" />
                     Ready
                   </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 