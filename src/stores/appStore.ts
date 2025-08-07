import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  type: 'length' | 'duplicate' | 'complexity';
  severity: 'low' | 'medium' | 'high';
  description: string;
  suggestion: string;
  projectId?: string;
  resolved: boolean;
  resolvedAt?: string;
}

interface AppState {
  projects: Project[];
  steps: Record<string, Step[]>;
  learnings: Learning[];
  codeIssues: CodeIssue[];
  
  // Project actions
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'lastUpdated'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Step actions
  addStep: (projectId: string, step: Omit<Step, 'id' | 'projectId' | 'createdAt'>) => void;
  updateStep: (projectId: string, stepId: string, updates: Partial<Step>) => void;
  deleteStep: (projectId: string, stepId: string) => void;
  toggleStepCompletion: (projectId: string, stepId: string) => void;
  
  // Learning actions
  addLearning: (learning: Omit<Learning, 'id' | 'date'>) => void;
  updateLearning: (id: string, updates: Partial<Learning>) => void;
  deleteLearning: (id: string) => void;
  
  // Code issue actions
  addCodeIssue: (issue: Omit<CodeIssue, 'id'>) => void;
  updateCodeIssue: (id: string, updates: Partial<CodeIssue>) => void;
  resolveCodeIssue: (id: string) => void;
  deleteCodeIssue: (id: string) => void;
  
  // Utility actions
  getProjectById: (id: string) => Project | undefined;
  getStepsByProjectId: (projectId: string) => Step[];
  getLearningsByProjectId: (projectId: string) => Learning[];
  getCodeIssuesByProjectId: (projectId: string) => CodeIssue[];
}

// Initial mock data
const initialProjects: Project[] = [
  {
    id: '1',
    title: 'E-commerce Platform',
    description: 'Building a modern e-commerce solution with React and Node.js',
    progress: 65,
    status: 'in-progress',
    dueDate: 'Dec 15, 2024',
    stepsCompleted: 8,
    totalSteps: 12,
    lastUpdated: '2 hours ago',
    category: 'Web Development',
    priority: 'high',
    technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    team: ['You', 'Sarah Chen', 'Mike Rodriguez'],
    budget: '$45,000',
    timeSpent: '180 hours',
    estimatedCompletion: '3 weeks',
    createdAt: '2024-11-01'
  },
  {
    id: '2',
    title: 'Mobile App MVP',
    description: 'React Native app for task management with offline support',
    progress: 30,
    status: 'planning',
    dueDate: 'Jan 20, 2025',
    stepsCompleted: 3,
    totalSteps: 10,
    lastUpdated: '1 day ago',
    category: 'Mobile Development',
    priority: 'medium',
    technologies: ['React Native', 'Firebase', 'Redux'],
    team: ['You', 'Alex Thompson'],
    budget: '$25,000',
    timeSpent: '45 hours',
    estimatedCompletion: '6 weeks',
    createdAt: '2024-11-15'
  },
  {
    id: '3',
    title: 'Portfolio Website',
    description: 'Personal portfolio built with React and Tailwind CSS',
    progress: 100,
    status: 'completed',
    dueDate: 'Nov 30, 2024',
    stepsCompleted: 6,
    totalSteps: 6,
    lastUpdated: '1 week ago',
    category: 'Web Development',
    priority: 'low',
    technologies: ['React', 'Tailwind', 'Framer Motion'],
    team: ['You'],
    budget: '$5,000',
    timeSpent: '80 hours',
    estimatedCompletion: 'Completed',
    createdAt: '2024-10-15'
  }
];

