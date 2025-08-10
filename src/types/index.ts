// Core entity types
export interface Project {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: 'planning' | 'in-progress' | 'review' | 'completed';
  dueDate: string;
  stepsCompleted: number;
  totalSteps: number;
  lastUpdated: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  technologies: string[];
  team: string[];
  budget: string;
  timeSpent: string;
  estimatedCompletion: string;
  createdAt: string;
}

export interface Step {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  notes: string;
  learnings: string[];
  impact: string[];
  projectId: string;
  createdAt: string;
  completedAt?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  estimatedHours?: number;
  status?: 'not_started' | 'in_progress' | 'blocked' | 'completed';
  subtasks?: SubTask[];
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface Learning {
  id: string;
  title: string;
  content: string;
  type: 'success' | 'failure' | 'insight';
  date: string;
  tags: string[];
  relatedStep?: string;
  project: string;
  projectId?: string;
}

export interface CodeIssue {
  id: string;
  file: string;
  lines: number;
  type: 'length' | 'duplicate' | 'complexity' | 'security';
  severity: 'low' | 'medium' | 'high';
  description: string;
  suggestion: string;
  projectId?: string;
  resolved: boolean;
  resolvedAt?: string;
}

export interface Goal {
  id: string;
  title: string;
  targetDate?: string;
  progress: number;
}

// Form input types
export interface ProjectFormData {
  title: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  technologies: string[];
  team: string[];
  budget: string;
  timeSpent: string;
  estimatedCompletion: string;
}

export interface StepFormData {
  title: string;
  description: string;
  completed: boolean;
  notes: string;
  learnings: string[];
  impact: string[];
  priority?: 'low' | 'medium' | 'high' | 'critical';
  estimatedHours?: number;
  status?: 'not_started' | 'in_progress' | 'blocked' | 'completed';
}

export interface LearningFormData {
  title: string;
  content: string;
  type: 'success' | 'failure' | 'insight';
  tags: string[];
  relatedStep?: string;
  project: string;
}

export interface GoalFormData {
  title: string;
  targetDate?: string;
  progress: number;
}

// AI Analysis types
export interface AIIntegrationSettings {
  provider: 'openai' | 'anthropic' | 'custom';
  model: string;
  customEndpoint?: string;
  apiKey?: string;
  analysisFrequency: 'manual' | 'daily' | 'weekly';
  enabledFeatures: {
    projectOptimization: boolean;
    codeQualityInsights: boolean;
    learningInsights: boolean;
  };
}

export interface AIAnalysisResult {
  projectOptimization: {
    recommendations: string[];
    priority: 'low' | 'medium' | 'high';
    estimatedImpact: string;
  };
  codeQualityInsights: {
    issues: string[];
    suggestions: string[];
    overallScore: number;
  };
  learningInsights: {
    patterns: string[];
    recommendations: string[];
    knowledgeGaps: string[];
  };
}

// Component prop types
export interface ProjectCardProps {
  project: Project;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export interface StepCardProps {
  step: Step;
  index: number;
  onUpdate: (updates: Partial<Step>) => void;
  onToggleCompletion: () => void;
}

export interface StepPlanningPanelProps {
  projectId: string;
  steps: Step[];
  onStepsChange?: (steps: Step[]) => void;
}

export interface LearningLogProps {
  learnings: Learning[];
  onAddLearning: (learning: Omit<Learning, 'id' | 'date'>) => void;
}

export interface CodeAnalysisPanelProps {
  issues: CodeIssue[];
  onRefresh: () => void;
  onViewFile: (file: string) => void;
}

export interface AIAnalysisPanelProps {
  projectId: string;
  onInsightApplied?: (insight: AIAnalysisResult) => void;
}

// Utility types
export type StatusType = 'planning' | 'in-progress' | 'review' | 'completed';
export type PriorityType = 'low' | 'medium' | 'high' | 'critical';
export type LearningType = 'success' | 'failure' | 'insight';
export type SeverityType = 'low' | 'medium' | 'high'; 