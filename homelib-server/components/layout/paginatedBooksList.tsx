import styles from '../../styles/Book.module.css' 
import BookListItem from "../schemas/booksList";

import { Button } from "@blueprintjs/core";
import { useState } from 'react';

interface PaginatedBooksListProps {
    data: Array<BookListItem>;
    getData: (page?: number, perPage?: number) => void;
    count: number;
    page: number;
    perPage: number;
}

const ListItem = (itemData: BookListItem, props: PaginatedBooksListProps) => {
    return (
        <div key={itemData.id} className={styles.booksListItem}>
            <h3 className={styles.booksListItemTitle}>{itemData.name}</h3>
            <p className={styles.booksListItemSubtitle}>{itemData.summary}</p>
        </div>
    )
}

const PaginatedList = (props: PaginatedBooksListProps) => {

    const [page, setPage] = useState(1);

    const onChangePage = (page: number) => {
        setPage(page)
        props.getData(page)
    }

    const prevDisabled = page <= 1;
    const nextDisabled = (props.perPage > props.data.length) || (page*props.perPage >= (props.count - 1))

    return <div>
        {props.data.map(item => ListItem(item, props))}
        <div className={styles.booksListPagination}>
            <Button icon="arrow-left" text="Previous" disabled={prevDisabled} onClick={() => onChangePage(page - 1)} />
            <Button rightIcon="arrow-right" text="Next" disabled={nextDisabled} onClick={() => onChangePage(page + 1)} />
        </div>
        </div>
}

export default PaginatedList