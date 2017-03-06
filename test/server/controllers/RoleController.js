import chaiHttp from 'chai-http';
import chai from 'chai';

import { userData } from '../TestData';
import app from '../../../server/server';
import db from '../../../server/app/db/models/index';

chai.use(chaiHttp);
chai.should();

let token = null;
let adminToken = null;
describe('Role controller', () => {
  before((done) => {
    db.Role.bulkCreate([
      { title: 'regular' },
      { title: 'admin' }
    ], { validate: true }).then(() => {
      db.User.bulkCreate(userData, { validate: true })
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

  after((done) => {
    db.sequelize.sync({ force: true }).then(() => done());
  });
  describe('Create role', () => {
    it('should return 201 role created', (done) => {
      chai.request(app)
        .post('/roles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          title: 'fellow'
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.data.should.be.a('object');
          res.body.should.have.property('message');
          res.body.data.should.have.property('title').eql('fellow');
          done();
        });
    });

    it('should return 400 if no title was sent', (done) => {
      chai.request(app)
        .post('/roles')
        .send()
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.message.should.be.a('array');
          res.body.message.should.have.lengthOf(1);
          res.body.message[0].should.have.property('message')
            .eql('title must be unique');
          done();
        });
    });

    it('should return 400 if role already exist', (done) => {
      chai.request(app)
        .post('/roles')
        .send({ title: 'admin' })
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.message.should.be.a('array');
          res.body.message.should.have.lengthOf(1);
          res.body.message[0].should.have.property('message')
            .eql('title must be unique');
          done();
        });
    });
    it('should return 403 if user is not an admin', (done) => {
      chai.request(app)
        .post('/roles')
        .send({ title: 'pandc' })
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property('message')
            .eql('Forbidden! you cannot access this route');
          done();
        });
    });
  });

  describe('Get role', () => {
    it('should return status 200', (done) => {
      chai.request(app)
      .get('/roles/regular')
      .set('Authorization', `Bearer ${adminToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.a('object');
        res.body.data.should.have.property('title').eql('regular');
        done();
      });
    });

    it('should return a role admin', (done) => {
      chai.request(app)
        .get('/roles/admin')
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('title').eql('admin');
          done();
        });
    });

    it('should return 404 if role does not exit', (done) => {
      chai.request(app)
      .get('/roles/rkrkrkr')
      .set('Authorization', `Bearer ${adminToken}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('message')
          .eql('role with title rkrkrkr not found');
        done();
      });
    });
  });

  describe('Get all roles', () => {
    it('should return all roles', (done) => {
      chai.request(app)
      .get('/roles')
      .set('Authorization', `Bearer ${adminToken}`)
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

    it('should return two roles for limit 2', (done) => {
      chai.request(app)
      .get('/roles')
      .set('Authorization', `Bearer ${adminToken}`)
      .query({ limit: 2 })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.a('object');
        res.body.data.should.have.property('count').eql(3);
        res.body.data.should.have.property('next').eql(1);
        res.body.data.rows.should.be.a('array');
        res.body.data.rows.should.have.lengthOf(2);
        done();
      });
    });

    it('should return one role for limit 2 offset 2', (done) => {
      chai.request(app)
      .get('/roles')
      .set('Authorization', `Bearer ${adminToken}`)
      .query({ limit: 2, offset: 2 })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.a('object');
        res.body.data.should.have.property('count').eql(3);
        res.body.data.should.have.property('next');
        res.body.data.rows.should.be.a('array');
        res.body.data.rows.should.have.lengthOf(1);
        done();
      });
    });

    it('should return one role for any query param', (done) => {
      chai.request(app)
      .get('/roles')
      .set('Authorization', `Bearer ${adminToken}`)
      .query({ search: 'admin' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.a('object');
        res.body.data.should.have.property('count').eql(1);
        res.body.data.should.have.property('next');
        res.body.data.rows.should.be.a('array');
        res.body.data.rows.should.have.lengthOf(1);
        done();
      });
    });
  });
});

