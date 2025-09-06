import React, { useState, useMemo } from 'react';
import { ZeroPointResponse } from '../types';
import AssumptionCard from './AssumptionCard';
import MicroLessonAccordion from './MicroLessonAccordion';
import GapTest from './GapTest';
import KnowledgeGraph from './KnowledgeGraph';

interface ResultsDisplayProps {
  data: ZeroPointResponse;
}

const Section: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="mb-6 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left p-4 bg-gray-50 hover:bg-gray-100 flex justify-between items-center transition"
                aria-expanded={isOpen}
            >
                <h3 className="text-xl font-bold text-brand-primary">{title}</h3>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && <div className="p-6">{children}</div>}
        </div>
    );
};

const KeyMetrics: React.FC<{ data: ZeroPointResponse }> = ({ data }) => {
    const metrics = useMemo(() => {
        const assumptionsCount = data.assumptions_detected.length;
        const microLessonsCount = data.micro_lessons.length;
        const learningPathSteps = data.learning_path.length;

        const totalDurationSeconds = data.micro_lessons.reduce((acc, lesson) => {
            const matches = lesson.duration.match(/(\d+)/g);
            if (!matches) return acc + 45; // Default to 45s if no number
            const nums = matches.map(m => parseInt(m, 10));
            const average = nums.reduce((sum, n) => sum + n, 0) / nums.length;
            return acc + average;
        }, 0);

        const timeToMastery = Math.max(1, Math.round(totalDurationSeconds / 60)); // at least 1 minute

        return [
            { label: 'Assumptions Found', value: assumptionsCount, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-2 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg> },
            { label: 'Micro-Lessons', value: microLessonsCount, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-2 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-5.747-5.747h11.494" /></svg> },
            { label: 'Learning Steps', value: learningPathSteps, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-2 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg> },
            { label: 'Est. Time to Mastery', value: `~${timeToMastery} min`, icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-2 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
        ];
    }, [data]);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center">
            {metrics.map(metric => (
                <div key={metric.label} className="p-4 bg-white rounded-xl shadow-lg border border-gray-200">
                    {metric.icon}
                    <p className="text-2xl font-bold text-brand-dark">{metric.value}</p>
                    <p className="text-sm font-medium text-gray-500">{metric.label}</p>
                </div>
            ))}
        </div>
    );
};


const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ data }) => {
  const [copied, setCopied] = useState(false);
  const difficultyColor = {
    Beginner: 'bg-green-100 text-green-800',
    Intermediate: 'bg-yellow-100 text-yellow-800',
    Advanced: 'bg-red-100 text-red-800',
  }[data.difficulty_level];

  const handleCopy = () => {
      navigator.clipboard.writeText(data.original_content).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      });
  };

  return (
    <div className="space-y-8">
      <KeyMetrics data={data} />
      <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="flex justify-between items-start">
            <div>
                <h2 className="text-2xl font-bold text-brand-dark mb-2">Analysis Complete</h2>
                <div className="text-gray-600 mb-4 italic" style={{ whiteSpace: 'pre-wrap' }}>"{data.original_content}"</div>
            </div>
            <button onClick={handleCopy} className="text-sm flex items-center text-gray-500 hover:text-brand-secondary transition shrink-0 ml-4">
                {copied ? (
                     <><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>Copied!</>
                ) : (
                    <><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copy</>
                )}
            </button>
        </div>
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${difficultyColor}`}>
          {data.difficulty_level}
        </span>
      </div>

      <Section title="Assumptions Detected">
        <div className="space-y-4">
          {data.assumptions_detected.map(assumption => (
            <AssumptionCard key={assumption.assumption_id} assumption={assumption} />
          ))}
        </div>
      </Section>

      <Section title="Knowledge Map" defaultOpen={true}>
        <div className="space-y-6">
            <div>
                <h4 className="font-semibold text-lg text-brand-dark">Target Concept</h4>
                <div className="p-2 bg-blue-50 rounded-md text-brand-secondary">{data.knowledge_map.target_concept}</div>
            </div>
            <div>
                <h4 className="font-semibold text-lg text-brand-dark">Direct Prerequisites</h4>
                <ul className="list-disc list-inside space-y-1 pl-2 text-gray-700">
                    {data.knowledge_map.direct_prerequisites.map(p => <li key={p}>{p}</li>)}
                </ul>
            </div>
            <div>
                <h4 className="font-semibold text-lg text-brand-dark">Indirect Prerequisites</h4>
                 <ul className="list-disc list-inside space-y-1 pl-2 text-gray-700">
                    {data.knowledge_map.indirect_prerequisites.map(p => <li key={p}>{p}</li>)}
                </ul>
            </div>
             <div>
                <h4 className="font-semibold text-lg text-brand-dark mb-2">Dependency Graph</h4>
                <p className="text-sm text-gray-500 mb-4">Hover over a concept to see its direct relationships. Nodes are color-coded by assumption severity.</p>
                <KnowledgeGraph knowledge_map={data.knowledge_map} assumptions={data.assumptions_detected} />
            </div>
        </div>
      </Section>

      <Section title="Micro-Lessons" defaultOpen={false}>
        {data.micro_lessons.map(lesson => (
            <MicroLessonAccordion key={lesson.prerequisite} lesson={lesson} />
        ))}
      </Section>
      
      <Section title="Knowledge Gap Tests" defaultOpen={false}>
        {data.gap_tests.map((test, index) => (
            <GapTest key={test.prerequisite} test={test} testNumber={index + 1} />
        ))}
      </Section>

      <Section title="Recommended Learning Path" defaultOpen={false}>
        <ol className="list-decimal list-inside space-y-2">
            {data.learning_path.map((step, index) => (
                <li key={index} className="p-2 bg-green-50 rounded-md border-l-4 border-green-400 text-green-800" style={{ whiteSpace: 'pre-wrap' }}>
                    {step}
                </li>
            ))}
        </ol>
      </Section>
    </div>
  );
};

export default ResultsDisplay;