import { Map } from '../../components';
import {useEffect, useState, useCallback} from 'react';
import GlMap, {Source, Layer, NavigationControl, GeolocateControl, FullscreenControl, ScaleControl,AttributionControl} from 'react-map-gl/maplibre';
//data imports
import areasDnipro from '../../assets/geo/All_Green_Areas_Dnipro_withAtributes.json';
import districtsDnipro from '../../assets/geo/Boroughs.json';
import { FeatureCollection } from 'geojson';
import type { FillLayer } from 'react-map-gl/maplibre';

const contStyle = {
	display: "flex",
	width: "calc(100%)",
  height: "90%"
}

// const districts: FillLayer = {
  
// }

function HomePage() {
  const CURSOR_TYPE = {
    AUTO: "auto",
    POINTER: "pointer,"
  }

  const [style, setStyle] = useState('https://tile.openstreetmap.org.ua/styles/positron-gl-style/style.json');
  const [cursorType, setCursorType] = useState(CURSOR_TYPE.AUTO);
  const [styleJson, setStyleJson] = useState(null);
  const [interactiveLayerIds, setInteractiveLayerIds] = useState<string[]>(['nonexist']);
  const [showSupervised, toggleShowSupervised] = useState(true);
  const [showUnsupervised, toggleShowSupervise] = useState(true);

  useEffect(() => {
    const activeLayers: string[] = [];
    if (showSupervised) {
      activeLayers.push('areas-supervised');
    }
    if (showUnsupervised) {
      activeLayers.push('areas-unsupervised');
    }

    setInteractiveLayerIds(activeLayers);
  }, [showSupervised, showUnsupervised]
  );

	useEffect(() => {
		async function fetchStyle() {
			const response = await fetch(style);
    		const jsonData = await response.json();
			setStyleJson(jsonData);
		};

		fetchStyle();
  }, [style]);
  
  const onEnterPointable = useCallback(() => {
    setCursorType(CURSOR_TYPE.POINTER);
  }, []);
  const onLeavePointable = useCallback(() => {
    setCursorType(CURSOR_TYPE.AUTO);
  }, []);

  const onMouseEnter = useCallback(() => setCursorType('pointer'), []);
  const onMouseLeave = useCallback(() => setCursorType('auto'), []);

	return <div style={contStyle}>
			<Map />
			
    {styleJson ? <GlMap
      initialViewState={{
        longitude: 35.0064,
        latitude: 48.4701,
        zoom: 10
      }}
      interactive={true}
      interactiveLayerIds={interactiveLayerIds}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      //style={contStyle}
      cursor={cursorType}
      maxBounds={[
        [34.6064, 48.3301],
        [35.4064, 48.6001],
      ]}
      attributionControl={false}
      mapStyle={styleJson}>
      <Source
        type='geojson'
        data={districtsDnipro as FeatureCollection}>
        <Layer
          id='districts-outline'
          type='line'
          paint={{
            'line-color': '#05668D',
            'line-width': 2
          }}
        />
      </Source>
          
      <Source
        type='geojson'
        data={areasDnipro as FeatureCollection}>
        {showSupervised && <Layer
          id='areas-supervised'
          key='areas-supervised'
          type='fill'
          paint={{
            'fill-color': '#3ABEFF',
            'fill-opacity': 0.5
          }}
          filter={['==', ['get', 'On budget'], true]}
        />}
        {showUnsupervised && <Layer
          id='areas-unsupervised'
          key='areas-unsupervised'
          type='fill'
          paint={{
            'fill-color': '#D84797',
            'fill-opacity': 0.5
          }}
          filter={['==', ['get', 'On budget'], false]}
        />}
      </Source>
          
      <NavigationControl position='top-left' />
      <GeolocateControl
        positionOptions={{ enableHighAccuracy: true }}
        trackUserLocation={true}
        position='top-left'
      />
      <FullscreenControl position='top-left' />
      <ScaleControl maxWidth={180} unit="metric" />
      <AttributionControl
        compact={false}
        customAttribution={'Фонова мапа: © <a href="https://openstreetmap.org.ua/#tile-server" target=_blank>🇺🇦 Українська спільнота OpenStreetMap</a>'}
        position="bottom-right"
      />
      <span style={{position: "absolute", top:"10px", right:"10px"}}>Boo!</span>
    //   ('div');
    // legend.id = 'legend';
    // legend.style.position = 'absolute';
    // legend.style.top = '10px';
    // legend.style.right = '10px';
    // legend.style.backgroundColor = 'white';
    // legend.style.padding = '10px';
    // legend.style.borderRadius = '5px';
    // legend.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)'
      </GlMap>
			:"Loading"}
    
		</div>
};

export { HomePage };
