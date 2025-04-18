/**
 * @file 共通型定義のエクスポートファイル
 * @module mastra/types
 * @author 開発者
 * @created 2025-04-19
 */

/**
 * エージェント設定インターフェース
 */
export interface AgentConfig {
  name: string;
  description: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

/**
 * メモリアイテムインターフェース
 */
export interface MemoryItem {
  id: string;
  content: string;
  timestamp: Date;
  metadata: Record<string, any>;
}

/**
 * ツール定義インターフェース
 */
export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, any>;
  handler: (params: any, context: any) => Promise<any>;
}

/**
 * ワークフローステップインターフェース
 */
export interface WorkflowStep {
  name: string;
  description: string;
  execute: (input: any, context: any) => Promise<any>;
}

/**
 * プロンプトテンプレートインターフェース
 */
export interface PromptTemplate {
  name: string;
  template: string;
  variables: string[];
  render: (values: Record<string, string>) => string;
}