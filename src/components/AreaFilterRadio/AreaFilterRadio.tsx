import React from 'react';
import icons from "../../assets/images/icons.svg";
// import { FormGroup, FormLabel } from '@mui/material';
import MapLegendSwitch from '../MapLegendItem';
import {ZoneFilter} from "../../pages/HomePage";

enum LANDTYPES {
  forestPark = "Лісопарк",
  park = "Парк",
  square = "Сквер",
  allee = "Алея",
  boulevard = "Бульвар",
  unknown = "не визначено"
};

const areaFilterOptions = {
  landStatus: {
    hint: "Статус",
    filterCategories: {
      supervised: "Є об'єктом благоустрою",
      unsupervised: "Не є об'єктом благоустрою",
    }
  },
  maintenance: {
    hint: "Утримується",
    filterCategories: {
      maintained: "На балансі",
      unmaintained: "Не утримується",
    }
  },
  landType: {
    // value: "landType",
    hint: "За типом",
    filterCategories: LANDTYPES,
  }
}

//Separate icon button

interface AreaFilterOptionProps {
  filteredGroup: string,
  hint?: string,
  selected: string | "",
  groupName: string,
  onClick: React.MouseEventHandler<HTMLInputElement>,
  currentFilterState: ZoneFilter,
  onToggle: React.ChangeEventHandler,
}

function AreaFilterOption({filteredGroup, hint, selected, groupName, onClick, currentFilterState, onToggle}: AreaFilterOptionProps) {
  const classSelected = selected === filteredGroup? "fill-accent" : "fill-none";


  return <div className='flex'>
    <label aria-label={hint} className="md:block">
      <input type="radio" name={groupName} id={`${groupName}_${filteredGroup}`} value={filteredGroup} onClick={onClick} className="appearance-none inline-block"/>
      <svg viewBox='0 0 30 30' className={`block md:inline-block m-auto w-6 h-6 md:w-8 md:h-8 stroke-navlinkActive stroke-[0.75] hover:fill-accent hover:opacity-60 ${classSelected}`}>
        {hint && <title>{hint}</title>}
        <use href={icons + `#${filteredGroup}`}></use>
      </svg>
      <span className='md:hidden'>{hint}</span>
    </label>

    {/* For mobile - show only active group */}
    {selected === filteredGroup && 
      <div aria-label='Green area filtering' className='ml-5' >
        <h3>{hint}</h3>
          {Object.keys((currentFilterState as Record<string, any>)[filteredGroup]).map( (filterCategory:string) => {
            let color = "";
            if(filteredGroup === "maintenance") {
              color = filterCategory==="maintained"? "areasProtected" : "areasUnprotected";
            }

            return <MapLegendSwitch
              active={(currentFilterState as Record<string, any>)[filteredGroup][filterCategory]}
              controls={`${filteredGroup}-${filterCategory}`}
              key={`${filteredGroup}-${filterCategory}`}
              label={(areaFilterOptions as Record<string, any>)[filteredGroup].filterCategories[filterCategory]}
              color={color!==""? color : undefined}
              onToggleActive={onToggle}
          />
          })}
        
      </div>
      }

      {/* For desktop - show all filters no matter which one is selected */}
      {selected !== filteredGroup && selected !== "" && 
      <div aria-label='Green area filtering' className='ml-5 hidden md:block' >
        <h3>{hint}</h3>
          {Object.keys((currentFilterState as Record<string, any>)[filteredGroup]).map( (filterCategory:string) => {
            let color = "";
            if(filteredGroup === "maintenance") {
              color = filterCategory==="maintained"? "areasProtected" : "areasUnprotected";
            }

            return <MapLegendSwitch
              active={(currentFilterState as Record<string, any>)[filteredGroup][filterCategory]}
              controls={`${filteredGroup}-${filterCategory}`}
              key={`${filteredGroup}-${filterCategory}`}
              label={(areaFilterOptions as Record<string, any>)[filteredGroup].filterCategories[filterCategory]}
              color={color!==""? color : undefined}
              onToggleActive={onToggle}
          />
          })}
        
      </div>
      }
  </div>
}

//Radiogroup of buttons

interface AreaFilterRadioProps {
  onClick: React.MouseEventHandler<HTMLInputElement>,
  selected: string,
  currentFilterState: ZoneFilter,
  onToggle: React.ChangeEventHandler,
  children?: React.ReactNode,
}

export function AreaFilterRadio({ onClick, selected, currentFilterState, onToggle, children }: AreaFilterRadioProps) {
  return <div className='flex flex-row justify-between w-full h-13 md:w-auto md:h-auto md:block md:space-y-8'>
  {Object.keys(areaFilterOptions).map((groupName) => {
    const filteredGroup = (areaFilterOptions as Record<string, any>)[groupName];
    return <AreaFilterOption
      filteredGroup={groupName}
      key={groupName}
      selected={selected}
      hint={filteredGroup.hint}
      groupName='areaFilters'
      onClick={onClick}
      currentFilterState={currentFilterState}
      onToggle={onToggle}
    />
  })}
  {children}
  </div> 
}