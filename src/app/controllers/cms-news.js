/**
 * Created by meng on 16/6/17.
 */

"use strict";

import express from 'express';
import mongoose from 'mongoose';

const News = mongoose.model('News');

const router = express.Router();

const isDebug = true;

router.get('/', (req, res, next) => {
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

router.get('/add', (req, res, next) => {
  res.render('cms-newsAdd', {});
});

router.post('/', (req, res, next) => {
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

module.exports = router;
