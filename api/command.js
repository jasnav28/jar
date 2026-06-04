
import queue from '../lib/queue.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Adding new command');
  
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.substring(7);
  const validToken = process.env.JARVIS_API_TOKEN;
  if (token !== validToken) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (!req.body || !req.body.command) {
    return res.status(400).json({ error: 'Missing required field: command' });
  }

  const command = queue.addCommand({
    command: req.body.command,
    source: req.body.source || 'unknown',
  });

  console.log('Command added:', command);
  return res.status(201).json(command);
}
