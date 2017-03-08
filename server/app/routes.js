import AuthController from './controllers/AuthController';
import UserController from './controllers/UserController';
import AuthMiddleware from '../middleware/Auth';
import { userPermission, adminPermission, documentPermission }
  from '../middleware/Permission';
import DocumentController from '../app/controllers/DocumentController';
import RoleController from '../app/controllers/RoleController';

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
  Router.get('/users/:id/documents', userPermission,
    UserController.getUserDocuments);

   // manage documents
  Router.post('/documents', DocumentController.create);
  Router.get('/documents', DocumentController.getAll);
  Router.get('/documents/:id', documentPermission, DocumentController.get);
  Router.put('/documents/:id', documentPermission, DocumentController.update);
  Router.delete('/documents/:id', documentPermission,
    DocumentController.delete);

  // manage roles
  Router.post('/roles', adminPermission, RoleController.create);
  Router.get('/roles', adminPermission, RoleController.getAll);
  Router.get('/roles/:title', userPermission, RoleController.get);
  Router.get('/roles/title', userPermission,
    UserController.getUserDocuments);

  app.get('/', (req, res) => {
    res.send('Welcome to the ultimate document manager');
  });
  app.use('/', AuthMiddleware, Router);
};
