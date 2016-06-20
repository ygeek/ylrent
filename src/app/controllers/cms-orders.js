/**
 * Created by meng on 16/6/17.
 */

"use strict";

import express from 'express';
import mongoose from 'mongoose';
import moment from 'moment';
import { OrderStatus } from '../models/appointment';
import config from '../../config';

const ApartmentOrder = mongoose.model('ApartmentOrder');
const DailyOrder = mongoose.model('DailyOrder');
const DelegationOrder = mongoose.model('DelegationOrder');

const router = express.Router();

const isDebug = config.isDebug;

router.get('/apartment', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.redirect('/user/login');
  }

  let page = parseInt(req.query.page);
  page = isNaN(page) ? 1 : page;

  (async function() {
    let query = {};

    let keyword = req.query.keyword;
    if (keyword) {
      query['$or'] = [
        {'name': keyword},
        {'mobile': keyword}
      ];
      
      let id = Number(keyword);
      if (id && !isNaN(id)) {
        query['$or'].push({_id: id});
      }
    }

    let options = {
      page: page,
      limit: 10,
      lean: true,
      sort: [['createdAt', -1]],
      populate: [{
        path: 'apartment',
        populate: { path: 'apartmentType' }
      }]
    };

    let orders = await ApartmentOrder.paginate(query, options);

    for (let order of orders.docs) {
      order.createdAt_formatted = moment(order.createdAt).format('YYYY-MM-DD HH:mm:ss');
      order.date_formatted = moment(order.date).format('YYYY-MM-DD HH:mm:ss');
    }
    res.render('cms-apartmentOrders', {
      orders: orders
    });
  })().catch(err => {
    res.render('error', {
      error: err,
      message: err.message,
      stack: err.stack
    });
  });
});

router.get('/daily', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.redirect('/user/login');
  }

  let page = parseInt(req.query.page);
  page = isNaN(page) ? 1 : page;

  (async function() {
    let query = {};

    let keyword = req.query.keyword;
    if (keyword) {
      query['$or'] = [
        {name: keyword},
        {mobile: keyword}
      ];

      let id = Number(keyword);
      if (id && !isNaN(id)) {
        query['$or'].push({_id: id});
      }
    }

    let options = {
      page: page,
      limit: 10,
      lean: true,
      sort: [['createdAt', -1]],
      populate: ['daily']
    };

    let orders = await DailyOrder.paginate(query, options);

    for (let order of orders.docs) {
      order.createdAt_formatted = moment(order.createdAt).format('YYYY-MM-DD HH:mm:ss');
      order.startDate_formatted = moment(order.startDate).format('YYYY-MM-DD');
      order.endDate_formatted = moment(order.endDate).format('YYYY-MM-DD');
    }
    res.render('cms-dailyOrders', {
      orders: orders
    });
  })().catch(err => {
    res.render('error', {
      error: err,
      message: err.message,
      stack: err.stack
    });
  });
});

router.get('/delegate', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.redirect('/user/login');
  }

  let page = parseInt(req.query.page);
  page = isNaN(page) ? 1 : page;

  (async function() {
    let query = {};

    let keyword = req.query.keyword;
    if (keyword) {
      query['$or'] = [
        {name: keyword},
        {mobile: keyword}
      ];

      let id = Number(keyword);
      if (id && !isNaN(id)) {
        query['$or'].push({_id: id});
      }
    }

    let options = {
      page: page,
      limit: 10,
      lean: true,
      sort: [['createdAt', -1]]
    };

    let orders = await DelegationOrder.paginate(query, options);

    for (let order of orders.docs) {
      order.createdAt_formatted = moment(order.createdAt).format('YYYY-MM-DD HH:mm:ss');
      order.startDate_formatted = moment(order.startDate).format('YYYY-MM-DD');
    }
    res.render('cms-delegationOrders', {
      orders: orders
    });
  })().catch(err => {
    res.render('error', {
      error: err,
      message: err.message,
      stack: err.stack
    });
  });
});

router.post('/apartment/confirm/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.json({error: '请以管理员身份重新登录'});
  }

  const apartmentId = req.params.id;
  ApartmentOrder.findByIdAndUpdate(apartmentId, {status: OrderStatus.CONFIRMED}, function(err, order) {
    if (err) {
      res.json({error: err});
    } else {
      res.json({order: order});
    }
  });
});

router.post('/apartment/cancel/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.json({error: '请以管理员身份重新登录'});
  }

  const apartmentId = req.params.id;
  ApartmentOrder.findByIdAndUpdate(apartmentId, {status: OrderStatus.CANCELLED}, function(err, order) {
    if (err) {
      res.json({error: err});
    } else {
      res.json({order: order});
    }
  });
});

router.post('/daily/confirm/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.json({error: '请以管理员身份重新登录'});
  }

  const dailyId = req.params.id;
  DailyOrder.findByIdAndUpdate(dailyId, {status: OrderStatus.CONFIRMED}, function(err, order) {
    if (err) {
      res.json({error: err});
    } else {
      res.json({order: order});
    }
  });
});

router.post('/daily/cancel/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.json({error: '请以管理员身份重新登录'});
  }

  const dailyId = req.params.id;
  DailyOrder.findByIdAndUpdate(dailyId, {status: OrderStatus.CANCELLED}, function(err, order) {
    if (err) {
      res.json({error: err.message});
    } else {
      res.json({order: order});
    }
  });
});

router.post('/delegation/confirm/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.json({error: '请以管理员身份重新登录'});
  }

  const delegationId = req.params.id;
  DelegationOrder.findByIdAndUpdate(delegationId, {status: OrderStatus.CONFIRMED}, function(err, order) {
    if (err) {
      res.json({error: err});
    } else {
      res.json({order: order});
    }
  });
});

router.post('/delegation/cancel/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.json({error: '请以管理员身份重新登录'});
  }

  const delegationId = req.params.id;
  DelegationOrder.findByIdAndUpdate(delegationId, {status: OrderStatus.CANCELLED}, function(err, order) {
    if (err) {
      res.json({error: err.message});
    } else {
      res.json({order: order});
    }
  });
});

module.exports = router;
