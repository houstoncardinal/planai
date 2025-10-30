import React, { useState, useCallback, useEffect, createContext, useContext } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  HelpCircle, 
  Play, 
  BookOpen, 
  Video, 
  FileText, 
  Lightbulb, 
  ArrowRight, 
  ArrowLeft,
  SkipForward,
  CheckCircle,
  X,
  Settings,
  Sparkles,
  Bot,
  Code,
  Target,
  TrendingUp,
  Users,
  Database,
  Shield,
  Palette,
  Zap,
  Globe,
  Smartphone,
  Layers,
  Brain,
  Eye,
  EyeOff
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target: string; // CSS selector for the element to highlight
  position: 'top' | 'bottom' | 'left' | 'right';
  content: string;
  videoUrl?: string;
  documentUrl?: string;
  completed?: boolean;
}

interface FeatureGuide {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  steps: TutorialStep[];
  videoTutorials: VideoTutorial[];
  documents: LearningDocument[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
}

interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  url: string;
  thumbnail: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface LearningDocument {
  id: string;
  title: string;
  description: string;
  type: 'pdf' | 'markdown' | 'interactive';
  url: string;
  estimatedReadTime: string;
  tags: string[];
}

interface TutorialContextType {
  isTutorialMode: boolean;
  currentTutorial: string | null;
  currentStep: number;
  showTooltips: boolean;
  completedTutorials: Set<string>;
  startTutorial: (tutorialId: string) => void;
  endTutorial: () => void;
  nextStep: () => void;
  previousStep: () => void;
  completeStep: (stepId: string) => void;
  toggleTooltips: () => void;
  markTutorialComplete: (tutorialId: string) => void;
}

const TutorialContext = createContext<TutorialContextType | null>(null);

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
};

