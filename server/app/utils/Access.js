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
        break;
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
  * docQuery
  * @description sets up document query
  * when a user tries to get all document
  * @param  {Object} req - request object
  * @param  {Object} search - request object
  * @returns {Promise}  returns a promise
  */
  static docQuery(req) {
    const search = req.query;
    const query = {};
    query.where = { $or: [] };
    if (search.q) {
      query.where.$or.push(
        { title: { $ilike: `%${req.query.q}%` } },
        { content: { $ilike: `%${req.query.q}%` } }
      );
    }
    if (req.user.role !== 'admin') {
      query.where.$or.push({ ownerId: req.user.sub }, { public: 1 });
    }
    if (req.user.role === 'admin' && !search.q) {
      query.where = {};
    }

    search.limit = parseInt(search.limit || 10, 10);
    query.limit = (!search.limit || search.limit > 10) ? 10 : search.limit;
    query.offset = search.offset ? search.offset : 0;
    return query;
  }

  /**
  * userQuery
  * @description sets up user query
  * when a user tries to get all document
  * @param  {Object} req - request object
  * @param  {Object} search - request object
  * @returns {Promise}  returns a promise
  */
  static userQuery(req) {
    const search = req.query;
    let query = { };
    if (req.query.q) {
      query = {
        where: {
          $or: [
            { firstname: { $ilike: `%${req.query.q}%` } },
            { lastname: { $ilike: `%${req.query.q}%` } },
            { username: { $ilike: `%${req.query.q}%` } }
          ]
        }
      };
    }
    search.limit = parseInt(search.limit || 10, 10);
    query.limit = (!search.limit || search.limit > 10) ? 10 : search.limit;
    query.offset = search.offset ? search.offset : 0;
    query.attributes = ['id', 'username',
      'firstname', 'lastname', 'email', 'role'];
    return query;
  }

}
export default Access;
