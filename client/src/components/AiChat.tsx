import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AiChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const { toast } = useToast();

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [
            ...messages,
            { role: 'user', content: message }
          ]
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Chat service error');
      }

      if (!data?.choices?.[0]?.message) {
        throw new Error('Invalid response format');
      }

      return data.choices[0].message;
    } catch (error) {
      console.error('Chat Error:', error);
      throw error;
    }
  };

  const chatMutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: (data) => {
      setMessages(prev => [
        ...prev,
        { role: 'user', content: input },
        { role: 'assistant', content: data.content }
      ]);
      setInput('');
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Chat Error",
        description: error.message,
        duration: 5000
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || chatMutation.isPending) return;
    chatMutation.mutate(trimmedInput);
  };

  return (
    <div className="flex flex-col h-full p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#2B2B42] via-[#EB0028]/20 to-[#2B2B42] animate-gradient" />
      <div className="absolute inset-0" style={{ 
        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(0, 242, 234, 0.15) 0%, transparent 70%)',
        animation: 'pulse 3s ease-in-out infinite'
      }} />
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#EB0028]/10 rounded-full filter blur-2xl transform translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00F2EA]/10 rounded-full filter blur-2xl transform -translate-x-1/2 translate-y-1/2" />
      <ScrollArea className="flex-1 pr-4 h-[calc(100%-80px)]">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-primary/10 ml-4 border border-primary/20'
                  : 'bg-muted mr-4'
              }`}
            >
              <div className={`text-sm ${msg.role === 'user' ? 'text-primary' : 'text-foreground'}`}>
                {msg.role === 'user' ? 'You' : 'Sparq Assistant'}
              </div>
              <div className="mt-1">{msg.content}</div>
            </div>
          ))}
          {chatMutation.isPending && (
            <div className="p-3 rounded-lg bg-muted mr-4">
              <div className="text-sm text-foreground">Sparq Assistant</div>
              <div className="mt-1">Thinking...</div>
            </div>
          )}
        </div>
      </ScrollArea>

      <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about Sparq Games..."
          disabled={chatMutation.isPending}
          className="bg-background/50"
        />
        <Button
          type="submit"
          disabled={chatMutation.isPending}
        >
          Send
        </Button>
      </form>

      <div className="mt-auto pt-4">
      </div>
    </div>
  );
}