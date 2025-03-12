import type { Message } from '../types';

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
}

export default function MessageList({ messages, isTyping }: MessageListProps) {
  return (
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
              (message.sender === 'assistant' && !message.completed && '▌')}
          </div>
        </div>
      ))}
      {isTyping && (
        <div className='flex justify-start'>
          <div className='max-w-[80%] rounded-lg px-4 py-2 bg-muted'>▌</div>
        </div>
      )}
    </div>
  );
}
