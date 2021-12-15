import { Router } from 'express';
import UserController from '../controllers/UserController';

const route = Router();

route.post('/create', UserController.create);

export default route;
