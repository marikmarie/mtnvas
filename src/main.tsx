import '@inovua/reactdatagrid-community/index.css';
import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useCallback, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
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
						<Notifications
							autoClose={10000}
							position="top-right"
							zIndex={2077}
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
							'#fff5cc',
							'#ffea9b',
							'#ffdf64',
							'#ffd538',
							'#ffcf1c',
							'#ffcc09',
							'#e3b400',
							'#c9a000',
							'#ae8a00',
						],
					},
				}}
				withNormalizeCSS
				withGlobalStyles
			>
				<Notifications
					position="top-right"
					zIndex={2077}
				/>
				<ModalsProvider>
					<AppRouter />
				</ModalsProvider>
			</MantineProvider>
		</ColorSchemeProvider>
	);
}
