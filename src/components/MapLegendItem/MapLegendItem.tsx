import React from 'react';
// import Button from "@mui/material/Button";
import { FormControlLabel, ListItem, Switch } from '@mui/material';
import clsx from "clsx"

type ColorHex = `#${string}`;

interface MapLegendItemProps {
  active: boolean,
  onToggleActive: React.MouseEventHandler,
  color?: ColorHex,
  layerType: string,
  label: string,
  children?: React.ReactNode,
}

export function MapLegendItem({ active, onToggleActive, color, layerType, label }: MapLegendItemProps) {
  
  return <ListItem id={layerType} onClick={onToggleActive}    >
    <FormControlLabel value={layerType} label={label} labelPlacement="end" control={
      <Switch checked={active} name={`${layerType}Switch`} />
    }/>
  </ListItem>;
}