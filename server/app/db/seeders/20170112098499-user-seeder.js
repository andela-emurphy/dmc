const Faker = require('Faker');
const bcrypt = require('bcryptjs');

module.exports = {
  up(queryInterface) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */

    return queryInterface.bulkInsert('Users', [{
      id: 1,
      username: 'enahomurphy',
      firstname: 'Enaho',
      lastname: 'Murphy',
      email: 'enahomurphy@gmail.com',
      password: bcrypt.hashSync('andela'),
      role: 'Admin',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      username: Faker.Internet.userName(),
      firstname: Faker.Name.firstName(),
      lastname: Faker.Name.lastName(),
      email: Faker.Internet.email(),
      password: bcrypt.hashSync('1234567'),
      role: 'regular',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      username: Faker.Internet.userName(),
      firstname: Faker.Name.firstName(),
      lastname: Faker.Name.lastName(),
      email: Faker.Internet.email(),
      password: bcrypt.hashSync('1234567'),
      role: 'regular',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {
      // validate: false
    });
  },

  down(queryInterface) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('Users', null, {});
  }
};
