import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Lightbulb, 
  Target, 
  Code, 
  Database, 
  Palette, 
  Users, 
  Zap, 
  ArrowRight,
  Copy,
  Check,
  Sparkles,
  Layers,
  GitBranch,
  Shield,
  Globe,
  Smartphone,
  Monitor,
  Server
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAppStore } from '@/stores/appStore';
import type { Project } from '@/types';

interface IdeaNode {
  id: string;
  title: string;
  description: string;
  category: 'architecture' | 'ui' | 'backend' | 'database' | 'security' | 'deployment' | 'testing' | 'marketing';
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedTime: string;
  complexity: 'simple' | 'moderate' | 'complex';
  dependencies: string[];
  tools: string[];
  prompts: string[];
  resources: string[];
}

interface GeneratedPlan {
  idea: string;
  description: string;
  nodes: IdeaNode[];
  techStack: string[];
  timeline: string;
  budget: string;
  team: string[];
  phases: {
    phase1: IdeaNode[];
    phase2: IdeaNode[];
    phase3: IdeaNode[];
  };
}

const categoryIcons = {
  architecture: <Layers className="h-4 w-4" />,
  ui: <Palette className="h-4 w-4" />,
  backend: <Server className="h-4 w-4" />,
  database: <Database className="h-4 w-4" />,
  security: <Shield className="h-4 w-4" />,
  deployment: <Globe className="h-4 w-4" />,
  testing: <Check className="h-4 w-4" />,
  marketing: <Users className="h-4 w-4" />
};

const priorityColors = {
  critical: 'bg-destructive text-white',
  high: 'bg-orange-500 text-white',
  medium: 'bg-yellow-500 text-white',
  low: 'bg-green-500 text-white'
};

const complexityColors = {
  simple: 'bg-green-100 text-green-800',
  moderate: 'bg-yellow-100 text-yellow-800',
  complex: 'bg-red-100 text-red-800'
};

