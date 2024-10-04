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
  maintenance: {
    maintained: boolean,
    unmaintained: boolean,
  },
  landStatus: {
    supervised: boolean,
    unsupervised: boolean,
  }
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
  // const [showInteractiveLayers, toggleShowInteractiveLayers] = useState({
  //   Supervised: true,
  //   Unsupervised: true,
  // });
  const [areaInfo, setAreaInfo] = useState<AreaInfo>({
    lat: 0,
    lng: 0,
    data: null,
    extended: false,
  });
  const [showMapLegend, toggleShowMapLegend] = useState(true); //change to false later

  const [zoneFilter, setZoneFilter] = useState<AddFilter>({
    maintenance: {
      maintained: true,
      unmaintained: true,
    },
    landStatus: {
      supervised: true,
      unsupervised: true,
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

  function constructAdditionalFilter(mainFilter:string) {
    const filterArray:(boolean|ExpressionSpecification)[] = []
    for(const filteredGroup in zoneFilter) {
      if(filteredGroup === mainFilter) {
        continue;
      }
      const filterCategory:ExpressionFilterSpecification = ["any"]
      for(const filteredValue in (zoneFilter as Record<string, any>)[filteredGroup]) {
        if (((zoneFilter as Record<string, any>)[filteredGroup] as Record<string, boolean>)[filteredValue] === true) {
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
    // console.log(filterArray)
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
    if (zoneFilter.maintenance.maintained) {
      activeLayers.push('areas-maintained');
    }
    if (zoneFilter.maintenance.unmaintained) {
      activeLayers.push('areas-unmaintained');
    }

    setInteractiveLayerIds(activeLayers);
  }, [zoneFilter]
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

  function toggleAreaExtend(event: React.MouseEvent) {
    const curAreaInfo:AreaInfo = {...areaInfo};
    setAreaInfo( {
      lat: curAreaInfo.lat,
      lng: curAreaInfo.lng,
      data: curAreaInfo.data,
      extended: !(curAreaInfo.extended)
    });
  }

  function onFilterClick(event: React.MouseEvent<HTMLInputElement, MouseEvent>):void {
    const radioClicked = event.currentTarget.value;
    if(filterSelected === radioClicked) {
      setFilterSelected("");
    }
    else {
      setFilterSelected(radioClicked);
    }
  }

  // const toggleLayer: React.ChangeEventHandler = (event) => {
  //   const layerName: "maintained"|"unmaintained" = event.currentTarget.id === "maintained"? "maintained" : "unmaintained";
  //   const newFilter = {...zoneFilter};  
  //   newFilter.maintenance[layerName] = !newFilter.maintenance[layerName];
  //   setZoneFilter(newFilter)
  //   //toggleShowInteractiveLayers({ ...newLayers });
  // }

  const toggleLayerProperty:React.ChangeEventHandler = (event) => {
    const[filteredGroup, filteredProperty] = event.currentTarget.id.split('-');
    const currentFilter = {...zoneFilter};
    try {
      const currentValue:boolean = ((currentFilter as Record<string, any>)[filteredGroup] as Record<string, boolean>)[filteredProperty];
      ((currentFilter as Record<string, any>)[filteredGroup] as Record<string, boolean>)[filteredProperty] = !currentValue;
      setZoneFilter(currentFilter);
    }
    catch(error) {
      console.error(error);
    }
  }

	return <div className="md:relative w-full h-[calc(100vh-48px-52px)] md:h-[calc(100vh-56px-112px)]">
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
            'line-width': 1
          }}
        />
      </Source>
          
      <Source
        type='geojson'
        data={featureCollection(greenAreas) as FeatureCollection}>
        {zoneFilter.maintenance.maintained && <Layer
          id='areas-maintained'
          key='areas-maintained'
          type='fill'
          paint={{
            'fill-color': (twConfig.theme.colors as unknown as Record<string, string>)["areasProtected"],//'#3ABEFF',
            'fill-opacity': 0.7
          }}
          filter={['all', ['==', ['get', 'maintained'], true], ...constructAdditionalFilter("maintenance")]}
        />}
        {zoneFilter.maintenance.unmaintained && <Layer
          id='areas-unmaintained'
          key='areas-unmaintained'
          type='fill'
          paint={{
            'fill-color': (twConfig.theme.colors as unknown as Record<string, string>)["areasUnprotected"],//'#D84797',
            'fill-opacity': 0.7
          }}
          filter={['all', ['==', ['get', 'maintained'], false], ...constructAdditionalFilter("maintenance")]}
        />}
      </Source>

      <NavigationControl position='top-right' />
      <GeolocateControl
        positionOptions={{ enableHighAccuracy: true }}
        trackUserLocation={true}
        position='top-right'
      />
      <FullscreenControl position='top-right' />
      <AttributionControl
        compact={false}
        customAttribution={availableStyles[style].customAttribution /*'Фонова мапа: © <a href="https://openstreetmap.org.ua/#tile-server" target=_blank>🇺🇦 Українська спільнота OpenStreetMap</a>'*/}
        position="bottom-right"
      />
      <ScaleControl maxWidth={180} unit="metric" position='bottom-right'/>
      {showMapLegend && <MapLegend style="fixed max-md:bottom-0 md:absolute md:top-28 left-0 w-full md:w-auto md:min-h-14 min-w-14 md:max-h-[calc(100%-28px)] overflow-y-scroll bg-white bg-opacity-75 md:py-6 md:px-4 md:rounded-xl shadow-sm">
        <div className='flex flex-row overflow-y-auto px-6 py-1.5 md:p-0 font-sans'>
          <AreaFilterRadio
            onClick={onFilterClick}
            selected = {filterSelected}
          >
          </AreaFilterRadio>

          {filterSelected !== "" && 
          <FormGroup aria-label='Green area types' className='ml-5' >
            <FormLabel>Area types</FormLabel>
            <ul className="list-none">
              <MapLegendSwitch
                active={zoneFilter.landStatus.supervised}
                controls="landStatus-supervised"
                key="landStatus-supervised"
                label="Є об'єктом благоустрою"
                color="areasProtected"
                onToggleActive={toggleLayerProperty}
              />
              <MapLegendSwitch
                active={zoneFilter.landStatus.unsupervised}
                controls="landStatus-unsupervised"
                key="landStatus-unsupervised"
                label="Не є об'єктом благоустрою"
                color="areasUnprotected"
                onToggleActive={toggleLayerProperty}
              />
              <MapLegendSwitch
                active={zoneFilter.maintenance.maintained}  
                controls="maintenance-maintained"
                key="maintenance-maintained"
                label="На балансі"
                onToggleActive={toggleLayerProperty}
              />
              <MapLegendSwitch
                active={zoneFilter.maintenance.unmaintained}
                controls="maintenance-unmaintained"
                key="maintenance-unmaintained"
                label="Не утримується"
                onToggleActive={toggleLayerProperty}
              />
              {Object.keys(zoneFilter.landType).map( (type) => {
                return <MapLegendSwitch
                  active={zoneFilter.landType[type as unknown as keyof typeof LANDTYPES]}
                  controls={`landType-${type}`}
                  key={`landType-${type}`}
                  label={LANDTYPES[type as unknown as keyof typeof LANDTYPES]}
                  onToggleActive={toggleLayerProperty}
              />
              })}
            </ul>
            
            <MapSourceSwitch sources={availableStyles} selectedSource={style} onSetSource={setStyle} />
          </FormGroup>
          }
        </div>
        
      </MapLegend>}
      <MapAreaStats areas={greenAreas}></MapAreaStats>
      {areaInfo.data && areaInfo.extended === false &&
        <AreaInfo latitude={areaInfo.lat} longitude={areaInfo.lng} data={areaInfo.data as Feature as GreenArea} onExtend={toggleAreaExtend} />
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
