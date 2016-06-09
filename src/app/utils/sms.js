/**
 * Created by meng on 16/5/19.
 */

'use strict';

import request from 'request';
import rp from 'request-promise';
import log4js from 'log4js';

const leancloudConfig = {
  'X-LC-Id': 'QTohRgKnY7UdXzg3TRJRCJso-gzGzoHsz',
  'X-LC-Key': 'bGJxnqgPJGUKnBGwA5nbTVLr'
};

const logger = log4js.getLogger('normal');

export function requestSMSCode(mobilePhone, callback) {
  let options = {
    method: 'POST',
    url: 'https://api.leancloud.cn/1.1/requestSmsCode',
    headers: leancloudConfig,
    json: { mobilePhoneNumber: mobilePhone }
  };
  request(options, (error, response, body) => {
    callback(error, body);
  });
}


export function verifySMSCode(mobilePhone, code, callback) {
  let url = 'https://api.leancloud.cn/1.1/verifySmsCode/' + code;
  logger.info('verify sms code url: ', url);
  let options = {
    method: 'POST',
    url: url,
    headers: leancloudConfig,
    qs: { mobilePhoneNumber: mobilePhone },
    json: true
  };
  request(options, (error, response, body) => {
    logger.info('verify sms body: ', error, body);
    callback(error, body);
  });
}

export async function asyncRequestSMSCode(mobilePhone) {
  let options = {
    method: 'POST',
    url: 'https://api.leancloud.cn/1.1/requestSmsCode',
    headers: leancloudConfig,
    json: { mobilePhoneNumber: mobilePhone }
  };
  return rp(options);
}

export async function asyncVerifySMSCode(mobilePhone, code) {
  let url = 'https://api.leancloud.cn/1.1/verifySmsCode/' + code;
  logger.info('verify sms code url: ', url);
  let options = {
    method: 'POST',
    url: url,
    headers: leancloudConfig,
    qs: { mobilePhoneNumber: mobilePhone },
    json: true
  };
  return rp(options);
}
