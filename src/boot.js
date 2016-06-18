/**
 * Created by meng on 16/5/20.
 */

'use strict';

import path from 'path';
import log4js from 'log4js';
import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

import config from './config';
import districts from './data/district';
import commerseAreas from './data/commerseArea';
import comunities from './data/comunity';
import apartments from './data/apartment';
import dailyRents from './data/daily';

let logger = log4js.getLogger('normal');

mongoose.connect(config.db);
const db = mongoose.connection;
autoIncrement.initialize(db);

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

import { 
  importDistrict, 
  importCommerseArea,
  importComunity,
  importApartmentType,
  importApartment,
  importDailyRent
} from './app/utils/importer';

async function importAllDistricts() {
  let results = [];
  for (let district of districts) {
    results.push(await importDistrict(district));
  }
  return results;
}

async function importAllCommerseAreas() {
  let results = [];
  for (let areaObj of commerseAreas) {
    results.push(await importCommerseArea(areaObj));
  }
  return results;
}

async function importAllComunities() {
  let results = [];
  for (let comunityObj of comunities) {
    results.push(await importComunity(comunityObj));
  }
  return results;
}

async function importAllApartmentTypes() {
  let results = [];
  for (let apartmentObj of apartments) {
    results.push(await importApartmentType(apartmentObj));
  }
  return results;
}

async function importAllApartments() {
  let results = [];
  for (let apartmentObj of apartments) {
    results.push(await importApartment(apartmentObj));
  }
  return results;
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
