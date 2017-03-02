import _ from 'underscore';
import db from '../db/models/index';
import Response from '../utils/ApiResponse';

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
  static create(req, res) {
    const body = _.pick(req.body, ['username',
      'firstname', 'lastname', 'password', 'email', 'role']);
    User.create(body)
      .then(user => Response.created(res, user.toPublicJson()))
      .catch(err => Response.badRequest(res, err.errors));
  }
}

export default UserController;
