import '@inovua/reactdatagrid-community/index.css';
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import { useIdleTimer } from 'react-idle-timer';
import { Provider, useDispatch } from 'react-redux';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import AppRouter from './App';
import { signout } from './app/slices/auth';
import store, { persistor } from './app/store';
import './index.css';

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<QueryClientProvider client={client}>
			<Provider store={store}>
				<PersistGate
					loading={null}
					persistor={persistor}
				>
					<BrowserRouter>
						<Toaster
							position="bottom-right"
							toastOptions={{
								duration: 10000,
								style: {
									background: '#363636',
									color: '#fff',
								},
								success: {
									duration: 5000,
									iconTheme: {
										primary: '#4ade80',
										secondary: '#fff',
									},
								},
								error: {
									duration: 8000,
									iconTheme: {
										primary: '#ef4444',
										secondary: '#fff',
									},
								},
							}}
						/>
						<App />
					</BrowserRouter>
				</PersistGate>
			</Provider>
		</QueryClientProvider>
	</React.StrictMode>
);

function App() {
	const [colorScheme, setColorScheme] = React.useState<ColorScheme>('light');
	const toggleColorScheme = (value?: ColorScheme) =>
		setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'));

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleLogout = useCallback(() => {
		dispatch(signout());
		navigate('/signin');
	}, [dispatch, navigate]);

	const { start } = useIdleTimer({
		onIdle: handleLogout,
		timeout: 15 * 60 * 1000,
		throttle: 500,
	});

	useEffect(() => {
		start();
	}, [start]);

	return (
		<ColorSchemeProvider
			colorScheme={colorScheme}
			toggleColorScheme={toggleColorScheme}
		>
			<MantineProvider
				theme={{
					colorScheme,
					primaryColor: 'primary',
					colors: {
						primary: [
							'#fffbe1',
							'#fff5cb',
							'#ffea9a',
							'#ffdf64',
							'#ffd538',
							'#ffcf1c',
							'#ffcc08',
							'#e3b400',
							'#caa000',
							'#ae8900',
						],
					},
				}}
				withNormalizeCSS
				withGlobalStyles
			>
				<ModalsProvider>
					<AppRouter />
				</ModalsProvider>
			</MantineProvider>
		</ColorSchemeProvider>
	);
}
