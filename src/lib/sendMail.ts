import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';
import ejs from 'ejs';
import genv from './genv';

interface IEmail {
    subject: string;
    data: any;
    email: string;
    template: string;
}

export default async function sendMail({ data, email, subject, template }: IEmail) {
    const file = await fs.readFile(path.resolve(__dirname, '..', '..', 'templates', `${template}.ejs`), {
        encoding: 'utf-8'
    });
    const compiled = ejs.compile(file);
    const transport = nodemailer.createTransport({
        host: genv('MAIL_HOST'),
        port: Number(genv('MAIL_PORT')),
        auth: {
            user: genv('MAIL_USER'),
            pass: genv('MAIL_PASS')
        }
    });
    await transport.sendMail({
        to: email,
        from: 'contato@technolopes.com',
        html: compiled(data),
        subject
    });
}
