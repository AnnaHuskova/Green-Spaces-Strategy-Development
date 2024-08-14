import React, {useEffect, useState, useCallback} from 'react';
import GlMap, { Source, Layer, NavigationControl, GeolocateControl, FullscreenControl, ScaleControl, AttributionControl, MapMouseEvent, MapLayerMouseEvent, MapGeoJSONFeature, Marker /*PopupEvent, Popup as MaplibrePopup*/ } from 'react-map-gl/maplibre';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FormGroup, FormLabel } from '@mui/material';

import { Feature, FeatureCollection } from 'geojson';
import MapLegend from "../../components/MapLegend";
import MapLegendSwitch from '../../components/MapLegendItem';
import AreaInfo from '../../components/AreaInfo';
import AreaInfoExtended from '../../components/AreaInfoExtended';
import MapSourceSwitch from '../../components/MapSourceSwitch';
import MapAreaStats from '../../components/MapAreaStats';
import AreaFilterRadio from '../../components/AreaFilterRadio';
import { featureCollection } from '@turf/turf';
import { ExpressionFilterSpecification, ExpressionSpecification } from 'maplibre-gl';

import marker from "../../assets/images/marker-icon.png";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfigRaw from "../../tailwind.config.js";
const twConfig = resolveConfig(tailwindConfigRaw); //for access to palette directly from TS

enum LANDTYPES {
  forestPark = "Лісопарк",
  park = "Парк",
  square = "Сквер",
  allee = "Алея",
  boulevard = "Бульвар",
  unknown = "не визначено"
};

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
    landStatus: boolean, //чи є об'єктом благоустрою
    landType: typeof LANDTYPES, //тип зеленої зони
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
  landType: { [key in keyof typeof LANDTYPES]: boolean
    // forestPark: boolean,
    // park: boolean,
    // square: boolean,
    // allee: boolean,
    // boulevard: boolean,
    // undefined: boolean
  }
}

