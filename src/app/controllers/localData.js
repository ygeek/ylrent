/**
 * Created by meng on 16/6/18.
 */

"use strict";

import mongoose from 'mongoose';
import log4js from 'log4js';

const logger = log4js.getLogger('normal');

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
      logger.trace("hot comunities success");
      res.locals.hotCommunities = comunities;
      next();
    }).catch(err => {
      logger.trace("hot comunities error", err);
      next();
    });
}