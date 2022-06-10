import db from './database';
import crypto from 'crypto';
import { Users } from '@prisma/client';

class SignupData {
    name!: string;
    firstName!: string; 
    lastName!: string; 
    email!: string; 
    password!: string;
}

export const signup = async (data: SignupData): Promise<Users> => {

    const hash = crypto.createHash('sha512');
    hash.update(data.password);
    const salt = crypto.randomBytes(32).toString('hex');
    hash.update(salt);
    const password = hash.digest('hex');

    const user = await db.users.create({ data: {...data, password, salt} });

    return user;

}