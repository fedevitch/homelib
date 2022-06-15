import db from './database';
import { Book } from '@prisma/client';

export type BookStats = {
    allCount: number,
    pdfCount: number,
    djvuCount: number,
    fb2Count: number
}

export const getStats = async() : Promise<BookStats> => {

    const allCount = await db.book.count();
    const pdfCount = await db.book.count({ where: { format: 'pdf' } });
    const djvuCount = await db.book.count({ where: { format: 'djvu' } });
    const fb2Count = await db.book.count({ where: { format: 'fb2' } });

    return { allCount, pdfCount, djvuCount, fb2Count };

}