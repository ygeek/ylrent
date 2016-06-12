/**
 * Created by meng on 16/6/12.
 */

"use strict";

import express from 'express';
import mongoose from 'mongoose';

const News = mongoose.model('News');
const Comunity = mongoose.model('Comunity');
const Apartment = mongoose.model('Apartment');
const DailyRent = mongoose.model('DailyRent');
const ApartmentOrder = mongoose.model('ApartmentOrder');
const DailyOrder = mongoose.model('DailyOrder');

const router = express.Router();

const isDebug = true;

router.get('/', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.redirect('/user/login');
  }
  
  res.render('cms-home', {});
});

router.get('/news', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.redirect('/user/login');
  }
  
  let page = parseInt(req.query.page);
  page = isNaN(page) ? 1 : page;

  let options = {
    page: page,
    limit: 8,
    lean: true,
    sort: [['date', -1]]
  };

  News
    .paginate({}, options)
    .then(newsList => {
      res.render('cms-news', {
        newsList: newsList
      });
    })
    .catch(err => {
      res.render('error', {
        error: err,
        message: err.message,
        statck: err.stack
      });
    });
});

router.post('/news', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.redirect('/user/login');
  }

  let title = req.body.title;
  let source = req.body.source;
  let author = req.body.author;
  let date = new Date(req.body.date);
  let content = req.body.content;
  let imagekey = req.body.imagekey;

  let news = new News();
  news.title = title;
  news.source = source;
  news.author = author;
  news.date = date;
  news.content = content;
  news.imagekey = imagekey;

  news.save(function(err) {
    if (err) {
      req.flash('error', err.message);
    } else {
      req.flash('info', '保存新闻成功');
    }
    res.redirect('/cms/news');
  });
});

router.get('/orders/apartment', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.redirect('/user/login');
  }

  let page = parseInt(req.query.page);
  page = isNaN(page) ? 1 : page;

  let options = {
    page: page,
    limit: 8,
    lean: true,
    sort: [['createdAt', -1]],
    populate: ['apartment']
  };

  ApartmentOrder
    .paginate({}, options)
    .then(orders => {
      res.render('cms-apartmentOrders', {
        orders: orders
      });
    })
    .catch(err => {
      res.render('error', {
        error: err,
        message: err.message,
        statck: err.statck
      });
    });
});

router.get('/orders/daily', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.redirect('/user/login');
  }

  let page = parseInt(req.query.page);
  page = isNaN(page) ? 1 : page;

  let options = {
    page: page,
    limit: 8,
    lean: true,
    sort: [['createdAt', -1]],
    populate: ['daily']
  };
  
  DailyOrder
    .paginate({}, options)
    .then(orders => {
      res.render('cms-dailyOrders', {
        orders: orders
      });
    })
    .catch(err => {
      res.render('error', {
        error: err,
        message: err.message,
        statck: err.statck
      });
    });
});

router.post('/orders/apartment/confirm/:id', (req, res, next) => {
  
});

router.post('/orders/apartment/cancel/:id', (req, res, next) => {
  
});

router.post('/orders/daily/confirm/:id', (req, res, next) => {
  
});

router.post('/orders/daily/cancel/:id', (req, res, next) => {
  
});

router.get('/apartments', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.redirect('/user/login');
  }

  let page = parseInt(req.query.page);
  page = isNaN(page) ? 1 : page;

  let options = {
    page: page,
    limit: 8,
    lean: true,
    populate: ['comunity', 'commerseArea', 'district', 'apartmentType']
  };

  Apartment
    .paginate({}, options)
    .then(apartments => {
      res.render('cms-apartments', {
        apartments: apartments
      });
    })
    .catch(err => {
      res.render('error', {
        error: err,
        message: err.message,
        statck: err.statck
      });
    });
});

router.get('/communities', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.redirect('/user/login');
  }

  let page = parseInt(req.query.page);
  page = isNaN(page) ? 1 : page;

  let options = {
    page: page,
    limit: 8,
    lean: true,
    populate: ['commerseArea', 'district']
  };

  Comunity
    .paginate({}, options)
    .then(communities => {
      res.render('cms-communities', {
        communities: communities
      });
    })
    .catch(err => {
      res.render('error', {
        error: err,
        message: err.message,
        statck: err.statck
      });
    });
});

router.get('/dailies', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.redirect('/user/login');
  }

  let page = parseInt(req.query.page);
  page = isNaN(page) ? 1 : page;

  let options = {
    page: page,
    limit: 8,
    lean: true,
    populate: ['comunity', 'commerseArea', 'district']
  };

  DailyRent
    .paginate({}, options)
    .then(dailies => {
      res.render('cms-dailies', {
        dailies: dailies
      });
    })
    .catch(err => {
      res.render('error', {
        error: err,
        message: err.message,
        statck: err.statck
      });
    });
});

router.get('/apartment/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.redirect('/user/login');
  }
  
  let apartmentId = req.params.id;
  
  Apartment
    .findById(apartmentId)
    .populate('district commerseArea comunity apartmentType')
    .exec()
    .then(apartment => {
      res.render('cms-apartmentDetail', {
        apartment: apartment
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

router.get('/community/:id', (req, res, next) => {
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

router.get('/daily/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.redirect('/user/login');
  }
  
  let dailyId = req.params.id;
  
  DailyRent
    .findById(dailyId)
    .populate('district commerseArea comunity')
    .exec()
    .then(daily => {
      res.render('cms-dailyDetail', {
        daily: daily
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

module.exports = router;
