import jwt from 'jsonwebtoken';
import moment from 'moment';
import Crypto from 'crypto';
import Promise from 'bluebird';
import _ from 'underscore';
import Response from './ApiResponse';
import db from '../db/models/index';
import UserController from '../controllers/UserController';

const User = db.User;
const secret = process.env.SECRET_KEY;

export default class AuthController  extends Response {

 /**
  * Sends a response to client
  * @param  {Object} req - request object
  * @param  {Object} res - response object
  * @returns {Object}  response to be sent to client
  */
  static login(req, res) {
    const body = req.body;
    console.log(body);
    const message = 'Authentication failed! invalid username or password';
    if (!body.username && !body.password) {
      return super.badRequest(res,
        'Authentication failed! username and password required');
    }
    User.findOne({
      where: { username: body.username }
    }).then((user) => {
      if (!user || !user.isPassword(body.password)) {
        return super.badRequest(res, message);
      }

      const token = jwt.sign({
        sub: user.id,
        role: user.role,
        exp: moment().add(7, 's').valueOf(),
      }, secret);

      user = user.toPublicJson();
      user.token = token;
      db.Token.create({
        token,
      }).then(() => super.success(res, user, 'login successful'))
        .catch(err => super.serverError(res, err.errors));
    });
  }

/**
  * Sends a response to client
  * @param  {Object} req - request object
  * @param  {Object} res - response object
  * @returns {Object}  response to be sent to client
  */
  static logout(req, res) {
    const token = req.token;
    db.Token.findOne({
      where: {
        token_hash: Crypto.createHash('md5').update(token).digest('hex')
      }
    }).then((tokeHash) => {
      tokeHash.destroy()
        .then(() => super.success(res, 'You have been logged out'))
        .catch(err => super.serverError(res, err.message));
    });
  }
}
