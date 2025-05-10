/**
 * @file 記憶情報の状態管理
 * @module frontend/store/memoryStore
 * @created 2025-05-11
 */

import { create } from 'zustand';
import {
  LongTermMemoryItem,
  MemoryCategory,
  MemoryTag,
  UserProfile
} from '../types/memory';

// 状態の更新と取得のための型定義
type SetState = (
  partial: Partial<MemoryState> | ((state: MemoryState) => Partial<MemoryState>),
  replace?: boolean
) => void;

type GetState = () => MemoryState;

interface MemoryState {
  // データ
  memories: LongTermMemoryItem[];
  categories: MemoryCategory[];
  tags: MemoryTag[];
  userProfile: UserProfile | null;

  // UI状態
  selectedMemoryId: string | null;
  selectedCategoryId: string | null;
  selectedTagId: string | null;
  isLoading: boolean;
  error: string | null;

  // アクション
  fetchMemories: (categoryId?: string, tagId?: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchTags: () => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  selectMemory: (memoryId: string | null) => void;
  selectCategory: (categoryId: string | null) => void;
  selectTag: (tagId: string | null) => void;
  resetError: () => void;
}

export const useMemoryStore = create<MemoryState>((set: SetState, get: GetState) => ({
  // 初期データ
  memories: [],
  categories: [],
  tags: [],
  userProfile: null,

  // 初期UI状態
  selectedMemoryId: null,
  selectedCategoryId: null,
  selectedTagId: null,
  isLoading: false,
  error: null,

  // アクション
  fetchMemories: async (categoryId?: string, tagId?: string) => {
    set({ isLoading: true, error: null });
    try {
      // TODO: 実際のAPIからデータを取得する実装
      // ダミーデータ
      const dummyMemories: LongTermMemoryItem[] = [
        {
          id: 'mem-001',
          content: 'ユーザーは猫が好きで、特に黒猫を飼いたいと思っている',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-10'),
          importance: 80,
          category: 'preferences',
          tags: ['pets', 'cats', 'interests']
        },
        {
          id: 'mem-002',
          content: 'ユーザーの好きな食べ物は和食で、特に寿司が好き',
          createdAt: new Date('2024-02-15'),
          updatedAt: new Date('2024-02-15'),
          importance: 70,
          category: 'preferences',
          tags: ['food', 'japanese', 'interests']
        }
      ];

      // フィルタリング
      let filteredMemories = [...dummyMemories];
      if (categoryId) {
        filteredMemories = filteredMemories.filter(m => m.category === categoryId);
      }
      if (tagId) {
        filteredMemories = filteredMemories.filter(m => m.tags.includes(tagId));
      }

      set({ memories: filteredMemories, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : '記憶データの取得に失敗しました', isLoading: false });
    }
  },

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      // TODO: 実際のAPIからデータを取得する実装
      // ダミーデータ
      const dummyCategories: MemoryCategory[] = [
        {
          id: 'preferences',
          name: '好み・嗜好',
          description: 'ユーザーの好みや嗜好に関する記憶',
          color: '#6366F1'
        },
        {
          id: 'events',
          name: 'イベント',
          description: '重要なイベントに関する記憶',
          color: '#F59E0B'
        },
        {
          id: 'knowledge',
          name: '知識',
          description: 'ユーザーに関連する知識情報',
          color: '#10B981'
        }
      ];

      set({ categories: dummyCategories, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'カテゴリデータの取得に失敗しました', isLoading: false });
    }
  },

  fetchTags: async () => {
    set({ isLoading: true, error: null });
    try {
      // TODO: 実際のAPIからデータを取得する実装
      // ダミーデータ
      const dummyTags: MemoryTag[] = [
        {
          id: 'pets',
          name: 'ペット',
          count: 3,
          importance: 85
        },
        {
          id: 'cats',
          name: '猫',
          count: 2,
          importance: 90
        },
        {
          id: 'food',
          name: '食べ物',
          count: 5,
          importance: 80
        },
        {
          id: 'japanese',
          name: '和食',
          count: 3,
          importance: 75
        },
        {
          id: 'interests',
          name: '興味関心',
          count: 8,
          importance: 95
        }
      ];

      set({ tags: dummyTags, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'タグデータの取得に失敗しました', isLoading: false });
    }
  },

  fetchUserProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      // TODO: 実際のAPIからデータを取得する実装
      // ダミーデータ
      const dummyProfile: UserProfile = {
        id: 'user-001',
        name: '山田太郎',
        preferences: {
          theme: 'dark',
          language: 'ja',
          notification: true
        },
        importantDates: [
          {
            date: new Date('1990-05-15'),
            description: '誕生日',
            type: 'birthday'
          }
        ],
        interests: ['ペット', '和食', '読書', '映画鑑賞'],
        avatar: 'https://example.com/avatar.jpg'
      };

      set({ userProfile: dummyProfile, isLoading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'ユーザープロファイルの取得に失敗しました', isLoading: false });
    }
  },

  selectMemory: (memoryId: string | null) => set({ selectedMemoryId: memoryId }),
  selectCategory: (categoryId: string | null) => set({ selectedCategoryId: categoryId }),
  selectTag: (tagId: string | null) => set({ selectedTagId: tagId }),
  resetError: () => set({ error: null })
}));