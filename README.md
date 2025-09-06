# AI Log Triage

An AI-powered log analysis and triage system built with TypeScript.

## Architecture

- **API**: Node.js + Express backend for log processing and AI analysis (Port 8787)
- **Web**: React + Vite frontend for log visualization and management (Port 5173)

## Features

- **POST /summarize**: Accepts `{ logs: string }` and returns AI-powered analysis
- **Mock AI Provider**: Default implementation with fallback capabilities
- **Provider Switch**: Environment-based AI provider selection (mock|openai)
- **Safety**: 2MB JSON limit, CORS from env, error handling without secrets
- **Request Tracking**: Unique request IDs for all operations

## Development

### Prerequisites

- Node.js 20+
- Yarn 1.22+

### Getting Started

1. Install dependencies:

   ```bash
   yarn install
   ```

2. Copy environment files:

   ```bash
   cp api/.env.example api/.env
   cp web/.env.example web/.env
   ```

3. Start development servers:
   ```bash
   yarn dev
   ```
   This starts both API server (port 8787) and web server (port 5173).

### Available Scripts

- `yarn dev` - Start both API and web in development mode
- `yarn build` - Build both packages
- `yarn start` - Start production API server
- `yarn typecheck` - Type check all packages

### Individual Package Commands

- `yarn dev:api` - Start only the API server
- `yarn dev:web` - Start only the web development server
- `yarn build:api` - Build only the API
- `yarn build:web` - Build only the web app

## API Endpoints

### Health Check

```bash
GET /health
# Returns: { ok: true }
```

### Summarize Logs

```bash
POST /summarize
Content-Type: application/json
{
  "logs": "GET /users 500\nPOST /login timeout\n..."
}

# Returns:
{
  "summary": "Analyzed 2 log entries...",
  "hypotheses": ["2 error(s) detected in logs"],
  "nextActions": ["Investigate error root causes"],
  "confidence": 0.8,
  "meta": { "requestId": "a1b2c3d4" }
}
```

## Configuration

### API Environment (.env)

```bash
AI_PROVIDER=mock          # mock|openai
AI_API_KEY=               # Required for openai provider
PORT=8787                 # API server port
ORIGIN=http://localhost:5173  # CORS origin
```

### Web Environment (.env)

```bash
VITE_API_BASE=http://localhost:8787  # API server URL
```

## Project Structure

```
ai-log-triage/
├── api/                 # Express API server
│   ├── src/
│   │   ├── ai/
│   │   │   └── provider.ts    # AI provider abstraction
│   │   ├── routes/
│   │   │   ├── health.ts      # Health check endpoint
│   │   │   └── summarize.ts   # Log summarization endpoint
│   │   ├── middleware/
│   │   │   └── errorHandler.ts
│   │   └── index.ts           # Express app setup
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── web/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── LogUploader.tsx    # File upload + textarea
│   │   │   └── SummaryCard.tsx    # Analysis results display
│   │   ├── lib/
│   │   │   └── api.ts             # API client
│   │   ├── App.tsx                # Main application
│   │   ├── main.tsx               # React entry point
│   │   └── index.css              # Styles
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── .github/workflows/
│   └── ci.yml           # GitHub Actions CI/CD
└── package.json         # Root workspace config
```

## Usage

1. **Start the servers**: `yarn dev`
2. **Open web interface**: http://localhost:5173
3. **Upload logs**: Drag & drop files or paste text
4. **Click "Summarize"**: Get AI-powered analysis
5. **Review results**: Summary, hypotheses, and recommended actions

## AI Providers

### Mock Provider (Default)

- No external API calls
- Analyzes log patterns for errors, timeouts, rate limits
- Generates hypotheses and action recommendations
- Always available as fallback

### OpenAI Provider

- Set `AI_PROVIDER=openai` and `AI_API_KEY=your_key`
- Enhanced analysis capabilities
- Falls back to mock on errors

## Safety & Security

- **No secrets in logs**: Error handling strips sensitive information
- **Request tracking**: Unique IDs for debugging without exposure
- **Input validation**: Zod schemas for all API inputs
- **Error boundaries**: Graceful fallbacks for all operations
- **CORS protection**: Configurable origin restrictions
