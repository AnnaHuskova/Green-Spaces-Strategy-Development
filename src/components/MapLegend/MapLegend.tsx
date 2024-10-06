import React from 'react';

interface MapLegendProps {
  className: string,
  children?: React.ReactNode,
}

export function MapLegend({className, children}: MapLegendProps) {
  return <div className={className}>
      {children}
    </div>;
}