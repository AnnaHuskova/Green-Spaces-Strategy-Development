import React from 'react';
import { Button } from '@mui/material';
import { area as getArea } from "@turf/turf";
import envVars from "../../js/env";
import { PathLike } from 'fs';

import { GreenArea } from '../../pages';
import { getPdf } from '../AreaInfo/AreaInfo';

interface AreaInfoExtendedProps {
  latitude: number,
  longtitude: number,
  data: GreenArea,
  //onClose: (event: PopupEvent) => void,
  children?: React.ReactNode,
  onExtend: React.MouseEventHandler,
}



export function AreaInfoExtended({ latitude, longtitude, data, children }: AreaInfoExtendedProps) {
  const twDataContainerStyle = 'mb-3'; //flex flex-column justify-between
  const twDataLabelStyle = `font-bold`;

  return <div
    key = {latitude+longtitude}
    className="absolute top-40 right-20 w-[440px] h-[calc(100%-160px)] p-7 rounded-xl bg-white bg-opacity-70 font-light text-base leading-5 overflow-y-auto"
  >
      <header className='font-light text-center mb-2.5 hidden'>Дані зони</header>
      <div className={twDataContainerStyle}>
        <label className={twDataLabelStyle}>Повна назва:</label>
        <div> {data.properties.name || "Не має назви"}</div>  
      </div>
      <div className={twDataContainerStyle}>
        <label className={twDataLabelStyle}>Статус:</label>
        <div> {data.properties.landStatus? "Є об'єктом благоустрою" : "Не є об'єктом благоустрою"}</div> 
      </div>
      <div className={twDataContainerStyle}>
        <label className={twDataLabelStyle}>Тип:</label>
        <div> {data.properties.landType as unknown as string}</div> 
      </div>      
      <div className={twDataContainerStyle}>
        <label className={twDataLabelStyle}>Площа:</label>
        <div> {(getArea(data)/10000).toFixed(2)} га</div>  
      </div>
      <div className={twDataContainerStyle}>
        <label className={twDataLabelStyle}>Рішення:</label>
        <div> {data.properties.description}</div> 
      </div> 
      <div className={twDataContainerStyle}>
        <label className={twDataLabelStyle}>Адміністративний район:</label>
        <div> {data.properties.adm4}</div> 
      </div>
      <div className={twDataContainerStyle}>
        <label className={twDataLabelStyle}>Балансоутримувач:</label>
        <div> {data.properties.owner}</div> 
      </div>

        <Button /*className='px-3 py-2'*/ sx={{
          marginTop: "28px",
          marginLeft: "auto",
          marginRight: "auto",
          px: "1.5rem",
          fontSize: "inherit",
          textTransform: "none",
          textWrap: "nowrap",
          display: "block"
          }} variant='outlined' onClick={getPdf} >Зробити подання &gt;</Button>
      {children}
  </div>;
}