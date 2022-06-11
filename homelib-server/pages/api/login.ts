import type { NextApiRequest, NextApiResponse } from 'next'
import httpStatus from 'http-status-codes'
import _ from 'lodash'
import { login } from '../../services/user'
import { Login } from '../../services/validation';
import jwt from 'jsonwebtoken';
const jwtSecret = process.env.JWT_SECRET || 'chairs55';

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
      const user = await login(req.body);
      const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '7d' });
      res.setHeader('Cookies', token);
      res.status(httpStatus.OK).json({ message: 'Logged in' });
    } else {
      res.status(httpStatus.METHOD_NOT_ALLOWED).end();
    }
  } catch(e) {
    console.log(e);  
    res.status(httpStatus.INTERNAL_SERVER_ERROR).end();
  }
}