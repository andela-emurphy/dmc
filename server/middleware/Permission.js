import Response from '../app/utils/ApiResponse';
import Query from '../app/utils/Query';
import db from '../app/db/models';

/**
 * Admin permission
 * @description verifies user access.
 * makes route endpoint available for
 * admin alone
 * @param  {Object} req - request object
 * @param  {Object} res - response object
 * @param {String}  next - callback if authentication is a success
 * @returns {Object}  response to be sent to client
 * */
export const adminPermission = (req, res, next) => {
  const userId = parseInt(req.params.id, 10);
  if (req.user.role === 'admin') {
    if (userId) {
      Query.findUserById(req, res, next, userId);
    } else {
      next();
    }
  } else {
    return Response.forbidden(res, 'Forbidden! you cannot access this route');
  }
};

/**
 * Admin permission
 * @description verifies user access.
 * makes route endpoint available for
 * admin and regular users
 * @param  {Object} req - request object
 * @param  {Object} res - response object
 * @param {String}  next - callback if authentication is a success
 * @returns {Object}  response to be sent to client
 * */
export const userPermission = (req, res, next) => {
  const userId = parseInt(req.params.id, 10);
  if (req.user.role === 'admin' || req.user.sub === userId) {
    if (req.params.id) {
      Query.findUserById(req, res, next, req.params.id);
    } else {
      next();
    }
  } else {
    return Response.forbidden(res, 'Forbidden! you cannot access this route');
  }
};

/**
 * Document middleware
 * @description abstracts single document
 * query
 * @param  {Object} req - request object
 * @param  {Object} res - response object
 * @param {String}  next - callback if authentication is a success
 * @returns {Object}  response to be sent to client
 * */
export const documentPermission = (req, res, next) => {
  const user = req.user;
  const docId = parseInt(req.params.id, 10);
  db.Document.findById(docId)
    .then((doc) => {
      if (!doc) {
        return Response
          .notFound(res, `Document with id ${docId} not found`);
      }
      req.doc = doc;
      doc.getUser().then((docUser) => {
        req.doc.user = docUser;
        if (req.method === 'GET') {
          next();
        } else if (user.role === 'admin' || user.sub === doc.ownerId) {
          next();
        } else {
          return Response
            .forbidden(res, 'Forbidden! you cannot access this document');
        }
      });
    })
    .catch(err => Response.serverError(res, err));
};
