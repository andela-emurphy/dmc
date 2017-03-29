
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
  * @param  {Object} message - request object
  * @returns {Promise}  returns a promise
  */
  static docAccess(req, message) {
    const doc = req.doc;
    const user = req.user;
    return new Promise((resolve, reject) => {
      switch (doc.access) {
      case 'private':
        if (user.role === 'admin' || user.sub === doc.ownerId) {
          return resolve(req);
        }
        return reject({
          message: message || 'Forbidden! this document is private'
        });
      case 'public': return resolve(req);
      case 'role':
        if (user.role === 'admin' ||
          user.sub === doc.ownerId || doc.user.role === user.role) {
          resolve(req);
        }
        return reject({
          message: message || 'Forbidden! this document is private'
        });
      default:
        return reject({
          message: message || 'Forbidden! this document is private'
        });
      }
    });
  }

  /**
   * Pagination
   * @description sets up pagination for
   * data queries that requires all resource
   * @param {Object} data data count
   * @param {Object} query user query
   * @returns {Object} return an object
   */
  static pagination(data, query) {
    const next = Math.ceil(data.count / query.limit);
    const currentPage = Math.floor((query.offset / query.limit) + 1);
    data.pagination = {
      page_count: next,
      page: currentPage,
      page_size: data.rows.length,
      total_count: data.count
    };
    delete data.count;
    return data;
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
