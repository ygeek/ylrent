/**
 * Created by meng on 16/5/20.
 */

'use strict';

import path from 'path';

// BASIC CONFIG
const config = {
  // address of mongodb
  db: process.env.MONGOURI || 'mongodb://localhost:27017/test',
  // environment
  env: process.env.NODE_ENV || 'development',
  // port on which to listen
  port: 5000,
  // path to root directory of this app
  root: path.normalize(__dirname)
};

export default config;