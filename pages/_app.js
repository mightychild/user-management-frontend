import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Head from 'next/head';

const theme = createTheme();

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>User Management</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

export default MyApp;