const initialSteps: Record<string, Step[]> = {
  '1': [
    {
      id: '1',
      title: 'Set up project architecture',
      description: 'Initialize React app with TypeScript and essential dependencies',
      completed: true,
      notes: 'Used Vite for faster development. Added ESLint and Prettier.',
      learnings: ['Vite is much faster than Create React App', 'TypeScript setup was smoother than expected'],
      impact: ['Faster development cycle', 'Better code quality from start'],
      projectId: '1',
      createdAt: '2024-11-01',
      completedAt: '2024-11-02'
    },
    {
      id: '2',
      title: 'Design product catalog system',
      description: 'Create reusable components for product display and filtering',
      completed: true,
      notes: 'Implemented with React Query for caching and state management',
      learnings: ['React Query simplifies server state', 'Component composition patterns'],
      impact: ['Improved performance', 'Better user experience'],
      projectId: '1',
      createdAt: '2024-11-03',
      completedAt: '2024-11-05'
    },
    {
      id: '3',
      title: 'Implement shopping cart',
      description: 'Add cart functionality with local storage persistence',
      completed: true,
      notes: 'Used Context API with useReducer for cart state',
      learnings: ['Context API good for app-wide state', 'useReducer for complex state logic'],
      impact: ['Seamless cart experience', 'Data persistence'],
      projectId: '1',
      createdAt: '2024-11-06',
      completedAt: '2024-11-08'
    },
    {
      id: '4',
      title: 'Payment integration',
      description: 'Integrate Stripe for secure payment processing',
      completed: false,
      notes: 'Researching best practices for PCI compliance',
      learnings: [],
      impact: [],
      projectId: '1',
      createdAt: '2024-11-09'
    }
  ]
};

const initialLearnings: Learning[] = [
  {
    id: '1',
    title: 'TypeScript generics mastery',
    content: 'Finally understood how to use TypeScript generics effectively for reusable components. The key was starting simple and building up complexity.',
    type: 'insight',
    date: '2 days ago',
    tags: ['typescript', 'components'],
    relatedStep: '1',
    project: 'E-commerce Platform',
    projectId: '1'
  },
  {
    id: '2',
    title: 'Authentication flow complexity',
    content: 'Underestimated the complexity of handling token refresh and logout scenarios. Need to plan auth state management more carefully.',
    type: 'failure',
    date: '1 day ago',
    tags: ['auth', 'state-management'],
    relatedStep: '3',
    project: 'Mobile App MVP',
    projectId: '2'
  }
];

