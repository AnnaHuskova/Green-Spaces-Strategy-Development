import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import './styles.css';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);
root.render(
	<React.StrictMode>
		<BrowserRouter>
			<CssBaseline />
			<App />
		</BrowserRouter>
	</React.StrictMode>
);
