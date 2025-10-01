import { useState, useCallback } from 'react';
import { aiService, type AIResponse, type ChatMessage, type CodeAnalysisResult } from '@/services/aiService';

interface UseAIState {
  isLoading: boolean;
  error: string | null;
  data: any | null;
}

interface UseAIResult extends UseAIState {
  // Chat functionality
  sendMessage: (message: string) => Promise<void>;
  sendMessages: (messages: ChatMessage[]) => Promise<void>;
  
  // Code analysis
  analyzeCode: (code: string, language?: string) => Promise<CodeAnalysisResult>;
  
  // Code generation
  generateCode: (prompt: string, language?: string) => Promise<void>;
  optimizeCode: (code: string, language?: string) => Promise<void>;
  refactorCode: (code: string, language?: string) => Promise<void>;
  
  // Code explanation
  explainCode: (code: string, language?: string) => Promise<void>;
  suggestImprovements: (code: string, language?: string) => Promise<void>;
  generateTests: (code: string, language?: string) => Promise<void>;
  
  // App Development Specialized Methods
  generateAppIdea: (prompt: string) => Promise<void>;
  designAppArchitecture: (requirements: string) => Promise<void>;
  planAppDevelopment: (projectDescription: string) => Promise<void>;
  optimizeAppPerformance: (code: string, platform?: string) => Promise<void>;
  reviewAppSecurity: (code: string, platform?: string) => Promise<void>;
  generateAppDocumentation: (code: string, projectType?: string) => Promise<void>;
  
  // Utility
  reset: () => void;
  isConfigured: boolean;
}

