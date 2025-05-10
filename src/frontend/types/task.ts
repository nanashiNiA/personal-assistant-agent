/**
 * @file タスク関連の型定義
 * @module frontend/types/task
 * @created 2025-05-11
 */

/**
 * タスクの状態
 */
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';

/**
 * タスクのステップ
 */
export interface TaskStep {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  startTime?: Date;
  endTime?: Date;
  progress: number; // 0-100
  dependencies?: string[]; // 依存するステップのID
}

/**
 * タスク
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: number; // 1-5 (5が最高優先度)
  createdAt: Date;
  updatedAt: Date;
  startTime?: Date;
  dueDate?: Date;
  completedAt?: Date;
  steps: TaskStep[];
  currentStepId?: string;
  tags?: string[];
  metadata?: {
    [key: string]: any;
  };
}

/**
 * タスク表示コンポーネントのプロパティ
 */
export interface TaskDisplayProps {
  tasks: Task[];
  currentTaskId?: string;
  onTaskSelect?: (task: Task) => void;
  showCompleted?: boolean;
  className?: string;
}

/**
 * タスク進捗状況コンポーネントのプロパティ
 */
export interface TaskProgressProps {
  task: Task;
  showDetails?: boolean;
  className?: string;
}

/**
 * ステップナビゲーターコンポーネントのプロパティ
 */
export interface StepNavigatorProps {
  steps: TaskStep[];
  currentStepId?: string;
  onStepSelect?: (stepId: string) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}