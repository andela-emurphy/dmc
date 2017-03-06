import chaiHttp from 'chai-http';
import chai from 'chai';

import app from '../../../server/server';
import db from '../../../server/app/db/models';

import { userData } from '../TestData';

chai.use(chaiHttp);

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
            token = res.body.data.token;
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
        res.body.should.have.property('message')
          .eql('You have been logged out');
        done();
      });
  });

  it('should return 401 when a logout user tries to logout', (done) => {
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
