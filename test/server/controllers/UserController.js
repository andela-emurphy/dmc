import chaiHttp from 'chai-http';
import chai from 'chai';

import { userData } from '../TestData';
import app from '../../../server.js';
import db from '../../../app/db/models/index.js';

chai.use(chaiHttp);
chai.should();

let token = null;
let adminToken = null;
describe('User controller', () => {
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
    }).catch((err) => { throw err; });
  });

  after((done) => {
    db.sequelize.sync({ force: true }).then(() => done());
  });
  describe('Create user', () => {
    it('should create 201 user created', (done) => {
      chai.request(app)
        .post('/users')
        .send({
          id: 55,
          firstname: 'enaho',
          lastname: 'murphy',
          username: 'enahomurphy',
          email: 'test@test.com',
          password: '12345678',
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.data.should.be.a('object');
          res.body.should.have.property('message');
          res.body.data.should.have.property('username').eql('enahomurphy');
          res.body.data.should.have.property('firstname').eql('enaho');
          res.body.data.should.have.property('lastname').eql('murphy');
          res.body.data.should.have.property('email').eql('test@test.com');
          done();
        });
    });

    it('should not POST a user without required fields', (done) => {
      chai.request(app)
        .post('/users')
        .send({
          firstname: 'enaho',
          lastname: 'murphy',
          email: 'test@test.com',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message');
          res.body.message.should.be.a('array');
          res.body.message.should.have.lengthOf(2);
          res.body.message[0].should.have.property('message')
            .eql('username cannot be null');
          res.body.message[1].should.have.property('message')
            .eql('password cannot be null');
          done();
        });
    });
  });

  describe('Get User', () => {
    it('should return a user', (done) => {
      chai.request(app)
      .get('/users/400')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.body.data.should.be.a('object');
        res.body.data.should.have.property('id').eql(400);
        res.body.data.should.have.property('username').eql('mimi');
        res.body.data.should.have.property('firstname').eql('enaho');
        res.body.data.should.have.property('lastname').eql('murphy');
        res.body.data.should.have.property('role').eql('regular');
        done();
      });
    });

    it('should return any user for admin query', (done) => {
      chai.request(app)
        .get('/users/55')
        .set('Authorization', `Bearer ${adminToken}`)
        .end((err, res) => {
          res.body.data.should.be.a('object');
          res.body.data.should.have.property('id').eql(55);
          res.body.data.should.have.property('username').eql('enahomurphy');
          res.body.data.should.have.property('firstname').eql('enaho');
          res.body.data.should.have.property('lastname').eql('murphy');
          res.body.data.should.have.property('email').eql('test@test.com');
          done();
        });
    });

    it('should return 403 if details does not belong to user', (done) => {
      chai.request(app)
      .get('/users/55')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.have.property('message')
          .eql('Forbidden! you cannot access this route');
        done();
      });
    });
    it('should return 400 if user does not exit', (done) => {
      chai.request(app)
      .get('/users/555')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.should.have.property('message')
          .eql(`user with id ${555} not found`);
        done();
      });
    });
  });

  describe('Get all Users', () => {
    it('should return a 403 for none admin users', (done) => {
      chai.request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(403);
        res.body.should.be.a('object');
        res.body.should.have.property('message')
          .eql('Forbidden! you cannot access this route');
        done();
      });
    });

    it('should return all users for admins', (done) => {
      chai.request(app)
      .get('/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.a('object');
        res.body.data.should.have.property('count');
        res.body.data.should.have.property('next');
        res.body.data.rows.should.be.a('array');
        res.body.data.rows.should.have.lengthOf(3);
        res.body.data.rows[0].should.have.property('username').eql('dadmin');
        res.body.data.rows[0].should.have.property('firstname').eql('uncle');
        res.body.data.rows[0].should.have.property('lastname').eql('uncle');
        res.body.data.rows[0].should.have.property('role').eql('admin');
        done();
      });
    });

    it('should return two user', (done) => {
      chai.request(app)
      .get('/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .query({ limit: 2 })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.a('object');
        res.body.data.should.have.property('count');
        res.body.data.should.have.property('next');
        res.body.data.rows.should.be.a('array');
        res.body.data.rows.should.have.lengthOf(2);
        res.body.data.rows[0].should.have.property('id').eql(1);
        res.body.data.rows[0].should.have.property('firstname').eql('uncle');
        res.body.data.rows[0].should.have.property('lastname').eql('uncle');
        res.body.data.rows[0].should.have
          .property('email').eql('admin@test.com');
        res.body.data.rows[0].should.have.property('role').eql('admin');
        done();
      });
    });

    it('should return one user', (done) => {
      chai.request(app)
      .get('/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .query({ limit: 3, offset: 3 })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.a('object');
        res.body.data.should.have.property('count').eql(4);
        res.body.data.should.have.property('next');
        res.body.data.rows.should.be.a('array');
        res.body.data.rows.should.have.lengthOf(1);
        res.body.data.rows[0].should.have.property('id').eql(55);
        res.body.data.rows[0].should.have.property('firstname').eql('enaho');
        res.body.data.rows[0].should.have.property('lastname').eql('murphy');
        res.body.data.rows[0].should.have
          .property('email').eql('test@test.com');
        done();
      });
    });
    it('should return three users for user query', (done) => {
      chai.request(app)
      .get('/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .query({ q: 'murphy' })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.data.should.be.a('object');
        res.body.data.should.have.property('count').eql(3);
        res.body.data.should.have.property('next');
        res.body.data.rows.should.be.a('array');
        res.body.data.rows.should.have.lengthOf(3);
        res.body.data.rows[0].should.have.property('id').eql(400);
        res.body.data.rows[0].should.have.property('firstname').eql('enaho');
        res.body.data.rows[0].should.have.property('lastname').eql('murphy');
        res.body.data.rows[0].should.have
          .property('email').eql('mimi@test.com');
        res.body.data.rows[0].should.have.property('role').eql('regular');
        done();
      });
    });
  });

  describe('Update a User', () => {
    it('should return a 401 for none Authenticated users', (done) => {
      const fakeToken = 'this.is.a.fake.token';
      chai.request(app)
      .put('/users/400')
      .set('Authorization', `Bearer ${fakeToken}`)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('message')
          .eql('Authorization denied! Invalid token');
        done();
      });
    });

    it('should update the user details', (done) => {
      chai.request(app)
      .put('/users/1')
      .send({
        firstname: 'joel',
        lastname: 'micheal'
      })
      .set('Authorization', `Bearer ${adminToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('message').eql('user updated');
        done();
      });
    });

    it('should return 403 a regular user tries to update another user account',
      (done) => {
        chai.request(app)
        .put('/users/401')
        .send({
          firstname: 'joel',
          lastname: 'micheal'
        })
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          res.should.have.status(403);
          res.body.should.have.property('message')
            .eql('Forbidden! you cannot access this route');
          done();
        });
      });
  });

  describe('Deletes a User', () => {
    let deleteToken = null;
    beforeEach((done) => {
      db.User.create({
        id: '780',
        firstname: 'naruto',
        lastname: 'uzumaki',
        email: 'the@the.com',
        password: 'goldetulip',
        username: 'orochimaru',
        role: 'regular'
      })
      .then(() => {
        chai.request(app)
          .post('/users/login')
          .send({
            username: 'orochimaru',
            password: 'goldetulip'
          })
          .then((res) => {
            deleteToken = res.body.data.token;
            done();
          })
        .catch((err) => { throw err; });
      });
    });

    afterEach((done) => {
      db.User.findById(780)
        .then((user) => {
          if (user) {
            user.destroy()
              .then(() => done());
          } else done();
        });
    });

    it('should delete any user if user has role of admin', (done) => {
      chai.request(app)
      .delete('/users/780')
      .set('Authorization', `Bearer ${adminToken}`)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('message').eql('User deleted');
        done();
      });
    });

    it(`should return 403 if a regular user tries 
        to delete another user account`, (done) => {
      chai.request(app)
          .delete('/users/780')
          .set('Authorization', `Bearer ${token}`)
          .end((err, res) => {
            res.should.have.status(403);
            res.body.should.have.property('message')
              .eql('Forbidden! you cannot access this route');
            done();
          });
    });
    it('should return a 403 if user tries to delete his/her account',
      (done) => {
        chai.request(app)
          .delete('/users/780')
            .set('Authorization', `Bearer ${deleteToken}`)
            .end((err, res) => {
              res.should.have.status(403);
              res.body.should.have.property('message')
                .eql('Forbidden! you cannot access this route');
              done();
            });
      });

    it('should return a 401 for none Authenticated users', (done) => {
      const fakeToken = 'this.is.a.fake.token';
      chai.request(app)
      .delete('/users/780')
      .set('Authorization', `Bearer ${fakeToken}`)
      .end((err, res) => {
        res.should.have.status(401);
        res.body.should.be.a('object');
        res.body.should.have.property('message')
          .eql('Authorization denied! Invalid token');
        done();
      });
    });
  });
});

