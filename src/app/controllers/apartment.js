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
const Comunity = mongoose.model('Comunity');
const ApartmentType = mongoose.model('ApartmentType');
const Apartment = mongoose.model('Apartment');

const router = express.Router();

router.get('/', (req, res, next) => {
  let page = parseInt(req.query.page);
  page = isNaN(page) ? 1 : page;

  let sort = [['isHot', -1], ['minPrice', 1], ['maxArea', -1]];
  let sortBy = 'isHot';
  let desc = 1;
  if (req.query.isHot) {
    desc = parseInt(req.query.isHot);
    sort = [['isHot', desc === 1 ? -1 : 1], ['price', 1], ['area', -1]];
  }
  if (req.query.price) {
    desc = parseInt(req.query.price);
    sort = [['price', desc === 1 ? -1 : 1], ['isHot', -1], ['area', -1]];
    sortBy = 'price';
  }
  if (req.query.area) {
    desc = parseInt(req.query.area);
    sort = [['area', desc === 1 ? -1 : 1], ['isHot', -1], ['price', 1]];
    sortBy = 'area';
  }

  let query = {};
  if (req.query.communityId) {
    query.comunity = req.query.communityId;
  }
  
  let options = {
    page: page,
    limit: 6,
    lean: true,
    sort: sort,
    populate: ['comunity', 'commerseArea', 'district']
  };

  let template = req.device.type === 'phone' ? 'phone/apartmentType.ejs' : 'apartmentType' ;

  let word = req.query.word;
  let searchshi = parseInt(req.query.shi);
  logger.info('search: ', word, searchshi);
  if (word && word !== '小区  /   地标  /  商区' && searchshi && !isNaN(searchshi)) {
    District.find({name: new RegExp(word)}, function(err, searchDistricts) {
      CommerseArea.find({name: new RegExp(word)}, function (err, searchCommerseAreas) {
        Comunity.find({name: new RegExp(word)}, function (err, searchComunities) {
          query['$or'] = [
            {'district': {'$in': searchDistricts}},
            {'commerseArea': {'$in': searchCommerseAreas}},
            {'comunity': {'$in': searchComunities}}
          ];
          if (searchshi <= 3) {
            query['roomType.shi'] = searchshi;
          } else {
            query['roomType.shi'] = { '$gte': searchshi };
          }
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
                  desc: desc,
                  word: word,
                  searchshi: searchshi,
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
      });
    });
  } else {
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
            desc: desc,
            word: null,
            searchshi: null,
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
  }
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
  let desc = 1;
  if (req.query.isHot) {
    desc = parseInt(req.query.isHot);
    sort = [['isHot', desc === 1 ? -1 : 1], ['minPrice', 1], ['maxArea', -1]];
  }
  if (req.query.price) {
    desc = parseInt(req.query.price);
    sort = [['minPrice', desc === 1 ? -1 : 1], ['isHot', -1], ['maxArea', -1]];
    sortBy = 'price';
  }
  if (req.query.area) {
    desc = parseInt(req.query.area);
    sort = [['maxArea', desc === 1 ? -1 : 1], ['isHot', -1], ['minPrice', 1]];
    sortBy = 'area';
  }
  
  logger.info('sort ', sortBy, desc);

  let options = {
    page: page,
    limit: 6,
    lean: true,
    sort: sort,
    populate: ['comunity', 'commerseArea', 'district']
  };
  
  logger.info('query: ', query);


  if (req.query.word && req.query.word !== '小区  /   地标  /  商区') {
    let word = req.query.word;
    let searchshi = parseInt(req.query.searchshi);
    District.find({name: new RegExp(word)}, function(err, searchDistricts) {
      CommerseArea.find({name: new RegExp(word)}, function (err, searchCommerseAreas) {
        Comunity.find({name: new RegExp(word)}, function (err, searchComunities) {
          query['$or'] = [
            {'district': {'$in': searchDistricts}},
            {'commerseArea': {'$in': searchCommerseAreas}},
            {'comunity': {'$in': searchComunities}}
          ];
          if (searchshi < 3) {
            query['roomType.shi'] = searchshi;
          } else {
            query['roomType.shi'] = { '$gte': searchshi };
          }
          ApartmentType.paginate(query, options).then((result) => {
            res.json({
              result: result,
              sortBy: sortBy,
              url: url.parse(req.originalUrl).pathname,
              word: word,
              searchshi: searchshi
            });
          }).catch((err) => {
            res.json({
              error: err,
              message: err.message,
              stack: err.stack
            });
          });
        });
      });
    });
  } else {
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

      let sort = [['isHot', -1], ['price', 1], ['area', -1]];
      let sortBy = 'isHot';
      let desc = 1;
      if (req.query.isHot) {
        desc = parseInt(req.query.isHot);
        sort = [['isHot', desc === 1 ? -1 : 1], ['price', 1], ['area', -1]];
      }
      if (req.query.price) {
        desc = parseInt(req.query.price);
        sort = [['price', desc === 1 ? -1 : 1], ['isHot', -1], ['area', -1]];
        sortBy = 'price';
      }
      if (req.query.area) {
        desc = parseInt(req.query.area);
        sort = [['area', desc === 1 ? -1 : 1], ['isHot', -1], ['price', 1]];
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
          desc: desc,
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
