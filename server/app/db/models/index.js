import Fs from 'fs';
import Path from 'path';
import Sequelize from 'sequelize';
import * as DbConfig from '../../../../config/db';

const basename = Path.basename(module.filename);
const env = process.env.NODE_ENV || 'development';
const db = {};
const config = DbConfig[env];
const sequelize = new Sequelize(config.url, config);

Fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) &&
    (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = sequelize.import(Path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;

export default db;
