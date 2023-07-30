import { Link } from 'react-router-dom';
import { List, MenuItem, Typography } from '@mui/material';

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
		<List sx={{ display: 'flex' }}>
			{routes.map(route => (
				<MenuItem
					component={Link}
					to={route.path}
					key={route.path}
				>
					<Typography
						variant="body2"
						textAlign="center"
						sx={{ color: '#eeeeee' }}
					>
						{route.displayText}
					</Typography>
				</MenuItem>
			))}
		</List>
	);
};

export { NavMenu };
