import express, { Application } from 'express';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import morgan from 'morgan';
import http from 'http';
import cors from 'cors';
import useRouter from '../lib/useRouter';
import genv from '../lib/genv';

class App {
    public app: Application;
    constructor() {
        this.app = express();
        this.middlewares();
        this.database();
        this.routes();
    }
    private middlewares(): void {
        /**
         * All middlewares here
         */
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use('/cdn', express.static('public'));
    }
    private database(): void {
        /**
         * All database global configuration
         */
        mongoose.connect(genv('MONGO_URL'));
    }
    private async routes(): Promise<void> {
        /**
         * Routes
         */
        await useRouter(this.app);
    }
}

const application = new App();
const server = http.createServer(application.app);
const io = new Server(server);
export { io, server };
