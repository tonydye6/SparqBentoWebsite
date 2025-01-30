import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
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

    const newMessage = { role: 'user' as const, content: message };
    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: newMessages })
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('API Error:', errorData);
        throw new Error(errorData || 'Chat service error');
      }

      const data = await response.json();
      console.log("Chat response:", data);

      if (!data?.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from chat service');
      }

      return data.choices[0].message;
    } catch (error) {
      console.error('Chat Error:', error);
      throw error;
    }
  };

  const chatMutation = useMutation({
    mutationFn: sendMessage,
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Chat Error",
        description: error.message,
        duration: 5000
      });
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
      setInput('');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || chatMutation.isPending) return;

    setMessages(prev => [...prev, { role: 'user', content: trimmedInput }]);
    chatMutation.mutate(trimmedInput);
  };

  return (
    <div className="card-content flex flex-col h-full max-h-[500px]">
      <ScrollArea className="flex-1 mb-4 pr-4 h-[350px]">
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

      <form onSubmit={handleSubmit} className="flex gap-2">
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
    </div>
  );
}