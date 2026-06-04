
import queue from '../lib/queue.js';
import { logger } from '../lib/logger.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
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

    // Get latest pending command
    const command = queue.getLatestCommand();
    logger.info('Latest command requested', command);
    return res.status(200).json(command || {});
  } catch (error) {
    logger.error('Failed to get latest command', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
