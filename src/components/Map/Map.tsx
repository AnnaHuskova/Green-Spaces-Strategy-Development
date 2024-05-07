import React, { useState, useEffect, useRef } from 'react';
import { renderToString } from 'react-dom/server';
// import { useNavigate } from 'react-router-dom';
import { FormControlLabel, Stack, Switch, Typography } from '@mui/material';
// import { MapContainer, TileLayer, GeoJSON, Marker, Popup } from 'react-leaflet';
import { Popup } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
// import { Icon } from 'leaflet'
// import 'leaflet/dist/leaflet.css';
// import buildings from '../../assets/geo/Poligons_byHeritageBuildins.json';
// import buildingsAll from '../../assets/geo/Poligons_allBuildings.json';
// import memorials from '../../assets/geo/Memorials.json';
// import monuments from '../../assets/geo/Monuments.json';
// import greenAreas from '../../assets/geo/Green_Areas.json';
import areasDnipro from '../../assets/geo/All_Green_Areas_Dnipro_withAtributes.json';
import boroughs from '../../assets/geo/Boroughs.json';
import { FeatureCollection } from 'geojson';
// import assets from '../../assets';


// const Map = () => {
// 	// const [showAll, setShowAll] = useState(true);
// 	// const [showHistorical, setShowHistorical] = useState(true);
// 	// const [showMemorials, setShowMemorials] = useState(true);
// 	// const [showMonuments, setShowMonuments] = useState(true);
// 	// const [showGreenAreas, setShowGreenAreas] = useState(true);

// 	// const navigate = useNavigate();

// 	const onEachArea = (item: any, layer: any) => {
// 		const popupContent = renderToString(
// 			<div>
// 				<b>ID:</b> {item?.properties?.ID}
// 				<br/>
// 				<b>Title:</b> {item?.properties?.NAME}
// 				<br/>
// 				<b>Accessibility for target groups:</b> {Boolean(item?.properties['Accessibility for target groups']) ? 'Yes' : 'No'}
// 				<br/>
// 				<b>Functions (mental and physical recuperation):</b> {Boolean(item?.properties['Functions (mental and physical recuperation)']) ? 'Yes' : 'No'}
// 			</div>
// 		);

// 		layer.bindPopup(popupContent);
// 	};
	
// 	// const onEachBuildingAll = (building: any, layer: any) => {
// 	// 	layer.bindPopup('Не може бути ОКС');
// 	// };

// 	const [distrToShow, setDistrToShow] = useState([
// 		{ title: 'Soborniy District', show: true },
// 		{ title: 'Shevchenkivsky district', show: true },
// 		{ title: 'Samarsky District', show: true },
// 		{ title: 'Novokodatskiy District', show: true },
// 		{ title: 'Industrial region', show: true },
// 		{ title: 'Chechelivsky District', show: true },
// 		{ title: 'Central District', show: true },
// 		{ title: 'Amur-Nijnodniprovsky district', show: true }
// 	])

// 	return (
// 		<>
// 			<MapContainer
// 				center={[48.4701, 35.0064]} // Dnipro center
// 				zoom={12}
// 				style={{ height: 'calc(100% - 64px)', width: '100%'}}
// 			>
// 				<TileLayer
// 					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// 					// url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// 					url="https://tile.openstreetmap.org.ua/styles/positron-gl-style/{z}/{x}/{y}.png"
// 				/>
// 				{/* {showAll && (<GeoJSON
// 					key='all'
// 					data={{...buildingsAll, type: 'FeatureCollection'}}
// 					onEachFeature={onEachBuildingAll}
// 				/>)}
// 				{showHistorical && (<GeoJSON
// 					key='heritage'
// 					data={{...buildings, type: 'FeatureCollection'}}
// 					onEachFeature={onEachBuilding}
// 					style={{ color: 'red', fillColor: 'red', fillOpacity: 0.5 }}
// 				/>)} */}
// 				<GeoJSON
// 					key='boroughs'
// 					data={{...boroughs, type: 'FeatureCollection'}}
// 					style={{ color: '#05668D', fillColor: '#F3FAE1', fillOpacity: 0.25, weight: 2}}
// 				/>
// 				<GeoJSON
// 					key={JSON.stringify(distrToShow)}
// 					data={{...areasDnipro, type: 'FeatureCollection'}}
// 					onEachFeature={onEachArea}
// 					// style={{ color: 'green', fillColor: 'green', fillOpacity: 0.5 }}
// 					style={(feature) => {
// 						if (feature?.properties['On budget'] === true) {
// 							return { color: '#3ABEFF', fillColor: '#3ABEFF', fillOpacity: 0.5, weight: 2 };
// 						} else {
// 							return { color: '#D84797', fillColor: '#D84797', fillOpacity: 0.5, weight: 2 };
// 						}
// 					}}

