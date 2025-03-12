import { useState, useRef, useEffect, useContext } from 'react';
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

import { WebsocketContext } from './contexts/WebsocketContext';
import MessageList from './components/MessageList';
import config from './config';
import type { Message } from './types';

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId] = useState(config.sessionId);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const socket = useContext(WebsocketContext);

  useEffect(() => {
    fetchInitialMessages();
  }, []);

  useEffect(() => {
    socket?.on('assistantResponse', handleAssistantResponse);
    return () => {
      socket?.off('assistantResponse');
    };
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchInitialMessages = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/conversation`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        const formattedMessages = data.map((msg: any) => ({
          id: `${msg.role}-${msg.id || Date.now()}`,
          content: msg.content,
          sender: msg.role === 'user' ? 'user' : 'assistant',
          completed: true,
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Failed to fetch initial messages:', error);
    }
  };

  const handleAssistantResponse = (data: any) => {
    if (data.sessionId === sessionId) {
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.sender === 'assistant' && !message.completed
            ? { ...message, content: data.content, completed: true }
            : message
        )
      );
    }
  };

  const sendMessage = async (userMessage: string) => {
    setIsTyping(true);

    const assistantMessageId = `assistant-${Date.now()}`;
    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        content: userMessage,
        sender: 'user',
        completed: true,
      },
      {
        id: assistantMessageId,
        content: '',
        sender: 'assistant',
        completed: false,
      },
    ]);

    try {
      const response = await fetch(`${config.apiUrl}/conversation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: userMessage,
          contentType: 'text',
          sessionId: sessionId,
          role: 'user',
        }),
      });

      if (!response.ok) throw new Error('API request failed');
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === assistantMessageId
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
    sendMessage(input.trim());
    setInput('');
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-50 p-4'>
      <Card className='w-full max-w-2xl h-[80vh] flex flex-col'>
        <CardHeader className='border-b'>
          <CardTitle className='text-center'>HyScaler AI</CardTitle>
        </CardHeader>

        <CardContent className='flex-1 overflow-y-auto py-4'>
          <MessageList messages={messages} isTyping={isTyping} />
          <div ref={messagesEndRef} />
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
