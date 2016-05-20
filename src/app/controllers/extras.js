'use strict';

import express from 'express';
import importData from '../utils/boot';

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('extras', {
    message: 'welcome to extras!',
    base: true
  });
});

router.post('/boot', (req, res, next) => {
  importData();
  res.send({
    code: 0,
    msg: 'import data started!'
  });
});

// export router
module.exports = router;
