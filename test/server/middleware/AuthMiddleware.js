/* eslint no-underscore-dangle: 0 */

import chaiHttp from 'chai-http';
import chai from 'chai';
import httpMocks from 'node-mocks-http';
import events from 'events';
import spies from 'chai-spies';

import app from '../../../server/server';
import db from '../../../server/app/db/models';
import Auth from '../../../server/middleware/Auth';

import { userData } from '../TestData';

chai.use(chaiHttp);
chai.use(spies);
chai.should();

describe('Authentication Middleware', () => {
  let token = null;
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
            token = res.body.token;
            done();
          });
      });
    });
  });

  after((done) => {
    db.sequelize.sync({ force: true }).then(() => done());
  });

  it('should return 401  when no bearer is found', (done) => {
    chai.request(app)
      .post('/logout')
      .set('Authorization', 'basic')
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.property('message')
          .eql('Authorization Bearer not found');
        done();
      });
  });

  it('should return 401 for invalid token', (done) => {
    chai.request(app)
      .post('/users/logout')
      .set('Authorization', 'Bearer token')
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.property('message')
          .eql('Authorization denied! Invalid token');
        done();
      });
  });

  it('should return 200 when a user logs out', (done) => {
    chai.request(app)
      .post('/users/logout')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.eql('You have been logged out');
        done();
      });
  });

  it('should return 401 when a logged out user tries to logout', (done) => {
    chai.request(app)
      .post('/users/logout')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.have.property('message')
          .eql('You need to login to access this route');
        done();
      });
  });
});


describe('Authentication mock middleware', () => {
  let token = null;
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
            token = res.body.token;
            done();
          });
      });
    });
  });

  after((done) => {
    db.sequelize.sync({ force: true }).then(() => done());
  });

  const getResponse = () => httpMocks.createResponse({
    eventEmitter: events.EventEmitter
  });


  describe('Authentication mock', () => {
    it('should return 401 if Authorization header not found', (done) => {
      const request = httpMocks.createRequest({
        method: 'GET',
        url: '/users'
      });
      const next = () => {};
      const response = getResponse();
      const spy = chai.spy(next);
      response.on('end', () => {
        const data = JSON.parse(response._getData());
        response.statusCode.should.eql(401);
        data.message.should.eql('Authorization Bearer not found');
        spy.should.not.have.been.called();
        done();
      });
      Auth(request, response, spy);
    });

    it('should return 401 if no Bearer is found', (done) => {
      const request = httpMocks.createRequest({
        method: 'GET',
        url: '/users',
        headers: { Authorization: '' }
      });

      const response = getResponse();
      const next = () => {};
      const spy = chai.spy(next);
      response.on('end', () => {
        const data = JSON.parse(response._getData());
        response.statusCode.should.eql(401);
        data.message.should.eql('Authorization Bearer not found');
        spy.should.not.have.been.called();
        done();
      });
      Auth(request, response, spy);
    });

    it('should return 401 if token is invalid', (done) => {
      const request = httpMocks.createRequest({
        method: 'GET',
        url: '/users',
        headers: { Authorization: 'Bearer sjFKJabdsfjkbaKSJKJasdbkjbasjKD' }
      });

      const response = getResponse();
      const next = () => {};
      const spy = chai.spy(next);
      response.on('end', () => {
        const data = JSON.parse(response._getData());
        response.statusCode.should.eql(401);
        data.message.should.eql('Authorization denied! Invalid token');
        spy.should.not.have.been.called();
        done();
      });
      Auth(request, response, spy);
    });

    it('should return 401 for logged out token', (done) => {
      const request = httpMocks.createRequest({
        method: 'GET',
        url: '/users',
        headers: { Authorization:
        'Bearer $2a$10$GtQ8Bb5ETkD0JMy5u2oi0eHwh24t8DMHGvo.eu4R8rfL0SA/SA80u' }
      });

      const response = getResponse();
      const next = () => {};
      const spy = chai.spy(next);
      response.on('end', () => {
        const data = JSON.parse(response._getData());
        response.statusCode.should.eql(401);
        data.message.should.eql('Authorization denied! Invalid token');
        spy.should.not.have.been.called();
        done();
      });
      Auth(request, response, spy);
    });

    it('should call next for valid token', (done) => {
      const response = getResponse();
      const request = httpMocks.createRequest({
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        url: '/users',
        user: { role: 'admin' }
      });
      const next = () => {};
      const spy = chai.spy(next);
      Auth(request, response, spy);
      spy.should.not.have.been.called();
      done();
    }).timeout(10000);
  });
});