function HomePage({greenAreas, districts}: HomePageProps) {

  type AreaInfo = {
    lat: number, 
    lng: number,
    data: MapGeoJSONFeature | null,
    extended: boolean,
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
    extended: false,
  });
  const [showMapLegend, toggleShowMapLegend] = useState(true); //change to false later

  const [additionalFilter, setAdditionalFilter] = useState<AddFilter>({
    maintained: {
      true: true,
      false: true,
    },
    landType: {
      forestPark: true,
      park: true,
      square: true,
      allee: true,
      boulevard: true,
      unknown: true
    }
  });

  function constructAdditionalFilter() {
    const filterArray:(boolean|ExpressionSpecification)[] = []
    for(const filteredGroup in additionalFilter) {
      const filterCategory:ExpressionFilterSpecification = ["any"]
      for(const filteredValue in (additionalFilter as Record<string, any>)[filteredGroup]) {
        if (((additionalFilter as Record<string, any>)[filteredGroup] as Record<string, boolean>)[filteredValue] === true) {
          let typedValue; 
          if(filteredValue === "true" || filteredValue === "false") {
            typedValue = filteredValue === "true"? true : false;
          }
          else {
            if(filteredGroup === "landType") {
              typedValue = LANDTYPES[filteredValue as keyof typeof LANDTYPES];
            }
            else {
              typedValue = filteredValue;
            } 
          }
          filterCategory.push(['==', ['get', filteredGroup], typedValue])
        }
      }
      filterArray.push(filterCategory);
    }
    console.log(filterArray)
    return filterArray;
  }
  const [filterSelected, setFilterSelected] = useState("");

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

  const onEnterPointable = useCallback(() => setCursorType(CURSOR_TYPE.POINTER), []);
  const onLeavePointable = useCallback(() => setCursorType(CURSOR_TYPE.AUTO), []);

  function onAreaClick(event: MapMouseEvent):void {
    const layerEvent = event as MapLayerMouseEvent;
    if (layerEvent.features && layerEvent.features.length > 0) {
      const feature: MapGeoJSONFeature = layerEvent.features[0];
      setAreaInfo({
        lat: event.lngLat.lat,
        lng: event.lngLat.lng,
        data: feature,
        extended: false,
      });
    }
    else {
      setAreaInfo({
        lat: 0,
        lng: 0,
        data: null,
        extended: false,
      });
    }
  }

  function onFilterClick(event: React.MouseEvent<HTMLInputElement, MouseEvent>):void {
    const radioClicked = event.currentTarget.value;
    if(filterSelected === radioClicked) {
      setFilterSelected("");
    }
    else {
      setFilterSelected(radioClicked);
    }
    
    // console.log("boop")
  }

  function toggleAreaExtend(event: React.MouseEvent) {
    const curAreaInfo:AreaInfo = {...areaInfo};
    setAreaInfo( {
      lat: curAreaInfo.lat,
      lng: curAreaInfo.lng,
      data: curAreaInfo.data,
      extended: !(curAreaInfo.extended)
    });
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
            'fill-color': (twConfig.theme.colors as unknown as Record<string, string>)["areasProtected"],//'#3ABEFF',
            'fill-opacity': 0.5
          }}
          filter={['all', ['==', ['get', 'landStatus'], true], ...constructAdditionalFilter()]}
        />}
        {showInteractiveLayers.Unsupervised && <Layer
          id='areas-unsupervised'
          key='areas-unsupervised'
          type='fill'
          paint={{
            'fill-color': (twConfig.theme.colors as unknown as Record<string, string>)["areasUnprotected"],//'#D84797',
            'fill-opacity': 0.5
          }}
          filter={['all', ['==', ['get', 'landStatus'], false], ...constructAdditionalFilter()]}
        />}
      </Source>
          
      <NavigationControl position='top-right' />
      <GeolocateControl
        positionOptions={{ enableHighAccuracy: true }}
        trackUserLocation={true}
        position='top-right'
      />
      <FullscreenControl position='top-right' />
      <ScaleControl maxWidth={180} unit="metric" />
      <AttributionControl
        compact={false}
        customAttribution={availableStyles[style].customAttribution /*'Фонова мапа: © <a href="https://openstreetmap.org.ua/#tile-server" target=_blank>🇺🇦 Українська спільнота OpenStreetMap</a>'*/}
        position="bottom-right"
      />
      {showMapLegend && <MapLegend style="absolute top-28 left-0 min-h-14 min-w-14 bg-white  bg-opacity-75   py-6 px-4 rounded-xl shadow-sm">
        <div className='flex flex-row'>
          <AreaFilterRadio
            onClick={onFilterClick}
            selected = {filterSelected}
          >
          </AreaFilterRadio>

          {filterSelected !== "" && 
          <FormGroup aria-label='Green area types' className='ml-5' >
            <FormLabel>Area types</FormLabel>
            <MapLegendSwitch
              active={showInteractiveLayers.Supervised}
              controls="Supervised"
              label="Supervised"
              color={(twConfig.theme.colors as unknown as Record<string, string>)["areasProtected"]}
              onToggleActive={toggleLayer}
            />
            <MapLegendSwitch
              active={showInteractiveLayers.Unsupervised}
              controls="Unsupervised"
              label="Not supervised"
              color={(twConfig.theme.colors as unknown as Record<string, string>)["areasUnprotected"]}
              onToggleActive={toggleLayer}
            />
            <MapLegendSwitch
              active={additionalFilter.maintained.true}  
              controls="maintained-true"
              label="На балансі"
              onToggleActive={toggleLayerProperty}
            />
            <MapLegendSwitch
              active={additionalFilter.maintained.false}
              controls="maintained-false"
              label="Не утримується"
              onToggleActive={toggleLayerProperty}
            />
            {Object.keys(additionalFilter.landType).map( (type) => {
              return <MapLegendSwitch
                active={additionalFilter.landType[type as unknown as keyof typeof LANDTYPES]}
                controls={`landType-${type}`}
                label={LANDTYPES[type as unknown as keyof typeof LANDTYPES]}
                onToggleActive={toggleLayerProperty}
              />
            })}
            
            <MapSourceSwitch sources={availableStyles} selectedSource={style} onSetSource={setStyle} />
          </FormGroup>
          }
        </div>
        
      </MapLegend>}
      <MapAreaStats areas={greenAreas}></MapAreaStats>
      {areaInfo.data && areaInfo.extended === false &&
        <AreaInfo latitude={areaInfo.lat} longtitude={areaInfo.lng} data={areaInfo.data as Feature as GreenArea} onExtend={toggleAreaExtend} />
      }
      {areaInfo.data && areaInfo.extended === true &&
        <>
          <Marker latitude={areaInfo.lat} longitude={areaInfo.lng} anchor="bottom">
            <img src={marker} />
          </Marker>
          <AreaInfoExtended latitude={areaInfo.lat} longtitude={areaInfo.lng} data={areaInfo.data as Feature as GreenArea} onExtend={toggleAreaExtend} />
        </>    
      }
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
