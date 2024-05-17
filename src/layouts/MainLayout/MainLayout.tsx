import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import { Topbar } from '../../components';

const MainLayout = () => {
	return (
		<Box sx={{ display: 'flex' }}>
			<Topbar />
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					width: '100%',
					minHeight: '100vh'
				}}
			>
				<Toolbar />
				<Outlet />
			</Box>
		</Box>
	);
};

export { MainLayout };
