import styles from '../../styles/Books.module.css' 
import BookListItem from "../schemas/booksList";
import _ from "lodash";
import { Button, Breadcrumbs, IBreadcrumbProps } from "@blueprintjs/core";
import { Fragment, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useTranslations } from 'next-intl'
// import { sanitize } from '../services/text';
import { getFormatIcon } from '../services/format'

interface PaginatedBooksListProps {
    data: Array<BookListItem>;
    getData: (page?: number, perPage?: number) => Promise<void>;
    count: number;
    page: number;
    perPage: number;
}

const PaginatedList = (props: PaginatedBooksListProps) => {
    const t = useTranslations('Books');
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);

    const ListItem = (itemData: BookListItem) => {
        const { id, name, isbn, pages, catalogs } = itemData;
        const title = `${t("Title")}: ${name}`;
        // const description = `${t("Description")}: ${sanitize(itemData.summary)}`;
        const catalogTags: IBreadcrumbProps[] = catalogs.map(c =>  ({icon: "folder-close", text: c}) );
        const details1 = `${t("Pages")}: ${pages !== 0 ? pages : t("Unknown")}`;
        const details2 = `${t("ISBN")}: ${isbn ? isbn : t("Unknown")}`;
        const onClick = () => router.push(`/books/${id.toString()}`);
        return (
            <div key={itemData.id} className={styles.booksListItem} onClick={onClick}>
                <Image src={getFormatIcon(itemData.format)} 
                       width={70} height={80} alt={itemData.format}
                       className={styles.booksListItemImage} />
                <div className={styles.booksListItemText}>
                    <h3 className={styles.booksListItemTitle}>{title}</h3>
                    {/* <p className={styles.booksListItemSubtitle}>{description}</p> */}
                    <Breadcrumbs items={catalogTags} />
                    <p>{details1}</p>
                    <p>{details2}</p>
                </div>
            </div>
        )
    }

    const Pagination = (props: PaginatedBooksListProps) => {
        const maxPage = parseInt((props.count / props.perPage).toFixed(0)) || 1;
        const prevDisabled = currentPage <= 1;
        const nextDisabled = (props.perPage > props.data.length) || (currentPage >= maxPage);    
    
        const onChangePage = (page: number) => {
            props.getData(page).then(() => setCurrentPage(page))
        }
    
        const Pages = () => {            
            const firstRange = _.range(currentPage - 3, currentPage).filter(p => (p > 1) && (p < maxPage) && p !== currentPage);
            const endRange = _.range(currentPage, currentPage + 3).filter(p => (p > 1) && (p < maxPage) && p !== currentPage);
            const pagesLeft = firstRange.map(page => <Button key={page} text={page} disabled={currentPage === page} onClick={() => onChangePage(page)} />)
            const pagesRight = endRange.map(page => <Button key={page} text={page} disabled={currentPage === page} onClick={() => onChangePage(page)} />)
            const firstPageButton = <Button key={1} text={1} disabled={currentPage === 1} onClick={() => onChangePage(1)} />
            const lastPageButton = <Button key={maxPage} text={maxPage} disabled={currentPage === maxPage} onClick={() => onChangePage(maxPage)} />
            if(maxPage === 1){
                return firstPageButton
            }
            return <Fragment>
                {firstRange.indexOf(1) === -1 && firstPageButton}
                {currentPage > 5 && <Button icon="more" disabled />}
                {pagesLeft}
                {currentPage !== 1 && currentPage !== maxPage && <Button key={currentPage} text={currentPage} disabled />}            
                {pagesRight}
                {(currentPage + 5) <= maxPage && <Button icon="more" disabled />}
                {endRange.indexOf(maxPage) === -1 && lastPageButton}
            </Fragment>
        }
    
        return(
            <div className={styles.booksListPagination}>
                <Button icon="arrow-left" text={t("Previous")} disabled={prevDisabled} onClick={() => onChangePage(currentPage - 1)} />
                <Pages />
                <Button rightIcon="arrow-right" text={t("Next")} disabled={nextDisabled} onClick={() => onChangePage(currentPage + 1)} />
            </div>
        );
    }

    return <Fragment>
            <Pagination {...props} />
            <div className={styles.booksList}>{props.data.map(item => ListItem(item))}</div>
            {/* <Pagination {...props} /> */}
           </Fragment>
}

export default PaginatedList