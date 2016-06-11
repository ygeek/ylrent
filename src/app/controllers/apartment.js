/**
 * Created by meng on 16/5/19.
 */

'use strict';

import url from 'url';
import express from 'express';
import mongoose from 'mongoose';
import log4js from 'log4js';
import _ from 'lodash';

const logger = log4js.getLogger('normal');

// const ObjectId = mongoose.Schema.Types.ObjectId;
const District = mongoose.model('District');
const CommerseArea = mongoose.model('CommerseArea');
const Comunity = mongoose.model('Comunity');
const ApartmentType = mongoose.model('ApartmentType');
const Apartment = mongoose.model('Apartment');

function genApartmentTypeSortCondition(priceDescent, areaDescent) {
  let sort = [['isHot', -1], ['minPrice', 1], ['maxArea', -1]];
  let sortBy = 'isHot';
  let descent = 1;
  
  if (priceDescent) {
    descent = parseInt(priceDescent);
    sort = [['minPrice', descent === 1 ? -1 : 1], ['isHot', -1], ['maxArea', -1]];
    sortBy = 'price';
  }
  
  if (areaDescent) {
    descent = parseInt(areaDescent);
    sort = [['maxArea', descent === 1 ? -1 : 1], ['isHot', -1], ['minPrice', 1]];
    sortBy = 'area';
  }
  
  return {
    sort: sort,
    sortBy: sortBy,
    descent: descent
  };
}

function genApartmentSortCondition(priceDescent, areaDescent) {
  let sort = [['isHot', -1], ['price', 1], ['area', -1]];
  let sortBy = 'isHot';
  let descent = 1;
  
  if (priceDescent) {
    descent = parseInt(priceDescent);
    sort = [['price', descent === 1 ? -1 : 1], ['isHot', -1], ['area', -1]];
    sortBy = 'price';
  }
  if (areaDescent) {
    descent = parseInt(areaDescent);
    sort = [['area', descent === 1 ? -1 : 1], ['isHot', -1], ['price', 1]];
    sortBy = 'area';
  }
  return {
    sort: sort,
    sortBy: sortBy,
    descent: descent
  };
}

async function queryApartmentTypes(page, districtId, comunityId, keyword, rooms, minPrice, maxPrice, sort, commerseAreaId) {
  let query = {};
  
  let options = {
    page: page,
    limit: 6,
    lean: true,
    sort: sort,
    populate: ['comunity', 'commerseArea', 'district']
  };
  
  // district
  if (districtId) {
    query.district = districtId;
  }
  
  // comunity
  if (comunityId) {
    query.comunity = comunityId;
  }
  
  // commerse area
  if (commerseAreaId) {
    query.commerseArea = commerseAreaId;
  }
  
  // keyword
  if (keyword && keyword !== '小区  /   地标  /  商区') {
    let searchDistricts = await District.find({name: new RegExp(keyword)}).exec();
    let searchCommerseAreas = await CommerseArea.find({name: new RegExp(keyword)}).exec();
    let searchComunities = await Comunity.find({name: new RegExp(keyword)}).exec();
    
    query['$or'] = [
      {'district': {'$in': searchDistricts}},
      {'commerseArea': {'$in': searchCommerseAreas}},
      {'comunity': {'$in': searchComunities}}
    ];
  }
  
  // rooms
  if (rooms && !isNaN(rooms)) {
    if (rooms <= 3) {
      query['roomType.shi'] = rooms;
    } else {
      query['roomType.shi'] = { '$gte': rooms };
    }
  }
  
  // price
  if (minPrice && !isNaN(minPrice)) {
    query['minPrice'] = {'$gte': parseInt(minPrice)};
  }
  if (maxPrice && !isNaN(maxPrice)) {
    query['maxPrice'] = {'$lte': parseInt(maxPrice)};
  }

  return await ApartmentType.paginate(query, options);
}

const router = express.Router();

router.get('/', (req, res, next) => {
  let page = parseInt(req.query.page);
  page = isNaN(page) ? 1 : page;
  
  let comunityId = req.query.communityId;
  
  let keyword = req.query.word;
  
  let rooms = parseInt(req.query.shi);

  let sortCondition = genApartmentTypeSortCondition(req.query.price, req.query.area);
  
  (async function() {
    let result = await queryApartmentTypes(page, null, comunityId, keyword, rooms, sortCondition.sort, null);

    let startIndex = Math.max(1, result.page - 2);
    let endIndex = Math.min(Math.max(startIndex + 4, result.page + 2), result.pages);
    
    let districts = await CommerseArea
      .aggregate({
        '$group': { _id: '$district', commerseAreas: { '$addToSet': { _id: '$_id', name: '$name'} } }
      }).exec();

    districts = await District
      .populate(districts, {
        path: '_id',
        select: 'name'
      });

    let template = req.device.type === 'phone' ? 'phone/apartmentType.ejs' : 'apartmentType' ;
    
    res.render(template, {
      title: '房型列表',
      result: result,
      districts: districts,
      startIndex: startIndex,
      endIndex: endIndex,
      sortBy: sortCondition.sortBy,
      desc: sortCondition.descent,
      word: keyword,
      searchshi: rooms,
      url: url.parse(req.originalUrl).pathname
    });
  })().catch(err => {
    res.render('error', {
      error: err,
      message: err.message,
      stack: err.stack
    });
  });
});

