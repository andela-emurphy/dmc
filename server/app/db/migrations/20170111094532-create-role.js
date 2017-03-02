module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Roles', {
      title: {
        type: Sequelize.STRING,
        defaultValue: 'regular',
        primaryKey: true,
        unique: true
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: new Date(),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: new Date()
      }
    });
  },
  down(queryInterface) {
    return queryInterface.dropTable('Roles');
  }
};
