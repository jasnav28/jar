
// api/command.js
import queue from '../lib/queue.js';
import { verifyAuth } from '../lib/auth.js';
import { logger } from '../lib/logger.js';

export async function POST(req) {
  try {
    // Verify authentication
    const authResult = verifyAuth(req);
    if (!authResult.valid) {
      return new Response(JSON.stringify({ error: authResult.error }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse request body
    const body = await req.json();
    if (!body.command) {
      return new Response(JSON.stringify({ error: 'Missing required field: command' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Add command to queue
    const command = queue.addCommand({
      command: body.command,
      source: body.source || 'unknown',
    });

    logger.info('Command added to queue', command);

    return new Response(JSON.stringify(command), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    logger.error('Failed to add command', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
