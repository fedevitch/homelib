import { createReadStream, ReadStream } from 'fs';
import db from './database';
import { PaginatedApiResponse } from '../components/schemas/apiResponses'
import { BookStats } from '../components/schemas/bookStats';
import { BooksFilter } from '../components/schemas/apiRequests';
import BookListItem from '../components/schemas/booksList';

const _1Mb = 1e6;
const _20Mb = 20 * _1Mb;
const _50Mb = 50 * _1Mb;
const _100Mb = 100 * _1Mb;

const _small = 100;
const _medium = 500;

export const getStats = async() : Promise<BookStats> => {

    // count all
    const all = await db.book.count();

    // count by formats
    const pdf = await db.book.count({ where: { format: 'pdf' } });
    const djvu = await db.book.count({ where: { format: 'djvu' } });
    const fb2 = await db.book.count({ where: { format: 'fb2' } });
    const epub = await db.book.count({ where: { format: 'epub' } });
    const chm = await db.book.count({ where: { format: 'chm' } });
    const doc = await db.book.count({ where: { OR: [{ format: 'doc' }, { format: 'docx' }] } });
    const comicBook = await db.book.count({ where: { OR: [{ format: 'cbr' }, { format: 'cbz' }] } });

    // count by size
    const less1Mb = await db.book.count({ where: {size: {lte: _1Mb} } });
    const normalSize = await db.book.count({ where: { AND: [ { size:{gt: _1Mb} }, {size:{lte: _20Mb} } ] } });
    const mediumSize = await db.book.count({ where: { AND: [ { size:{gt: _20Mb} }, {size:{lte: _50Mb} } ] } });
    const largeSize = await db.book.count({ where: { AND: [ { size:{gt: _50Mb} }, {size:{lte: _100Mb} } ] } });
    const extraLargeSize = await db.book.count({ where: { size:{gt: _100Mb} } });

    // count by pages count
    const small = await db.book.count({ where: { AND: [ { pages: {gt: 0} }, { pages: {lte: _small} } ] } });
    const medium = await db.book.count({ where: { AND: [ { pages: {gt: _small} }, { pages: {lte: _medium} } ] } });
    const large = await db.book.count({ where: { pages: {gt: _medium} } });

    // count by available data
    const allGood = await db.book.count({ where:{ AND: [
        { summary: { not: '' }}, 
        { meta: { not: {} } },
        { isbn: { not: '' } } 
    ] } });
    const withoutMeta = await db.book.count({ where: { meta: { equals: {} } } });
    const withoutSummary = await db.book.count({ where:{ summary: '' } });
    const withoutAnything = await db.book.count({ where:{ AND: [
        { summary: '' }, 
        { meta: { equals: {} } },
        { isbn: null }
    ] } });
    const withoutISBN = await db.book.count({ where: { isbn: null } });

    return { 
        all, 
        byFormat:{ 
            pdf, djvu, fb2, doc, epub, chm, comicBook, 
        },
        bySize: {
            less1Mb, normalSize, mediumSize, largeSize, extraLargeSize,
        },
        byPages: {
            small, medium, large
        },
        byData: {
            allGood, withoutMeta, withoutSummary, withoutISBN, withoutAnything
        }

    };

}

type Path = {
    fullName: string
}

type WithCatalogs<T> = T & {
    catalogs: Array<String>
}

function includeCatalogs<Book extends Path>(
    book: Book
): WithCatalogs<Book> {
    const allCatalogs = book.fullName.split('/');
    allCatalogs.pop(); // skipping file name here
    const catalogs = [allCatalogs.pop() || '', allCatalogs.pop() || ''].reverse();
    book.fullName = '';
    return {
        ...book,
        catalogs
    }
}

export const getBooks = async(page = 1, perPage = 20, filter?: BooksFilter): Promise<PaginatedApiResponse<BookListItem>> => {
    const selectOptions: any = { select: { id: true, name: true, format: true, 
        /*summary: true*/ 
        pages: true, isbn: true, fullName: true }, 
        skip: page * perPage, take: perPage };
    let where = {};
    if(filter?.searchString || filter?.ISBN){
        const searchString = filter.searchString.toString().toLowerCase().split(" ").join(" & ");
        where = { 
            OR: [
                {name: {search: searchString}}, 
                {summary: {search: searchString}}, 
                {isbn: { equals: filter.ISBN.toString().trim() } }
            ] };
    }
    if(typeof filter?.format === "string" && filter.format !== ""){
        const formatFilter = { in: filter?.format.split(",") } ;
        where['format'] = formatFilter;
    }
    selectOptions.where = where;
    const books = await db.book.findMany(selectOptions);
    const data = books.map(includeCatalogs) as Array<BookListItem>;
    const count = await db.book.count({where});

    return { data, count, page };
}

export const getBook = async(id) => {
    const book = await db.book.findFirst({ where: {id}, include: { volumeInfo: true } });
    if(book)
        return includeCatalogs(book);
}

export const getBookCover = async(bookId: number) => {
    return await db.coverImage.findFirst({ where: { bookId }, select: { data: true } });
}

interface BookFile {
    stream: ReadStream;
    name: string;
    format: string;
    size: number;
}

export const getFileData = async (id: number): Promise<BookFile | null> => {
    const book = await db.book.findFirst({ where: {id}, 
        select: { fullName: true, format: true, name: true, size: true } });
    if(!book) return null;

    const { name, format, size, fullName } = book;
    const stream = createReadStream(fullName);
    return { stream, name, format, size };
}