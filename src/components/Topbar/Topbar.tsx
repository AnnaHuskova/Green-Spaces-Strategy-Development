import { memo } from 'react';
import { AppBar, Toolbar } from '@mui/material';
import { NavMenu } from '../NavMenu';

const Topbar = memo(() => {
	return (
		<AppBar
			position="fixed"
			color="default"
		>
			<Toolbar sx={{ justifyContent: 'center' }}>
				<NavMenu />
			</Toolbar>
		</AppBar>
	);
});

export { Topbar };
