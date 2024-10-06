import React from 'react';

interface MapLegendProps {
  className: string,
  children?: React.ReactNode,
}

export function MapLegend({className, children}: MapLegendProps) {
  return <div aria-label='Green area types' className={className}>
      {children}
    </div>;
}