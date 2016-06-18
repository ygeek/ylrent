/**
 * Created by meng on 16/6/17.
 */

'use strict';

import log4js from 'log4js';
import mongoose from 'mongoose';
import _ from 'lodash';


let logger = log4js.getLogger('normal');


export async function importDistrict(districtObj) {
  const District = mongoose.model('District');
  let query = {
    name: districtObj.DistrictName
  };
  let update = {
    name: districtObj.DistrictName
  };
  let options = {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true
  };
  let district = await District.findOneAndUpdate(query, update, options).exec();
  logger.info('import district: ', district);
  return district;
}

export async function updateDistrict(districtId, districtObj) {
  const District = mongoose.model('District');
  
  let update = {
    name: districtObj.DistrictName
  };
  
  let district = await District.findByIdAndUpdate(districtId, update).exec();
  
  logger.info('update district: ', district);
  
  return district;
}

export async function importCommerseArea(areaObj) {
  const District = mongoose.model('District');
  const CommerseArea = mongoose.model('CommerseArea');
  let district = await District.findOne({ name: areaObj.districtName }).exec();

  let query = {
    name: areaObj.CBDName
  };
  let update = {
    name: areaObj.CBDName,
    district: district
  };
  let options = {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true
  };
  let area = await CommerseArea
    .findOneAndUpdate(query, update, options)
    .populate('district')
    .exec();
  logger.info('import commerseArea: ', area);
  return area;
}

export async function updateCommerseArea(areaObjId, areaObj) {
  const District = mongoose.model('District');
  const CommerseArea = mongoose.model('CommerseArea');
  let district = await District.findOne({ name: areaObj.districtName }).exec();
  
  let update = {
    name: areaObj.CBDName,
    district: district
  };

  let area = await CommerseArea
    .findByIdAndUpdate(areaObjId, update)
    .exec();
  
  logger.info('import commerseArea:', area);
  return area;
}

export async function importComunity(comunityObj) {
  const CommerseArea = mongoose.model('CommerseArea');
  const Comunity = mongoose.model('Comunity');
  let commerseArea = await CommerseArea
    .findOne({ name: comunityObj.CBDName })
    .populate('district')
    .exec();

  let query = {
    name: comunityObj.villageName
  };
  let update = {
    name: comunityObj.villageName,
    commerseArea: commerseArea,
    district: commerseArea.district,
    desc: comunityObj.desc,
    address: comunityObj.address,
    latitude: comunityObj.lat,
    longitude: comunityObj.lon,
    isHot: false,
    keywords: [comunityObj.CBDName]
  };
  let options = {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true
  };

  let comunity = await Comunity
    .findOneAndUpdate(query, update, options)
    .populate('district commerseArea')
    .exec();
  logger.info('import community: ', comunity);
  return comunity;
}

export async function updateComunity(comunityId, comunityObj) {
  const CommerseArea = mongoose.model('CommerseArea');
  const Comunity = mongoose.model('Comunity');

  let commerseArea = await CommerseArea
    .findOne({ name: comunityObj.CBDName })
    .populate('district')
    .exec();

  let update = {
    name: comunityObj.villageName,
    commerseArea: commerseArea,
    district: commerseArea.district,
    desc: comunityObj.desc,
    address: comunityObj.address,
    latitude: comunityObj.lat,
    longitude: comunityObj.lon,
    isHot: false,
    keywords: [comunityObj.CBDName]
  };
  
  let comunity = await Comunity
    .findByIdAndUpdate(comunityId, update)
    .populate('district commerseArea')
    .exec();
  
  logger.info('import community: ', comunity);
  
  return comunity;
}

