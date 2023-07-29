import { useState } from 'react';
import { FormControlLabel, Stack, Switch, Typography } from '@mui/material';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import buildings from '../../assets/geo/Poligons_byHeritageBuildins.json';
import buildingsAll from '../../assets/geo/Poligons_allBuildings.json';

const Map = () => {
	const [viewAll, setViewAll] = useState(true);
	const [vieHistorical, setViewHistorical] = useState(true);

	const onEachBuilding = (building: any, layer: any) => {
		layer.bindPopup(`
			<b>ID:</b> ${building?.properties?.fid}
			<br/>
			<b>Назва:</b> ${building?.properties?.name}
			<br/>
			<b>Тип:</b> ${building?.properties?.type}
		`);
	};
	
	const onEachBuildingAll = (building: any, layer: any) => {
		layer.bindPopup('Не може бути ОКС');
	};

	return (
		<>
			<MapContainer
				center={[48.51874159685502, 34.61350377087257]}
				zoom={12}
				style={{ height: 'calc(100% - 64px)', width: '100%'}}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				{viewAll && (<GeoJSON
					key='all'
					data={{...buildingsAll, type: 'FeatureCollection'}}
					onEachFeature={onEachBuildingAll}
				/>)}
				{vieHistorical && (<GeoJSON
					key='heritage'
					data={{...buildings, type: 'FeatureCollection'}}
					onEachFeature={onEachBuilding}
					style={{ color: 'red', fillColor: 'red', fillOpacity: 0.5 }}
				/>)}
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
				<FormControlLabel
					control={
						<Switch
							size="small"
							checked={viewAll}
							onChange={(event) => setViewAll(event.target.checked)}
						/>}
					label={
						<Typography
							variant="body2"
							color="text.primary"
							sx={{ ml: 1 }}
						>
							Відобразити всі
						</Typography>}
				/>
				<FormControlLabel
					control={
						<Switch
							size="small"
							checked={vieHistorical}
							onChange={(event) => setViewHistorical(event.target.checked)}
						/>}
					label={
						<Typography
							variant="body2"
							color="text.primary"
							sx={{ ml: 1 }}
						>
							Відобразити історичні будівлі
						</Typography>}
				/>
			</Stack>
		</>
	);
};

export { Map };
