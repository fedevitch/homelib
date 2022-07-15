import styles from '../../styles/Book.module.css' 
import BookListItem, { getFormatIcon } from "../schemas/booksList";
import _ from "lodash";
import { Button } from "@blueprintjs/core";
import { Fragment, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl'

interface PaginatedBooksListProps {
    data: Array<BookListItem>;
    getData: (page?: number, perPage?: number) => void;
    count: number;
    page: number;
    perPage: number;
}

const PaginatedList = (props: PaginatedBooksListProps) => {
    const t = useTranslations('Books') ;
    const [currentPage, setCurrentPage] = useState(1);

    const ListItem = (itemData: BookListItem) => {
        const title = `${t("Title")}: ${itemData.name}`;
        const description = `${t("Description")}: ${itemData.summary}`;
        return (
            <div key={itemData.id} className={styles.booksListItem}>
                <Image src={getFormatIcon(itemData.format)} 
                       width={70} height={80} alt={itemData.format}
                       className={styles.booksListItemImage} />
                <div className={styles.booksListItemText}>
                    <h3 className={styles.booksListItemTitle}>{title}</h3>
                    <p className={styles.booksListItemSubtitle}>{description}</p>
                </div>
            </div>
        )
    }

    const Pagination = (props: PaginatedBooksListProps) => {
        const maxPage = parseInt((props.count / props.perPage).toFixed(0));
        const prevDisabled = currentPage <= 1;
        const nextDisabled = (props.perPage > props.data.length) || (currentPage >= maxPage);    
    
        const onChangePage = (page: number) => {
            setCurrentPage(page)
            props.getData(page)
        }
    
        const Pages = () => {
            
            const firstRange = _.range(currentPage - 3, currentPage).filter(p => (p > 0) && p !== currentPage);
            const endRange = _.range(currentPage, currentPage + 3).filter(p => (p < maxPage) && p !== currentPage);
            const pagesLeft = firstRange.map(page => <Button key={page} text={page} disabled={currentPage === page} onClick={() => onChangePage(page)} />)
            const pagesRight = endRange.map(page => <Button key={page} text={page} disabled={currentPage === page} onClick={() => onChangePage(page)} />)
            return <Fragment>
                {firstRange.indexOf(1) === -1 && <Button key={1} text={1} disabled={currentPage === 1} onClick={() => onChangePage(1)} />}
                {currentPage > 3 && <Button icon="more" disabled />}
                {pagesLeft}
                {currentPage !== 1 && currentPage !== maxPage && <Button key={currentPage} text={currentPage} disabled />}            
                {pagesRight}
                {(currentPage + 3) <= maxPage && <Button icon="more" disabled />}
                {endRange.indexOf(maxPage) === -1 && <Button key={maxPage} text={maxPage} disabled={currentPage === maxPage} onClick={() => onChangePage(maxPage)} />}
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

    return <div>
            <Pagination {...props} />
            {props.data.map(item => ListItem(item))}
            <Pagination {...props} />
        </div>
}

export default PaginatedList