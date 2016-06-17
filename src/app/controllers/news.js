/**
 * Created by meng on 16/6/12.
 */
"use strict";

import express from 'express';
import mongoose from 'mongoose';
import moment from 'moment';

const News = mongoose.model('News');
const ApartmentType = mongoose.model('ApartmentType');

const router = express.Router();

router.get('/', (req, res, next) => {
  let page = parseInt(req.query.page);
  page = isNaN(page) ? 1 : page;

  let options = {
    page: page,
    limit: 8,
    lean: true,
    sort: [['date', -1]]
  };

  let newsPromise = News.paginate({}, options);
  
  let latestNewsPromise = News
    .find({})
    .limit(4)
    .sort('-date')
    .exec();

  let hotApartments = ApartmentType
    .find({})
    .limit(4)
    .sort('-isHot')
    .populate('comunity commerseArea district')
    .exec();
  
  Promise
    .all([latestNewsPromise, newsPromise, hotApartments])
    .then(([latestNews, newsList, apartmentTypes]) => {
      res.render('newsList', {
        latestNews: latestNews,
        newsList: newsList,
        apartmentTypes: apartmentTypes
      });
    }).catch(err => {

    });
});

router.get('/:id', (req, res, next) => {
  let newsId = req.params.id;

  (async function() {
    let news = await News.findById(newsId).exec();
    
    let latestNewsPromise = News
      .find({})
      .limit(10)
      .sort('-date')
      .exec();
    
    let prevNewsPromise = News
      .find({ date: { '$lt': news.date } })
      .limit(1)
      .sort('-date')
      .exec();
    
    let nextNewsPromise = News
      .find({ date: { '$gt': news.date } })
      .limit(1)
      .sort('date')
      .exec();

    let apartmentPromise =
      ApartmentType
        .find({'$where': 'this.imagekeys.length > 1'})
        .limit(6)
        .sort('-isHot')
        .populate('comunity commerseArea district')
        .exec();
    
    let [
      latestNews,
      prevNews,
      nextNews,
      apartmentTypes
    ] = await Promise.all([
      latestNewsPromise,
      prevNewsPromise,
      nextNewsPromise,
      apartmentPromise
    ]);
    
    news.date_formatted = moment(news.date).format('YYYY-MM-DD HH:mm:ss');
    
    res.render('news', {
      news: news,
      prevNews: prevNews,
      nextNews: nextNews,
      latestNews: latestNews,
      apartmentTypes: apartmentTypes
    });
  })().catch(function(err) {
    res.render('error', {
      error: err,
      message: err.message,
      statck: err.statck
    });
  });
});


module.exports = router;
