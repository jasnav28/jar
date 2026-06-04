
import queue from '../lib/queue.js';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Fetching latest command');
  
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = authHeader.substring(7);
  const validToken = process.env.JARVIS_API_TOKEN;
  if (token !== validToken) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  const command = queue.getLatestCommand();
  console.log('Queue length:', queue.getAllCommands().length);
  
  if (command) {
    console.log('Returning command:', command);
    return res.status(200).json(command);
  } else {
    console.log('No pending commands');
    return res.status(200).json({ command: null });
  }
}
