import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: any;
}

export const useAIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendMessage = useCallback(async (content: string, context?: any) => {
    const userMessage: Message = {
      type: 'user',
      content,
      timestamp: new Date(),
      context,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
      
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.type === 'user' ? 'user' : 'assistant',
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get AI response');
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';
      let assistantMessageAdded = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.trim() || line.startsWith(':')) continue;
          if (!line.startsWith('data: ')) continue;

          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices?.[0]?.delta?.content;
            
            if (content) {
              assistantContent += content;
              
              if (!assistantMessageAdded) {
                setMessages(prev => [...prev, {
                  type: 'assistant',
                  content: assistantContent,
                  timestamp: new Date(),
                }]);
                assistantMessageAdded = true;
              } else {
                setMessages(prev => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];
                  if (lastMessage.type === 'assistant') {
                    lastMessage.content = assistantContent;
                  }
                  return newMessages;
                });
              }
            }
          } catch (e) {
            // Ignore JSON parse errors for incomplete chunks
          }
        }
      }

      setIsLoading(false);
    } catch (error) {
      console.error('AI chat error:', error);
      setIsLoading(false);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send message',
        variant: 'destructive',
      });
    }
  }, [messages, toast]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  };
};
