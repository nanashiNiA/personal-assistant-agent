/**
 * @file 会話履歴の状態管理
 * @module frontend/store/conversationStore
 * @created 2025-05-11
 */

import { create } from 'zustand';
import {
  ConversationMessage,
  ConversationContext,
  ConversationSession,
  ConversationFilter
} from '../types/conversation';

// 状態の更新と取得のための型定義
type SetState = (
  partial: Partial<ConversationState> | ((state: ConversationState) => Partial<ConversationState>),
  replace?: boolean
) => void;

type GetState = () => ConversationState;

interface ConversationState {
  // データ
  sessions: ConversationSession[];
  currentSessionId: string | null;

  // UI状態
  selectedMessageId: string | null;
  selectedContextId: string | null;
  filter: ConversationFilter | null;
  isLoading: boolean;
  error: string | null;

  // アクション
  fetchSessions: () => Promise<void>;
  fetchSessionMessages: (sessionId: string) => Promise<void>;
  searchMessages: (filter: ConversationFilter) => Promise<void>;
  setCurrentSession: (sessionId: string | null) => void;
  selectMessage: (messageId: string | null) => void;
  selectContext: (contextId: string | null) => void;
  setFilter: (filter: ConversationFilter | null) => void;
  resetError: () => void;
}

export const useConversationStore = create<ConversationState>((set: SetState, get: GetState) => ({
  // 初期データ
  sessions: [],
  currentSessionId: null,

  // 初期UI状態
  selectedMessageId: null,
  selectedContextId: null,
  filter: null,
  isLoading: false,
  error: null,

  // アクション
  fetchSessions: async () => {
    set({ isLoading: true, error: null });
    try {
      // TODO: 実際のAPIからデータを取得する実装
      // ダミーデータ
      const dummyContexts: ConversationContext[] = [
        {
          id: 'ctx-001',
          name: '買い物の相談',
          startTime: new Date('2025-05-10T10:00:00'),
          endTime: new Date('2025-05-10T10:15:00'),
          topic: 'ショッピング',
          color: '#3B82F6'
        },
        {
          id: 'ctx-002',
          name: '旅行計画',
          startTime: new Date('2025-05-10T10:20:00'),
          endTime: new Date('2025-05-10T10:40:00'),
          topic: '旅行',
          color: '#EC4899'
        }
      ];

      const dummyMessages: ConversationMessage[] = [
        {
          id: 'msg-001',
          content: '新しいスマートフォンを買いたいんだけど、おすすめある？',
          sender: 'user',
          timestamp: new Date('2025-05-10T10:00:00'),
          contextId: 'ctx-001'
        },
        {
          id: 'msg-002',
          content: 'ご予算やお求めの機能によって異なりますが、最近の人気モデルをいくつかご紹介できます。予算と重視する機能を教えていただけますか？',
          sender: 'assistant',
          timestamp: new Date('2025-05-10T10:01:00'),
          contextId: 'ctx-001'
        },
        {
          id: 'msg-003',
          content: '来月ハワイ旅行を計画しているんだけど、おすすめのスポットを教えて',
          sender: 'user',
          timestamp: new Date('2025-05-10T10:20:00'),
          contextId: 'ctx-002'
        },
        {
          id: 'msg-004',
          content: 'ハワイ旅行のおすすめスポットをご紹介します。ワイキキビーチ、ダイヤモンドヘッド、ノースショアなどが人気です。滞在日数と興味のある活動（ビーチ、ハイキング、文化体験など）を教えていただけますか？',
          sender: 'assistant',
          timestamp: new Date('2025-05-10T10:21:00'),
          contextId: 'ctx-002'
        }
      ];

      const dummySessions: ConversationSession[] = [
        {
          id: 'session-001',
          title: '2025-05-10 会話',
          startTime: new Date('2025-05-10T10:00:00'),
          endTime: new Date('2025-05-10T10:40:00'),
          messages: dummyMessages,
          contexts: dummyContexts
        }
      ];

      set({
        sessions: dummySessions,
        currentSessionId: dummySessions.length > 0 ? dummySessions[0].id : null,
        isLoading: false
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '会話セッションの取得に失敗しました', isLoading: false });
    }
  },

  fetchSessionMessages: async (sessionId: string) => {
    set({ isLoading: true, error: null });
    try {
      // 実際の実装では、APIからセッション固有のメッセージを取得
      // ここではすでにセッションにメッセージが含まれていると仮定
      set({ isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'メッセージの取得に失敗しました', isLoading: false });
    }
  },

  searchMessages: async (filter: ConversationFilter) => {
    set({ isLoading: true, error: null, filter });
    try {
      // 実際の実装では、APIでメッセージを検索
      // ここではローカルでフィルタリング
      const { sessions } = get();

      // フィルタリング処理は実際の実装では検索APIに渡す
      set({ isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'メッセージの検索に失敗しました', isLoading: false });
    }
  },

  setCurrentSession: (sessionId: string | null) => set({ currentSessionId: sessionId }),

  selectMessage: (messageId: string | null) => set({ selectedMessageId: messageId }),

  selectContext: (contextId: string | null) => set({ selectedContextId: contextId }),

  setFilter: (filter: ConversationFilter | null) => set({ filter }),

  resetError: () => set({ error: null })
}));