import React from 'react';
import { FormControlLabel, ListItem, Switch } from '@mui/material';

// type ColorHex = `#${string}`;

interface MapLegendItemProps {
  active: boolean,
  onToggleActive: React.ChangeEventHandler,
  color?: string, //ColorHex,
  controls: string,
  label: string,
  children?: React.ReactNode,
}

export function MapLegendSwitch({ active, onToggleActive, color, controls, label }: MapLegendItemProps) {
  // const labelStyle: React.CSSProperties = {
  //   color: color,
  //   // fontWeight: 700,
  // }
  const bgColor = color !== undefined? `bg-${color} opacity-50` : "";
  if(bgColor !== "") 
  console.log(bgColor)
  
  return <li>
    <FormControlLabel value={controls} label={label} labelPlacement="end" /*style={labelStyle}*/ control={
      <>
        <Switch checked={active} name={`${controls}Switch`} id={controls} onChange={onToggleActive} />
        <div className={`inline w-4 h-4 mr-2 ${bgColor}`}/>
      </>
    }/>
  </li>;
}