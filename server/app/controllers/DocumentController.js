import db from '../db/models/index';
import Response from '../utils/ApiResponse';
import Query from '../utils/Query';
import Access from '../utils/Access';

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
   * @param {Object} req
   * @param {Object} res
   * @return {Object} response
   */
  static getAll(req, res) {
    const query = Query.docQuery(req);
    Document.findAndCountAll(query)
      .then((data) => {
        data.next = Math.floor(data.count / query.limit) || 1;
        Response.success(res, data, 'query successful');
      })
      .catch(err => Response.serverError(res, err.message));
  }


  /**
   * Gets a single document
   * @description returns a single document
   * when GET /documents is called
   * base on the the owner, admin access, and
   * if the document is public
   * @param {Object} req
   * @param {Object} res
   * @return {Object} response
   */
  static get(req, res) {
    Access.docAccess(req, req.doc, 'public')
      .then(() => Response.success(res, req.doc, 'document found'))
      .catch(err => Response.unAuthorize(res, err.message));
  }


  /**
   * Create a  document
   * @description creates a new document
   * when POST /documents is called
   * assigns that document to the creator
   * @param {Object} req
   * @param {Object} res
   * @return {Object} response
   */
  static create(req, res) {
    const body = req.body;
    body.ownerId = req.user.sub;
    Document.create(body)
      .then(data => Response.created(res, data))
      .catch(err => Response.badRequest(res, err.errors));
  }

  /**
   * Updates a document
   * @description Updates a document base
   * on the type of document and access
   * the user has.
   *  when PUT /documents/:id is called
   * @param {Object} req
   * @param {Object} res
   * @return {Object} response
   */
  static update(req, res) {
    Access.docAccess(req, req.doc, 'editable',
    'Forbidden, you cannot edit this document')
      .then((request) => {
        req.doc.update(request.body)
        .then(data => Response.success(res, data, 'Document updated'))
        .catch(err => Response.badRequest(res, err.errors));
      })
      .catch(err => Response.forbidden(res, err.message));
  }

  /**
   * Deletes a document
   * @description Deletes a document base
   * the access level of the user
   * when UPDATE /documents is called
   * @param {Object} req
   * @param {Object} res
   * @return {Object} response
   */
  static delete(req, res) {
    Access.docAccess(req, req.doc, 'delete')
    .then(() => {
      req.doc.destroy()
      .then(() => Response.success(res, req.doc, 'Document deleted'));
    }).catch(err => Response.forbidden(res, err.message));
  }
}
