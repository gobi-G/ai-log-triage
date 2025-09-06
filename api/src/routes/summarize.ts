import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { aiSummarize, SummarizeResponse } from '../ai/provider';
import { randomBytes } from 'crypto';

export const summarizeRouter = Router();

// Validation schema
const SummarizeRequestSchema = z.object({
  logs: z.string().min(1, 'Logs cannot be empty')
});

// Generate unique request ID
function generateRequestId(): string {
  return randomBytes(8).toString('hex');
}

summarizeRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  const requestId = generateRequestId();
  
  try {
    console.log(`[${requestId}] Summarize request received`);
    
    // Validate request body
    const validatedData = SummarizeRequestSchema.parse(req.body);
    const { logs } = validatedData;
    
    console.log(`[${requestId}] Processing ${logs.length} characters of log data`);
    
    // Call AI summarization
    const result = await aiSummarize(logs);
    
    // Add metadata with request ID
    const response: SummarizeResponse = {
      ...result,
      meta: { requestId }
    };
    
    console.log(`[${requestId}] Summarization completed with confidence ${result.confidence}`);
    
    res.json(response);
  } catch (error) {
    console.error(`[${requestId}] Summarize error:`, error);
    
    if (error instanceof z.ZodError) {
      res.status(400).json({ 
        error: 'Invalid request data', 
        details: error.errors,
        meta: { requestId }
      });
      return;
    }
    
    // Pass to error handler but include requestId in response
    req.body = { ...req.body, requestId };
    next(error);
  }
});
