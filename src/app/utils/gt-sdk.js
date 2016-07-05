"use strict";


import crypto from 'crypto';
import request from 'request';
let pkg = require("../../../package.json");

let apiServer = 'http://api.geetest.com';

function md5(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}

function Geetest(key, id) {
    if (!key) {
        throw new Error('Private Key Required');
    }
    if (!id) {
        throw new Error("Public Key Required");
    }
    this.privateKey = key;
    this.publicKey = id;
}

Geetest.prototype.validate = function (config, callback) {
    let hash = this.privateKey + 'geetest' + config.challenge;
    if (config.validate === md5(hash)) {
        request.post(apiServer + '/validate.php', {
            form: {
                seccode: config.seccode
            }
        }, function (err, res, body) {
            if (err) {
                callback(err);
            } else {
                callback(null, body === md5(config.seccode));
            }
        });
    } else {
        callback(null, false);
    }
};

Geetest.prototype.register = function (callback) {
    var self = this;
    var url = apiServer + '/register.php?gt=' + this.publicKey + '&sdk=Node_' + pkg.version;
    request.get(url, {timeout: 2000}, function (err, res, body) {
        if (err) {
            // failback
            callback(err);
        } else {
            callback(null, md5(body + self.privateKey));
        }
    });
};

export default Geetest;
