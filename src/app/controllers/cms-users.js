/**
 * Created by meng on 16/6/18.
 */

"use strict";

import express from 'express';
import mongoose from 'mongoose';
import config from '../../config';

const User = mongoose.model('User');

const router = express.Router();

const isDebug = config.isDebug;

router.post('/makestaff/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.json({error: '请以管理员身份重新登录'});
  } 
  
  let userId = req.params.id;
  
  User
    .findByIdAndUpdate(userId, {isStaff: true})
    .exec()
    .then(user => {
      res.json({user: user});
    })
    .catch(err => {
      res.json({error: err.message});
    });
});

router.post('/cancelstaff/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.json({error: '请以管理员身份重新登录'});
  }

  let userId = req.params.id;
  
  User
    .findByIdAndUpdate(userId, {isStaff: false})
    .exec()
    .then(user => {
      res.json({user: user});
    })
    .catch(err => {
      res.json({error: err.message});
    });
});

router.get('/list', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.redirect('/user/login');
  }
  
  let page = parseInt(req.query.page);
  page = isNaN(page) ? 1 : page;
  
  (async function() {
    let query = {};

    let keyword = req.query.keyword;
    if (keyword) {
      query['$or'] = [
        {'username': keyword},
        {'name': keyword}
      ];

      let id = Number(keyword);
      if (id && !isNaN(id)) {
        query['$or'].push({_id: id});
      }
    }

    let options = {
      page: page,
      limit: 10,
      lean: true,
      sort: {isStaff: -1}
    };
    
    let users = await User.paginate(query, options);
    res.render('cms-users', {
      users: users
    });
  })().catch(err => {
    res.render('error', {
      error: err,
      message: err.message,
      stack: err.stack
    });
  });
});

module.exports = router;
