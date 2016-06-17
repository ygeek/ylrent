/**
 * Created by meng on 16/6/17.
 */

"use strict";

import qiniu from 'qiniu';

qiniu.conf.ACCESS_KEY = 'Zwzs_BXKs3FmQ4WAHnm4eKoRJPgBywNS27zY6LmC';
qiniu.conf.SECRET_KEY = 'P7V_DeQI-q1WnXucfwIr6btMIbVEc0LW-YSGdppb';
const BUCKET = 'ylrent';

export function uptoken() {
  let putPolicy = new qiniu.rs.PutPolicy(BUCKET);
  return putPolicy.token();
}
