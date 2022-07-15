import styles from '../../styles/Book.module.css' 
import BookListItem, { getFormatIcon } from "../schemas/booksList";

import { Button } from "@blueprintjs/core";
import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl'

interface PaginatedBooksListProps {
    data: Array<BookListItem>;
    getData: (page?: number, perPage?: number) => void;
    count: number;
    page: number;
    perPage: number;
}



const ListItem = (itemData: BookListItem, t: any) => {
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

const PaginatedList = (props: PaginatedBooksListProps) => {
    const t = useTranslations('Books')

    const [page, setPage] = useState(1);

    const onChangePage = (page: number) => {
        setPage(page)
        props.getData(page)
    }

    const prevDisabled = page <= 1;
    const nextDisabled = (props.perPage > props.data.length) || (page*props.perPage >= (props.count - 1))

    return <div>
        {props.data.map(item => ListItem(item, t))}
        <div className={styles.booksListPagination}>
            <Button icon="arrow-left" text={t("Previous")} disabled={prevDisabled} onClick={() => onChangePage(page - 1)} />
            <Button rightIcon="arrow-right" text={t("Next")} disabled={nextDisabled} onClick={() => onChangePage(page + 1)} />
        </div>
        </div>
}

export default PaginatedList