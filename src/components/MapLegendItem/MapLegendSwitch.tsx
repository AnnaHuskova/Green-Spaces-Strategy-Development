import React from 'react';
import { FormControlLabel, ListItem, Switch } from '@mui/material';

type ColorHex = `#${string}`;

interface MapLegendItemProps {
  active: boolean,
  onToggleActive: React.ChangeEventHandler,
  color?: ColorHex,
  controls: string,
  label: string,
  children?: React.ReactNode,
}

export function MapLegendSwitch({ active, onToggleActive, color, controls, label }: MapLegendItemProps) {
  const labelStyle: React.CSSProperties = {
    color: color,
    // fontWeight: 700,
  }
  
  return <ListItem>
    <FormControlLabel value={controls} label={label} labelPlacement="end" style={labelStyle} control={
      <Switch checked={active} name={`${controls}Switch`} id={controls} onChange={onToggleActive} />
    }/>
  </ListItem>;
}