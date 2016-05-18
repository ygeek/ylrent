/**
 * Created by meng on 16/5/18.
 */

'use strict';

import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';

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

router.post('/register', (req, res, next) => {
  User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
    if (err) {
      return res.render('register', {
        error: err
      });
    }
    passport.authenticate('local')(req, res, function() {
      res.redirect('/');
    });
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
