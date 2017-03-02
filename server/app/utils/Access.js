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
      if (req.user.role === 'admin') {
        return resolve(req);
      } else if (type === 'delete' && req.user.sub === doc.ownerId) {
        return resolve(req);
      } else if (doc.ownerId === req.user.sub ||
        (type === 'public' && doc.public === 1)) {
        return resolve(req);
      } else if (type === 'editable' && doc.ownerId === req.user.sub) {
        return resolve(req);
      } else if (type === 'editable' && doc.public === 0) {
        return reject({
          message: message || 'Forbidden! this document is not editable'
        });
      } else if (type === 'editable' &&
        (doc.public === 1 && doc.editable === 1)) {
        req.body = _.pick(req.body, ['title', 'content']);
        return resolve(req);
      }
      return reject({
        message: message || 'Forbidden! this document is private'
      });
    });
  }


  /**
  * isPublic
  * @description checks if user making that
  * request is an admin
  * @param  {Object} req - request object
  * @param  {Object} search - request object
  * @returns {Promise}  returns a promise
  */
  static docQuery(req, search) {
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
}
export default Access;
