/**
 * Created by meng on 16/6/17.
 */

"use strict";

import express from 'express';
import mongoose from 'mongoose';

const Apartment = mongoose.model('Apartment');

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
    populate: ['comunity', 'commerseArea', 'district', 'apartmentType']
  };

  Apartment
    .paginate({}, options)
    .then(apartments => {
      res.render('cms-apartments', {
        apartments: apartments
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

  let apartmentId = req.params.id;

  Apartment
    .findById(apartmentId)
    .populate('district commerseArea comunity apartmentType')
    .exec()
    .then(apartment => {
      res.render('cms-apartmentDetail', {
        apartment: apartment
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

  const apartmentId = req.params.id;
  Apartment.findByIdAndUpdate(apartmentId, {leased: true}, function(err, daily) {
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

  const apartmentId = req.params.id;
  Apartment.findByIdAndUpdate(apartmentId, {leased: false}, function(err, daily) {
    if (err) {
      res.json({error: err.message});
    } else {
      res.json({daily: daily});
    }
  });
});

router.post('/recommend/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.json({error: '请以管理员身份重新登录'});
  }

  const apartmentId = req.params.id;
  Apartment.findByIdAndUpdate(apartmentId, {isHot: true}, function(err, daily) {
    if (err) {
      res.json({error: err.message});
    } else {
      res.json({daily: daily});
    }
  });
});

router.post('/unrecommend/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.json({error: '请以管理员身份重新登录'});
  }

  const apartmentId = req.params.id;
  Apartment.findByIdAndUpdate(apartmentId, {isHot: false}, function(err, daily) {
    if (err) {
      res.json({error: err.message});
    } else {
      res.json({daily: daily});
    }
  });
});

module.exports = router;
