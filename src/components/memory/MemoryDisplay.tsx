import React from 'react';

interface MemoryDisplayProps {
  title: string;
  content: string;
  date: string;
  tags?: string[];
}

export function MemoryDisplay({ title, content, date, tags = [] }: MemoryDisplayProps) {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <span className="text-xs text-gray-500">{date}</span>
      </div>

      <p className="text-sm text-gray-700 mb-3">{content}</p>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}