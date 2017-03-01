import AuthController from './controllers/AuthController';
import UserController from './controllers/UserController';
import AuthMiddleware from '../middleware/Auth';
import { userPermission, adminPermission } from '../middleware/Permission';

export default (express, app) => {
  const Router = express.Router();

  // authentication
  app.post('/users/login', AuthController.login);
  Router.post('/users/logout', AuthController.logout);

  // manage users
  app.post('/users', UserController.create);
  Router.get('/users', adminPermission, UserController.getAll);
  Router.get('/users/:id', userPermission, UserController.get);
  Router.put('/users/:id', userPermission, UserController.update);
  Router.delete('/users/:id', adminPermission, UserController.delete);
  Router.get('/users/:id/documents', userPermission, UserController.getUserDocuments);



  app.use('/', AuthMiddleware, Router);
};
