/**
 * Created by meng on 16/5/19.
 */

'use strict';

import express from 'express';
import mongoose from 'mongoose';
import log4js from 'log4js';

const logger = log4js.getLogger('normal');

const House = mongoose.model('House');

function housesView(page, req, res, next) {
  let sort = [['hot', -1], ['price', -1], ['area', -1]];
  if (req.query.hasOwnProperty('price')) {
    let priceValue = req.query.price.toLowerCase();
    if (priceValue === 'asce') {
      sort = [['price', 1], ['hot', -1], ['area', -1]];
    } else if (priceValue === 'desc') {
      sort = [['price', -1], ['hot', -1], ['area', -1]];
    }
  }
  if (req.query.hasOwnProperty('area')) {
    let areaValue = req.query.area.toLowerCase();
    if (areaValue === 'asce') {
      sort = [['area', 1], ['hot', -1], ['price', -1]];
    } else if (areaValue === 'desc') {
      sort = [['area', -1], ['hot', -1], ['price', -1]];
    }
  }
  let query = {};
  let options = {
    page: page,
    limit: 6,
    lean: true,
    sort: sort
  };
  House.paginate(query, options).then((result) => {
    logger.debug(result);
    res.render('houses', {
      title: '房源列表',
      result: result
    });
  }).catch((err) => {
    res.render('error', {
      error: err,
      message: err.message,
      stack: err.stack
    });
  });
}

const router = express.Router();

router.get('/', (req, res, next) => {
  housesView(1, req, res, next);
});

router.get('/:page', (req, res, next) => {
  let page = parseInt(req.params.page);
  if (isNaN(page)) {
    page = 1;
  }
  housesView(page, req, res, next);
});

module.exports = router;
