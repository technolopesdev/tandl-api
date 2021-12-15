import dotenv from 'dotenv';
dotenv.config();

export default function genv(key: string): string {
    const variable = process.env[key];
    if(typeof variable === 'undefined') throw new Error(`Undefined environment variable ${key}`);
    return variable;
}
