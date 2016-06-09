/**
 * Created by meng on 16/6/4.
 */
"use strict";

import express from 'express';
import mongoose from 'mongoose';
import log4js from 'log4js';
import { asyncVerifySMSCode } from '../utils/sms';

const logger = log4js.getLogger('normal');

const Apartment = mongoose.model('Apartment');
const DailyRent = mongoose.model('DailyRent');
const ApartmentOrder = mongoose.model('ApartmentOrder');
const DailyOrder = mongoose.model('DailyOrder');
const DelegationOrder = mongoose.model('DelegationOrder');

const router = express.Router();


router.post('/apartment', (req, res, next) => {
  if (!req.user) {
    return res.redirect('/user/login/');
  }

  console.log('post appointment apartment: ', req.body);
  const apartmentId = req.body.apartmentId;
  const name = req.body.name;
  const mobile = req.body.mobile;
  const email = req.body.email;
  const comment = req.body.comment;
  const date = req.body.date;
  
  const smscode = req.body.smscode;
  
  const currentURL = '/apartment/detail/' + apartmentId;
  
  (async function() {
    let body = await asyncVerifySMSCode(mobile, smscode);
    
    if (body && body.code && body.code !== 0) {
      throw new Error('短信验证失败');
    }

    logger.trace('verify sms success', body);
    
    let apartment = await Apartment
      .findById(apartmentId)
      .populate('comunity commerseArea district')
      .exec();
    
    if (apartment) {
      let order = new ApartmentOrder();
      order.user = req.user;
      order.apartment = apartment;
      order.name = name;
      order.mobile = mobile;
      order.email = email;
      order.comment = comment;
      order.date = date;
      await order.save();
      req.flash('info', '公寓预订成功!');
      res.redirect(currentURL);
    } else {
      res.status(404);
    }
  })().catch(err => {
    logger.error('appointment apartment error: ', err);
    req.flash('error', err.message);
    res.redirect(currentURL);
  });
});

router.post('/daily', (req, res, next) => {
  if (!req.user) {
    return res.redirect('/user/login/');
  }
  
  const dailyId = req.body.dailyId;
  const name = req.body.name;
  const mobile = req.body.mobile;
  const startDate = new Date(req.body.startDate);
  const endDate = new Date(req.body.endDate);
  
  const smscode = req.body.smscode;
  
  const currentURL = '/daily/detail/' + dailyId;
  
  (async function() {
    let body = await asyncVerifySMSCode(mobile, smscode);

    if (body && body.code && body.code !== 0) {
      throw new Error('短信验证失败');
    }

    let daily = await DailyRent
      .findById(dailyId)
      .populate('comunity commerseArea district')
      .exec();
    
    if (!daily) {
      let order = new DailyOrder();
      order.user = req.user;
      order.daily = daily;
      order.name = name;
      order.mobile = mobile;
      order.startDate = startDate;
      order.endDate = endDate;
      await order.save();
      
      req.flash('info', '预订成功!');
      res.redirect(currentURL);
    } else {
      res.status(404);
    }
  })().catch(err => {
    req.flash('error', err && err.message ? err.message : '预订失败请重试!');
    res.redirect(currentURL);
  });
});

router.post('/delegate', (req, res, next) => {
  if (!req.user) {
    return res.redirect('/user/login/');
  }

  const name = req.body.name;
  const mobile = req.body.mobile;
  const startDate = new Date(req.body.startDate);
  const communityName = req.body.communityName;
  const structure = req.body.structure;
  const price = req.body.price;
  
  const smscode = req.body.smscode;
  
  const currentURL = '/delegate';
  
  (async function() {
    let body = await asyncVerifySMSCode(mobile, smscode);

    if (body && body.code && body.code !== 0) {
      throw new Error('短信验证失败');
    }

    let order = new DelegationOrder();
    order.user = req.user;
    order.name = name;
    order.mobile = mobile;
    order.startDate = startDate;
    order.communityName = communityName;
    order.structure = structure;
    order.price = price;
    await order.save();
    req.flash('info', '委托成功');
    res.redirect(currentURL);
  })().catch(err => {
    req.flash('error', err && err.message ? err.message : '委托失败请重试');
    res.redirect(currentURL); 
  });
});

module.exports = router;
