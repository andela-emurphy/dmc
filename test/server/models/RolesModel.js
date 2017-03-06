import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import db from '../../../app/db/models/index';

chai.use(chaiAsPromised);
const should = chai.should();


chai.should();

describe('Role  model', () => {
  before((done) => {
    db.Role.bulkCreate([
        { title: 'regular' },
        { title: 'admin' }
    ]).then(() => {
      done();
    });
  });

  after((done) => {
    db.sequelize.sync({ force: true }).then(() => done());
  });

  describe('Create Role', () => {
    it('should create a new role', (done) => {
      db.Role.create({
        title: 'fellow'
      })
      .then((role) => {
        role.should.have.property('title').to.eql('fellow');
        done();
      });
    });

    it('should throw an error title field is empty', (done) => {
      db.Role.create({
      })
      .should.be.rejected.notify(done);
    });

    it('should throw an error if role already exist ', (done) => {
      db.Role.create({
        title: 'fellow'
      })
      .should.be.rejected.notify(done);
    });
  });

  describe('Delete role', () => {
    it('should delete a role', (done) => {
      db.Role.destroy({
        where: { title: 'fellow' }
      })
      .should.be.fulfilled.and.notify(done);
    });

    it('should not throw an error if role does not exist', (done) => {
      db.Role.destroy({
        where: { title: 'fellow' }
      }).should.be.fulfilled.and.notify(done);
    });

    it('should return null for deleted role', (done) => {
      db.Role.findOne({
        where: { title: 'fellow' }
      })
        .then((role) => {
          should.equal(role, null);
          done();
        });
    });
  });

  describe('Update role', () => {
    it('should update a role', (done) => {
      db.Role.update({
        title: 'technology',
      }, {
        where: { title: 'regular' }
      })
      .should.be.fulfilled.and.notify(done);
    });

    it('should check if role was updated', (done) => {
      db.Role.findOne({
        where: { title: 'technology' }
      })
      .then((role) => {
        role.should.have.property('title').to.eql('technology');
        done();
      });
    });
  });
});

