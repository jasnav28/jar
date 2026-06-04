
import queue from '../lib/queue.js';
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
    if (!req.body.id || !req.body.status) {
      return res.status(400).json({ error: 'Missing required fields: id and status' });
    }

    // Update command status
    const updatedCommand = queue.updateCommandStatus(req.body.id, req.body.status);
    if (!updatedCommand) {
      return res.status(404).json({ error: 'Command not found' });
    }

    logger.info('Command status updated', updatedCommand);
    return res.status(200).json(updatedCommand);
  } catch (error) {
    logger.error('Failed to update command status', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
