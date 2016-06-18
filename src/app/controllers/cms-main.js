/**
 * Created by meng on 16/6/12.
 */

"use strict";

import express from 'express';
import log4js from 'log4js';
import { uptoken } from '../utils/qiniu';

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

router.get('/uptoken', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.json({error: '请以管理员身份重新登录'});
  }
  
  res.json({
    uptoken: uptoken()
  });
});

module.exports = router;
