import { memo } from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { NavMenu } from '../NavMenu';
import assets from '../../assets';

const logo = assets.images.logo;

const Header = memo(() => {
	return (
		<header
			// position="fixed"
      className='flex flex-row justify-between w-full pl-2 md:ml-3 bg-white shadow-md font-sans text-base font-normal'
			// sx={{ //bgcolor: '#233044',
      //   display: "flex",
      //   flexDirection: "row",
      //   justifyContent: "space-between"
      // }}
		>
        <a href="/" target="_self"><img src={logo} alt='Logo' className='block h-11 md:h-14 w-auto'></img></a>
				<NavMenu />
        <div className='bg-accent'>
          <h1 className='md:hidden font-sans font-bold text-[12px] mx-3 py-3'>{'<'}GSSD{'>'}</h1>
          <h1 className='hidden md:block font-sans font-bold text-base mx-6 py-4'>{'<'}Green Spaces Strategy Development{'>'}</h1>
        </div>
			{/* </div> */}
		</header>
	);
});

export { Header };
