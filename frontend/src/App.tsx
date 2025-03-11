import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  completed?: boolean;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sessionId) {
      setSessionId(`session-${Date.now()}`);
    }

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sessionId]);

  const fetchAIResponse = async (userMessage: string) => {
    setIsTyping(true);

    const aiMessageId = `ai-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      { id: aiMessageId, content: '', sender: 'ai' },
    ]);

    try {
      const response = await fetch('http://localhost:3000/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: userMessage,
          contentType: 'text',
          sessionId: "c34bd698-d016-45a2-81ac-9bbb5dccf6a8",
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const aiResponse = data.content;

      let displayedResponse = '';
      for (let i = 0; i < aiResponse.length; i++) {
        displayedResponse += aiResponse[i];

        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === aiMessageId
              ? { ...msg, content: displayedResponse }
              : msg
          )
        );

        await new Promise((resolve) => setTimeout(resolve, 15));
      }

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === aiMessageId ? { ...msg, completed: true } : msg
        )
      );
    } catch (error) {
      console.error('Error fetching AI response:', error);

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === aiMessageId
            ? {
                ...msg,
                content: 'Sorry, I encountered an error.',
                completed: true,
              }
            : msg
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    const newMessage: Message = {
      id: `user-${Date.now()}`,
      content: userMessage,
      sender: 'user',
      completed: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');

    fetchAIResponse(userMessage);
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-50 p-4'>
      <Card className='w-full max-w-md h-[80vh] flex flex-col'>
        <CardHeader className='border-b'>
          <CardTitle className='text-center'>HyScaler AI</CardTitle>
        </CardHeader>

        <CardContent className='flex-1 overflow-y-auto py-4'>
          <div className='space-y-4'>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.content ||
                    (message.sender === 'ai' && !message.completed && '▌')}
                </div>
              </div>
            ))}
            {isTyping && messages.length === 0 && (
              <div className='flex justify-start'>
                <div className='max-w-[80%] rounded-lg px-4 py-2 bg-muted'>
                  ▌
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>

        <CardFooter className='border-t p-4'>
          <form onSubmit={handleSubmit} className='flex w-full gap-2'>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Type your message...'
              disabled={isTyping}
              className='flex-1'
            />
            <Button
              type='submit'
              size='icon'
              disabled={isTyping || !input.trim()}
            >
              <Send className='h-4 w-4' />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;