// 					filter={f => distrToShow.some((i) => f.properties['Administrative region'] === i.title && i.show === true)}
// 				/>
// 				{/* {showMemorials && memorials.features.map(item => (
// 					<Marker
// 						key={item.properties.fid}
// 						position={[item.geometry.coordinates[1], item.geometry.coordinates[0]]}
// 						icon={new Icon({
// 							iconUrl: assets.images.markerDefault,
// 							shadowUrl: assets.images.shadowDefault,
// 							iconSize: [25, 41],
// 							iconAnchor: [12, 41]
// 						})}
// 					>
// 						<Popup>
// 							<b>ID:</b> {item?.properties?.fid}
// 							<br/>
// 							<b>Назва:</b> {item?.properties?.name}
// 							<div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
// 								<button className="btn-save" onClick={() => navigate('/save')}>Подати заявку</button>
// 							</div>
// 						</Popup>
// 					</Marker>
// 				))}
// 				{showMonuments && monuments.features.map(item => (
// 					<Marker
// 						key={item.properties.fid}
// 						position={[item.geometry.coordinates[1], item.geometry.coordinates[0]]}
// 						icon={new Icon({
// 							iconUrl: assets.images.markerMonument,
// 							shadowUrl: assets.images.shadowDefault,
// 							iconSize: [25, 41],
// 							iconAnchor: [12, 41]
// 						})}
// 					>
// 						<Popup>
// 							<b>ID:</b> {item?.properties?.fid}
// 							<br/>
// 							<b>Назва:</b> {item?.properties?.name}
// 							<div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
// 								<button className="btn-save" onClick={() => navigate('/save')}>Подати заявку</button>
// 							</div>
// 						</Popup>
// 					</Marker>
// 				))} */}
// 			</MapContainer>
// 			<Stack
// 				rowGap={1}
// 				sx={{
// 					flexDirection: 'column',
// 					position: 'absolute',
// 					zIndex: 10000, 
// 					bottom: '10px',
// 					left: '10px',
// 					p: 2,
// 					bgcolor: '#fff',
// 					borderRadius: '8px'
// 				}}
// 			>
// 				{distrToShow.map(d => (
// 					<FormControlLabel
// 						key={d.title}
// 						control={<Switch size="small" checked={d.show} onChange={(event) => {
// 							const elIndex = distrToShow.findIndex((i) => i.title === d.title);
// 							const updatedEl = { ...d, show: event.target.checked };
// 							const updatedArr = distrToShow.slice();
// 							updatedArr.splice(elIndex, 1, updatedEl);
// 							setDistrToShow(updatedArr);
// 						}} />}
// 						label={<Typography variant="body2" sx={{ ml: 1 }}>{d.title}</Typography>}
// 					/>
// 				))}

