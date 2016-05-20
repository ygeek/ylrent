'use strict';

import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const ObjectId = mongoose.Schema.Types.ObjectId;

const DistrictSchema = new mongoose.Schema({
  name: String  // 浦东新区
});

const CommerseAreaSchema = new mongoose.Schema({
  name: String,         // 世纪公园
  districtId: ObjectId  // 浦东新区
});

const ComunitySchema = new mongoose.Schema({
  name: String,       // 陆家嘴中央公寓
  commerseAreaId: ObjectId,  // 世纪公园
  districtId: ObjectId,      // 徐汇区
  desc: String,       // 陆家嘴中央公寓，是美国ARQ、美国泛亚易道……
  address: String,    // 上海市浦东东绣路99弄
  latitude: Number,    // 纬度 31.221362
  longitude: Number,  // 经度 121.545650
  isHot: Boolean,      // 是否主推
  keywords: [String]   // ["徐家汇", "一号线"]
});

const HouseSchema = new mongoose.Schema({
  houseNo: String,        // 17-602
  comunityId: ObjectId,   // 陆家嘴中央公寓
  commerseAreaId: ObjectId,  // 徐家汇
  districtId: ObjectId,      // 徐汇区
  area: Number,           // 123
  price: Number,          // 16900
  roomType: {
    ting: Number,         // 2
    shi: Number,          // 2
    wei: Number,          // 2
    beds: Number          // 2
  },
  contactNo: String,      // 117
  address: String,        // 浦东东绣路99弄17号602
  leased: Boolean,           // 是否已租
  isHot: Boolean,            // 是否主推
  keywords: [String],        // ["徐家汇"， "一号线", "xxx"]
  imagekeys: [String]        // ["七牛图片文件KEY"]
});

const DailyRentSchema = new mongoose.Schema({
  name: String,              // 东方曼哈顿2房公寓
  comunityId: ObjectId,      // 东方曼哈顿
  commerseAreaId: ObjectId,  // 徐家汇
  districtId: ObjectId,      // 徐汇区
  capacityMin: Number,       // 2
  capacityMax: Number,       // 3
  price: Number,             // 299
  isRenting: Boolean,        // 是否下架
  keywords: [String],        // ["徐家汇"， "一号线", "xxx"]
  imagekeys: [String]        // ["七牛图片文件KEY"]
});

HouseSchema.plugin(mongoosePaginate);
DailyRentSchema.plugin(mongoosePaginate);

exports.District = mongoose.model('District', DistrictSchema);
exports.CommerseArea = mongoose.model('CommerseArea', CommerseAreaSchema);
exports.Comunity = mongoose.model('Comunity', ComunitySchema);
exports.House = mongoose.model('House', HouseSchema);
exports.DailyRent = mongoose.model('DailyRent', DailyRentSchema);
