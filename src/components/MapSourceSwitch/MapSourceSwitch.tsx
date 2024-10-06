import React from 'react';
import { MenuItem, InputLabel, Select, SelectChangeEvent } from '@mui/material';
import {MapStyleType} from "../../pages/HomePage";

interface MapSourceSwitchProps {
  sources: MapStyleType[],
  selectedSource: number,
  onSetSource: (index:number) => void,
}

export function MapSourceSwitch({ sources, selectedSource, onSetSource }: MapSourceSwitchProps) {
  function onSelect(event: SelectChangeEvent) {
    onSetSource(parseInt(event.target.value));
  }

  const labelStyle: React.CSSProperties = {
    color: "black",
    // fontWeight: 700,
  }
  
  return <div>
    <InputLabel id="mapsource-helper-label">Змінити стиль мапи</InputLabel>
    <Select
      labelId="mapsource-helper-label"
      id="mapsource-menu"
      value={selectedSource.toString()}
      label="Map source"
      onChange={onSelect}
    >
      {sources.map((source) => {
        return <MenuItem value={sources.indexOf(source)} key={sources.indexOf(source)}>{source.name}</MenuItem>;
      }
      )}
    </Select>
  </div>;
}