/**
 * Created by meng on 16/5/20.
 */

'use strict';

import path from 'path';
import log4js from 'log4js';
import mongoose from 'mongoose';
import _ from 'lodash';

import config from './config';
import districts from './data/district';
import commerseAreas from './data/commerseArea';
import comunities from './data/comunity';
import apartments from './data/apartment';
import dailyRents from './data/daily';

let logger = log4js.getLogger('normal');

mongoose.connect(config.db);
const db = mongoose.connection;

db.on('error', () => {
  throw new Error(`unable to connect to database at ${config.db}`);
});

process.on('SIGINT', () => {
  logger.info('\nshutting down!');
  db.close();
  process.exit();
});

// load all models
require(path.join(config.root, 'app/models'));

const District = mongoose.model('District');
const CommerseArea = mongoose.model('CommerseArea');
const Comunity = mongoose.model('Comunity');
const ApartmentType = mongoose.model('ApartmentType');
const Apartment = mongoose.model('Apartment');
const DailyRent = mongoose.model('DailyRent');

async function importDistrict(districtObj) {
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

async function importAllDistricts() {
  let results = [];
  for (let district of districts) {
    results.push(await importDistrict(district));
  }
  return results;
}

async function importCommerseArea(areaObj) {
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

async function importAllCommerseAreas() {
  let results = [];
  for (let areaObj of commerseAreas) {
    results.push(await importCommerseArea(areaObj));
  }
  return results;
}

async function importComunity(comunityObj) {
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

async function importAllComunities() {
  let results = [];
  for (let comunityObj of comunities) {
    results.push(await importComunity(comunityObj));
  }
  return results;
}

async function importApartmentType(apartmentObj) {
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

async function importAllApartmentTypes() {
  let results = [];
  for (let apartmentObj of apartments) {
    results.push(await importApartmentType(apartmentObj));
  }
  return results;
}

async function importApartment(apartmentObj) {
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
  }
  await apartment.comunity.save();
  logger.info('import apartment: ', apartment);
  return apartment;
}

async function importAllApartments() {
  let results = [];
  for (let apartmentObj of apartments) {
    results.push(await importApartment(apartmentObj));
  }
  return results;
}

async function importDailyRent(dailyRentObj) {
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

async function importAllDailyRents() {
  let results = [];
  for (let dailyRentObj of dailyRents) {
    results.push(await importDailyRent(dailyRentObj));
  }
  return results;
}

(async function() {
  await importAllDistricts();
  await importAllCommerseAreas();
  await importAllComunities();
  await importAllApartmentTypes();
  await importAllApartments();
  await importAllDailyRents();
  logger.info('import finished!');
})().catch(err => {
  logger.error('import error: ', err);
});
