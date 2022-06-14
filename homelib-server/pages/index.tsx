import type { GetStaticPropsContext, NextPage } from 'next'
import { useEffect } from 'react'
import AppLayout from '../components/layout/appLayout'
import styles from '../styles/Home.module.css'
import { fetchMain } from '../components/services/api'
import { useTranslations } from 'next-intl'

const Home: NextPage = () => {
  const t = useTranslations('Home')

  useEffect(() => {
    fetchMain().then(books => {
      console.log({ books });
    });
  }, [])

  return (
    <AppLayout>
      <div>{t('Welcome To homelib')}</div>
    </AppLayout>    
  )
}

export default Home

export async function getStaticProps(props: GetStaticPropsContext) {  
  return {
    props: {
      // You can get the messages from anywhere you like. The recommended
      // pattern is to put them in JSON files separated by language and read
      // the desired one based on the `locale` received from Next.js.
      messages: (await import(`../locales/${props.locale}.json`)).default
    }
  };
}
