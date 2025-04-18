# ワークフロー統合の設計

個人アシスタントエージェントに複雑な処理フローを組み込むためのワークフロー設計について説明します。

## ワークフローの概要

Mastraのワークフロー機能を使用すると、複数のステップや条件分岐を含む複雑なタスクを定義できます。個人アシスタントには以下の主要なワークフローを実装します：

1. **タスク管理ワークフロー** - タスクの作成、更新、完了処理
2. **リマインダーワークフロー** - 通知の設定と送信

## 1. タスク管理ワークフロー

### 主な機能
- タスクの作成と保存
- タスクのステータス更新
- タスクの優先順位付け
- 締め切りの設定と監視
- タスク完了の処理

### 実装例（src/mastra/workflows/taskManagement.ts）

```typescript
import { createWorkflow } from '@mastra/core/workflow';
import { createStep } from '@mastra/core/workflow';

// タスクのステータス
enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
  CANCELLED = 'cancelled',
}

// タスクの優先度
enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export const taskManagementWorkflow = (userId: string) => createWorkflow({
  name: 'taskManagement',
  description: 'タスクの作成と管理を行うワークフロー',

  steps: {
    // ステップ1: タスクの作成
    createTask: createStep({
      name: 'createTask',
      description: '新しいタスクを作成',

      // 入力パラメータ
      input: {
        title: { type: 'string', required: true },
        description: { type: 'string', required: false },
        dueDate: { type: 'string', format: 'date-time', required: false },
        priority: {
          type: 'string',
          enum: Object.values(TaskPriority),
          default: TaskPriority.MEDIUM,
          required: false
        },
        tags: { type: 'array', items: { type: 'string' }, required: false },
      },

      // ステップの実行処理
      async execute({ title, description, dueDate, priority, tags }, { tools, memory }) {
        try {
          // ワーキングメモリからユーザーのタスクリストを取得
          const tasksMemory = await memory.working.get('tasks') || [];

          // 新しいタスクの作成
          const newTask = {
            id: `task-${Date.now()}`,
            title,
            description: description || '',
            status: TaskStatus.TODO,
            priority: priority || TaskPriority.MEDIUM,
            dueDate: dueDate || null,
            tags: tags || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          // タスクリストに追加
          tasksMemory.push(newTask);

          // ワーキングメモリを更新
          await memory.working.set('tasks', tasksMemory);

          // 必要に応じてタスクをメモとしても保存
          if (tools.notes) {
            await tools.notes.createNote({
              title: `タスク: ${title}`,
              content: `
                説明: ${description || 'なし'}
                期限: ${dueDate ? new Date(dueDate).toLocaleString('ja-JP') : 'なし'}
                優先度: ${priority || TaskPriority.MEDIUM}
                ステータス: ${TaskStatus.TODO}
                タスクID: ${newTask.id}
              `,
              tags: [...(tags || []), 'タスク'],
              category: 'tasks',
            });
          }

          return {
            success: true,
            task: newTask,
            message: `タスク「${title}」が作成されました。`,
          };
        } catch (error) {
          return {
            success: false,
            error: `タスクの作成に失敗しました: ${error.message}`,
          };
        }
      },
    }),

    // ステップ2: タスクの更新
    updateTask: createStep({
      name: 'updateTask',
      description: '既存のタスクを更新',

      // 入力パラメータ
      input: {
        taskId: { type: 'string', required: true },
        title: { type: 'string', required: false },
        description: { type: 'string', required: false },
        status: {
          type: 'string',
          enum: Object.values(TaskStatus),
          required: false
        },
        dueDate: { type: 'string', format: 'date-time', required: false },
        priority: {
          type: 'string',
          enum: Object.values(TaskPriority),
          required: false
        },
        tags: { type: 'array', items: { type: 'string' }, required: false },
      },

      // ステップの実行処理
      async execute({ taskId, ...updates }, { memory, tools }) {
        try {
          // ワーキングメモリからユーザーのタスクリストを取得
          const tasksMemory = await memory.working.get('tasks') || [];

          // 対象のタスクを検索
          const taskIndex = tasksMemory.findIndex(task => task.id === taskId);

          if (taskIndex === -1) {
            return {
              success: false,
              error: `タスクが見つかりませんでした: ${taskId}`,
            };
          }

          // タスクを更新
          const updatedTask = {
            ...tasksMemory[taskIndex],
            ...(updates.title !== undefined && { title: updates.title }),
            ...(updates.description !== undefined && { description: updates.description }),
            ...(updates.status !== undefined && { status: updates.status }),
            ...(updates.dueDate !== undefined && { dueDate: updates.dueDate }),
            ...(updates.priority !== undefined && { priority: updates.priority }),
            ...(updates.tags !== undefined && { tags: updates.tags }),
            updatedAt: new Date().toISOString(),
          };

          // タスクリストを更新
          tasksMemory[taskIndex] = updatedTask;

          // ワーキングメモリを更新
          await memory.working.set('tasks', tasksMemory);

          // もしステータスが完了に変更された場合、長期記憶に保存
          if (updates.status === TaskStatus.DONE &&
              tasksMemory[taskIndex].status !== TaskStatus.DONE) {
            await memory.vector.add({
              content: `タスク「${updatedTask.title}」を完了しました。(${new Date().toLocaleDateString('ja-JP')})`,
              metadata: {
                type: 'task_completion',
                taskId: updatedTask.id,
                taskTitle: updatedTask.title,
                completedAt: new Date().toISOString(),
              },
              tags: ['task_history'],
            });

            // 通知用のメッセージを準備
            const completionMessage = `タスク「${updatedTask.title}」が完了しました。`;

            return {
              success: true,
              task: updatedTask,
              message: completionMessage,
              next: 'notifyTaskCompletion',
              taskCompletionMessage: completionMessage,
            };
          }

          return {
            success: true,
            task: updatedTask,
            message: `タスク「${updatedTask.title}」が更新されました。`,
          };
        } catch (error) {
          return {
            success: false,
            error: `タスクの更新に失敗しました: ${error.message}`,
          };
        }
      },
    }),

    // ステップ3: タスク完了の通知処理
    notifyTaskCompletion: createStep({
      name: 'notifyTaskCompletion',
      description: 'タスク完了の通知',

      // 入力パラメータ
      input: {
        taskCompletionMessage: { type: 'string', required: true },
      },

      // ステップの実行処理
      async execute({ taskCompletionMessage }, { memory }) {
        try {
          // 通知処理（実際のアプリケーションでは通知サービスと連携）
          console.log(`[通知] ${taskCompletionMessage}`);

          // 完了タスクのカウンターを更新
          const completedTasksCount = (await memory.working.get('completedTasksCount') || 0) + 1;
          await memory.working.set('completedTasksCount', completedTasksCount);

          // 達成感を高めるメッセージ
          let congratsMessage = `${taskCompletionMessage} これで今日は${completedTasksCount}個のタスクを完了しました！`;

          if (completedTasksCount >= 5) {
            congratsMessage += ' すばらしい進捗です！';
          }

          return {
            success: true,
            message: congratsMessage,
          };
        } catch (error) {
          return {
            success: false,
            error: `通知の送信に失敗しました: ${error.message}`,
          };
        }
      },
    }),

    // ステップ4: タスクリストの取得
    getTaskList: createStep({
      name: 'getTaskList',
      description: 'タスクリストを取得',

      // 入力パラメータ
      input: {
        status: { type: 'string', enum: [...Object.values(TaskStatus), 'all'], default: 'all', required: false },
        priority: { type: 'string', enum: [...Object.values(TaskPriority), 'all'], default: 'all', required: false },
        sortBy: { type: 'string', enum: ['dueDate', 'priority', 'createdAt'], default: 'dueDate', required: false },
        sortOrder: { type: 'string', enum: ['asc', 'desc'], default: 'asc', required: false },
      },

      // ステップの実行処理
      async execute({ status, priority, sortBy, sortOrder }, { memory }) {
        try {
          // ワーキングメモリからユーザーのタスクリストを取得
          const tasksMemory = await memory.working.get('tasks') || [];

          // ステータスでフィルタリング
          let filteredTasks = [...tasksMemory];
          if (status !== 'all') {
            filteredTasks = filteredTasks.filter(task => task.status === status);
          }

          // 優先度でフィルタリング
          if (priority !== 'all') {
            filteredTasks = filteredTasks.filter(task => task.priority === priority);
          }

          // ソート処理
          filteredTasks.sort((a, b) => {
            // ソートキーに基づいて比較
            let comparison = 0;

            if (sortBy === 'dueDate') {
              // nullの値は最後に表示
              if (!a.dueDate && !b.dueDate) comparison = 0;
              else if (!a.dueDate) comparison = 1;
              else if (!b.dueDate) comparison = -1;
              else comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            }
            else if (sortBy === 'priority') {
              const priorityOrder = {
                [TaskPriority.URGENT]: 0,
                [TaskPriority.HIGH]: 1,
                [TaskPriority.MEDIUM]: 2,
                [TaskPriority.LOW]: 3,
              };
              comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            else if (sortBy === 'createdAt') {
              comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            }

            // ソート順を適用
            return sortOrder === 'asc' ? comparison : -comparison;
          });

          return {
            success: true,
            tasks: filteredTasks,
            count: filteredTasks.length,
          };
        } catch (error) {
          return {
            success: false,
            error: `タスクリストの取得に失敗しました: ${error.message}`,
          };
        }
      },
    }),
  },
});
```

