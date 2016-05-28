/**
 * Created by meng on 16/5/20.
 */

'use strict';

import express from 'express';
import mongoose from 'mongoose';
import log4js from 'log4js';

const Comunity = mongoose.model('Comunity');
const Apartment = mongoose.model('Apartment');
const DailyRent = mongoose.model('DailyRent');

const logger = log4js.getLogger('normal');

const router = express.Router();

router.get('/', (req, res, next) => {

  logger.info('request from', req.device.type);
  
  let apartmentPromise = new Promise((resolve, reject) => {
    Apartment
      .find({})
      .limit(6)
      .sort('-isHot')
      .populate('apartmentType comunity commerseArea district')
      .exec((err, apartments) => {
        if (err) {
          reject(err);
        } else {
          resolve(apartments);
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
    .then(([apartments, comunities, dailyRents]) => {
      res.render('index', {
        title: '源涞国际',
        user: req.user,
        apartments: apartments,
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

module.exports = router;
