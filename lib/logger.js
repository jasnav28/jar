
// lib/logger.js
// Simple logging utility
export function log(level, message, data = null) {
  const timestamp = new Date().toISOString();
  const logMessage = {
    timestamp,
    level,
    message,
    data,
  };
  
  console.log(JSON.stringify(logMessage));
}

export const logger = {
  info: (message, data) => log('info', message, data),
  error: (message, data) => log('error', message, data),
  warn: (message, data) => log('warn', message, data),
  debug: (message, data) => log('debug', message, data),
};
