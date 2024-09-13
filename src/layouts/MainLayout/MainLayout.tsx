import { Outlet } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import { Header } from '../../components';
import Footer from '../../components/Footer';

function MainLayout() {
	return (
		<div > 
			<Header />
			<main className='w-full'>
				{/* <Toolbar /> */}
				<Outlet />
			</main>
      <Footer />
		</div>
  );
};

export { MainLayout };
