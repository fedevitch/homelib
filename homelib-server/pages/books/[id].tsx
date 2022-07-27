import type { GetStaticPaths, GetStaticPropsContext, NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import _ from "lodash"
import AppLayout from '../../components/layout/appLayout'
import { useTranslations } from 'next-intl'
import { fetchBook } from '../../components/services/api'
import { BookData } from '../../components/schemas/booksList'
import styles from '../../styles/Book.module.css'
import { sanitize, fileSize } from '../../components/services/text'
import { getFormatIcon } from '../../components/services/format'
import { 
    Breadcrumbs, IBreadcrumbProps, Button, ButtonGroup, 
    Card, Divider, Elevation, 
    Spinner, SpinnerSize, 
    Tab, Tabs, Tag 
} from '@blueprintjs/core'

const Book: NextPage = () => {
    const t = useTranslations('Books')
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [book, setBook] = useState({ catalogs: Array<String>() } as BookData)
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

    const InfoBlock = () => 
        <Card elevation={Elevation.TWO}>
            <p>{`${t("Pages")}: ${book.pages}`}</p>
            <p>{`${t("Created")}: ${new Date(book.createdOnDisk).toLocaleString()}`}</p>
            <p>{`${t("ISBN")}: ${book.isbn ? book.isbn : t("Unknown")}`}</p>
            <p>{`${t("ISBN")}-10: ${book.isbn10 ? book.isbn10 : t("Unknown")}`}</p>
            <p>{`${t("ISBN")}-13: ${book.isbn13 ? book.isbn13 : t("Unknown")}`}</p>
        </Card>

    const size = fileSize(book.size);
    const FileBlock = () => 
        <Card elevation={Elevation.TWO}>
            <ButtonGroup vertical={false}>
                <Link href={`/api/books/${book.id}/file`} target="_blank" prefetch={false}>
                    <Button text={t("Download")} icon="download" />
                </Link>
                <Divider />
                <Image src={getFormatIcon(book.format?.toString())} width={30} height={20} />
                <Divider />
                <Tag large>{`${size.value} ${t(size.measure)}`}</Tag>
            </ButtonGroup>
        </Card>

    const CatalogTagsBlock = () => {
        const catalogTags: IBreadcrumbProps[] = book.catalogs.map(c =>  ({icon: "folder-close", text: c}) );
        return <Breadcrumbs items={catalogTags} />            
    }

    const renderMeta = () => {
        const header = <thead><tr><td><b>{t("Key")}</b></td><td><b>{t("Value")}</b></td></tr></thead>
        const body = _.map(book.meta, (value, key) => <tr key={key}><td>{key}</td><td>{value}</td></tr>)
        return <table>{header}<tbody>{body}</tbody></table>
    }

    const Summary = () => <div className={styles.summary}>{sanitize(book.summary)}</div>
    const MetaData = () => <div>{renderMeta()}</div>
    const VolumeInfo = () => <div>&right volumeinfo</div>

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
                    <InfoBlock />
                    <FileBlock />
                </div>
                <div className={styles.details}>
                    <h2 className={styles.name}>{book.name}</h2>
                    <CatalogTagsBlock />
                    <Tabs animate renderActiveTabPanelOnly>
                        <Tab id="summary" title={t("Summary")} panel={<Summary />} />
                        <Tab id="meta" title={t("Metadata")} panel={<MetaData />} />
                        <Tab id="volumeinfo" title={t("VolumeInfo")} panel={<VolumeInfo />} />
                    </Tabs>
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