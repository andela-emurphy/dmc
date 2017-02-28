import bcryptjs from 'bcryptjs';
import _ from 'underscore';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Oops. An account already exist with this username',
        fields: [sequelize.fn('lower', sequelize.col('email'))]
      },
      validate: {
        min: {
          args: 3,
          msg: `Username must start with a letter, have no spaces, 
            and be at least 3 characters.`
        },
        max: {
          args: 40,
          msg: `Username must start with a letter, have no spaces, 
            and be at less than 40 characters.`
        },
        is: {
          args: /^[A-Za-z][A-Za-z0-9-]+$/i,
          msg: `Username must start with a letter, have no spaces, 
            and be 3 - 40 characters.`
        }
      },
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^[a-z]+$/i,
          msg: 'First name should contain only alphabets'
        },
      }
    },
    lastname: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^[a-z]+$/i,
          msg: 'Last name should contain only alphabets'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: `Oops. Looks like you already have an account 
          with this email address. Please try to login`,
        fields: [sequelize.fn('lower', sequelize.col('email'))]
      },
      validate: {
        isEmail: {
          args: true,
          msg: 'The email you entered is not a valid',
        },
        max: {
          args: 254,
          msg: 'The email you entered is invalid or longer than 254 characters.'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [7],
          msg: 'The password you entered is less than 7 character s'
        },
        set(value) {
          const salt = bcryptjs.genSaltSync(10);
          const hash = bcryptjs.hashSync(value, salt);
          this.setDataValue('password', hash);
        }
      },
    }
  }, {
    classMethods: {
      associate: (models) => {
        User.hasMany(models.Document, {
          foreignKey: 'ownerId',
          onDelete: 'CASCADE',
        });
        User.belongsTo(models.Role, {
          foreignKey: 'role'
        });
      }
    },
    instanceMethods: {
      isPassword(password) {
        return bcryptjs.compareSync(password, this.password);
      },
      toPublicJson() {
        return _.pick(this, ['id', 'username',
          'firstname', 'lastname', 'email', 'role', 'Documents']);
      }
    },
    hooks: {
      beforeValidate: ((user, option, callback) => {
        user.email = user.email ? user.email.toLowerCase() : user.email;
        user.firstname = user.email ? user.firstname.trim()
          .toLowerCase() : null;
        user.lastname = user.firstname ? user.lastname.trim()
          .toLowerCase() : null;
        callback(null, option);
      })
    },
  });
  return User;
};
