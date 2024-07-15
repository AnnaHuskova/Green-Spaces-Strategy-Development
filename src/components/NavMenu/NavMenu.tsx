import { NavLink, useLocation } from 'react-router-dom';
// import { List, MenuItem, Typography } from '@mui/material';

type RouteType = {
	path: string;
	displayText: string;
}

const routes: RouteType[] = [
	{
		path: '/',
		displayText: 'Main'
	},
	{
		path: '/about',
		displayText: 'About'
	},
	{
		path: '/save',
		displayText: 'How to protect?'
	},
	{
		path: '/blog',
		displayText: 'Blog'
	}
];

const NavMenu = () => {
	return (
		// <List sx={{ display: 'flex' }}>
    <nav className='text-navlink flex flex-row'>
			{routes.map(route => {
        const activeStyles = "text-navlinkActive";
        // console.log(useLocation())
				return <NavLink end to={route.path} key={route.path} className={({ isActive }) => {return (`block h-full px-8 py-4 mx-13 text-center`+" "+ (isActive? activeStyles: ""))}}
        // {{({isActive}) => {return (`w-30 h-full mr-2 `+ isActive? activeStyles: "")}}}
        >{route.displayText}</NavLink>
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