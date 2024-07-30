import React from 'react';
import icons from "../../assets/images/icons.svg"

interface AreaFilterOptionProps {
  value: string,
  hint?: string,
  selected: string,
  groupName: string,
  onClick: React.MouseEventHandler<HTMLInputElement>
}

function AreaFilterOption({value, hint, selected, groupName, onClick}: AreaFilterOptionProps) {
  const classSelected = selected === value? "fill-accent" : "";
  return <label aria-label={hint}>
      <input type="radio" name={groupName} id={`${groupName}_${value}`} value={value} onClick={onClick} className="appearance-none inline-block"/>
      <svg viewBox='0 0 30 30' className={`inline-block w-8 h-8 fill-navlink hover:fill-navlinkActive ${classSelected}`}>
        {hint && <title>{hint}</title>}
        <use href={icons + `#${value}`}></use>
      </svg>
    </label>
}

interface AreaFilterRadioProps {
  onClick: React.MouseEventHandler<HTMLInputElement>,
  selected: string,
  children?: React.ReactNode,
}

export function AreaFilterRadio({ onClick, selected, children }: AreaFilterRadioProps) {
  return <>
  <AreaFilterOption
    value='areaStatus'
    selected={selected}
    hint="Статус зони"
    groupName='areaFilters'
    onClick={onClick}
  />
    {/* <svg viewBox='0 0 30 30' className=' w-3 h-3 fill-[#000000]'>
      <use href={icons + "#areaStatus"}></use>
    </svg> */}
  </> 
}