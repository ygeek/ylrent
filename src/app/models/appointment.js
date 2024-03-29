/**
 * Created by meng on 16/6/4.
 */

import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';
import autoIncrement from 'mongoose-auto-increment';


const ObjectId = mongoose.Schema.Types.ObjectId;

export const OrderStatus = {
  INITIAL: '待确认',
  CONFIRMED: '已确认',
  CANCELLED: '已取消'
};

const ApartmentOrderSchema = new mongoose.Schema({
  apartment: { type: ObjectId, ref: 'Apartment' },
  name: String,
  mobile: String,
  email: String,
  comment: String,
  date: Date,
  status: { type: String, required: true, default: OrderStatus.INITIAL },
  createdAt: { type: Date, required: true, default: Date.now }
});

const DailyOrderSchema = new mongoose.Schema({
  daily: { type: ObjectId, ref: 'DailyRent' },
  name: String,
  mobile: String,
  startDate: Date,
  endDate: Date,
  status: { type: String, required: true, default: OrderStatus.INITIAL },
  createdAt: { type: Date, required: true, default: Date.now } 
});

const DelegationOrderSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  startDate: Date,
  communityName: String,
  structure: String,
  price: String,
  address: String,
  status: { type: String, required: true, default: OrderStatus.INITIAL },
  createdAt: { type: Date, required: true, default: Date.now } 
});

ApartmentOrderSchema.plugin(mongoosePaginate);
DailyOrderSchema.plugin(mongoosePaginate);
DelegationOrderSchema.plugin(mongoosePaginate);

ApartmentOrderSchema.plugin(autoIncrement.plugin, 'ApartmentOrder');
DailyOrderSchema.plugin(autoIncrement.plugin, 'DailyOrder');
DelegationOrderSchema.plugin(autoIncrement.plugin, 'DelegationOrder');

exports.ApartmentOrder = mongoose.model('ApartmentOrder', ApartmentOrderSchema);
exports.DailyOrder = mongoose.model('DailyOrder', DailyOrderSchema);
exports.DelegationOrder = mongoose.model('DelegationOrder', DelegationOrderSchema);