router.get('/api', (req, res, next) => {
  let page = parseInt(req.query.page);
  page = isNaN(page) ? 1 : page;

  let districtId = req.query.districtId;
  
  let commerseAreaId = req.query.commerseAreaId;

  let keyword = req.query.word;

  let rooms = req.query.shi;

  let minPrice = req.query.minPrice;
  
  let maxPrice = req.query.maxPrice;

  let sortCondition = genApartmentTypeSortCondition(req.query.price, req.query.area);

  (async function() {
    let result = await queryApartmentTypes(page, districtId, null, keyword, rooms, minPrice, maxPrice, sortCondition.sort, commerseAreaId);
    res.json({
      result: result,
      sortBy: sortCondition.sortBy,
      url: url.parse(req.originalUrl).pathname,
      word: keyword,
      searchshi: rooms
    });
  })().catch(err => {
    res.json({
      error: err,
      message: err.message,
      stack: err.stack
    });
  });
});

function queryApartmentTypesMapData() {
  return ApartmentType
    .find({})
    .populate('comunity', 'latitude longitude')
    .select('_id comunity')
    .exec()
    .then(apartmentTypes =>
      _.map(apartmentTypes, apartmentType => ({
        id: apartmentType._id.toString(),
        longitude: apartmentType.comunity.longitude,
        latitude: apartmentType.comunity.latitude
      }))
    );
}

router.get('/map/district/api', (req, res, next) => {
  (async function() {
    let districts = await Apartment
      .aggregate({
        '$group': { _id: '$district', count: { '$sum': 1 } }
      })
      .exec();
    
    let results = await District
      .populate(districts, {
        path: '_id', 
        select: 'name'
      });
    
    res.json({
      districts: results
    });
  })()
    .catch(err => {
      res.json({
        error: err.message
      });
    });
});

router.get('/map/commersearea/api', (req, res, next) => {
  (async function() {
    let commerseAreas = await Apartment
      .aggregate({
        '$group': { _id: '$commerseArea', count: { '$sum': 1 } }
      })
      .exec();
    
    let results = await CommerseArea
      .populate(commerseAreas, {
        path: '_id',
        select: 'name'
      });
    
    res.json({
      commerseAreas: results
    });
  })()
    .catch(err => {
      res.json({
        error: err.message
      });
    });
});

router.get('/map/community/api', (req, res, next) => {
  (async function() {
    let comunities = await Apartment
      .aggregate({
        '$group': { _id: '$comunity', count: { '$sum': 1 } }
      })
      .exec();
    
    let results = await Comunity
      .populate(comunities, { 
        path: '_id',
        select: 'name latitude longitude address'
      });
    
    res.json({
      communities: results
    });
  })()
    .catch(err => {
      res.json({
        error: err.message
      });
    });
});

router.get('/map/community/apartments/api', (req, res, next) => {
  (async function() {
    let apartments = await Apartment
      .find({comunity: req.query.communityId})
      .populate({
        path: 'apartmentType',
        select: 'roomType'
      })
      .select('apartmentType area price leased imagekeys')
      .exec();
    res.json({
      apartments: apartments
    });
  })()
    .catch(err => {
      res.json({
        error: err.message
      });
    });
});

router.get('/map/api', (req, res, next) => {
  queryApartmentTypesMapData().then(data => {
    res.json({
      apartmentTypes: data
    });
  }).catch(err => {
    res.json({
      error: err,
      message: err.message,
      stack: err.stack
    });
  });
});

router.get('/map', (req, res, next) => {
  queryApartmentTypesMapData().then(data => {
    res.render('apartmentTypeMap', {
      apartmentTypes: data
    });
  }).catch(err => {
    res.render('error', {
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

  (async function() {
    let apartmentType = await ApartmentType.findById(typeId).exec();

    logger.trace(apartmentType);
    
    if (!apartmentType) {
      return res.status(404);
    }

    let sortCondition = genApartmentSortCondition(req.query.price, req.query.area);

    let query = { apartmentType: apartmentType._id };

    let options = {
      page: page,
      limit: 6,
      lean: true,
      sort: sortCondition.sort,
      populate: ['apartmentType', 'comunity', 'commerseArea', 'district']
    };

    let template = req.device.type === 'phone' ? 'phone/apartments.ejs' : 'apartments';

    let result = await Apartment.paginate(query, options);

    let startIndex = Math.max(1, result.page - 2);
    let endIndex = Math.min(Math.max(startIndex + 4, result.page + 2), result.pages);

    res.render(template, {
      title: '房型房源列表',
      result: result,
      typeId: typeId,
      startIndex: startIndex,
      endIndex: endIndex,
      sortBy: sortCondition.sortBy,
      desc: sortCondition.descent,
      url: url.parse(req.originalUrl).pathname
    });
  })().catch(err => {
    res.render('error', {
      error: err,
      message: err.message,
      stack: err.stack
    });
  });
});

router.get('/detail/:id', (req, res, next) => {
  let template = req.device.type === 'phone' ? 'phone/apartmentDetail.ejs' : 'apartmentDetail';
  Apartment
    .findById(req.params.id)
    .populate('apartmentType comunity commerseArea district')
    .exec()
    .then(apartment => {
      if (!apartment) {
        return res.status(404);
      }
      res.render(template, { apartment: apartment });
    })
    .catch(err => {
      res.render('error', {
        error: err,
        message: err.message,
        stack: err.stack
      }); 
    });
    
});

module.exports = router;
