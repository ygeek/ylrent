'use strict';

import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const ObjectId = mongoose.Schema.Types.ObjectId;

const DistrictSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true }  // 浦东新区
});

const CommerseAreaSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },         // 世纪公园
  district: { type: ObjectId, ref: 'District' }  // 浦东新区
});

const ComunitySchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },              // 陆家嘴中央公寓
  commerseArea: { type: ObjectId, ref: 'CommerseArea' },  // 世纪公园
  district: { type: ObjectId, ref: 'District' },  // 浦东新区
  desc: String,        // 陆家嘴中央公寓，是美国ARQ、美国泛亚易道……
  address: String,     // 上海市浦东东绣路99弄
  latitude: Number,    // 纬度 31.221362
  longitude: Number,   // 经度 121.545650
  minArea: Number,     // 最小面积
  maxArea: Number,     // 最大面积
  minPrice: Number,    // 最低价格
  maxPrice: Number,    // 最高价格
  imagekeys: [String], // 照片列表
  isHot: Boolean,      // 是否主推
  keywords: [String]   // ["徐家汇", "一号线"]
});

const ApartmentTypeSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },  // 陆家嘴中央公寓2房
  comunity: { type: ObjectId, ref: 'Comunity' },  // 陆家嘴中央公寓
  commerseArea: { type: ObjectId, ref: 'CommerseArea' }, // 徐家汇
  district: { type: ObjectId, ref: 'District' },  // 浦东新区
  roomType: {
    ting: Number,         // 2
    shi: Number,          // 2
    wei: Number,          // 2
    beds: Number          // 2
  },
  address: String,        // 浦东东绣路99弄17号
  isHot: Boolean,         // 是否主推
  keywords: [String],     // ["徐家汇"， "一号线", "xxx"]
  minArea: Number,     // 最小面积
  maxArea: Number,     // 最大面积
  minPrice: Number,    // 最低价格
  maxPrice: Number,    // 最高价格
  imagekeys: [String]     // ["七牛图片文件KEY"]
});

const ApartmentSchema = new mongoose.Schema({
  houseNo: String,        // 17-602
  contactNo: String,      // 117
  apartmentType: { type: ObjectId, ref: 'ApartmentType' }, // 陆家嘴中央公寓2房
  comunity: { type: ObjectId, ref: 'Comunity' },  // 陆家嘴中央公寓
  commerseArea: { type: ObjectId, ref: 'CommerseArea' }, // 徐家汇
  district: { type: ObjectId, ref: 'District' },  // 浦东新区
  area: Number,           // 123
  price: Number,          // 16900
  address: String,        // 浦东东绣路99弄17号602
  leased: Boolean,           // 是否已租
  isHot: Boolean,            // 是否主推
  keywords: [String],        // ["徐家汇"， "一号线", "xxx"]
  imagekeys: [String]        // ["七牛图片文件KEY"]
});

const DailyRentSchema = new mongoose.Schema({
  name: String,              // 东方曼哈顿2房公寓
  comunity: { type: ObjectId, ref: 'Comunity' },  // 陆家嘴中央公寓
  commerseArea: { type: ObjectId, ref: 'CommerseArea' }, // 徐家汇
  district: { type: ObjectId, ref: 'District' },  // 浦东新区
  capacityMin: Number,       // 2
  capacityMax: Number,       // 3
  price: Number,             // 299
  isRenting: Boolean,        // 是否下架
  keywords: [String],        // ["徐家汇"， "一号线", "xxx"]
  imagekeys: [String]        // ["七牛图片文件KEY"]
});

DistrictSchema.plugin(mongoosePaginate);
CommerseAreaSchema.plugin(mongoosePaginate);
ComunitySchema.plugin(mongoosePaginate);
ApartmentTypeSchema.plugin(mongoosePaginate);
ApartmentSchema.plugin(mongoosePaginate);
DailyRentSchema.plugin(mongoosePaginate);

exports.District = mongoose.model('District', DistrictSchema);
exports.CommerseArea = mongoose.model('CommerseArea', CommerseAreaSchema);
exports.Comunity = mongoose.model('Comunity', ComunitySchema);
exports.ApartmentType = mongoose.model('ApartmentType', ApartmentTypeSchema);
exports.Apartment = mongoose.model('Apartment', ApartmentSchema);
exports.DailyRent = mongoose.model('DailyRent', DailyRentSchema);
