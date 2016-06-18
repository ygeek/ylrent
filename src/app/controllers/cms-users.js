/**
 * Created by meng on 16/6/18.
 */

"use strict";

import express from 'express';
import mongoose from 'mongoose';

const User = mongoose.model('User');

const router = express.Router();

const isDebug = true;

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
      lean: true
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
