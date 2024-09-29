import { Route, Routes, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Favicon from 'react-favicon';
import envVars from "./js/env";
import { MainLayout } from './layouts';
import { HomePage, AboutPage, SavePage, BlogPage } from './pages';
import { HomePageProps, GreenArea } from './pages';

import assets from './assets';
import useMetaTag from './hooks/useMetaTag';

import areasDnipro from './assets/green_areas.json';
import districtsDnipro from './assets/geo/Boroughs.json';
import { Feature } from 'geojson';
import { PathLike } from 'fs';

const BACKEND_URL:PathLike = envVars.REACT_APP_BACKEND_URL as string;
const DISTRICTS_ENDPOINT:string = envVars.REACT_APP_DISTRICTS_ENDPOINT as string;
const AREAS_ENDPOINT:string = envVars.REACT_APP_AREAS_ENDPOINT as string;

interface areaData {
  area: GreenArea[]
}

interface districtData {
  district: Feature[],
}

interface fetchResponse {
  code: number,
  data?: areaData|districtData,
  message?: string,
  status: string,
}

function App() {
  const[city, setCity] = useState<string>("Dnipro");
  const[cityData, setCityData] = useState<HomePageProps|undefined>(undefined);

  useEffect(() => {
    async function fetchCityData(city:string):Promise<boolean> {
      const res_districts:Response = await fetch(`${BACKEND_URL}${DISTRICTS_ENDPOINT}`);
      const res_Dis = await res_districts.json() as fetchResponse;
      const res_areas:Response = await fetch(`${BACKEND_URL}${AREAS_ENDPOINT}`);
      const res_Areas = await res_areas.json() as fetchResponse;
      if(res_Areas.code === 200 && res_Dis.code === 200) {
        setCityData({
          greenAreas: (res_Areas.data as areaData).area,
          districts: (res_Dis.data as districtData).district,
        });       
        return true;

      }
      //TODO error handling here

      //fallback to use when fetch fails
      /*setCityData({
        greenAreas: areasDnipro.features as GreenArea[],
        districts: districtsDnipro.features as Feature[],
      });*/
      return false;
    }
    
    fetchCityData(city);
  }, [city]);

function useMeta() {
  useMetaTag('description', 'Green Spaces Strategy Development — проєкт націлений на розбдову сталого навколишнього середовища та підвищення якості життя мешканців міста Дніпро.');
  useMetaTag('keywords', 'Green Spaces Strategy Development, Dnipro, зелені зони, зелені території, зелені насадження, зелені насадження міста Дніпро, зелені зони міста Дніпро, зелені території міста Дніпро, зелені насадження Дніпро, зелені зони Дніпро, зелені території Дніпро');

}

  const favicons = assets.images.logo;

  return (
    <>
    { useMeta() }
    <Favicon url={ favicons } />
		<Routes>
			<Route path='/' element={<MainLayout />}>
				{cityData && <Route index element={<HomePage greenAreas={cityData.greenAreas} districts={cityData.districts} />} />}
				<Route path='/about' element={<AboutPage />} />
				<Route path='/save' element={<SavePage />} />
				<Route path='/blog' element={<BlogPage />} />
			</Route>
			<Route path="*" element={<Navigate to='/' replace />} />
		</Routes>
    </>
	);
}

export default App;
