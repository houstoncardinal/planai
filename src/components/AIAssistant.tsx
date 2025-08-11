import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bot, 
  MessageSquare, 
  Send, 
  Sparkles, 
  Zap, 
  Lightbulb, 
  Code, 
  Target, 
  TrendingUp, 
  Settings,
  Mic,
  MicOff,
  FileText,
  Copy,
  Download,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  BookOpen,
  HelpCircle,
  Brain,
  Cpu,
  Database,
  Globe,
  Smartphone,
  Shield,
  Palette,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAI } from '@/hooks/useAI';

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

interface AIAssistantState {
  isOpen: boolean;
  isMinimized: boolean;
  isListening: boolean;
  currentContext: string;
  suggestions: string[];
}

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  category: 'code' | 'project' | 'learning' | 'analysis' | 'general';
}

const quickActions: QuickAction[] = [
  {
    id: 'code-review',
    title: 'Code Review',
    description: 'Review your code for best practices and improvements',
    icon: <Code className="h-4 w-4" />,
    action: () => {},
    category: 'code'
  },
  {
    id: 'bug-fix',
    title: 'Bug Fixer',
    description: 'Help identify and fix bugs in your code',
    icon: <Zap className="h-4 w-4" />,
    action: () => {},
    category: 'code'
  },
  {
    id: 'project-plan',
    title: 'Project Planning',
    description: 'Create a detailed project plan and timeline',
    icon: <Target className="h-4 w-4" />,
    action: () => {},
    category: 'project'
  },
  {
    id: 'learning-path',
    title: 'Learning Path',
    description: 'Get personalized learning recommendations',
    icon: <BookOpen className="h-4 w-4" />,
    action: () => {},
    category: 'learning'
  },
  {
    id: 'performance-optimization',
    title: 'Performance Optimization',
    description: 'Analyze and optimize your application performance',
    icon: <TrendingUp className="h-4 w-4" />,
    action: () => {},
    category: 'analysis'
  },
  {
    id: 'security-audit',
    title: 'Security Audit',
    description: 'Audit your code for security vulnerabilities',
    icon: <Shield className="h-4 w-4" />,
    action: () => {},
    category: 'analysis'
  },
  {
    id: 'ui-improvements',
    title: 'UI Improvements',
    description: 'Get suggestions for UI/UX improvements',
    icon: <Palette className="h-4 w-4" />,
    action: () => {},
    category: 'general'
  },
  {
    id: 'database-optimization',
    title: 'Database Optimization',
    description: 'Optimize your database queries and schema',
    icon: <Database className="h-4 w-4" />,
    action: () => {},
    category: 'analysis'
  }
];

const contextSuggestions = {
  'projects': [
    'Help me create a new project plan',
    'Analyze my project timeline',
    'Suggest improvements for my current project',
    'Help me estimate project completion time'
  ],
  'code-analysis': [
    'Review my code for best practices',
    'Help me optimize this function',
    'Identify potential bugs in my code',
    'Suggest refactoring opportunities'
  ],
  'learnings': [
    'Create a learning plan for React',
    'Suggest resources for TypeScript',
    'Help me understand this concept',
    'Create practice exercises for me'
  ],
  'goals': [
    'Help me set realistic goals',
    'Track my progress towards goals',
    'Suggest milestones for my goals',
    'Help me prioritize my goals'
  ],
  'general': [
    'Help me with development best practices',
    'Explain a technical concept',
    'Suggest tools for my workflow',
    'Help me debug an issue'
  ]
};

