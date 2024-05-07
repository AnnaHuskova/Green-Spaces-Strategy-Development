import React from 'react';
import Button from "@mui/material/Button";

type ColorHex = `#${string}`;

interface MapLegendItemProps {
  active: boolean,
  onToggleActive: Function,
  color?: ColorHex,
  label: string,
  children?: React.ReactNode,
}

function MapLegendItem({ active, onToggleActive, color, label, ...props }: MapLegendItemProps) {
  
  return <li onClick={() => onToggleActive}>
    <Button variant={active ? 'contained' : 'outlined'} size={active?"large" : "small"}>
      ${label}
    </Button>
  </li>;
}