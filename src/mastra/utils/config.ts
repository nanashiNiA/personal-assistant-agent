/**
 * @file 設定ユーティリティ
 * @module mastra/utils/config
 * @author 開発者
 * @created 2025-04-19
 */

import { createLogger } from './logger';

const logger = createLogger('config');

/**
 * 設定インターフェース
 */
export interface Config {
  app: {
    env: string;
    port: number;
    logLevel: string;
  };
  ai: {
    apiKey: string;
    apiEndpoint: string;
    model: string;
  };
  memory: {
    storagePath: string;
    vectorDbUrl: string;
  };
  auth: {
    jwtSecret: string;
    jwtExpiry: string;
  };
  services: {
    weatherApiKey?: string;
    calendarClientId?: string;
    calendarClientSecret?: string;
  };
}

/**
 * 環境変数から設定値を取得し、デフォルト値をフォールバックとして使用
 */
const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key];
  if (!value) {
    if (defaultValue !== undefined) {
      logger.warn(`環境変数 ${key} が設定されていません。デフォルト値 "${defaultValue}" を使用します。`);
      return defaultValue;
    }
    logger.error(`必須環境変数 ${key} が設定されていません。`);
    throw new Error(`必須環境変数 ${key} が設定されていません。`);
  }
  return value;
};

/**
 * 環境変数から数値を取得
 */
const getEnvAsInt = (key: string, defaultValue?: number): number => {
  const value = process.env[key];
  if (!value) {
    if (defaultValue !== undefined) {
      logger.warn(`環境変数 ${key} が設定されていません。デフォルト値 ${defaultValue} を使用します。`);
      return defaultValue;
    }
    logger.error(`必須環境変数 ${key} が設定されていません。`);
    throw new Error(`必須環境変数 ${key} が設定されていません。`);
  }

  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    logger.error(`環境変数 ${key} の値 "${value}" を数値に変換できません。`);
    throw new Error(`環境変数 ${key} の値 "${value}" を数値に変換できません。`);
  }
  return parsed;
};

/**
 * 設定オブジェクトを初期化する
 */
export const initConfig = (): Config => {
  logger.info('設定を読み込んでいます...');

  try {
    const config: Config = {
      app: {
        env: getEnv('NODE_ENV', 'development'),
        port: getEnvAsInt('PORT', 3000),
        logLevel: getEnv('LOG_LEVEL', 'info'),
      },
      ai: {
        apiKey: getEnv('AI_API_KEY'),
        apiEndpoint: getEnv('AI_API_ENDPOINT'),
        model: getEnv('AI_MODEL', 'gpt-4'),
      },
      memory: {
        storagePath: getEnv('MEMORY_STORAGE_PATH', './data/memory'),
        vectorDbUrl: getEnv('VECTOR_DB_URL', 'http://localhost:8080'),
      },
      auth: {
        jwtSecret: getEnv('JWT_SECRET'),
        jwtExpiry: getEnv('JWT_EXPIRY', '24h'),
      },
      services: {
        weatherApiKey: process.env.WEATHER_API_KEY,
        calendarClientId: process.env.CALENDAR_CLIENT_ID,
        calendarClientSecret: process.env.CALENDAR_CLIENT_SECRET,
      },
    };

    logger.info('設定の読み込みが完了しました');
    return config;
  } catch (error) {
    logger.error('設定の読み込み中にエラーが発生しました:', error);
    throw error;
  }
};

// デフォルト設定オブジェクト
let config: Config | null = null;

/**
 * 設定を取得する
 * 初回呼び出し時に初期化される
 */
export const getConfig = (): Config => {
  if (!config) {
    config = initConfig();
  }
  return config;
};

export default getConfig;