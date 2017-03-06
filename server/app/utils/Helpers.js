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
  * @param  {Object} doc - request object
  * @param  {Object} type - request object
  * @param  {Object} message - request object
  * @returns {Promise}  returns a promise
  */
  static docAccess(req, doc, type = 'public', message) {
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
   * @param {Object} count data count
   * @param {Object} query user query
   * @returns {Object} return an object
   */
  static pagination(count, query) {
    const next = Math.ceil(count / query.limit);
    const currentPage = Math.floor((query.offset / query.limit) + 1);
    return {
      next_offset: parseInt(query.limit + query.offset, 10),
      page_count: next,
      Page: currentPage,
      page_size: query.limit,
      total_count: count
    };
  }
}
export default Access;
