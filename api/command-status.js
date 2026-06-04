
// api/command-status.js
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
    if (!body.id || !body.status) {
      return new Response(JSON.stringify({ error: 'Missing required fields: id and status' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update command status
    const updatedCommand = queue.updateCommandStatus(body.id, body.status);
    if (!updatedCommand) {
      return new Response(JSON.stringify({ error: 'Command not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    logger.info('Command status updated', updatedCommand);

    return new Response(JSON.stringify(updatedCommand), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    logger.error('Failed to update command status', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
