"use client";

import React, { useState } from 'react';
import ManualPromptTester from './components/ManualPromptTester';

// Simple Header component defined inline
const Header = () => {
  return (
    <header className="pt-6 pb-4 border-b border-slate-200">
      <h1 className="text-3xl font-bold text-blue-600">LLM Adversarial Audit</h1>
      <p className="mt-2 text-slate-700">
        Manual prompt testing with human evaluation
      </p>
    </header>
  );
};

export interface LLMModel {
  id: string;
  name: string;
  description?: string;
}

const AVAILABLE_MODELS: LLMModel[] = [
  { id: 'gpt-4', name: 'GPT-4 (Latest)', description: 'The most powerful OpenAI model' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and efficient OpenAI model' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus (Simulated)', description: 'Anthropic\'s most capable model' },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet (Simulated)', description: 'Balanced Anthropic model' },
  { id: 'llama-3-70b', name: 'Llama 3 70B (Simulated)', description: 'Meta\'s large open model' },
  { id: 'gemini-pro', name: 'Gemini Pro (Simulated)', description: 'Google\'s multimodal model' },
];

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12 bg-white text-slate-900">
      <div className="container max-w-5xl mx-auto space-y-6">
        <Header />
        
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
              <ManualPromptTester 
                availableModels={AVAILABLE_MODELS}
                apiKey="environment" // Use environment variable by default
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
