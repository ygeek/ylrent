/**
 * Created by meng on 16/6/12.
 */

"use strict";

import express from 'express';
import log4js from 'log4js';

const logger = log4js.getLogger('normal');
logger.trace('debug');

const router = express.Router();

const isDebug = true;

router.get('/', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.redirect('/user/login');
  }
  
  res.render('cms-home', {});
});

router.get('/top', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.redirect('/user/login');
  }
  
  res.render('cms-top', {});
});

router.get('/menu', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.redirect('/user/login');
  }
  
  res.render('cms-menu', {});
});

router.get('/index', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.redirect('/user/login');
  }
  
  res.render('cms-index', {});
});

module.exports = router;
