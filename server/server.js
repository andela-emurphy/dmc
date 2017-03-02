import Express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';

import db from './app/db/models/index';
import routes from './app/routes';


const app = Express();


app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

routes(Express, app);
/* eslint no-console: 0 */


db.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection successful');
  })
  .catch((error) => {
    console.log('Error creating connection:', error);
  });

const port = process.env.PORT || 4000;

db.sequelize.sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`express is listening on port ${port}`);
    });
  });

export default app;
