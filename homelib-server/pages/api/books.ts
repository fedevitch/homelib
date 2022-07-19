import type { NextApiRequest, NextApiResponse } from 'next'
import httpStatus from 'http-status-codes'
import { checkAuth } from '../../services/user';
import { getBooks } from '../../services/books';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
      await checkAuth(req, res); 
      try {
        const page = parseInt(req.query.page.toString()) - 1;
        const perPage = parseInt(req.query.perPage.toString());
        const {searchString, format, ISBN} = req.query;

        const books = await getBooks(page, perPage, { searchString, format, ISBN });
        res.status(httpStatus.OK).json(books);
      } catch(e) {
        console.error(e);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
      }     

}