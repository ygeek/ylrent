/**
 * Created by meng on 16/5/20.
 */

'use strict';

import express from 'express';
//import mongoose from 'mongoose';

//const House = mongoose.model('House');
//const DailyRent = mongoose.model('DailyRent');

const router = express.Router();

// set basic routes
router.get('/', (req, res, next) => {
  res.render('index', {
    title: '源涞国际',
    user: req.user
  });
});

module.exports = router;
