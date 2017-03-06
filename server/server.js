import Express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './app/db/models/index';
import routes from './app/routes';


const app = Express();
dotenv.config();

app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

routes(Express, app);

const port = process.env.PORT || 4000;

db.sequelize.sync()
  .then(() => {
    app.listen(port, () => {
      /* eslint no-console: 0 */
      console.log(`express is listening on port ${port}`);
    });
  });

export default app;
