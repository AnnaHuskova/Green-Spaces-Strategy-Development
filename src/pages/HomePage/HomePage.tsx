import React, {useEffect, useState, useMemo, useCallback} from 'react';
import GlMap, { Source, Layer, NavigationControl, GeolocateControl, FullscreenControl, ScaleControl, AttributionControl, MapMouseEvent, MapLayerMouseEvent, MapGeoJSONFeature, Marker /*PopupEvent, Popup as MaplibrePopup*/ } from 'react-map-gl/maplibre';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Feature, FeatureCollection } from 'geojson';
import MapLegend from "../../components/MapLegend";
import { BufferToggle } from "../../components/MapLegendItem";
import AreaInfo from '../../components/AreaInfo';
import AreaInfoExtended from '../../components/AreaInfoExtended';
import MapSourceSwitch from '../../components/MapSourceSwitch';
import MapAreaStats from '../../components/MapAreaStats';
import AreaFilterRadio from '../../components/AreaFilterRadio';
import { featureCollection, buffer } from '@turf/turf';
import { ExpressionFilterSpecification, ExpressionSpecification } from 'maplibre-gl';

import marker from "../../assets/images/marker-icon.png";
import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfigRaw from "../../tailwind.config.js";
import ButtonExpand from '../../components/ButtonExpand';
const twConfig = resolveConfig(tailwindConfigRaw); //for access to palette directly from TS

enum LANDTYPES {
  forestPark = "Лісопарк",
  park = "Парк",
  square = "Сквер",
  allee = "Алея",
  boulevard = "Бульвар",
  unknown = "не визначено"
};

function getLandTypeKey(value: LANDTYPES): keyof typeof LANDTYPES {
  return Object.keys(LANDTYPES).find(
    key => LANDTYPES[key as keyof typeof LANDTYPES] === value
  ) as keyof typeof LANDTYPES;
};

