'use client';

import React, { useEffect, useRef } from 'react';

type NomnomlDiagramProps = {
  chart: string;
};

const NomnomlDiagram: React.FC<NomnomlDiagramProps> = ({ chart }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    import('nomnoml').then(nomnoml => {
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const source = chart;
          try {
            nomnoml.draw(canvas, source);
          } catch (e) {
            console.error('nomnoml render error:', e);
          }
        }
    })
  }, [chart]);

  return <canvas ref={canvasRef} />;
};

export default NomnomlDiagram;