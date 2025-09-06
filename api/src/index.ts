import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';
import { healthRouter } from './routes/health';
import { summarizeRouter } from './routes/summarize';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8787;
const ORIGIN = process.env.ORIGIN || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: ORIGIN,
  credentials: true
}));

// JSON body limit 2MB
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Routes
app.use('/health', healthRouter);
app.use('/summarize', summarizeRouter);

// Error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 AI Provider: ${process.env.AI_PROVIDER || 'mock'}`);
});

export default app;
