/**
 * @file Mastraフレームワークのエントリーポイント
 * @module mastra
 * @author 開発者
 * @created 2025-04-19
 */

// 各モジュールのエクスポート
export * from './agents';
export * from './memory';
export * from './tools';
export * from './workflows';
export * from './prompts';
export * from './utils';

// バージョン情報
export const VERSION = '0.1.0';

// フレームワーク初期化関数
export const initialize = () => {
  console.log(`Mastraフレームワーク v${VERSION} を初期化中...`);
  // 初期化ロジックをここに実装
};
