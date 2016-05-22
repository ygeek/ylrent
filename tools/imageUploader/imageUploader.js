/**
 * Created by meng on 16/5/22.
 */
"use strict";

var path = require('path');
var glob = require('glob');
var fs = require('fs');
var qiniu = require('qiniu');
var Converter = require("csvtojson").Converter;
var jsonfile = require('jsonfile');
var _ = require('lodash');

qiniu.conf.ACCESS_KEY = 'Zwzs_BXKs3FmQ4WAHnm4eKoRJPgBywNS27zY6LmC';
qiniu.conf.SECRET_KEY = 'P7V_DeQI-q1WnXucfwIr6btMIbVEc0LW-YSGdppb';
var bucket = 'ylrent';
var domain = 'http://o7k9opgtr.bkt.clouddn.com';

var dataPath = 'data';
var housePath = path.join(__dirname, dataPath, '房源.csv');
var dailyPath = path.join(__dirname, dataPath, '日租小区.csv');
var houseOutput = path.join(__dirname, dataPath, '房源.json');
var dailyOutput = path.join(__dirname, dataPath, '日租小区.json');


function uploadFile(localFile, callback) {
  var putPolicy = new qiniu.rs.PutPolicy(bucket);
  var uptoken = putPolicy.token();
  var extra = new qiniu.io.PutExtra();
  qiniu.io.putFileWithoutKey(uptoken, localFile, extra, function(err, ret) {
    if(!err) {
      callback(null, ret.key);
    } else {
      callback(err, ret.key);
    }
  });
}

function convertHouseData() {
  return new Promise(function(resolve, reject) {
    var convertor = new Converter({});
    convertor.fromFile(housePath, function(err, result) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        // convert folder name to imagekeys
        var allPromises = _.map(result, function(house) {
          if (!house.folderName) {
            delete house.folderName;
            house.imagekeys = [];
            return house;
          }
          // upload folder images
          console.log('upload folder: ', house.folderName);
          var pattern = path.join(__dirname, dataPath, house.folderName, "@(*.jpg|*.png)");
          var uploadPromises = _.map(glob.sync(pattern), function(file) {
            return new Promise(function(resolve, reject) {
              console.log(' - ', file);
              uploadFile(file, function(err, key) {
                if (err) {
                  console.log('upload failed: ', file);
                  resolve();
                } else {
                  console.log('upload succeed: ', file);
                  resolve(key);
                }
              });
            });
          });
          return Promise.all(uploadPromises).then(function(keys) {
            delete house.folderName;
            house.imagekeys = keys;
            console.log(house);
            return house;
          });
        });
        
        // save new house data to json
        Promise.all(allPromises).then(function(houses) {
          jsonfile.writeFile(houseOutput, houses, {spaces: 2}, function(err) {
            if (err) {
              console.log('保存房源数据失败: ', err);
              reject(err);
            } else {
              console.log('保存房源数据成功');
              resolve();
            }
          });
        });
      }
    });
  });
}


function convertDailyData() {
  return new Promise(function(resolve, reject) {
    var convertor = new Converter({});
    convertor.fromFile(dailyPath, function(err, result) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        // convert folder name to imagekeys
        var allPromises = _.map(result, function(daily) {
          if (!daily.folderName) {
            delete daily.folderName;
            daily.imagekeys = [];
            return daily;
          }
          // upload folder images
          console.log('upload folder: ', daily.folderName);
          var pattern = path.join(__dirname, dataPath, daily.folderName, "@(*.jpg|*.png)");
          var uploadPromises = _.map(glob.sync(pattern), function(file) {
            return new Promise(function(resolve, reject) {
              console.log(' - ', file);
              uploadFile(file, function(err, key) {
                if (err) {
                  console.log('upload failed: ', file);
                  resolve();
                } else {
                  console.log('upload succeed: ', file);
                  resolve(key);
                }
              });
            });
          });
          return Promise.all(uploadPromises).then(function(keys) {
            delete daily.folderName;
            daily.imagekeys = keys;
            console.log(daily);
            return daily;
          });
        });
        
        // save new house data to json
        Promise.all(allPromises).then(function(dailyRents) {
          jsonfile.writeFile(dailyOutput, dailyRents, {spaces: 2}, function(err) {
            if (err) {
              console.log('保存日租数据失败: ', err);
              reject(err);
            } else {
              console.log('保存日租数据成功');
              resolve();
            }
          });
        });
      }
    });
  });
}

convertHouseData().then(function() {
  convertDailyData();
});
