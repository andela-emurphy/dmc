const Faker = require('Faker');
const bcrypt = require('bcryptjs');

module.exports = {
  up(queryInterface) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
    const arr = [];
    for (let index = 4; index < 20; index += 1) {
      arr.push(index);
    }
    const users = [...arr.map(num => ({
      id: num,
      username: Faker.Internet.userName(),
      firstname: Faker.Name.lastName(),
      lastname: Faker.Name.firstName(),
      email: Faker.Internet.email(),
      password: bcrypt.hashSync('andela'),
      role: 'regular',
      createdAt: new Date(),
      updatedAt: new Date()
    })), ...[{
      id: 1,
      username: 'enahomurphy',
      firstname: 'Enaho',
      lastname: 'Murphy',
      email: 'enahomurphy@gmail.com',
      password: bcrypt.hashSync('andela'),
      role: 'admin',
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
      username: 'saitama',
      firstname: 'sama',
      lastname: 'goku',
      email: 'goku@gmail.com',
      password: bcrypt.hashSync('1234567'),
      role: 'regular',
      createdAt: new Date(),
      updatedAt: new Date()
    }]];

    return queryInterface
      .bulkInsert('Users', users, { returning: true, validate: true });
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
