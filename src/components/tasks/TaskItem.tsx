import React from 'react';

interface TaskItemProps {
  text: string;
  completed: boolean;
  onToggle: () => void;
}

export function TaskItem({ text, completed, onToggle }: TaskItemProps) {
  return (
    <div className="flex items-center p-3 border rounded shadow-sm mb-2">
      <input
        type="checkbox"
        checked={completed}
        onChange={onToggle}
        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
      />
      <span className={completed ? "line-through text-gray-500" : ""}>
        {text}
      </span>
    </div>
  );
}