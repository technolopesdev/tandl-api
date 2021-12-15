import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import Utils from '../../lib/Utils';
import sendMail from '../../lib/sendMail';
import fs from 'fs/promises';
import path from 'path';

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
    public static async verify(req: Request, res: Response): Promise<Response> {
        const { email, code } = req.body;
        try {
            const user = await prisma.users.findFirst({
                where: {
                    email
                }
            });
            if(!user) return res.send({
                success: false,
                message: 'User not found!'
            });
            const auth = await prisma.auth.findFirst({
                where: {
                    user_id: user.id
                }
            });
            if(!auth) return res.send({
                success: false,
                message: 'Can\'t authenticate your request'
            });
            if(auth.code !== code) return res.send({
                success: false,
                message: 'Invalid code!'
            });
            await prisma.auth.delete({
                where: {
                    id: auth.id
                }
            });
            await prisma.users.update({
                where: {
                    id: user.id
                },
                data: {
                    confirmed: true
                }
            });
            return res.send({
                success: true,
                token: Utils.token(user.id)
            });
        }catch(e) {
            return res.send({
                success: false,
                message: 'An error ocurred!'
            });
        }
    }
    public static async login(req: Request, res: Response): Promise<Response> {
        const { email, password } = req.body;
        try {
            const user = await prisma.users.findFirst({
                where: {
                    email
                }
            });
            if(!user) return res.send({
                success: false,
                message: 'User not found!'
            });
            if(!await argon2.verify(user.password, password)) return res.send({
                success: false,
                message: 'Invalid password or email'
            });
            return res.send({
                success: true,
                token: Utils.token(user.id)
            });
        }catch(e) {
            return res.send({
                success: false,
                message: 'An error ocurred!'
            });
        }
    }
    public static async index(req: Request, res: Response): Promise<Response> {
        const { userId } = req;
        try {
            const user = await prisma.users.findFirst({ where: { id: userId }, include: {
                invites: true,
                posts: true
            } });
            if(!user) return res.send({
                success: false,
                message: 'User not found!'
            });
            return res.send({
                success: true,
                user
            });
        }catch(e) {
            return res.send({
                success: false,
                message: 'An error ocurred!'
            });
        }
    }
    public static async changeProfileImage(req: Request, res: Response): Promise<Response> {
        const { userId } = req;
        try {
            if(!req.file) return res.send({
                success: false,
                message: 'Can\'t get your file!'
            });
            const user = await prisma.users.findFirst({ where: { id: userId }, include: {
                invites: true,
                posts: true
            } });
            if(!user) {
                await fs.unlink(path.resolve(__dirname, '..', '..', '..', 'public', req.file.filename));
                return res.send({
                    success: false,
                    message: 'User not found!'
                });
            }
            if(user.profile !== 'none.png') {
                await fs.unlink(path.resolve(__dirname, '..', '..', '..', 'public', user.profile));
            }
            await prisma.users.update({
                where: {
                    id: user.id
                },
                data: {
                    profile: req.file.filename
                }
            });
            return res.send({
                success: true
            });
        }catch(e) {
            console.log(e);
            return res.send({
                success: false,
                message: 'An error ocurred!'
            });
        }
    }
}

export default UserController;
