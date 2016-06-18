/**
 * Created by meng on 16/6/17.
 */

"use strict";

import express from 'express';
import mongoose from 'mongoose';
import _ from 'lodash';

import { importDailyRent, updateDailyRent } from '../utils/importer';

const DailyRent = mongoose.model('DailyRent');
const District = mongoose.model('District');
const CommerseArea = mongoose.model('CommerseArea');
const Comunity = mongoose.model('Comunity');

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
      let searchDistricts = await District.find({name: new RegExp(keyword)}).exec();
      let searchCommerseAreas = await CommerseArea.find({name: new RegExp(keyword)}).exec();
      let searchComunities = await Comunity.find({name: new RegExp(keyword)}).exec();

      query['$or'] = [
        {'district': {'$in': searchDistricts}},
        {'commerseArea': {'$in': searchCommerseAreas}},
        {'comunity': {'$in': searchComunities}}
      ];
    }

    let options = {
      page: page,
      limit: 10,
      lean: true,
      populate: ['comunity', 'commerseArea', 'district']
    };

    DailyRent
      .paginate(query, options)
      .then(dailies => {
        res.render('cms-dailies', {
          dailies: dailies,
          keyword: keyword
        });
      });
  })().catch(err => {
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
  
  (async function() {
    let daily = await DailyRent
      .findById(dailyId)
      .populate('district commerseArea comunity')
      .exec();

    let communities = await Comunity.find({}).exec();

    res.render('cms-dailyDetail', {
      daily: daily,
      communities: communities
    });
  })().catch(err => {
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

router.get('/add', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.redirect('/user/login');
  }
  
  (async function() {
    let communities = await Comunity.find({}).exec();

    res.render('cms-dailyAdd', {
      communities: communities
    });
  })().catch(err => {
    res.render('error', {
      error: err,
      message: err.message,
      stack: err.stack
    });
  });
});

router.post('/add', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.json({error: '请以管理员身份重新登录'});
  }

  let dailyObj = req.body;
  dailyObj.imagekeys =  _.filter(dailyObj.imagekeys.split(/\s+/), function(key) {
    return key && key.length > 0;
  });

  importDailyRent(dailyObj).then(daily => {
    res.json({ daily: daily });
  }).catch(err => {
    res.json({error: err.message});
  });
});

router.get('/update/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.redirect('/user/login');
  }

  const dailyId = req.params.id;
  
  (async function() {
    let daily = await DailyRent
      .findById(dailyId)
      .populate('district commerseArea comunity')
      .exec();
    let communities = await Comunity
      .find({})
      .populate('district commerseArea')
      .exec();
    
    res.render('cms-dailyUpdate', {
      daily: daily,
      communities: communities
    });
  })().catch(err => {
    res.status(404);
  });
});

router.post('/update/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.json({error: '请以管理员身份重新登录'});
  }

  let dailyId = req.params.id;
  let dailyObj = req.body;
  dailyObj.imagekeys =  _.filter(dailyObj.imagekeys.split(/\s+/), function(key) {
    return key && key.length > 0;
  });
  
  updateDailyRent(dailyId, dailyObj).then(daily => {
    res.json({ daily: daily });
  }).catch(err => {
    res.json({error: err.message});
  });
});

router.post('/delete/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.json({error: '请以管理员身份重新登录'});
  }

  let dailyId = req.params.id;
  
  DailyRent.findByIdAndRemove(dailyId, function(err, daily) {
    if (err) {
      res.json({ error: err.message });
    } else {
      res.json({ daily: daily });
    }
  });
});

module.exports = router;
