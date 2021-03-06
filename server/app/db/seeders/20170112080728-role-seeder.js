module.exports = {
  up(queryInterface) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
    return queryInterface.bulkInsert('Roles', [{
      title: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'regular',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down(queryInterface) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */

    return queryInterface.bulkDelete('Roles', null, { returning: true });
  }
};
