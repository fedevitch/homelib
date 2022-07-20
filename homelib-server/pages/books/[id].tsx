import type { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import AppLayout from '../../components/layout/appLayout'
import { useTranslations } from 'next-intl'
import { fetchBook } from '../../components/services/api'
import { BookData } from '../../components/schemas/booksList'
import styles from '../../styles/Book.module.css'
import { sanitize, fileSize } from '../../components/services/text'
import { getFormatIcon } from '../../components/services/format'
import { Button, ButtonGroup, Card, Divider, Elevation, Spinner, SpinnerSize, Tag } from '@blueprintjs/core'

const Book: NextPage = () => {
    const t = useTranslations('Books')
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [book, setBook] = useState({} as BookData)
    const [cover, setCover] = useState(`/api/books/${router.query.id}/image`)
    const onCoverError = () => setCover(getFormatIcon(book.format?.toString()).src)

    useEffect(() => {
        setLoading(true)
        if(router.query.id) {
            fetchBook(Number.parseInt(router.query.id?.toString())).then(setBook).finally(() => setLoading(false))
        }
    }, [router.query.id])

    if(loading){
        return <AppLayout><Spinner size={SpinnerSize.STANDARD}/></AppLayout>
    }

    const IsbnBlock = () => <Fragment>
        <Card elevation={Elevation.TWO}>
            <p>{`${t("Pages")}: ${book.pages}`}</p>
            <p>{`${t("ISBN")}: ${book.isbn ? book.isbn : t("Unknown")}`}</p>
            <p>{`${t("ISBN")}-10: ${book.isbn10 ? book.isbn10 : t("Unknown")}`}</p>
            <p>{`${t("ISBN")}-13: ${book.isbn13 ? book.isbn13 : t("Unknown")}`}</p>
        </Card>
    </Fragment>

    const size = fileSize(book.size);
    const FileBlock = () => <Fragment>
        <Card elevation={Elevation.TWO}>
            <ButtonGroup vertical={false}>
                <Link href={`/api/books/${book.id}/file`} target="_blank">
                    <Button text={t("Download")} icon="download" />
                </Link>
                <Divider />
                <Image src={getFormatIcon(book.format?.toString())} width={30} height={20} />
                <Divider />
                <Tag large>{`${size.value} ${t(size.measure)}`}</Tag>
            </ButtonGroup>
        </Card>
    </Fragment>

    return(
        <AppLayout>
            <title>{`${book.name} - homelib`}</title>
            <div className={styles.container}>
                <div className={styles.cover}>
                    <Card elevation={Elevation.TWO}>
                        <Image src={cover} onError={onCoverError} 
                           placeholder="blur" blurDataURL={cover} 
                           width={300} height={400} layout="fixed" />
                    </Card>
                    <IsbnBlock />
                    <FileBlock />
                </div>
                <div className={styles.details}>
                    <h2 className={styles.name}>{book.name}</h2>
                    <div className={styles.summary}>{sanitize(book.summary)}</div>
                </div>
            </div>
        </AppLayout>
    )
}

export default Book;

export async function getStaticProps(props: GetStaticPropsContext) {  
    return {
      props: {
        // You can get the messages from anywhere you like. The recommended
        // pattern is to put them in JSON files separated by language and read
        // the desired one based on the `locale` received from Next.js.
        messages: (await import(`../../locales/${props.locale}.json`)).default
      }
    };
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {

    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: 'blocking' //indicates the type of fallback
    }
}