export default (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    public: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    editable: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    classMethods: {
      associate: (models) => {
        Document.belongsTo(models.User, {
          foreignKey: 'ownerId',
          onDelete: 'CASCADE'
        });
      }
    }
  });
  return Document;
};
