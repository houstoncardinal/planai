import { z } from 'zod'

// Project validation schemas
export const ProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  category: z.string().min(1, 'Category is required'),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.string().optional(),
  technologies: z.array(z.string().min(1)).max(10, 'Too many technologies'),
  team: z.array(z.string().min(1)).max(10, 'Too many team members'),
  budget: z.string().optional(),
  timeSpent: z.string().optional(),
  estimatedCompletion: z.string().optional()
})

// Step validation schemas
export const StepSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  priority: z.enum(['low', 'medium', 'high', 'critical']).optional(),
  estimatedHours: z.number().min(0).max(1000).optional(),
  status: z.enum(['not_started', 'in_progress', 'blocked', 'completed']).optional(),
  notes: z.string().max(1000, 'Notes too long').optional(),
  learnings: z.array(z.string()).optional(),
  impact: z.array(z.string()).optional()
})

// Learning validation schemas
export const LearningSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  content: z.string().min(1, 'Content is required').max(2000, 'Content too long'),
  type: z.enum(['success', 'failure', 'insight']),
  tags: z.array(z.string().min(1)).max(10, 'Too many tags'),
  relatedStep: z.string().optional(),
  project: z.string().min(1, 'Project is required')
})

// Goal validation schemas
export const GoalSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  targetDate: z.string().optional(),
  progress: z.number().min(0).max(100)
})

// Input sanitization utilities
export const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, '')
}

export const sanitizeHtml = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

// Validation helpers
export const validateProjectData = (data: unknown) => {
  try {
    return ProjectSchema.parse(data)
  } catch (error) {
    throw new Error(`Project validation failed: ${error}`)
  }
}

export const validateStepData = (data: unknown) => {
  try {
    return StepSchema.parse(data)
  } catch (error) {
    throw new Error(`Step validation failed: ${error}`)
  }
}

export const validateLearningData = (data: unknown) => {
  try {
    return LearningSchema.parse(data)
  } catch (error) {
    throw new Error(`Learning validation failed: ${error}`)
  }
}

export const validateGoalData = (data: unknown) => {
  try {
    return GoalSchema.parse(data)
  } catch (error) {
    throw new Error(`Goal validation failed: ${error}`)
  }
}

// Type exports
export type ProjectInput = z.infer<typeof ProjectSchema>
export type StepInput = z.infer<typeof StepSchema>
export type LearningInput = z.infer<typeof LearningSchema>
export type GoalInput = z.infer<typeof GoalSchema> 