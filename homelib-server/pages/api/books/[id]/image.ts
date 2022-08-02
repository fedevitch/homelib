import type { NextApiRequest, NextApiResponse } from 'next'
import httpStatus from 'http-status-codes'
import { checkAuth } from '../../../../services/user';
import { getBookCover } from '../../../../services/books';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    if(req.method === 'GET'){
      await checkAuth(req, res);

      try {
        const {id} = req.query;
        if(!id) {
          res.status(httpStatus.BAD_REQUEST).end();
          return;
        }

        const image = await getBookCover(Number.parseInt(id.toString())); 
        if(!image) {
          res.status(httpStatus.NOT_FOUND).end();      
          return;
        }
      
        const imageFile = Buffer.from(image.data);
        res.status(httpStatus.OK);
        res.setHeader('Content-Type', 'image/jpg');
        res.setHeader('Content-Length', imageFile.length);    
        res.end(imageFile);
      } catch (e) {
        console.error(e);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
      }
    } else {
      res.status(httpStatus.METHOD_NOT_ALLOWED).end();
    }
  }