const initialCodeIssues: CodeIssue[] = [
  {
    id: '1',
    file: 'src/components/UserDashboard.tsx',
    lines: 285,
    type: 'length',
    severity: 'medium',
    description: 'Component is getting large and handles multiple responsibilities',
    suggestion: 'Split into smaller components: UserProfile, UserStats, and UserActions',
    projectId: '1',
    resolved: false
  },
  {
    id: '2',
    file: 'src/utils/validation.ts',
    lines: 95,
    type: 'duplicate',
    severity: 'low',
    description: 'Similar validation patterns repeated in multiple functions',
    suggestion: 'Create a generic validation factory function to reduce duplication',
    projectId: '2',
    resolved: false
  }
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      projects: initialProjects,
      steps: initialSteps,
      learnings: initialLearnings,
      codeIssues: initialCodeIssues,
      
      // Project actions
      addProject: (projectData) => {
        const newProject: Project = {
          ...projectData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString().split('T')[0],
          lastUpdated: 'Just now',
          stepsCompleted: 0,
          totalSteps: 0,
          progress: 0
        };
        
        set((state) => ({
          projects: [...state.projects, newProject],
          steps: { ...state.steps, [newProject.id]: [] }
        }));
      },
      
      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((project) =>
            project.id === id 
              ? { ...project, ...updates, lastUpdated: 'Just now' }
              : project
          )
        }));
      },
      
      deleteProject: (id) => {
        set((state) => {
          const { [id]: deletedSteps, ...remainingSteps } = state.steps;
          return {
            projects: state.projects.filter((p) => p.id !== id),
            steps: remainingSteps,
            learnings: state.learnings.filter((l) => l.projectId !== id),
            codeIssues: state.codeIssues.filter((i) => i.projectId !== id)
          };
        });
      },
      
      // Step actions
      addStep: (projectId, stepData) => {
        const newStep: Step = {
          ...stepData,
          id: Date.now().toString(),
          projectId,
          createdAt: new Date().toISOString().split('T')[0]
        };
        
        set((state) => {
          const projectSteps = state.steps[projectId] || [];
          const newSteps = [...projectSteps, newStep];
          
          return {
            steps: { ...state.steps, [projectId]: newSteps },
            projects: state.projects.map((project) =>
              project.id === projectId
                ? {
                    ...project,
                    totalSteps: newSteps.length,
                    lastUpdated: 'Just now'
                  }
                : project
            )
          };
        });
      },
      
      updateStep: (projectId, stepId, updates) => {
        set((state) => ({
          steps: {
            ...state.steps,
            [projectId]: state.steps[projectId]?.map((step) =>
              step.id === stepId ? { ...step, ...updates } : step
            ) || []
          }
        }));
      },
      
      deleteStep: (projectId, stepId) => {
        set((state) => {
          const updatedSteps = state.steps[projectId]?.filter((step) => step.id !== stepId) || [];
          const completedSteps = updatedSteps.filter((step) => step.completed).length;
          const progress = updatedSteps.length > 0 ? Math.round((completedSteps / updatedSteps.length) * 100) : 0;
          
          return {
            steps: { ...state.steps, [projectId]: updatedSteps },
            projects: state.projects.map((project) =>
              project.id === projectId
                ? {
                    ...project,
                    totalSteps: updatedSteps.length,
                    stepsCompleted: completedSteps,
                    progress,
                    lastUpdated: 'Just now'
                  }
                : project
            )
          };
        });
      },
      
      toggleStepCompletion: (projectId, stepId) => {
        set((state) => {
          const updatedSteps = state.steps[projectId]?.map((step) =>
            step.id === stepId
              ? {
                  ...step,
                  completed: !step.completed,
                  completedAt: !step.completed ? new Date().toISOString().split('T')[0] : undefined
                }
              : step
          ) || [];
          
          const completedSteps = updatedSteps.filter((step) => step.completed).length;
          const progress = updatedSteps.length > 0 ? Math.round((completedSteps / updatedSteps.length) * 100) : 0;
          
          return {
            steps: { ...state.steps, [projectId]: updatedSteps },
            projects: state.projects.map((project) =>
              project.id === projectId
                ? {
                    ...project,
                    stepsCompleted: completedSteps,
                    progress,
                    lastUpdated: 'Just now'
                  }
                : project
            )
          };
        });
      },
      
      // Learning actions
      addLearning: (learningData) => {
        const newLearning: Learning = {
          ...learningData,
          id: Date.now().toString(),
          date: new Date().toLocaleDateString()
        };
        
        set((state) => ({
          learnings: [newLearning, ...state.learnings]
        }));
      },
      
      updateLearning: (id, updates) => {
        set((state) => ({
          learnings: state.learnings.map((learning) =>
            learning.id === id ? { ...learning, ...updates } : learning
          )
        }));
      },
      
      deleteLearning: (id) => {
        set((state) => ({
          learnings: state.learnings.filter((learning) => learning.id !== id)
        }));
      },
      
      // Code issue actions
      addCodeIssue: (issueData) => {
        const newIssue: CodeIssue = {
          ...issueData,
          id: Date.now().toString()
        };
        
        set((state) => ({
          codeIssues: [...state.codeIssues, newIssue]
        }));
      },
      
      updateCodeIssue: (id, updates) => {
        set((state) => ({
          codeIssues: state.codeIssues.map((issue) =>
            issue.id === id ? { ...issue, ...updates } : issue
          )
        }));
      },
      
      resolveCodeIssue: (id) => {
        set((state) => ({
          codeIssues: state.codeIssues.map((issue) =>
            issue.id === id
              ? { ...issue, resolved: true, resolvedAt: new Date().toISOString().split('T')[0] }
              : issue
          )
        }));
      },
      
      deleteCodeIssue: (id) => {
        set((state) => ({
          codeIssues: state.codeIssues.filter((issue) => issue.id !== id)
        }));
      },
      
      // Utility actions
      getProjectById: (id) => {
        return get().projects.find((project) => project.id === id);
      },
      
      getStepsByProjectId: (projectId) => {
        return get().steps[projectId] || [];
      },
      
      getLearningsByProjectId: (projectId) => {
        return get().learnings.filter((learning) => learning.projectId === projectId);
      },
      
      getCodeIssuesByProjectId: (projectId) => {
        return get().codeIssues.filter((issue) => issue.projectId === projectId);
      }
    }),
    {
      name: 'devtracker-storage',
      version: 1
    }
  )
);