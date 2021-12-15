import { Application } from 'express';
import fs from 'fs/promises';
import path from 'path';

export default async function useRouter(app: Application): Promise<void> {
    const routedir = await fs.readdir(path.resolve(__dirname, '..', 'app', 'routes'));
    routedir.forEach(value => {
        const pathname = value.replace(/.ts/g, '').replace(/.js/g, '').replace(/index/g, '').replace(/_/g, '/');
        app.use(`/${pathname}`, require(`../app/routes/${value}`).default);
    });
}
