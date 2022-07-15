import type { GetStaticPropsContext, NextPage } from 'next'
import { useEffect, useState } from 'react'
import AppLayout from '../components/layout/appLayout'
import styles from '../styles/Book.module.css'
import { fetchBooks } from '../components/services/api'
import { useTranslations } from 'next-intl'
import { Button, InputGroup, Menu, MenuItem } from '@blueprintjs/core'
import { Popover2 } from '@blueprintjs/popover2'
import PaginatedList from '../components/layout/paginatedBooksList'
import { Formats } from '../components/schemas/formats'

const Home: NextPage = () => {
  const t = useTranslations('Books')

  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState(Array<any>);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [searchString, setSearchString] = useState("");
  const [formats, setFormatFilter] = useState(Array<string>);
  const [ISBN, setISBN] = useState("");

  const formatMenuItems = Object.keys(Formats)
                        .map(formatKey => (<MenuItem icon={formats.indexOf(formatKey) !== -1 ? "tick" : "small-minus"}
                                                     disabled={formats.indexOf(formatKey) !== -1}  
                                                     text={formatKey} onClick={() => setFormatFilter([...formats, formatKey])} />));
  formatMenuItems.push(<MenuItem text={t("Clear all")} disabled={formats.length === 0} icon="cross" onClick={() => setFormatFilter([])} />);

  const getBooks = (page?: number, perPage?: number) => {
    const filter = { searchString, format: formats, ISBN };
    setLoading(true);
    if(!page) setPage(1);
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
        <Popover2 content={<Menu>{formatMenuItems}</Menu>}>
          <Button className={styles.booksListFormatFilter} disabled={loading} icon="filter" text={t("Filter by format")} />
        </Popover2>            
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
