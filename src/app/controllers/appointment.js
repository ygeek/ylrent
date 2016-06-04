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

  logger.trace('verify sms code: ', err, body);
  verifySMSCode(mobile, smscode, (err, body) => {
    if (err || body && body.code && body.code !== 0) {
      logger.trace('verify sms error: ', err, body);
      // TODO: display sms verified error in the same page
      res.render('error', {
        error: err,
        message: err ? err.message : '短信验证失败',
        stack: err ? err.stack : null
      });
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
                // TODO: display appointment success
                res.redirect('/');
              } else {
                res.render('error', {
                  error: err,
                  message: err ? err.message : '未知错误',
                  stack: err ? err.stack : null
                });
              }
            });
          } else {
            res.render('error', {
              error: err,
              message: err ? err.message : '未知错误',
              stack: err ? err.stack : null
            });
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
  
  verifySMSCode(mobile, smscode, (err, body) => {
    if (err || body && body.code && body.code != 0) {
      // TODO: display sms verified error in the same page
      res.render('error', {
        error: err,
        message: err ? err.message : '短信验证失败',
        stack: err ? err.stack : null
      });
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
                // TODO: display appointment success
                res.redirect('/');
              } else {
                res.render('error', {
                  error: err,
                  message: err ? err.message : '未知错误',
                  stack: err ? err.stack : null
                });
              }
            });
          } else {
            res.render('error', {
              error: err,
              message: err ? err.message : '未知错误',
              stack: err ? err.stack : null
            });
          }
        });
    }
  });
});