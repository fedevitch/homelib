import type { GetStaticPropsContext, NextPage } from 'next'
import { ChangeEvent, useEffect, useState } from 'react'
import AppLayout from '../components/layout/appLayout'
import styles from '../styles/Book.module.css'
import { fetchBooks } from '../components/services/api'
import { useTranslations } from 'next-intl'
import { Button, InputGroup } from '@blueprintjs/core'
import PaginatedList from '../components/layout/paginatedBooksList'
import { BooksFilter } from '../components/schemas/apiRequests'

const Home: NextPage = () => {
  const t = useTranslations('Books')

  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState(Array<any>);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [searchString, setSearchString] = useState("");
  const [format, setFormat] = useState("");
  const [ISBN, setISBN] = useState("");

  const getBooks = (page?: number, perPage?: number) => {
    const filter = { searchString, format, ISBN };
    setLoading(true);
    fetchBooks(filter, page, perPage).then(response => {
      setBooks(response.data)
      setCount(response.count)
      setPage(response.page)
    })
    .finally(() => setLoading(false));
  }

  useEffect(() => {
    getBooks(1, 20)
  }, [])

  return (
    <AppLayout>
      <title>{t('Books')}</title>
      <div className={styles.booksListSearch}>
        <InputGroup leftIcon="search-text" className={styles.booksListSearchInput}
                    placeholder={t("Search by Name or Description")}                  
                    asyncControl type="search"
                    disabled={loading}
                    value={searchString}
                    onKeyDown={e => e.key === 'Enter' && getBooks()}
                    onChange={(event) => setSearchString(event.target.value)} />
        <InputGroup leftIcon="search-text" 
                    placeholder={t("Search by ISBN")}                  
                    asyncControl type="search"
                    disabled={loading}
                    value={ISBN}
                    onKeyDown={e => e.key === 'Enter' && getBooks()}
                    onChange={(event) => setISBN(event.target.value)} />            
        <Button icon="search" loading={loading} text={t("Find")} disabled={loading} onClick={() => getBooks()} />     

      </div>
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
