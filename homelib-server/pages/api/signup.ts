import type { NextApiRequest, NextApiResponse } from 'next'
import { signup } from '../../services/user';

type Data = {
  firstName: string,
  lastName: string,
  email: string,
  password: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    if(req.method === 'POST'){
        await signup(req.body);
        res.status(200).json({ message: 'User created' })
    } else {
        res.status(404);
    }
}