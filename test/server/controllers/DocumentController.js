import chaiHttp from 'chai-http';
import chai from 'chai';
import app from '../../../server';
import db from '../../../app/db/models/index';
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
            token = res.body.data.token;
            chai.request(app)
              .post('/users/login')
              .send({
                username: 'dadmin',
                password: '12345678'
              }).then((res) => {
                adminToken = res.body.data.token;
                done();
              });
          });
        });
      });
    });
  });

  after((done) => {
    db.sequelize.sync({ force: true }).then(() => done());
  });

  describe('Get all documents', () => {
    it('should return all document if user is admin', (done) => {
      chai.request(app)
        .get('/documents')
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('count').eql(5);
          res.body.data.should.have.property('next');
          res.body.data.rows.should.be.a('array');
          res.body.data.rows.should.have.lengthOf(5);
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
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('count').eql(5);
          res.body.data.should.have.property('next').eql(5);
          res.body.data.rows.should.be.a('array');
          res.body.data.rows.should.have.lengthOf(1);
          done();
        });
    });

    it('should return one document for limit 1 offset 1', (done) => {
      chai.request(app)
        .get('/documents')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ limit: 3, offset: 2 })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('count').eql(5);
          res.body.data.should.have.property('next');
          res.body.data.rows.should.be.a('array');
          res.body.data.rows.should.have.lengthOf(3);
          done();
        });
    });

    it('should return one document for query 1', (done) => {
      chai.request(app)
        .get('/documents')
        .set('Authorization', `Bearer ${adminToken}`)
        .query({ search: 'the' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('count').eql(3);
          res.body.data.should.have.property('next').eql(1);
          res.body.data.rows.should.be.a('array');
          res.body.data.rows.should.have.lengthOf(3);
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
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('count').eql(3);
          res.body.data.should.have.property('next');
          res.body.data.rows.should.be.a('array');
          res.body.data.rows.should.have.lengthOf(3);
          done();
        });
      });

    it('should return all documents if user is an admin',
      (done) => {
        chai.request(app)
        .get('/documents')
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('count').eql(5);
          res.body.data.should.have.property('next');
          res.body.data.rows.should.be.a('array');
          res.body.data.rows.should.have.lengthOf(5);
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
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('id').to.eql(2);
          res.body.data.should.have.property('ownerId').to.eql(400);
          res.body.data.should.have.property('title').to
            .eql('The new Epic movie');
          res.body.data.should.have.property('content').to
            .eql('It is a wonderful movie');
          res.body.data.should.have.property('public').to.eql(1);
          res.body.data.should.have.property('editable').to.eql(0);
          done();
        });
    });

    it('should get any document if user is admin', (done) => {
      chai.request(app)
        .get('/documents/3')
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('id').to.eql(3);
          res.body.data.should.have.property('ownerId').to.eql(401);
          res.body.data.should.have.property('title').to
            .eql('The hunger games');
          res.body.data.should.have.property('content').to
            .eql('here is an environment for verse Whose features');
          res.body.data.should.have.property('public').to.eql(0);
          res.body.data.should.have.property('editable').to.eql(1);
          done();
        });
    });

    it('should get document if its public for authenticated user',
      (done) => {
        chai.request(app)
        .get('/documents/4')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('ownerId').to
            .eql(1);
          res.body.data.should.have.property('title').to
            .eql('Journey to the center of he earth');
          res.body.data.should.have.property('content').to
            .eql('here is an environment for verse Whose features');
          res.body.data.should.have.property('ownerId').to.eql(1);
          res.body.data.should.have.property('public').to.eql(1);
          res.body.data.should.have.property('editable').to.eql(0);
          done();
        });
      });
  });

  describe('Create a document', () => {
    it('should create  ', (done) => {
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
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('title')
            .to.eql('Just another book');
          res.body.data.should.have.property('content')
            .to.eql('this is a new document');
          res.body.data.should.have.property('editable').to.eql(0);
          res.body.data.should.have.property('public').to.eql(1);
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
            res.body.message[0].message.should.eql('title cannot be null');
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
          anitaToken = res.body.data.token;
          done();
        });
    });

    it('should update a document if user owns the document', (done) => {
      chai.request(app)
        .put('/documents/2')
        .send({
          title: 'a changed title',
          content: 'i got changed',
          public: 0,
          editable: 1,
        })
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.has.status(200);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('title')
            .to.eql('a changed title');
          res.body.data.should.have.property('content')
            .to.eql('i got changed');
          res.body.data.should.have.property('editable').to.eql(1);
          res.body.data.should.have.property('public').to.eql(0);
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
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('title')
            .to.eql('godspeed');
          res.body.data.should.have.property('content')
            .to.eql('the chronicle of godspeed');
          res.body.data.should.have.property('editable').to.eql(0);
          res.body.data.should.have.property('public').to.eql(0);
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
            res.body.data.should.be.a('object');
            res.body.data.should.have.property('title')
              .to.eql('Just another book');
            res.body.data.should.have.property('content')
              .to.eql('the chronicle of godspeed');
            res.body.data.should.have.property('editable').to.eql(0);
            res.body.data.should.have.property('public').to.eql(0);
            done();
          });
      });

    it(`should return a 403 if another user tries to change 
      the isEditable status`, (done) => {
      chai.request(app)
        .put('/documents/2')
        .send({
          id: 7,
          title: 'a changed title',
          content: 'i got changed',
          ownerId: 400,
          public: 0,
          editable: 1,
        })
        .set('Authorization', `Bearer ${anitaToken}`)
        .end((err, res) => {
          res.should.has.status(403);
          res.body.should.have.property('status').to.eql(false);
          res.body.message.should
            .eql('Forbidden, you cannot edit this document');
          done();
        });
    });

    it('should return a 400 status if an invalid data is sent', (done) => {
      chai.request(app)
        .put('/documents/2')
        .set('Authorization', `Bearer ${token}`)
        .send({
          public: null,
          editable: 1,
        })
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('status').to.eql(false);
          res.body.message[0].message.should.eql('public cannot be null');
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
          anitaToken = res.body.data.token;
          done();
        });
    });

    it('should delete a document if user owns the document', (done) => {
      chai.request(app)
        .delete('/documents/5')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.has.status(200);
          res.body.should.has.property('message').to.eql('Document deleted');
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('title')
            .to.eql('Goku vs Saitama death match');
          res.body.data.should.have.property('content')
            .to.eql('Goku ends up dieing lol');
          res.body.data.should.have.property('editable').to.eql(0);
          res.body.data.should.have.property('public').to.eql(0);
          done();
        });
    });

    it('should return a 404 for document not found', (done) => {
      chai.request(app)
        .delete('/documents/5')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.has.status(404);
          res.body.should.be.a('object');
          res.body.should.have.property('message')
            .to.eql('Document with id 5 not found');
          done();
        });
    });

    it('should delete any document if user is admin', (done) => {
      chai.request(app)
        .delete('/documents/3')
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          res.should.has.status(200);
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('title')
            .to.eql('The hunger games');
          res.body.data.should.have.property('content')
            .to.eql('here is an environment for verse Whose features');
          res.body.data.should.have.property('editable').to.eql(1);
          res.body.data.should.have.property('public').to.eql(0);
          done();
        });
    });

    it('should return a 403 if document does not belong to user', (done) => {
      chai.request(app)
        .delete('/documents/2')
        .set('Authorization', `Bearer ${anitaToken}`)
        .end((err, res) => {
          res.should.has.status(403);
          res.body.should.have.property('status').to.eql(false);
          res.body.message.should
            .eql('Forbidden! you can\'t delete this document');
          done();
        });
    });
  });
});
