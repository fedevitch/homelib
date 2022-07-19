import db from './database';
import crypto from 'crypto';
import { User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status-codes';
import { NextApiRequest, NextApiResponse } from 'next';
const jwtSecret = process.env.JWT_SECRET || 'chairs55';

type SignupData = {
    name: string,
    firstName: string, 
    lastName: string; 
    email: string; 
    password: string;
}

export const signup = async (data: SignupData): Promise<User> => {

    const hash = crypto.createHash('sha512');
    hash.update(data.password);
    const salt = crypto.randomBytes(32).toString('hex');
    hash.update(salt);
    const password = hash.digest('hex');

    const user = await db.user.create({ data: {...data, password, salt} });

    return user;
}

type LoginData = {
    email: string; 
    password: string;
}

type TokenData = {
    id: number
}

export const login = async (data: LoginData): Promise<string> => {
    const user = await db.user.findFirst({ where: {email: data.email} });
    if(!user) {
        throw 'Wrong credentials';
    }
    const hash = crypto.createHash('sha512');
    hash.update(data.password);
    hash.update(user.salt);
    if(hash.digest('hex') !== user.password) {
        throw 'Wrong credentials'
    }

    const token = jwt.sign({ id: user.id } as TokenData, jwtSecret, { expiresIn: '7d' });
    return token;
}

export type AuthData = {
    Token: string
}

export const checkUser = async (authData: AuthData) => {
    if(!authData.Token){
        throw 'Unauthorized'
    } else {
        const decoded = jwt.verify(authData.Token, jwtSecret) as TokenData;
        if(!decoded.id){
            throw 'Unauthorized'
        }

        const user = await db.user.findFirst({ where: {id: decoded.id} });
        if(!user) {
            throw 'Unauthorized'
        }

    }

}

export const checkAuth = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await checkUser(req.cookies as AuthData);        
    } catch(e) {
        console.log(e);
        res.status(httpStatus.UNAUTHORIZED).json({ message: 'Unauthorized' })
    }
}