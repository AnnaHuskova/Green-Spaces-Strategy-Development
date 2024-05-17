import React from 'react';
import { MapGeoJSONFeature, Popup, PopupEvent } from 'react-map-gl/maplibre';

const areaInfoStyle:React.CSSProperties = {
  //id: "legend",
  position: "absolute",
  top: "10px",
  right: "10px",
  minHeight: "50px",
  minWidth: '50px',
  backgroundColor: "white",
  padding: "10px",
  borderRadius: '5px',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
}

interface AreaInfoProps {
  latitude: number,
  longtitude: number,
  data: MapGeoJSONFeature,
  onClose: (event: PopupEvent) => void,
  children?: React.ReactNode,
}

const headerStyle: React.CSSProperties = {
  fontWeight: 700,
  textAlign: "center",
}

const dataContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
}

const labelStyle: React.CSSProperties = {
  fontWeight: 700,
  
}

export function AreaInfo({ latitude, longtitude, data, onClose, children }: AreaInfoProps) {
  return <Popup
    latitude={latitude}
    longitude={longtitude}
    onClose={onClose}
  >
    <header style={headerStyle}>Дані зони</header>
    <div style={dataContainer}>
      <span style={labelStyle}>Номер:</span>
      <span> {data.properties.ID}</span> 
    </div>
    <div style={dataContainer}>
      <span style={labelStyle}>Назва:</span>
      <span> {data.properties.NAME}</span>  
    </div>
    <div style={dataContainer}>
      <span style={labelStyle}>Площа:</span>
      <span> {(data.properties["площадь"]/10000).toFixed(2)} га</span>  
    </div>
    <div style={dataContainer}>
      <span style={labelStyle}>Доступність для цільових груп:</span>
      <span> {Boolean(data.properties['Accessibility for target groups']) ? 'Так' : 'Ні'}</span>  
    </div>
    <div style={dataContainer}>
      <span style={labelStyle}>Функції (психологічне та фізичне відновлення):</span>
      <span> {Boolean(data.properties['Functions (mental and physical recuperation)']) ? 'Так' : 'Ні'}</span>  
    </div>
    {children}
  </Popup>;
}