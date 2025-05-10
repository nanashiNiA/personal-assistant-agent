import React from 'react';

type MessageType = 'user' | 'assistant';

interface ConversationMessageProps {
  message: string;
  type: MessageType;
  timestamp?: string;
}

export function ConversationMessage({ message, type, timestamp }: ConversationMessageProps) {
  return (
    <div className={`mb-4 ${type === 'user' ? 'text-right' : ''}`}>
      <div className="flex flex-col">
        {timestamp && (
          <span className={`text-xs text-gray-500 mb-1 ${type === 'user' ? 'self-end' : 'self-start'}`}>
            {timestamp}
          </span>
        )}
        <p
          className={`p-3 rounded-lg inline-block max-w-[80%] ${
            type === 'user'
              ? 'bg-blue-100 text-left self-end'
              : 'bg-gray-100 self-start'
          }`}
        >
          {message}
        </p>
      </div>
    </div>
  );
}