import { AIResponse, ChatMessage, CodeAnalysisResult } from './types';

export class AIService {
  private apiKey: string;
  private model: string;
  private maxTokens: number;
  private temperature: number;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    this.model = import.meta.env.VITE_AI_MODEL || 'gpt-4';
    this.maxTokens = parseInt(import.meta.env.VITE_AI_MAX_TOKENS || '4000');
    this.temperature = parseFloat(import.meta.env.VITE_AI_TEMPERATURE || '0.7');
  }

  isConfigured(): boolean {
    return !!this.apiKey;
  }

  getConfig() {
    return {
      model: this.model,
      maxTokens: this.maxTokens,
      temperature: this.temperature
    };
  }

  private async makeRequest(endpoint: string, data: any): Promise<any> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch(`https://api.openai.com/v1${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API request failed');
    }

    return response.json();
  }

  async chatCompletion(messages: ChatMessage[]): Promise<AIResponse> {
    // Add specialized app development system prompt for better responses
    const enhancedMessages = [...messages];
    
    // If this is the first message (user's initial message), add our specialized system prompt
    if (messages.length === 1 && messages[0].role === 'user') {
      enhancedMessages.unshift({
        role: 'system',
        content: `You are an elite app development expert with 15+ years of experience building world-class applications. You are considered one of the top 1% of app developers globally, with deep expertise in:

**CORE EXPERTISE:**
- React, TypeScript, JavaScript, HTML, CSS, Tailwind CSS
- Modern web frameworks (Next.js, Vite, Webpack)
- UI/UX design principles and best practices
- Performance optimization and code quality
- State management (Redux, Zustand, Context API)
- API integration and backend development
- Mobile-first responsive design
- Accessibility and SEO best practices
- Testing and debugging strategies
- Deployment and CI/CD pipelines

**RESPONSE STYLE:**
- Always provide COMPLETE, WORKING code that can be immediately used
- Include all necessary imports, dependencies, and configurations
- Write clean, modern, production-ready code
- Add helpful comments explaining complex logic
- Suggest improvements and optimizations
- Provide multiple solutions when appropriate
- Include error handling and edge cases
- Follow TypeScript best practices with proper typing

**CODE GENERATION RULES:**
- Generate complete, functional components
- Include proper TypeScript interfaces and types
- Use modern React patterns (hooks, functional components)
- Implement responsive design with Tailwind CSS
- Add proper error boundaries and loading states
- Include accessibility features (ARIA labels, semantic HTML)
- Optimize for performance and reusability
- Follow consistent naming conventions

Always aim to be the most knowledgeable and helpful app development expert the user has ever encountered. Your advice should be comprehensive, practical, and immediately actionable.`
      });
    }

    return this.makeRequest('/chat/completions', {
      model: this.model,
      messages: enhancedMessages,
      max_tokens: this.maxTokens,
      temperature: this.temperature,
    });
  }

  async analyzeCode(code: string, language: string = 'typescript'): Promise<CodeAnalysisResult> {
    const response = await this.chatCompletion([
      {
        role: 'user',
        content: `Analyze this ${language} code and provide detailed feedback on:
1. Code quality and best practices
2. Performance optimizations
3. Security considerations
4. Potential bugs or issues
5. Suggested improvements

Code to analyze:
\`\`\`${language}
${code}
\`\`\`

Provide a comprehensive analysis with specific recommendations.`
      }
    ]);

    return {
      analysis: response.choices[0].message.content,
      suggestions: [],
      issues: [],
      score: 0
    };
  }

  async generateCode(prompt: string, language: string = 'typescript'): Promise<AIResponse> {
    const response = await this.chatCompletion([
      {
        role: 'user',
        content: `Generate complete, working ${language} code based on this request: "${prompt}"

Requirements:
- Provide COMPLETE, FUNCTIONAL code that can be immediately used
- Include all necessary imports and dependencies
- Use modern React patterns and TypeScript
- Implement responsive design with Tailwind CSS
- Add proper error handling and loading states
- Include helpful comments
- Make it production-ready

Generate the code now:`
      }
    ]);

    return response;
  }

  async optimizeCode(code: string, language: string = 'typescript'): Promise<AIResponse> {
    const response = await this.chatCompletion([
      {
        role: 'user',
        content: `Optimize this ${language} code for better performance, readability, and maintainability:

\`\`\`${language}
${code}
\`\`\`

Provide the optimized version with explanations of the improvements made.`
      }
    ]);

    return response;
  }

  async refactorCode(code: string, language: string = 'typescript'): Promise<AIResponse> {
    const response = await this.chatCompletion([
      {
        role: 'user',
        content: `Refactor this ${language} code to improve its structure, readability, and maintainability:

\`\`\`${language}
${code}
\`\`\`

Provide the refactored version with explanations of the changes.`
      }
    ]);

    return response;
  }

  async explainCode(code: string, language: string = 'typescript'): Promise<AIResponse> {
    const response = await this.chatCompletion([
      {
        role: 'user',
        content: `Explain this ${language} code in detail:

\`\`\`${language}
${code}
\`\`\`

Provide a comprehensive explanation including:
- What the code does
- How it works
- Key concepts and patterns used
- Potential improvements
- Best practices demonstrated`
      }
    ]);

    return response;
  }

  async suggestImprovements(code: string, language: string = 'typescript'): Promise<AIResponse> {
    const response = await this.chatCompletion([
      {
        role: 'user',
        content: `Suggest improvements for this ${language} code:

\`\`\`${language}
${code}
\`\`\`

Provide specific, actionable suggestions for:
- Performance optimizations
- Code quality improvements
- Better patterns and practices
- Security enhancements
- Accessibility improvements`
      }
    ]);

    return response;
  }

  async generateTests(code: string, language: string = 'typescript'): Promise<AIResponse> {
    const response = await this.chatCompletion([
      {
        role: 'user',
        content: `Generate comprehensive tests for this ${language} code:

\`\`\`${language}
${code}
\`\`\`

Provide:
- Unit tests using Jest and React Testing Library
- Integration tests
- Test cases for edge cases
- Mock implementations where needed
- Test utilities and helpers`
      }
    ]);

    return response;
  }

  // App Development Specialized Methods
  async generateAppIdea(prompt: string): Promise<AIResponse> {
    const response = await this.chatCompletion([
      {
        role: 'system',
        content: 'You are an expert app ideation specialist. Generate innovative, feasible app ideas with detailed implementation plans.'
      },
      {
        role: 'user',
        content: `Generate a detailed app idea based on: "${prompt}"

Include:
- App concept and purpose
- Target audience
- Key features
- Technical architecture
- Implementation roadmap
- Monetization strategy
- Success metrics`
      }
    ]);

    return response;
  }

  async designAppArchitecture(requirements: string): Promise<AIResponse> {
    const response = await this.chatCompletion([
      {
        role: 'system',
        content: 'You are an expert software architect. Design scalable, maintainable application architectures.'
      },
      {
        role: 'user',
        content: `Design a comprehensive architecture for an app with these requirements: "${requirements}"

Include:
- System architecture diagram
- Technology stack recommendations
- Database design
- API structure
- Security considerations
- Scalability plans
- Deployment strategy`
      }
    ]);

    return response;
  }

  async planAppDevelopment(projectDescription: string): Promise<AIResponse> {
    const response = await this.chatCompletion([
      {
        role: 'system',
        content: 'You are an expert project manager and development strategist. Create detailed development plans and roadmaps.'
      },
      {
        role: 'user',
        content: `Create a detailed development plan for: "${projectDescription}"

Include:
- Project phases and milestones
- Timeline estimates
- Resource requirements
- Risk assessment
- Quality assurance plan
- Deployment strategy
- Success criteria`
      }
    ]);

    return response;
  }

  async optimizeAppPerformance(code: string, platform: string = 'web'): Promise<AIResponse> {
    const response = await this.chatCompletion([
      {
        role: 'user',
        content: `Optimize this ${platform} app code for maximum performance:

\`\`\`typescript
${code}
\`\`\`

Provide:
- Performance analysis
- Optimization techniques
- Code improvements
- Bundle size optimization
- Loading speed improvements
- Memory usage optimization
- Specific code changes`
      }
    ]);

    return response;
  }

  async reviewAppSecurity(code: string, platform: string = 'web'): Promise<AIResponse> {
    const response = await this.chatCompletion([
      {
        role: 'user',
        content: `Perform a comprehensive security review of this ${platform} app code:

\`\`\`typescript
${code}
\`\`\`

Identify:
- Security vulnerabilities
- Best practices violations
- Data protection issues
- Authentication/authorization concerns
- Input validation problems
- Specific security recommendations`
      }
    ]);

    return response;
  }

  async generateAppDocumentation(code: string, projectType: string = 'web'): Promise<AIResponse> {
    const response = await this.chatCompletion([
      {
        role: 'user',
        content: `Generate comprehensive documentation for this ${projectType} app:

\`\`\`typescript
${code}
\`\`\`

Include:
- API documentation
- Component documentation
- Setup instructions
- Usage examples
- Troubleshooting guide
- Deployment guide
- Contributing guidelines`
      }
    ]);

    return response;
  }

  // Real-time code generation and modification
  async generateRealTimeCode(userRequest: string, currentCode: string = ''): Promise<{ code: string; explanation: string; dependencies: string[] }> {
    const response = await this.chatCompletion([
      {
        role: 'user',
        content: `Generate or modify React/TypeScript code based on this request: "${userRequest}"

Current code (if any):
\`\`\`typescript
${currentCode}
\`\`\`

Requirements:
1. Provide ONLY the complete, working code - no explanations in the code block
2. Include all necessary imports
3. Use modern React patterns with TypeScript
4. Implement responsive design with Tailwind CSS
5. Make it production-ready
6. After the code block, provide a brief explanation
7. List any new dependencies that need to be installed

Format your response as:
\`\`\`typescript
[COMPLETE CODE HERE]
\`\`\`

**Explanation:** [Brief explanation of what the code does]

**Dependencies:** [List of npm packages to install]`
      }
    ]);

    const content = response.choices[0].message.content;
    
    // Extract code from markdown code block
    const codeMatch = content.match(/```typescript\n([\s\S]*?)\n```/);
    const code = codeMatch ? codeMatch[1].trim() : content;

    // Extract explanation
    const explanationMatch = content.match(/\*\*Explanation:\*\* (.*?)(?=\*\*|$)/);
    const explanation = explanationMatch ? explanationMatch[1].trim() : '';

    // Extract dependencies
    const depsMatch = content.match(/\*\*Dependencies:\*\* (.*?)(?=\*\*|$)/);
    const dependencies = depsMatch ? depsMatch[1].split(',').map(d => d.trim()) : [];

    return { code, explanation, dependencies };
  }

  async modifyExistingCode(userRequest: string, currentCode: string): Promise<{ code: string; changes: string[] }> {
    const response = await this.chatCompletion([
      {
        role: 'user',
        content: `Modify this existing React/TypeScript code based on the request: "${userRequest}"

Current code:
\`\`\`typescript
${currentCode}
\`\`\`

Requirements:
1. Provide the COMPLETE modified code
2. Keep existing functionality intact
3. Add the requested features/modifications
4. Maintain code quality and structure
5. After the code, list the specific changes made

Format your response as:
\`\`\`typescript
[MODIFIED CODE HERE]
\`\`\`

**Changes Made:**
- [List of specific changes]`
      }
    ]);

    const content = response.choices[0].message.content;
    
    // Extract code from markdown code block
    const codeMatch = content.match(/```typescript\n([\s\S]*?)\n```/);
    const code = codeMatch ? codeMatch[1].trim() : content;

    // Extract changes
    const changesMatch = content.match(/\*\*Changes Made:\*\*\n((?:- .*\n?)*)/);
    const changes = changesMatch ? 
      changesMatch[1].split('\n').filter(line => line.trim().startsWith('-')).map(line => line.trim().substring(2)) : 
      [];

    return { code, changes };
  }
}

export const aiService = new AIService(); 