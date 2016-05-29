/**
 * Created by meng on 16/5/19.
 */

'use strict';

import express from 'express';
import mongoose from 'mongoose';
import log4js from 'log4js';
import _ from 'lodash';

const logger = log4js.getLogger('normal');

// const ObjectId = mongoose.Schema.Types.ObjectId;
const District = mongoose.model('District');
const ApartmentType = mongoose.model('ApartmentType');
const Apartment = mongoose.model('Apartment');

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
    sort: sort,
    populate: ['comunity', 'commerseArea', 'district']
  };
  
  District.find({}).exec((err, districts) => {
    ApartmentType.paginate(query, options).then((result) => {
      let startIndex = Math.max(1, result.page - 2);
      let endIndex = Math.min(Math.max(startIndex + 4, result.page + 2), result.pages);
      res.render('apartmentType', {
        title: '房型列表',
        result: result,
        districts: districts,
        startIndex: startIndex,
        endIndex: endIndex
      });
    }).catch((err) => {
      res.render('error', {
        error: err,
        message: err.message,
        stack: err.stack
      });
    });
  });
});

router.get('/api', (req, res, next) => {
  let query = {};
  if (req.query.districtId) {
    query['district'] = req.query.districtId;
  }

  if (req.query.minPrice) {
    if (!query['price']) {
      query['price'] = {};
    }
    query['price']['$gte'] = parseInt(req.query.minPrice);
  }
  if (req.query.maxPrice) {
    if (!query['price']) {
      query['price'] = {};
    }
    query['price']['$lte'] = parseInt(req.query.maxPrice);
  }

  let page = parseInt(req.query.page);
  page = isNaN(page) ? 1 : page;

  let sort = [['hot', -1], ['price', -1], ['area', -1]];

  let options = {
    page: page,
    limit: 6,
    lean: true,
    sort: sort,
    populate: ['apartmentType', 'comunity', 'commerseArea', 'district']
  };
  
  logger.info('query: ', query);

  if (req.query.shi) {
    let typeQuery = {'roomType.shi': parseInt(req.query.shi)};
    ApartmentType.find(typeQuery).exec((err, apartmentTypes) => {
      query['apartmentType'] = {'$in': _.map(apartmentTypes, (at) => at._id)};
      Apartment.paginate(query, options).then((result) => {
        res.json({
          result: result
        });
      }).catch((err) => {
        res.json({
          error: err,
          message: err.message,
          stack: err.stack
        });
      });
    });
  } else {
    Apartment.paginate(query, options).then((result) => {
      res.json({
        result: result
      });
    }).catch((err) => {
      res.json({
        error: err,
        message: err.message,
        stack: err.stack
      });
    });
  }
});

router.get('/type/:id', (req, res, next) => {
  let page = parseInt(req.query.page);
  page = isNaN(page) ? 1 : page;
  
  let typeId = req.params.id;

  ApartmentType
    .findById(typeId)
    .exec((err, apartmentType) => {
      logger.info(apartmentType);

      let sort = [['hot', -1], ['price', -1], ['area', -1]];
      
      let query = { apartmentType: apartmentType };

      let options = {
        page: page,
        limit: 6,
        lean: true,
        sort: sort,
        populate: ['apartmentType', 'comunity', 'commerseArea', 'district']
      };
      
      Apartment.paginate(query, options).then((result) => {
        
        let startIndex = Math.max(1, result.page - 2);
        let endIndex = Math.min(Math.max(startIndex + 4, result.page + 2), result.pages);
        
        res.render('apartments', {
          title: '房型房源列表',
          result: result,
          typeId: typeId,
          startIndex: startIndex,
          endIndex: endIndex
        });
      }).catch((err) => {
        res.render('error', {
          error: err,
          message: err.message,
          stack: err.stack
        });
      }); 
    });
});

router.get('/detail/:id', (req, res, next) => {
  Apartment.findById(req.params.id, function(err, apartment) {
    if (err) {
      return res.render('error', {
        error: err,
        message: err.message,
        stack: err.stack
      });
    }
    if (!apartment) {
      return res.status(404);
    }
    res.render('apartmentDetail', { apartment: apartment });
  });
});

module.exports = router;
