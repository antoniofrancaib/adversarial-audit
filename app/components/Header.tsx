import React from 'react';

const Header = () => {
  return (
    <header className="pt-6 pb-4 border-b border-slate-200 dark:border-slate-700">
      <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">LLM Adversarial Audit</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Test language models against jailbreaking attempts and evaluate their responses
      </p>
    </header>
  );
};

export default Header; 