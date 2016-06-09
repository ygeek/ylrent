/**
 * Created by meng on 16/6/9.
 */

import mongoose from 'mongoose';

const SMSValidationSchema = new mongoose.Schema({
  code: String,
  createdAt: { type: Date, default: Date.now, expires: 600 }
});

exports.SMSValidation = mongoose.model('SMSValidation', SMSValidationSchema);
