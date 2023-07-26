import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from 'react-leaflet';

const Map = () => {
	return (
		<MapContainer
			center={[48.51874159685502, 34.61350377087257]}
			zoom={12}
			style={{ height: 'calc(100% - 64px)', width: '100%'}}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
		</MapContainer>
	);
};

export { Map };
