import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Send, 
  Target, 
  TrendingUp, 
  Users, 
  Palette, 
  Globe, 
  Search, 
  Code, 
  Lightbulb,
  Loader2,
  MessageSquare,
  Mic,
  Volume2,
  VolumeX,
  Cpu,
  Activity,
  FolderOpen,
  BookOpen,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import { Seo } from '@/components/Seo';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    projectsAnalyzed?: number;
  };
}

interface UserContext {
  projects: any[];
  learnings: any[];
  goals: any[];
  ideas: any[];
  preferences: {
    priorities?: string[];
    interests?: string[];
  };
}

const expertiseAreas = [
  { icon: Target, label: 'Project Management', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  { icon: Users, label: 'Team Collaboration', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  { icon: TrendingUp, label: 'Business Strategy', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  { icon: Palette, label: 'Creative Design', color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-200' },
  { icon: Globe, label: 'Digital Marketing', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
  { icon: Search, label: 'SEO & Analytics', color: 'text-cyan-600', bg: 'bg-cyan-50', border: 'border-cyan-200' },
  { icon: Code, label: 'Tech Architecture', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  { icon: Lightbulb, label: 'Innovation', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
];

export default function AIAgent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [isLoadingContext, setIsLoadingContext] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserContext();
    initializeSpeechRecognition();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadUserContext = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
        return;
      }

      const [projects, learnings, goals, ideas] = await Promise.all([
        supabase.from('projects').select('*').eq('user_id', user.id),
        supabase.from('learnings').select('*').eq('user_id', user.id),
        supabase.from('goals').select('*').eq('user_id', user.id),
        supabase.from('ideas').select('*').eq('user_id', user.id),
      ]);

      const context: UserContext = {
        projects: projects.data || [],
        learnings: learnings.data || [],
        goals: goals.data || [],
        ideas: ideas.data || [],
        preferences: {
          priorities: [],
          interests: [],
        },
      };

      setUserContext(context);
      setIsLoadingContext(false);

      const welcomeMessage = `🤖 **Welcome!** I'm your Plan.AI Agent - synchronized with your workspace.\n\n📊 **Overview:** ${context.projects.length} projects, ${context.learnings.length} learnings, ${context.goals.length} goals\n\n**What would you like to work on today?**`;
      
      setMessages([{
        role: 'assistant',
        content: welcomeMessage,
        timestamp: new Date(),
        metadata: { projectsAnalyzed: context.projects.length },
      }]);
    } catch (error) {
      console.error('Error loading context:', error);
      setIsLoadingContext(false);
    }
  };

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.onresult = (event: any) => {
        setInput(event.results[0][0].transcript);
        setIsListening(false);
      };
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast.error('Speech recognition not supported');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const buildContextualPrompt = (userMessage: string) => {
    if (!userContext) return userMessage;
    let contextInfo = `**Context:** ${userContext.projects.length} projects, ${userContext.learnings.length} learnings, ${userContext.goals.length} goals\n\n`;
    const recentProjects = userContext.projects.slice(0, 3);
    if (recentProjects.length > 0) {
      contextInfo += `**Recent Projects:**\n${recentProjects.map(p => `- ${p.title} (${p.status}, ${p.progress}%)`).join('\n')}\n\n`;
    }
    return `${contextInfo}**Question:** ${userMessage}`;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const contextualPrompt = buildContextualPrompt(input);
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `You are Plan.AI Agent, an advanced AI assistant with workspace integration. Provide personalized, actionable advice based on the user's projects, learnings, and goals. Be professional, encouraging, and specific.`,
            },
            ...messages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
            { role: 'user', content: contextualPrompt },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.choices[0].message.content,
        timestamp: new Date(),
        metadata: { projectsAnalyzed: userContext?.projects.length || 0 },
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to get response');
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    { text: 'Analyze my active projects', icon: FolderOpen },
    { text: 'Suggest next steps for my goals', icon: Target },
    { text: 'Create a project roadmap', icon: Calendar },
    { text: 'Review my recent learnings', icon: BookOpen },
    { text: 'Identify project bottlenecks', icon: AlertCircle },
    { text: 'Generate project documentation', icon: MessageSquare },
  ];

  if (isLoadingContext) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-500 mx-auto mb-4" />
          <p className="text-lg font-semibold">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Seo title="AI Agent - Plan.AI" description="Your intelligent AI assistant" />
      
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        <motion.div className="mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <motion.div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-2xl">
                <Brain className="h-8 w-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                  Plan.AI Agent
                </h1>
                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                  <Activity className="h-4 w-4 text-green-500 animate-pulse" />
                  Context-Aware • Learning • Personalized
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="dark:border-white/20 dark:text-white dark:hover:bg-white/10"
            >
              {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
          </div>

          {userContext && (
            <div className="grid grid-cols-4 gap-3 mb-4">
              <Card className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-500/20 dark:to-blue-600/20">
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-xs text-blue-600/80 dark:text-blue-400/80">Projects</p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{userContext.projects.length}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-500/20 dark:to-purple-600/20">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <div>
                    <p className="text-xs text-purple-600/80 dark:text-purple-400/80">Learnings</p>
                    <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{userContext.learnings.length}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-500/20 dark:to-green-600/20">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="text-xs text-green-600/80 dark:text-green-400/80">Goals</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">{userContext.goals.length}</p>
                  </div>
                </div>
              </Card>
              <Card className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-500/20 dark:to-orange-600/20">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <div>
                    <p className="text-xs text-orange-600/80 dark:text-orange-400/80">Ideas</p>
                    <p className="text-lg font-bold text-orange-600 dark:text-orange-400">{userContext.ideas.length}</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {expertiseAreas.map((area, index) => {
              const Icon = area.icon;
              return (
                <motion.div key={area.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }}>
                  <Badge variant="secondary" className={`gap-1.5 py-2 px-3 ${area.bg} dark:bg-white/10 ${area.border} dark:border-white/20 border`}>
                    <Icon className={`h-3 w-3 ${area.color} dark:text-white`} />
                    <span className={`text-xs font-medium ${area.color} dark:text-white`}>{area.label}</span>
                  </Badge>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <Card className="flex-1 flex flex-col border-2 border-green-500/20 dark:bg-black/40 dark:border-white/20">
          <div className="p-4 border-b dark:border-white/20 bg-gradient-to-r from-green-500/5 to-emerald-500/5 dark:from-green-500/10 dark:to-emerald-500/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Cpu className="h-5 w-5 text-green-500" />
                <div>
                  <h3 className="font-semibold text-sm dark:text-white">Neural Interface Active</h3>
                  <p className="text-xs text-muted-foreground dark:text-white/70">GPT-4 • Context-Aware</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium text-green-600 dark:text-green-400">Synchronized</span>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 p-6" ref={scrollRef}>
            <AnimatePresence>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                        : 'bg-gradient-to-br from-muted to-muted/50 dark:from-white/10 dark:to-white/5 border dark:border-white/10'
                    }`}>
                      {message.role === 'assistant' && (
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <Brain className="h-4 w-4 text-green-500" />
                            <span className="text-xs font-semibold text-green-600 dark:text-green-400">Plan.AI Agent</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 hover:bg-green-500/10"
                            onClick={() => {
                              const utterance = new SpeechSynthesisUtterance(message.content);
                              speechSynthesis.speak(utterance);
                            }}
                          >
                            <Volume2 className="h-3 w-3 text-green-500" />
                          </Button>
                        </div>
                      )}
                      <p className="text-sm whitespace-pre-wrap dark:text-white">{message.content}</p>
                      <span className={`text-xs mt-2 block ${message.role === 'user' ? 'text-white/70' : 'text-muted-foreground dark:text-white/60'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="bg-muted dark:bg-white/10 rounded-2xl px-4 py-3">
                      <Loader2 className="h-5 w-5 animate-spin text-green-500" />
                    </div>
                  </motion.div>
                )}
              </div>
            </AnimatePresence>
          </ScrollArea>

          <div className="p-4 border-t dark:border-white/20">
            <div className="flex flex-wrap gap-2 mb-3">
              {quickPrompts.map((prompt) => {
                const Icon = prompt.icon;
                return (
                  <Button
                    key={prompt.text}
                    variant="outline"
                    size="sm"
                    onClick={() => setInput(prompt.text)}
                    className="text-xs dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                  >
                    <Icon className="h-3 w-3 mr-1" />
                    {prompt.text}
                  </Button>
                );
              })}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleListening}
                className={`${isListening ? 'bg-green-500/10 border-green-500' : 'dark:border-white/20 dark:text-white dark:hover:bg-white/10'}`}
              >
                <Mic className={`h-4 w-4 ${isListening ? 'text-green-500' : ''}`} />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything about your projects..."
                className="flex-1 dark:bg-white/5 dark:border-white/20 dark:text-white"
              />
              <Button onClick={handleSend} disabled={isLoading} className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
