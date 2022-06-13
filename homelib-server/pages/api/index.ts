import type { NextApiRequest, NextApiResponse } from 'next'
import httpStatus from 'http-status-codes'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
      console.log('request received');
      console.log(req.cookies);

      res.status(httpStatus.OK).json({});

}