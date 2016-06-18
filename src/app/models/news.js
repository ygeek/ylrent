/**
 * Created by meng on 16/6/12.
 */

import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const NewsSchema = new mongoose.Schema({
  title: String,
  source: String,
  author: String,
  date: { type: Date, default: Date.now },
  content: String,
  imagekey: String
});

NewsSchema.plugin(mongoosePaginate);

exports.News = mongoose.model('News', NewsSchema);
