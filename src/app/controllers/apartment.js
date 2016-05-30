/**
 * Created by meng on 16/5/19.
 */

'use strict';

import url from 'url';
import express from 'express';
import mongoose from 'mongoose';
import log4js from 'log4js';
// import _ from 'lodash';

const logger = log4js.getLogger('normal');

// const ObjectId = mongoose.Schema.Types.ObjectId;
const District = mongoose.model('District');
const CommerseArea = mongoose.model('CommerseArea');
const ApartmentType = mongoose.model('ApartmentType');
const Apartment = mongoose.model('Apartment');

const router = express.Router();

router.get('/', (req, res, next) => {
  let page = parseInt(req.query.page);
  page = isNaN(page) ? 1 : page;

  let sort = [['isHot', -1], ['minPrice', 1], ['maxArea', -1]];
  let sortBy = 'isHot';
  if (req.query.price) {
    sort = [['minPrice', 1], ['isHot', -1], ['maxArea', -1]];
    sortBy = 'price';
  }
  if (req.query.area) {
    sort = [['maxArea', -1], ['isHot', -1], ['minPrice', 1]];
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
  
  let template = req.device.type === 'phone' ? 'phone/apartmentType.ejs' : 'apartmentType' ;
  
  District.find({}).exec((err, districts) => {
    CommerseArea.find({}).exec((err, commerseAreas) => {
      ApartmentType.paginate(query, options).then((result) => {
        let startIndex = Math.max(1, result.page - 2);
        let endIndex = Math.min(Math.max(startIndex + 4, result.page + 2), result.pages);
        res.render(template, {
          title: '房型列表',
          result: result,
          districts: districts,
          commerseAreas: commerseAreas,
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
  });
});

router.get('/api', (req, res, next) => {
  let query = {};
  if (req.query.districtId) {
    query['district'] = req.query.districtId;
  }

  if (req.query.minPrice) {
    query['minPrice'] = {'$gte': parseInt(req.query.minPrice)};
  }
  if (req.query.maxPrice) {
    query['maxPrice'] = {'$lte': parseInt(req.query.maxPrice)};
  }

  if (req.query.shi || req.query.shigte) {
    if (req.query.shi) {
      query['roomType.shi'] = parseInt(req.query.shi);
    }
    if (req.query.shigte) {
      query['roomType.shi'] = {'$gte': parseInt(req.query.shigte)};
    }
  }

  let page = parseInt(req.query.page);
  page = isNaN(page) ? 1 : page;

  let sort = [['isHot', -1], ['minPrice', 1], ['maxArea', -1]];
  let sortBy = 'isHot';
  if (req.query.price) {
    sort = [['minPrice', 1], ['isHot', -1], ['maxArea', -1]];
    sortBy = 'price';
  }
  if (req.query.area) {
    sort = [['maxArea', -1], ['isHot', -1], ['minPrice', 1]];
    sortBy = 'area';
  }

  let options = {
    page: page,
    limit: 6,
    lean: true,
    sort: sort,
    populate: ['comunity', 'commerseArea', 'district']
  };
  
  logger.info('query: ', query);

  ApartmentType.paginate(query, options).then((result) => {
    res.json({
      result: result,
      sortBy: sortBy,
      url: url.parse(req.originalUrl).pathname
    });
  }).catch((err) => {
    res.json({
      error: err,
      message: err.message,
      stack: err.stack
    });
  });
});

router.get('/type/:id', (req, res, next) => {
  let page = parseInt(req.query.page);
  page = isNaN(page) ? 1 : page;
  
  let typeId = req.params.id;

  ApartmentType
    .findById(typeId)
    .exec((err, apartmentType) => {
      logger.info(apartmentType);

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
      
      let query = { apartmentType: apartmentType._id };

      let options = {
        page: page,
        limit: 6,
        lean: true,
        sort: sort,
        populate: ['apartmentType', 'comunity', 'commerseArea', 'district']
      };
      
      let template = req.device.type === 'phone' ? 'phone/apartments.ejs' : 'apartments';
      
      Apartment.paginate(query, options).then((result) => {
        
        let startIndex = Math.max(1, result.page - 2);
        let endIndex = Math.min(Math.max(startIndex + 4, result.page + 2), result.pages);
        
        res.render(template, {
          title: '房型房源列表',
          result: result,
          typeId: typeId,
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
});

router.get('/detail/:id', (req, res, next) => {
  Apartment
    .findById(req.params.id)
    .populate('apartmentType comunity commerseArea district')
    .exec(function(err, apartment) {
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
    
    let template = req.device.type === 'phone' ? 'phone/apartmentDetail.ejs' : 'apartmentDetail';
    res.render(template, { apartment: apartment });
  });
});

module.exports = router;
