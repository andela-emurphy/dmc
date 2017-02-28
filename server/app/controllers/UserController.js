import _ from 'underscore';
import db from '../db/models/index';
import Response from './ApiResponse';
import AuthController from './AuthController';

const User = db.User;

/**
 * @class
 */
class UserController {

 /**
  * Gets all user
  * @param {Object} req
  * @param {Object} res
  * @return {Object} res
  */
  static getAll(req, res) {
    AuthController.isAdmin(req)
      .then(() => {
        User.findAll({})
        .then((users) => {
          const data = users.map(user => user.toPublicJson());
          Response.success(res, data);
        })
        .catch(err => Response.serverError(res, err.message));
      })
      .catch(err => Response.unAuthorize(res, err.message));
  }

 /**
  * Gets all user
  * @param {Object} req
  * @param {Object} res
  * @return {Object} res
  */
  static get(req, res) {
    AuthController.hasPermission(req)
    .then(() => {
      const userId = req.params.id;
      User.findById(userId)
        .then((user) => {
          if (!user) {
            return Response.notFound(res, `user with id ${userId} not found`);
          }
          Response.success(res, user.toPublicJson());
        })
      .catch(err => Response.serverError(res, err.message));
    })
    .catch(err => Response.forbidden(res, err.message));
  }

  /**
  * Gets all user
  * @param {Object} req
  * @param {Object} res
  * @return {Object} res
  */
  static create(req, res) {
    const body = _.pick(req.body, ['username',
      'firstname', 'lastname', 'password', 'email', 'role']);
    User.create(body)
      .then(user => Response.created(res, user.toPublicJson()))
      .catch(err => Response.badRequest(res, err.errors));
  }

  /**
  * Gets all user
  * @param {Object} req
  * @param {Object} res
  * @return {Object} res
  */
  static update(req, res) {
    AuthController.hasPermission(req)
   .then((req) => {
     const message = 'update successful';
     const userId = req.user.sub;
     const body = req.body;
     User.findById(userId)
        .then((user) => {
          if (!user) {
            return Response.notFound(res, 'User not found.');
          }
          user.update({
            firstname: body.firstname ? body.firstname : user.firstname,
            lastname: body.lastname ? body.lastname : user.lastname,
            email: body.email ? body.email : user.email,
            password: body.password ? body.password : user.password,
            username: body.username ? body.username : user.username
          })
          .then(data => Response.success(res, data.toPublicJson, message))
          .catch(err => Response.badRequest(res, err.message));
        })
        .catch(err => Response.serverError(res, err.message));
   })
   .catch(err => Response.forbidden(res, err.message));
  }

  /**
  * Gets all user
  * @param {Object} req
  * @param {Object} res
  * @return {Object} res
  */
  static delete(req, res) {
    AuthController.hasPermission(req)
    .then((req) => {
      const userId = req.params.id;
      User.findById(userId)
      .then((user) => {
        if (!user) {
          return Response.notFound(res, 'User not found.');
        }
        return user.destroy()
          .then(() => Response.respond(res, {
            status: true,
            message: 'User deleted'
          }));
      })
      .catch(err => Response.badRequest(res, err.message));
    })
    .catch(err => Response.forbidden(res, err.message));
  }

  /**
  * Gets all user
  * @param {Object} req
  * @param {Object} res
  * @return {Object} res
  */
  static getUserDocuments(req, res) {
    AuthController.hasPermission(req)
      .then((req) => {
        const userId = req.params.id;
        User.findById(userId, {
          include: [
            { model: db.Document },
            { model: db.Role }
          ]
        })
        .then((user) => {
          if (!user) {
            return Response.notFound(res, `user with id ${userId} not found`);
          }
          Response.success(res, user.toPublicJson());
        })
        .catch(err => Response.badRequest(res, err.errors));
      })
      .catch(err => Response.forbidden(res, err.message));
  }
}

export default UserController;
