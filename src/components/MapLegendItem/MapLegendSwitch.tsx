import React from 'react';

interface MapLegendItemProps {
  active: boolean,
  onToggleActive: React.ChangeEventHandler,
  color?: string, //ColorHex,
  controls: string,
  label: string,
  children?: React.ReactNode,
}

export function MapLegendSwitch({ active, onToggleActive, color, controls, label }: MapLegendItemProps) {
  const colors: Record<string, string> = {
    "areasProtected": "peer-checked:bg-areasProtected hover:peer-checked:bg-areasProtected",
    "areasUnprotected": "peer-checked:bg-areasUnprotected hover:peer-checked:bg-areasUnprotected",
    "default": "peer-checked:bg-accent hover:peer-checked:bg-accent",
  }
  const activeColor = color? colors[color] : colors.default;
  
  return <label aria-label={label} className="relative flex items-center cursor-pointer mb-2">
      <input type="checkbox" id={controls} className="sr-only peer" onChange={onToggleActive} checked={active}/>
      <div className={`w-9 h-5 bg-form-unchecked hover:bg-form-hover peer-focus:outline-0 peer-focus:ring-transparent rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-form-unchecked after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${activeColor}`}></div>
      <span className="ms-1.5 text-sm">{label}</span> 
    </label>;
}