/**
 * Created by meng on 16/6/18.
 */

"use strict";

import mongoose from 'mongoose';

export function localData(req, res, next) {
  const Comunity = mongoose.model('Comunity');
  let comunityPromise =
    Comunity
      .find({})
      .limit(10)
      .sort('-isHot')
      .populate('commerseArea district')
      .exec();
  
  comunityPromise
    .then(comunities => {
      res.locals({
        hotCommunities: comunities
      });
      next();
    }).catch(err => {
      next();
    });
}