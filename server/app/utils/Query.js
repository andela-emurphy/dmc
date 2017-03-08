import db from '../db/models/index';
import Response from '../utils/ApiResponse';

/**
  * Query class
  * @description simple helper class
  * that  manages user query
  * @class
  */
class Query {

  /**
  * Find User By Id
  * @description queries the database
  * and returns a user cursor if he/she exist
  * in the database
  * @param {Object} req
  * @param {Object} res
  * @param {function}  next callback t
  * @param {Object} userId
  * @return {Object} response
  */
  static findUserById(req, res, next, userId) {
    if (req.method === 'DELETE' && userId === 1) {
      return Response.forbidden(res,
        'Forbidden! super admin cannot be deleted');
    }
    db.User.findById(userId)
      .then((user) => {
        if (!user) {
          return Response
            .notFound(res, `user with id ${userId} not found`);
        }
        req.user.cursor = user;
        return next();
      })
      .catch(err => Response.serverError(res, err.message));
  }

  /**
  * docQuery
  * @description sets up document query
  * when a user tries to get all document
  * @param  {Object} req - request object
  * @param  {Object} search - request object
  * @returns {object}  returns a query object
  */
  static docQuery(req) {
    const role = req.user.role;
    const terms = req.query;
    const query = {};
    const searchQuery = [{ title: { $ilike: `%${req.query.search}%` } },
        { content: { $ilike: `%${req.query.search}%` } }];
    if (role === 'admin') {
      query.where = terms.search ? { $or: searchQuery } : {};
    } else {
      query.where = {
        $or: [
            { ownerId: req.user.sub },
            { access: 'public' }
        ]
      };
    }
    if (terms.search && role !== 'admin') {
      query.where.$or.push(searchQuery);
    }
    terms.limit = parseInt(terms.limit || 10, 10);
    query.limit = (!terms.limit || terms.limit < 0) ? 10 : terms.limit;
    query.offset = (!terms.offset || terms.offset < 0) ? 0 : terms.offset;
    return query;
  }

  /**
  * userQuery
  * @description sets up user query
  * when a user tries to get all document
  * @param  {Object} req - request object
  * @param  {Object} search - request object
  * @returns {object}  returns a query object
  */
  static userQuery(req) {
    const terms = req.query;
    let query = { };
    if (req.query.search) {
      query = {
        where: {
          $or: [
            { firstname: { $ilike: `%${terms.search}%` } },
            { lastname: { $ilike: `%${terms.search}%` } },
            { username: { $ilike: `%${terms.search}%` } }
          ]
        }
      };
    }
    terms.limit = parseInt(terms.limit || 10, 10);
    query.limit = (!terms.limit || terms.limit < 0) ? 10 : terms.limit;
    query.offset = (!terms.offset || terms.offset < 0) ? 0 : terms.offset;
    query.attributes = ['id', 'username',
      'firstname', 'lastname', 'email', 'role'];
    return query;
  }

  /**
  * roleQuery
  * @description sets up role query
  * when a user tries to get all document
  * @param  {Object} req - request object
  * @param  {Object} search - request object
  * @returns {object}  returns a query object
  */
  static roleQuery(req) {
    const terms = req.query;
    let query = {};
    if (req.query.search) {
      query = {
        where: {
          title: { $ilike: `%${terms.search}%` }
        }
      };
    }
    terms.limit = parseInt(terms.limit || 10, 10);
    query.limit = (!terms.limit || terms.limit < 0) ? 10 : terms.limit;
    query.offset = (!terms.offset || terms.offset < 0) ? 0 : terms.offset;
    return query;
  }
}

export default Query;
