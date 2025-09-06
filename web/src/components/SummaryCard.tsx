import { SummarizeResponse } from '../lib/api';

interface SummaryCardProps {
  result: SummarizeResponse;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ result }) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'High';
    if (confidence >= 0.6) return 'Medium';
    return 'Low';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-semibold text-gray-900">Log Analysis Summary</h2>
          <div className="text-right">
            <div className={`font-medium ${getConfidenceColor(result.confidence)}`}>
              {getConfidenceText(result.confidence)} Confidence
            </div>
            <div className="text-sm text-gray-500">
              {Math.round(result.confidence * 100)}%
            </div>
          </div>
        </div>
        {result.meta?.requestId && (
          <div className="text-xs text-gray-400 mt-2">
            Request ID: {result.meta.requestId}
          </div>
        )}
      </div>

      {/* Summary */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Summary</h3>
        <p className="text-gray-700">{result.summary}</p>
      </div>

      {/* Hypotheses */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Hypotheses</h3>
        <ul className="space-y-2">
          {result.hypotheses.map((hypothesis, index) => (
            <li key={index} className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                {index + 1}
              </span>
              <span className="text-gray-700">{hypothesis}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Next Actions */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Recommended Actions</h3>
        <ul className="space-y-2">
          {result.nextActions.map((action, index) => (
            <li key={index} className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                ✓
              </span>
              <span className="text-gray-700">{action}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
