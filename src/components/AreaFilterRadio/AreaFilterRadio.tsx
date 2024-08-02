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
  const classSelected = selected === value? "fill-accent" : "fill-navlink";
  return <label aria-label={hint} className="block">
      <input type="radio" name={groupName} id={`${groupName}_${value}`} value={value} onClick={onClick} className="appearance-none inline-block"/>
      <svg viewBox='0 0 30 30' className={`inline-block w-8 h-8 hover:fill-navlinkActive ${classSelected}`}>
        {hint && <title>{hint}</title>}
        <use href={icons + `#${value}`}></use>
      </svg>
    </label>
}

const areaFilterOptions = [
  {
    value: "areaStatus",
    hint: "Статус зони"
  },
  {
    value: "areaMaintained",
    hint: "Балансоутримувач"
  },
  {
    value: "areaType",
    hint: "За типом зони"
  }
]

interface AreaFilterRadioProps {
  onClick: React.MouseEventHandler<HTMLInputElement>,
  selected: string,
  children?: React.ReactNode,
}

export function AreaFilterRadio({ onClick, selected, children }: AreaFilterRadioProps) {
  return <div className='space-y-8'>
  {areaFilterOptions.map((option) => {
    return <AreaFilterOption
      value={option.value}
      selected={selected}
      hint={option.hint}
      groupName='areaFilters'
      onClick={onClick}
    />
  })}
  </div> 
}