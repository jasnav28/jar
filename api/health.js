
// api/health.js
import queue from '../lib/queue.js';

export async function GET(req) {
  try {
    return new Response(JSON.stringify({
      status: 'online',
      queue_size: queue.getQueueSize(),
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      status: 'error',
      error: 'Internal server error',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
