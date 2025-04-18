/**
 * @file エージェントアプリケーションのエントリーポイント
 * @module personal-assistant-agent
 * @author 開発者
 * @created 2025-04-19
 */

import dotenv from 'dotenv';
import path from 'path';
import { initialize } from './mastra';
import { createLogger } from './mastra/utils/logger';
import { getConfig } from './mastra/utils/config';

// 適切な環境変数ファイルをロード
const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: path.resolve(process.cwd(), `.env.${env}`) });

// ロガー初期化
const logger = createLogger('app');

logger.info('パーソナルアシスタントエージェントを起動しています...');

// TODO: エージェント初期化ロジックの実装
// TODO: メモリシステムの初期化
// TODO: ツールの登録
// TODO: ワークフローの設定

const main = async (): Promise<void> => {
  try {
    // 設定を読み込む
    const config = getConfig();
    logger.info(`アプリケーション環境: ${config.app.env}`);

    // Mastraフレームワークを初期化
    initialize();

    logger.info('エージェントが起動しました。コマンドを待機しています...');

    // メインロジックはここに実装

  } catch (error) {
    logger.error('エラーが発生しました:', error);
    process.exit(1);
  }
};

main().catch(error => {
  logger.error('予期せぬエラーが発生しました:', error);
  process.exit(1);
});
