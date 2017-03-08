import chaiHttp from 'chai-http';
import chai from 'chai';

import { userData } from '../TestData';
import app from '../../../server/server';
import db from '../../../server/app/db/models';

chai.use(chaiHttp);
chai.should();

describe('Index endpoint', () => {
  it('should return 200', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

describe('Authentication controller', () => {
  before((done) => {
    db.Role.bulkCreate([
      { title: 'regular' },
      { title: 'admin' }
    ], { validate: true }).then(() => {
      db.User.bulkCreate(userData, { validate: true });
      done();
    });
  });

  after((done) => {
    db.sequelize.sync({ force: true }).then(() => done());
  });
  describe('Login user', () => {
    it('Should login user and return a token', (done) => {
      chai.request(app)
        .post('/users/login')
        .send({
          username: 'dadmin',
          password: '12345678'
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('username').eql('dadmin');
          res.body.should.have.property('firstname').eql('uncle');
          res.body.should.have.property('lastname').eql('uncle');
          res.body.should.have.property('email').eql('admin@test.com');
          res.body.should.have.property('token');
          done();
        });
    });

    it('Should return status 201 if no username or password sent', (done) => {
      chai.request(app)
        .post('/users/login')
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message')
            .eql('Authentication failed! username and password required');
          done();
        });
    });

    it('should return 400 for no login details', (done) => {
      chai.request(app)
        .post('/users/login')
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message')
            .eql('Authentication failed! username and password required');
          done();
        });
    });

    it('should return 400 invalid username or password', (done) => {
      chai.request(app)
        .post('/users/login')
        .send({
          username: 'king',
          password: 'testtt'
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message')
            .eql('Authentication failed! invalid username or password');
          done();
        });
    });
  });
});

