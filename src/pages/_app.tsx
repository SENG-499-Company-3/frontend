import React from 'react'

import '../assets/styles/main.scss'

import type { AppProps } from 'next/app';
import { AuthContextProvider } from '../contexts/AuthContext';
import Layout from '../components/Layout';
 
export default function MyApp({ Component, pageProps }: AppProps) {
  return ( 
	<AuthContextProvider>
		<Layout>
			<Component {...pageProps} />
		</Layout>
	</AuthContextProvider>
  );
}
