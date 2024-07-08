import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import { Topbar } from '../../components';
import Footer from '../../components/Footer';

function MainLayout() {
	return (
		<div > 
			<Topbar />
			<main className='w-full'>
				<Toolbar />
				<Outlet />
			</main>
      <Footer />
		</div>
  );
};

export { MainLayout };
