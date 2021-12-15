import { Router } from 'express';
import UserController from '../controllers/UserController';
import auth from '../middlewares/auth';
import profilePhoto from '../middlewares/profilePhoto';

const route = Router();

route.post('/create', UserController.create);
route.post('/verify', UserController.verify);
route.post('/login', UserController.login);
route.get('/', auth, UserController.index);
route.post('/profile-photo', auth, profilePhoto.single('image'), UserController.changeProfileImage);

export default route;
