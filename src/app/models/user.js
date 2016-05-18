/**
 * Created by meng on 16/5/18.
 */

import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new mongoose.Schema({});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
