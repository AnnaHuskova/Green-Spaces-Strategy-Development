import { Table, TableHead, TableBody, TableCell, TableRow } from '@mui/material';
import React from 'react';
import { GreenArea } from '../../pages';
import {area as getArea } from "@turf/turf";

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
    return areaFeature.properties.status === true;
  });
  const areasUnsup = areas.filter((areaFeature) => {
    return areaFeature.properties.status === false;
  });
  let surfaceSupTotal:number = 0;
  for (const areaFeature of areasSup) {
    surfaceSupTotal = surfaceSupTotal + getArea(areaFeature);
  }
  areaStats.push({
    categoryName: "Registered",
    quantity: areasSup.length,
    surface: Math.round(surfaceSupTotal),
  })

  let surfaceUnsupTotal:number = 0;
  for (const areaFeature of areasUnsup) {
    surfaceUnsupTotal = surfaceUnsupTotal + getArea(areaFeature);
  }
  areaStats.push({
    categoryName: "Not registered",
    quantity: areasUnsup.length,
    surface: Math.round(surfaceUnsupTotal),
  })

  areaStats.push({
    categoryName: "Total",
    quantity: areas.length,
    surface: Math.round(surfaceSupTotal + surfaceUnsupTotal),
  })

  return <Table aria-label='Green area statistic' className="" size="small" >
    <TableHead>
      <TableRow>
        <TableCell>Area type</TableCell>
        <TableCell align="right">Quantity</TableCell>
        <TableCell align="right">Total surface&nbsp;(m<sup>2</sup>)</TableCell>
      </TableRow> 
    </TableHead>
    <TableBody>
 {areaStats.map((areaCategory) => (
            <TableRow
              key={areaCategory.categoryName}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {areaCategory.categoryName}
              </TableCell>
              <TableCell align="right">{areaCategory.quantity}</TableCell>
              <TableCell align="right">{areaCategory.surface}</TableCell>
            </TableRow>
          ))}
    </TableBody>
  </Table>;
}