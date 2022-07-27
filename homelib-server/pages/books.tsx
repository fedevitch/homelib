import type { GetStaticPropsContext, NextPage } from 'next'
import { useEffect, useState } from 'react'
import AppLayout from '../components/layout/appLayout'
import styles from '../styles/Books.module.css'
import { fetchBooks } from '../components/services/api'
import { useTranslations } from 'next-intl'
import { Button, InputGroup, MenuItem } from '@blueprintjs/core'
import { MultiSelect2 } from "@blueprintjs/select";
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

  const FormatFilterMultiSelect = MultiSelect2.ofType<string>();
  const renderFormatItem = (format, { modifiers, handleClick }) => {
    return <MenuItem icon={isFormatSelected(format) ? "tick" : "blank"} 
                     selected={isFormatSelected(format)} key={format} text={format} 
                     onClick={handleClick} />
  }
  const renderTag = (format) => format;
  const isFormatSelected = (format): boolean => formats.indexOf(format) !== -1;
  const onFormatSelect = (format) => {    
    if(isFormatSelected(format)){
      setFormatFilter(formats.filter(f => f !== format));
    }
    setFormatFilter([...formats, format]);
  }
  const onFormatDeselect = (_tag: React.ReactNode, index: number) => setFormatFilter(formats.splice(index, 1));
  const clearFormatFilter = () => setFormatFilter([]);

  const getBooks = (page?: number, perPage?: number) => {
    const filter = { searchString, format: formats, ISBN };
    setLoading(true);
    if(!page) setPage(1);
    return fetchBooks(filter, page, perPage).then(response => {
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
    <AppLayout title={t('Books')}>
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
        <FormatFilterMultiSelect items={Object.keys(Formats)} itemRenderer={renderFormatItem} onClear={clearFormatFilter}
                                onItemSelect={onFormatSelect} selectedItems={formats} placeholder={t("Filter by format")}
                                tagRenderer={renderTag} tagInputProps={{ onRemove: onFormatDeselect }}
                                className={styles.booksListFormatFilter} />
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
