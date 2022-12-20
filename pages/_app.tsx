import { AppProps } from 'next/app';
import '../styles.scss';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="container">
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
