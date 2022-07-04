import type { GetStaticPropsContext, NextPage } from 'next'
import { useEffect, useState } from 'react'
import AppLayout from '../components/layout/appLayout'
import styles from '../styles/Books.module.css'
import { fetchBooks } from '../components/services/api'
import { useTranslations } from 'next-intl'

import PaginatedList from '../components/layout/paginatedBooksList'

const Home: NextPage = () => {
  const t = useTranslations('Books')

  const [books, setBooks] = useState(Array<any>);
  const [count, setCount] = useState(0)
  const [page, setPage] = useState(1);

  const getBooks = (page?: number, perPage?: number) => {
    fetchBooks(page, perPage).then(response => {
      setBooks(response.data)
      setCount(response.count)
      setPage(response.page)
    });
  }

  useEffect(() => {
    getBooks(1, 20)
  }, [])

  return (
    <AppLayout>
      <title>{t('Books')}</title>
      
      <PaginatedList data={books} getData={getBooks} count={count} page={page} perPage={20} />
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
