import db from './database';
import { Book } from '@prisma/client';
import { PaginatedApiResponse } from '../components/schemas/apiResponses'

const _1Mb = 1e6;
const _20Mb = 20 * _1Mb;
const _50Mb = 50 * _1Mb;
const _100Mb = 100 * _1Mb;
const _1Gb = 10 * _100Mb;

export type BookStats = {
    all: number,
    pdf: number,
    djvu: number,
    fb2: number,
    doc: number,
    epub: number,
    comicBook: number,
    chm: number,
    
    less1Mb: number, 
    normalSize: number, 
    mediumSize: number, 
    largeSize: number, 
    extraLargeSize: number
}

export const getStats = async() : Promise<BookStats> => {

    const all = await db.book.count();
    const pdf = await db.book.count({ where: { format: 'pdf' } });
    const djvu = await db.book.count({ where: { format: 'djvu' } });
    const fb2 = await db.book.count({ where: { format: 'fb2' } });
    const epub = await db.book.count({ where: { format: 'epub' } });
    const chm = await db.book.count({ where: { format: 'chm' } });
    const doc = await db.book.count({ where: { OR: [{ format: 'doc' }, { format: 'docx' }] } });
    const comicBook = await db.book.count({ where: { OR: [{ format: 'cbr' }, { format: 'cbz' }] } });

    const less1Mb = await db.book.count({ where: {size: {lte: _1Mb}, pages: {not: 0} } });
    const normalSize = await db.book.count({ where: { AND: [ { size:{gt: _1Mb} }, {size:{lte: _20Mb} } ],  pages: {not: 0} } });
    const mediumSize = await db.book.count({ where: { AND: [ { size:{gt: _20Mb} }, {size:{lte: _50Mb} } ], pages: {not: 0} } });
    const largeSize = await db.book.count({ where: { AND: [ { size:{gt: _50Mb} }, {size:{lte: _100Mb} } ], pages: {not: 0} } });
    const extraLargeSize = await db.book.count({ where: { AND: [ { size:{gt: _100Mb} }, {size:{lte: _1Gb} } ], pages: {not: 0} } });

    return { all, pdf, djvu, fb2, doc, epub, chm, comicBook, less1Mb, normalSize, mediumSize, largeSize, extraLargeSize };

}

export const getBooks = async(page = 1, perPage = 20, search?: string): Promise<PaginatedApiResponse> => {
    const selectOptions: any = { select: { id: true, name: true, format: true, summary: true }, skip: page * perPage, take: perPage };
    let where = {};
    if(search){
        where = { OR: [{name: {contains: search}}, {summary: {contains: search}}] };
        selectOptions.where = where;
    }
    const data = await db.book.findMany(selectOptions);
    const count = await db.book.count({where});

    return { data, count, page };

}