/**
 * @file 会話履歴の型定義
 * @module frontend/types/conversation
 * @created 2025-05-11
 */

/**
 * 会話メッセージの型定義
 */
export interface ConversationMessage {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  contextId: string;
}

/**
 * 会話コンテキストの型定義
 */
export interface ConversationContext {
  id: string;
  name: string;
  startTime: Date;
  endTime: Date;
  topic: string;
  color: string;
}

/**
 * 会話セッションの型定義
 */
export interface ConversationSession {
  id: string;
  title: string;
  startTime: Date;
  endTime: Date;
  messages: ConversationMessage[];
  contexts: ConversationContext[];
}

/**
 * 会話検索フィルターの型定義
 */
export interface ConversationFilter {
  dateFrom?: Date;
  dateTo?: Date;
  searchTerm?: string;
  topics?: string[];
  senders?: ('user' | 'assistant')[];
}