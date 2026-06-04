
// api/latest-command.js
import queue from '../lib/queue.js';
import { verifyAuth } from '../lib/auth.js';
import { logger } from '../lib/logger.js';

export async function GET(req) {
  try {
    // Verify authentication
    const authResult = verifyAuth(req);
    if (!authResult.valid) {
      return new Response(JSON.stringify({ error: authResult.error }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get latest pending command
    const command = queue.getLatestCommand();

    logger.info('Latest command requested', command);

    return new Response(JSON.stringify(command ? command : {}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    };
  } catch (error) {
    logger.error('Failed to get latest command', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
