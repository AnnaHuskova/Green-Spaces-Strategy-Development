import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import ReactGA from "react-ga4";
import envVars from "./js/env";
import './styles.css';

const root = ReactDOM.createRoot(
	document.getElementById('root') as HTMLElement
);
//If GA token is set in ENV, enable analytics
if(envVars.REACT_APP_GA4_ID !== undefined) {
  ReactGA.initialize(envVars.REACT_APP_GA4_ID);
}

root.render(
	<React.StrictMode>
		<BrowserRouter basename={process.env.PUBLIC_URL || '/'}>
			<CssBaseline />
			<App />
		</BrowserRouter>
	</React.StrictMode>
);
