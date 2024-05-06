import { memo } from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { NavMenu } from '../NavMenu';

const Topbar = memo(() => {
	return (
		<AppBar
			position="fixed"
			sx={{ bgcolor: '#233044'}}
		>
			<Toolbar sx={{ display: 'flex' }}>
				<Typography variant='h6' sx={{ flex: 1 }}>
					{'<'}Green Spaces Strategy Development{'>'}
				</Typography>
				<NavMenu />
				<Box sx={{ flex: 1 }} />
			</Toolbar>
		</AppBar>
	);
});

export { Topbar };
