import React from 'react'

import '../assets/styles/main.scss'

import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
 
export default function MyApp({ Component, pageProps }: AppProps) {
  return ( 
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
