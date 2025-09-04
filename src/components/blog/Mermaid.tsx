'use client';

import React, { useEffect, useRef } from 'react';

type MermaidProps = {
  chart: string;
};

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import('mermaid').then(mermaid => {
      mermaid.default.initialize({ startOnLoad: false, theme: 'dark' });
      if (containerRef.current) {
        mermaid.default.render('mermaid-graph', chart)
          .then(({ svg }) => {
            if (containerRef.current) {
              containerRef.current.innerHTML = svg;
            }
          })
          .catch(error => {
            console.error('Mermaid render error:', error);
          });
      }
    });
  }, [chart]);

  return <div ref={containerRef} />;
};

export default Mermaid;
