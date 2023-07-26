import { Link } from 'react-router-dom';
import { MenuItem, Typography } from '@mui/material';

type RouteType = {
	path: string;
	displayText: string;
}

const routes: RouteType[] = [
	{
		path: '/',
		displayText: 'Головна'
	},
	{
		path: '/about',
		displayText: 'Про проект'
	},
	{
		path: '/save',
		displayText: 'Як зберегти?'
	},
	{
		path: '/blog',
		displayText: 'Блог'
	}
];

const NavMenu = () => {
	return (
		<>
			{routes.map(route => (
				<MenuItem
					component={Link}
					to={route.path}
					key={route.path}
				>
					<Typography textAlign="center">{route.displayText}</Typography>
				</MenuItem>
			))}
		</>
	);
};

export { NavMenu };
