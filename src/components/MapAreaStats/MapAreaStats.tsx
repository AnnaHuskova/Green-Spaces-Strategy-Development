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
    quantity: areas.length,
    surface: Math.round(surfaceSupTotal + surfaceUnsupTotal),
  })

  areaStats.push({
    categoryName: "на балансі",
    quantity: areasSup.length,
    surface: Math.round(surfaceSupTotal),
  })

  areaStats.push({
    categoryName: "не на балансі",
    quantity: areasUnsup.length,
    surface: Math.round(surfaceUnsupTotal),
  })

  // console.log(icons)
  
  return <div className="relative flex flex-row max-w-3xl h-13 mx-auto mt-11 justify-between font-sans" >
    {areaStats.map((areaCategory) => (
      <div className='basis-48 bg-white bg-opacity-75 px-3 py-1 rounded-xl'>
        <span className='block text-center text-2xl'>
          <span className='font-bold'>{areaCategory.quantity}</span> | {Math.round(areaCategory.surface / 10000)}
          <span className='font-bold text-xs'> га</span>
        </span>
        <div className='flex justify-between items-end px-7'>
          <label className='text-xs'>{areaCategory.categoryName}</label>
          <svg viewBox='0 0 7 7' className=' w-3 h-3 fill-[#94A3B8]'>
            <title>Help!</title>
              <use href={icons + "#info"}></use>
            </svg>
        </div> 
      </div>
    ))}
  </div>;
}