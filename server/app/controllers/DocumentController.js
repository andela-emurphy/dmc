import db from '../db/models/index';
import Response from '../utils/ApiResponse';
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
    const query = Access.docQuery(req);
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
   * base on the the owner, admin access, and
   * if the document is public
   * @param {Object} req
   * @param {Object} res
   * @return {Object} response
   */
  static get(req, res) {
    const documentId = req.params.id;
    Document.findById(documentId)
      .then((document) => {
        if (!document) {
          return Response
            .notFound(res, `Document with id ${documentId} not found`);
        }
        Access.docAccess(req, document, 'public')
          .then(() => Response.success(res, document, 'document found'))
          .catch(err => Response.unAuthorize(res, err.message));
      })
      .catch(err => Response.serverError(res, err.message));
  }


  /**
   * Create a  document
   * @description creates a new document
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
   * @param {Object} req
   * @param {Object} res
   * @return {Object} res
   */
  static update(req, res) {
    const documentId = req.params.id;
    Document.findById(documentId)
      .then((document) => {
        if (!document) {
          return Response
            .notFound(res, `Document with id ${documentId} not found`);
        }
        const message = 'Forbidden, you cannot edit this document';
        Access.docAccess(req, document, 'editable', message)
          .then((request) => {
            document.update(request.body)
            .then(data => Response.success(res, data, 'Document updated'))
            .catch(err => Response.badRequest(res, err.errors));
          })
          .catch(err => Response.forbidden(res, err.message));
      });
  }

  /**
   * Delete a single document
   * deletes a document base on
   * the access level of the user
   * @param {Object} req
   * @param {Object} res
   * @return {Object} res
   */
  static delete(req, res) {
    const documentId = req.params.id;
    Document.findById(documentId)
      .then((document) => {
        if (!document) {
          return Response
            .notFound(res, `Document with id ${documentId} not found`);
        }
        Access.docAccess(req, document, 'delete')
        .then(() => {
          document.destroy()
          .then(() => Response.success(res, document, 'Document deleted'));
        }).catch(err => Response.forbidden(res, err.message));
      }).catch(err => Response.serverError(res, err.message));
  }
}
