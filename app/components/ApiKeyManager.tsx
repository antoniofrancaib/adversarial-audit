import React, { useState, useEffect } from 'react';

interface ApiKeyManagerProps {
  onKeysChange: (keys: ApiKeys) => void;
}

export interface ApiKeys {
  openai?: string;
  anthropic?: string;
  google?: string;
  mistral?: string;
  meta?: string;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ onKeysChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [keys, setKeys] = useState<ApiKeys>({
    openai: '',
    anthropic: '',
    google: '',
    mistral: '',
    meta: '',
  });
  const [environmentKeyAvailable, setEnvironmentKeyAvailable] = useState(false);

  // Load keys from localStorage or check environment variable once on mount
  useEffect(() => {
    // First try to load from localStorage
    const savedKeys = localStorage.getItem('llm_audit_api_keys');
    let hasStoredKeys = false;
    
    if (savedKeys) {
      try {
        const parsedKeys = JSON.parse(savedKeys);
        setKeys(parsedKeys);
        onKeysChange(parsedKeys);
        hasStoredKeys = true;
      } catch (error) {
        console.error('Failed to parse saved API keys:', error);
      }
    }
    
    // Make a single check for environment variables
    if (!hasStoredKeys) {
      fetch('/api/check-env-keys')
        .then(response => response.json())
        .then(data => {
          if (data.openaiKey) {
            const updatedKeys = { 
              ...keys, 
              openai: data.openaiKey 
            };
            setKeys(updatedKeys);
            onKeysChange(updatedKeys);
            setEnvironmentKeyAvailable(true);
          }
        })
        .catch(error => {
          console.error('Failed to check for environment API keys:', error);
        });
    }
  }, []);  // Empty dependency array means this runs once on mount

  const handleSaveKeys = () => {
    // Save to localStorage
    localStorage.setItem('llm_audit_api_keys', JSON.stringify(keys));
    onKeysChange(keys);
    setIsOpen(false);
  };

  const updateKey = (provider: keyof ApiKeys, value: string) => {
    setKeys((prev) => ({ ...prev, [provider]: value }));
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
        Manage API Keys
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-10">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-200">
              API Keys
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  OpenAI API Key
                </label>
                {environmentKeyAvailable ? (
                  <div className="bg-green-50 border border-green-200 rounded-md p-3 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200">
                    <p className="text-sm">✓ Using API key from environment variables</p>
                  </div>
                ) : (
                  <>
                    <input
                      type="password"
                      value={keys.openai || ''}
                      onChange={(e) => updateKey('openai', e.target.value)}
                      placeholder="sk-..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                    />
                    {keys.openai && (
                      <p className="text-xs text-green-600 mt-1">✓ API key provided</p>
                    )}
                  </>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Anthropic API Key (Claude)
                </label>
                <input
                  type="password"
                  value={keys.anthropic || ''}
                  onChange={(e) => updateKey('anthropic', e.target.value)}
                  placeholder="sk-ant-..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  disabled
                />
                <p className="text-xs text-slate-500 mt-1">Coming soon</p>
              </div>
              
              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveKeys}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                  disabled={environmentKeyAvailable}
                >
                  Save Keys
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiKeyManager; 