import type { NextApiRequest, NextApiResponse } from 'next'
import httpStatus from 'http-status-codes'
import { checkAuth } from '../../../../services/user';
import { getBookCover } from '../../../../services/books';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    if(req.method === 'GET'){
      checkAuth(req, res);

      try {
        const {id} = req.query;
        if(!id) return res.status(httpStatus.BAD_REQUEST).end();

        const image = await getBookCover(Number.parseInt(id.toString())); 
        if(!image) return res.status(httpStatus.NOT_FOUND).end();      
      
        const imageFile = Buffer.from(image.data);
        res.status(httpStatus.OK);
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Length', imageFile.length);    
        return res.end(imageFile);
      } catch (e) {
        console.error(e);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
      }
    } else {
      return res.status(httpStatus.METHOD_NOT_ALLOWED).end();
    }
  }