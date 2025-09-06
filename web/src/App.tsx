import { useState } from 'react';
import { LogUploader } from './components/LogUploader';
import { SummaryCard } from './components/SummaryCard';
import { summarizeLogs, SummarizeResponse } from './lib/api';

function App() {
  const [logs, setLogs] = useState('');
  const [result, setResult] = useState<SummarizeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSummarize = async () => {
    if (!logs.trim()) {
      setError('Please provide some log content');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await summarizeLogs(logs);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to summarize logs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Log Triage
          </h1>
          <p className="text-gray-600">
            Upload your logs and get AI-powered insights and recommendations
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Upload Logs
            </h2>
            
            <LogUploader logs={logs} onLogsChange={setLogs} />
            
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleSummarize}
                disabled={loading || !logs.trim()}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : 'Summarize'}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </div>

          {result && <SummaryCard result={result} />}
        </div>
      </div>
    </div>
  );
}

export default App;
