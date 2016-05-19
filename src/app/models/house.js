'use strict';

import mongoose from 'mongoose';

// create new schema
const houseSchema = new mongoose.Schema({
  title: String,      // 长宁凯欣豪苑精装2房公寓
  community: String,  // 凯欣豪苑
  price: Number,      // 26900
  structure: String,  // 2室1厅1卫
  area: Number,       // 96平米
  capacity: Number    // 宜住3人
});
// virtual date attribute
houseSchema.virtual('date').get(() => this._id.getTimestamp());

module.exports = mongoose.model('House', houseSchema);
