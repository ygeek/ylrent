/**
 * Created by meng on 16/5/19.
 */

'use strict';

import express from 'express';
import mongoose from 'mongoose';
import log4js from 'log4js';

const logger = log4js.getLogger('normal');

const House = mongoose.model('House');

const router = express.Router();

router.get('/', (req, res, next) => {
  let page = parseInt(req.query.page);
  page = isNaN(page) ? 1 : page;

  let sort = [['hot', -1], ['price', -1], ['area', -1]];
  
  let query = {};
  
  let options = {
    page: page,
    limit: 6,
    lean: true,
    sort: sort
  };
  
  House.paginate(query, options).then((result) => {
    logger.trace(result);
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
});

router.get('/:id', (req, res, next) => {
  logger.trace("GET house id: ", req.params.id);
  House.findById(req.params.id, function(err, house) {
    logger.trace("Queried house: ", house);
    if (err) {
      return res.render('error', {
        error: err,
        message: err.message,
        stack: err.stack
      });
    }
    if (!house) {
      return res.status(404);
    }
    res.render('houseDetail', { house: house });
  });
});

module.exports = router;
