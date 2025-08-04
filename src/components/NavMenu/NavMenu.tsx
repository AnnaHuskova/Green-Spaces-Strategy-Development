import { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
// import { List, MenuItem, Typography } from '@mui/material';
import { ReactComponent as BurgerIcon } from '../../assets/icons/burger_icon.svg';
import { ReactComponent as CloseIcon } from '../../assets/icons/X_icon.svg';


type RouteType = {
	path: string;
	displayText: string;
}

const routes: RouteType[] = [
 //  {
	// 	path: '/save',
	// 	displayText: 'Як захистити?'
	// },
	{
		path: '/',
		displayText: 'Мапа'
	},
  {
		path: '/about',
		displayText: 'Про проект'
	},
	// {
	// 	path: '/blog',
	// 	displayText: 'Blog'
	// }
];

const NavMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  

  const activeStyles =
    // underline for mobile
    "relative text-navlinkActive " +
    // underline for desktop
    "lg:after:content-[''] lg:after:absolute lg:after:left-0 lg:after:bottom-[-1rem] lg:after:block lg:after:w-full lg:after:h-1 lg:after:bg-accent";
   useEffect(() => {
    const handleScroll = () => {
      if (menuOpen) setMenuOpen(false);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [menuOpen]);
  return (
    <div className="relative flex items-center justify-center h-full">
      {/*burger_btn */}
      <button
        className="block lg:hidden mx-2 my-1 flex items-center justify-center w-10 h-10"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
      {menuOpen ? (
          <CloseIcon className="w-8 h-8" />
        ) : (
          <BurgerIcon className="w-8 h-8" />
        )}
      </button>

      {/* desktop_nav */}
      <nav className="hidden lg:flex flex-row text-navlink">
        {routes.map((route) => (
          <NavLink
            end
            to={route.path}
            key={route.path}
            className={({ isActive }) =>
              `block h-full pt-4 mx-13 text-center ${
                isActive ? activeStyles : ''
              }`
            }
          >
            <span className="px-8 text-center">{route.displayText}</span>
          </NavLink>
        ))}
      </nav>

      {/* addaptive_dropp-menu */}
      {menuOpen && (
        <nav className="fixed lg:hidden top-12 left-0 w-full bg-white shadow-lg flex flex-col items-center text-navlink z-50 py-4">
			{routes.map((route) => (
			<NavLink
				end
				to={route.path}
				key={route.path}
				onClick={() => setMenuOpen(false)}
				className={({ isActive }) =>
				`block py-3 w-full text-center hover:bg-gray-100 ${
					isActive ? activeStyles : ''
				}`
				}
			>
				{route.displayText}
			</NavLink>
    ))}
  		</nav>
      )}
      
    </div>
  );
};

export { NavMenu };

// const NavMenu = () => {
// 	return (
// 		// <List sx={{ display: 'flex' }}>
//     <nav className='flex flex-col sm:flex-row text-navlink'>
// 			{routes.map(route => {
//         const activeStyles = "relative text-navlinkActive after:content-[''] after:absolute after:left-0 after:top-[calc(100%-4px)] after:block after:w-full after:h-1 after:bg-accent";
// 				return <NavLink end to={route.path} key={route.path} className={({ isActive }) => {return (`block h-full pt-4 mx-13 text-center`+" "+ (isActive? activeStyles: ""))}}
//         // {{({isActive}) => {return (`w-30 h-full mr-2 `+ isActive? activeStyles: "")}}}
//         ><span className='px-8 text-center'>{route.displayText}</span></NavLink>
// 				// 	component={Link}
// 				// 	to={route.path}
// 				// 	key={route.path}
// 				// >
// 				// 	<Typography
// 				// 		variant="body2"
// 				// 		textAlign="center"
// 				// 		sx={{ color: '#eeeeee' }}
// 				// 	>
// 				// 		{route.displayText}
// 				// 	</Typography>
// 				// </MenuItem>
//       })}
// 		</nav>
// 	);
// };

// export { NavMenu };
