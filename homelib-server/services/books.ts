import db from './database';
import { Book } from '@prisma/client';
import { PaginatedApiResponse } from '../components/schemas/apiResponses'

const _1Mb = 1e6;
const _20Mb = 20 * _1Mb;
const _50Mb = 50 * _1Mb;
const _100Mb = 100 * _1Mb;
const _1Gb = 10 * _100Mb;

export type BookStats = {
    allCount: number,
    pdfCount: number,
    djvuCount: number,
    fb2Count: number,
    
    less1Mb: number, 
    normalSize: number, 
    mediumSize: number, 
    largeSize: number, 
    extraLargeSize: number
}

export const getStats = async() : Promise<BookStats> => {

    const allCount = await db.book.count();
    const pdfCount = await db.book.count({ where: { format: 'pdf' } });
    const djvuCount = await db.book.count({ where: { format: 'djvu' } });
    const fb2Count = await db.book.count({ where: { format: 'fb2' } });

    const less1Mb = await db.book.count({ where: {size: {lte: _1Mb}} });
    const normalSize = await db.book.count({ where: { AND: [ { size:{gt: _1Mb} }, {size:{lte: _20Mb} } ] } });
    const mediumSize = await db.book.count({ where: { AND: [ { size:{gt: _20Mb} }, {size:{lte: _50Mb} } ] } });
    const largeSize = await db.book.count({ where: { AND: [ { size:{gt: _50Mb} }, {size:{lte: _100Mb} } ] } });
    const extraLargeSize = await db.book.count({ where: { AND: [ { size:{gt: _100Mb} }, {size:{lte: _1Gb} } ] } });

    return { allCount, pdfCount, djvuCount, fb2Count, less1Mb, normalSize, mediumSize, largeSize, extraLargeSize };

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