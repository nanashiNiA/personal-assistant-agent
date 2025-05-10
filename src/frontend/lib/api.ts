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
  body?: Record<string, unknown>;
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
 * APIエラーレスポンス
 */
interface ApiErrorResponse {
  message?: string;
  [key: string]: unknown;
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
      const errorData = isJson ? data as ApiErrorResponse : { message: data as string };
      return {
        error: errorData.message || 'APIリクエストエラー',
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
  getMemories: <T>(categoryId?: string, tagId?: string) =>
    request<T>(`/memories${categoryId ? `?category=${categoryId}` : ''}${tagId ? `&tag=${tagId}` : ''}`),

  getCategories: <T>() => request<T>('/memories/categories'),

  getTags: <T>() => request<T>('/memories/tags'),

  getUserProfile: <T>() => request<T>('/user/profile')
};

/**
 * 会話検索フィルタ
 */
interface ConversationSearchFilter {
  dateRange?: {
    start?: string;
    end?: string;
  };
  senders?: string[];
  contextIds?: string[];
  keywords?: string[];
  [key: string]: unknown;
}

/**
 * 会話関連のAPI
 */
export const conversationApi = {
  getSessions: <T>() => request<T>('/conversations/sessions'),

  getSessionMessages: <T>(sessionId: string) =>
    request<T>(`/conversations/sessions/${sessionId}/messages`),

  searchMessages: <T>(filter: ConversationSearchFilter) =>
    request<T>('/conversations/search', { method: 'POST', body: filter as Record<string, unknown> })
};

/**
 * タスク関連のAPI
 */
export const taskApi = {
  getTasks: <T>() => request<T>('/tasks'),

  getTaskDetails: <T>(taskId: string) =>
    request<T>(`/tasks/${taskId}`),

  updateTaskProgress: <T>(taskId: string, progress: number) =>
    request<T>(`/tasks/${taskId}/progress`, {
      method: 'PUT',
      body: { progress } as Record<string, unknown>
    }),

  updateStepStatus: <T>(taskId: string, stepId: string, status: string) =>
    request<T>(`/tasks/${taskId}/steps/${stepId}/status`, {
      method: 'PUT',
      body: { status } as Record<string, unknown>
    })
};

// デフォルトエクスポート
export default {
  memory: memoryApi,
  conversation: conversationApi,
  task: taskApi
};