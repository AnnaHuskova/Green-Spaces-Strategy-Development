import React, {useEffect, useState, useCallback} from 'react';
import GlMap, { Source, Layer, NavigationControl, GeolocateControl, FullscreenControl, ScaleControl, AttributionControl, MapMouseEvent, MapLayerMouseEvent, MapGeoJSONFeature, /*PopupEvent, Popup as MaplibrePopup*/ } from 'react-map-gl/maplibre';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Feature, FeatureCollection } from 'geojson';
import MapLegend from "../../components/MapLegend";
import MapLegendSwitch from '../../components/MapLegendItem';
import AreaInfo from '../../components/AreaInfo';
import MapSourceSwitch from '../../components/MapSourceSwitch';
import MapAreaStats from '../../components/MapAreaStats';
import { featureCollection } from '@turf/turf';
import { ExpressionFilterSpecification, ExpressionSpecification } from 'maplibre-gl';

const contStyle = {
	display: "flex",
	width: "calc(100%)",
  height: "90%"
}

interface GreenArea extends Feature {
  properties: {
    id: string, //ідентифікатор об'єкта (за даним міськради)
    name: string, //назва зеленої зони (назва парку, скверу або інший топонім, що має статус обʼєкта благоустрою)
    description: string, //опис зеленої зони (за рішеннями міськради)
    status: boolean, //чи є об'єктом благоустрою
    maintained: boolean, //чи утримується з бюджету міста
    owner?: string, //балансоутримувач (назва комунального підприємства, що опікується обʼєктом)
    //area: string, //площа об'єкта в м² (в майбутньому площа має обчислюватись за наявної геометрії на льоту)
    adm4?: string, //адміністративний район, в межах якого зона
    "Accessibility for target groups"?: boolean,
    "Functions (mental and physical recuperation)"?: boolean,
  }
}

interface HomePageProps {
  greenAreas: GreenArea[],
  districts: Feature[],
}

interface MapStyle {
  name: string,
  url: URL,
  customAttribution?: string,
};

//first style is the default one
const mapStyles: MapStyle[] = [
  {
    name: "OSM-UA Positron",
    url: new URL(`https://tile.openstreetmap.org.ua/styles/positron-gl-style/style.json`),
    customAttribution: `Фонова мапа: © <a href="https://openstreetmap.org.ua/#tile-server" target=_blank>🇺🇦 Українська спільнота OpenStreetMap</a>`,
  },
  {
    name: "CartoCDN Positron",
    url: new URL(`https://basemaps.cartocdn.com/gl/positron-gl-style/style.json`),
  },
  {
    name: "CartoCDN Dark Matter",
    url: new URL(`https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json`),
  },
];

const CURSOR_TYPE = {
  AUTO: "auto",
  POINTER: "pointer",
};

interface AddFilter {
  maintained: {
    true: boolean,
    false: boolean,
  },
  zoneType: {
    forestPark: boolean,
    park: boolean,
    square: boolean,
    allee: boolean,
    boulevard: boolean
  }
}

const zoneTypeFilters = {
  forestPark: [],
  park: [],
  square: [],
  allee: [],
  boulevard: []
}

