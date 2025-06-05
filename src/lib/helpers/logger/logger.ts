// src/lib/utils/logger.ts
import pino from 'pino';
import { dev } from '$app/environment';

// Create logger instance
export const logger = pino({
  level: dev ? 'debug' : 'info',
  transport: dev ? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname'
    }
  } : undefined,
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

// Convenience functions for different log types
export const logAuth = (event: string, data: Record<string, unknown>) => {
  logger.info({ category: 'AUTH', event, ...data });
};

//warning
export const logWarning = (event: string, data: Record<string, unknown>) => {
  logger.warn({ category: 'WARNING', event, ...data });
};

// general information
export const logInfo = (event: string, data: Record<string, unknown>) => {
  logger.info({ category: 'INFO', event, ...data });
};

export const logSecurity = (event: string, data: Record<string, unknown>) => {
  logger.warn({ category: 'SECURITY', event, ...data });
};

export const logError = (event: string, data: Record<string, unknown>) => {
  logger.error({ category: 'ERROR', event, ...data });
};

export const logSystem = (event: string, data: Record<string, unknown>) => {
  logger.info({ category: 'SYSTEM', event, ...data });
};

// Utility function
export const generateErrorId = (): string => {
  return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};