const featureGuides: FeatureGuide[] = [
  {
    id: 'dashboard-overview',
    title: 'Dashboard Overview',
    description: 'Learn how to navigate and use the main dashboard effectively',
    icon: <Target className="h-5 w-5" />,
    category: 'Navigation',
    difficulty: 'beginner',
    estimatedTime: '5 minutes',
    steps: [
      {
        id: 'dashboard-1',
        title: 'Welcome to DevTracker',
        description: 'Get familiar with the main dashboard layout',
        target: '.dashboard-header',
        position: 'bottom',
        content: 'This is your main dashboard where you can see an overview of all your projects, recent activities, and quick actions. The sidebar on the left contains all the main navigation options.',
        videoUrl: 'https://example.com/videos/dashboard-overview.mp4',
        documentUrl: '/docs/dashboard-guide.pdf'
      },
      {
        id: 'dashboard-2',
        title: 'Project Cards',
        description: 'Understanding project cards and their information',
        target: '.project-card',
        position: 'top',
        content: 'Each project card shows key information like progress, status, and team members. Click on any card to view detailed project information.',
        videoUrl: 'https://example.com/videos/project-cards.mp4'
      },
      {
        id: 'dashboard-3',
        title: 'Quick Actions',
        description: 'Using quick action buttons for common tasks',
        target: '.quick-actions',
        position: 'right',
        content: 'Use these quick action buttons to create new projects, add ideas, or start a code analysis. They provide shortcuts to the most common tasks.',
        videoUrl: 'https://example.com/videos/quick-actions.mp4'
      }
    ],
    videoTutorials: [
      {
        id: 'dashboard-video-1',
        title: 'Dashboard Navigation Basics',
        description: 'Learn the fundamentals of navigating the dashboard',
        duration: '3:45',
        url: 'https://example.com/videos/dashboard-basics.mp4',
        thumbnail: '/thumbnails/dashboard-basics.jpg',
        tags: ['navigation', 'basics', 'dashboard'],
        difficulty: 'beginner'
      },
      {
        id: 'dashboard-video-2',
        title: 'Customizing Your Dashboard',
        description: 'How to personalize your dashboard layout',
        duration: '5:20',
        url: 'https://example.com/videos/dashboard-customization.mp4',
        thumbnail: '/thumbnails/dashboard-custom.jpg',
        tags: ['customization', 'layout', 'personalization'],
        difficulty: 'intermediate'
      }
    ],
    documents: [
      {
        id: 'dashboard-doc-1',
        title: 'Dashboard User Guide',
        description: 'Comprehensive guide to using the dashboard',
        type: 'pdf',
        url: '/docs/dashboard-user-guide.pdf',
        estimatedReadTime: '10 minutes',
        tags: ['guide', 'dashboard', 'user-manual']
      },
      {
        id: 'dashboard-doc-2',
        title: 'Dashboard Best Practices',
        description: 'Tips and tricks for optimal dashboard usage',
        type: 'markdown',
        url: '/docs/dashboard-best-practices.md',
        estimatedReadTime: '5 minutes',
        tags: ['best-practices', 'tips', 'optimization']
      }
    ]
  },
  {
    id: 'ai-code-analyzer',
    title: 'AI Code Analyzer',
    description: 'Master the AI-powered code analysis features',
    icon: <Bot className="h-5 w-5" />,
    category: 'AI Features',
    difficulty: 'intermediate',
    estimatedTime: '15 minutes',
    steps: [
      {
        id: 'analyzer-1',
        title: 'Getting Started with AI Analysis',
        description: 'Learn how to use the AI code analyzer',
        target: '.ai-analyzer-tab',
        position: 'bottom',
        content: 'The AI Code Analyzer uses Claude AI to provide comprehensive code analysis. You can analyze code in multiple languages and get detailed insights.',
        videoUrl: 'https://example.com/videos/ai-analyzer-intro.mp4',
        documentUrl: '/docs/ai-analyzer-guide.pdf'
      },
      {
        id: 'analyzer-2',
        title: 'Uploading and Analyzing Code',
        description: 'How to upload files and get AI analysis',
        target: '.code-input-area',
        position: 'right',
        content: 'You can paste code directly, upload files, or use code templates. The AI will analyze syntax, security, performance, and provide recommendations.',
        videoUrl: 'https://example.com/videos/code-upload-analysis.mp4'
      },
      {
        id: 'analyzer-3',
        title: 'Understanding Analysis Results',
        description: 'How to interpret AI analysis results',
        target: '.analysis-results',
        position: 'left',
        content: 'Results are organized by category: syntax, security, quality, performance, and AI insights. Each section provides actionable recommendations.',
        videoUrl: 'https://example.com/videos/analysis-results.mp4'
      }
    ],
    videoTutorials: [
      {
        id: 'analyzer-video-1',
        title: 'AI Code Analysis Deep Dive',
        description: 'Comprehensive guide to AI code analysis features',
        duration: '12:30',
        url: 'https://example.com/videos/ai-analysis-deep-dive.mp4',
        thumbnail: '/thumbnails/ai-analysis.jpg',
        tags: ['ai', 'code-analysis', 'claude'],
        difficulty: 'intermediate'
      },
      {
        id: 'analyzer-video-2',
        title: 'Security Analysis with AI',
        description: 'How to use AI for security vulnerability detection',
        duration: '8:15',
        url: 'https://example.com/videos/security-analysis.mp4',
        thumbnail: '/thumbnails/security-analysis.jpg',
        tags: ['security', 'vulnerabilities', 'ai'],
        difficulty: 'advanced'
      }
    ],
    documents: [
      {
        id: 'analyzer-doc-1',
        title: 'AI Code Analyzer Reference',
        description: 'Complete reference for all AI analysis features',
        type: 'pdf',
        url: '/docs/ai-analyzer-reference.pdf',
        estimatedReadTime: '20 minutes',
        tags: ['reference', 'ai', 'analysis']
      },
      {
        id: 'analyzer-doc-2',
        title: 'Supported Languages Guide',
        description: 'List of supported programming languages and their features',
        type: 'markdown',
        url: '/docs/supported-languages.md',
        estimatedReadTime: '8 minutes',
        tags: ['languages', 'support', 'features']
      }
    ]
  },
  {
    id: 'idea-generator',
    title: 'Idea Generator',
    description: 'Transform ideas into comprehensive development plans',
    icon: <Sparkles className="h-5 w-5" />,
    category: 'Planning',
    difficulty: 'beginner',
    estimatedTime: '10 minutes',
    steps: [
      {
        id: 'idea-1',
        title: 'Creating Your First Idea',
        description: 'How to use the AI idea generator',
        target: '.idea-generator-tab',
        position: 'bottom',
        content: 'The Idea Generator transforms simple ideas into comprehensive development plans with organized phases, tools, and AI prompts.',
        videoUrl: 'https://example.com/videos/idea-generator-intro.mp4'
      },
      {
        id: 'idea-2',
        title: 'Understanding Generated Plans',
        description: 'How to interpret and use generated development plans',
        target: '.generated-plan',
        position: 'top',
        content: 'Generated plans include development phases, tech stack recommendations, timeline estimates, and detailed implementation steps.',
        videoUrl: 'https://example.com/videos/plan-interpretation.mp4'
      }
    ],
    videoTutorials: [
      {
        id: 'idea-video-1',
        title: 'From Idea to Implementation',
        description: 'Complete workflow from idea generation to project creation',
        duration: '15:45',
        url: 'https://example.com/videos/idea-to-implementation.mp4',
        thumbnail: '/thumbnails/idea-workflow.jpg',
        tags: ['workflow', 'planning', 'implementation'],
        difficulty: 'intermediate'
      }
    ],
    documents: [
      {
        id: 'idea-doc-1',
        title: 'Idea Generation Best Practices',
        description: 'How to create effective project ideas',
        type: 'pdf',
        url: '/docs/idea-generation-guide.pdf',
        estimatedReadTime: '12 minutes',
        tags: ['best-practices', 'ideas', 'planning']
      }
    ]
  },
  {
    id: 'ai-assistant',
    title: 'AI Assistant',
    description: 'Get help from the AI assistant throughout the platform',
    icon: <Bot className="h-5 w-5" />,
    category: 'AI Features',
    difficulty: 'beginner',
    estimatedTime: '8 minutes',
    steps: [
      {
        id: 'assistant-1',
        title: 'Accessing the AI Assistant',
        description: 'How to open and use the AI assistant',
        target: '.ai-assistant-button',
        position: 'left',
        content: 'The AI Assistant is always available via the floating button. Click it to open a chat interface for getting help with any task.',
        videoUrl: 'https://example.com/videos/ai-assistant-intro.mp4'
      },
      {
        id: 'assistant-2',
        title: 'Using Quick Actions',
        description: 'How to use pre-built quick actions',
        target: '.quick-actions-tab',
        position: 'top',
        content: 'Quick Actions provide instant access to common tasks like code reviews, bug fixing, and project planning.',
        videoUrl: 'https://example.com/videos/quick-actions.mp4'
      }
    ],
    videoTutorials: [
      {
        id: 'assistant-video-1',
        title: 'AI Assistant Masterclass',
        description: 'Advanced techniques for using the AI assistant effectively',
        duration: '18:20',
        url: 'https://example.com/videos/ai-assistant-masterclass.mp4',
        thumbnail: '/thumbnails/ai-assistant.jpg',
        tags: ['ai', 'assistant', 'productivity'],
        difficulty: 'intermediate'
      }
    ],
    documents: [
      {
        id: 'assistant-doc-1',
        title: 'AI Assistant Commands Reference',
        description: 'Complete list of commands and shortcuts',
        type: 'markdown',
        url: '/docs/ai-assistant-commands.md',
        estimatedReadTime: '6 minutes',
        tags: ['commands', 'shortcuts', 'reference']
      }
    ]
  }
];

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const [isTutorialMode, setIsTutorialMode] = useState(false);
  const [currentTutorial, setCurrentTutorial] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showTooltips, setShowTooltips] = useState(true);
  const [completedTutorials, setCompletedTutorials] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const startTutorial = useCallback((tutorialId: string) => {
    setCurrentTutorial(tutorialId);
    setCurrentStep(0);
    setIsTutorialMode(true);
    toast({
      title: "Tutorial Started",
      description: "Follow the highlighted steps to learn about this feature.",
    });
  }, [toast]);

  const endTutorial = useCallback(() => {
    setIsTutorialMode(false);
    setCurrentTutorial(null);
    setCurrentStep(0);
    toast({
      title: "Tutorial Ended",
      description: "You can restart tutorials anytime from the help menu.",
    });
  }, [toast]);

  const markTutorialComplete = useCallback((tutorialId: string) => {
    setCompletedTutorials(prev => new Set([...prev, tutorialId]));
    toast({
      title: "Tutorial Completed! 🎉",
      description: "You've successfully completed this tutorial.",
    });
  }, [toast]);

  const nextStep = useCallback(() => {
    if (currentTutorial) {
      const tutorial = featureGuides.find(t => t.id === currentTutorial);
      if (tutorial && currentStep < tutorial.steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        markTutorialComplete(currentTutorial);
        endTutorial();
      }
    }
  }, [currentTutorial, currentStep, endTutorial, markTutorialComplete]);

  const previousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const completeStep = useCallback((stepId: string) => {
    // Mark individual step as completed
    toast({
      title: "Step Completed",
      description: "Great job! Continue to the next step.",
    });
  }, [toast]);

  const toggleTooltips = useCallback(() => {
    setShowTooltips(!showTooltips);
    toast({
      title: showTooltips ? "Tooltips Disabled" : "Tooltips Enabled",
      description: showTooltips ? "Tooltips are now hidden" : "Tooltips are now visible",
    });
  }, [showTooltips, toast]);


  const value: TutorialContextType = {
    isTutorialMode,
    currentTutorial,
    currentStep,
    showTooltips,
    completedTutorials,
    startTutorial,
    endTutorial,
    nextStep,
    previousStep,
    completeStep,
    toggleTooltips,
    markTutorialComplete
  };

  return (
    <TutorialContext.Provider value={value}>
      <TooltipProvider>
        {children}
      </TooltipProvider>
    </TutorialContext.Provider>
  );
}

