import React from 'react';
import { area as getArea } from "@turf/turf";
import { GreenArea } from '../../pages';
import { PdfButton } from '../AreaInfo/PdfButton';

interface AreaInfoExtendedProps {
  latitude: number,
  longtitude: number,
  data: GreenArea,
  children?: React.ReactNode,
  onExtend: React.MouseEventHandler,
}

export function AreaInfoExtended({ latitude, longtitude, data, children }: AreaInfoExtendedProps) {
  const twDataContainerStyle = 'mb-3';
  const twDataLabelStyle = `font-bold`;

  return <div
    key = {latitude+longtitude}
    className="absolute z-10 top-0 right-0 w-full h-full sm:top-40 sm:right-20 sm:w-[440px] sm:h-[calc(100%-160px)] p-7 rounded-xl bg-white bg-opacity-90 font-light text-base leading-5 overflow-y-auto"
  >
      {/* <h3 className='font-light text-center mb-2.5 hidden'>Дані зони</h3> */}
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
        <div> {data.properties.landType as unknown as String}</div> 
      </div>      
      <div className={`${twDataContainerStyle} mb-11`}>
        <label className={twDataLabelStyle}>Площа:</label>
        <div> {(getArea(data)/10000).toFixed(2)} га</div>  
      </div>
      <div className={`${twDataContainerStyle} mb-8`}>
        <label className={twDataLabelStyle}>Рішення:</label>
        <div> {data.properties.description}</div> 
      </div> 
      <div className={`${twDataContainerStyle} mb-5`}>
        <label className={twDataLabelStyle}>Адміністративний район:</label>
        <div> {data.properties.adm4}</div> 
      </div>
      <div className={twDataContainerStyle}>
        <label className={twDataLabelStyle}>Балансоутримувач:</label>
        <div> {data.properties.owner}</div> 
      </div>
      <div className={twDataContainerStyle}>
        <label className={twDataLabelStyle}>Підпорядковано:</label>
        <div>-</div> 
      </div>

      <PdfButton 
        buttonName="Зробити подання >" 
        sx={{
          marginTop: "28px",
          marginLeft: "auto",
          marginRight: "auto",
          px: "1.5rem",
          fontSize: "inherit",
          textTransform: "none",
          textWrap: "nowrap",
          display: "block"
        }} 
        variant='outlined'
      />
      {children}
  </div>;
}