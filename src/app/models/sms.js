/**
 * Created by meng on 16/6/9.
 */

"use strict";

import mongoose from 'mongoose';
import log4js from 'log4js';

const logger = log4js.getLogger('normal');

const expires = 600;

const SMSCodeSchema = new mongoose.Schema({
  mobile: String,
  code: String,
  createdAt: { type: Date, default: Date.now, expires: expires }
});

SMSCodeSchema.post('remove', function(doc) {
  logger.trace('removed sms code: ', doc, expires);
});

exports.expires = expires;
exports.SMSValidation = mongoose.model('SMSCode', SMSCodeSchema);
