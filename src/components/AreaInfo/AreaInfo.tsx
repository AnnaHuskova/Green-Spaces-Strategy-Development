import React from 'react';
import { MapGeoJSONFeature, Popup, PopupEvent } from 'react-map-gl/maplibre';
import { Button } from '@mui/material';

/*
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
*/

interface AreaInfoProps {
  latitude: number,
  longtitude: number,
  data: MapGeoJSONFeature,
  onClose: (event: PopupEvent) => void,
  children?: React.ReactNode,
}

export function AreaInfo({ latitude, longtitude, data, onClose, children }: AreaInfoProps) {
  const twDataContainerStyle = 'mb-5'; //flex flex-column justify-between
  const twDataLabelStyle = `font-bold`;

  return <Popup
    latitude={latitude}
    longitude={longtitude}
    onClose={onClose}
    className="p-5 min-w-80 rounded-xl bg-white font-light text-base leading-5"
    maxWidth="none"
  >
    <div className='max-w-80'>
      <header className='font-light text-center mb-2.5'>Дані зони</header>
      <div className={twDataContainerStyle}>
        <label className={twDataLabelStyle}>Номер:</label>
        <div> {data.properties.ID}</div> 
      </div>
      <div className={twDataContainerStyle}>
        <label className={twDataLabelStyle}>Назва:</label>
        <div> {data.properties.NAME}</div>  
      </div>
      <div className={twDataContainerStyle}>
        <label className={twDataLabelStyle}>Площа:</label>
        <div> {(data.properties["площадь"]/10000).toFixed(2)} га</div>  
      </div>
      {/* <div className={twDataContainerStyle}>
        <label className={twDataLabelStyle}>Доступність для цільових груп:</label>
        <div> {Boolean(data.properties['Accessibility for target groups']) ? 'Так' : 'Ні'}</div>  
      </div>
      <div className={twDataContainerStyle}>
        <label className={twDataLabelStyle}>Функції (психологічне та фізичне відновлення):</label>
        <div> {Boolean(data.properties['Functions (mental and physical recuperation)']) ? 'Так' : 'Ні'}</div>  
      </div> */}
      <div className='flex flex-row justify-between text-lg text-center'>
        <Button /*className='px-3 py-2'*/ sx={{
          px: "1.5rem",
          fontSize: "inherit",
          textTransform: "none",
          textWrap: "nowrap"
          }} variant='outlined'>Як зберегти?</Button>
        <Button className='ml-5' sx={{
          px: "1.5rem",
          ml: "1.25rem",
          fontSize: "inherit",
          textTransform: "none",
          textWrap: "nowrap"
          }} variant='outlined'>Детальніше</Button>
      </div>
      {children}
    </div>
  </Popup>;
}