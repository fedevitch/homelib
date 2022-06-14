import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {NextIntlProvider} from 'next-intl'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextIntlProvider messages={pageProps.messages} locale="ua">
      <Component {...pageProps} />
    </NextIntlProvider>
  )
}

export default MyApp
