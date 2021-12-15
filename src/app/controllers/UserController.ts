import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import Utils from '../../lib/Utils';
import sendMail from '../../lib/sendMail';

const prisma = new PrismaClient();

class UserController {
    public static async create(req: Request, res: Response): Promise<Response> {
        const { first_name, last_name, username, email, password } = req.body;
        try {
            if(await prisma.users.findFirst({ where: { email } })) return res.send({
                success: false,
                message: 'This email is unavailable!'
            });
            const hash = await argon2.hash(password);
            const user = await prisma.users.create({
                data: {
                    first_name,
                    last_name,
                    username,
                    email,
                    password: hash,
                    tag: Utils.tag()
                }
            });
            const auth = await prisma.auth.create({
                data: {
                    user_id: user.id,
                    code: Utils.mathRand(100000,999999)
                }
            });
            await sendMail({
                data: {
                    title: 'Confirm your email',
                    code: auth.code,
                    name: user.first_name
                },
                email,
                subject: 'Confirm your email',
                template: 'code'
            });
            return res.send({
                success: true
            });
        }catch(e) {
            return res.send({
                success: false,
                message: 'An error ocurred!'
            });
        }
    }
}

export default UserController;
