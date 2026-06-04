
import queue from '../lib/queue.js';
import { verifyAuth } from '../lib/auth.js';
import { logger } from '../lib/logger.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.substring(7);
    const validToken = process.env.JARVIS_API_TOKEN;
    if (token !== validToken) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Parse request body
    if (!req.body.command) {
      return res.status(400).json({ error: 'Missing required field: command' });
    }

    // Add command to queue
    const command = queue.addCommand({
      command: req.body.command,
      source: req.body.source || 'unknown',
    });

    logger.info('Command added to queue', command);
    return res.status(201).json(command);
  } catch (error) {
    logger.error('Failed to add command', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
