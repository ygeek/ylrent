'use strict';

import path from 'path';
import bodyParser from 'body-parser';
import compress from 'compression';
import cookieParser from 'cookie-parser';
import express from 'express';
import favicon from 'serve-favicon';
import helmet from 'helmet';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import expressDevice from 'express-device';
import { setupAppLogger } from './app/utils/logger';
import config from './config';

// EXPRESS SET-UP
// create app
const app = express();
// use ejs and set views and static directories
app.set('view engine', 'ejs');
app.set('view options', { layout: false });
app.set('views', path.join(config.root, 'app/views'));
app.use(express.static(path.join(config.root, 'static')));

//add middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(expressDevice.capture());
app.use(compress());
app.use(cookieParser());
app.use(favicon(path.join(config.root, 'static/img/favicon.png')));
app.use(helmet());
app.use(session({
  secret: 'secret word',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// setup logger
setupAppLogger(app);

// MONGOOSE SET-UP
mongoose.connect(config.db);
const db = mongoose.connection;

db.on('error', () => {
  throw new Error(`unable to connect to database at ${config.db}`);
});

// load all models
require(path.join(config.root, 'app/models'));

// load all controllers
app.use('/', require(path.join(config.root, 'app/controllers')));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// general errors
app.use((err, req, res, next) => {
  const sc = err.status || 500;
  res.status(sc);
  res.render('error', {
    error: err,
    status: sc,
    message: err.message,
    stack: config.env === 'development' ? err.stack : ''
  });
});


// START AND STOP
const server = app.listen(config.port, () => {
  console.log(`listening on port ${config.port}`);
});
process.on('SIGINT', () => {
  console.log('\nshutting down!');
  db.close();
  server.close();
  process.exit();
});
