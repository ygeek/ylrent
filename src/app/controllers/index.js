'use strict';
// this controller is meant to set up routes from all other controllers
// it also sets up basic express routes

import express from 'express';

// create router
const router = express.Router();

// load other controllers
router.use('/user', require('./user'));
router.use('/house', require('./house'));
router.use('/daily', require('./daily'));
router.use('/', require('./home'));

// export router
module.exports = router;
