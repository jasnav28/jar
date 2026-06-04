
import queue from '../lib/queue.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Updating command status');
  
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.substring(7);
  const validToken = process.env.JARVIS_API_TOKEN;
  if (token !== validToken) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (!req.body || !req.body.id || !req.body.status) {
    return res.status(400).json({ error: 'Missing required fields: id and status' });
  }

  const updatedCommand = queue.updateCommandStatus(req.body.id, req.body.status);
  if (!updatedCommand) {
    return res.status(404).json({ error: 'Command not found' });
  }

  console.log('Command status updated:', updatedCommand);
  return res.status(200).json(updatedCommand);
}