// 					{/* <FormControlLabel
// 						control={<Switch size="small" checked={showAll} onChange={(event) => setShowAll(event.target.checked)} />}
// 						label={<Typography variant="body2" sx={{ ml: 1 }}>Відобразити всі</Typography>}
// 					/>
// 					<FormControlLabel
// 						control={<Switch size="small" checked={showHistorical} onChange={(event) => setShowHistorical(event.target.checked)}/>}
// 						label={<Typography variant="body2" sx={{ ml: 1 }}>Відобразити історичні будівлі</Typography>}
// 					/>
// 					<FormControlLabel
// 						control={<Switch size="small" checked={showMemorials} onChange={(event) => setShowMemorials(event.target.checked)}/>}
// 						label={<Typography variant="body2" sx={{ ml: 1 }}>Відобразити мемореали</Typography>}
// 					/>
// 					<FormControlLabel
// 						control={<Switch size="small" checked={showMonuments} onChange={(event) => setShowMonuments(event.target.checked)}/>}
// 						label={<Typography variant="body2" sx={{ ml: 1 }}>Відобразити монументи</Typography>}
// 					/>
// 					<FormControlLabel
// 						control={<Switch size="small" checked={showGreenAreas} onChange={(event) => setShowGreenAreas(event.target.checked)}/>}
// 						label={<Typography variant="body2" sx={{ ml: 1 }}>Відобразити ландшафтно-рекреаційні зони</Typography>}
// 					/> */}
// 			</Stack>
// 		</>
// 	);
// };

