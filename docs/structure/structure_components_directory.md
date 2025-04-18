personal-assistant-agent/
│
├── .env.development              # 開発環境の環境変数
├── .env.example                  # 環境変数のサンプル
├── .gitignore                    # Gitの除外ファイル設定
├── package.json                  # プロジェクト依存関係と設定
├── tsconfig.json                 # TypeScript設定
├── README.md                     # プロジェクト概要
│
├── src/                          # ソースコード
│   ├── mastra/                   # Mastraメインディレクトリ
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
│   └── index.ts                  # アプリケーションのエントリーポイント
│
├── tests/                        # テスト
│   ├── agents/                   # エージェントテスト
│   ├── memory/                   # 記憶システムテスト
│   ├── tools/                    # ツールテスト
│   └── workflows/                # ワークフローテスト
│
└── docs/                         # ドキュメント
    ├── workflow-integration-design.md # ワークフロー統合設計
    ├── design-plan.md          # 設計計画
    ├── memory-system.md          # 記憶システムの詳細説明
    ├── mcp/                      # MCP関連ドキュメント
    ├── cursor_rules_context/     # Cursorルールコンテキスト関連
    ├── structure/                # 構造定義関連ドキュメント
    └── readme-md.md              # README関連ドキュメント