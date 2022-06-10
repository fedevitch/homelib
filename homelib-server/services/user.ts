import db from './database';
import crypto from 'crypto';
import { User } from '@prisma/client';

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