export function AIAssistant() {
  const [state, setState] = useState<AIAssistantState>({
    isOpen: true, // Start with AI Assistant open
    isMinimized: false,
    isListening: false,
    currentContext: 'general',
    suggestions: contextSuggestions.general
  });
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your AI development assistant powered by OpenAI. I can help you with code reviews, project planning, learning recommendations, and much more. What would you like to work on today?",
      timestamp: new Date().toISOString()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { sendMessage, isLoading, error, isConfigured, data } = useAI();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle AI responses and errors
  useEffect(() => {
    if (error) {
      toast({
        title: "AI Error",
        description: error,
        variant: "destructive"
      });
      setIsTyping(false);
    }
  }, [error, toast]);

  // Update the last message with AI response
  useEffect(() => {
    if (!isLoading && !error && data) {
      // Update the last message with the actual AI response
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && lastMessage.type === 'assistant' && lastMessage.content === 'Thinking...') {
          lastMessage.content = data.choices?.[0]?.message?.content || 'No response received';
        }
        return newMessages;
      });
      setIsTyping(false);
    }
  }, [isLoading, error, data]);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) return;

    if (!isConfigured) {
      toast({
        title: "AI Not Configured",
        description: "Please check your OpenAI API key configuration.",
        variant: "destructive"
      });
      return;
    }

    const userMessage: Message = {
      id: crypto.randomUUID(),
      type: 'user',
      content: inputValue,
      timestamp: new Date().toISOString(),
      context: {
        page: state.currentContext,
        action: 'user_input'
      }
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      await sendMessage(currentInput);
      
      // The AI response will be handled by the useAI hook
      // We'll add a placeholder message that will be updated
      const aiResponse: Message = {
        id: crypto.randomUUID(),
        type: 'assistant',
        content: "Thinking...",
        timestamp: new Date().toISOString(),
        context: {
          page: state.currentContext,
          action: 'ai_response'
        }
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
      setIsTyping(false);
    }
  }, [inputValue, state.currentContext, toast, sendMessage, isConfigured]);

  const generateAIResponse = (userInput: string, context: string): string => {
    const input = userInput.toLowerCase();
    
    // Context-specific responses
    if (context === 'projects') {
      if (input.includes('create') || input.includes('new project')) {
        return "I'll help you create a new project plan! Let me gather some information:\n\n1. What type of project are you building? (web app, mobile app, API, etc.)\n2. What's your target timeline?\n3. What technologies do you plan to use?\n4. What's your team size?\n\nOnce you provide these details, I can create a comprehensive project plan with milestones, tasks, and resource allocation.";
      }
      if (input.includes('timeline') || input.includes('schedule')) {
        return "I can help you analyze and optimize your project timeline. To provide the best recommendations, I need to know:\n\n1. What's your current project status?\n2. What are the main milestones?\n3. Are there any blockers or dependencies?\n4. What's your team's velocity?\n\nI can then suggest timeline optimizations and help you identify potential risks.";
      }
    }
    
    if (context === 'code-analysis') {
      if (input.includes('review') || input.includes('code')) {
        return "I'd be happy to review your code! Please share the code you'd like me to analyze. I can help with:\n\n• Code quality and best practices\n• Performance optimizations\n• Security vulnerabilities\n• Refactoring suggestions\n• Testing strategies\n\nYou can paste your code directly or upload a file, and I'll provide detailed feedback.";
      }
      if (input.includes('bug') || input.includes('error')) {
        return "I can help you debug that issue! Please share:\n\n1. The error message or unexpected behavior\n2. The relevant code snippet\n3. What you expected to happen\n4. What actually happened\n5. Any error logs or stack traces\n\nI'll analyze the problem and suggest solutions to fix it.";
      }
    }
    
    if (context === 'learnings') {
      if (input.includes('learn') || input.includes('study')) {
        return "I'll create a personalized learning path for you! To make it most effective, please tell me:\n\n1. What technology or concept do you want to learn?\n2. What's your current skill level? (beginner, intermediate, advanced)\n3. How much time can you dedicate per week?\n4. Do you prefer hands-on projects, reading, or video tutorials?\n5. What's your learning goal? (career advancement, personal project, etc.)\n\nI'll then create a structured learning plan with resources, exercises, and milestones.";
      }
    }

    // General responses
    if (input.includes('hello') || input.includes('hi')) {
      return "Hello! I'm here to help you with your development tasks. I can assist with code reviews, project planning, learning recommendations, debugging, and much more. What would you like to work on?";
    }
    
    if (input.includes('help') || input.includes('what can you do')) {
      return "I'm your AI development assistant! Here's what I can help you with:\n\n🔧 **Code & Development**\n• Code reviews and best practices\n• Bug fixing and debugging\n• Performance optimization\n• Security audits\n• Refactoring suggestions\n\n📋 **Project Management**\n• Project planning and timelines\n• Task breakdown and estimation\n• Risk assessment\n• Resource allocation\n\n📚 **Learning & Growth**\n• Personalized learning paths\n• Technology recommendations\n• Concept explanations\n• Practice exercises\n\n🎯 **General Support**\n• Development best practices\n• Tool recommendations\n• Workflow optimization\n• Problem-solving\n\nJust let me know what you need help with!";
    }

    // Default response
    return "I understand you're asking about: " + userInput + "\n\nI'd be happy to help! Could you provide more specific details about what you'd like me to assist you with? For example:\n\n• If it's about code, please share the relevant code snippet\n• If it's about a project, tell me about the requirements and constraints\n• If it's about learning, let me know your current level and goals\n\nThis will help me provide more targeted and useful assistance.";
  };

  const handleQuickAction = useCallback((action: QuickAction) => {
    const actionMessage: Message = {
      id: crypto.randomUUID(),
      type: 'user',
      content: `I want to use: ${action.title}`,
      timestamp: new Date().toISOString(),
      context: {
        page: state.currentContext,
        action: 'quick_action',
        data: { actionId: action.id }
      }
    };

    setMessages(prev => [...prev, actionMessage]);
    setIsTyping(true);

    // Simulate AI response for quick action
    setTimeout(() => {
      const aiResponse: Message = {
        id: crypto.randomUUID(),
        type: 'assistant',
        content: `Great choice! Let's work on ${action.title.toLowerCase()}.\n\n${action.description}\n\nTo get started, please provide the details or code you'd like me to analyze. I'll guide you through the process step by step.`,
        timestamp: new Date().toISOString(),
        context: {
          page: state.currentContext,
          action: 'quick_action_response',
          data: { actionId: action.id }
        }
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  }, [state.currentContext]);

  const toggleAssistant = () => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
  };

  const toggleMinimize = () => {
    setState(prev => ({ ...prev, isMinimized: !prev.isMinimized }));
  };

  const toggleListening = () => {
    setState(prev => {
      const newListeningState = !prev.isListening;
      toast({
        title: newListeningState ? "Voice input enabled" : "Voice input disabled",
        description: newListeningState ? "You can now speak to interact with the AI assistant" : "Click the microphone again to enable voice input"
      });
      return { ...prev, isListening: newListeningState };
    });
  };

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

  const clearConversation = () => {
    setMessages([{
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your AI development assistant. I can help you with code reviews, project planning, learning recommendations, and much more. What would you like to work on today?",
      timestamp: new Date().toISOString()
    }]);
    toast({
      title: "Conversation Cleared",
      description: "The conversation has been reset."
    });
  };

  const filteredActions = selectedCategory === 'all' 
    ? quickActions 
    : quickActions.filter(action => action.category === selectedCategory);

  if (!state.isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={toggleAssistant}
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96">
      <Card className="shadow-2xl border-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">AI Assistant</CardTitle>
                <CardDescription className="text-xs">
                  Powered by Claude AI
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleListening}
                className={state.isListening ? "text-red-500" : ""}
              >
                {state.isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMinimize}
              >
                {state.isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleAssistant}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!state.isMinimized && (
          <CardContent className="pt-0">
            <Tabs defaultValue="chat" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="actions">Quick Actions</TabsTrigger>
                <TabsTrigger value="context">Context</TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="space-y-4">
                {/* Messages */}
                <ScrollArea className="h-64 border rounded-lg p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
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
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            <span className="text-sm text-muted-foreground">AI is typing...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input */}
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
                    placeholder="Ask me anything..."
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isTyping}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyConversation}>
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={clearConversation}>
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Clear
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    {isConfigured ? (
                      <Badge variant="secondary" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        OpenAI GPT-4
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-xs">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Not Configured
                      </Badge>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="actions" className="space-y-4">
                <div className="space-y-4">
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

                  <ScrollArea className="h-64">
                    <div className="grid grid-cols-1 gap-3">
                      {filteredActions.map((action) => (
                        <Button
                          key={action.id}
                          variant="outline"
                          className="h-auto p-3 justify-start"
                          onClick={() => handleQuickAction(action)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              {action.icon}
                            </div>
                            <div className="text-left">
                              <div className="font-medium text-sm">{action.title}</div>
                              <div className="text-xs text-muted-foreground">{action.description}</div>
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              <TabsContent value="context" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Current Context</label>
                    <Select 
                      value={state.currentContext} 
                      onValueChange={(value) => {
                        setState(prev => ({ 
                          ...prev, 
                          currentContext: value,
                          suggestions: contextSuggestions[value as keyof typeof contextSuggestions] || contextSuggestions.general
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="projects">Projects</SelectItem>
                        <SelectItem value="code-analysis">Code Analysis</SelectItem>
                        <SelectItem value="learnings">Learnings</SelectItem>
                        <SelectItem value="goals">Goals</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Suggested Questions</label>
                    <div className="space-y-2 mt-2">
                      {state.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-left h-auto p-2"
                          onClick={() => {
                            setInputValue(suggestion);
                            setState(prev => ({ ...prev, isOpen: true }));
                          }}
                        >
                          <Lightbulb className="h-3 w-3 mr-2 text-primary" />
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        )}
      </Card>
    </div>
  );
} 