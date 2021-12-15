import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import genv from '../../lib/genv';

export default function auth(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers;
    if(!authorization) return res.send({
        success: false,
        message: 'No token was sent!'
    });
    const parts = authorization.split(' ');
    if(parts.length !== 2) return res.send({
        success: false,
        message: 'Invalid token!'
    });
    const [key, token] = parts;
    if(key !== 'Bearer') return res.send({
        success: false,
        message: 'Invalid token!'
    }); 
    jwt.verify(token, genv('SECRET'), (err, decoded) => {
        if(err) return res.send({
            success: false,
            message: 'Invalid or expired token!'
        });
        if(!decoded) return res.send({
            success: false,
            message: 'Invalid or expired token!'
        });
        req.userId = decoded.id;
        next();
    });
}
