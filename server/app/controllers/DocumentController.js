import db from '../db/models';
import Response from '../utils/ApiResponse';
import Query from '../utils/Query';
import Helpers from '../utils/Helpers';

const Document = db.Document;

/**
 * @class
 */
export default class DocumentController extends Response {

  /**
   * Gets all document
   * @description gets all documents
   * Takes a query limit and sets number
   * document to return, offset number of
   * doc to skip and query for word to find.
   * @param  {Object} req - request object
   * @param  {Object} res - response object
   * @return {Object} response
   */
  static getAll(req, res) {
    const query = Query.docQuery(req);
    Document.findAndCountAll(query)
      .then((data) => {
        data = Helpers.pagination(data, query);
        Response.success(res, data);
      })
      .catch(err => Response.serverError(res, err.message));
  }


  /**
   * Gets a single document
   * @description returns a single document
   * when GET /documents is called
   * base on the the owner, admin access, and
   * if the document is public
   * @param  {Object} req - request object
   * @param  {Object} res - response object
   * @return {Object} response
   */
  static get(req, res) {
    Helpers.docAccess(req)
      .then(() => Response.success(res, req.doc))
      .catch(err => Response.unAuthorize(res, err.message));
  }


  /**
   * Create a  document
   * @description creates a new document
   * when POST /documents is called
   * assigns that document to the creator
   * @param  {Object} req - request object
   * @param  {Object} res - response object
   * @return {Object} response
   */
  static create(req, res) {
    const body = req.body;
    body.ownerId = req.user.sub;
    Document.create(body)
      .then(user => Response.created(res, user))
      .catch(error => Response
        .badRequest(res, Helpers.errorHandler(error.errors)));
  }

  /**
   * Updates a document
   * @description Updates a document base
   * on the type of document and access
   * the user has.
   *  when PUT /documents/:id is called
   * @param  {Object} req - request object
   * @param  {Object} res - response object
   * @return {Object} response
   */
  static update(req, res) {
    req.doc.update(req.body)
      .then(document => Response
        .success(res, { message: 'Document updated', document }))
      .catch(error => Response
      .badRequest(res, Helpers.errorHandler(error.errors)));
  }

  /**
   * Deletes a document
   * @description Deletes a document base
   * the access level of the user
   * when UPDATE /documents is called
   * @param  {Object} req - request object
   * @param  {Object} res - response object
   * @return {Object} response
   */
  static delete(req, res) {
    Helpers.docAccess(req, 'delete')
    .then(() => {
      req.doc.destroy()
      .then(() => Response.success(res, { message: 'Document deleted' }));
    }).catch(err => Response.forbidden(res, err.message));
  }
}
