/**
 * Created by meng on 16/5/19.
 */

'use strict';

import url from 'url';
import express from 'express';
import mongoose from 'mongoose';
import log4js from 'log4js';

const logger = log4js.getLogger('normal');

const DailyRent = mongoose.model('DailyRent');

const router = express.Router();

router.get('/', (req, res, next) => {
  let page = parseInt(req.query.page);
  page = isNaN(page) ? 1 : page;

  let sort = [['isHot', -1], ['price', 1], ['area', -1]];
  let sortBy = 'isHot';
  if (req.query.price) {
    sort = [['price', 1], ['isHot', -1], ['area', -1]];
    sortBy = 'price';
  }
  if (req.query.area) {
    sort = [['area', -1], ['isHot', -1], ['price', 1]];
    sortBy = 'area';
  }

  let query = {};

  let options = {
    page: page,
    limit: 6,
    lean: true,
    sort: sort,
    populate: ['comunity', 'commerseArea', 'district']
  };

  let template = req.device.type === 'phone' ? 'phone/dailyRents.ejs' : 'dailyRents';

  DailyRent.paginate(query, options).then((result) => {
    let startIndex = Math.max(1, result.page - 2);
    let endIndex = Math.min(Math.max(startIndex + 4, result.page + 2), result.pages);
    res.render(template, {
      title: '日租列表',
      result: result,
      startIndex: startIndex,
      endIndex: endIndex,
      sortBy: sortBy,
      url: url.parse(req.originalUrl).pathname
    });
  }).catch((err) => {
    res.render('error', {
      error: err,
      message: err.message,
      stack: err.stack
    });
  });
});

router.get('/:id', (req, res, next) => {
  logger.trace("GET daily rent id: ", req.params.id);
  DailyRent
    .findById(req.params.id)
    .populate('comunity commerseArea district')
    .exec(function(err, daily) {
    logger.trace("Queried daily rent: ", daily);
    if (err) {
      return res.render('error', {
        error: err,
        message: err.message,
        stack: err.stack
      });
    }
    if (!daily) {
      return res.status(404);
    }
    
    let template = req.device.type === 'phone' ? 'phone/dailyDetail.ejs' : 'dailyDetail';
    
    res.render(template, { daily: daily });
  });
});

module.exports = router;
