import type { NextApiRequest, NextApiResponse } from 'next'
import httpStatus from 'http-status-codes'
import { checkAuth } from '../../../../services/user';
import { getBook } from '../../../../services/books';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    if(req.method === 'GET'){
      await checkAuth(req, res);

      const {id} = req.query;
      if(!id) return res.status(httpStatus.BAD_REQUEST).send(null);

      const book = await getBook(Number.parseInt(id.toString()));
      if(!book) return res.status(httpStatus.NOT_FOUND).end();

      res.status(httpStatus.OK).send(book);
    } else {
      res.status(httpStatus.METHOD_NOT_ALLOWED).end();
    }
  }