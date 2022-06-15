import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {NextIntlProvider, IntlError, IntlErrorCode} from 'next-intl'

function MyApp({ Component, pageProps }: AppProps) {

  function onError(error: IntlError) {
    if (error.code === IntlErrorCode.MISSING_MESSAGE) {
      // Missing translations are expected and should only log an error
      console.error(error);
    }
  }
  
  function getMessageFallback({namespace, key, error}: any) {
    const path = [namespace, key].filter((part) => part != null).join('.');
  
    console.log({ namespace, key, error, path })
    if (error.code === IntlErrorCode.MISSING_MESSAGE) {
      return `${key}`;
    } else {
      // return `Dear developer, please fix this message: ${path}`;
      return key;
    }
  }

  return (
    <NextIntlProvider messages={pageProps.messages} locale="ua" 
                      onError={onError} getMessageFallback={getMessageFallback}>
      <Component {...pageProps} />
    </NextIntlProvider>
  )
}

export default MyApp
