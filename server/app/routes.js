import AuthController from './controllers/AuthController';
import UserController from './controllers/UserController';
// const user = new UserController();

export default (express, app) => {
  const Router = express.Router();

  // authentication
  app.post('/users/login', AuthController.login);
  Router.post('/users/logout', AuthController.logout);

  // manage users
  app.post('/users', UserController.create);
  Router.get('/users', UserController.getAll);
  Router.get('/users/:id', UserController.get);
  Router.put('/users/:id', UserController.update);
  Router.delete('/users/:id', UserController.delete);


  app.use('/', Router);
};
