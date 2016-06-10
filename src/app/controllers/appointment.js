/**
 * Created by meng on 16/6/4.
 */
"use strict";

import express from 'express';
import mongoose from 'mongoose';
import log4js from 'log4js';
import { verifySMSCode } from '../utils/sms';

const logger = log4js.getLogger('normal');

const Apartment = mongoose.model('Apartment');
const DailyRent = mongoose.model('DailyRent');
const ApartmentOrder = mongoose.model('ApartmentOrder');
const DailyOrder = mongoose.model('DailyOrder');
const DelegationOrder = mongoose.model('DelegationOrder');

const router = express.Router();

router.get('/apartment/:id', (req, res, next) => {
  let apartmentId = req.params.id;
  Apartment
    .findById(apartmentId)
    .populate('district commerseArea comunity apartmentType')
    .exec(function(err, apartment) {
    if (!err && apartment) {
      res.render('phone/apartmentOrder.ejs', {
        apartment: apartment
      });
    } else {
      res.status(404);
    }
  });
});

router.get('/daily/:id', (req, res, next) => {
  let dailyId = req.params.id;
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;

  DailyRent
    .findById(dailyId)
    .populate('district commerseArea comunity')
    .exec(function(err, daily) {
    if (!err && daily) {
      res.render('phone/dailyOrder.ejs', {
        daily: daily,
        startDate: startDate,
        endDate: endDate
      });
    } else {
      res.status(404);
    }
  });
});

router.post('/apartment', (req, res, next) => {
  console.log('post appointment apartment: ', req.body);
  const apartmentId = req.body.apartmentId;
  const name = req.body.name;
  const mobile = req.body.mobile;
  const email = req.body.email;
  const comment = req.body.comment;
  
  const smscode = req.body.smscode;
  
  const currentURL = '/apartment/detail/' + apartmentId;
  
  (async function() {
    let smsOK = await verifySMSCode(mobile, smscode);
    
    if (!smsOK) {
      throw new Error('短信验证失败');
    }

    let apartment = await Apartment
      .findById(apartmentId)
      .populate('comunity commerseArea district')
      .exec();
    
    if (apartment) {
      let order = new ApartmentOrder();
      order.apartment = apartment;
      order.name = name;
      order.mobile = mobile;
      order.email = email;
      order.comment = comment;
      await order.save();
      
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        res.json({
          code: 0,
          msg: '公寓预订成功'
        });
      } else {
        req.flash('info', '公寓预订成功!');
        res.redirect(currentURL);
      }
    } else {
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        res.json({
          code: -2,
          msg: '房源不存在'
        });
      } else {
        res.status(404);
      }
    }
  })().catch(err => {
    logger.trace('appointment apartment error: ', err);

    const errMessage = err.error && err.error.error || err.message;
    
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      res.json({
        code: -1,
        msg: errMessage
      });
    } else {
      req.flash('error', errMessage);
      res.redirect(currentURL);
    }
  });
});

router.post('/daily', (req, res, next) => {
  const dailyId = req.body.dailyId;
  const name = req.body.name;
  const mobile = req.body.mobile;
  const startDate = new Date(req.body.startDate);
  const endDate = new Date(req.body.endDate);
  
  const smscode = req.body.smscode;
  
  const currentURL = '/daily/detail/' + dailyId;
  
  (async function() {
    let smsOK = await verifySMSCode(mobile, smscode);

    if (!smsOK) {
      throw new Error('短信验证失败');
    }

    let daily = await DailyRent
      .findById(dailyId)
      .populate('comunity commerseArea district')
      .exec();
    
    if (daily) {
      let order = new DailyOrder();
      order.daily = daily;
      order.name = name;
      order.mobile = mobile;
      order.startDate = startDate;
      order.endDate = endDate;
      await order.save();

      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        res.json({
          code: 0,
          msg: '预订成功'
        });
      } else {
        req.flash('info', '预订成功!');
        res.redirect(currentURL);
      }
    } else {
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        res.json({
          code: -1,
          msg: '房源信息有误'
        });
      } else {
        res.status(404);
      }
    }
  })().catch(err => {
    logger.info('appointment daily error:', err);
    const errMessage = err.error && err.error.error || err.message;
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      res.json({
        code: -2,
        msg: errMessage
      });
    } else {
      req.flash('error', errMessage ? errMessage : '预订失败请重试!');
      res.redirect(currentURL);
    }
  });
});

router.post('/delegate', (req, res, next) => {
  const name = req.body.name;
  const mobile = req.body.mobile;
  const startDate = new Date(req.body.startDate);
  const communityName = req.body.communityName;
  const structure = req.body.structure;
  const price = req.body.price;
  
  const smscode = req.body.smscode;
  
  const currentURL = '/delegate';
  
  (async function() {
    let smsOK = await verifySMSCode(mobile, smscode);

    if (!smsOK) {
      throw new Error('短信验证失败');
    }

    let order = new DelegationOrder();
    order.name = name;
    order.mobile = mobile;
    order.startDate = startDate;
    order.communityName = communityName;
    order.structure = structure;
    order.price = price;
    await order.save();
    
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      res.json({
        code: 0,
        msg: '委托成功'
      });
    } else {
      req.flash('info', '委托成功');
      res.redirect(currentURL);
    }
  })().catch(err => {
    const errMessage = err.error && err.error.error || err.message;
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      res.json({
        code: -1,
        msg: errMessage
      });
    } else {
      req.flash('error', errMessage ? errMessage : '委托失败请重试');
      res.redirect(currentURL); 
    }
  });
});

module.exports = router;
