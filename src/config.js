/**
 * Created by meng on 16/5/20.
 */

'use strict';

import path from 'path';
import log4js from 'log4js';

// BASIC CONFIG
const config = {
  // address of mongodb
  db: process.env.MONGOURI || 'mongodb://localhost:27017/test',
  // environment
  env: process.env.NODE_ENV || 'dev',
  // port on which to listen
  port: process.env.NODE_ENV == 'production' ? 3000 : 5000,
  // path to root directory of this app
  root: path.normalize(__dirname),
  // log level
  logLevel: process.env.NODE_ENV == 'production' ? log4js.levels.INFO : log4js.levels.ALL
};

export default config;