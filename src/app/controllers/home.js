/**
 * Created by meng on 16/5/20.
 */

'use strict';

import express from 'express';
import mongoose from 'mongoose';
import log4js from 'log4js';

const Comunity = mongoose.model('Comunity');
const ApartmentType = mongoose.model('ApartmentType');
const DailyRent = mongoose.model('DailyRent');

const logger = log4js.getLogger('normal');

const router = express.Router();

router.get('/', (req, res, next) => {

  logger.info('request from', req.device.type);

  if (req.device.type === 'phone') {
    return res.redirect('/apartment/');
  }
  
  let apartmentPromise = new Promise((resolve, reject) => {
    ApartmentType
      .find({'$where': 'this.imagekeys.length > 1'})
      .limit(6)
      .sort('-isHot')
      .populate('comunity commerseArea district')
      .exec((err, apartmentTypes) => {
        logger.info(apartmentTypes);
        if (err) {
          reject(err);
        } else {
          resolve(apartmentTypes);
        }
      });
  });

  let comunityPromise = new Promise((resolve, reject) => {
    Comunity
      .find({})
      .limit(6)
      .sort('-isHot')
      .populate('commerseArea district')
      .exec((err, comunities) => {
        if (err) {
          reject(err);
        } else {
          resolve(comunities);
        }
      });
  });
  
  let dailyPromise = new Promise((resolve, reject) => {
    DailyRent
      .find({})
      .limit(6)
      .sort('-isHot')
      .populate('comunity commerseArea district')
      .exec((err, dailyRents) => {
        if (err) {
          reject(err);
        } else {
          resolve(dailyRents);
        }
      });
  });

  Promise
    .all([apartmentPromise, comunityPromise, dailyPromise])
    .then(([apartmentTypes, comunities, dailyRents]) => {
      res.render('index', {
        title: '源涞国际',
        user: req.user,
        apartmentTypes: apartmentTypes,
        comunities: comunities,
        dailyRents: dailyRents
      });
    }).catch((err) => {
      res.render('error', {
        error: err,
        message: err.message,
        stack: err.stack
      });
    });
});

router.get('/about', (req, res, next) => {
  res.render('about');
});

router.get('/delegate', (req, res, next) => {
  res.render('delegate');
});

module.exports = router;
