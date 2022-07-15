import type { NextApiRequest, NextApiResponse } from 'next'
import httpStatus from 'http-status-codes'
import { checkAuth, AuthData } from '../../services/user';
import { getBooks } from '../../services/books';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
      try {
        await checkAuth(req.cookies as AuthData);        
      } catch(e) {
        console.log(e);
        res.status(httpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' })
      }
      try {
        const page = parseInt(req.query.page.toString());
        const perPage = parseInt(req.query.perPage.toString()) - 1;
        const books = await getBooks(page, perPage);
        res.status(httpStatus.OK).json(books);
      } catch(e) {
        console.error(e);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
      }     

}