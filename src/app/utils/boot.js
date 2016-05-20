/**
 * Created by meng on 16/5/20.
 */

'use strict';

import assert from 'assert';
import log4js from 'log4js';
import mongoose from 'mongoose';
import districts from '../../data/district';
import commerseAreas from '../../data/commerseArea';

let logger = log4js.getLogger('normal');

export default function importData() {

//const House = mongoose.model('Hose');

//const DailyRent = mongoose.model('DailyRent');

  const District = mongoose.model('District');
  const CommerseArea = mongoose.model('CommerseArea');

  for (let i = 0; i < districts.length; i++) {
    let obj = districts[i];
    let query = {
      name: obj.DistrictName
    };
    let update = {
      name: obj.DistrictName
    };
    let options = {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    };
    District.findOneAndUpdate(query, update, options, function(err, district) {
      assert.ifError(err);
      assert.equal(district.name, obj.DistrictName);
      logger.info('import district: ', district);
    });
  }

  for (let i = 0; i < commerseAreas.length; i++) {
    let obj = commerseAreas[i];
    District
      .findOne({ name: obj.districtName })
      .select('_id name')
      .exec(function(err, district) {
        assert.equal(district.name, obj.districtName);
        let query = {
          name: obj.CBDName
        };
        let update = {
          name: obj.CBDName,
          districtId: district._id
        };
        let options = {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true
        };
        CommerseArea.findOneAndUpdate(query, update, options, function(err, commerseArea) {
          assert.ifError(err);
          assert.equal(commerseArea.name, obj.CBDName);
          assert.ok(commerseArea.districtId.equals(district._id));
          logger.info('import commerse area: ', commerseArea);
        });
      });
  }
}
