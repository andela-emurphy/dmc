
/**
  * Access class
  * @description simple helper class
  * that controls the access flow of users
  * @class
  */
class Access {

  /**
  * isAdmin
  * @description checks if user making that
  * request is an admin
  * @param  {Object} req - request object
  * @returns {Promise}  returns a promise
  */
  static isAdmin(req) {
    return new Promise((resolve, reject) => {
      if (req.user.role === 'admin') {
        return resolve(req.user);
      }
      return reject({
        message: 'Unauthorized! only admins can access this route'
      });
    });
  }

  /**
  * hasPermission
  * @description checks if user making that
  * request is an admin
  * @param  {Object} req - request object
  * @returns {Promise}  returns a promise
  */
  static hasPermission(req, message) {
    return new Promise((resolve, reject) => {
      const userId = parseInt(req.params.id, 10);
      if (req.user.role === 'admin' || req.user.sub === userId) {
        return resolve(req);
      }
      return reject({
        message: message || 'Forbidden! you cannot access this resource'
      });
    });
  }

  /**
  * isPublic
  * @description checks if user making that
  * request is an admin
  * @param  {Object} req - request object
  * @returns {Promise}  returns a promise
  */
  static docAccess(req, doc, type = 'public', message) {
    return new Promise((resolve, reject) => {
      if (doc.ownerId === req.user.sub || doc[type] === 1) {
        return resolve(doc);
      } else if (req.user.role === 'admin') {
        return resolve(doc);
      }
      return reject({
        message: message || 'Forbidden! this document is private'
      });
    });
  }
}
export default Access;
