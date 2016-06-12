/**
 * Created by meng on 16/6/12.
 */
"use strict";

import express from 'express';
import mongoose from 'mongoose';

const News = mongoose.model('News');

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

  News
    .paginate({}, options)
    .then(newsList => {
      res.render('newsList', {
        newsList: newsList
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

router.get('/:id', (req, res, next) => {
  let newsId = req.params.id;
  News.findById(newsId).exec(function(err, news) {
    if (!err && news) {
      res.render('news', {
        news: news
      });
    } else {
      res.status(404);
    }
  });
});


module.exports = router;
