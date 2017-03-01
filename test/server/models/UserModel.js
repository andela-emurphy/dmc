import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import db from '../../../app/db/models/index';
import { userData } from '../TestData';


chai.use(chaiAsPromised);
const should = chai.should();


chai.should();

describe('User model', () => {
  before((done) => {
    db.Role.bulkCreate([
        { title: 'regular' },
        { title: 'admin' }
    ]).then(() => {
      db.User.bulkCreate([userData[1]]);
      done();
    });
  });

  after((done) => {
    db.sequelize.sync({ force: true }).then(() => done());
  });


  describe('Create User', () => {
    it('should create a new user', (done) => {
      db.User.create(userData[0])
      .then((user) => {
        user.should.have.property('firstname').to.eql('enaho');
        user.should.have.property('lastname').to.eql('murphy');
        user.should.have.property('username').to.eql('mimi');
        user.should.have.property('email').to
          .eql('mimi@test.com');
        user.should.have.property('role')
          .to.eql('regular');
        done();
      });
    });

    it('should throw an error if user already exist', (done) => {
      db.User.create(userData[0])
      .should.be.rejected.notify(done);
    });

    it('should throw an error any field is to field', (done) => {
      db.User.create({
        firstname: 'saitama'
      })
      .should.be.rejected.notify(done);
    });

    it('should throw an error if role does not exist', (done) => {
      db.User.create({
        firstname: 'saitama',
        lastname: 'Belarus',
        username: 'kaheme',
        email: 'anime@anime.com',
        password: 'myverybadpass',
        role: 'god'
      })
      .should.be.rejected.notify(done);
    });
  });

  describe('Delete User', () => {
    it('should delete a  user', (done) => {
      const query = db.User.destroy({
        where: { id: 400 }
      });
      query.should.be.fulfilled.and.notify(done);
    });

    it('should not throw an error if user does not exist', (done) => {
      const query = db.User.destroy({
        where: { id: 33737373 }
      });
      query.should.be.fulfilled.and.notify(done);
    });


    it('should return null for deleted user', (done) => {
      db.User.findById(400)
        .then((user) => {
          should.equal(user, null);
          done();
        });
    });
  });

  describe('Update User', () => {
    it('should update a user', (done) => {
      db.User.update({
        firstname: 'saitama',
        lastname: 'saitama',
      }, {
        where: { id: 1 }
      })
      .should.be.fulfilled.and.notify(done);
    });

    it('should update update user details', (done) => {
      db.User.findById(1)
      .then((user) => {
        user.should.have.property('firstname').to.eql('saitama');
        user.should.have.property('lastname').to.eql('saitama');
        done();
      });
    });
  });
});
