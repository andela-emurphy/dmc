import chaiHttp from 'chai-http';
import chai from 'chai';

import app from '../../../server/server';
import db from '../../../server/app/db/models';
import { userData, documentData } from '../TestData';

chai.use(chaiHttp);
chai.should();

describe('Document controller', () => {
  let token = null;
  let adminToken = null;
  before((done) => {
    db.Role.bulkCreate([
      { title: 'regular' },
      { title: 'admin' }
    ], { validate: true }).then(() => {
      db.User.bulkCreate(userData, { validate: true })
      .then(() => {
        db.Document.bulkCreate(documentData, { validate: true })
        .then(() => {
          chai.request(app)
          .post('/users/login')
          .send({
            username: 'mimi',
            password: '12345678'
          })
          .then((res) => {
            token = res.body.token;
            chai.request(app)
              .post('/users/login')
              .send({
                username: 'dadmin',
                password: '12345678'
              }).then((res) => {
                adminToken = res.body.token;
                done();
              });
          });
        });
      });
    }).catch((a) => { throw a; });
  });

  after((done) => {
    db.sequelize.sync({ force: true }).then(() => done());
  });

  describe('Get all documents', () => {
    it('should return all document if user is an admin', (done) => {
      chai.request(app)
        .get('/documents')
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('pagination');
          res.body.rows.should.be.a('array');
          res.body.rows.should.have.lengthOf(5);
          done();
        });
    });

    it('get all document should return pagination meta data', (done) => {
      chai.request(app)
        .get('/documents')
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('pagination');
          res.body.pagination.should.have.property('page_count').eql(1);
          res.body.pagination.should.have.property('page').eql(1);
          res.body.pagination.should.have.property('page_size').eql(5);
          res.body.pagination.should.have.property('total_count').eql(5);
          done();
        });
    });

    it('should return one document for limit 1', (done) => {
      chai.request(app)
        .get('/documents')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ limit: 1 })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('pagination');
          res.body.rows.should.be.a('array');
          res.body.rows.should.have.lengthOf(1);
          done();
        });
    });

    it('should return three documents for limit 3 offset 2', (done) => {
      chai.request(app)
        .get('/documents')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ limit: 3, offset: 2 })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('pagination');
          res.body.rows.should.be.a('array');
          res.body.rows.should.have.lengthOf(3);
          done();
        });
    });

    it('should return one document for search query the', (done) => {
      chai.request(app)
        .get('/documents')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ search: 'the' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('pagination');
          res.body.rows.should.be.a('array');
          res.body.rows.should.have.lengthOf(3);
          done();
        });
    });

    it('should return all documents that belongs to an authenticated user',
      (done) => {
        chai.request(app)
        .get('/documents')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('pagination');
          res.body.rows.should.be.a('array');
          res.body.rows.should.have.lengthOf(3);
          done();
        });
      });
  });

  describe('Get single document', () => {
    it('should get  a single document of an authenticated user', (done) => {
      chai.request(app)
        .get('/documents/2')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id').to.eql(2);
          res.body.should.have.property('ownerId').to.eql(400);
          res.body.should.have.property('title').to
            .eql('The new Epic movie');
          res.body.should.have.property('content').to
            .eql('It is a wonderful movie');
          res.body.should.have.property('access').to.eql('private');
          done();
        });
    });

    it('should get any document if user is an admin', (done) => {
      chai.request(app)
        .get('/documents/3')
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id').to.eql(3);
          res.body.should.have.property('ownerId').to.eql(401);
          res.body.should.have.property('title').to
            .eql('The hunger games');
          res.body.should.have.property('content').to
            .eql('here is an environment for verse Whose features');
          res.body.should.have.property('access').to.eql('private');
          done();
        });
    });

    it('should get any document if its public',
      (done) => {
        chai.request(app)
        .get('/documents/4')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('ownerId').to
            .eql(1);
          res.body.should.have.property('title').to
            .eql('Journey to the center of he earth');
          res.body.should.have.property('content').to
            .eql('here is an environment for verse Whose features');
          res.body.should.have.property('ownerId').to.eql(1);
          res.body.should.have.property('access').to.eql('public');
          done();
        });
      });
  });

  describe('Get user document', () => {
    it('should get all document that belongs to a user', (done) => {
      chai.request(app)
        .get('/users/400/documents')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.should.have.lengthOf(2);
          done();
        });
    });

    it('should returns a 403 if user tries to access another user document',
      (done) => {
        chai.request(app)
        .get('/users/401/documents')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property('message')
            .eql('Forbidden! you cannot access this route');
          done();
        });
      });

    it('should returns all user document if query is from admin',
      (done) => {
        chai.request(app)
        .get('/users/400/documents')
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.should.have.lengthOf(2);
          done();
        });
      });
  });

  describe('Create a document', () => {
    it('should return 201 a new document is created  ', (done) => {
      chai.request(app)
        .post('/documents')
        .send({
          id: 7,
          title: 'Just another book',
          content: 'this is a new document',
          ownerId: 400,
          public: 1,
          editable: 0,
        })
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.has.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('title')
            .to.eql('Just another book');
          res.body.should.have.property('content')
            .to.eql('this is a new document');
          res.body.should.have.property('access').to.eql('private');
          done();
        });
    });

    it('should return a 400 for incomplete request data',
      (done) => {
        chai.request(app)
          .post('/documents')
          .send({})
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            res.should.have.status(400);
            res.body.message.should.be.a('array');
            res.body.message[0].should.eql('title cannot be null');
            done();
          });
      });
  });

  describe('Updates a document', () => {
    let anitaToken;
    before((done) => {
      chai.request(app)
        .post('/users/login')
        .send({
          username: 'anita',
          password: '12345678'
        }).then((res) => {
          anitaToken = res.body.token;
          done();
        });
    });

    it('should update a document if user owns the document', (done) => {
      chai.request(app)
        .put('/documents/2')
        .send({
          title: 'a changed title',
          content: 'i got changed',
          access: 'private',
          editable: 1,
        })
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.has.status(200);
          res.body.should.be.a('object');
          res.body.document.should.have.property('title')
            .to.eql('a changed title');
          res.body.document.should.have.property('content')
            .to.eql('i got changed');
          res.body.document.should.have.property('access').to.eql('private');
          done();
        });
    });

    it('should update a document if user is an Admin', (done) => {
      chai.request(app)
        .put('/documents/2')
        .send({
          title: 'godspeed',
          content: 'the chronicle of godspeed',
          ownerId: 400,
          public: 0,
          editable: 0,
        })
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          res.should.has.status(200);
          res.body.should.be.a('object');
          res.body.document.should.have.property('title')
            .to.eql('godspeed');
          res.body.document.should.have.property('content')
            .to.eql('the chronicle of godspeed');
          res.body.document.should.have.property('access').to.eql('private');
          done();
        });
    });

    it('should update only data sent through the request',
      (done) => {
        chai.request(app)
          .put('/documents/2')
          .send({
            title: 'Just another book'
          })
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            res.should.has.status(200);
            res.body.should.be.a('object');
            res.body.document.should.have.property('title')
              .to.eql('Just another book');
            res.body.document.should.have.property('content')
              .to.eql('the chronicle of godspeed');
            res.body.document.should.have.property('access').to.eql('private');
            done();
          });
      });

    it('should return a 400 status if an invalid data is sent', (done) => {
      chai.request(app)
        .put('/documents/2')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: null
        })
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.message[0].should.eql('title cannot be null');
          done();
        });
    });

    it('should return a 403 if a user tries to update another user document',
      (done) => {
        chai.request(app)
          .put('/documents/2')
          .set('Authorization', `Bearer ${anitaToken}`)
          .send({
            title: 'i want to change this'
          })
          .end((err, res) => {
            res.should.have.status(403);
            res.body.message.should
              .eql('Forbidden! you cannot access this document');
            done();
          });
      });
  });

  describe('Delete documents', () => {
    let anitaToken;
    before((done) => {
      chai.request(app)
        .post('/users/login')
        .send({
          username: 'anita',
          password: '12345678'
        }).then((res) => {
          anitaToken = res.body.token;
          done();
        });
    });

    it('should return a 200 when user deletes his/her document', (done) => {
      chai.request(app)
        .delete('/documents/5')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.has.status(200);
          res.body.should.has.property('message').to.eql('Document deleted');
          done();
        });
    });

    it('should return a 404 if document is not found', (done) => {
      chai.request(app)
        .delete('/documents/7677')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.has.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message')
            .to.eql('Document with id 7677 not found');
          done();
        });
    });

    it('should return status 200 when admin deletes document', (done) => {
      chai.request(app)
        .delete('/documents/3')
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          res.should.has.status(200);
          res.body.should.be.a('object');
          res.body.should.has.property('message').to.eql('Document deleted');
          done();
        });
    });

    it('should return a 403 if document does not belong to user', (done) => {
      chai.request(app)
        .delete('/documents/2')
        .set('Authorization', `Bearer ${anitaToken}`)
        .end((err, res) => {
          res.should.has.status(403);
          res.body.message.should
            .eql('Forbidden! you cannot access this document');
          done();
        });
    });
  });
});
