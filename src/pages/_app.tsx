import React from 'react'

import '../assets/styles/main.scss'

import type { AppProps } from 'next/app';
import { AuthContextProvider } from '../contexts/AuthContext';

export default function MyApp({ Component, pageProps }: AppProps) {
	return (
		<AuthContextProvider>
			<Component {...pageProps} />
		</AuthContextProvider>
	)
}
