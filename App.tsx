import React, { useState, useCallback, DragEvent, ClipboardEvent, useEffect } from 'react';
import { analyzeMathContent } from './services/geminiService';
import { ZeroPointResponse } from './types';
import ResultsDisplay from './components/ResultsDisplay';

const LoadingSpinner: React.FC<{ streamingText: string }> = ({ streamingText }) => (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-secondary"></div>
        <p className="mt-4 text-brand-dark font-semibold">ZeroPoint AI is thinking...</p>
        <p className="mt-2 text-sm text-gray-500">Receiving response stream from the AI.</p>
        {streamingText && (
            <div className="mt-4 w-full bg-gray-100 p-3 rounded-lg text-xs text-gray-600 max-h-32 overflow-y-auto font-mono">
                <p style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{streamingText}</p>
            </div>
        )}
    </div>
);

const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
    });
    return {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    };
};

const App: React.FC = () => {
  const [mathContent, setMathContent] = useState<string>('');
  const [image, setImage] = useState<{file: File, preview: string} | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{ data: ZeroPointResponse; duration: number } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [streamingText, setStreamingText] = useState('');

  const exampleProblems = [
      "Solve the integral ∫ x² sin(x) dx using integration by parts.",
      "Find the limit of (x²-1)/(x-1) as x → 1.",
      "What is the derivative of f(x) = ln(cos(x³))?"
  ];

  const processFile = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
        setImage({ file, preview: URL.createObjectURL(file) });
        setError(null);
    } else if (file) {
        setError("Please upload a valid image file (PNG, JPG, etc.).");
    }
  };

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
        processFile(files[0]);
    }
  };
  
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileChange(e.dataTransfer.files);
  };

  const handlePaste = useCallback((event: globalThis.ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith('image/')) {
            const file = items[i].getAsFile();
            if (file) {
                processFile(file);
                break; // Handle only the first image
            }
        }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => {
        window.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  const handleAnalyze = useCallback(async () => {
    if (!mathContent.trim() && !image) {
      setError("Please enter a math problem or upload an image to analyze.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setStreamingText('');

    const startTime = performance.now();
    let fullResponse = '';
    try {
        const imagePart = image ? await fileToGenerativePart(image.file) : undefined;
        const stream = analyzeMathContent({ text: mathContent, image: imagePart });
        
        for await (const chunk of stream) {
            fullResponse += chunk;
            setStreamingText(fullResponse);
        }

        const endTime = performance.now();
        const analysisDuration = (endTime - startTime) / 1000; // in seconds

        // Sometimes the API returns the JSON wrapped in ```json ... ```, so we need to clean it.
        const cleanedText = fullResponse.replace(/^```json\s*|```$/g, '');
        const parsedData = JSON.parse(cleanedText);

        if (parsedData.error) {
            throw new Error(parsedData.error);
        }

        // If original_content is empty (which can happen with image-only prompts), fill it.
        if (!parsedData.original_content) {
            parsedData.original_content = mathContent || "Analysis of uploaded image";
        }
        
        setAnalysisResult({ data: parsedData as ZeroPointResponse, duration: analysisDuration });

    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("An unknown error occurred.");
        }
    } finally {
      setIsLoading(false);
    }
  }, [mathContent, image]);
  
  const handleReset = () => {
      setMathContent('');
      setImage(null);
      setAnalysisResult(null);
      setError(null);
      setStreamingText('');
  };

  const handleExampleClick = (example: string) => {
    setMathContent(example);
  };
  
  return (
    <div className="min-h-screen bg-brand-light font-sans">
      <header className="bg-brand-dark shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-white">ZeroPoint AI</h1>
          <p className="text-blue-200">Your Personal JEE Mathematics Prerequisite Detector</p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 p-6 bg-white rounded-xl shadow-lg border border-gray-200 sticky top-8">
            <h2 className="text-2xl font-bold text-brand-dark mb-4">Enter Content</h2>
            <p className="text-gray-600 mb-2">Provide a JEE math problem, concept, or solution step. Use standard symbols for formulas (e.g., x²).</p>
            <textarea
              value={mathContent}
              onChange={(e) => setMathContent(e.target.value)}
              placeholder="e.g., Explain the concept of definite integrals ∫ f(x)dx from a to b..."
              className="w-full h-28 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-secondary focus:border-transparent transition"
              disabled={isLoading}
            />

            <div 
              onDragOver={handleDragOver} 
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`mt-4 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${isDragging ? 'border-brand-secondary bg-blue-50' : 'border-gray-300 hover:border-brand-primary'}`}
              onClick={() => document.getElementById('file-upload')?.click()}
            >
                <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={e => handleFileChange(e.target.files)} disabled={isLoading} />
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <p className="mt-2 text-sm text-gray-600">Drag & drop, paste (Ctrl+V), or click to upload</p>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>

            {image && (
                <div className="mt-4 relative">
                    <img src={image.preview} alt="Problem preview" className="rounded-lg w-full h-auto" />
                    <button onClick={() => setImage(null)} className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 leading-none hover:bg-opacity-75" aria-label="Remove image">
                        &times;
                    </button>
                </div>
            )}

             <div className="flex items-center space-x-2 mt-4">
                <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="flex-grow w-full bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-secondary transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                {isLoading ? 'Analyzing...' : 'Uncover Prerequisites'}
                </button>
                 <button
                    onClick={handleReset}
                    disabled={isLoading}
                    className="bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-300 disabled:text-gray-400 disabled:cursor-not-allowed"
                    aria-label="Clear input and results"
                >
                    Clear
                </button>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Try an Example:</h3>
                <div className="flex flex-col space-y-2">
                    {exampleProblems.map(ex => (
                         <button key={ex} onClick={() => handleExampleClick(ex)} disabled={isLoading} className="text-left text-sm text-brand-secondary hover:underline disabled:text-gray-400 disabled:no-underline">
                            {ex}
                        </button>
                    ))}
                </div>
            </div>

          </div>
          <div className="lg:col-span-2">
            {isLoading && <LoadingSpinner streamingText={streamingText} />}
            {error && (
              <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md flex items-start space-x-3">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <div>
                  <p className="font-bold">Analysis Failed</p>
                  <p>{error}</p>
                </div>
              </div>
            )}
            {!isLoading && !analysisResult && !error && (
                <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                    <h3 className="mt-4 text-xl font-semibold text-brand-dark">Ready for Analysis</h3>
                    <p className="mt-2 text-gray-500">Enter your math content on the left to begin.</p>
                </div>
            )}
            {analysisResult && <ResultsDisplay data={analysisResult.data} duration={analysisResult.duration} />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;