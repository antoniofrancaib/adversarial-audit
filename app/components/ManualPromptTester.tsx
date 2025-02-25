import React, { useState } from 'react';
import { LLMModel } from '../page';

interface ManualPromptTesterProps {
  availableModels: LLMModel[];
  apiKey: string | undefined;
}

// Define a message type for conversation tracking
interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const ManualPromptTester: React.FC<ManualPromptTesterProps> = ({ availableModels, apiKey }) => {
  const [selectedModel, setSelectedModel] = useState<string>(availableModels[0]?.id || '');
  const [prompt, setPrompt] = useState<string>('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([]);
  const [isFollowUp, setIsFollowUp] = useState(false);

  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    // Don't clear the response if this is a follow-up
    if (!isFollowUp) {
      setResponse(null);
    }
    
    setShowEvaluation(false);
    
    try {
      // Map the selected model to available OpenAI models
      const MODEL_MAPPINGS: Record<string, string> = {
        'gpt-4': 'gpt-4-turbo-preview',
        'gpt-3.5-turbo': 'gpt-3.5-turbo',
        'claude-3-opus': 'gpt-4-turbo-preview', // Fallback to GPT-4
        'claude-3-sonnet': 'gpt-4-turbo-preview', // Fallback to GPT-4
        'llama-3-70b': 'gpt-4-turbo-preview', // Fallback to GPT-4
        'gemini-pro': 'gpt-4-turbo-preview', // Fallback to GPT-4
      };
      
      const actualModel = MODEL_MAPPINGS[selectedModel] || 'gpt-3.5-turbo';
      
      // For a follow-up, add the current prompt to conversation history
      let updatedHistory = [...conversationHistory];
      
      // Add the current user message to history
      updatedHistory.push({ role: 'user', content: prompt });
      
      // Test with the target model, including conversation history if this is a follow-up
      const testResponse = await fetch('/api/test-prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: actualModel,
          prompts: [prompt],
          conversationHistory: isFollowUp ? conversationHistory : undefined
        }),
      });
      
      if (!testResponse.ok) {
        const errorData = await testResponse.json().catch(() => ({}));
        throw new Error(errorData.error || errorData.message || `Error: ${testResponse.status} - Failed to get a response from the model`);
      }
      
      const testData = await testResponse.json();
      if (testData.results && testData.results.length > 0) {
        const newResponse = testData.results[0].response;
        setResponse(newResponse);
        
        // Add the assistant's response to history
        updatedHistory.push({ role: 'assistant', content: newResponse });
        setConversationHistory(updatedHistory);
        
        setShowEvaluation(true);
      } else {
        throw new Error('No response received from the model');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluation = (isViolation: boolean) => {
    // In a full implementation, this would send the prompt-response pair
    // with the user's evaluation to a backend endpoint
    console.log('User evaluation:', {
      prompt,
      response,
      isViolation,
      timestamp: new Date().toISOString()
    });
    
    // Reset the form and conversation for a new prompt
    setPrompt('');
    setResponse(null);
    setShowEvaluation(false);
    setConversationHistory([]);
    setIsFollowUp(false);
  };
  
  const handleFollowUp = () => {
    // Keep conversation history and prepare for follow-up
    setPrompt('');  // Clear prompt input for new follow-up question
    setIsFollowUp(true);
    setShowEvaluation(false);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-slate-800">
        Manual Prompt Testing
      </h2>
      
      {isFollowUp && conversationHistory.length > 0 && (
        <div className="mb-6 border-l-4 border-blue-500 pl-4">
          <h3 className="text-md font-medium text-slate-700 mb-2">Conversation History</h3>
          <div className="max-h-60 overflow-y-auto space-y-3 bg-slate-50 p-3 rounded-lg">
            {conversationHistory.map((message, index) => (
              <div key={index} className={`p-2 rounded ${message.role === 'user' ? 'bg-blue-50' : 'bg-green-50'}`}>
                <p className="text-xs font-semibold mb-1">{message.role === 'user' ? 'You' : 'AI'}</p>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <form onSubmit={handlePromptSubmit} className="space-y-4">
        <div>
          <label htmlFor="model" className="block text-sm font-medium text-slate-700 mb-1">
            Target Model
          </label>
          <select
            id="model"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            required
            disabled={loading || isFollowUp}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-slate-900"
          >
            {availableModels.map((model) => (
              <option key={model.id} value={model.id} className="text-slate-900">
                {model.name}
              </option>
            ))}
          </select>
          {isFollowUp && (
            <p className="text-xs text-slate-500 mt-1">Model cannot be changed during a conversation</p>
          )}
        </div>
        
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-slate-700 mb-1">
            {isFollowUp ? 'Your follow-up question' : 'Enter your prompt'}
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
            disabled={loading}
            rows={4}
            placeholder={isFollowUp ? "Type your follow-up question here..." : "Type your prompt here..."}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder:text-slate-500"
          ></textarea>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow transition-colors 
              ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Submitting...' : isFollowUp ? 'Send Follow-up' : 'Submit Prompt'}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <h3 className="font-medium mb-1">Error</h3>
          <p>{error}</p>
        </div>
      )}
      
      {response && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-slate-800 mb-2">Model Response</h3>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-slate-700">
            <p className="whitespace-pre-wrap">{response}</p>
          </div>
          
          {showEvaluation && (
            <div className="mt-4">
              <h3 className="text-lg font-medium text-slate-800 mb-2">Evaluate Response</h3>
              <p className="text-sm text-slate-600 mb-3">
                Is this response safe or does it contain harmful content?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleEvaluation(false)}
                  className="flex-1 py-2 px-4 bg-green-100 text-green-800 font-medium rounded-md shadow-sm hover:bg-green-200 transition-colors"
                >
                  ✅ Safe Response
                </button>
                <button
                  onClick={handleFollowUp}
                  className="flex-1 py-2 px-4 bg-blue-100 text-blue-800 font-medium rounded-md shadow-sm hover:bg-blue-200 transition-colors"
                >
                  🔄 Follow Up
                </button>
                <button
                  onClick={() => handleEvaluation(true)}
                  className="flex-1 py-2 px-4 bg-red-100 text-red-800 font-medium rounded-md shadow-sm hover:bg-red-200 transition-colors"
                >
                  ❌ Harmful Content
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {loading && (
        <div className="flex justify-center items-center py-10 mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-md text-slate-700">Getting response...</span>
        </div>
      )}
    </div>
  );
};

export default ManualPromptTester; 