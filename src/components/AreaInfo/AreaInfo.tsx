import React from 'react';
import { Popup } from 'react-map-gl/maplibre';
import { Button } from '@mui/material';
import { area as getArea } from "@turf/turf";
import { GreenArea } from '../../pages';
import { PdfButton } from './PdfButton';
import { trackEvent } from '../utils/trackingUtils';

interface AreaInfoProps {
  latitude: number;
  longitude: number;
  data: GreenArea;
  children?: React.ReactNode;
  onExtend: React.MouseEventHandler;
}

export function AreaInfo({ latitude, longitude, data, children, onExtend }: AreaInfoProps) {
  const { name, landStatus, landType, owner } = data.properties;
  // const areaInHectares = (getArea(data) / 10000).toFixed(2);
  
  const twDataContainerStyle = 'mb-5';
  const twDataLabelStyle = 'font-bold';

  const handleOnExtendClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    trackEvent('Button', 'Click', 'Extend');
    onExtend(event);
  };
  return (
    <>
      <Popup
        key={`${latitude}-${longitude}`}
        latitude={latitude}
        longitude={longitude}
        className="max-sm:hidden max-sm:w-auto sm:min-w-80 font-light text-base leading-5"
        maxWidth="none"
      >
        <div className='max-w-80'>
          <h3 className='hidden font-light text-center mb-2.5'>Дані зони</h3>
          <div className={twDataContainerStyle}>
            <label className={twDataLabelStyle}>Назва:</label>
            <div className="pl-1">{name || "Не має назви"}</div>
          </div>
          <div className={twDataContainerStyle}>
            <label className={twDataLabelStyle}>Статус:</label>
            <div className="pl-1">{landStatus? "Є об'єктом благоустрою" : "Не є об'єктом благоустрою"}</div>
          </div>
          <div className={twDataContainerStyle}>
            <label className={twDataLabelStyle}>Тип:</label>
            <div className="pl-1">{landType.toString()}</div>
          </div>
          <div className={twDataContainerStyle}>
            <label className={twDataLabelStyle}>Балансоутримувач:</label>
            <div className="pl-1">{owner? owner : "-"}</div>
          </div>
          <div className='flex flex-row justify-between text-lg text-center'>
            <PdfButton 
              buttonName="Як зберегти?" 
              sx={{
                px: "1.5rem",
                fontSize: "inherit",
                textTransform: "none",
                whiteSpace: "nowrap"
              }}
              variant='outlined'
            />
            <Button
              className='ml-5'
              sx={{
                px: "1.5rem",
                ml: "1.25rem",
                fontSize: "inherit",
                textTransform: "none",
                whiteSpace: "nowrap"
              }}
              variant='outlined'
              onClick={handleOnExtendClick}
            >
              Детальніше
            </Button>
          </div>
          {children}
        </div>
      </Popup>

      <div
        className="absolute bottom-0 left-0 w-full sm:hidden font-light text-base leading-5 rounded-xl bg-white"
      >
        <div className='w-auto px-6 pt-3 pb-6'>
          <h3 className='hidden font-light text-center mb-2.5'>Дані зони</h3>
          <div className={"mb-1.5"}>
            <label className={twDataLabelStyle}>Назва:</label>
            <div className="pl-1">{name || "Не має назви"}</div>
          </div>
          <div className={"mb-1.5"}>
            <label className={twDataLabelStyle}>Статус:</label>
            <div className="pl-1">{landStatus? "Є об'єктом благоустрою" : "Не є об'єктом благоустрою"}</div>
          </div>
          <div className={"mb-1.5"}>
            <label className={twDataLabelStyle}>Тип:</label>
            <div className="pl-1">{landType.toString()}</div>
          </div>
          <div className={"mb-1.5"}>
            <label className={twDataLabelStyle}>Балансоутримувач:</label>
            <div className="pl-1">{owner? owner : "-"}</div>
          </div>
          <div className='flex flex-row justify-between text-lg text-center'>
            <PdfButton 
              buttonName="Як зберегти?" 
              sx={{
                px: "1.5rem",
                fontSize: "inherit",
                textTransform: "none",
                whiteSpace: "nowrap"
              }}
              variant='outlined'
            />
            <Button
              className='ml-5'
              sx={{
                px: "1.5rem",
                ml: "1.25rem",
                fontSize: "inherit",
                textTransform: "none",
                whiteSpace: "nowrap"
              }}
              variant='outlined'
              onClick={handleOnExtendClick}
            >
              Детальніше
            </Button>
          </div>
          {children}
        </div>
      </div>
    </>
  );
}