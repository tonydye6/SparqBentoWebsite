import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, AlertCircle, SendHorizonal, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function AiChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! Ask me anything about Sparq Games, sports, or gaming!' }
  ]);
  const [input, setInput] = useState('');
  const { toast } = useToast();

const sendMessage = async (message: string) => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: [{
          role: 'user',
          content: message
        }]
      })
    });

    if (!response.ok) {
      throw new Error('Chat service error');
    }

    return await response.json();
  } catch (error) {
    console.error('Chat Error:', error);
    throw new Error('Failed to send message');
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
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('Invalid response from chat service');
      }

      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: content.trim() }
      ]);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || chatMutation.isPending) return;

    setMessages(prev => [...prev, { role: 'user', content: trimmedInput }]);
    chatMutation.mutate(trimmedInput);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-center items-center gap-2 mb-4">
        <MessageCircle className="w-5 h-5" />
        <h3 className="font-heading text-xl font-semibold drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          Sparq Assistant
        </h3>
      </div>

      <ScrollArea className="flex-1 mb-4 pr-4">
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
          size="icon"
          className="hover:bg-primary/20"
        >
          <SendHorizonal className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}