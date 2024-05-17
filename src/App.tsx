import { Route, Routes, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts';
import { HomePage, AboutPage, SavePage, BlogPage } from './pages';

function App() {
	return (
		<Routes>
			<Route path='/' element={<MainLayout />}>
				<Route index element={<HomePage />} />
				<Route path='/about' element={<AboutPage />} />
				<Route path='/save' element={<SavePage />} />
				<Route path='/blog' element={<BlogPage />} />
			</Route>
			<Route path="*" element={<Navigate to='/' replace />} />
		</Routes>
	);
}

export default App;
