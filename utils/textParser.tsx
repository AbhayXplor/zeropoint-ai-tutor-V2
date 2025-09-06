import React from 'react';
import MathRenderer from '../components/MathRenderer';

export const parseAndRenderText = (text: string): React.ReactNode => {
  if (!text) return null;

  // Regex to find $...$ (inline) or $$...$$ (display) expressions.
  // It handles escaped dollars \$ and avoids matching across paragraphs.
  const regex = /(\$\$[\s\S]*?\$\$|\$[\s\S]*?\$)/g;
  
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.startsWith('$$') && part.endsWith('$$')) {
      const latex = part.substring(2, part.length - 2);
      return <div key={index} className="my-2 text-center"><MathRenderer latex={latex} displayMode={true} /></div>;
    } else if (part.startsWith('$') && part.endsWith('$')) {
      const latex = part.substring(1, part.length - 1);
      return <MathRenderer key={index} latex={latex} displayMode={false} />;
    } else {
      // Render plain text parts, preserving whitespace and newlines
      return <span key={index} style={{ whiteSpace: 'pre-wrap' }}>{part}</span>;
    }
  });
};
