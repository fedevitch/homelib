import type { NextApiRequest, NextApiResponse } from 'next'
import httpStatus from 'http-status-codes'
import _ from 'lodash'
import { signup } from '../../services/user'
import { Signup } from '../../services/validation';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if(req.method === 'POST'){
      const { error } = Signup.validate(req.body);
      if(error) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: error.details.map(d => d.message).join(" ") });
      }
      await signup(req.body);
      res.status(httpStatus.OK).json({ message: 'User created' })
    } else {
      res.status(httpStatus.METHOD_NOT_ALLOWED).end();
    }
  } catch(e) {
    if(_.get(e, 'meta.target', []).indexOf('email') > -1) {
      return res.status(httpStatus.CONFLICT).json({ message: 'Email is already registered' })
    }
    res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
  }
}