## 2. リマインダーワークフロー

### 主な機能
- リマインダーの作成と設定
- 通知タイミングの計算
- 通知の送信処理
- リマインダーの繰り返し設定

### 実装例（src/mastra/workflows/reminderFlow.ts）

```typescript
import { createWorkflow } from '@mastra/core/workflow';
import { createStep } from '@mastra/core/workflow';

// 繰り返し頻度
enum RepeatFrequency {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export const reminderFlowWorkflow = (userId: string) => createWorkflow({
  name: 'reminderFlow',
  description: 'リマインダーの設定と通知を行うワークフロー',

  steps: {
    // ステップ1: リマインダーの作成
    createReminder: createStep({
      name: 'createReminder',
      description: '新しいリマインダーを作成',

      // 入力パラメータ
      input: {
        title: { type: 'string', required: true },
        message: { type: 'string', required: false },
        reminderTime: { type: 'string', format: 'date-time', required: true },
        repeatFrequency: {
          type: 'string',
          enum: Object.values(RepeatFrequency),
          default: RepeatFrequency.NONE,
          required: false
        },
        notificationMethods: {
          type: 'array',
          items: { type: 'string', enum: ['in-app', 'email', 'sms'] },
          default: ['in-app'],
          required: false
        },
      },

      // ステップの実行処理
      async execute({ title, message, reminderTime, repeatFrequency, notificationMethods }, { memory, tools }) {
        try {
          // ワーキングメモリからリマインダーリストを取得
          const reminders = await memory.working.get('reminders') || [];

          // 新しいリマインダーの作成
          const newReminder = {
            id: `reminder-${Date.now()}`,
            title,
            message: message || title,
            reminderTime,
            repeatFrequency: repeatFrequency || RepeatFrequency.NONE,
            notificationMethods: notificationMethods || ['in-app'],
            isActive: true,
            createdAt: new Date().toISOString(),
          };

          // リマインダーリストに追加
          reminders.push(newReminder);

          // ワーキングメモリを更新
          await memory.working.set('reminders', reminders);

          // カレンダーに登録（オプション）
          if (tools.calendar) {
            await tools.calendar.createEvent({
              title: `リマインダー: ${title}`,
              startTime: reminderTime,
              endTime: new Date(new Date(reminderTime).getTime() + 30 * 60000).toISOString(), // 30分後
              description: message || title,
            });
          }

          // 設定完了メッセージを生成
          const reminderDate = new Date(reminderTime);
          const now = new Date();
          const timeDiff = reminderDate.getTime() - now.getTime();

          let timeMessage = '';
          if (timeDiff < 0) {
            timeMessage = '（過去の時間が指定されています）';
          } else if (timeDiff < 60 * 60 * 1000) {
            timeMessage = `${Math.floor(timeDiff / (60 * 1000))}分後`;
          } else if (timeDiff < 24 * 60 * 60 * 1000) {
            timeMessage = `${Math.floor(timeDiff / (60 * 60 * 1000))}時間後`;
          } else {
            timeMessage = `${Math.floor(timeDiff / (24 * 60 * 60 * 1000))}日後`;
          }

          return {
            success: true,
            reminder: newReminder,
            message: `「${title}」のリマインダーを${timeMessage}に設定しました。`,
            next: 'scheduleReminder',
          };
        } catch (error) {
          return {
            success: false,
            error: `リマインダーの作成に失敗しました: ${error.message}`,
          };
        }
      },
    }),

    // ステップ2: リマインダーのスケジューリング
    scheduleReminder: createStep({
      name: 'scheduleReminder',
      description: 'リマインダーをスケジュール',

      // 入力パラメータ
      input: {
        reminder: { type: 'object', required: true },
      },

      // ステップの実行処理
      async execute({ reminder }, { memory }) {
        try {
          // 実際のアプリケーションでは、ここでスケジューラーと連携
          // プログとには単にリマインダー情報をログに出力
          console.log(`リマインダーをスケジュール: ${reminder.title} @ ${reminder.reminderTime}`);

          // 確認メッセージ
          return {
            success: true,
            message: `リマインダー「${reminder.title}」がスケジュールされました。`,
          };
        } catch (error) {
          return {
            success: false,
            error: `リマインダーのスケジュールに失敗しました: ${error.message}`,
          };
        }
      },
    }),

    // ステップ3: リマインダーの送信
    sendReminder: createStep({
      name: 'sendReminder',
      description: 'リマインダー通知を送信',

      // 入力パラメータ
      input: {
        reminderId: { type: 'string', required: true },
      },

      // ステップの実行処理
      async execute({ reminderId }, { memory }) {
        try {
          // ワーキングメモリからリマインダーリストを取得
          const reminders = await memory.working.get('reminders') || [];

          // 対象のリマインダーを検索
          const reminderIndex = reminders.findIndex(r => r.id === reminderId);

          if (reminderIndex === -1) {
            return {
              success: false,
              error: `リマインダーが見つかりませんでした: ${reminderId}`,
            };
          }

          const reminder = reminders[reminderIndex];

          // 実際のアプリケーションでは、ここで通知サービスと連携
          for (const method of reminder.notificationMethods) {
            console.log(`[${method}通知] リマインダー: ${reminder.title} - ${reminder.message}`);
          }

          // 繰り返し設定の処理
          if (reminder.repeatFrequency !== RepeatFrequency.NONE) {
            // 次回の通知時間を計算
            const nextReminderTime = calculateNextReminderTime(
              new Date(reminder.reminderTime),
              reminder.repeatFrequency
            );

            // リマインダーを更新
            reminders[reminderIndex] = {
              ...reminder,
              reminderTime: nextReminderTime.toISOString(),
            };

            // ワーキングメモリを更新
            await memory.working.set('reminders', reminders);

            return {
              success: true,
              message: `リマインダー「${reminder.title}」を送信しました。次回は${formatDateForDisplay(nextReminderTime)}に通知予定です。`,
              next: 'scheduleReminder',
              reminder: reminders[reminderIndex],
            };
          } else {
            // 一度だけのリマインダーの場合は非アクティブに設定
            reminders[reminderIndex] = {
              ...reminder,
              isActive: false,
            };

            // ワーキングメモリを更新
            await memory.working.set('reminders', reminders);

            return {
              success: true,
              message: `リマインダー「${reminder.title}」を送信しました。`,
            };
          }
        } catch (error) {
          return {
            success: false,
            error: `リマインダーの送信に失敗しました: ${error.message}`,
          };
        }
      },
    }),

    // ステップ4: リマインダーリストの取得
    getReminderList: createStep({
      name: 'getReminderList',
      description: 'リマインダーリストを取得',

      // 入力パラメータ
      input: {
        activeOnly: { type: 'boolean', default: true, required: false },
        sortBy: { type: 'string', enum: ['reminderTime', 'createdAt'], default: 'reminderTime', required: false },
      },

      // ステップの実行処理
      async execute({ activeOnly, sortBy }, { memory }) {
        try {
          // ワーキングメモリからリマインダーリストを取得
          const reminders = await memory.working.get('reminders') || [];

          // アクティブなリマインダーのみをフィルタリング（オプション）
          let filteredReminders = reminders;
          if (activeOnly) {
            filteredReminders = reminders.filter(r => r.isActive);
          }

          // ソート処理
          filteredReminders.sort((a, b) => {
            if (sortBy === 'reminderTime') {
              return new Date(a.reminderTime).getTime() - new Date(b.reminderTime).getTime();
            } else if (sortBy === 'createdAt') {
              return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            }
            return 0;
          });

          return {
            success: true,
            reminders: filteredReminders,
            count: filteredReminders.length,
          };
        } catch (error) {
          return {
            success: false,
            error: `リマインダーリストの取得に失敗しました: ${error.message}`,
          };
        }
      },
    }),
  },
});

// 次回のリマインダー時間を計算するヘルパー関数
function calculateNextReminderTime(currentTime, frequency) {
  const nextTime = new Date(currentTime);

  switch (frequency) {
    case RepeatFrequency.DAILY:
      nextTime.setDate(nextTime.getDate() + 1);
      break;
    case RepeatFrequency.WEEKLY:
      nextTime.setDate(nextTime.getDate() + 7);
      break;
    case RepeatFrequency.MONTHLY:
      nextTime.setMonth(nextTime.getMonth() + 1);
      break;
    default:
      // 繰り返しなしの場合は変更なし
      break;
  }

  return nextTime;
}

// 日付を表示用にフォーマットするヘルパー関数
function formatDateForDisplay(date) {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
}