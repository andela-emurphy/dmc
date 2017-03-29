export default (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: `Role must start be a letter, have no spaces, 
            and be at least 3 characters.`
        },
      }
    },
    content: {
      type: DataTypes.TEXT,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    access: {
      type: DataTypes.STRING,
      values: ['public', 'private', 'role'],
      defaultValue: 'private'
    },
  }, {
    classMethods: {
      associate: (models) => {
        Document.belongsTo(models.User, {
          foreignKey: 'ownerId',
          onDelete: 'cascade'
        });
      }
    }
  });
  return Document;
};
