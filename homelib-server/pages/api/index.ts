import type { NextApiRequest, NextApiResponse } from 'next'
import httpStatus from 'http-status-codes'
import { checkAuth, AuthData } from '../../services/user';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
      try {
        await checkAuth(req.cookies as AuthData);
        res.status(httpStatus.OK).json({});
      } catch(e) {
        console.log(e);
        res.status(httpStatus.UNAUTHORIZED).redirect('/login')
      }      

}