const Map = () => {
  const mapContainer = useRef(null);
  const [style, setStyle] = useState('https://tile.openstreetmap.org.ua/styles/positron-gl-style/style.json');
  const [showSupervised, toggleShowSupervised] = useState(true);
  const [showUnsupervised, toggleShowSupervise] = useState(true);


	
  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current || '',
      style: style,
      // style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [35.0064, 48.4701],
      zoom: 10,
      maxBounds: new maplibregl.LngLatBounds([
        [34.6064, 48.3301],
        [35.4064, 48.6001],
      ]),
      attributionControl: false,
    });

    map.on('load', () => {
      map.addSource('boroughs', {
        'type': 'geojson',
        'data': boroughs as FeatureCollection
      });

      map.addLayer({
        'id': 'boroughs-outline',
        'type': 'line',
        'source': 'boroughs',
        'layout': {},
        'paint': {
          'line-color': '#05668D',
          'line-width': 2
        }
      });

      map.addSource('areasDnipro', {
        'type': 'geojson',
        'data': areasDnipro as FeatureCollection
      });

      map.addLayer({
        'id': 'areasDnipro-on-budget',
        'type': 'fill',
        'source': 'areasDnipro',
        'layout': {},
        'paint': {
          'fill-color': '#3ABEFF',
          'fill-opacity': 0.5
        },
        'filter': ['==', ['get', 'On budget'], true]
      });

      map.addLayer({
        'id': 'areasDnipro-off-budget',
        'type': 'fill',
        'source': 'areasDnipro',
        'layout': {},
        'paint': {
          'fill-color': '#D84797',
          'fill-opacity': 0.5
        },
        'filter': ['==', ['get', 'On budget'], false]
      });

      map.addControl(new maplibregl.NavigationControl(), 'top-left');
      map.addControl(new maplibregl.GeolocateControl({ positionOptions: { enableHighAccuracy: true }, trackUserLocation: true }), 'top-left');
      map.addControl(new maplibregl.FullscreenControl(), 'top-left');
      map.addControl(new maplibregl.ScaleControl({ maxWidth: 180, unit: 'metric' }));
      map.addControl(new maplibregl.AttributionControl({
        compact: false,
        customAttribution: 'Фонова мапа: © <a href="https://openstreetmap.org.ua/#tile-server" target=_balnk>🇺🇦 Українська спільнота OpenStreetMap</a>'
      }), 'bottom-right');
    });

    let currentPopup: maplibregl.Popup | null = null;

    ['areasDnipro-on-budget', 'areasDnipro-off-budget'].forEach(layer => {
      map.on('mouseenter', layer, () => {
        map.getCanvas().style.cursor = 'pointer';
      });
		
      map.on('mouseleave', layer, () => {
        map.getCanvas().style.cursor = '';
      });

      map.on('click', layer, (e) => {
        if (e.features?.length) {
          const feature = e.features[0];

          if (currentPopup) {
            currentPopup.remove();
            currentPopup = null;
          } else {
            currentPopup = new maplibregl.Popup()
              .setLngLat(e.lngLat)
              .setHTML(`
							<b>Номер:</b> ${feature.properties.ID}<br>
							<b>Назва:</b> ${feature.properties.NAME}<br>
							<b>Площа:</b> ${(feature.properties.площадь / 10000).toFixed(2)} га<br>
							<b>Доступність для цільових груп:</b> ${Boolean(feature.properties['Accessibility for target groups']) ? 'Так' : 'Ні'}<br>
							<b>Функції (психологічне та фізичне відновлення):</b> ${Boolean(feature.properties['Functions (mental and physical recuperation)']) ? 'Так' : 'Ні'}<br>
						`)
              .addTo(map);
          }
        }
      });
    });


    // Create a new HTML element for the legend
    const legend = document.createElement('div');
    legend.id = 'legend';
    legend.style.position = 'absolute';
    legend.style.top = '10px';
    legend.style.right = '10px';
    legend.style.backgroundColor = 'white';
    legend.style.padding = '10px';
    legend.style.borderRadius = '5px';
    legend.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';

    // Add content to the legend
    let isOnBudgetVisible = true;
    let isOffBudgetVisible = true;

    const onBudgetItem = document.createElement('div');
    onBudgetItem.style.cursor = 'pointer';
    onBudgetItem.addEventListener('click', () => {
      if (isOnBudgetVisible) {
        onBudgetItem.innerHTML = `<span style="background-color: #8CDDFB; opacity: 0.5; display: inline-block; width: 10px; height: 10px;"></span> Supervised`;
        map.setLayoutProperty('areasDnipro-on-budget', 'visibility', 'none');
      } else {
        onBudgetItem.innerHTML = `<span style="background-color: #3ABEFF; opacity: 0.5; display: inline-block; width: 15px; height: 15px;"></span> Supervised`;
        map.setLayoutProperty('areasDnipro-on-budget', 'visibility', 'visible');
      }
      isOnBudgetVisible = !isOnBudgetVisible;
    });

    // Set initial state
    onBudgetItem.innerHTML = `<span style="background-color: #3ABEFF; opacity: 0.5; display: inline-block; width: 15px; height: 15px;"></span> Supervised`;

    const offBudgetItem = document.createElement('div');
    offBudgetItem.style.cursor = 'pointer';
    offBudgetItem.addEventListener('click', () => {
      if (isOffBudgetVisible) {
        offBudgetItem.innerHTML = `<span style="background-color: #EBA2CA; opacity: 0.5; display: inline-block; width: 10px; height: 10px;"></span> Not Supervised`;
        map.setLayoutProperty('areasDnipro-off-budget', 'visibility', 'none');
      } else {
        offBudgetItem.innerHTML = `<span style="background-color: #D84797; opacity: 0.5; display: inline-block; width: 15px; height: 15px;"></span> Not Supervised`;
        map.setLayoutProperty('areasDnipro-off-budget', 'visibility', 'visible');
      }
      isOffBudgetVisible = !isOffBudgetVisible;
    });

		
    offBudgetItem.innerHTML = `<span style="background-color: #D84797; opacity: 0.5; display: inline-block; width: 15px; height: 15px;"></span> Not Supervised`;
		
    legend.appendChild(onBudgetItem);
    legend.appendChild(offBudgetItem);
		
    // Append the legend to the map's container
    map.getContainer().appendChild(legend);

    return () => map.remove();
  }, []);
  
  const legendStyle = {
    //position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'white',
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
  }

  return <div ref={mapContainer} style={{ height: 'calc(100% - 64px)', width: '100%' }}>
    <div id='legend' style={{ ...legendStyle, position: 
      "absolute"
    }} >
      Test
      </div>
  </div>

}

export { Map };
