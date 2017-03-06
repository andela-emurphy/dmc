import Response from '../app/utils/ApiResponse';
import Query from '../app/utils/Query';


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
 * Document permission
 * @description verifies document access.
 * makes route endpoint available for
 * admin and users
 * @param  {Object} req - request object
 * @param  {Object} res - response object
 * @param {String}  next - callback if authentication is a success
 * @returns {Object}  response to be sent to client
 * */
export const documentPermission = (req, res, next) => {
  const docId = parseInt(req.params.id, 10);
  Query.findDocById(req, res, next, docId);
};
