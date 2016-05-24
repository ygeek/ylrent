/**
 * Created by meng on 16/5/20.
 */

'use strict';

import express from 'express';
import mongoose from 'mongoose';

const Comunity = mongoose.model('Comunity');
const Apartment = mongoose.model('Apartment');
const DailyRent = mongoose.model('DailyRent');

const router = express.Router();

router.get('/', (req, res, next) => {

  let apartmentPromise = new Promise((resolve, reject) => {
    Apartment
      .find({})
      .limit(6)
      .sort('-isHot')
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

module.exports = router;