function HomePage({greenAreas, districts}: HomePageProps) {

  type AreaInfo = {
    lat: number, 
    lng: number,
    data: MapGeoJSONFeature | null,
  };

  const showSourceError = (message:string):void => {
    toast.error(`${message}`, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  }

  const [availableStyles, setAvailableStyles] = useState<MapStyle[]>(mapStyles);
  const [style, setStyle] = useState(0);
  const [cursorType, setCursorType] = useState(CURSOR_TYPE.AUTO);
  const [styleJson, setStyleJson] = useState(null);
  const [interactiveLayerIds, setInteractiveLayerIds] = useState<string[]>(['nonexist']);
  const [showInteractiveLayers, toggleShowInteractiveLayers] = useState({
    Supervised: true,
    Unsupervised: true,
  });
  const [areaInfo, setAreaInfo] = useState<AreaInfo>({
    lat: 0,
    lng: 0,
    data: null,
  });
  const [showMapLegend, toggleShowMapLegend] = useState(true); //change to false later

  const [additionalFilter, setAdditionalFilter] = useState<AddFilter>({
    maintained: {
      true: true,
      false: true,
    },
    zoneType: {
      forestPark: true,
      park: true,
      square: true,
      allee: true,
      boulevard: true
    }
  });

  function constructAdditionalFilter() {
    const filterArray:(boolean|ExpressionSpecification)[] = []
    for(const filteredGroup in additionalFilter) {
      const filterCategory:ExpressionFilterSpecification = ["any"]
      for(const filteredValue in (additionalFilter as Record<string, any>)[filteredGroup]) {
        if(filteredGroup !== "zoneType") {
          if (((additionalFilter as Record<string, any>)[filteredGroup] as Record<string, boolean>)[filteredValue] === true) {
            let typedValue; 
            if(filteredValue === "true" || filteredValue === "false") {
              typedValue = filteredValue === "true"? true : false;
            }
            else {
              typedValue = filteredValue;
            }
            filterCategory.push(['==', ['get', filteredGroup], typedValue])
          }
        }
        else {
          filterCategory.push(true); //FIXME
        }
      }
      filterArray.push(filterCategory);
    }
    console.log(filterArray)
    return filterArray;
  }

  //fetch default style for first render
  useEffect(() => {
      async function fetchStyle() {
        let response:Response|undefined = undefined;
        try {
          response = await fetch(availableStyles[style].url);
        }
        catch(error) {
          const typedError = error as TypeError;
          if(typedError.name === "TypeError" && typedError.message.includes("NetworkError")) {
            showSourceError(`Unable to load background style ${availableStyles[style].name}`);
          }
          else {
            console.log(error);
          }
        }
        finally {
          if(response === undefined) {
            if(style +1 < availableStyles.length) {
              setStyle(style+1); //switch to next map source
              return;
            }
            else {
              showSourceError("Cannot resolve background source");
              return;
            }
          }
          const jsonData = await response.json();
          setStyleJson(jsonData);
        }
        
      };

      fetchStyle();    
    }, [style, availableStyles]);

  useEffect(() => {
    const activeLayers: string[] = [];
    if (showInteractiveLayers.Supervised) {
      activeLayers.push('areas-supervised');
    }
    if (showInteractiveLayers.Unsupervised) {
      activeLayers.push('areas-unsupervised');
    }

    setInteractiveLayerIds(activeLayers);
  }, [showInteractiveLayers]
  );

  const onEnterPointable = useCallback(() => setCursorType(CURSOR_TYPE.POINTER), [CURSOR_TYPE.POINTER]);
  const onLeavePointable = useCallback(() => setCursorType(CURSOR_TYPE.AUTO), [CURSOR_TYPE.AUTO]);

  function onAreaClick(event: MapMouseEvent):void {
    const layerEvent = event as MapLayerMouseEvent;
    if (layerEvent.features && layerEvent.features.length > 0) {
      const feature: MapGeoJSONFeature = layerEvent.features[0];
      setAreaInfo({
        lat: event.lngLat.lat,
        lng: event.lngLat.lng,
        data: feature,
      });
    }
    else {
      setAreaInfo({
        lat: 0,
        lng: 0,
        data: null,
      });
    }
  }

  const toggleLayer: React.ChangeEventHandler = (event) => {
    const layerName: "Supervised"|"Unsupervised" = event.currentTarget.id === "Supervised"? "Supervised" : "Unsupervised";
    const newLayers = showInteractiveLayers;  
    newLayers[layerName] = !newLayers[layerName];
    toggleShowInteractiveLayers({ ...newLayers });
  }

  const toggleLayerProperty:React.ChangeEventHandler = (event) => {
    const[filteredGroup, filteredProperty] = event.currentTarget.id.split('-');
    const currentFilter = {...additionalFilter};
    try {
      const currentValue:boolean = ((currentFilter as Record<string, any>)[filteredGroup] as Record<string, boolean>)[filteredProperty];
      ((currentFilter as Record<string, any>)[filteredGroup] as Record<string, boolean>)[filteredProperty] = !currentValue;
      setAdditionalFilter(currentFilter);
    }
    catch(error) {
      console.error(error);
    }
  }

	return <div className="relative w-full h-[80vh]">
    {styleJson ? <GlMap
      initialViewState={{
        longitude: 35.0064,
        latitude: 48.4701,
        zoom: 10
      }}
      interactive={true}
      interactiveLayerIds={interactiveLayerIds}
      onMouseEnter={onEnterPointable}
      onMouseLeave={onLeavePointable}
      onClick={onAreaClick}
      cursor={cursorType}
      maxBounds={[
        [34.6064, 48.3301],
        [35.4064, 48.6001],
      ]}
      attributionControl={false}
      mapStyle={styleJson}>
      <Source
        type='geojson'
        data={featureCollection(districts)}>
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
        data={featureCollection(greenAreas) as FeatureCollection}>
        {showInteractiveLayers.Supervised && <Layer
          id='areas-supervised'
          key='areas-supervised'
          type='fill'
          paint={{
            'fill-color': '#3ABEFF',
            'fill-opacity': 0.5
          }}
          filter={['all', ['==', ['get', 'status'], true], ...constructAdditionalFilter()]}
        />}
        {showInteractiveLayers.Unsupervised && <Layer
          id='areas-unsupervised'
          key='areas-unsupervised'
          type='fill'
          paint={{
            'fill-color': '#D84797',
            'fill-opacity': 0.5
          }}
          filter={['all', ['==', ['get', 'status'], false], ...constructAdditionalFilter()]}
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
        customAttribution={availableStyles[style].customAttribution /*'Фонова мапа: © <a href="https://openstreetmap.org.ua/#tile-server" target=_blank>🇺🇦 Українська спільнота OpenStreetMap</a>'*/}
        position="bottom-right"
      />
      {showMapLegend && <MapLegend>
        <MapLegendSwitch
          active={showInteractiveLayers.Supervised}
          controls="Supervised"
          label="Supervised"
          color='#3ABEFF'
          onToggleActive={toggleLayer}
        />
        <MapLegendSwitch
          active={showInteractiveLayers.Unsupervised}
          controls="Unsupervised"
          label="Not supervised"
          color='#D84797'
          onToggleActive={toggleLayer}
        />
        <MapLegendSwitch
          active={additionalFilter.maintained.true}  
          controls="maintained-true"
          label="На балансі"
          // color='#3ABEFF'
          onToggleActive={toggleLayerProperty}
        />
        <MapLegendSwitch
          active={additionalFilter.maintained.false}
          controls="maintained-false"
          label="Не утримується"
          // color='#3ABEFF'
          onToggleActive={toggleLayerProperty}
        />
        <MapLegendSwitch
          active={additionalFilter.zoneType.forestPark}
          controls="zoneType-forestPark"
          label="Лісопарк"
          // color='#3ABEFF'
          onToggleActive={toggleLayerProperty}
        />
        <MapLegendSwitch
          active={additionalFilter.zoneType.park}
          controls="zoneType-park"
          label="Парк"
          // color='#3ABEFF'
          onToggleActive={toggleLayerProperty}
        />
        <MapLegendSwitch
          active={additionalFilter.zoneType.square}
          controls="zoneType-square"
          label="Сквер"
          // color='#3ABEFF'
          onToggleActive={toggleLayerProperty}
        />
        <MapLegendSwitch
          active={additionalFilter.zoneType.allee}
          controls="zoneType-allee"
          label="Алея"
          // color='#3ABEFF'
          onToggleActive={toggleLayerProperty}
        />
        <MapLegendSwitch
          active={additionalFilter.zoneType.boulevard}
          controls="zoneType-boulevard"
          label="Бульвар"
          // color='#3ABEFF'
          onToggleActive={toggleLayerProperty}
        />
        <MapAreaStats areas={greenAreas} />
        <MapSourceSwitch sources={availableStyles} selectedSource={style} onSetSource={setStyle} />
      </MapLegend>}
      {areaInfo.data &&
        <AreaInfo latitude={areaInfo.lat} longtitude={areaInfo.lng} data={areaInfo.data as Feature as GreenArea} />}
      <ToastContainer />
    </GlMap> : "Loading"}
	</div>
};

export {
  HomePage,
};
export type {
  MapStyle as MapStyleType,
  HomePageProps,
  GreenArea,
}
