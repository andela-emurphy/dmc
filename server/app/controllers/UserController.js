import _ from 'underscore';
import db from '../db/models/index';
import Response from '../utils/ApiResponse';
import Query from '../utils/Query';
import Helpers from '../utils/Helpers';

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
    const body = _.omit(req.body, 'role');
    User.create(body)
      .then(user => Response.created(res, user.toPublicJson()))
      .catch(err => Response.badRequest(res, err.errors));
  }

  /**
  * Gets all user
  * @description gets all user when GET /users
  * endpoint is called. returned data can be further
  * streamlined by passing query params.
  * @param {Object} req
  * @param {Object} res
  * @return {Object} res
  */
  static getAll(req, res) {
    const query = Query.userQuery(req);
    User.findAndCountAll(query)
    .then((data) => {
      data.pagination = Helpers.pagination(data.count, query);
      Response.success(res, data, 'query successful');
    })
    .catch(err => Response.serverError(res, err.message));
  }

 /**
  * Get a single document
  * @description gets a single user when GET /users/:id
  * endpoint is called.
  * @param {Object} req
  * @param {Object} res
  * @return {Object} res
  */
  static get(req, res) {
    const user = req.user.cursor;
    Response.success(res, user.toPublicJson(), 'query successful');
  }

  /**
  * Updates a single document
  * @description gets a single user when GET /users/:id
  * endpoint is called.
  * @param {Object} req
  * @param {Object} res
  * @return {Object} res
  */
  static update(req, res) {
    const body = _.pick(req.body, ['firstname', 'lastname',
      'email', 'password', 'username']);
    if (req.user.role === 'admin' && req.user.sub !== 1) {
      body.role = req.body.role || req.user.role;
    }
    req.user.cursor.update(body)
      .then(data => Response.success(res, data.toPublicJson, 'user updated'))
      .catch(error => Response.badRequest(res, error.errors));
  }

  /**
  * Updates a single document
  * @description gets a single user when GET /users/:id
  * endpoint is called.
  * @param {Object} req
  * @param {Object} res
  * @return {Object} response object
  */
  static delete(req, res) {
    req.user.cursor.destroy()
      .then(() => Response.respond(res, { message: 'User deleted' }))
      .catch(error => Response.badRequest(res, { message: error.errors }));
  }

  /**
  * Gets all user
  * @param {Object} req
  * @param {Object} res
  * @return {Object} res
  */
  static getUserDocuments(req, res) {
    req.user.cursor.getDocuments(Query.docQuery(req))
      .then((doc) => {
        Response.success(res, doc, 'query successful');
      })
    .catch(err => Response.badRequest(res, err.errors));
  }
}

export default UserController;
