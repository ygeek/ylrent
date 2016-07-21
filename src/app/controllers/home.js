/**
 * Created by meng on 16/5/20.
 */

'use strict';

import express from 'express';
import mongoose from 'mongoose';
import log4js from 'log4js';

const District = mongoose.model('District');
const CommerseArea = mongoose.model('CommerseArea');
const Comunity = mongoose.model('Comunity');
const ApartmentType = mongoose.model('ApartmentType');
const DailyRent = mongoose.model('DailyRent');
const News = mongoose.model('News');

const logger = log4js.getLogger('normal');

const router = express.Router();

router.get('/', (req, res, next) => {
  logger.info('request from', req.device.type);

  if (req.device.type === 'phone') {
    return res.render('phone/index.ejs', {});
  }

  let districtPromise = (async function() {
    let districts = await CommerseArea
      .aggregate({
        '$group': { _id: '$district', commerseAreas: { '$addToSet': '$name' } }
      }).exec();
    
    return await District
      .populate(districts, {
        path: '_id',
        select: 'name'
      });
  })();
  
  let apartmentPromise = 
    ApartmentType
    .find({'$where': 'this.imagekeys.length > 1'})
    .limit(6)
    .sort('-isHot')
    .populate('comunity commerseArea district')
    .exec();

  let comunityPromise =
    Comunity
      .find({})
      .limit(6)
      .sort('-isHot')
      .populate('commerseArea district')
      .exec();

  let dailyPromise =
    DailyRent
      .find({})
      .limit(6)
      .sort('-isHot')
      .populate('comunity commerseArea district')
      .exec();
  
  let latestNewsPromise = News
    .find({})
    .limit(8)
    .sort('-date')
    .exec();

  Promise
    .all([
      apartmentPromise, 
      comunityPromise, 
      dailyPromise, 
      districtPromise,
      latestNewsPromise
    ])
    .then(([
      apartmentTypes, 
      comunities, 
      dailyRents, 
      districts,
      latestNews
    ]) => {
      res.render('index', {
        title: '源涞国际',
        user: req.user,
        apartmentTypes: apartmentTypes,
        comunities: comunities,
        dailyRents: dailyRents,
        districts: districts,
        latestNews: latestNews
      });
    }).catch((err) => {
      res.render('error', {
        error: err,
        message: err.message,
        stack: err.stack
      });
    });
});

router.get('/page.aspx', (req, res, next) => {
  res.redirect('/');
});

router.get('/baidu_verify_yMalUPF2NN.html', (req, res, next) => {
  res.render('baidu_verify_yMalUPF2NN');
});

router.get('/about', (req, res, next) => {
  res.render('about');
});

router.get('/delegate', (req, res, next) => {
    if (req.device.type === 'phone') {
    return res.render('phone/delegate.ejs', {});
  }
  res.render('delegate');
});

router.get('/team', (req, res, next) => {
  res.render('team');
});

module.exports = router;
