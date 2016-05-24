/**
 * Created by meng on 16/5/18.
 */

'use strict';

import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import { requestSMSCode, verifySMSCode } from '../utils/sms';

const User = mongoose.model('User');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('user', {
    user: req.user
  });
});

router.get('/register', (req, res, next) => {
  res.render('register', {});
});

router.get('/login', (req, res) => {
  res.render('login', { user: req.user });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/forget', function(req, res) {
  res.render('forget');
});

router.post('/requestsms', (req, res, next) => {
  const mobile = req.body.mobile;
  requestSMSCode(mobile, (err, body) => {
    if (err) {
      res.send({
        code: (err && err.code) || -1,
        msg: '发送验证码失败'
      });
    } else {
      res.send({
        code: body.code || 0,
        msg: body.error || body.msg || '发送验证码成功'
      });
    }
  });
});

router.post('/verifysms', (req, res, next) => {
  const mobile = req.body.mobile;
  const smscode = req.body.smscode;
  verifySMSCode(mobile, smscode, (err, body) => {
    if (err) {
      res.send({
        code: (err && err.code) || -1,
        msg: '短信验证失败'
      });
    } else {
      res.send({
        code: body.code || 0,
        msg: body.error || body.msg || '短信验证成功'
      });
    }
  });
});

router.post('/register', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const smscode = req.body.smscode;

  verifySMSCode(username, smscode, (err, body) => {
    if (!err && body.code === 0) {
      User.register(new User({ username : username }), password, function(err, user) {
        if (err) {
          return res.render('register', {
            error: err
          });
        }
        passport.authenticate('local')(req, res, function() {
          res.redirect('/');
        });
      });
    } else {
      return res.render('register', {
        error: err,
        message: body.msg || body.error
      });
    }
  });
});

router.post('/login', function(req, res, next) {
  User.authenticate()(req.body.username, req.body.password, function(err, user, options) {
    if (err || !user) {
      return res.render('login', {
        error: err,
        message: options.message
      });
    }
    req.login(user, function(err) {
      res.redirect('/');
    });
  });
});

module.exports = router;
