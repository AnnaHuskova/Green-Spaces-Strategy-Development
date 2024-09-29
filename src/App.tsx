import { Route, Routes, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Favicon from 'react-favicon';
import envVars from "./js/env";
import { MainLayout } from './layouts';
import { HomePage, AboutPage, SavePage, BlogPage } from './pages';
import { HomePageProps, GreenArea } from './pages';
import useMetaTag from './hooks/useMetaTag';
import { ReactComponent as Logo } from './assets/images/favicon.svg';
import ReactDOMServer from 'react-dom/server';
import { Feature } from 'geojson';
import { PathLike } from 'fs';

const BACKEND_URL: PathLike = envVars.REACT_APP_BACKEND_URL as string;
const DISTRICTS_ENDPOINT: string = envVars.REACT_APP_DISTRICTS_ENDPOINT as string;
const AREAS_ENDPOINT: string = envVars.REACT_APP_AREAS_ENDPOINT as string;

interface AreaData {
  area: GreenArea[]
}

interface DistrictData {
  district: Feature[],
}

interface FetchResponse {
  code: number,
  data?: AreaData | DistrictData,
  message?: string,
  status: string,
}

// Convert SVG to data URL
const svgToDataURL = (svg: React.FunctionComponent<React.SVGProps<SVGSVGElement>>): string => {
  const svgElement = new DOMParser().parseFromString(ReactDOMServer.renderToStaticMarkup(<Logo />), 'image/svg+xml').documentElement;
  const svgString = new XMLSerializer().serializeToString(svgElement);
  return `data:image/svg+xml;base64,${btoa(svgString)}`;
};

const faviconUrl = svgToDataURL(Logo);

const useMeta = () => {
  useMetaTag('description', 'Green Spaces Strategy Development — проєкт націлений на розбдову сталого навколишнього середовища та підвищення якості життя мешканців міста Дніпро.');
  useMetaTag('keywords', 'Green Spaces Strategy Development, Dnipro, зелені зони, зелені території, зелені насадження, зелені насадження міста Дніпро, зелені зони міста Дніпро, зелені території міста Дніпро, зелені насадження Дніпро, зелені зони Дніпро, зелені території Дніпро');
};

function App() {
  const [city, setCity] = useState<string>("Dnipro");
  const [cityData, setCityData] = useState<HomePageProps | undefined>(undefined);

  useEffect(() => {
    const fetchCityData = async (city: string): Promise<boolean> => {
      try {
        const resDistricts = await fetch(`${BACKEND_URL}${DISTRICTS_ENDPOINT}`);
        const resDis = await resDistricts.json() as FetchResponse;
        const resAreas = await fetch(`${BACKEND_URL}${AREAS_ENDPOINT}`);
        const resAreasJson = await resAreas.json() as FetchResponse;

        if (resAreasJson.code === 200 && resDis.code === 200) {
          setCityData({
            greenAreas: (resAreasJson.data as AreaData).area,
            districts: (resDis.data as DistrictData).district,
          });
          return true;
        }
      } catch (error) {
        console.error("Failed to fetch city data:", error);
      }
      return false;
    };

    fetchCityData(city);
  }, [city]);

  useMeta();

  return (
    <>
      <Favicon url={faviconUrl} />
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