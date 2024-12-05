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
  
  return <div className="relative flex bg-white bg-opacity-75 px-3 py-1 rounded-xl lg:bg-opacity-0 lg:p-0 flex-row max-w-60 lg:max-w-3xl h-13 mx-auto mt-3 lg:mt-11 justify-between font-sans pointer-events-none" >
    {areaStats.map((areaCategory) => (
      <div className='inline-block lg:block basis-48 bg-white bg-opacity-0 lg:bg-opacity-75 lg:px-3 lg:py-1 lg:rounded-xl pointer-events-auto' key={areaCategory.categoryName}>
        <span className='block text-center text-2xl'>
          <span className='font-bold'>{areaCategory.quantity}</span>
          <span className='hidden lg:inline'> | {Math.round(areaCategory.surface / 10000)}</span>
          <span className='hidden lg:inline font-bold text-xs'> га</span>
        </span>
        <div className='lg:flex justify-between items-end h-3 p-0 lg:px-7'>
          <label className='block lg:hidden text-[9px]/[9px] w-fit m-auto'>{areaCategory.categoryNameShort}</label>
          <label className='hidden lg:inline text-xs'>{areaCategory.categoryName}</label>
          <svg viewBox='0 0 7 7' className='hidden lg:block w-3 h-3 fill-[#94A3B8]'>
            <title>Help!</title>
              <use href={icons + "#info"}></use>
            </svg>
        </div> 
      </div>
    ))}
  </div>;
}