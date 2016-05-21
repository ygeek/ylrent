/**
 * Created by meng on 16/5/20.
 */

'use strict';

import express from 'express';
import mongoose from 'mongoose';

const Comunity = mongoose.model('Comunity');
const House = mongoose.model('House');
const DailyRent = mongoose.model('DailyRent');

const router = express.Router();

router.get('/', (req, res, next) => {

  let housePromise = new Promise((resolve, reject) => {
    House
      .find({})
      .limit(6)
      .sort('-isHot')
      .exec((err, houses) => {
        if (err) {
          reject(err);
        } else {
          resolve(houses);
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
    .all([housePromise, comunityPromise, dailyPromise])
    .then(([houses, comunities, dailyRents]) => {
      res.render('index', {
        title: '源涞国际',
        user: req.user,
        houses: houses,
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
