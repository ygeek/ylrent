/**
 * Created by meng on 16/5/19.
 */

'use strict';

import request from 'request';

const leancloudConfig = {
  'X-LC-Id': 'jqkXh6wD9aecX74oeOVz9CtN-gzGzoHsz',
  'X-LC-Key': 'wflBBpW9pcnMkPXf5Xjuk510'
};

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
  let options = {
    method: 'POST',
    url: 'https://api.leancloud.cn/1.1/verifySmsCode/' + code,
    headers: leancloudConfig,
    qs: { mobilePhoneNumber: mobilePhone },
    json: true
  };
  request(options, (error, response, body) => {
    callback(error, body);
  });
}