export function IdeaGenerator() {
  const [idea, setIdea] = useState('');
  const [description, setDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
  const [activeTab, setActiveTab] = useState('input');
  const [copiedPrompts, setCopiedPrompts] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const { addProject } = useAppStore();

  const generateIdeaPlan = useCallback(async () => {
    if (!idea.trim()) {
      toast({
        title: "Idea Required",
        description: "Please enter your app idea to generate a plan.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Simulate AI generation with comprehensive planning
      await new Promise(resolve => setTimeout(resolve, 3000));

      const plan = generateComprehensivePlan(idea, description);
      setGeneratedPlan(plan);
      setActiveTab('plan');
      
      toast({
        title: "Plan Generated! 🎉",
        description: "Your comprehensive development plan is ready.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  }, [idea, description, toast]);

  const generateComprehensivePlan = (idea: string, description: string): GeneratedPlan => {
    const baseIdea = idea.toLowerCase();
    const isWebApp = baseIdea.includes('web') || baseIdea.includes('website') || baseIdea.includes('platform');
    const isMobileApp = baseIdea.includes('mobile') || baseIdea.includes('app') || baseIdea.includes('ios') || baseIdea.includes('android');
    const isEcommerce = baseIdea.includes('shop') || baseIdea.includes('store') || baseIdea.includes('marketplace') || baseIdea.includes('ecommerce');
    const isSocial = baseIdea.includes('social') || baseIdea.includes('community') || baseIdea.includes('network');
    const isAI = baseIdea.includes('ai') || baseIdea.includes('machine learning') || baseIdea.includes('intelligent');

    const nodes: IdeaNode[] = [
      // Architecture Nodes
      {
        id: 'arch-1',
        title: 'System Architecture Design',
        description: 'Design scalable and maintainable system architecture with proper separation of concerns',
        category: 'architecture',
        priority: 'critical',
        estimatedTime: '2-3 days',
        complexity: 'complex',
        dependencies: [],
        tools: ['Draw.io', 'Lucidchart', 'Figma', 'Architecture Decision Records'],
        prompts: [
          'Design a scalable microservices architecture for a {idea} application',
          'Create a system design diagram showing data flow and component interactions',
          'Define the core modules and their responsibilities in the system'
        ],
        resources: [
          'https://martinfowler.com/articles/microservices.html',
          'https://aws.amazon.com/architecture/',
          'https://docs.microsoft.com/en-us/azure/architecture/'
        ]
      },
      {
        id: 'arch-2',
        title: 'Database Schema Design',
        description: 'Design efficient database schema with proper relationships and indexing',
        category: 'database',
        priority: 'critical',
        estimatedTime: '1-2 days',
        complexity: 'moderate',
        dependencies: ['arch-1'],
        tools: ['dbdiagram.io', 'MySQL Workbench', 'PostgreSQL', 'MongoDB Compass'],
        prompts: [
          'Design a normalized database schema for {idea} with proper relationships',
          'Create ERD diagrams showing entity relationships and cardinality',
          'Define indexes and constraints for optimal query performance'
        ],
        resources: [
          'https://www.postgresql.org/docs/current/ddl.html',
          'https://docs.mongodb.com/manual/data-modeling/',
          'https://www.mysql.com/why-mysql/white-papers/'
        ]
      },

      // UI/UX Nodes
      {
        id: 'ui-1',
        title: 'User Interface Design',
        description: 'Create intuitive and responsive user interfaces with modern design principles',
        category: 'ui',
        priority: 'high',
        estimatedTime: '3-5 days',
        complexity: 'moderate',
        dependencies: ['arch-1'],
        tools: ['Figma', 'Adobe XD', 'Sketch', 'InVision', 'React', 'Vue.js', 'Angular'],
        prompts: [
          'Design a modern, responsive UI for {idea} following Material Design principles',
          'Create user flow diagrams showing the complete user journey',
          'Design mobile-first responsive layouts with accessibility in mind'
        ],
        resources: [
          'https://material.io/design',
          'https://www.figma.com/community',
          'https://www.w3.org/WAI/WCAG21/quickref/'
        ]
      },
      {
        id: 'ui-2',
        title: 'Component Library',
        description: 'Build reusable UI components for consistent design and faster development',
        category: 'ui',
        priority: 'high',
        estimatedTime: '2-3 days',
        complexity: 'moderate',
        dependencies: ['ui-1'],
        tools: ['Storybook', 'Styled Components', 'Tailwind CSS', 'Material-UI', 'Ant Design'],
        prompts: [
          'Create a comprehensive component library for {idea} with consistent styling',
          'Design atomic design system with atoms, molecules, and organisms',
          'Build interactive component documentation with Storybook'
        ],
        resources: [
          'https://storybook.js.org/',
          'https://bradfrost.com/blog/post/atomic-web-design/',
          'https://tailwindcss.com/docs'
        ]
      },

      // Backend Nodes
      {
        id: 'backend-1',
        title: 'API Development',
        description: 'Build robust RESTful APIs with proper authentication and documentation',
        category: 'backend',
        priority: 'critical',
        estimatedTime: '4-6 days',
        complexity: 'complex',
        dependencies: ['arch-1', 'arch-2'],
        tools: ['Node.js', 'Express', 'FastAPI', 'Django', 'Spring Boot', 'Postman', 'Swagger'],
        prompts: [
          'Design RESTful API endpoints for {idea} with proper HTTP methods and status codes',
          'Implement JWT authentication with refresh tokens and role-based access control',
          'Create comprehensive API documentation with OpenAPI/Swagger specifications'
        ],
        resources: [
          'https://restfulapi.net/',
          'https://jwt.io/',
          'https://swagger.io/docs/'
        ]
      },
      {
        id: 'backend-2',
        title: 'Business Logic Implementation',
        description: 'Implement core business logic with proper error handling and validation',
        category: 'backend',
        priority: 'high',
        estimatedTime: '3-5 days',
        complexity: 'moderate',
        dependencies: ['backend-1'],
        tools: ['TypeScript', 'Jest', 'ESLint', 'Prettier', 'Joi', 'Yup'],
        prompts: [
          'Implement core business logic for {idea} with proper input validation',
          'Create comprehensive error handling with meaningful error messages',
          'Write unit tests for all business logic functions with high coverage'
        ],
        resources: [
          'https://jestjs.io/docs/getting-started',
          'https://joi.dev/api/',
          'https://github.com/jquense/yup'
        ]
      },

      // Security Nodes
      {
        id: 'security-1',
        title: 'Security Implementation',
        description: 'Implement comprehensive security measures and best practices',
        category: 'security',
        priority: 'critical',
        estimatedTime: '2-3 days',
        complexity: 'complex',
        dependencies: ['backend-1'],
        tools: ['Helmet.js', 'bcrypt', 'rate-limiter', 'CORS', 'HTTPS', 'OWASP'],
        prompts: [
          'Implement comprehensive security measures for {idea} following OWASP guidelines',
          'Set up rate limiting, input validation, and SQL injection prevention',
          'Configure CORS, CSP headers, and HTTPS for secure communication'
        ],
        resources: [
          'https://owasp.org/www-project-top-ten/',
          'https://helmetjs.github.io/',
          'https://cheatsheetseries.owasp.org/cheatsheets/'
        ]
      },

      // Testing Nodes
      {
        id: 'testing-1',
        title: 'Testing Strategy',
        description: 'Implement comprehensive testing strategy with unit, integration, and E2E tests',
        category: 'testing',
        priority: 'high',
        estimatedTime: '3-4 days',
        complexity: 'moderate',
        dependencies: ['backend-2', 'ui-2'],
        tools: ['Jest', 'Cypress', 'Playwright', 'Postman', 'Supertest'],
        prompts: [
          'Create comprehensive testing strategy for {idea} with unit, integration, and E2E tests',
          'Set up automated testing pipeline with CI/CD integration',
          'Implement test-driven development (TDD) for critical features'
        ],
        resources: [
          'https://jestjs.io/',
          'https://www.cypress.io/',
          'https://playwright.dev/'
        ]
      },

      // Deployment Nodes
      {
        id: 'deployment-1',
        title: 'Deployment Setup',
        description: 'Set up automated deployment pipeline with proper environment management',
        category: 'deployment',
        priority: 'high',
        estimatedTime: '2-3 days',
        complexity: 'moderate',
        dependencies: ['testing-1'],
        tools: ['Docker', 'GitHub Actions', 'AWS', 'Vercel', 'Netlify', 'Kubernetes'],
        prompts: [
          'Set up automated deployment pipeline for {idea} with Docker and CI/CD',
          'Configure environment variables and secrets management',
          'Implement blue-green deployment strategy for zero-downtime updates'
        ],
        resources: [
          'https://docs.docker.com/',
          'https://docs.github.com/en/actions',
          'https://kubernetes.io/docs/'
        ]
      }
    ];

    // Add AI-specific nodes if applicable
    if (isAI) {
      nodes.push({
        id: 'ai-1',
        title: 'AI/ML Integration',
        description: 'Integrate AI/ML capabilities with proper model management and monitoring',
        category: 'backend',
        priority: 'critical',
        estimatedTime: '5-7 days',
        complexity: 'complex',
        dependencies: ['backend-1'],
        tools: ['TensorFlow', 'PyTorch', 'OpenAI API', 'Hugging Face', 'MLflow'],
        prompts: [
          'Design AI/ML architecture for {idea} with model training and inference pipelines',
          'Implement model versioning and A/B testing for ML models',
          'Set up monitoring and alerting for model performance and drift'
        ],
        resources: [
          'https://www.tensorflow.org/',
          'https://pytorch.org/',
          'https://mlflow.org/'
        ]
      });
    }

    // Add mobile-specific nodes if applicable
    if (isMobileApp) {
      nodes.push({
        id: 'mobile-1',
        title: 'Mobile App Development',
        description: 'Build native or cross-platform mobile application',
        category: 'ui',
        priority: 'critical',
        estimatedTime: '4-6 days',
        complexity: 'complex',
        dependencies: ['ui-1'],
        tools: ['React Native', 'Flutter', 'Xcode', 'Android Studio', 'Expo'],
        prompts: [
          'Design mobile app architecture for {idea} with offline-first capabilities',
          'Implement push notifications and deep linking for mobile app',
          'Create responsive mobile UI with platform-specific design patterns'
        ],
        resources: [
          'https://reactnative.dev/',
          'https://flutter.dev/',
          'https://expo.dev/'
        ]
      });
    }

    // Organize nodes into phases
    const phase1 = nodes.filter(node => ['arch-1', 'arch-2', 'ui-1'].includes(node.id));
    const phase2 = nodes.filter(node => ['backend-1', 'backend-2', 'security-1', 'ui-2'].includes(node.id));
    const phase3 = nodes.filter(node => ['testing-1', 'deployment-1'].includes(node.id));

    // Determine tech stack based on idea
    const techStack = determineTechStack(baseIdea, isWebApp, isMobileApp, isEcommerce, isAI);

    return {
      idea,
      description: description || `A comprehensive ${idea} application`,
      nodes,
      techStack,
      timeline: '8-12 weeks',
      budget: '$15,000 - $50,000',
      team: ['Frontend Developer', 'Backend Developer', 'UI/UX Designer', 'DevOps Engineer'],
      phases: { phase1, phase2, phase3 }
    };
  };

  const determineTechStack = (idea: string, isWebApp: boolean, isMobileApp: boolean, isEcommerce: boolean, isAI: boolean): string[] => {
    const stack = [];

    // Frontend
    if (isWebApp) {
      stack.push('React', 'TypeScript', 'Tailwind CSS', 'Next.js');
    }
    if (isMobileApp) {
      stack.push('React Native', 'Expo');
    }

    // Backend
    stack.push('Node.js', 'Express', 'TypeScript', 'PostgreSQL');

    // AI/ML
    if (isAI) {
      stack.push('Python', 'TensorFlow', 'OpenAI API');
    }

    // E-commerce
    if (isEcommerce) {
      stack.push('Stripe', 'Shopify API');
    }

    // Common tools
    stack.push('Docker', 'GitHub Actions', 'AWS');

    return [...new Set(stack)];
  };

  const copyPrompt = useCallback((prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedPrompts(prev => new Set(prev).add(prompt));
    toast({
      title: "Prompt Copied!",
      description: "The prompt has been copied to your clipboard.",
    });
    setTimeout(() => {
      setCopiedPrompts(prev => {
        const newSet = new Set(prev);
        newSet.delete(prompt);
        return newSet;
      });
    }, 2000);
  }, [toast]);

  const createProjectFromPlan = useCallback(() => {
    if (!generatedPlan) return;

    const project: Omit<Project, 'id' | 'createdAt' | 'lastUpdated'> = {
      title: generatedPlan.idea,
      description: generatedPlan.description,
      category: 'Web Development',
      priority: 'high',
      dueDate: new Date(Date.now() + 12 * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 12 weeks
      technologies: generatedPlan.techStack,
      team: generatedPlan.team,
      budget: generatedPlan.budget,
      timeSpent: '0 hours',
      estimatedCompletion: generatedPlan.timeline,
      progress: 0,
      status: 'planning',
      stepsCompleted: 0,
      totalSteps: generatedPlan.nodes.length
    };

    addProject(project);
    toast({
      title: "Project Created!",
      description: "Your idea has been converted into a project with all the generated nodes as steps.",
    });
  }, [generatedPlan, addProject, toast]);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <Lightbulb className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">AI-Powered Idea Generator</CardTitle>
              <CardDescription>
                Transform your simple idea into a comprehensive development plan with organized nodes, prompts, and tools
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="input">Input Idea</TabsTrigger>
          <TabsTrigger value="plan" disabled={!generatedPlan}>Generated Plan</TabsTrigger>
          <TabsTrigger value="tools" disabled={!generatedPlan}>Development Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Describe Your App Idea
              </CardTitle>
              <CardDescription>
                Enter your app idea and get a comprehensive development plan with organized phases, tools, and prompts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">App Idea *</label>
                <Input
                  placeholder="e.g., A social media platform for pet owners"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  className="text-lg"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Additional Details (Optional)</label>
                <Textarea
                  placeholder="Describe your idea in more detail, target audience, key features, etc."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <Button 
                onClick={generateIdeaPlan}
                disabled={isGenerating || !idea.trim()}
                className="w-full h-12 text-lg"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Generating Comprehensive Plan...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-5 w-5" />
                    Generate Development Plan
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plan" className="space-y-6">
          {generatedPlan && (
            <>
              {/* Plan Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Plan Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{generatedPlan.nodes.length}</div>
                      <div className="text-sm text-muted-foreground">Development Nodes</div>
                    </div>
                    <div className="p-4 bg-success/10 rounded-lg">
                      <div className="text-2xl font-bold text-success">{generatedPlan.timeline}</div>
                      <div className="text-sm text-muted-foreground">Timeline</div>
                    </div>
                    <div className="p-4 bg-warning/10 rounded-lg">
                      <div className="text-2xl font-bold text-warning">{generatedPlan.team.length}</div>
                      <div className="text-sm text-muted-foreground">Team Members</div>
                    </div>
                    <div className="p-4 bg-info/10 rounded-lg">
                      <div className="text-2xl font-bold text-info">{generatedPlan.budget}</div>
                      <div className="text-sm text-muted-foreground">Estimated Budget</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tech Stack */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-primary" />
                    Recommended Tech Stack
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {generatedPlan.techStack.map((tech) => (
                      <Badge key={tech} variant="secondary" className="bg-primary/10 text-primary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Development Phases */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold">Development Phases</h3>
                
                {/* Phase 1 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      Phase 1: Foundation & Design
                    </CardTitle>
                    <CardDescription>
                      Architecture design, database schema, and UI/UX foundation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {generatedPlan.phases.phase1.map((node) => (
                        <NodeCard key={node.id} node={node} onCopyPrompt={copyPrompt} copiedPrompts={copiedPrompts} />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Phase 2 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      Phase 2: Core Development
                    </CardTitle>
                    <CardDescription>
                      Backend development, security implementation, and advanced UI components
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {generatedPlan.phases.phase2.map((node) => (
                        <NodeCard key={node.id} node={node} onCopyPrompt={copyPrompt} copiedPrompts={copiedPrompts} />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Phase 3 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      Phase 3: Testing & Deployment
                    </CardTitle>
                    <CardDescription>
                      Comprehensive testing, deployment setup, and launch preparation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {generatedPlan.phases.phase3.map((node) => (
                        <NodeCard key={node.id} node={node} onCopyPrompt={copyPrompt} copiedPrompts={copiedPrompts} />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Create Project Button */}
                <Card>
                  <CardContent className="pt-6">
                    <Button onClick={createProjectFromPlan} className="w-full h-12 text-lg">
                      <ArrowRight className="mr-2 h-5 w-5" />
                      Create Project from This Plan
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          {generatedPlan && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(categoryIcons).map(([category, icon]) => {
                const categoryNodes = generatedPlan.nodes.filter(node => node.category === category);
                const tools = [...new Set(categoryNodes.flatMap(node => node.tools))];
                
                return (
                  <Card key={category}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 capitalize">
                        {icon}
                        {category} Tools
                      </CardTitle>
                      <CardDescription>
                        {categoryNodes.length} development nodes
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {tools.map((tool) => (
                          <div key={tool} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <span className="text-sm font-medium">{tool}</span>
                            <Badge variant="outline" className="text-xs">
                              {categoryNodes.filter(node => node.tools.includes(tool)).length} uses
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface NodeCardProps {
  node: IdeaNode;
  onCopyPrompt: (prompt: string) => void;
  copiedPrompts: Set<string>;
}

function NodeCard({ node, onCopyPrompt, copiedPrompts }: NodeCardProps) {
  return (
    <Card className="border-l-4 border-l-primary/30">
      <CardContent className="p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {categoryIcons[node.category]}
                <h4 className="font-semibold text-foreground">{node.title}</h4>
                <Badge className={priorityColors[node.priority]}>
                  {node.priority}
                </Badge>
                <Badge variant="outline" className={complexityColors[node.complexity]}>
                  {node.complexity}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{node.description}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                <span>⏱️ {node.estimatedTime}</span>
                {node.dependencies.length > 0 && (
                  <span>🔗 {node.dependencies.length} dependencies</span>
                )}
              </div>
            </div>
          </div>

          {/* Tools */}
          {node.tools.length > 0 && (
            <div>
              <h5 className="text-sm font-medium mb-2">Recommended Tools:</h5>
              <div className="flex flex-wrap gap-1">
                {node.tools.map((tool) => (
                  <Badge key={tool} variant="secondary" className="text-xs">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Prompts */}
          {node.prompts.length > 0 && (
            <div>
              <h5 className="text-sm font-medium mb-2">AI Prompts:</h5>
              <div className="space-y-2">
                {node.prompts.map((prompt, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onCopyPrompt(prompt)}
                      className="shrink-0"
                    >
                      {copiedPrompts.has(prompt) ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                    <div className="flex-1 p-2 bg-muted/50 rounded text-sm">
                      {prompt.replace('{idea}', 'your app idea')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources */}
          {node.resources.length > 0 && (
            <div>
              <h5 className="text-sm font-medium mb-2">Resources:</h5>
              <div className="space-y-1">
                {node.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-primary hover:underline"
                  >
                    {resource}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 