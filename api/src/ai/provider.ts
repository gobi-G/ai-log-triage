export interface SummarizeResponse {
  summary: string;
  hypotheses: string[];
  nextActions: string[];
  confidence: number;
  meta?: { requestId: string };
}

export async function aiSummarize(rawLogs: string): Promise<Omit<SummarizeResponse, 'meta'>> {
  const provider = process.env.AI_PROVIDER || 'mock';
  
  try {
    if (provider === 'openai') {
      return await openaiSummarize(rawLogs);
    } else {
      return await mockSummarize(rawLogs);
    }
  } catch (error) {
    console.error('AI Summarize error:', error);
    // Fallback to mock if any provider fails
    return await mockSummarize(rawLogs);
  }
}

async function mockSummarize(rawLogs: string): Promise<Omit<SummarizeResponse, 'meta'>> {
  // Simple analysis of log content
  const lines = rawLogs.split('\n').filter(line => line.trim());
  const errorCount = lines.filter(line => 
    line.toLowerCase().includes('error') || 
    line.toLowerCase().includes('500')
  ).length;
  const timeoutCount = lines.filter(line => 
    line.toLowerCase().includes('timeout') || 
    line.toLowerCase().includes('timed out')
  ).length;
  const rateLimitCount = lines.filter(line => 
    line.toLowerCase().includes('429') || 
    line.toLowerCase().includes('rate limit')
  ).length;

  const hypotheses: string[] = [];
  const nextActions: string[] = [];

  // Generate hypotheses based on patterns
  if (errorCount > 0) {
    hypotheses.push(`${errorCount} error(s) detected in logs`);
    nextActions.push('Investigate error root causes');
  }
  if (timeoutCount > 0) {
    hypotheses.push('Timeout issues may indicate network or performance problems');
    nextActions.push('Check network connectivity and service response times');
  }
  if (rateLimitCount > 0) {
    hypotheses.push('Rate limiting suggests high traffic or inefficient API usage');
    nextActions.push('Review API usage patterns and implement backoff strategies');
  }
  
  // Default fallbacks
  if (hypotheses.length === 0) {
    hypotheses.push('System appears to be operating normally');
    nextActions.push('Continue monitoring for patterns');
  }

  // Calculate confidence based on log volume and clarity
  let confidence = 0.7; // Base confidence for mock
  if (lines.length > 10) confidence += 0.1;
  if (errorCount === 0 && timeoutCount === 0) confidence += 0.1;
  confidence = Math.min(confidence, 0.95);

  const summary = `Analyzed ${lines.length} log entries. Found ${errorCount} errors, ${timeoutCount} timeouts, and ${rateLimitCount} rate limit issues.`;

  return {
    summary,
    hypotheses,
    nextActions,
    confidence
  };
}

async function openaiSummarize(rawLogs: string): Promise<Omit<SummarizeResponse, 'meta'>> {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  // This would implement actual OpenAI API calls
  // For now, fallback to mock
  console.warn('OpenAI provider not yet implemented, falling back to mock');
  return await mockSummarize(rawLogs);
}
