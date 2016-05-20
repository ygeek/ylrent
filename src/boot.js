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
import houses from './data/house';
import dailyRents from './data/daily';

let logger = log4js.getLogger('normal');

// load all models
require(path.join(config.root, 'app/models'));

const District = mongoose.model('District');
const CommerseArea = mongoose.model('CommerseArea');
const Comunity = mongoose.model('Comunity');
const House = mongoose.model('House');
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
          districtId: district._id
        };
        let options = {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true
        };
        CommerseArea.findOneAndUpdate(query, update, options, (err, commerseArea) => {
          assert.ifError(err);
          assert.equal(commerseArea.name, areaObj.CBDName);
          assert.ok(commerseArea.districtId.equals(district._id));
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
      .select('_id name districtId')
      .exec((err, commerseArea) => {
        assert.equal(commerseArea.name, comunityObj.CBDName);
        let query = {
          name: comunityObj.villageName
        };
        let update = {
          name: comunityObj.villageName,
          commerseAreaId: commerseArea._id,
          districtId: commerseArea.districtId,
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
        Comunity.findOneAndUpdate(query, update, options, (err, comunity) => {
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

function importHouse(houseObj) {
  return new Promise((resolve, reject) => {
    Comunity
      .findOne({ name: houseObj.villageName })
      .select('_id name commerseAreaId districtId keywords')
      .exec((err, comunity) => {
        assert.ifError(err);
        assert.equal(comunity.name, houseObj.villageName);
        let query = {
          houseNo: houseObj.houseno
        };
        let update = {
          houseNo: houseObj.houseno,
          comunityId: comunity._id,
          commerseAreaId: comunity.commerseAreaId,
          districtId: comunity.districtId,
          area: houseObj.structurearea,
          price: houseObj.rentPerMonth,
          roomType:  {
            ting: houseObj.ting,
            shi: houseObj.shi,
            wei: houseObj.wei,
            beds: 0
          },
          contactNo: houseObj.contractno,
          address: houseObj.address,
          leased: false,
          isHot: false,
          keyword: comunity.keywords,
          imagekeys: []
        };
        let options = {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true
        };
        House.findOneAndUpdate(query, update, options, (err, house) => {
          assert.ifError(err);
          assert.equal(house.houseNo, houseObj.houseno);
          logger.info('import house: ', house);
          resolve(house);
        });
      });
  });
}

function importAllHouses() {
  let importPromises = _.map(houses, (houseObj) => importHouse(houseObj));
  return Promise.all(importPromises);
}

function importDailyRent(dailyRentObj) {
  return new Promise((resolve, reject) => {
    Comunity
      .findOne({ name: dailyRentObj.comunityName })
      .select('_id name commerseAreaId districtId keywords')
      .exec((err, comunity) => {
        assert.ifError(err);
        assert.equal(comunity.name, dailyRentObj.comunityName);
        let query = {
          name: dailyRentObj.name
        };
        let update = {
          name: dailyRentObj.name,
          comunityId: comunity._id,
          commerseAreaId: comunity.commerseAreaId,
          districtId: comunity.districtId,
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
        DailyRent.findOneAndUpdate(query, update, options, (err, dailyRent) => {
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

importAllDistricts()
  .then(() => importAllCommerseAreas())
  .then(() => importAllComunities())
  .then(() => importAllHouses())
  .then(() => importAllDailyRents())
  .then(() => logger.info('import finished!'))
  .catch((err) => {
    logger.error('import error: ', err);
  });
