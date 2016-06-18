/**
 * Created by meng on 16/6/18.
 */

'use strict';

import express from 'express';
import mongoose from 'mongoose';

import { importCommerseArea, updateCommerseArea } from '../utils/importer';

const District = mongoose.model('District');
const CommerseArea = mongoose.model('CommerseArea');

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
    populate: "district"
  };

  CommerseArea
    .paginate({}, options)
    .then(commerseAreas => {
      res.render('cms-commerseAreas', {
        commerseAreas: commerseAreas
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

router.get('/add', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.redirect('/user/login');
  }

  (async function() {
    let districts = await District.find({}).exec();

    res.render('cms-commerseAreaAdd', {
      districts: districts
    });
  })().catch(err => {
    res.render('error', {
      error: err,
      message: err.message,
      stack: err.stack
    });
  });
});

router.get('/update/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.redirect('/user/login');
  }
  
  let commerseAreaId = req.params.id;
  
  (async function() {
    let districts = await District.find({}).exec();
    let commerseArea = await CommerseArea.findById(commerseAreaId).exec();
    res.render('cms-commerseAreaUpdate', {
      districts: districts,
      commerseArea: commerseArea
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

  let commerseAreaObj = req.body;

  importCommerseArea(commerseAreaObj).then(commerseArea => {
    res.json({ commerseArea: commerseArea });
  }).catch(err => {
    res.json({ error: err.message });
  });
});

router.post('/update/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.json({error: '请以管理员身份重新登录'});
  }

  let commerseAreaId = req.params.id;
  let commerseAreaObj = req.body;
  
  updateCommerseArea(commerseAreaId, commerseAreaObj)
    .then(commerseArea => {
      res.json({ commerseArea: commerseArea });
    })
    .catch(err => {
      res.json({ error: err.message });
    });
});

router.post('/delete/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.json({error: '请以管理员身份重新登录'});
  }

  const commerseAreaId = req.params.id;

  CommerseArea.findByIdAndRemove(commerseAreaId, function(err, commerseArea) {
    if (err) {
      res.json({ error: err.message });
    } else {
      res.json({ commerseArea: commerseArea });
    }
  });
});

module.exports = router;
