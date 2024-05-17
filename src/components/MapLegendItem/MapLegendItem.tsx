import React from 'react';
import { FormControlLabel, ListItem, Switch } from '@mui/material';

type ColorHex = `#${string}`;

interface MapLegendItemProps {
  active: boolean,
  onToggleActive: React.ChangeEventHandler,
  color?: ColorHex,
  layerType: string,
  label: string,
  children?: React.ReactNode,
}

export function MapLegendItem({ active, onToggleActive, color, layerType, label }: MapLegendItemProps) {
  const labelStyle: React.CSSProperties = {
    color: color,
    // fontWeight: 700,
  }
  
  return <ListItem>
    <FormControlLabel value={layerType} label={label} labelPlacement="end" style={labelStyle} control={
      <Switch checked={active} name={`${layerType}Switch`} id={layerType} onChange={onToggleActive} />
    }/>
  </ListItem>;
}