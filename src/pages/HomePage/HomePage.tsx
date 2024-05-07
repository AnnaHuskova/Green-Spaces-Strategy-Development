import { Map } from '../../components';
import {useEffect, useState} from 'react';
import GlMap from 'react-map-gl/maplibre';

const contStyle = {
	display: "flex",
	width: "calc(100%)",
	height: "100%"
}

function HomePage() {
	const [style, setStyle] = useState('https://tile.openstreetmap.org.ua/styles/positron-gl-style/style.json');
	const[styleJson, setStyleJson] = useState(null);

	useEffect(() => {
		async function fetchStyle() {
			const response = await fetch(style);
    		const jsonData = await response.json();
			setStyleJson(jsonData);
		};

		fetchStyle();
	}, [style]);

	return <div style={contStyle}>
			<Map />
			
			{styleJson?<GlMap
				initialViewState={{latitude: 48.4701, longitude: 35.0064, zoom: 10}}
				interactive={true}
				//style={contStyle}
				mapStyle={styleJson}
			/>:"Loading"}


		</div>
};

export { HomePage };
