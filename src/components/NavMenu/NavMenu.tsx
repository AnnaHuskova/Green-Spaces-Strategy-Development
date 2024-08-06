import { NavLink, useLocation } from 'react-router-dom';
// import { List, MenuItem, Typography } from '@mui/material';

type RouteType = {
	path: string;
	displayText: string;
}

const routes: RouteType[] = [
  {
		path: '/save',
		displayText: 'How to protect?'
	},
	{
		path: '/',
		displayText: 'Map'
	},
  {
		path: '/about',
		displayText: 'About'
	},
	// {
	// 	path: '/blog',
	// 	displayText: 'Blog'
	// }
];

const NavMenu = () => {
	return (
		// <List sx={{ display: 'flex' }}>
    <nav className='text-navlink flex flex-row'>
			{routes.map(route => {
        const activeStyles = "relative text-navlinkActive after:content-[''] after:absolute after:left-0 after:top-[calc(100%-4px)] after:block after:w-full after:h-1 after:bg-accent";
				return <NavLink end to={route.path} key={route.path} className={({ isActive }) => {return (`block h-full pt-4 mx-13 text-center`+" "+ (isActive? activeStyles: ""))}}
        // {{({isActive}) => {return (`w-30 h-full mr-2 `+ isActive? activeStyles: "")}}}
        ><span className='px-8 text-center'>{route.displayText}</span></NavLink>
				// 	component={Link}
				// 	to={route.path}
				// 	key={route.path}
				// >
				// 	<Typography
				// 		variant="body2"
				// 		textAlign="center"
				// 		sx={{ color: '#eeeeee' }}
				// 	>
				// 		{route.displayText}
				// 	</Typography>
				// </MenuItem>
      })}
		</nav>
	);
};

export { NavMenu };