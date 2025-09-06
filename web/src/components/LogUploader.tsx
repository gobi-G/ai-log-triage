import { useState } from 'react';

interface LogUploaderProps {
  onLogsChange: (logs: string) => void;
  logs: string;
}

export const LogUploader: React.FC<LogUploaderProps> = ({ onLogsChange, logs }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        onLogsChange(text);
      };
      reader.readAsText(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        onLogsChange(text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center ${
          dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="space-y-2">
          <p className="text-gray-600">Drop log files here or</p>
          <label className="inline-block cursor-pointer text-blue-600 hover:text-blue-800">
            <span>choose files</span>
            <input
              type="file"
              className="hidden"
              accept=".txt,.log"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>

      <textarea
        className="w-full h-64 p-3 border border-gray-300 rounded-lg resize-y focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Or paste your log content here..."
        value={logs}
        onChange={(e) => onLogsChange(e.target.value)}
      />
    </div>
  );
};
