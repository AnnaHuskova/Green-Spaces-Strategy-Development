import React, {useState} from 'react';
import { Button, Menu, MenuItem } from '@mui/material';
import {MapStyleType} from "../../pages/HomePage";

// type ColorHex = `#${string}`;

interface MapSourceSwitchProps {
  sources: MapStyleType[],
  selectedSource: number,
  onSelectSource: React.MouseEventHandler,
}

export function MapSourceSwitch({ sources, selectedSource, onSelectSource }: MapSourceSwitchProps) {
  const [anchorElem, setAnchorElem] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorElem);
  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElem(event.currentTarget);
  };
  function handleMenuClose(event: React.MouseEvent) {
    onSelectSource(event);
    setAnchorElem(null);
  };

  const labelStyle: React.CSSProperties = {
    color: "black",
    // fontWeight: 700,
  }
  
  return <div>
    <Button
        id="mapsource-button"
        aria-controls={open ? 'mapsource-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleMenuOpen}
    >
      Dashboard
    </Button>
    <Menu
      id="mapsource-menu"
      anchorEl={anchorElem}
      open={open}
      onClose={handleMenuClose}
      MenuListProps={{
        'aria-labelledby': 'mapsource-button',
      }}
    >
      {sources.map((source) => {
        return <MenuItem key={sources.indexOf(source)} onClick={handleMenuClose}>{source.name}</MenuItem>;
      }
      )}
      {/* <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem> */}
    </Menu>
  </div>;
}