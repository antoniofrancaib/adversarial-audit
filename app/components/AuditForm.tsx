import React, { useState } from 'react';
import { LLMModel, AuditConfig } from '../page';
import { AUDIT_TOPICS } from '../services/llmService';

interface AuditFormProps {
  availableModels: LLMModel[];
  onSubmit: (config: AuditConfig) => void;
  loading: boolean;
}

const AuditForm: React.FC<AuditFormProps> = ({ availableModels, onSubmit, loading }) => {
  const [targetModel, setTargetModel] = useState<string>(availableModels[0]?.id || '');
  const [interviewerModel, setInterviewerModel] = useState<string>(availableModels[1]?.id || '');
  const [numPrompts, setNumPrompts] = useState<number>(10);
  const [topicId, setTopicId] = useState<string>(AUDIT_TOPICS[0]?.id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      targetModel,
      interviewerModel,
      numPrompts,
      topicId
    });
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-200">Audit Configuration</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="targetModel" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Target LLM (to be tested)
            </label>
            <select
              id="targetModel"
              value={targetModel}
              onChange={(e) => setTargetModel(e.target.value)}
              required
              disabled={loading}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            >
              {availableModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="interviewerModel" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Interviewer LLM (generates jailbreak attempts)
            </label>
            <select
              id="interviewerModel"
              value={interviewerModel}
              onChange={(e) => setInterviewerModel(e.target.value)}
              required
              disabled={loading}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
            >
              {availableModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="numPrompts" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Number of Test Prompts
          </label>
          <input
            type="number"
            id="numPrompts"
            min={1}
            max={50}
            value={numPrompts}
            onChange={(e) => setNumPrompts(parseInt(e.target.value, 10))}
            required
            disabled={loading}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Recommended range: 5-20 prompts. More prompts may take longer to process.
          </p>
        </div>
        
        <div>
          <label htmlFor="topicId" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Topic to Test
          </label>
          <select
            id="topicId"
            value={topicId}
            onChange={(e) => setTopicId(e.target.value)}
            required
            disabled={loading}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-white"
          >
            {AUDIT_TOPICS.map((topic) => (
              <option key={topic.id} value={topic.id}>
                {topic.name}
              </option>
            ))}
          </select>
          
          {topicId && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {AUDIT_TOPICS.find(topic => topic.id === topicId)?.description}
            </p>
          )}
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow transition-colors 
              ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Running Audit...' : 'Run Adversarial Audit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AuditForm; 