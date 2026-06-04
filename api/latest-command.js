
import queue from '../lib/queue.js';
import { verifyAuth } from '../lib/auth.js';
import { logger } from '../lib/logger.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify authentication
    const authResult = verifyAuth(req);
    if (!authResult.valid) {
      return res.status(401).json({ error: authResult.error });
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
