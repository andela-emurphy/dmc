/**
 * @class
 */
export default class Response {

  /**
   * @constructor
   */
  constructor() {
    this.status = 200;
  }
  /**
   * Sets status code response
   * @param  {Number} status
   * @return {Object} object
   */
  static setStatus(status) {
    this.status = status;
    return this;
  }

  /**
   * gets status code response
   * @return {Number} object
   */
  static getStatus() {
    return this.status;
  }

  /**
   * Sends a response to client
   * @param  {Object} res - response object
   * @param  {Object} data - response data
   * @returns {Object}  response to be sent to client
   */
  static respond(res, data) {
    return res.status(this.getStatus())
      .json(data);
  }

  /**
   * Method for 200 response.
   * @param  {Object} res - response object
   * @param  {Object} data - data sent back to user
   * @param {String} message - message about response
   * @returns {Object}  response to be sent to client
   */
  static success(res, data) {
    return this.setStatus(200)
      .respond(res, data);
  }

  /**
   * Sends a 404 response to client
   * @param  {Object} res - response object
   * @param {String} message - message about response
   * @returns {Object}  response to be sent to client
   */
  static notFound(res, message) {
    return this.setStatus(404)
      .respond(res, {
        message
      });
  }

  /**
   * Sends a 500 response to client
   * @param  {Object} res - response object
   * @param {String} message - message about response
   * @returns {Object}  response to be sent to client
   */
  static serverError(res, message) {
    return this.setStatus(500)
      .respond(res, {
        message
      });
  }

  /**
   * Sends a 400 response to client
   * @param  {Object} res - response object
   * @param {String} message - message about response
   * @returns {Object}  response to be sent to client
   */
  static badRequest(res, message) {
    return this.setStatus(400)
      .respond(res, {
        message
      });
  }

  /**
   * Sends a 401 response to client
   * @param  {Object} res - response object
   * @param {String} message - message about response
   * @returns {Object}  response to be sent to client
   */
  static unAuthorize(res, message) {
    return this.setStatus(401)
      .respond(res, {
        message
      });
  }

  /**
   * Sends a 403 response to client
   * @param  {Object} res - response object
   * @param {String} message - message about response
   * @returns {Object}  response to be sent to client
   */
  static forbidden(res, message) {
    return this.setStatus(403)
      .respond(res, {
        message
      });
  }


  /**
   * Sends a 201 response to client
   * @param  {Object} res - response object
   * @param  {Object} data - data sent back to user
   * @param {String} message - message about response
   * @returns {Object}  response to be sent to client
   */
  static created(res, data) {
    return this.setStatus(201)
      .respond(res, data);
  }
}
