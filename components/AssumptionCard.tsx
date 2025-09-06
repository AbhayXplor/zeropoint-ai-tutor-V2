import React from 'react';
import { Assumption } from '../types';

interface AssumptionCardProps {
  assumption: Assumption;
}

const severityStyles = {
  Critical: 'bg-red-100 border-red-500 text-red-700',
  Helpful: 'bg-yellow-100 border-yellow-500 text-yellow-700',
  Advanced: 'bg-green-100 border-green-500 text-green-700',
};

const iconStyles = {
  Critical: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  Helpful: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  Advanced: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
}

const AssumptionCard: React.FC<AssumptionCardProps> = ({ assumption }) => {
  const severityClass = severityStyles[assumption.severity] || 'bg-gray-100 border-gray-500 text-gray-700';
  const iconPath = iconStyles[assumption.severity];

  return (
    <div className={`border-l-4 p-4 rounded-r-lg shadow-sm ${severityClass}`}>
      <div className="flex items-start space-x-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={iconPath} /></svg>
        <div>
          <p className="font-bold">{assumption.prerequisite_concept}</p>
          <p className="text-sm italic mt-1">Found in: "{assumption.assumption_text}"</p>
          <p className="text-sm mt-2">{assumption.explanation}</p>
        </div>
      </div>
    </div>
  );
};

export default AssumptionCard;