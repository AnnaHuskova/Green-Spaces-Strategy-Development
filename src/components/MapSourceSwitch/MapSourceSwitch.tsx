import React from 'react';
import { MenuItem, InputLabel, Select, SelectChangeEvent } from '@mui/material';
import {MapStyleType} from "../../pages/HomePage";

// type ColorHex = `#${string}`;

interface MapSourceSwitchProps {
  sources: MapStyleType[],
  selectedSource: number,
  onSetSource: (index:number) => void,
}

export function MapSourceSwitch({ sources, selectedSource, onSetSource }: MapSourceSwitchProps) {
  // const [anchorElem, setAnchorElem] = useState<null | HTMLElement>(null);
  // const open = Boolean(anchorElem);
  // const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   setAnchorElem(event.currentTarget);
  // };
  // function handleMenuClose(event: React.MouseEvent) {
  //   onSetSource(event);
  //   setAnchorElem(null);
  // };
  function onSelect(event: SelectChangeEvent) {
    onSetSource(parseInt(event.target.value));
  }

  const labelStyle: React.CSSProperties = {
    color: "black",
    // fontWeight: 700,
  }
  
  return <div>
    {/* <Button
        id="mapsource-button"
        aria-controls={open ? 'mapsource-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleMenuOpen}
    >
      {sources[selectedSource].name}
    </Button> */}
    <InputLabel id="mapsource-helper-label">Map background source</InputLabel>
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
    {/* <Menu
      id="mapsource-menu"
      anchorEl={anchorElem}
      open={open}
      onClose={handleMenuClose}
      MenuListProps={{
        'aria-labelledby': 'mapsource-button',
      }}
    >
    </Menu> */}
  </div>;
}