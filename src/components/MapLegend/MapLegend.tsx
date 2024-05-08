import { List } from '@mui/material';
import React from 'react';

const legendStyle:React.CSSProperties = {
  //id: "legend",
  position: "absolute",
  top: "10px",
  right: "10px",
  minHeight: "50px",
  minWidth: '50px',
  backgroundColor: "white",
  padding: "10px",
  borderRadius: '5px',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
}

interface MapLegendProps {
  children?: React.ReactNode,
}

export function MapLegend({children}: MapLegendProps) {
  return <div style={legendStyle}>
    <List>
      {children && children}
    </List>
    </div>;
}