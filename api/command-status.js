
import { getLatestCommand, setLatestCommand, clearLatestCommand } from '../lib/commandStore.js';

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

  let currentCommand = getLatestCommand();
  if (!currentCommand || currentCommand.id !== req.body.id) {
    return res.status(404).json({ error: 'Command not found' });
  }

  currentCommand.status = req.body.status;
  
  if (req.body.status === 'completed' || req.body.status === 'failed') {
    clearLatestCommand();
    console.log('Command cleared after completion/failure');
  } else {
    setLatestCommand(currentCommand);
  }

  console.log('Command status updated:', currentCommand);
  return res.status(200).json(currentCommand);
}
