export default (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true,
      defaultValue: 'regular',
      validate: {
        min: {
          args: 3,
          msg: `role must start be a letter, have no spaces, 
            and be at least 3 characters.`
        },
        max: {
          args: 40,
          msg: `Username must start with a letter, have no spaces, 
            and be at less than 40 characters.`
        },
        is: {
          args: /^[A-Za-z][A-Za-z]+$/i,
          msg: `Username must start with a letter, have no spaces, 
            and be 3 - 40 characters.`
        }
      }
    }
  });
  return Role;
};
