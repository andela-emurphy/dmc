/* eslint no-underscore-dangle: 0 */

import chaiHttp from 'chai-http';
import chai from 'chai';
import httpMocks from 'node-mocks-http';
import events from 'events';
import spies from 'chai-spies';
import app from '../../../server/server';
import db from '../../../server/app/db/models';
import { adminPermission, userPermission }
  from '../../../server/middleware/Permission';

import { userData } from '../TestData';

chai.use(chaiHttp);
chai.use(spies);

chai.should();

describe('Permission middleware', () => {
  describe('Authentication middleware', () => {
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
              username: 'dadmin',
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

    describe('Admin permission', () => {
      it('should return 403 if regular user tries to delete admin',
        (done) => {
          const request = httpMocks.createRequest({
            method: 'DELETE',
            url: '/users',
            params: { id: 1 },
            user: { role: 'admin' }
          });
          const response = getResponse();
          response.on('end', () => {
            const data = JSON.parse(response._getData());
            response.statusCode.should.eql(403);
            data.message.should.eql('Forbidden! super admin cannot be deleted');
            done();
          });
          adminPermission(request, response);
        });

      it('should return 403 if user is not a admin', (done) => {
        const request = httpMocks.createRequest({
          method: 'DELETE',
          url: '/users',
          params: { id: 1 },
          user: { role: 'regular' }
        });
        const response = getResponse();
        response.on('end', () => {
          const data = JSON.parse(response._getData());
          response.statusCode.should.eql(403);
          data.message.should.eql('Forbidden! you cannot access this route');
          done();
        });
        adminPermission(request, response);
      });

      it('should return 404 if user is not found', (done) => {
        const response = getResponse();
        const request = httpMocks.createRequest({
          method: 'GET',
          url: '/users',
          params: { id: 8888 },
          headers: { Authorization: `Bearer ${token}` },
          user: { role: 'admin' }
        });

        response.on('end', () => {
          const data = JSON.parse(response._getData());
          response.statusCode.should.eql(404);
          data.message.should.eql('user with id 8888 not found');
          done();
        });
        adminPermission(request, response);
      });

      it('should call next if user is admin and method has no params',
      (done) => {
        const response = getResponse();
        const request = httpMocks.createRequest({
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
          url: '/users',
          user: { role: 'admin' }
        });
        const next = () => {};
        const spy = chai.spy(next);
        adminPermission(request, response, spy);
        spy.should.have.been.called();
        done();
      }).timeout(10000);
    });

    describe('User permission', () => {
      it('should call next of user role is admin', (done) => {
        const response = getResponse();
        const request = httpMocks.createRequest({
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
          url: '/users/:id/documents',
          user: { role: 'admin' }
        });
        const next = () => {};
        const spy = chai.spy(next);
        userPermission(request, response, spy);
        spy.should.have.been.called();
        done();
      }).timeout(10000);
    });
  });
});
