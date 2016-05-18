'use strict';
// this controller is meant to set up routes from all other controllers
// it also sets up basic express routes

import express from 'express';
import mongoose from 'mongoose';

// load models
const House = mongoose.model('House');

// create router
const router = express.Router();
// load other controllers
router.use('/extras', require('./extras'));
router.use('/user', require('./user'));

// set basic routes
router.get('/', (req, res, next) => {
  res.render('index', {
    title: '源涞国际',
    user: req.user
  });
});
router.get('/houses', (req, res, next) => {
  House.find((err, houses) => {
    if (err) return next(err);
    res.render('houses', {
      title: 'Houses!',
      houses
    });
  });
});

// export router
module.exports = router;
