import React, { useState } from 'react';
import { GapTest as GapTestType } from '../types';

interface GapTestProps {
  test: GapTestType;
  testNumber: number;
}

const GapTest: React.FC<GapTestProps> = ({ test, testNumber }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleOptionClick = (option: string) => {
    if (!isAnswered) {
      setSelectedOption(option);
      setIsAnswered(true);
    }
  };

  const getOptionLetter = (option: string) => option.split(')')[0];

  const getOptionStyle = (option: string) => {
    if (!isAnswered) {
      return 'bg-white hover:bg-blue-50 cursor-pointer';
    }
    const optionLetter = getOptionLetter(option);
    if (optionLetter === test.correct_answer) {
      return 'bg-green-100 border-green-500 text-green-800';
    }
    if (optionLetter === getOptionLetter(selectedOption || '')) {
      return 'bg-red-100 border-red-500 text-red-800';
    }
    return 'bg-gray-100 text-gray-500';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-4 border border-gray-200">
      <h4 className="font-semibold text-lg text-brand-primary mb-1" style={{ whiteSpace: 'pre-wrap' }}>
        Gap Test {testNumber}: {test.prerequisite}
      </h4>
      <p className="text-gray-700 mb-4" style={{ whiteSpace: 'pre-wrap' }}>{test.question}</p>
      <div className="space-y-3">
        {test.options.map((option, index) => (
          <div
            key={index}
            onClick={() => handleOptionClick(option)}
            className={`p-3 border rounded-lg transition-colors duration-200 ${getOptionStyle(option)}`}
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {option}
          </div>
        ))}
      </div>
      {isAnswered && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="font-bold text-blue-800">Explanation:</p>
          <div className="text-blue-700" style={{ whiteSpace: 'pre-wrap' }}>{test.explanation}</div>
        </div>
      )}
    </div>
  );
};

export default GapTest;