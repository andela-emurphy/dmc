import Crypto from 'crypto';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import db from '../app/db/models/index';
import Response from '../app/utils/ApiResponse';

dotenv.config();

const secret = process.env.SECRET_KEY;

export default (req, res, next) => {
  let payload;
  const authToken = req.get('Authorization') || '';

  const userToken = authToken.split(' ')[1] || '';
  const bearer = authToken.split(' ')[0];
  if (bearer !== 'Bearer') {
    return Response.unAuthorize(res, 'Authorization Bearer not found');
  }

  try {
    payload = jwt.verify(userToken, secret);
  } catch (error) {
    return Response
      .unAuthorize(res, 'Authorization denied! Invalid token');
  }

  db.Token.findOne({
    where: {
      token_hash: Crypto.createHash('md5').update(userToken).digest('hex')
    }
  })
  .then((token) => {
    if (!token) {
      throw new Error('You need to login to access this route');
    }
    req.user = payload;
    req.token = userToken;
    next();
  })
  .catch(err => Response.unAuthorize(res, err.message));
};
