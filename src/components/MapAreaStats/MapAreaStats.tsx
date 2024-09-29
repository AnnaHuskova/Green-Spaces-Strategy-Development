// import { Table, TableHead, TableBody, TableCell, TableRow } from '@mui/material';
import React from 'react';
import { GreenArea } from '../../pages';
import {area as getArea } from "@turf/turf";
import icons from "../../assets/images/icons.svg"

interface MapAreaStatsProps {
  areas: GreenArea[];
  children?: React.ReactNode,
}

type AreaStats = {
  categoryName: string,
  categoryNameShort: string,
  quantity: number,
  surface: number,
}

export function MapAreaStats({ areas, children }: MapAreaStatsProps) {
  const areaStats: AreaStats[] = [];
  const areasSup = areas.filter((areaFeature) => {
    return areaFeature.properties.landStatus === true;
  });
  const areasUnsup = areas.filter((areaFeature) => {
    return areaFeature.properties.landStatus === false;
  });
  let surfaceSupTotal:number = 0;
  for (const areaFeature of areasSup) {
    surfaceSupTotal = surfaceSupTotal + getArea(areaFeature);
  }
  let surfaceUnsupTotal:number = 0;
  for (const areaFeature of areasUnsup) {
    surfaceUnsupTotal = surfaceUnsupTotal + getArea(areaFeature);
  }

  areaStats.push({
    categoryName: "всі зелені зони",
    categoryNameShort: "всі",
    quantity: areas.length,
    surface: Math.round(surfaceSupTotal + surfaceUnsupTotal),
  })

  areaStats.push({
    categoryName: "на балансі",
    categoryNameShort: "на балансі",
    quantity: areasSup.length,
    surface: Math.round(surfaceSupTotal),
  })

  areaStats.push({
    categoryName: "не на балансі",
    categoryNameShort: "не захищені",
    quantity: areasUnsup.length,
    surface: Math.round(surfaceUnsupTotal),
  })

  // console.log(icons)
  
  return <div className=" bg-white bg-opacity-75 px-3 py-1 rounded-xl md:bg-opacity-0 md:p-0 relative flex flex-row max-w-60 md:max-w-3xl h-13 mx-auto mt-3 md:mt-11 justify-between font-sans pointer-events-none" >
    {areaStats.map((areaCategory) => (
      <div className='inline-block md:block basis-48 bg-white bg-opacity-0 md:bg-opacity-75 md:px-3 md:py-1 md:rounded-xl pointer-events-auto' key={areaCategory.categoryName}>
        <span className='block text-center text-2xl'>
          <span className='font-bold'>{areaCategory.quantity}</span>
          <span className='hidden md:inline'> | {Math.round(areaCategory.surface / 10000)}</span>
          <span className='hidden md:inline font-bold text-xs'> га</span>
        </span>
        <div className='md:flex justify-between items-end h-3 p-0 md:px-7'>
          <label className='block md:hidden text-[9px]/[9px] w-fit m-auto'>{areaCategory.categoryNameShort}</label>
          <label className='hidden md:inline text-xs'>{areaCategory.categoryName}</label>
          <svg viewBox='0 0 7 7' className='hidden md:block w-3 h-3 fill-[#94A3B8]'>
            <title>Help!</title>
              <use href={icons + "#info"}></use>
            </svg>
        </div> 
      </div>
    ))}
  </div>;
}