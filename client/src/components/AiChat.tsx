import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AiChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! Ask me anything about games, sports, or Sparq!' }
  ]);
  const [input, setInput] = useState('');
  const { toast } = useToast();

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: 'You are a helpful assistant for Sparq Games.' },
            ...messages,
            { role: 'user', content: message }
          ]
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send message');
      }

      return response.json();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
        duration: 3000
      });

      // Remove the failed message from the chat
      setMessages(prev => prev.slice(0, -1));
    },
    onSuccess: (data) => {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: data.choices[0].message.content }
      ]);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Optimistically add user message
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    chatMutation.mutate(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-center items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5" />
        <h3 className="font-heading font-semibold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          Sparq Assistant
        </h3>
      </div>
      <div className="flex justify-center items-center mb-4">
        <img 
          src="/Skull(Red).png" 
          alt="Red Skull" 
          className="w-24 h-24 object-contain"
        />
      </div>

      <ScrollArea className="flex-1 mb-4">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-2 rounded ${
                msg.role === 'user' 
                  ? 'bg-primary/10 ml-4' 
                  : 'bg-muted mr-4'
              }`}
            >
              {msg.content}
              {chatMutation.isPending && i === messages.length - 1 && (
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  <AlertCircle className="w-4 h-4 mr-2 animate-pulse" />
                  Processing...
                </div>
              )}
            </div>
          ))}
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
          size="icon"
          className="hover:bg-primary/20"
        >
          <MessageCircle className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}