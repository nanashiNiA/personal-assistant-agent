/**
 * @file APIクライアント
 * @module frontend/lib/api
 * @created 2025-05-11
 */

// APIの基本URL（実際の環境に合わせて調整）
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * APIリクエストオプション
 */
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  credentials?: RequestCredentials;
}

/**
 * APIレスポンス
 */
interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

/**
 * 基本的なAPIリクエスト関数
 */
async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const { method = 'GET', headers = {}, body } = options;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include' // クッキーを含める
    });

    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      return {
        error: isJson && data.message ? data.message : 'APIリクエストエラー',
        status: response.status
      };
    }

    return {
      data: data as T,
      status: response.status
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : '不明なエラー',
      status: 500
    };
  }
}

/**
 * 記憶関連のAPI
 */
export const memoryApi = {
  getMemories: (categoryId?: string, tagId?: string) =>
    request(`/memories${categoryId ? `?category=${categoryId}` : ''}${tagId ? `&tag=${tagId}` : ''}`),

  getCategories: () => request('/memories/categories'),

  getTags: () => request('/memories/tags'),

  getUserProfile: () => request('/user/profile')
};

/**
 * 会話関連のAPI
 */
export const conversationApi = {
  getSessions: () => request('/conversations/sessions'),

  getSessionMessages: (sessionId: string) =>
    request(`/conversations/sessions/${sessionId}/messages`),

  searchMessages: (filter: any) =>
    request('/conversations/search', { method: 'POST', body: filter })
};

/**
 * タスク関連のAPI
 */
export const taskApi = {
  getTasks: () => request('/tasks'),

  getTaskDetails: (taskId: string) =>
    request(`/tasks/${taskId}`),

  updateTaskProgress: (taskId: string, progress: number) =>
    request(`/tasks/${taskId}/progress`, {
      method: 'PUT',
      body: { progress }
    }),

  updateStepStatus: (taskId: string, stepId: string, status: string) =>
    request(`/tasks/${taskId}/steps/${stepId}/status`, {
      method: 'PUT',
      body: { status }
    })
};

// デフォルトエクスポート
export default {
  memory: memoryApi,
  conversation: conversationApi,
  task: taskApi
};