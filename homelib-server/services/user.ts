import db from '../db';
import crypto from 'crypto';

class SignupData {
    firstName!: string; 
    lastName!: string; 
    email!: string; 
    password!: string;
}

export const signup = async (data: SignupData): Promise<object> => {

    console.log(data);
    const hash = crypto.createHash('sha512');
    hash.update(data.password);
    const salt = crypto.randomBytes(32).toString('hex');
    hash.update(salt);
    const password = hash.digest('hex');
    
    console.log(db.User);

    const user = await db.User.create({ ...data, password, salt });

    return user;

}