const Faker = require('Faker');

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
    const arr = [];
    for (let index = 0; index < 50; index += 1) {
      arr.push(index);
    }
    const documents = arr.map(() => ({
      title: Faker.Lorem.sentence(),
      content: Faker.Lorem.paragraphs(),
      public: Math.round(Math.random()),
      editable: Math.round(Math.random()),
      ownerId: Math.floor(Math.random() * 3) + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    return queryInterface.bulkInsert('Documents', documents);
  },

  down(queryInterface) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('Documents', null, {});
  }
};
