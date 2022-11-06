import * as dotenv from 'dotenv';
dotenv.config();

import databaseConfig from './src/config/database.config';

module.exports = {
  test: databaseConfig,
  development: databaseConfig,
  staging: databaseConfig,
  production: databaseConfig
};
