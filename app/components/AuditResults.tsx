import React, { useState } from 'react';
import { AuditResult } from '../page';

interface AuditResultsProps {
  results: AuditResult[];
}

const AuditResults: React.FC<AuditResultsProps> = ({ results }) => {
  const [expandedResultId, setExpandedResultId] = useState<string | null>(null);
  
  const violations = results.filter(result => result.isViolation);
  const passed = results.filter(result => !result.isViolation);
  
  const toggleExpand = (id: string) => {
    if (expandedResultId === id) {
      setExpandedResultId(null);
    } else {
      setExpandedResultId(id);
    }
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
          Audit Results
        </h2>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Passed: {passed.length}
            </span>
          </div>
          
          <div className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Violations: {violations.length}
            </span>
          </div>
        </div>
      </div>
      
      {violations.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
            Detected Violations
          </h3>
          
          <div className="space-y-3">
            {violations.map(result => (
              <ResultCard 
                key={result.id} 
                result={result} 
                isExpanded={expandedResultId === result.id}
                onToggle={() => toggleExpand(result.id)} 
              />
            ))}
          </div>
        </div>
      )}
      
      {passed.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">
            Passed Tests
          </h3>
          
          <div className="space-y-3">
            {passed.map(result => (
              <ResultCard 
                key={result.id} 
                result={result} 
                isExpanded={expandedResultId === result.id}
                onToggle={() => toggleExpand(result.id)} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface ResultCardProps {
  result: AuditResult;
  isExpanded: boolean;
  onToggle: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, isExpanded, onToggle }) => {
  const getSeverityColor = (severity?: 'low' | 'medium' | 'high') => {
    if (!severity) return '';
    switch (severity) {
      case 'low': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'medium': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return '';
    }
  };

  return (
    <div className={`border rounded-lg overflow-hidden transition-all duration-200 ${
      result.isViolation 
        ? 'border-red-200 dark:border-red-900 bg-red-50 dark:bg-slate-800'
        : 'border-green-200 dark:border-green-900 bg-green-50 dark:bg-slate-800'
    }`}>
      <div 
        className="p-3 flex justify-between items-center cursor-pointer hover:bg-opacity-80"
        onClick={onToggle}
      >
        <div className="flex-1">
          <h4 className="font-medium text-slate-800 dark:text-slate-200">
            {result.prompt.length > 70 ? result.prompt.substring(0, 70) + '...' : result.prompt}
          </h4>
          
          {result.isViolation && result.category && (
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-300 rounded-full">
                {result.category}
              </span>
              
              {result.severity && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${getSeverityColor(result.severity)}`}>
                  {result.severity.charAt(0).toUpperCase() + result.severity.slice(1)} severity
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="flex-shrink-0 ml-2">
          <span className={`flex items-center justify-center w-6 h-6 rounded-full ${
            isExpanded ? 'rotate-180' : ''
          } transition-transform duration-200`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-600 dark:text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="border-t p-3 space-y-3 bg-white dark:bg-slate-800">
          <div>
            <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Prompt:</h5>
            <p className="text-sm text-slate-800 dark:text-slate-200 p-2 bg-slate-100 dark:bg-slate-700 rounded">
              {result.prompt}
            </p>
          </div>
          
          <div>
            <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Response:</h5>
            <p className="text-sm text-slate-800 dark:text-slate-200 p-2 bg-slate-100 dark:bg-slate-700 rounded">
              {result.response}
            </p>
          </div>
          
          {result.isViolation && result.reason && (
            <div>
              <h5 className="text-sm font-medium text-red-600 dark:text-red-400 mb-1">Violation Reason:</h5>
              <p className="text-sm text-red-800 dark:text-red-200 p-2 bg-red-100 dark:bg-red-900/30 rounded">
                {result.reason}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuditResults; 