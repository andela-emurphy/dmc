import _ from 'underscore';
import db from '../db/models/index';
import Response from '../utils/ApiResponse';
import Access from '../utils/Access';

const User = db.User;

/**
 * @class
 */
class UserController {


  /**
  * Create User
  * @description creates a user when POST /users
  * endpoint is called with valid details
  * @param {Object} req
  * @param {Object} res
  * @return {Object} res
  */
  static create(req, res) {
    const body = _.pick(req.body, ['id', 'username',
      'firstname', 'lastname', 'password', 'email']);
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
  static getAll(req, res) {
    const query = Access.userQuery(req);
    User.findAndCountAll(query)
    .then((data) => {
      data.next = Math.floor(data.count / query.limit) || data.count;
      Response.success(res, data, 'query successful');
    })
    .catch(err => Response.serverError(res, err.message));
  }

 /**
  * Get
  * @description gets a single user details
  * @param {Object} req
  * @param {Object} res
  * @return {Object} res
  */
  static get(req, res) {
    const userId = req.params.id;
    User.findById(userId)
      .then((user) => {
        if (!user) {
          return Response.notFound(res, `user with id ${userId} not found`);
        }
        Response.success(res, user.toPublicJson(), 'query successful');
      })
    .catch(err => Response.serverError(res, err.message));
  }

  /**
  * Updates a user details
  * @param {Object} req
  * @param {Object} res
  * @return {Object} res
  */
  static update(req, res) {
    const body = _.pick(req.body, ['firstname', 'lastname',
      'email', 'password', 'username']);
    const userId = req.user.sub;
    User.findById(userId)
      .then((user) => {
        if (!user) {
          return Response.notFound(res, 'User not found.');
        }
        if (req.user.role === 'admin' && req.user.sub !== 1) {
          body.role = req.body.role || user.role;
        }
        user.update(body)
        .then(data => Response.success(res, data.toPublicJson, 'user updated'))
        .catch(err => Response.badRequest(res, err.message));
      })
      .catch(err => Response.serverError(res, err.message));
  }

  /**
  * Gets all user
  * @param {Object} req
  * @param {Object} res
  * @return {Object} res
  */
  static delete(req, res) {
    const userId = req.params.id;
    User.findById(userId)
    .then((user) => {
      if (!user) {
        return Response.notFound(res, 'User not found.');
      }
      if (user.role === 'admin') {
        return Response.badRequest(res, 'You cannot delete your self');
      }
      return user.destroy()
        .then(() => Response.respond(res, {
          status: true,
          message: 'User deleted'
        }));
    })
    .catch(err => Response.badRequest(res, err.message));
  }

  /**
  * Gets all user
  * @param {Object} req
  * @param {Object} res
  * @return {Object} res
  */
  static getUserDocuments(req, res) {
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
      Response.success(res, user.toPublicJson(), 'query successful');
    })
    .catch(err => Response.badRequest(res, err.errors));
  }
}

export default UserController;
