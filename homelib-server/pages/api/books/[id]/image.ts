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

      const {id} = req.query;
      if(!id) return res.status(httpStatus.BAD_REQUEST).send(null);

      const image = await getBookCover(Number.parseInt(id.toString())); 
      if(!image) return res.status(httpStatus.NOT_FOUND).send(null);
      
      const imageFile = Buffer.from(image.data);
      res.status(httpStatus.OK);
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Content-Length', imageFile.length);    
      res.end(imageFile);
    } else {
      res.status(httpStatus.METHOD_NOT_ALLOWED).end();
    }
  }