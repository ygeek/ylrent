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
const Daily = mongoose.model('Daily');
const ApartmentOrder = mongoose.model('ApartmentOrder');
const DailyOrder = mongoose.model('DailyOrder');

const router = express.Router();

router.post('/apartment', (req, res, next) => {
  const apartmentId = req.body.apartmentId;
  const name = req.body.name;
  const mobile = req.body.mobile;
  const email = req.body.email;
  const comment = req.body.comment;
  
  const smscode = req.body.smscode;
  
  const currentURL = '/apartment/detail/' + apartmentId;

  verifySMSCode(mobile, smscode, (err, body) => {
    logger.trace('verify sms code: ', err, body);
    if (err || body && body.code && body.code !== 0) {
      logger.trace('verify sms error: ', err, body);
      req.flash('error', '短信验证失败!');
      res.render(currentURL);
    } else {
      logger.trace('verify sms success', body);
      Apartment
        .findById(apartmentId)
        .populate('comunity commerseArea district')
        .exec((err, apartment) => {
          if (!err && apartment) {
            let order = new ApartmentOrder();
            order.apartment = apartment;
            order.name = name;
            order.mobile = mobile;
            order.email = email;
            order.comment = comment;
            order.save(function(err) {
              if (!err) {
                req.flash('info', '公寓预订成功!');
                res.render(currentURL);
              } else {
                req.flash('error', err && err.message ? err.message : '预订失败请重试');
                res.render(currentURL);
              }
            });
          } else {
            req.flash('error', err && err.message ? err.message : '预订失败请重试');
            res.render(currentURL);
          }
        });
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
  
  verifySMSCode(mobile, smscode, (err, body) => {
    if (err || body && body.code && body.code !== 0) {
      req.flash('error', err && err.message ? err.message : '短信验证失败');
      res.render(currentURL);
    } else {
      Daily
        .findById(dailyId)
        .populate('comunity commerseArea district')
        .exec((err, daily) => {
          if (!err && daily) {
            let order = new DailyOrder();
            order.daily = daily;
            order.name = name;
            order.mobile = mobile;
            order.startDate = startDate;
            order.endDate = endDate;
            order.save(function(err) {
              if (!err) {
                req.flash('info', '预订成功!');
                res.render(currentURL);
              } else {
                req.flash('error', err && err.message ? err.message : '预订失败请重试!');
                res.render(currentURL);
              }
            });
          } else {
            req.flash('error', err && err.message ? err.message : '预订失败请重试!');
            res.render(currentURL);
          }
        });
    }
  });
});