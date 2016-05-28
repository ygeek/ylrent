/**
 * Created by meng on 16/5/20.
 */

'use strict';

import path from 'path';
import assert from 'assert';
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

function importDistrict(districtObj) {
  return new Promise((resolve, reject) => {
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
    District.findOneAndUpdate(query, update, options, function(err, district) {
      assert.ifError(err);
      assert.equal(district.name, districtObj.DistrictName);
      logger.info('import district: ', district);
      resolve(district);
    });
  });
}

function importAllDistricts() {
  let importPromises = _.map(districts, (district) => importDistrict(district));
  return Promise.all(importPromises);
}

function importCommerseArea(areaObj) {
  return new Promise((resolve, reject) => {
    District
      .findOne({ name: areaObj.districtName })
      .select('_id name')
      .exec((err, district) => {
        assert.equal(district.name, areaObj.districtName);
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
        CommerseArea
          .findOneAndUpdate(query, update, options)
          .populate('district')
          .exec((err, commerseArea) => {
            assert.ifError(err);
            assert.equal(commerseArea.name, areaObj.CBDName);
            assert.ok(commerseArea.district._id.equals(district._id));
            logger.info('import commerse area: ', commerseArea);
            resolve(commerseArea);
          });
      });
  });
}

function importAllCommerseAreas() {
  let importPromises = _.map(commerseAreas, (areaObj) => importCommerseArea(areaObj));
  return Promise.all(importPromises);
}

function importComunity(comunityObj) {
  return new Promise((resolve, reject) => {
    CommerseArea
      .findOne({ name: comunityObj.CBDName })
      .select('_id name district')
      .populate('district')
      .exec((err, commerseArea) => {
        logger.info('importComunity commerseArea: ', commerseArea);
        assert.equal(commerseArea.name, comunityObj.CBDName);
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
        Comunity
          .findOneAndUpdate(query, update, options)
          .populate('district commerseArea')
          .exec((err, comunity) => {
            assert.ifError(err);
            assert.equal(comunity.name, comunityObj.villageName);
            logger.info('import comunity: ', comunity);
            resolve(comunity);
          });
      });
  });
}

function importAllComunities() {
  let importPromises = _.map(comunities, (comunityObj) => importComunity(comunityObj));
  return Promise.all(importPromises);
}

function importApartmentType(apartmentObj) {
  return new Promise((resolve, reject) => {
    logger.info('import apartment type obj: ', apartmentObj);
    Comunity
      .findOne({ name: apartmentObj.villageName })
      .select('_id name commerseArea district keywords')
      .populate('commerseArea district')
      .exec((err, comunity) => {
        logger.info('importApartmentType comunity', comunity);
        assert.ifError(err);
        assert.equal(comunity.name, apartmentObj.villageName);
        const apartmentTypeName = comunity.name + apartmentObj.shi.toString() + '房';
        let query = {
          name: apartmentTypeName
        };
        let update = {
          name: apartmentTypeName,
          comunity: comunity,
          commerseArea: comunity.commerseArea,
          district: comunity.district,
          roomType: {
            ting: apartmentObj.ting,
            shi: apartmentObj.shi,
            wei: apartmentObj.wei,
            beds: 0
          },
          address: apartmentObj.address,
          isHot: false,
          keywords: apartmentObj.keywords.split(/\s+/),
          imagekeys: apartmentObj.imagekeys
        };
        let options = {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true
        };
        ApartmentType
          .findOneAndUpdate(query, update, options)
          .populate('comunity commerseArea district')
          .exec((err, apartmentType) => {
            logger.info('import apartment type: ', apartmentType);
            assert.ifError(err);
            assert.equal(apartmentType.name, apartmentTypeName);
            resolve(apartmentType);
          });
      });
  });
}

function importAllApartmentTypes() {
  let importPromises = _.map(apartments, (apartmentObj) => importApartmentType(apartmentObj));
  return Promise.all(importPromises);
}

function importApartment(apartmentObj) {
  return new Promise((resolve, reject) => {
    const apartmentTypeName = apartmentObj.villageName + apartmentObj.shi.toString() + '房';
    ApartmentType
      .findOne({name: apartmentTypeName})
      .select('_id name comunity commerseArea district')
      .populate('comunity commerseArea district')
      .exec((err, apartmentType) => {
        assert.ifError(err);
        assert.equal(apartmentType.name, apartmentTypeName);
        let query = {
          houseNo: apartmentObj.houseno
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
        Apartment
          .findOneAndUpdate(query, update, options)
          .populate('apartmentType comunity commerseArea district')
          .exec((err, apartment) => {
            assert.ifError(err);
            assert.equal(apartment.houseNo, apartmentObj.houseno);
            logger.info('import apartment: ', apartment);
            resolve(apartment);
          });
      });
  });
}

function importAllApartments() {
  let importPromises = _.map(apartments, (apartmentObj) => importApartment(apartmentObj));
  return Promise.all(importPromises);
}

function importDailyRent(dailyRentObj) {
  return new Promise((resolve, reject) => {
    Comunity
      .findOne({ name: dailyRentObj.comunityName })
      .select('_id name commerseArea district keywords')
      .populate('commerseArea district')
      .exec((err, comunity) => {
        assert.ifError(err);
        assert.equal(comunity.name, dailyRentObj.comunityName);
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
          imagekeys: []
        };
        let options = {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true
        };
        DailyRent
          .findOneAndUpdate(query, update, options)
          .populate('comunity commerseArea district')
          .exec((err, dailyRent) => {
          assert.ifError(err);
          assert.equal(dailyRent.name, dailyRentObj.name);
          logger.info('import daily rent: ', dailyRent);
          resolve(dailyRent);
        });
      });
  });
}

function importAllDailyRents() {
  let importPromises = _.map(dailyRents, (dailyRentObj) => importDailyRent(dailyRentObj));
  return Promise.all(importPromises);
}

importAllDistricts()
  .then(() => importAllCommerseAreas())
  .then(() => importAllComunities())
  .then(() => importAllApartmentTypes())
  .then(() => importAllApartments())
  .then(() => importAllDailyRents())
  .then(() => logger.info('import finished!'))
  .catch((err) => {
    logger.error('import error: ', err);
  });
