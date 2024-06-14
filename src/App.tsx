import { Route, Routes, Navigate } from 'react-router-dom';
import {useEffect, useState} from 'react';
import { MainLayout } from './layouts';
import { HomePage, AboutPage, SavePage, BlogPage } from './pages';
import { HomePageProps, GreenArea } from './pages';

import areasDnipro from './assets/green_areas.json';
import districtsDnipro from './assets/geo/Boroughs.json';
import { Feature } from 'geojson';

function App() {
  const[city, setCity] = useState<string>("Dnipro");
  const[cityData, setCityData] = useState<HomePageProps|undefined>(undefined);

  useEffect(() => {
    //TODO data fetch from backend here!
    setCityData({
      greenAreas: areasDnipro.features as GreenArea[],
      districts: districtsDnipro.features as Feature[],
    })
  }, [city]);

	return (
		<Routes>
			<Route path='/' element={<MainLayout />}>
				{cityData && <Route index element={<HomePage greenAreas={cityData.greenAreas} districts={cityData.districts} />} />}
				<Route path='/about' element={<AboutPage />} />
				<Route path='/save' element={<SavePage />} />
				<Route path='/blog' element={<BlogPage />} />
			</Route>
			<Route path="*" element={<Navigate to='/' replace />} />
		</Routes>
	);
}

export default App;
