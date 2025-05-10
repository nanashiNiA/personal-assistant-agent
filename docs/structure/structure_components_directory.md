personal-assistant-agent/
│
├── .env.development              # 開発環境の環境変数
├── .env.example                  # 環境変数のサンプル
├── .gitignore                    # Gitの除外ファイル設定
├── package.json                  # プロジェクト依存関係と設定
├── tsconfig.json                 # TypeScript設定
├── README.md                     # プロジェクト概要
├── next.config.js                # Next.js設定
├── tailwind.config.js            # Tailwind CSS設定
├── postcss.config.js             # PostCSS設定
│
├── src/                          # ソースコード
│   ├── app/                      # Next.js Appディレクトリ（ルーティング）
│   │   ├── page.tsx              # ホームページ
│   │   ├── layout.tsx            # ルートレイアウト
│   │   │
│   │   ├── memory/               # 記憶システムページ
│   │   │   └── page.tsx          # 記憶システムの表示ページ
│   │   │
│   │   ├── conversation/         # 会話ページ
│   │   │   └── page.tsx          # 会話表示ページ
│   │   │
│   │   └── tasks/                # タスクページ
│   │       └── page.tsx          # タスク管理ページ
│   │
│   ├── components/               # UIコンポーネント
│   │   ├── navigation.tsx        # ナビゲーションコンポーネント
│   │   │
│   │   ├── memory/               # 記憶システム関連コンポーネント
│   │   │   ├── MemoryDisplay.tsx         # 記憶表示コンポーネント
│   │   │   ├── MemoryCategoryView.tsx    # 記憶カテゴリ表示
│   │   │   ├── MemoryTagCloud.tsx        # 記憶タグクラウド
│   │   │   └── UserProfileDisplay.tsx    # ユーザープロファイル表示
│   │   │
│   │   ├── conversation/         # 会話履歴関連コンポーネント
│   │   │   ├── ConversationHistory.tsx   # 会話履歴表示
│   │   │   ├── ConversationMessage.tsx   # 会話メッセージ
│   │   │   ├── ConversationSearch.tsx    # 会話検索
│   │   │   └── ContextVisualizer.tsx     # コンテキスト認識視覚化
│   │   │
│   │   └── tasks/                # タスク状態関連コンポーネント
│   │       ├── TaskItem.tsx              # タスク項目
│   │       ├── TaskProgress.tsx          # タスク進捗状況
│   │       └── StepNavigator.tsx         # ステップナビゲーター
│   │
│   ├── styles/                   # スタイル
│   │   └── globals.css           # グローバルスタイル（Tailwind設定）
│   │
│   ├── lib/                      # ユーティリティ関数
│   │   ├── api.ts                # APIクライアント
│   │   └── utils.ts              # 汎用ユーティリティ
│   │
│   ├── hooks/                    # カスタムフック
│   │   ├── useMemory.ts          # 記憶関連フック
│   │   └── useConversation.ts    # 会話関連フック
│   │
│   ├── store/                    # 状態管理（Zustand）
│   │   ├── memoryStore.ts        # 記憶情報の状態管理
│   │   ├── conversationStore.ts  # 会話履歴の状態管理
│   │   └── taskStore.ts          # タスク状態の管理
│   │
│   ├── types/                    # 型定義
│   │   ├── memory.ts             # 記憶関連の型定義
│   │   ├── conversation.ts       # 会話関連の型定義
│   │   └── task.ts               # タスク関連の型定義
│   │
│   ├── mastra/                   # Mastraバックエンド
│   │   ├── agents/               # エージェント定義
│   │   │   ├── index.ts          # エージェントのエクスポート
│   │   │   ├── assistantAgent.ts # アシスタントエージェント定義
│   │   │   └── config.ts         # エージェント設定
│   │   │
│   │   ├── memory/               # 記憶システム
│   │   │   ├── index.ts          # メモリコンポーネントのエクスポート
│   │   │   ├── recentMemory.ts   # 短期記憶の実装
│   │   │   ├── vectorMemory.ts   # 長期記憶（ベクトル）の実装
│   │   │   └── workingMemory.ts  # ワーキングメモリの実装
│   │   │
│   │   ├── tools/                # ツール定義
│   │   │   ├── index.ts          # ツールのエクスポート
│   │   │   ├── calendarTool.ts   # カレンダー連携ツール
│   │   │   ├── weatherTool.ts    # 天気情報取得ツール
│   │   │   ├── webSearchTool.ts  # Web検索ツール
│   │   │   └── notesTool.ts      # メモ管理ツール
│   │   │
│   │   ├── workflows/            # ワークフロー定義
│   │   │   ├── index.ts          # ワークフローのエクスポート
│   │   │   ├── taskManagement.ts # タスク管理ワークフロー
│   │   │   └── reminderFlow.ts   # リマインダー設定ワークフロー
│   │   │
│   │   ├── prompts/              # プロンプトテンプレート
│   │   │   ├── index.ts          # プロンプトのエクスポート
│   │   │   ├── systemPrompt.ts   # システムプロンプト
│   │   │   └── taskPrompts.ts    # タスク固有のプロンプト
│   │   │
│   │   ├── utils/                # ユーティリティ関数
│   │   │   ├── index.ts          # ユーティリティのエクスポート
│   │   │   ├── dateUtils.ts      # 日付処理ユーティリティ
│   │   │   └── stringUtils.ts    # 文字列処理ユーティリティ
│   │   │
│   │   ├── db/                   # データベース関連
│   │   │   ├── index.ts          # データベース接続
│   │   │   ├── models/           # データモデル
│   │   │   │   ├── user.ts       # ユーザーモデル
│   │   │   │   ├── task.ts       # タスクモデル
│   │   │   │   └── memory.ts     # 記憶モデル
│   │   │   └── migrations/       # データベースマイグレーション
│   │   │
│   │   └── index.ts              # Mastraメインエントリーポイント
│   │
│   └── index.ts                  # バックエンド アプリケーションのエントリーポイント
│
├── tests/                        # テスト
│   ├── agents/                   # エージェントテスト
│   ├── memory/                   # 記憶システムテスト
│   ├── tools/                    # ツールテスト
│   ├── workflows/                # ワークフローテスト
│   └── components/               # コンポーネントテスト
│       ├── memory/               # 記憶コンポーネントテスト
│       ├── conversation/         # 会話コンポーネントテスト
│       └── tasks/                # タスクコンポーネントテスト
│
└── docs/                         # ドキュメント
    ├── workflow-integration-design.md # ワークフロー統合設計
    ├── design-plan.md            # 設計計画
    ├── memory-system.md          # 記憶システムの詳細説明
    ├── memory-system/            # 記憶システム関連ドキュメント
    │   └── ui-design/            # UI設計関連
    │       ├── memory-ui-design.md     # 記憶システムUI設計
    │       ├── conversation-history.md # 会話履歴表示の詳細設計
    │       ├── long-term-memory.md     # 長期記憶の視覚化設計
    │       ├── working-memory.md       # ワーキングメモリ視覚化設計
    │       ├── interaction-flow.md     # インタラクションフロー設計
    │       └── visual-guidelines.md    # ビジュアルガイドライン
    ├── structure/                # 構造定義関連ドキュメント
    │   ├── structure.yaml              # プロジェクト構造定義
    │   ├── structure_docs.yaml         # ドキュメント構造定義
    │   ├── structure_types.yaml        # 型定義構造
    │   ├── structure_database.yaml     # データベース構造定義
    │   ├── structure_frontend.yaml     # フロントエンド構造定義
    │   └── structure_components_directory.md # ディレクトリ構造説明
    └── readme-md.md              # README関連ドキュメント