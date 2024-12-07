import React from 'react';
import icons from "../../assets/images/icons.svg";

interface ButtonExtendedProps {
  style?: string,
  direction?: "left"|"right"|"bottom"| "top", //default:bottom
  onClick: React.MouseEventHandler,
}

export function ButtonExpand({style, direction, onClick }: ButtonExtendedProps) {
  let rotate:string = "";
  switch(direction) {
    case "left": {
      rotate = "rotate-90";
      break;
    }
    case "right": {
      rotate = "-rotate-90";
      break;
    }
    case "top": {
      rotate = "rotate-180";
      break;
    }
    case "bottom":
    case undefined:
    default:
      break;
  }

  return <button type="button" className={`absolute block top-3 right-3 rounded-full focus:outline-none focus:ring-1 focus:ring-accent ${style}`} onClick={onClick} aria-label='Expand or collapse'>
      <svg viewBox='0 0 20 12' className={`block lg:inline-block m-auto w-8 h-8 fill-accent hover:stroke-navlinkActive stroke-[0.75] hover:opacity-60 p-1.5 ${rotate}`}>
        <use href={icons + `#expandArrow`}></use>
      </svg>
    </button>;
}