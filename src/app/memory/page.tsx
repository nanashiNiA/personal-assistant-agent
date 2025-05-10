import React from 'react';
import { MemoryDisplay } from '../../components/memory/MemoryDisplay';

export default function MemoryPage() {
  const memoryItems = [
    {
      title: "短期記憶",
      content: "最近の会話や情報を一時的に保存します。頻繁にアクセスされるデータや最近のインタラクションの文脈を保持します。",
      date: "2025-05-11",
      tags: ["短期", "一時", "会話"]
    },
    {
      title: "長期記憶",
      content: "重要な情報を永続的に保存します。ユーザーの好み、重要な日付、定期的なタスクなどの情報を保持します。",
      date: "2025-05-11",
      tags: ["長期", "永続", "重要"]
    },
    {
      title: "ワーキングメモリ",
      content: "現在のタスクに関連する情報を処理します。複数のソースからの情報を組み合わせて作業中のコンテキストを保持します。",
      date: "2025-05-11",
      tags: ["作業", "処理", "コンテキスト"]
    }
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">記憶システム</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {memoryItems.map((item, index) => (
          <MemoryDisplay
            key={index}
            title={item.title}
            content={item.content}
            date={item.date}
            tags={item.tags}
          />
        ))}
      </div>
    </div>
  );
}