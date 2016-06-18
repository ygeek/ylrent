'use strict';
// this controller is meant to set up routes from all other controllers
// it also sets up basic express routes

import express from 'express';

// create router
const router = express.Router();

// load other controllers
router.use('/user', require('./user'));
router.use('/apartment', require('./apartment'));
router.use('/daily', require('./daily'));
router.use('/appointment', require('./appointment'));
router.use('/news', require('./news'));
router.use('/cms/news', require('./cms-news'));
router.use('/cms/orders', require('./cms-orders'));
router.use('/cms/apartment', require('./cms-apartments'));
router.use('/cms/daily', require('./cms-dailies'));
router.use('/cms/community', require('./cms-community'));
router.use('/cms/commerseArea', require('./cms-commerseAreas'));
router.use('/cms/district', require('./cms-districts'));
router.use('/cms/user', require('./cms-users'));
router.use('/cms', require('./cms-main'));
router.use('/', require('./home'));

// export router
module.exports = router;
