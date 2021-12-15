import { Router } from 'express';
import UserController from '../controllers/UserController';

const route = Router();

route.post('/create', UserController.create);
route.post('/verify', UserController.verify);
route.post('/login', UserController.login);

export default route;
