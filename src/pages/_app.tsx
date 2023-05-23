import React from 'react'

import '../assets/styles/main.scss'

import type { AppProps } from 'next/app';
 
export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
