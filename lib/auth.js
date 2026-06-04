
// lib/auth.js
// Authentication middleware for JARVIS Vercel API

export function verifyAuth(req) {
  // Handle both Node.js req.headers and Web Request headers
  const authHeader = req.headers.authorization || (req.headers.get && req.headers.get('authorization'));
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'Missing or invalid Authorization header' };
  }

  const token = authHeader.substring(7);
  
  // Check against environment variable
  const validToken = process.env.JARVIS_API_TOKEN;
  
  if (token !== validToken) {
    return { valid: false, error: 'Invalid token' };
  }

  return { valid: true };
}
