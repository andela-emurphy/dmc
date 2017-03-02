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
   * @param {Object} req
   * @param {Object} res
   * @return {Object} res
   */
  static getAll(req, res) {
    const search = req.query;
    const query = Access.docQuery(req, search);

    Document.findAndCountAll(query)
      .then((data) => {
        data.next = Math.floor(data.count / query.limit) || 1;
        Response.success(res, data, 'query successful');
      })
      .catch(err => Response.serverError(res, err.message));
  }


  /**
   * Gets a single document
   * @param {Object} req
   * @param {Object} res
   * @return {Object} res
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
   * Gets a single document
   * @param {Object} req
   * @param {Object} res
   * @return {Object} res
   */
  static create(req, res) {
    const body = req.body;
    body.ownerId = req.user.sub;
    Document.create(body)
      .then(data => Response.created(res, data))
      .catch(err => Response.badRequest(res, err.errors));
  }

  /**
   * Gets a single document
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
   * Gets a single document
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
