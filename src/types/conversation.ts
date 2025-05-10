/**
 * @file 会話履歴関連の型定義
 * @module types/conversation
 * @created 2025-05-11
 */

/**
 * メッセージ送信者タイプ
 */
export type SenderType = 'user' | 'assistant' | 'system';

/**
 * 会話メッセージの基本インターフェース
 */
export interface ConversationMessage {
  id: string;
  content: string;
  sender: SenderType;
  timestamp: Date;
  contextId?: string; // 関連するコンテキストのID
  metadata?: {
    [key: string]: any;
  };
}

/**
 * 会話コンテキスト
 */
export interface ConversationContext {
  id: string;
  name: string;
  startTime: Date;
  endTime?: Date;
  topic?: string;
  relatedMemories?: string[]; // 関連する記憶のID
  color?: string; // コンテキストの色（視覚的表現用）
}

/**
 * 会話セッション
 */
export interface ConversationSession {
  id: string;
  title: string;
  startTime: Date;
  endTime?: Date;
  messages: ConversationMessage[];
  contexts: ConversationContext[];
}

/**
 * 会話検索フィルター
 */
export interface ConversationFilter {
  dateRange?: {
    start?: Date;
    end?: Date;
  };
  senders?: SenderType[];
  contextIds?: string[];
  keywords?: string[];
}

/**
 * 会話履歴表示コンポーネントのプロパティ
 */
export interface ConversationHistoryProps {
  sessions: ConversationSession[];
  currentSessionId?: string;
  filter?: ConversationFilter;
  onMessageSelect?: (message: ConversationMessage) => void;
  onContextSelect?: (context: ConversationContext) => void;
  className?: string;
}

/**
 * 会話メッセージコンポーネントのプロパティ
 */
export interface ConversationMessageProps {
  message: ConversationMessage;
  isSelected?: boolean;
  showContext?: boolean;
  onSelect?: (message: ConversationMessage) => void;
  className?: string;
}

/**
 * 会話検索コンポーネントのプロパティ
 */
export interface ConversationSearchProps {
  onSearch: (filter: ConversationFilter) => void;
  initialFilter?: ConversationFilter;
  className?: string;
}

/**
 * コンテキスト視覚化コンポーネントのプロパティ
 */
export interface ContextVisualizerProps {
  contexts: ConversationContext[];
  messages: ConversationMessage[];
  selectedContextId?: string;
  onContextSelect?: (contextId: string) => void;
  className?: string;
}