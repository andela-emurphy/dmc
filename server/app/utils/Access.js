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
}
export default Access;