interface GreenArea extends Feature {
  properties: {
    id: string, //ідентифікатор об'єкта (за даним міськради)
    name: string, //назва зеленої зони (назва парку, скверу або інший топонім, що має статус обʼєкта благоустрою)
    description: string, //опис зеленої зони (за рішеннями міськради)
    landStatus: boolean, //чи є об'єктом благоустрою
    landType: LANDTYPES, //тип зеленої зони
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

// Map styles configuration
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

// Cursor types for map interaction
const CURSOR_TYPE = { 
  AUTO: "auto",
  POINTER: "pointer",
};


interface ZoneFilter {
  landStatus: {
    supervised: boolean,
    unsupervised: boolean,
  },
  maintenance: {
    maintained: boolean,
    unmaintained: boolean,
  },
  landType: { [key in keyof typeof LANDTYPES]: boolean
  }
}

//buffer area for each land type, used for area statistics
const BUFFER_RADII: Record<string, number> = {
  [LANDTYPES.park]: 1000,
  [LANDTYPES.square]: 500,
  [LANDTYPES.forestPark]: 1000,
  [LANDTYPES.allee]: 500,
  [LANDTYPES.boulevard]: 500,
  [LANDTYPES.unknown]: 500,
};

function getFilteredGreenAreas(greenAreas: GreenArea[], zoneFilter: ZoneFilter): GreenArea[] {
  return greenAreas.filter(area => {
    // landType
    if (!zoneFilter.landType[getLandTypeKey(area.properties.landType)]) return false;
    // landStatus
    if (area.properties.landStatus && !zoneFilter.landStatus.supervised) return false;
    if (!area.properties.landStatus && !zoneFilter.landStatus.unsupervised) return false;
    // maintenance
    if (area.properties.maintained && !zoneFilter.maintenance.maintained) return false;
    if (!area.properties.maintained && !zoneFilter.maintenance.unmaintained) return false;
    return true;
  });
};

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
  const [areaInfo, setAreaInfo] = useState<AreaInfo>({
    lat: 0,
    lng: 0,
    data: null,
    extended: false,
  });
  const [showMapLegend, toggleShowMapLegend] = useState(true); //change to false later

  const [zoneFilter, setZoneFilter] = useState<ZoneFilter>({
    maintenance: { //budget
      maintained: true,
      unmaintained: true,
    },
    landStatus: { //recognized as a park
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

  const [showBuffers, setShowBuffers] = useState(true); // show buffers

  const filteredGreenAreas = useMemo(
    () => getFilteredGreenAreas(greenAreas, zoneFilter),
    [greenAreas, zoneFilter]
  );

 const bufferFeatures = useMemo(() => {
    if (!filteredGreenAreas) return featureCollection([]);
    return featureCollection(
      filteredGreenAreas
        .filter(area => area.geometry)
        .map(area => {
          const radius = BUFFER_RADII[area.properties.landType] || 500;
          return buffer(area, radius, { units: 'meters' });
        })
    );
  }, [filteredGreenAreas]);
  
  function constructAdditionalFilter(mainFilter:string) {
    const filterArray:(boolean|ExpressionSpecification)[] = [];
    for(const filterGroup in zoneFilter) {
      if(filterGroup === mainFilter) {
        continue;
      }
      const filterCategory:ExpressionFilterSpecification = ["any"]
      for(const filteredValue in (zoneFilter as Record<string, any>)[filterGroup]) {
        let typedValue;
        if (((zoneFilter as Record<string, any>)[filterGroup] as Record<string, boolean>)[filteredValue] === true) {
          switch (filterGroup) {
            case "landType": {
              typedValue = LANDTYPES[filteredValue as keyof typeof LANDTYPES];
              break;
            }
            case "landStatus": {
              if(filteredValue === "supervised") {
                typedValue = true;
              }
              else {
                typedValue = false;
              }
              break;
            }
            default: {
              typedValue = filteredValue;
            }
          }
          filterCategory.push(['==', ['get', filterGroup], typedValue])
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

  function closeAreaInfo() {
    setAreaInfo({
      lat: 0,
      lng: 0,
      data: null,
      extended: false,
    });
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

  
	return <div className="lg:relative w-full h-[calc(100vh-48px-54px)] lg:h-[calc(100vh-56px-112px)] overflow-visible">

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
        id="green-area-buffers"
        type="geojson"
        data={showBuffers ? bufferFeatures : featureCollection([])}
      >
        <Layer
          id="buffer-layer"
          type="fill"
          paint={{
            'fill-color': 'rgba(238, 0, 255, 0.52)',
            'fill-opacity': 0.16  ,
          }}
        />
      </Source>

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
      {showMapLegend && <MapLegend className={"fixed left-0 max-lg:bottom-0 lg:absolute lg:top-28 w-full lg:w-auto h-14 lg:h-auto lg:min-h-14 min-w-14 lg:max-h-[calc(100%-28px)] overflow-y-auto bg-white bg-opacity-75 py-0 lg:py-6 lg:px-4 lg:rounded-xl shadow-sm z-10"}>
        <div className='flex flex-col overflow-y-auto px-6 py-1.5 lg:p-0 font-sans'>
          <AreaFilterRadio
            onClick={onFilterClick}
            selected = {filterSelected}
            currentFilterState={zoneFilter}
            onToggle={toggleLayerProperty}
          >
        
            {filterSelected!=="" && <ButtonExpand onClick={()=>{setFilterSelected("")}} style='lg:hidden z-20'/>}
              
          </AreaFilterRadio>
          {filterSelected!=="" && <ButtonExpand direction='left' onClick={()=>{setFilterSelected("")}} style='hidden lg:block z-20'/>}

            {filterSelected !== "" && (
              <div className="flex flex-col space-y-1 px-4 py-2">
                <div className="flex items-center space-x-2">
                  <img
                    src="iconBuffer.svg"
                    alt="buffer icon"
                    className="h-12 w-12"
                  />
                  <h3 className="text-sm font-medium">Аналітика</h3>
                </div>
                <BufferToggle showBuffers={showBuffers} setShowBuffers={setShowBuffers} />
              </div>
            )}

        </div>
        
      </MapLegend>}
      {<MapLegend className={"fixed hidden lg:block max-lg:bottom-0 lg:absolute lg:bottom-0 left-0 w-full lg:w-auto lg:min-h-14 min-w-14 lg:max-h-[calc(100%-28px)] overflow-y-auto bg-white bg-opacity-75 lg:py-1 lg:px-4 lg:rounded-xl shadow-sm"}>
        <MapSourceSwitch sources={availableStyles} selectedSource={style} onSetSource={setStyle} />
      </MapLegend>}
      <MapAreaStats areas={greenAreas}></MapAreaStats>
      {areaInfo.data && areaInfo.extended === false &&
        <>
          <Marker latitude={areaInfo.lat} longitude={areaInfo.lng} anchor="bottom" className={"sm:hidden"}>
            <img src={marker} alt='Selected zone marker' />
          </Marker>
          <AreaInfo latitude={areaInfo.lat} longitude={areaInfo.lng} data={areaInfo.data as Feature as GreenArea} onExtend={toggleAreaExtend}>
            <ButtonExpand onClick={closeAreaInfo}/>
          </AreaInfo>
        </>
      }
      {areaInfo.data && areaInfo.extended === true &&
        <>
          <Marker latitude={areaInfo.lat} longitude={areaInfo.lng} anchor="bottom" className='max-sm:hidden'>
            <img src={marker} alt='Selected zone here' />
          </Marker>
          <AreaInfoExtended latitude={areaInfo.lat} longtitude={areaInfo.lng} data={areaInfo.data as Feature as GreenArea} onExtend={toggleAreaExtend}>
            <ButtonExpand onClick={closeAreaInfo}/>
          </AreaInfoExtended>
        </>    
      }
      <ToastContainer />
    </GlMap> : "Loading"}

	</div>
  
};

export {
  HomePage,
  LANDTYPES
};
export type {
  MapStyle as MapStyleType,
  HomePageProps,
  GreenArea,
  ZoneFilter,
}
