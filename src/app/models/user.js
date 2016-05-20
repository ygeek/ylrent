/**
 * Created by meng on 16/5/18.
 */

import mongoose from 'mongoose';
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';

const UserSchema = new mongoose.Schema({
  isCrop: Boolean,
  title: String,
  CorpName: String,
  Tel: String,
  Address: String
});

UserSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', UserSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = User;
