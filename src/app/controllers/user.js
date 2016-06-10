/**
 * Created by meng on 16/5/18.
 */

'use strict';

import express from 'express';
import mongoose from 'mongoose';
import log4js from 'log4js';
import passport from 'passport';
import promisify from 'es6-promisify';
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
    let apartmentOrders = await ApartmentOrder.find({ mobile: req.user.username }).populate('apartment').exec();
    let dailyOrders = await DailyOrder.find({ mobile: req.user.username }).populate('daily').exec();

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
  if (req.device.type === 'phone') {
    res.render('phone/register.ejs', {});
  } else {
    res.render('register', {
      usernameError: null,
      smsError: null,
      nameError: null,
      passwordError: null,
      password2Error: null,
      corpNameError: null
    });
  }
});

router.get('/login', (req, res) => {
  logger.trace('login from ', req.device.type);
  if (req.device.type === 'phone') {
    res.render('phone/login.ejs', {});
  } else {
    res.render('login', {
      usernameError: null,
      passwordError: null
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
  requestSMSCode(mobile)
    .then(body => {
      logger.trace('request sms code success');
      res.json({
        code: 0,
        msg: '发送验证码成功'
      });
    })
    .catch(err => {
      logger.trace('request sms code failed', err);
      res.json({
        code: err.code || -1,
        msg: (err.error && err.error.message) || err.message || '发送验证码失败'
      });
    });
});

router.post('/verifysms', (req, res, next) => {
  const mobile = req.body.mobile;
  const smscode = req.body.smscode;
  verifySMSCode(mobile, smscode)
    .then(smsOK => {
      if (!smsOK) {
        res.send({
          code: -1,
          msg: '短信验证失败'
        });
      } else {
        res.send({
          code: 0,
          msg: '短信验证成功'
        });
      }
    })
    .catch(err => {
      res.send({
        code: (err && err.code) || -1,
        msg: (err && err.message) || '短信验证失败'
      });
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
  
  (async function() {
    let smsOK = await verifySMSCode(username, smscode);
    if (smsOK) {
      logger.trace('verify sms failed');
      return res.render('register', {
        usernameError: null,
        smsError: '短信验证失败',
        nameError: null,
        passwordError: null,
        password2Error: null,
        corpNameError: null
      }); 
    } else {
      logger.trace('verify sms success');

      const register = promisify(User.register, User);
      await register(new User(userData), password);
      
      const authenticate = promisify(passport.authenticate('local'));
      await authenticate(req, res);

      res.redirect('/');
    }
  })().catch(err => {
    res.render('register', {
      usernameError: err.message,
      smsError: null,
      nameError: null,
      passwordError: null,
      password2Error: null,
      corpNameError: null
    });
  });
});

router.post('/login', function(req, res, next) {
  (async function() {
    const authenticate = promisify(User.authenticate(), { multiArgs: true });
    let [user, options] = await authenticate(req.body.username, req.body.password);
    if (!user) {
      return res.render('login', {
        usernameError: null,
        passwordError: options.message
      });
    }
    
    const login = promisify(req.login, req);
    await login(user);
    res.redirect('/');
  }).catch(err => {
    res.render('login', {
      usernameError: null,
      passwordError: err.message || '登录失败请重试'
    });
  });
});

router.post('/forget', function(req, res, next) {
  const username = req.body.username;
  const smscode = req.body.smscode;
  const password = req.body.password;

  (async function() {
    let smsOK = await verifySMSCode(username, smscode);
    if (!smsOK) {
      return res.render('forget', {
        usernameError: null,
        smsError: '短信验证失败',
        passwordError: null,
        password2Error: null
      });
    }

    let user = await User.findByUsername(username);
    if (!user) {
      return res.render('forget', {
        usernameError: '该用户不存在',
        smsError: null,
        passwordError: null,
        password2Error: null
      });
    }

    let setPassword = promisify(user.findByUsername, user);
    await setPassword(password);
    await user.save();
    res.redirect('/user/login/');
  })().catch(err => {
    res.render('forget', {
      usernameError: '重置密码失败.' + err.message,
      smsError: null,
      passwordError: null,
      password2Error: null
    });
  });
});

router.post('/password', (req, res, next) => {
  if (!req.user) {
    return res.redirect('/user/login');
  }
  
  const oldPassword = req.body.oldpassword;
  const password = req.body.password;

  (async function() {
    const authenticate = promisify(User.authenticate(), { multiArgs: true });
    let [user, options] = await authenticate(req.user.username, oldPassword);
    if (!user) {
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        res.json({
          code: -1,
          msg: options.message || '验证失败,请重试'
        });
      } else {
        req.flash('error', options.message || '验证失败,请重试');
        return res.redirect('/user/');
      }
    }

    let setPassword = promisify(user.setPassword, user);
    await setPassword(password);

    await user.save();

    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      res.json({
        code: 0,
        msg: '密码修改成功'
      });
    } else {
      req.flash('info', '密码修改成功');
      res.redirect('/user/');
    }
  })().catch(err => {
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      res.json({
        code: -1,
        msg: err.message
      });
    } else {
      req.flash('error', err.message);
      res.redirect('/user/');
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
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        if (err) {
          res.json({
            code: -1,
            msg: err.message
          });
        } else {
          res.json({
            code: 0,
            msg: '信息更新成功'
          });
        }
      } else {
        if (err) {
          req.flash('error', err.message);
          res.redirect('/user/');
        } else {
          req.flash('info', '信息更新成功');
          res.redirect('/user/');
        }
      }
    });
  } else {
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      res.json({
        code: -1,
        msg: '信息填写有误'
      });
    } else {
      req.flash('error', '信息填写有误');
      req.redirect('/user/');
    }
  }
});

module.exports = router;
