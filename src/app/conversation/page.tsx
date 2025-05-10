import React from 'react';
import { ConversationMessage } from '../../components/conversation/ConversationMessage';

export default function ConversationPage() {
  const messages = [
    {
      message: "こんにちは、どのようにお手伝いできますか？",
      type: "assistant" as const,
      timestamp: "14:03"
    },
    {
      message: "今日の予定を教えてください。",
      type: "user" as const,
      timestamp: "14:04"
    },
    {
      message: "今日は特に予定が入っていません。何か追加しますか？",
      type: "assistant" as const,
      timestamp: "14:04"
    }
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">会話</h1>
      <div className="border rounded p-4 shadow-sm">
        {messages.map((msg, index) => (
          <ConversationMessage
            key={index}
            message={msg.message}
            type={msg.type}
            timestamp={msg.timestamp}
          />
        ))}

        <div className="mt-4">
          <div className="flex">
            <input
              type="text"
              className="flex-1 p-2 border rounded-l focus:outline-none"
              placeholder="メッセージを入力"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded-r">
              送信
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}