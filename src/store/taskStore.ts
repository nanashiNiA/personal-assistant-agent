/**
 * @file タスク状態管理
 * @module store/taskStore
 * @created 2025-05-11
 */

import { create } from 'zustand';
import { Task, TaskStep, TaskStatus } from '../types/task';

// 状態の更新と取得のための型定義
type SetState = (
  partial: Partial<TaskState> | ((state: TaskState) => Partial<TaskState>),
  replace?: boolean
) => void;

type GetState = () => TaskState;

interface TaskState {
  // データ
  tasks: Task[];
  currentTaskId: string | null;

  // UI状態
  selectedTaskId: string | null;
  selectedStepId: string | null;
  isLoading: boolean;
  error: string | null;

  // アクション
  fetchTasks: () => Promise<void>;
  fetchTaskDetails: (taskId: string) => Promise<void>;
  setCurrentTask: (taskId: string | null) => void;
  selectTask: (taskId: string | null) => void;
  selectStep: (stepId: string | null) => void;
  updateTaskProgress: (taskId: string, progress: number) => Promise<void>;
  updateStepStatus: (taskId: string, stepId: string, status: TaskStatus) => Promise<void>;
  resetError: () => void;
}

export const useTaskStore = create<TaskState>((set: SetState, get: GetState) => ({
  // 初期データ
  tasks: [],
  currentTaskId: null,

  // 初期UI状態
  selectedTaskId: null,
  selectedStepId: null,
  isLoading: false,
  error: null,

  // アクション
  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      // TODO: 実際のAPIからデータを取得する実装
      // ダミーデータ
      const steps1: TaskStep[] = [
        {
          id: 'step-001',
          title: '要件整理',
          description: 'プロジェクトの基本要件を整理する',
          status: 'completed',
          startTime: new Date('2025-05-01'),
          endTime: new Date('2025-05-03'),
          progress: 100
        },
        {
          id: 'step-002',
          title: '設計',
          description: 'システム設計を行う',
          status: 'in_progress',
          startTime: new Date('2025-05-04'),
          progress: 60
        },
        {
          id: 'step-003',
          title: '実装',
          description: '機能を実装する',
          status: 'pending',
          progress: 0,
          dependencies: ['step-002']
        }
      ];

      const steps2: TaskStep[] = [
        {
          id: 'step-004',
          title: '情報収集',
          description: '必要な情報を集める',
          status: 'in_progress',
          startTime: new Date('2025-05-10'),
          progress: 40
        },
        {
          id: 'step-005',
          title: '計画立案',
          description: '旅行計画を立てる',
          status: 'pending',
          progress: 0,
          dependencies: ['step-004']
        }
      ];

      const dummyTasks: Task[] = [
        {
          id: 'task-001',
          title: 'プロジェクト開発',
          description: '新しいWebアプリケーションの開発',
          status: 'in_progress',
          priority: 5,
          createdAt: new Date('2025-05-01'),
          updatedAt: new Date('2025-05-10'),
          startTime: new Date('2025-05-01'),
          dueDate: new Date('2025-06-01'),
          steps: steps1,
          currentStepId: 'step-002'
        },
        {
          id: 'task-002',
          title: '旅行計画',
          description: '夏休みの旅行計画を立てる',
          status: 'in_progress',
          priority: 3,
          createdAt: new Date('2025-05-10'),
          updatedAt: new Date('2025-05-10'),
          startTime: new Date('2025-05-10'),
          dueDate: new Date('2025-05-20'),
          steps: steps2,
          currentStepId: 'step-004'
        }
      ];

      set({
        tasks: dummyTasks,
        currentTaskId: dummyTasks.length > 0 ? dummyTasks[0].id : null,
        isLoading: false
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'タスクの取得に失敗しました', isLoading: false });
    }
  },

  fetchTaskDetails: async (taskId: string) => {
    set({ isLoading: true, error: null });
    try {
      // 実際の実装では、APIからタスクの詳細を取得
      // ここではすでにタスクに詳細が含まれていると仮定
      set({ isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'タスク詳細の取得に失敗しました', isLoading: false });
    }
  },

  setCurrentTask: (taskId: string | null) => set({ currentTaskId: taskId }),

  selectTask: (taskId: string | null) => set({ selectedTaskId: taskId, selectedStepId: null }),

  selectStep: (stepId: string | null) => set({ selectedStepId: stepId }),

  updateTaskProgress: async (taskId: string, progress: number) => {
    set({ isLoading: true, error: null });
    try {
      // 実際の実装では、APIを使用してタスクの進捗を更新
      const { tasks } = get();
      const updatedTasks = tasks.map(task => {
        if (task.id === taskId) {
          // タスクの進捗を更新
          const taskProgress = progress;
          // タスクの状態を更新
          let status: TaskStatus = task.status;
          if (progress >= 100) {
            status = 'completed';
          } else if (progress > 0) {
            status = 'in_progress';
          }

          return { ...task, status };
        }
        return task;
      });

      set({ tasks: updatedTasks, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'タスク進捗の更新に失敗しました', isLoading: false });
    }
  },

  updateStepStatus: async (taskId: string, stepId: string, status: TaskStatus) => {
    set({ isLoading: true, error: null });
    try {
      // 実際の実装では、APIを使用してステップのステータスを更新
      const { tasks } = get();
      const updatedTasks = tasks.map(task => {
        if (task.id === taskId) {
          const updatedSteps = task.steps.map(step => {
            if (step.id === stepId) {
              let progress = step.progress;
              if (status === 'completed') {
                progress = 100;
              } else if (status === 'in_progress' && step.progress === 0) {
                progress = 10; // 開始時の初期進捗
              } else if (status === 'pending' || status === 'cancelled' || status === 'failed') {
                progress = 0;
              }

              return { ...step, status, progress };
            }
            return step;
          });

          // タスク全体の進捗を更新
          const totalSteps = updatedSteps.length;
          const completedSteps = updatedSteps.filter(s => s.status === 'completed').length;
          const overallProgress = totalSteps > 0 ? Math.floor((completedSteps / totalSteps) * 100) : 0;

          // タスクの状態を更新
          let taskStatus: TaskStatus = task.status;
          if (overallProgress >= 100) {
            taskStatus = 'completed';
          } else if (overallProgress > 0) {
            taskStatus = 'in_progress';
          }

          return {
            ...task,
            steps: updatedSteps,
            status: taskStatus,
            currentStepId: status === 'completed' ?
              // 完了したステップの次のステップを現在のステップに設定
              updatedSteps.find(s => s.dependencies?.includes(stepId))?.id || task.currentStepId :
              task.currentStepId
          };
        }
        return task;
      });

      set({ tasks: updatedTasks, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'ステップステータスの更新に失敗しました', isLoading: false });
    }
  },

  resetError: () => set({ error: null })
}));