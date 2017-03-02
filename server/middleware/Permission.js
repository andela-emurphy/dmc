import Response from '../app/utils/ApiResponse';

export const adminPermission = (req, res, next) => {
  if (req.user.role === 'admin') {
    next();
  } else {
    return Response.forbidden(res, 'Forbidden! you cannot access this route');
  }
};

export const userPermission = (req, res, next) => {
  const userId = parseInt(req.params.id, 10);
  if (req.user.role === 'admin' || req.user.sub === userId) {
    next();
  } else {
    return Response.forbidden(res, 'Forbidden! you cannot access this route');
  }
};
