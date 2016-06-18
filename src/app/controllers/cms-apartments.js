/**
 * Created by meng on 16/6/17.
 */

"use strict";

import express from 'express';
import mongoose from 'mongoose';
import { importApartment, updateApartment, importApartmentType } from '../utils/importer';

const Apartment = mongoose.model('Apartment');
const District = mongoose.model('District');
const CommerseArea = mongoose.model('CommerseArea');
const Comunity = mongoose.model('Comunity');

const router = express.Router();

const isDebug = true;

router.get('/list', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.redirect('/user/login');
  }

  let page = parseInt(req.query.page);
  page = isNaN(page) ? 1 : page;
  
  (async function() {
    let query = {};

    let keyword = req.query.keyword;
    if (keyword) {
      let searchDistricts = await District.find({name: new RegExp(keyword)}).exec();
      let searchCommerseAreas = await CommerseArea.find({name: new RegExp(keyword)}).exec();
      let searchComunities = await Comunity.find({name: new RegExp(keyword)}).exec();
      query['$or'] = [
        {'district': {'$in': searchDistricts}},
        {'commerseArea': {'$in': searchCommerseAreas}},
        {'comunity': {'$in': searchComunities}}
      ];
    }
    
    let options = {
      page: page,
      limit: 10,
      lean: true,
      populate: ['comunity', 'commerseArea', 'district', 'apartmentType']
    };

    let apartments = await Apartment.paginate(query, options);
    res.render('cms-apartments', {
      apartments: apartments,
      keyword: keyword
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
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.redirect('/user/login');
  }

  let apartmentId = req.params.id;

  (async function() {
    let apartment = await Apartment
      .findById(apartmentId)
      .populate('district commerseArea comunity apartmentType')
      .exec();
    
    let communities = await Comunity.find({}).exec();

    res.render('cms-apartmentDetail', {
      apartment: apartment,
      communities: communities
    });
  })().catch(err => {
    res.render('error', {
      error: err,
      message: err.message,
      stack: err.stack
    });
  });
});

router.get('/add', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.redirect('/user/login');
  } 
  
  res.render('cms-apartmentsAdd', {});
});

router.post('/add', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.json({error: '请以管理员身份重新登录'});
  }
  
  let apartmentObj = req.body;
  
  Promise.all([
    importApartmentType(apartmentObj),
    importApartment(apartmentObj)
  ]).then(([apartmentType, apartment]) => {
    res.json({
      apartmentType: apartmentType,
      apartment: apartment
    });
  }).catch(err => {
    res.json({error: err.message});
  });
});

router.get('/update/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.redirect('/user/login');
  }

  const apartmentId = req.params.id;
  
  (async function() {
    let apartment = await Apartment
      .findById(apartmentId)
      .exec();

    let communities = await Comunity.find({}).exec();
    
    res.render('cms-apartmentsUpdate', {
      apartment: apartment,
      communities: communities
    });
    
  })().catch(err => {
    res.status(404);
  });
});

router.post('/update/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.json({error: '请以管理员身份重新登录'});
  }

  const apartmentId = req.params.id;
  
  let apartmentObj = req.body;

  Promise.all([
    importApartmentType(apartmentObj),
    updateApartment(apartmentId, apartmentObj)
  ]).then(([apartmentType, apartment]) => {
    res.json({
      apartmentType: apartmentType,
      apartment: apartment
    });
  }).catch(err => {
    res.json({error: err.message});
  });
});

router.post('/delete/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.json({error: '请以管理员身份重新登录'});
  }
  const apartmentId = req.params.id;
  Apartment.findByIdAndRemove(apartmentId, function(err, apartment) {
    if (err) {
      res.json({
        error: err.message
      });
    } else {
      res.json({
        apartment: apartment
      });
    }
  });
  // TODO: update related apartmentTypes
});

router.post('/rent/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.json({error: '请以管理员身份重新登录'});
  }

  const apartmentId = req.params.id;
  Apartment.findByIdAndUpdate(apartmentId, {leased: true}, function(err, daily) {
    if (err) {
      res.json({error: err.message});
    } else {
      res.json({daily: daily});
    }
  });
});

router.post('/available/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.json({error: '请以管理员身份重新登录'});
  }

  const apartmentId = req.params.id;
  Apartment.findByIdAndUpdate(apartmentId, {leased: false}, function(err, daily) {
    if (err) {
      res.json({error: err.message});
    } else {
      res.json({daily: daily});
    }
  });
});

router.post('/recommend/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.json({error: '请以管理员身份重新登录'});
  }

  const apartmentId = req.params.id;
  Apartment.findByIdAndUpdate(apartmentId, {isHot: true}, function(err, daily) {
    if (err) {
      res.json({error: err.message});
    } else {
      res.json({daily: daily});
    }
  });
});

router.post('/unrecommend/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.json({error: '请以管理员身份重新登录'});
  }

  const apartmentId = req.params.id;
  Apartment.findByIdAndUpdate(apartmentId, {isHot: false}, function(err, daily) {
    if (err) {
      res.json({error: err.message});
    } else {
      res.json({daily: daily});
    }
  });
});

module.exports = router;
