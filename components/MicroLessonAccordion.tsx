import React, { useState } from 'react';
import { MicroLesson } from '../types';

interface MicroLessonAccordionProps {
  lesson: MicroLesson;
  isOpen: boolean;
  onToggle: () => void;
}

const MicroLessonAccordion: React.FC<MicroLessonAccordionProps> = ({ lesson, isOpen, onToggle }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg mb-2 overflow-hidden shadow-sm">
      <button
        onClick={onToggle}
        className="w-full text-left p-4 bg-white hover:bg-gray-50 flex justify-between items-center transition"
      >
        <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-5.747-5.747h11.494" /></svg>
            <span className="font-semibold text-brand-dark">{lesson.title}</span>
        </div>
        <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-4">{lesson.duration}</span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
        </div>
      </button>
      {isOpen && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="text-gray-700 mb-4" style={{ whiteSpace: 'pre-wrap' }}>{lesson.content}</div>
          <div className="border-t border-dashed pt-4">
            <p className="font-semibold text-gray-800">Practice Question:</p>
            <div className="italic text-gray-600 mb-2" style={{ whiteSpace: 'pre-wrap' }}>{lesson.practice_question}</div>
            {!showAnswer ? (
                 <button onClick={() => setShowAnswer(true)} className="text-sm text-brand-secondary hover:underline">Show Answer</button>
            ) : (
                <div className="p-3 bg-blue-100 border border-blue-200 rounded-md text-sm text-blue-800" style={{ whiteSpace: 'pre-wrap' }}>
                    {lesson.practice_answer}
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MicroLessonAccordion;