export function useAI(): UseAIResult {
  const [state, setState] = useState<UseAIState>({
    isLoading: false,
    error: null,
    data: null,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading, error: loading ? null : prev.error }));
  }, []);

  const setError = useCallback((error: string) => {
    setState(prev => ({ ...prev, error, isLoading: false }));
  }, []);

  const setData = useCallback((data: any) => {
    setState(prev => ({ ...prev, data, isLoading: false, error: null }));
  }, []);

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null, data: null });
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    if (!aiService.isConfigured()) {
      setError('AI service is not configured. Please check your API key.');
      return;
    }

    setLoading(true);
    try {
      const response = await aiService.chatCompletion([
        { role: 'user', content: message }
      ]);

      if (response.success) {
        setData(response.choices[0]?.message.content);
      } else {
        setError(response.error || 'Failed to send message');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }, [setLoading, setError, setData]);

  const sendMessages = useCallback(async (messages: ChatMessage[]) => {
    if (!aiService.isConfigured()) {
      setError('AI service is not configured. Please check your API key.');
      return;
    }

    setLoading(true);
    try {
      const response = await aiService.chatCompletion(messages);

      if (response.success) {
        setData(response.choices[0]?.message.content);
      } else {
        setError(response.error || 'Failed to send messages');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }, [setLoading, setError, setData]);

  const analyzeCode = useCallback(async (code: string, language: string = 'javascript'): Promise<CodeAnalysisResult> => {
    if (!aiService.isConfigured()) {
      throw new Error('AI service is not configured. Please check your API key.');
    }

    setLoading(true);
    try {
      const result = await aiService.analyzeCode(code, language);
      setData(result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setError(errorMessage);
      throw error;
    }
  }, [setLoading, setError, setData]);

  const generateCode = useCallback(async (prompt: string, language: string = 'javascript') => {
    if (!aiService.isConfigured()) {
      setError('AI service is not configured. Please check your API key.');
      return;
    }

    setLoading(true);
    try {
      const response = await aiService.generateCode(prompt, language);

      if (response.success) {
        setData(response.choices[0]?.message.content);
      } else {
        setError(response.error || 'Failed to generate code');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }, [setLoading, setError, setData]);

  const optimizeCode = useCallback(async (code: string, language: string = 'javascript') => {
    if (!aiService.isConfigured()) {
      setError('AI service is not configured. Please check your API key.');
      return;
    }

    setLoading(true);
    try {
      const response = await aiService.optimizeCode(code, language);

      if (response.success) {
        setData(response.choices[0]?.message.content);
      } else {
        setError(response.error || 'Failed to optimize code');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }, [setLoading, setError, setData]);

  const refactorCode = useCallback(async (code: string, language: string = 'javascript') => {
    if (!aiService.isConfigured()) {
      setError('AI service is not configured. Please check your API key.');
      return;
    }

    setLoading(true);
    try {
      const response = await aiService.refactorCode(code, language);

      if (response.success) {
        setData(response.choices[0]?.message.content);
      } else {
        setError(response.error || 'Failed to refactor code');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }, [setLoading, setError, setData]);

  const explainCode = useCallback(async (code: string, language: string = 'javascript') => {
    if (!aiService.isConfigured()) {
      setError('AI service is not configured. Please check your API key.');
      return;
    }

    setLoading(true);
    try {
      const response = await aiService.explainCode(code, language);

      if (response.success) {
        setData(response.choices[0]?.message.content);
      } else {
        setError(response.error || 'Failed to explain code');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }, [setLoading, setError, setData]);

  const suggestImprovements = useCallback(async (code: string, language: string = 'javascript') => {
    if (!aiService.isConfigured()) {
      setError('AI service is not configured. Please check your API key.');
      return;
    }

    setLoading(true);
    try {
      const response = await aiService.suggestImprovements(code, language);

      if (response.success) {
        setData(response.choices[0]?.message.content);
      } else {
        setError(response.error || 'Failed to suggest improvements');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }, [setLoading, setError, setData]);

  const generateTests = useCallback(async (code: string, language: string = 'javascript') => {
    if (!aiService.isConfigured()) {
      setError('AI service is not configured. Please check your API key.');
      return;
    }

    setLoading(true);
    try {
      const response = await aiService.generateTests(code, language);

      if (response.success) {
        setData(response.choices[0]?.message.content);
      } else {
        setError(response.error || 'Failed to generate tests');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }, [setLoading, setError, setData]);

  // App Development Specialized Methods
  const generateAppIdea = useCallback(async (prompt: string) => {
    if (!aiService.isConfigured()) {
      setError('AI service is not configured. Please check your API key.');
      return;
    }

    setLoading(true);
    try {
      const response = await aiService.generateAppIdea(prompt);

      if (response.success) {
        setData(response.choices[0]?.message.content);
      } else {
        setError(response.error || 'Failed to generate app idea');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }, [setLoading, setError, setData]);

  const designAppArchitecture = useCallback(async (requirements: string) => {
    if (!aiService.isConfigured()) {
      setError('AI service is not configured. Please check your API key.');
      return;
    }

    setLoading(true);
    try {
      const response = await aiService.designAppArchitecture(requirements);

      if (response.success) {
        setData(response.choices[0]?.message.content);
      } else {
        setError(response.error || 'Failed to design app architecture');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }, [setLoading, setError, setData]);

  const planAppDevelopment = useCallback(async (projectDescription: string) => {
    if (!aiService.isConfigured()) {
      setError('AI service is not configured. Please check your API key.');
      return;
    }

    setLoading(true);
    try {
      const response = await aiService.planAppDevelopment(projectDescription);

      if (response.success) {
        setData(response.choices[0]?.message.content);
      } else {
        setError(response.error || 'Failed to plan app development');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }, [setLoading, setError, setData]);

  const optimizeAppPerformance = useCallback(async (code: string, platform: string = 'web') => {
    if (!aiService.isConfigured()) {
      setError('AI service is not configured. Please check your API key.');
      return;
    }

    setLoading(true);
    try {
      const response = await aiService.optimizeAppPerformance(code, platform);

      if (response.success) {
        setData(response.choices[0]?.message.content);
      } else {
        setError(response.error || 'Failed to optimize app performance');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }, [setLoading, setError, setData]);

  const reviewAppSecurity = useCallback(async (code: string, platform: string = 'web') => {
    if (!aiService.isConfigured()) {
      setError('AI service is not configured. Please check your API key.');
      return;
    }

    setLoading(true);
    try {
      const response = await aiService.reviewAppSecurity(code, platform);

      if (response.success) {
        setData(response.choices[0]?.message.content);
      } else {
        setError(response.error || 'Failed to review app security');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }, [setLoading, setError, setData]);

  const generateAppDocumentation = useCallback(async (code: string, projectType: string = 'web') => {
    if (!aiService.isConfigured()) {
      setError('AI service is not configured. Please check your API key.');
      return;
    }

    setLoading(true);
    try {
      const response = await aiService.generateAppDocumentation(code, projectType);

      if (response.success) {
        setData(response.choices[0]?.message.content);
      } else {
        setError(response.error || 'Failed to generate app documentation');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }, [setLoading, setError, setData]);

  return {
    ...state,
    sendMessage,
    sendMessages,
    analyzeCode,
    generateCode,
    optimizeCode,
    refactorCode,
    explainCode,
    suggestImprovements,
    generateTests,
    generateAppIdea,
    designAppArchitecture,
    planAppDevelopment,
    optimizeAppPerformance,
    reviewAppSecurity,
    generateAppDocumentation,
    reset,
    isConfigured: aiService.isConfigured(),
  };
}
