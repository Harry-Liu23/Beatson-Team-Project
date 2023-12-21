import '../styles/globals.css';
import { AppProps } from 'next/app';
import '../components/Navbar';
import Navbar from '../components/Navbar';

export default function MyApp( { Component, pageProps }: AppProps ) {
  return (
    <div>
      <Navbar />
    <Component {...pageProps} />
    </div>
  );
}