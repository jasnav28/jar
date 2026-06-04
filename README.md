
# JARVIS Vercel API

Lightweight Vercel-compatible API service for the JARVIS AI Operating System command queue layer.

## Architecture

```
Alexa → Vercel API → Command Queue → Local Poller → OpenJarvis Runtime
```

## Project Structure

```
jarvis-vercel-api/
├── api/
│   ├── command.js         # POST: Add new command to queue
│   ├── latest-command.js  # GET: Get latest pending command
│   ├── command-status.js  # POST: Update command status
│   └── health.js          # GET: Health check
├── lib/
│   ├── queue.js           # In-memory command queue
│   ├── auth.js            # Authentication middleware
│   └── logger.js          # Logging utility
├── package.json
├── vercel.json
├── .env.example
├── .gitignore
└── README.md
```

## API Endpoints

All endpoints require an `Authorization: Bearer <token>` header.

### 1. Health Check
- **URL**: `GET /api/health`
- **Response**:
  ```json
  {
    "status": "online",
    "queue_size": 0
  }
  ```

### 2. Add Command
- **URL**: `POST /api/command`
- **Request Body**:
  ```json
  {
    "command": "open youtube",
    "source": "alexa"
  }
  ```
- **Response**:
  ```json
  {
    "id": "cmd_001",
    "command": "open youtube",
    "status": "pending",
    "source": "alexa",
    "timestamp": "2026-06-04T12:00:00.000Z"
  }
  ```

### 3. Get Latest Command
- **URL**: `GET /api/latest-command`
- **Response**:
  ```json
  {
    "id": "cmd_001",
    "command": "open youtube",
    "status": "pending",
    "source": "alexa",
    "timestamp": "2026-06-04T12:00:00.000Z"
  }
  ```

### 4. Update Command Status
- **URL**: `POST /api/command-status`
- **Request Body**:
  ```json
  {
    "id": "cmd_001",
    "status": "completed"
  }
  ```
- **Response**:
  ```json
  {
    "id": "cmd_001",
    "command": "open youtube",
    "status": "completed",
    "source": "alexa",
    "timestamp": "2026-06-04T12:00:00.000Z"
  }
  ```

## Local Testing

### Prerequisites
1. Install Vercel CLI: `npm install -g vercel`
2. Copy `.env.example` to `.env` and add your API token:
   ```bash
   cp .env.example .env
   ```
3. Edit `.env` and set `JARVIS_API_TOKEN` to a secure random string

### Run Locally
```bash
npm run dev
```

### Test Endpoints
You can test using curl or Postman:

**Health Check**:
```bash
curl http://localhost:3000/api/health
```

**Add Command**:
```bash
curl -X POST http://localhost:3000/api/command \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"command": "say hello", "source": "test"}'
```

**Get Latest Command**:
```bash
curl http://localhost:3000/api/latest-command \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Update Status**:
```bash
curl -X POST http://localhost:3000/api/command-status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"id": "cmd_001", "status": "completed"}'
```

## Deployment

### 1. Prepare for GitHub
```bash
cd jarvis-vercel-api
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/jarvis-vercel-api.git
git push -u origin main
```

### 2. Deploy to Vercel
1. Log in to [Vercel](https://vercel.com)
2. Click "New Project" → Import your GitHub repository
3. Add environment variable `JARVIS_API_TOKEN` in Vercel dashboard
4. Deploy!

### 3. Vercel CLI Deployment
```bash
npm run deploy
```

## Alexa Integration
- Use Vercel deployment URL as your Alexa skill's backend
- Send commands to `POST /api/command`

## Local Poller Integration
- Poll `GET /api/latest-command` periodically for new commands
- Update status with `POST /api/command-status` once processed
