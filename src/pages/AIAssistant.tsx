import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AIAssistant } from "@/components/AIAssistant";
import { 
  Bot, 
  MessageSquare, 
  Code, 
  Lightbulb, 
  BookOpen, 
  Zap,
  Send,
  Sparkles,
  Brain,
  Target
} from "lucide-react";

const AIAssistantPage = () => {
  const [activeTab, setActiveTab] = useState("chat");

  const recentConversations = [
    {
      id: "1",
      title: "React Performance Optimization",
      lastMessage: "How can I optimize my React component rendering?",
      timestamp: "2 hours ago",
      type: "performance"
    },
    {
      id: "2",
      title: "Database Schema Design",
      lastMessage: "What's the best way to structure my user authentication tables?",
      timestamp: "1 day ago",
      type: "architecture"
    },
    {
      id: "3",
      title: "API Security Best Practices",
      lastMessage: "What security measures should I implement for my REST API?",
      timestamp: "3 days ago",
      type: "security"
    }
  ];

  const quickPrompts = [
    {
      title: "Code Review",
      description: "Review my code for best practices and potential issues",
      icon: Code,
      color: "text-blue-500",
      bgColor: "bg-blue-100"
    },
    {
      title: "Performance Analysis",
      description: "Analyze performance bottlenecks in my application",
      icon: Zap,
      color: "text-green-500",
      bgColor: "bg-green-100"
    },
    {
      title: "Security Audit",
      description: "Check for security vulnerabilities in my code",
      icon: Target,
      color: "text-red-500",
      bgColor: "bg-red-100"
    },
    {
      title: "Architecture Advice",
      description: "Get recommendations for system architecture",
      icon: Brain,
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">AI Assistant</h1>
              <p className="text-muted-foreground">Your intelligent development companion</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AI Assistant Component */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  AI Chat Assistant
                </CardTitle>
                <CardDescription>
                  Ask questions about development, get code reviews, or discuss architecture
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <AIAssistant />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Prompts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Quick Prompts
                </CardTitle>
                <CardDescription>
                  Common development questions and tasks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickPrompts.map((prompt) => {
                  const Icon = prompt.icon;
                  return (
                    <Button
                      key={prompt.title}
                      variant="outline"
                      className="w-full justify-start h-auto p-3 hover:scale-105 transition-all duration-200"
                    >
                      <div className={`w-8 h-8 rounded-lg ${prompt.bgColor} flex items-center justify-center mr-3`}>
                        <Icon className={`h-4 w-4 ${prompt.color}`} />
                      </div>
                      <div className="text-left">
                        <div className="font-medium">{prompt.title}</div>
                        <div className="text-xs text-muted-foreground">{prompt.description}</div>
                      </div>
                    </Button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Recent Conversations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Recent Conversations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className="p-3 rounded-lg border border-border/50 hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{conversation.title}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {conversation.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {conversation.lastMessage}
                    </p>
                    <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* AI Capabilities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Capabilities
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Code Review & Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Performance Optimization</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Security Best Practices</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Architecture Guidance</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Debugging Assistance</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage; 