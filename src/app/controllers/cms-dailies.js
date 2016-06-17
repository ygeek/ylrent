/**
 * Created by meng on 16/6/17.
 */

"use strict";

import express from 'express';
import mongoose from 'mongoose';

const DailyRent = mongoose.model('DailyRent');

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
    populate: ['comunity', 'commerseArea', 'district']
  };

  DailyRent
    .paginate({}, options)
    .then(dailies => {
      res.render('cms-dailies', {
        dailies: dailies
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

  let dailyId = req.params.id;

  DailyRent
    .findById(dailyId)
    .populate('district commerseArea comunity')
    .exec()
    .then(daily => {
      res.render('cms-dailyDetail', {
        daily: daily
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

router.post('/rent/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.json({error: '请以管理员身份重新登录'});
  }

  const dailyId = req.params.id;
  DailyRent.findByIdAndUpdate(dailyId, {isRenting: false}, function(err, daily) {
    if (err) {
      res.json({error: err.message});
    } else {
      res.json({daily: daily});
    }
  });
});

router.post('/available/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.json({error: '请以管理员身份重新登录'});
  }

  const dailyId = req.params.id;
  DailyRent.findByIdAndUpdate(dailyId, {isRenting: true}, function(err, daily) {
    if (err) {
      res.json({error: err.message});
    } else {
      res.json({daily: daily});
    }
  });
});

module.exports = router;
