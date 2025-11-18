import { Feature } from "geojson";
import * as turf from "@turf/turf";

// свойства точки
export interface HeatPointProperties {
  temperature: number;
  surface?: string;
  condition?: string;
  temp_air?: string;
  hum?: string;
  PM2_5?: string;
  PM10?: string;
  particles?: string;
  AQI?: string;
  xcoord?: string;
  ycoord?: string;
  zcoord?: string;
  groupName?: string;
  data?: string;
}

// одна точка
export type HeatPoint = Feature<turf.Point, HeatPointProperties>;

// группа точек
export interface HeatPointGroup {
  id: string;
  groupName: string;
  pointsCount: number;
  heatPoints: HeatPoint[];
}

// ответ API
export interface HeatPointsData {
  groups: HeatPointGroup[];
}


