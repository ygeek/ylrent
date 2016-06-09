/**
 * Created by meng on 16/5/18.
 */

'use strict';

import express from 'express';
import mongoose from 'mongoose';
import log4js from 'log4js';
import passport from 'passport';
import { requestSMSCode, verifySMSCode } from '../utils/sms';

const User = mongoose.model('User');

const logger = log4js.getLogger('normal');

const ApartmentOrder = mongoose.model('ApartmentOrder');
const DailyOrder = mongoose.model('DailyOrder');

const router = express.Router();

router.get('/', (req, res, next) => {
  if (req.user) {
    res.render('user', {});
  } else {
    res.redirect('/user/login');
  }
});

router.get('/orders', (req, res, next) => {
  if (!req.user) {
    return res.redirect('/user/login/');
  }

  (async function() {
    let apartmentOrders = await ApartmentOrder.find({}).populate('apartment').exec();
    let dailyOrders = await DailyOrder.find({}).populate('daily').exec();

    res.render('orders', {
      apartmentOrders,
      dailyOrders
    });
  })().catch(err => {
    req.flash('error', err);
    res.redirect('/user/');
  });
});

router.get('/register', (req, res, next) => {
  let nextURL = req.query.next;
  if (req.device.type === 'phone') {
    res.render('phone/register.ejs', {
      next: nextURL
    });
  } else {
    res.render('register', {
      usernameError: null,
      smsError: null,
      nameError: null,
      passwordError: null,
      password2Error: null,
      corpNameError: null,
      next: nextURL
    });
  }
});

router.get('/login', (req, res) => {
  logger.trace('login from ', req.device.type);
  let nextURL = req.query.next;
  if (req.device.type === 'phone') {
    res.render('phone/login.ejs', {
      next: nextURL
    });
  } else {
    res.render('login', {
      usernameError: null,
      passwordError: null,
      next: nextURL
    });
  }
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/forget', function(req, res) {
  res.render('forget', {
    usernameError: null,
    smsError: null,
    passwordError: null,
    password2Error: null
  });
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
  const name = req.body.name;
  const email = req.body.email;
  const isCorp = req.body.isCorp;
  const corpName = req.body.corpName;
  const title = req.body.title;
  const address = req.body.address;
  // const agreed = req.body.agreed;
  
  let userData = {
    username: username,
    name: name,
    email: email
  };
  if (isCorp) {
    userData.isCrop = isCorp;
    userData.corpName = corpName;
    userData.title = title;
    userData.address = address;
  }

  verifySMSCode(username, smscode, (err, body) => {
    logger.trace('verify sms code: ', err, body);
    if (err || body && body.code && body.code !== 0) {
      logger.trace('verify sms error: ', err, body);
      return res.render('register', {
        usernameError: null,
        smsError: body && ( body.msg || body.error ) || '短信验证失败',
        nameError: null,
        passwordError: null,
        password2Error: null,
        corpNameError: null
      });
    } else {
      logger.trace('verify sms success', body);
      User.register(new User(userData), password, function(err, user) {
        if (err) {
          return res.render('register', {
            usernameError: err,
            smsError: null,
            nameError: null,
            passwordError: null,
            password2Error: null,
            corpNameError: null
          });
        }
        passport.authenticate('local')(req, res, function() {
          res.redirect('/');
        });
      });
    }
  });
});

router.post('/login', function(req, res, next) {
  let nextURL = req.query.next;
  User.authenticate()(req.body.username, req.body.password, function(err, user, options) {
    if (err || !user) {
      return res.render('login', {
        usernameError: null,
        passwordError: options.message
      });
    }
    req.login(user, function(err) {
      if (err) {
        res.render('login', {
          usernameError: null,
          passwordError: err.message
        });
      } else {
        res.redirect(nextURL ? nextURL : '/');
      }
    });
  });
});

router.post('/forget', function(req, res, next) {
  const username = req.body.username;
  const smscode = req.body.smscode;
  const password = req.body.password;

  verifySMSCode(username, smscode, (err, body) => {
    if (!err && body && body.code === 0) {
      User.findByUsername(username).then(function(user) {
        if (user) {
          user.setPassword(password, function() {
            user.save(function(err) {
              if (err) {
                return res.render('forget', {
                  usernameError: '重置密码失败',
                  smsError: null,
                  passwordError: null,
                  password2Error: null
                });
              } else {
                res.redirect('/user/login/');
              }
            });
          });
        } else {
          return res.render('forget', {
            usernameError: '该用户不存在',
            smsError: null,
            passwordError: null,
            password2Error: null
          });
        }
      });
    } else {
      return res.render('forget', {
        usernameError: null,
        smsError: body && ( body.msg || body.error ) || '短信验证失败',
        passwordError: null,
        password2Error: null
      });
    }
  });
});

router.post('/password', (req, res, next) => {
  if (!req.user) {
    return res.redirect('/user/login');
  }
  
  const oldPassword = req.body.oldpassword;
  const password = req.body.password;
  
  User.authenticate()(req.user.username, oldPassword, function(err, user, options) {
    if (err || !user) {
      if (err) {
        req.flash('error', err.message);
      }
      res.redirect('/user/');
    } else {
      user.setPassword(password, function() {
        user.save(err => {
          if (err) {
            req.flash('error', err.message);
            res.redirect('/user/');
          } else {
            req.flash('info', '密码修改成功');
            res.redirect('/user/');
          }
        });
      });
    }
  });
});

router.post('/update', (req, res, next) => {
  if (!req.user) {
    return res.redirect('/user/login');
  }

  const corpName = req.body.corpName;
  const title = req.body.title;
  const tel = req.body.tel;
  const address = req.body.Address;

  if (corpName && title && tel && address) {
    req.user.isCrop = true;
    req.user.corpName = corpName;
    req.user.title = title;
    req.user.tel = tel;
    req.user.Address = address;
    req.user.save(err => {
      if (err) {
        req.flash('error', err.message);
        res.redirect('/user/');
      } else {
        req.flash('info', '信息更新成功');
        res.redirect('/user/');
      }
    });
  } else {
    req.flash('error', '信息填写有误');
    req.redirect('/user/');
  }
});

module.exports = router;