export async function importApartmentType(apartmentObj) {
  const Comunity = mongoose.model('Comunity');
  const ApartmentType = mongoose.model('ApartmentType');
  let comunity = await Comunity
    .findOne({ name: apartmentObj.villageName })
    .populate('commerseArea district')
    .exec();

  const apartmentTypeName = comunity.name + apartmentObj.shi.toString() + '房';
  let apartmentType = await ApartmentType.findOne({ name: apartmentTypeName }).exec();

  var minArea = Math.min(!apartmentType || isNaN(apartmentType.minArea) || !(apartmentType.minArea) ?
      Number.MAX_VALUE :
      apartmentType.minArea,
    apartmentObj.structurearea);
  var maxArea = Math.max(!apartmentType || isNaN(apartmentType.maxArea) || !(apartmentType.maxArea) ?
      0 :
      apartmentType.maxArea,
    apartmentObj.structurearea);
  var minPrice = Math.min(!apartmentType || isNaN(apartmentType.minPrice) || !(apartmentType.minPrice) ?
      Number.MAX_VALUE :
      apartmentType.minPrice,
    apartmentObj.rentPerMonth);
  var maxPrice = Math.max(!apartmentType || apartmentType.maxPrice || !(apartmentType.maxPrice) ?
      0 :
      apartmentType.maxPrice,
    apartmentObj.rentPerMonth);

  if (!apartmentType) {
    apartmentType = new ApartmentType();
  }
  apartmentType.name = apartmentTypeName;
  apartmentType.comunity = comunity;
  apartmentType.commerseArea = comunity.commerseArea;
  apartmentType.district = comunity.district;
  apartmentType.roomType = {
    ting: apartmentObj.ting,
    shi: apartmentObj.shi,
    wei: apartmentObj.wei,
    beds: 0
  };
  apartmentType.address = apartmentObj.address;
  apartmentType.isHot = false;
  apartmentType.keywords = apartmentObj.keywords.split(/\s+/);

  apartmentType.minArea = minArea;
  apartmentType.maxArea = maxArea;
  apartmentType.minPrice = minPrice;
  apartmentType.maxPrice = maxPrice;

  if (!apartmentType.imagekeys) {
    apartmentType.imagekeys = [];
  }
  apartmentType.imagekeys = _.uniq(apartmentType.imagekeys.concat(apartmentObj.imagekeys));

  let upsertData = apartmentType.toObject();
  delete upsertData._id;

  await ApartmentType.update({ name: apartmentType.name }, upsertData, {upsert: true}).exec();
  logger.info('import apartmentType: ', apartmentType);
  return apartmentType;
}

export async function importApartment(apartmentObj) {
  const ApartmentType = mongoose.model('ApartmentType');
  const Apartment = mongoose.model('Apartment');
  
  const apartmentTypeName = apartmentObj.villageName + apartmentObj.shi.toString() + '房';
  
  let apartmentType = await ApartmentType
    .findOne({ name: apartmentTypeName })
    .populate('comunity commerseArea district')
    .exec();

  let query = {
    contractNo: apartmentObj.contractno
  };
  let update = {
    houseNo: apartmentObj.houseno,
    apartmentType: apartmentType,
    comunity: apartmentType.comunity,
    commerseArea: apartmentType.commerseArea,
    district: apartmentType.district,
    area: apartmentObj.structurearea,
    price: apartmentObj.rentPerMonth,
    contactNo: apartmentObj.contractno,
    address: apartmentObj.address,
    leased: false,
    isHot: false,
    keywords: apartmentObj.keywords.split(/\s+/),
    imagekeys: apartmentObj.imagekeys
  };
  let options = {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true
  };
  
  let apartment = await Apartment
    .findOneAndUpdate(query, update, options)
    .populate('apartmentType comunity commerseArea district')
    .exec();

  apartment.comunity.minArea = Math.min(apartment.comunity.minArea || 10000, apartment.area);
  apartment.comunity.maxArea = Math.max(apartment.comunity.maxArea || 0, apartment.area);
  apartment.comunity.minPrice = Math.min(apartment.comunity.minPrice || 10000000, apartment.price);
  apartment.comunity.maxPrice = Math.max(apartment.comunity.maxPrice || 0, apartment.price);
  if (apartment.imagekeys && apartment.imagekeys.length > 0) {
    apartment.comunity.imagekeys = apartment.imagekeys;
    logger.info('update comunity imagekeys: ', apartment.comunity.imagekeys);
  }
  await apartment.comunity.save();
  logger.info('import apartment: ', apartment);
  return apartment;
}

