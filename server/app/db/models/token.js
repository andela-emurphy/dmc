import Crypto from 'crypto';

export default (sequelize, DataTypes) => {
  const Token = sequelize.define('Token', {
    token_hash: DataTypes.STRING,
    token: {
      type: DataTypes.VIRTUAL,
      allowNull: false,
      validate: {
        len: [1]
      },
      set(value) {
        const hash = Crypto.createHash('md5')
          .update(value)
          .digest('hex');
        this.setDataValue('token_hash', hash);
        this.setDataValue('token', value);
      }
    }
  });
  return Token;
};
