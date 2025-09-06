import React from 'react';

declare global {
  interface Window {
    katex: any;
  }
}

interface MathRendererProps {
  latex: string;
  displayMode?: boolean;
}

const MathRenderer: React.FC<MathRendererProps> = ({ latex, displayMode = false }) => {
  // Guard against rendering on the server or if KaTeX script hasn't loaded yet.
  if (typeof window === 'undefined' || !window.katex) {
    // Fallback: render the raw LaTeX string. Better than a blank space.
    return <span className={displayMode ? 'katex-display' : ''}>{latex}</span>;
  }

  try {
    const html = window.katex.renderToString(latex, {
      throwOnError: false,
      displayMode: displayMode,
    });
    // Use dangerouslySetInnerHTML as it's the intended way to inject HTML from KaTeX.
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  } catch (error) {
    console.error("KaTeX rendering error:", error);
    // On error, fallback to the raw text to ensure content is still visible.
    return <span className={displayMode ? 'katex-display' : ''}>{latex}</span>;
  }
};

export default MathRenderer;
