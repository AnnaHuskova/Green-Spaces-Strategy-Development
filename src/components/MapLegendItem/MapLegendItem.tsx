import React from 'react';
import Button from "@mui/material/Button";

type ColorHex = `#${string}`;

interface MapLegendItemProps {
  active: boolean,
  onToggleActive: React.MouseEventHandler,
  color?: ColorHex,
  label: string,
  children?: React.ReactNode,
}

export function MapLegendItem({ active, onToggleActive, color, label, ...props }: MapLegendItemProps) {
  
  return <li id={label} onClick={onToggleActive}>
    <Button variant={active ? 'contained' : 'outlined'} size={active?"large" : "small"} >
      {label}
    </Button>
  </li>;
}