import React, { useEffect, useMemo, useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import defaultAppTheme from '../assets/defaultAppTheme';
import type { AppProps } from 'next/app';

import '../assets/styles/main.scss'

import { AuthContextProvider } from '../contexts/AuthContext';
import Layout from '../components/layout/AppLayout';
import { ScheduleContextProvider } from '../contexts/ScheduleContext';
import { TermsContextProvider } from '../contexts/TermsContext';


const darkTheme = createTheme({
	palette: {
		mode: 'dark',
	},
});

export default function MyApp({ Component, pageProps }: AppProps) {
	const [mode, setMode] = useState<'light' | 'dark'>('light');

	const switchTheme = () => {
		setMode(mode === 'light' ? 'dark' : 'light');
	};

	useEffect(() => {
		document.querySelector('html').setAttribute('data-theme', mode);
	}, [mode]);

	const theme = useMemo(
		() =>
			createTheme({
				...defaultAppTheme,
				palette: {
					mode,
				},
			}),
		[mode],
	);

	return (
		<AuthContextProvider>
			<TermsContextProvider>
				<ScheduleContextProvider>
					<ThemeProvider theme={theme}>
						<Layout onToggleThemeMode={switchTheme}>
							<Component {...pageProps} />
						</Layout>
					</ThemeProvider>
				</ScheduleContextProvider>
			</TermsContextProvider>
		</AuthContextProvider>
	);
}
