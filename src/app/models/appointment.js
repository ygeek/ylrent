/**
 * Created by meng on 16/6/4.
 */

import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const ObjectId = mongoose.Schema.Types.ObjectId;

export const OrderStatus = {
  INITIAL: '未处理',
  PROCESSING: '处理中',
  CLOSED: '已完成' 
};

const ApartmentOrderSchema = new mongoose.Schema({
  apartment: { type: ObjectId, ref: 'Apartment' },
  name: String,
  mobile: String,
  email: String,
  comment: String,
  status: { type: String, required: true, default: OrderStatus.INITIAL },
  createdAt: { type: Date, required: true, default: Date.now }
});


const DailyOrderSchema = new mongoose.Schema({
  daily: { type: ObjectId, ref: 'Daily' },
  name: String,
  mobile: String,
  startDate: Date,
  endDate: Date,
  status: { type: String, required: true, default: OrderStatus.INITIAL },
  createdAt: { type: Date, required: true, default: Date.now } 
});

ApartmentOrderSchema.plugin(mongoosePaginate);
DailyOrderSchema.plugin(mongoosePaginate);

exports.ApartmentOrder = mongoose.model('ApartmentOrder', ApartmentOrderSchema);
exports.DailyOrder = mongoose.model('DailyOrder', DailyOrderSchema);
