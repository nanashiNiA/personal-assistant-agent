'use client';

import React, { useState } from 'react';
import { TaskItem } from '../../components/tasks/TaskItem';

export default function TasksPage() {
  const [tasks, setTasks] = useState([
    { id: '1', text: '買い物リストの作成', completed: false },
    { id: '2', text: 'メールの返信', completed: false },
    { id: '3', text: '会議の準備', completed: true }
  ]);

  const [newTaskText, setNewTaskText] = useState('');

  const handleToggle = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now().toString(),
          text: newTaskText.trim(),
          completed: false
        }
      ]);
      setNewTaskText('');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">タスク</h1>
      <div className="mb-4">
        <div className="flex">
          <input
            type="text"
            className="flex-1 p-2 border rounded-l focus:outline-none"
            placeholder="新しいタスクを追加"
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-r"
            onClick={handleAddTask}
          >
            追加
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            text={task.text}
            completed={task.completed}
            onToggle={() => handleToggle(task.id)}
          />
        ))}
      </div>
    </div>
  );
}