export function TutorialOverlay() {
  const { isTutorialMode, currentTutorial, currentStep, endTutorial, nextStep, previousStep } = useTutorial();
  
  if (!isTutorialMode || !currentTutorial) return null;

  const tutorial = featureGuides.find(t => t.id === currentTutorial);
  if (!tutorial) return null;

  const step = tutorial.steps[currentStep];
  if (!step) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-background rounded-lg p-6 max-w-md mx-4 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {tutorial.icon}
            <h3 className="font-semibold">{tutorial.title}</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={endTutorial}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium mb-2">{step.title}</h4>
          <p className="text-sm text-muted-foreground mb-3">{step.content}</p>
          
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="text-xs">
              Step {currentStep + 1} of {tutorial.steps.length}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {tutorial.estimatedTime}
            </Badge>
          </div>
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={previousStep}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={endTutorial}>
              <SkipForward className="h-4 w-4 mr-1" />
              Skip
            </Button>
            <Button size="sm" onClick={nextStep}>
              {currentStep === tutorial.steps.length - 1 ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Complete
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HelpCenter() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGuide, setSelectedGuide] = useState<FeatureGuide | null>(null);
  const { startTutorial, completedTutorials, toggleTooltips, showTooltips } = useTutorial();

  const categories = ['all', ...new Set(featureGuides.map(guide => guide.category))];
  const filteredGuides = selectedCategory === 'all' 
    ? featureGuides 
    : featureGuides.filter(guide => guide.category === selectedCategory);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <HelpCircle className="h-4 w-4 mr-2" />
          Help & Tutorials
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            Help Center & Tutorials
          </DialogTitle>
          <DialogDescription>
            Learn how to use all features of the platform with interactive tutorials, videos, and documentation
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-6 h-full">
          {/* Sidebar */}
          <div className="w-1/3 border-r pr-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Filter by Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                {filteredGuides.map(guide => (
                  <div
                    key={guide.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedGuide?.id === guide.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedGuide(guide)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {guide.icon}
                      <span className="font-medium">{guide.title}</span>
                      {completedTutorials.has(guide.id) && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{guide.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {guide.difficulty}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {guide.estimatedTime}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            {selectedGuide ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{selectedGuide.title}</h3>
                  <p className="text-muted-foreground mb-4">{selectedGuide.description}</p>
                  
                  <div className="flex gap-2 mb-4">
                    <Button onClick={() => startTutorial(selectedGuide.id)}>
                      <Play className="h-4 w-4 mr-2" />
                      Start Tutorial
                    </Button>
                    <Button variant="outline" onClick={toggleTooltips}>
                      {showTooltips ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                      {showTooltips ? 'Hide' : 'Show'} Tooltips
                    </Button>
                  </div>
                </div>

                <Tabs defaultValue="tutorial" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="tutorial">Interactive Tutorial</TabsTrigger>
                    <TabsTrigger value="videos">Video Tutorials</TabsTrigger>
                    <TabsTrigger value="documents">Documentation</TabsTrigger>
                  </TabsList>

                  <TabsContent value="tutorial" className="space-y-4">
                    <div className="space-y-3">
                      {selectedGuide.steps.map((step, index) => (
                        <div key={step.id} className="p-4 border rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm">
                              {index + 1}
                            </div>
                            <h4 className="font-medium">{step.title}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                          <p className="text-sm">{step.content}</p>
                          {(step.videoUrl || step.documentUrl) && (
                            <div className="flex gap-2 mt-3">
                              {step.videoUrl && (
                                <Button variant="outline" size="sm">
                                  <Video className="h-3 w-3 mr-1" />
                                  Watch Video
                                </Button>
                              )}
                              {step.documentUrl && (
                                <Button variant="outline" size="sm">
                                  <FileText className="h-3 w-3 mr-1" />
                                  Read Document
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="videos" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedGuide.videoTutorials.map(video => (
                        <Card key={video.id} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center">
                              <Play className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h4 className="font-medium mb-1">{video.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{video.description}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {video.duration}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {video.difficulty}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="documents" className="space-y-4">
                    <div className="space-y-3">
                      {selectedGuide.documents.map(doc => (
                        <Card key={doc.id} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <FileText className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <h4 className="font-medium">{doc.title}</h4>
                                  <p className="text-sm text-muted-foreground">{doc.description}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge variant="outline" className="text-xs">
                                  {doc.estimatedReadTime}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex gap-1 mt-3">
                              {doc.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="text-center py-12">
                <HelpCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Select a Feature</h3>
                <p className="text-muted-foreground">
                  Choose a feature from the sidebar to view its tutorials and documentation
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function TutorialTooltip({ 
  children, 
  content, 
  featureId 
}: { 
  children: React.ReactNode; 
  content: string; 
  featureId?: string;
}) {
  const { showTooltips } = useTutorial();

  if (!showTooltips) {
    return <>{children}</>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <div className="space-y-2">
          <p>{content}</p>
          {featureId && (
            <Button size="sm" className="w-full">
              <HelpCircle className="h-3 w-3 mr-1" />
              Learn More
            </Button>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
} 