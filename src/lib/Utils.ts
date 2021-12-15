import jwt from 'jsonwebtoken';
import genv from './genv';

class Utils {
    public static token(id: string): string {
        return jwt.sign({ id }, genv('SECRET'), {
            expiresIn: 12 * 60 * 60
        });
    }
    public static mathRand(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }
}

export default Utils;
