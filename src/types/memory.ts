/**
 * @file 記憶システム関連の型定義
 * @module types/memory
 * @created 2025-05-11
 */

/**
 * メモリ項目の基本インターフェース
 */
export interface MemoryItem {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  importance: number; // 重要度（0-100）
}

/**
 * 長期記憶項目
 */
export interface LongTermMemoryItem extends MemoryItem {
  category: string;
  tags: string[];
  source?: string;
  relatedItems?: string[]; // 関連項目のID
}

/**
 * 記憶カテゴリ
 */
export interface MemoryCategory {
  id: string;
  name: string;
  description: string;
  color: string; // カラーコード（例: #FF5733）
  icon?: string; // アイコン名
}

/**
 * ユーザープロファイル情報
 */
export interface UserProfile {
  id: string;
  name: string;
  preferences: {
    [key: string]: any;
  };
  importantDates: {
    date: Date;
    description: string;
    type: 'birthday' | 'anniversary' | 'custom';
  }[];
  interests: string[];
  avatar?: string;
}

/**
 * タグ情報
 */
export interface MemoryTag {
  id: string;
  name: string;
  count: number; // 使用回数（タグクラウド用）
  importance: number; // 重要度（0-100）
}

/**
 * 記憶表示コンポーネントのプロパティ
 */
export interface MemoryDisplayProps {
  memories: LongTermMemoryItem[];
  categories: MemoryCategory[];
  onMemorySelect?: (memory: LongTermMemoryItem) => void;
  className?: string;
}

/**
 * 記憶カテゴリ表示コンポーネントのプロパティ
 */
export interface MemoryCategoryViewProps {
  categories: MemoryCategory[];
  selectedCategory?: string;
  onCategorySelect?: (categoryId: string) => void;
  className?: string;
}

/**
 * 記憶タグクラウドコンポーネントのプロパティ
 */
export interface MemoryTagCloudProps {
  tags: MemoryTag[];
  onTagSelect?: (tagId: string) => void;
  maxTags?: number;
  className?: string;
}

/**
 * ユーザープロファイル表示コンポーネントのプロパティ
 */
export interface UserProfileDisplayProps {
  profile: UserProfile;
  showDetails?: boolean;
  className?: string;
}