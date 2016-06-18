/**
 * Created by meng on 16/6/18.
 */

'use strict';

import express from 'express';
import mongoose from 'mongoose';

import { importDistrict, updateDistrict } from '../utils/importer';

const District = mongoose.model('District');

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
    lean: true
  };

  District
    .paginate({}, options)
    .then(districts => {
      res.render('cms-districts', {
        districts: districts
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
  
  res.render('cms-districtAdd', {});
});

router.get('/update/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.redirect('/user/login');
  }
  
  let districtId = req.params.id;

  (async function() {
    let district = await District.findById(districtId).exec();
    res.render('cms-districtUpdate', {
      district: district
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

  let districtObj = req.body;

  importDistrict(districtObj).then(district => {
    res.json({ district: district });
  }).catch(err => {
    res.json({ error: err.message });
  });
});

router.post('/update/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.json({error: '请以管理员身份重新登录'});
  }

  let districtId = req.params.id;
  let districtObj = req.body;
  
  updateDistrict(districtId, districtObj).then(district => {
    res.json({ district: district });
  }).catch(err => {
    res.json({ error: err.message });
  });
});

router.post('/delete/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.json({error: '请以管理员身份重新登录'});
  }

  const districtId = req.params.id;

  District.findByIdAndRemove(districtId, function(err, district) {
    if (err) {
      res.json({ error: err.message });
    } else {
      res.json({ district: district });
    }
  });
});

module.exports = router;