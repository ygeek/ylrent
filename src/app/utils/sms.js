/**
 * Created by meng on 16/5/19.
 */

'use strict';

import mongoose from 'mongoose';
import rp from 'request-promise';
import log4js from 'log4js';
import config from '../../config';

import { expires } from '../models/sms';

const logger = log4js.getLogger('normal');

const leancloudConfig = {
  'X-LC-Id': '6fPIjzunuEOvwDajBGNyTwtP-gzGzoHsz',
  'X-LC-Key': '4nQAKLMGX9g1aVQzu6cTv1G8'
};

const SMSTemplateName = '短信验证码';

const SMSCode = mongoose.model('SMSCode');

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export async function requestSMSCode(mobilePhone, req) {
  let count = await SMSCode.count({ip: req.ip}).exec();
  
  if (count >= 15) {
    throw new Error('请求次数过多');
  }
  
  let smsCode = new SMSCode();
  smsCode.mobile = mobilePhone;
  smsCode.code = getRandomInt(1000, 9999);
  smsCode.ip = req.ip;
  await smsCode.save();
  
  logger.trace(req.ip, 'request sms code', smsCode);
  
  let options = {
    method: 'POST',
    url: 'https://api.leancloud.cn/1.1/requestSmsCode',
    headers: leancloudConfig,
    json: {
      mobilePhoneNumber: mobilePhone,
      template: SMSTemplateName,
      smscode: smsCode.code,
      expired: Math.floor(expires / 60)
    }
  };
  
  let body = await rp(options);
  
  logger.trace('request sms body: ', body);

  if (body && body.code && body.code !== 0) {
    throw new Error(body.error || '发送短信失败');
  } else {
    return  {
      code: 0
    };
  }
}

export async function verifySMSCode(mobilePhone, code) {
  logger.trace('verify sms code', mobilePhone, code);
  
  let smsCode = await SMSCode.findOne({ mobile: mobilePhone, code: code }).exec();
  
  logger.trace('find sms validation: ', smsCode);
  
  let ok = false;
  if (smsCode) {
    ok = true;
  }
  
  await SMSCode.remove({ mobile: mobilePhone, code: code }).exec();
  
  return config.isDebug || ok;
}
