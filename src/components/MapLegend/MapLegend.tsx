import React from 'react';

interface MapLegendProps {
  style: string,
  children?: React.ReactNode,
}

export function MapLegend({style, children}: MapLegendProps) {
  return <div aria-label='Green area types' className={style}>
      {children}
    </div>;
}