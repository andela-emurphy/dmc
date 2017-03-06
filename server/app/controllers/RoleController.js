import db from '../db/models/index';
import Response from '../utils/ApiResponse';

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
  * @param {Object} req
  * @param {Object} res
  * @return {Object} res
  */
  static create(req, res) {
    Role.create(req.body)
      .then(role => Response.created(res, role))
      .catch(err => Response.badRequest(res, err.errors));
  }

  /**
  * Get all roles
  * @description gets all roles
  * @param {Object} req
  * @param {Object} res
  * @return {Object} res
  */
  static getAll(req, res) {
    const search = req.query;
    let query = {};
    if (req.query.q) {
      query = {
        where: {
          title: { $ilike: `%${search.q}%` }
        }
      };
    }
    search.limit = parseInt(search.limit || 10, 10);
    query.limit = (!search.limit || search.limit > 10) ? 10 : search.limit;
    query.offset = search.offset ? search.offset : 0;
    Role.findAndCountAll(query)
    .then((data) => {
      data.next = Math.floor(data.count / query.limit) || data.count;
      Response.success(res, data, 'query successful');
    })
    .catch(err => Response.serverError(res, err.message));
  }

 /**
  * Get a role
  * @description gets a single role
  * @param {Object} req
  * @param {Object} res
  * @return {Object} res
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
      Response.success(res, role, 'query successful');
    })
    .catch(err => Response.serverError(res, err.message));
  }
}

export default UserController;
