import type { NextApiRequest, NextApiResponse } from 'next'
import httpStatus from 'http-status-codes'
import _ from 'lodash'
import { login } from '../../services/user'
import { Login } from '../../services/validation';

import { setCookies } from 'cookies-next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if(req.method === 'POST'){
      const { error } = Login.validate(req.body);
      if(error) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: 'Wrong credentials' });
      }
      const token = await login(req.body);      
      
      setCookies('Token', token, { req, res, maxAge: 7 * 24 * 60 * 60 });
      res.status(httpStatus.OK).json({ message: 'Logged in' });
    } else {
      res.status(httpStatus.METHOD_NOT_ALLOWED).end();
    }
  } catch(e) {
    console.log(e);  
    res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
  }
}