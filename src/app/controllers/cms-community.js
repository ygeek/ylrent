/**
 * Created by meng on 16/6/17.
 */

"use strict";

import express from 'express';
import mongoose from 'mongoose';
import _ from 'lodash';

import { importComunity, updateComunity } from '../utils/importer';

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
  
  let keyword = req.query.keyword;
  
  let query = {};
  
  if (keyword) {
    query['name'] = new RegExp(keyword) ;
  }

  let options = {
    page: page,
    limit: 10,
    lean: true,
    populate: ['commerseArea', 'district']
  };

  Comunity
    .paginate(query, options)
    .then(communities => {
      res.render('cms-communities', {
        communities: communities,
        keyword: keyword
      });
    })
    .catch(err => {
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
  
  let communityId = req.params.id;
  
  Comunity
    .findById(communityId)
    .populate('district commerseArea')
    .exec()
    .then(community => {
      res.render('cms-communityDetail', {
        community: community
      });
    })
    .catch(err => {
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

  (async function() {
    let districts = await District.find({}).exec();
    let commerseAreas = await CommerseArea.find({}).populate('district').exec();
    res.render('cms-communityAdd', {
      districts: districts,
      commerseAreas: commerseAreas
    }); 
  })().catch(err => {
    res.render('error', {
      error: err,
      message: err.message,
      stack: err.stack
    });
  });
});

router.post('/add', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.json({error: '请以管理员身份重新登录'});
  }

  let communityObj = req.body;
  communityObj.keywords = _.filter(communityObj.keywords.split(/\s+/), function(key) {
    return key && key.length > 0;
  });
  communityObj.imagekeys = _.filter(communityObj.imagekeys.split(/\s+/), function(key) {
    return key && key.length > 0;
  });

  importComunity(communityObj).then(community => {
    res.json({ community: community });
  }).catch(err => {
    res.json({ error: err.message });
  });
});

router.get('/update/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.redirect('/user/login');
  }

  const communityId = req.params.id;
  
  (async function() {
    let districts = await District.find({}).exec();
    let commerseAreas = await CommerseArea.find({}).populate('district').exec();
    let comunity = await Comunity
      .findById(communityId)
      .populate('district commerseArea')
      .exec();
    res.render('cms-communityUpdate', {
      comunity: comunity,
      districts: districts,
      commerseAreas: commerseAreas
    });
  })().catch(err => {
    res.status(404);
  });
});

router.post('/update/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.json({error: '请以管理员身份重新登录'});
  }

  let communityId = req.params.id;
  let communityObj = req.body;

  updateComunity(communityId, communityObj).then(community => {
    res.json({ community: community });
  }).catch(err => {
    res.json({ error: err.message });
  });
});

router.post('/delete/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.json({error: '请以管理员身份重新登录'});
  }

  const communityId = req.params.id;

  Comunity.findByIdAndRemove(communityId, function(err, community) {
    if (err) {
      res.json({ error: err.message });
    } else {
      res.json({ community: community });
    }
  });
});

module.exports = router;
