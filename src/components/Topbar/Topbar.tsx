import { memo } from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { NavMenu } from '../NavMenu';
const logo = require("./logo-colored.png");

const Topbar = memo(() => {
	return (
		<header
			// position="fixed"
      className=' w-full ml-3 bg-white flex flex-row justify-between shadow-md font-sans text-base font-normal'
			// sx={{ //bgcolor: '#233044',
      //   display: "flex",
      //   flexDirection: "row",
      //   justifyContent: "space-between"
      // }}
		>
        <a href="/" target="_self"><img src={logo} alt='Logo' className='block h-14 w-auto'></img></a>
				<NavMenu />
        <div className='bg-accent'>
          <h1 className='font-sans font-bold text-base mx-6 py-4'>{'<'}Green Spaces Strategy Development{'>'}</h1>
        </div>
			{/* </div> */}
		</header>
	);
});

export { Topbar };
