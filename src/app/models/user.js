/**
 * Created by meng on 16/5/18.
 */

import mongoose from 'mongoose';
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';
import mongoosePaginate from 'mongoose-paginate';

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  isCorp: Boolean,
  corpName: String,
  title: String,
  tel: String,
  Address: String,
  isStaff: Boolean
});

UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(mongoosePaginate);

const User = mongoose.model('User', UserSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = User;
