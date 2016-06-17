/**
 * Created by meng on 16/6/17.
 */

"use strict";

import express from 'express';
import mongoose from 'mongoose';

const Comunity = mongoose.model('Comunity');

const router = express.Router();

const isDebug = true;

router.get('/list', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.redirect('/user/login');
  }

  let page = parseInt(req.query.page);
  page = isNaN(page) ? 1 : page;

  let options = {
    page: page,
    limit: 10,
    lean: true,
    populate: ['commerseArea', 'district']
  };

  Comunity
    .paginate({}, options)
    .then(communities => {
      res.render('cms-communities', {
        communities: communities
      });
    })
    .catch(err => {
      res.render('error', {
        error: err,
        message: err.message,
        stack: err.stack
      });
    });
});

router.get('/detail/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.redirect('/user/login');
  }
  
  let communityId = req.params.id;
  
  Comunity
    .findById(communityId)
    .populate('district commerseArea')
    .exec()
    .then(community => {
      res.render('cms-communityDetail', {
        community: community
      });
    })
    .catch(err => {
      res.render('error', {
        error: err,
        message: err.message,
        stack: err.stack
      });
    });
});

module.exports = router;
