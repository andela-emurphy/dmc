import db from '../db/models';
import Response from '../utils/ApiResponse';
import Query from '../utils/Query';
import Helpers from '../utils/Helpers';

const Role = db.Role;

/**
 * @description
 * managing role endpoint
 * @class
 */
class UserController {


  /**
  * Create Role
  * @description creates a role when POST /roles
  * endpoint is called with valid details
  * @param  {Object} req - request object
  * @param  {Object} res - response object
  * @return {Object} res
  */
  static create(req, res) {
    Role.create(req.body)
      .then(role => Response.created(res, role))
      .catch(err => Response.badRequest(res, Helpers.errorHandler(err.errors)));
  }

  /**
  * Get all roles
  * @description gets all roles when GET /roles
  * endpoint is called. returned data can be further
  * streamlined by passing query params.
  * @param  {Object} req - request object
  * @param  {Object} res - response object
  * @return {Object} res
  */
  static getAll(req, res) {
    const query = Query.roleQuery(req);
    Role.findAndCountAll(query)
    .then((roles) => {
      roles.pagination = Helpers.pagination(roles, query);
      delete roles.count;
      Response.success(res, roles);
    })
    .catch(err => Response.serverError(res, err.message));
  }

 /**
  * Get a role
  * @description gets a single user when GET /roles/:title
  * endpoint is called.
  * @param  {Object} req - request object
  * @param  {Object} res - response object
  * @return {Object} return
  */
  static get(req, res) {
    const title = req.params.title;
    Role.find({
      where: { title }
    })
    .then((role) => {
      if (!role) {
        return Response.notFound(res, `role with title ${title} not found`);
      }
      Response.success(res, role);
    })
    .catch(err => Response.serverError(res, err.message));
  }
}

export default UserController;
