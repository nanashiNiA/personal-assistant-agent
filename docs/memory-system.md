# 記憶システムの設計

個人アシスタントエージェントの中核となる記憶システムの設計について説明します。

## 記憶システムの概要

このエージェントは3種類の記憶システムを実装し、それぞれが異なる役割を担います：

1. **短期記憶（Recent Memory）**
2. **長期記憶（Vector Memory）**
3. **ワーキングメモリ（Working Memory）**

## 1. 短期記憶（Recent Memory）

### 機能と役割
- 直近のメッセージ履歴を保持
- 会話の文脈を理解するために使用
- デフォルトでは過去10〜20のメッセージを保持

### 設計ポイント
- メッセージはシンプルな配列として保存
- 古いメッセージは自動的に削除（FIFO方式）
- ユーザーごとにセッションを分離

### 実装例（src/mastra/memory/recentMemory.ts）
```typescript
import { createMemory } from '@mastra/core/memory';

export const recentMemory = createMemory({
  type: 'recent',
  config: {
    // 直近20メッセージを保持
    maxMessages: 20,
    // メッセージの重要度に基づいてフィルタリングするオプション
    messageFilter: (message) => {
      // 重要度の低いメッセージをフィルタリングするロジック
      return true; // すべてのメッセージを保持
    },
  },
});
```

## 2. 長期記憶（Vector Memory）

### 機能と役割
- 重要な情報を長期間保存
- ベクトルデータベースを使用して効率的に検索
- ユーザーの好み、習慣、過去の重要な会話などを保存

### 設計ポイント
- 各メモリはベクトル化されてデータベースに保存
- 類似度検索を使用して関連情報を取得
- 定期的に情報の重要度を再評価

### 実装例（src/mastra/memory/vectorMemory.ts）
```typescript
import { createMemory } from '@mastra/core/memory';

export const vectorMemory = createMemory({
  type: 'vector',
  config: {
    // ベクトルストアの設定
    vectorStore: 'pinecone', // または 'chromadb', 'qdrant' など
    // エンベディングプロバイダの設定
    embeddingProvider: 'openai', // または 'cohere', 'huggingface' など
    // メモリのタグ付け（カテゴリ分類）
    tags: ['preference', 'task', 'personal_info', 'general_knowledge'],
    // メモリの有効期限設定（オプション）
    ttl: {
      'preference': null, // 無期限
      'task': 30 * 24 * 60 * 60, // 30日（秒単位）
      'personal_info': null, // 無期限
      'general_knowledge': 90 * 24 * 60 * 60, // 90日
    },
    // 関連性スコアのしきい値
    relevanceThreshold: 0.75,
  },
});
```

## 3. ワーキングメモリ（Working Memory）

### 機能と役割
- 現在のタスクや対話に関連する一時的な情報を保持
- タスク実行中の中間状態や変数を保存
- 複数ステップにわたるタスクの進行状況を追跡

### 設計ポイント
- キーと値のペアとして情報を保存
- タスク完了後に自動クリア（オプション）
- 他のメモリシステムと連携

### 実装例（src/mastra/memory/workingMemory.ts）
```typescript
import { createMemory } from '@mastra/core/memory';

export const workingMemory = createMemory({
  type: 'working',
  config: {
    // 初期状態
    initialState: {},
    // 自動クリアの設定
    autoClear: {
      onTaskComplete: true,
      onSessionEnd: true,
    },
    // 保存可能なデータ型の制限（オプション）
    allowedTypes: ['string', 'number', 'boolean', 'object', 'array'],
    // ワーキングメモリの最大サイズ（バイト単位、オプション）
    maxSize: 1024 * 1024, // 1MB
  },
});
```

## 記憶システムの統合

3つの記憶システムを統合し、エージェントに提供する実装例：

```typescript
import { createAgent } from '@mastra/core/agent';
import { recentMemory } from './memory/recentMemory';
import { vectorMemory } from './memory/vectorMemory';
import { workingMemory } from './memory/workingMemory';

// 記憶システムの統合
const integratedMemory = {
  recent: recentMemory,
  vector: vectorMemory,
  working: workingMemory,
};

// エージェント定義
export const assistantAgent = createAgent({
  name: 'personalAssistant',
  description: '記憶機能を持つ個人アシスタント',
  memory: integratedMemory,
  // その他のエージェント設定
});
```

## データ永続化と同期

記憶データの永続化と同期についての考慮事項：

1. **データベース選択**
   - 開発環境: SQLite（シンプルで設定が容易）
   - 本番環境: PostgreSQL（スケーラビリティとパフォーマンス）

2. **同期メカニズム**
   - ベクトルストアとリレーショナルDBの一貫性を確保
   - 定期的なバックアップと復元機能の実装

3. **プライバシーとセキュリティ**
   - ユーザーデータの暗号化
   - アクセス制御の実装
   - データ削除リクエストの対応

## パフォーマンス最適化

- インデックス作成による検索の高速化
- キャッシュ層の追加による頻繁にアクセスされるデータの高速取得
- バッチ処理によるデータベース操作の効率化

## 次のステップ

- 各記憶システムのより詳細な実装
- テストケースの作成
- プロトタイプの構築と評価