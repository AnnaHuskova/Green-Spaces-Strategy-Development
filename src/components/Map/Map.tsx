import { useState } from 'react';
import { renderToString } from 'react-dom/server';
// import { useNavigate } from 'react-router-dom';
import { FormControlLabel, Stack, Switch, Typography } from '@mui/material';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
// import { Icon } from 'leaflet'
import 'leaflet/dist/leaflet.css';
// import buildings from '../../assets/geo/Poligons_byHeritageBuildins.json';
// import buildingsAll from '../../assets/geo/Poligons_allBuildings.json';
// import memorials from '../../assets/geo/Memorials.json';
// import monuments from '../../assets/geo/Monuments.json';
// import greenAreas from '../../assets/geo/Green_Areas.json';
import areasDnipro from '../../assets/geo/All_Green_Areas_Dnipro_withAtributes.json';
// import assets from '../../assets';

const Map = () => {
	// const [showAll, setShowAll] = useState(true);
	// const [showHistorical, setShowHistorical] = useState(true);
	// const [showMemorials, setShowMemorials] = useState(true);
	// const [showMonuments, setShowMonuments] = useState(true);
	// const [showGreenAreas, setShowGreenAreas] = useState(true);

	// const navigate = useNavigate();

	const onEachBuilding = (building: any, layer: any) => {
		const popupContent = renderToString(
			<div>
				<b>ID:</b> {building?.properties?.ID}
				<br/>
				<b>Title:</b> {building?.properties?.NAME}
				<br/>
				<b>Accessibility for target groups:</b> {Boolean(building?.properties['Accessibility for target groups']) ? 'Yes' : 'No'}
				<br/>
				<b>Accessibility for target groups:</b> {Boolean(building?.properties['Functions (mental and physical recuperation)']) ? 'Yes' : 'No'}
			</div>
		);

		layer.bindPopup(popupContent);
	};
	
	// const onEachBuildingAll = (building: any, layer: any) => {
	// 	layer.bindPopup('Не може бути ОКС');
	// };

	const [distrToShow, setDistrToShow] = useState([
		{ title: 'Soborniy District', show: true },
		{ title: 'Shevchenkivsky district', show: true },
		{ title: 'Samarsky District', show: true },
		{ title: 'Novokodatskiy District', show: true },
		{ title: 'Industrial region', show: true },
		{ title: 'Chechelivsky District', show: true },
		{ title: 'Central District', show: true },
		{ title: 'Amur-Nijnodniprovsky district', show: true }
	])

	return (
		<>
			<MapContainer
				center={[48.46246647370338, 35.067802577337154]}
				zoom={12}
				style={{ height: 'calc(100% - 64px)', width: '100%'}}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{/* {showAll && (<GeoJSON
					key='all'
					data={{...buildingsAll, type: 'FeatureCollection'}}
					onEachFeature={onEachBuildingAll}
				/>)}
				{showHistorical && (<GeoJSON
					key='heritage'
					data={{...buildings, type: 'FeatureCollection'}}
					onEachFeature={onEachBuilding}
					style={{ color: 'red', fillColor: 'red', fillOpacity: 0.5 }}
				/>)} */}
				<GeoJSON
					key={JSON.stringify(distrToShow)}
					data={{...areasDnipro, type: 'FeatureCollection'}}
					onEachFeature={onEachBuilding}
					style={{ color: 'green', fillColor: 'green', fillOpacity: 0.5 }}
					filter={f => distrToShow.some((i) => f.properties['Administrative region'] === i.title && i.show === true)}
				/>
				{/* {showMemorials && memorials.features.map(item => (
					<Marker
						key={item.properties.fid}
						position={[item.geometry.coordinates[1], item.geometry.coordinates[0]]}
						icon={new Icon({
							iconUrl: assets.images.markerDefault,
							shadowUrl: assets.images.shadowDefault,
							iconSize: [25, 41],
							iconAnchor: [12, 41]
						})}
					>
						<Popup>
							<b>ID:</b> {item?.properties?.fid}
							<br/>
							<b>Назва:</b> {item?.properties?.name}
							<div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
								<button className="btn-save" onClick={() => navigate('/save')}>Подати заявку</button>
							</div>
						</Popup>
					</Marker>
				))}
				{showMonuments && monuments.features.map(item => (
					<Marker
						key={item.properties.fid}
						position={[item.geometry.coordinates[1], item.geometry.coordinates[0]]}
						icon={new Icon({
							iconUrl: assets.images.markerMonument,
							shadowUrl: assets.images.shadowDefault,
							iconSize: [25, 41],
							iconAnchor: [12, 41]
						})}
					>
						<Popup>
							<b>ID:</b> {item?.properties?.fid}
							<br/>
							<b>Назва:</b> {item?.properties?.name}
							<div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
								<button className="btn-save" onClick={() => navigate('/save')}>Подати заявку</button>
							</div>
						</Popup>
					</Marker>
				))} */}
			</MapContainer>
			<Stack
				rowGap={1}
				sx={{
					flexDirection: 'column',
					position: 'absolute',
					zIndex: 10000, 
					bottom: '10px',
					left: '10px',
					p: 2,
					bgcolor: '#fff',
					borderRadius: '8px'
				}}
			>
				{distrToShow.map(d => (
					<FormControlLabel
						key={d.title}
						control={<Switch size="small" checked={d.show} onChange={(event) => {
							const elIndex = distrToShow.findIndex((i) => i.title === d.title);
							const updatedEl = { ...d, show: event.target.checked };
							const updatedArr = distrToShow.slice();
							updatedArr.splice(elIndex, 1, updatedEl);
							setDistrToShow(updatedArr);
						}} />}
						label={<Typography variant="body2" sx={{ ml: 1 }}>{d.title}</Typography>}
					/>
				))}

					{/* <FormControlLabel
						control={<Switch size="small" checked={showAll} onChange={(event) => setShowAll(event.target.checked)} />}
						label={<Typography variant="body2" sx={{ ml: 1 }}>Відобразити всі</Typography>}
					/>
					<FormControlLabel
						control={<Switch size="small" checked={showHistorical} onChange={(event) => setShowHistorical(event.target.checked)}/>}
						label={<Typography variant="body2" sx={{ ml: 1 }}>Відобразити історичні будівлі</Typography>}
					/>
					<FormControlLabel
						control={<Switch size="small" checked={showMemorials} onChange={(event) => setShowMemorials(event.target.checked)}/>}
						label={<Typography variant="body2" sx={{ ml: 1 }}>Відобразити мемореали</Typography>}
					/>
					<FormControlLabel
						control={<Switch size="small" checked={showMonuments} onChange={(event) => setShowMonuments(event.target.checked)}/>}
						label={<Typography variant="body2" sx={{ ml: 1 }}>Відобразити монументи</Typography>}
					/>
					<FormControlLabel
						control={<Switch size="small" checked={showGreenAreas} onChange={(event) => setShowGreenAreas(event.target.checked)}/>}
						label={<Typography variant="body2" sx={{ ml: 1 }}>Відобразити ландшафтно-рекреаційні зони</Typography>}
					/> */}
			</Stack>
		</>
	);
};

export { Map };
