import type { NextApiRequest, NextApiResponse } from 'next'
import httpStatus from 'http-status-codes'
import { checkAuth, AuthData } from '../../services/user';
import { getStats } from '../../services/books';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
      try {
        await checkAuth(req, res);
        const stats = await getStats();
        res.status(httpStatus.OK).json(stats);
      } catch(e) {
        console.log(e);
        res.status(httpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' })
      }      

}