export async function updateApartment(apartmentId, apartmentObj) {
  const ApartmentType = mongoose.model('ApartmentType');
  const Apartment = mongoose.model('Apartment');

  const apartmentTypeName = apartmentObj.villageName + apartmentObj.shi.toString() + '房';

  let apartmentType = await ApartmentType
    .findOne({ name: apartmentTypeName })
    .populate('comunity commerseArea district')
    .exec();

  let update = {
    contractNo: apartmentObj.contractno
    houseNo: apartmentObj.houseno,
    apartmentType: apartmentType,
    comunity: apartmentType.comunity,
    commerseArea: apartmentType.commerseArea,
    district: apartmentType.district,
    area: apartmentObj.structurearea,
    price: apartmentObj.rentPerMonth,
    contactNo: apartmentObj.contractno,
    address: apartmentObj.address,
    leased: false,
    isHot: false,
    keywords: apartmentObj.keywords.split(/\s+/),
    imagekeys: apartmentObj.imagekeys
  };

  let apartment = await Apartment
    .findByIdAndUpdate(apartmentId, update)
    .populate('comunity commerseArea district')
    .exec();

  apartment.comunity.minArea = Math.min(apartment.comunity.minArea || 10000, apartment.area);
  apartment.comunity.maxArea = Math.max(apartment.comunity.maxArea || 0, apartment.area);
  apartment.comunity.minPrice = Math.min(apartment.comunity.minPrice || 10000000, apartment.price);
  apartment.comunity.maxPrice = Math.max(apartment.comunity.maxPrice || 0, apartment.price);
  if (apartment.imagekeys && apartment.imagekeys.length > 0) {
    apartment.comunity.imagekeys = apartment.imagekeys;
    logger.info('update comunity imagekeys: ', apartment.comunity.imagekeys);
  }
  await apartment.comunity.save();
  logger.info('import apartment: ', apartment);
  return apartment;
}

export async function importDailyRent(dailyRentObj) {
  const Comunity = mongoose.model('Comunity');
  const DailyRent = mongoose.model('DailyRent');
  
  let comunity = await Comunity
    .findOne({ name: dailyRentObj.comunityName })
    .populate('commerseArea district')
    .exec();

  let query = {
    name: dailyRentObj.name
  };
  let update = {
    name: dailyRentObj.name,
    comunity: comunity,
    commerseArea: comunity.commerseArea,
    district: comunity.district,
    capacityMin: dailyRentObj.capacityMin,
    capacityMax: dailyRentObj.capacityMax,
    price: dailyRentObj.price,
    isRenting: true,
    keywords: comunity.keywords,
    imagekeys: dailyRentObj.imagekeys
  };
  let options = {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true
  };
  let dailyRent = await DailyRent
    .findOneAndUpdate(query, update, options)
    .populate('comunity commerseArea district')
    .exec();
  logger.info('import daily rent: ', dailyRent);
  return dailyRent;
}

export async function updateDailyRent(dailyRentId, dailyRentObj) {
  const Comunity = mongoose.model('Comunity');
  const DailyRent = mongoose.model('DailyRent');

  let comunity = await Comunity
    .findOne({ name: dailyRentObj.comunityName })
    .populate('commerseArea district')
    .exec();
  
  let update = {
    name: dailyRentObj.name,
    comunity: comunity,
    commerseArea: comunity.commerseArea,
    district: comunity.district,
    capacityMin: dailyRentObj.capacityMin,
    capacityMax: dailyRentObj.capacityMax,
    price: dailyRentObj.price,
    isRenting: true,
    keywords: comunity.keywords,
    imagekeys: dailyRentObj.imagekeys
  };
  
  let dailyRent = await DailyRent
    .findByIdAndUpdate(dailyRentId, update)
    .populate('comunity commerseArea district')
    .exec();
  
  logger.info('update daily rent:', dailyRent);
  
  return dailyRent;
}