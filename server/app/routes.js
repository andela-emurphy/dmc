import AuthController from './controllers/AuthController';
import UserController from './controllers/UserController';
import AuthMiddleware from '../middleware/Auth';

export default (express, app) => {
  const Router = express.Router();

  // authentication
  app.post('/users/login', AuthController.login);
  Router.post('/users/logout', AuthController.logout);

  // manage users
  app.post('/users', UserController.create);


  app.use('/', AuthMiddleware, Router);
};
