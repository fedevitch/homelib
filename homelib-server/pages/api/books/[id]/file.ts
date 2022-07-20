import type { NextApiRequest, NextApiResponse } from 'next'
import httpStatus from 'http-status-codes'
import { checkAuth } from '../../../../services/user';
import { getFileData } from '../../../../services/books';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    if(req.method === 'GET'){
      checkAuth(req, res);

      const {id} = req.query;
      if(!id) return res.status(httpStatus.BAD_REQUEST).send(null);

      try{
        const fileData = await getFileData(Number.parseInt(id.toString()));
        if(!fileData) return res.status(httpStatus.NOT_FOUND).end();

        const { stream, format, size, name } = fileData;
        res.setHeader("Content-Type", `application/${format}`);
        res.setHeader("Content-Length", size);
        res.setHeader("Content-Disposition", `attachment; filename=${encodeURI(name)}`);
        stream.pipe(res);
      } catch(e) {
        console.error(e);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
      }
    } else {
      res.status(httpStatus.METHOD_NOT_ALLOWED).end();
    }
  }