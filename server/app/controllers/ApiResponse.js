/**
 * @class
 */
export default class Response {

  /**
   * @constructor
   */
  constructor() {
    this.status = 200;

    this.setStatus = this.setStatus.bind(this);
    this.getStatus = this.setStatus.bind(this);
  }
  /**
   * Sets status code response
   * @param  {Number} status
   * @return {Object} object
   */
  setStatus(status) {
    this.status = status;
    return this;
  }

  /**
   * gets status code response
   * @return {Number} object
   */
  getStatus() {
    return this.status;
  }

  /**
   * Sends a response to client
   * @param  {Object} res - response object
   * @param  {Object} data - response data
   * @returns {Object}  response to be sent to client
   */
  respond(res, data) {
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
  success(res, data = [], message = 'your request was successful') {
    return this.setStatus(200)
      .respond(res, {
        status: true,
        message,
        data
      });
  }

  /**
   * Sends a 404 response to client
   * @param  {Object} res - response object
   * @param {String} message - message about response
   * @returns {Object}  response to be sent to client
   */
  notFound(res, message) {
    return this.setStatus(404)
      .respond(res, {
        status: false,
        message
      });
  }

  /**
   * Sends a 500 response to client
   * @param  {Object} res - response object
   * @param {String} message - message about response
   * @returns {Object}  response to be sent to client
   */
  serverError(res, message) {
    return this.setStatus(500)
      .respond(res, {
        status: false,
        message
      });
  }

  /**
   * Sends a 400 response to client
   * @param  {Object} res - response object
   * @param {String} message - message about response
   * @returns {Object}  response to be sent to client
   */
  badRequest(res, message) {
    return this.setStatus(400)
      .respond(res, {
        status: false,
        message
      });
  }

  /**
   * Sends a 401 response to client
   * @param  {Object} res - response object
   * @param {String} message - message about response
   * @returns {Object}  response to be sent to client
   */
  unAuthorize(res, message) {
    return this.setStatus(401)
      .respond(res, {
        status: false,
        message
      });
  }

  /**
   * Sends a 403 response to client
   * @param  {Object} res - response object
   * @param {String} message - message about response
   * @returns {Object}  response to be sent to client
   */
  forbidden(res, message) {
    return this.setStatus(403)
      .respond(res, {
        status: false,
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
  created(res, data, message = null) {
    return this.setStatus(201)
      .respond(res, {
        status: true,
        message: message || 'Resource created',
        data
      });
  }
}
