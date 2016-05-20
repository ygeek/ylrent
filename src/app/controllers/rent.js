/**
 * Created by meng on 16/5/19.
 */

'use strict';

import express from 'express';
//import mongoose from 'mongoose';

//const House = mongoose.model('House');
//const DailyRent = mongoose.model('DailyRent');

const router = express.Router();

router.get('/house/:page', (req, res, next) => {
  let page = parseInt(req.params.hasOwnProperty('page'));
  if (isNaN(page)) {
    page = 1;
  }

});
