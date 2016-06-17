/**
 * Created by meng on 16/6/12.
 */

"use strict";

import express from 'express';
import mongoose from 'mongoose';
import moment from 'moment';
import log4js from 'log4js';
import { OrderStatus } from '../models/appointment';

const News = mongoose.model('News');
const Comunity = mongoose.model('Comunity');
const Apartment = mongoose.model('Apartment');
const DailyRent = mongoose.model('DailyRent');
const ApartmentOrder = mongoose.model('ApartmentOrder');
const DailyOrder = mongoose.model('DailyOrder');

const logger = log4js.getLogger('normal');
logger.trace('debug');

const router = express.Router();

const isDebug = true;

router.get('/', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.redirect('/user/login');
  }
  
  res.render('cms-home', {});
});

router.get('/top', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.redirect('/user/login');
  }
  
  res.render('cms-top', {});
});
router.get('/menu', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.redirect('/user/login');
  }
  
  res.render('cms-menu', {});
});
router.get('/index', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.redirect('/user/login');
  }
  
  res.render('cms-index', {});
});
router.get('/news', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.redirect('/user/login');
  }
  
  let page = parseInt(req.query.page);
  page = isNaN(page) ? 1 : page;

  let options = {
    page: page,
    limit: 10,
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
        stack: err.stack
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

  (async function() {
    let query = {};

    let keyword = req.query.keyword;
    if (keyword) {
      query['$or'] = [
        {'name': keyword},
        {'mobile': keyword},
        {'_id': Number(keyword)}
      ];
    }

    let options = {
      page: page,
      limit: 10,
      lean: true,
      sort: [['createdAt', -1]],
      populate: [{
        path: 'apartment',
        populate: { path: 'apartmentType' }
      }]
    };

    let orders = await ApartmentOrder.paginate(query, options);

    for (let order of orders.docs) {
      order.createdAt_formatted = moment(order.createdAt).format('YYYY-MM-DD HH:mm:ss');
      order.date_formatted = moment(order.date).format('YYYY-MM-DD HH:mm:ss');
    }
    res.render('cms-apartmentOrders', {
      orders: orders
    });
  })().catch(err => {
    res.render('error', {
      error: err,
      message: err.message,
      stack: err.stack
    });
  });
});

router.get('/orders/daily', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.redirect('/user/login');
  }

  let page = parseInt(req.query.page);
  page = isNaN(page) ? 1 : page;
  
  (async function() {
    let query = {};

    let keyword = req.query.keyword;
    if (keyword) {
      query['$or'] = [
        {name: keyword},
        {mobile: keyword},
        {_id: Number(keyword)}
      ];
    }

    let options = {
      page: page,
      limit: 10,
      lean: true,
      sort: [['createdAt', -1]],
      populate: ['daily']
    };

    let orders = await DailyOrder.paginate(query, options);

    for (let order of orders.docs) {
      order.createdAt_formatted = moment(order.createdAt).format('YYYY-MM-DD HH:mm:ss');
      order.startDate_formatted = moment(order.startDate).format('YYYY-MM-DD');
      order.endDate_formatted = moment(order.endDate).format('YYYY-MM-DD');
    }
    res.render('cms-dailyOrders', {
      orders: orders
    });
  })().catch(err => {
    res.render('error', {
      error: err,
      message: err.message,
      stack: err.stack
    });
  });
});

router.post('/orders/apartment/confirm/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.json({error: '请以管理员身份重新登录'});
  }
  
  const apartmentId = req.params.id;
  ApartmentOrder.findByIdAndUpdate(apartmentId, {status: OrderStatus.CONFIRMED}, function(err, order) {
    if (err) {
      res.json({error: err});
    } else {
      res.json({order: order});
    }
  });
});

router.post('/orders/apartment/cancel/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.json({error: '请以管理员身份重新登录'});
  }
  
  const apartmentId = req.params.id;
  ApartmentOrder.findByIdAndUpdate(apartmentId, {status: OrderStatus.CANCELLED}, function(err, order) {
    if (err) {
      res.json({error: err});
    } else {
      res.json({order: order});
    }
  }); 
});

router.post('/orders/daily/confirm/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.json({error: '请以管理员身份重新登录'});
  }
  
  const dailyId = req.params.id;
  DailyOrder.findByIdAndUpdate(dailyId, {status: OrderStatus.CONFIRMED}, function(err, order) {
    if (err) {
      res.json({error: err});
    } else {
      res.json({order: order});
    }
  });
});

router.post('/orders/daily/cancel/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.json({error: '请以管理员身份重新登录'});
  }

  const dailyId = req.params.id;
  DailyOrder.findByIdAndUpdate(dailyId, {status: OrderStatus.CANCELLED}, function(err, order) {
    if (err) {
      res.json({error: err.message});
    } else {
      res.json({order: order});
    }
  }); 
});

router.post('/apartment/rent/:id', (req, res, next) => {
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

router.post('/apartment/available/:id', (req, res, next) => {
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

router.post('/apartment/recommend/:id', (req, res, next) => {
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

router.post('/apartment/unrecommend/:id', (req, res, next) => {
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

router.post('/daily/rent/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.json({error: '请以管理员身份重新登录'});
  }

  const dailyId = req.params.id;
  DailyRent.findByIdAndUpdate(dailyId, {isRenting: false}, function(err, daily) {
    if (err) {
      res.json({error: err.message});
    } else {
      res.json({daily: daily});
    }
  });
});

router.post('/daily/available/:id', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.json({error: '请以管理员身份重新登录'});
  }

  const dailyId = req.params.id;
  DailyRent.findByIdAndUpdate(dailyId, {isRenting: true}, function(err, daily) {
    if (err) {
      res.json({error: err.message});
    } else {
      res.json({daily: daily});
    }
  });
});

router.get('/apartments', (req, res, next) => {
  if ((!req.user || !req.user.isStaff) && !isDebug) {
    return res.redirect('/user/login');
  }

  let page = parseInt(req.query.page);
  page = isNaN(page) ? 1 : page;

  let options = {
    page: page,
    limit: 10,
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
        stack: err.stack
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
    limit: 10,
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
        stack: err.stack
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
    limit: 10,
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
        stack: err.stack
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
