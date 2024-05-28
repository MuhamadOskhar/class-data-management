import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ErrorPage } from './error-page';
import { MainMahasiswaPage } from '~/features/mahasiswa/routes/main-mahasiswa-page';

export const router = createBrowserRouter([
	{
		path: '',
		errorElement: <ErrorPage />,
		children: [
			{
				path: '/',
				element: <Navigate to="/home" />,
			},
			{
				path: '/home',
				element: <MainMahasiswaPage />,
				children: [{ path: ':mahasiswaId', element: <MainMahasiswaPage /> }],
			},
		],
	},
]);