import _ from 'underscore';

/**
  * Access class
  * @description simple helper class
  * that controls the access flow of users
  * @class
  */
class Access {

  /**
  * isPublic
  * @description checks if user making that
  * request is an admin
  * @param  {Object} req - request object
  * @param  {Object} type - request object
  * @param  {Object} message - request object
  * @returns {Promise}  returns a promise
  */
  static docAccess(req, type = 'public', message) {
    const doc = req.doc;
    return new Promise((resolve, reject) => {
      const user = req.user;
      switch (type) {
      case 'public':
        if (user.role === 'admin' || doc.public === 1 ||
             doc.ownerId === user.sub) {
          return resolve(req);
        }
        return reject({ message: message ||
            'Forbidden! this document is private' });

      case 'delete':
        if (user.role === 'admin' || user.sub === doc.ownerId) {
          return resolve(req);
        }
        return reject({ message: message ||
            'Forbidden! you can\'t delete this document' });
      case 'editable':
        if (user.role === 'admin' || doc.ownerId === req.user.sub) {
          return resolve(req);
        }
        if (doc.editable === 1 && doc.public === 1) {
          req.body = _.pick(req.body, ['title', 'content']);
          return resolve(req);
        }
        return reject({ message: message ||
            'Forbidden! this document is not editable' });
      default:
        return reject({ message: message ||
            'Forbidden! this document is private' });
      }
    });
  }

  /**
   * Pagination
   * @description sets up pagination for
   * data queries that requires all resource
   * @param {Object} count data count
   * @param {Object} query user query
   * @returns {Object} return an object
   */
  static pagination(count, query) {
    const limit = parseInt(query.limit, 10);
    const offset = parseInt(query.offset, 10);
    const next = Math.ceil(count / limit);
    const currentPage = Math.floor((offset / limit) + 1);
    return {
      next_offset: limit + offset,
      page_count: next,
      Page: currentPage,
      page_size: query.limit,
      total_count: count
    };
  }

   /**
   * errorHandler
   * @description handles errors when
   * use request data triggers a database error
   * data queries that requires all resource
   * @param {Object} errors array of error
   * @returns {Array} return an array
   */
  static errorHandler(errors) {
    return errors.map(error => error.message);
  }
}
export default Access;
