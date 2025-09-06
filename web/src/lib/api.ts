const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8787';

export interface SummarizeResponse {
  summary: string;
  hypotheses: string[];
  nextActions: string[];
  confidence: number;
  meta?: { requestId: string };
}

export async function summarizeLogs(logs: string): Promise<SummarizeResponse> {
  const response = await fetch(`${API_BASE}/summarize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ logs }),
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
